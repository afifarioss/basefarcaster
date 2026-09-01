import { createPublicClient, http, parseAbiItem, formatUnits } from "viem";
import { base } from "viem/chains";
import {
  USDC_ADDRESS,
  USDC_DECIMALS,
  PLATFORM_FEE_WALLET,
  PLATFORM_FEE_BPS,
  FEE_DENOMINATOR,
} from "../../../lib/constants";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.KV_REST_API_URL as string,
  token: process.env.KV_REST_API_TOKEN as string,
});

const RATE_LIMIT = 10;
const RATE_WINDOW_SECONDS = 60;

/**
 * Real social-proof data derived from Base onchain logs.
 *
 * Each BaseZap tip sends a platform-fee USDC transfer to PLATFORM_FEE_WALLET.
 * We count those fee-leg transfers, then reconstruct total tip volume from
 * the fee percentage.
 *
 * Note: this counts tips and supporters. It does NOT reliably count unique
 * creators, because the fee transfer alone only tells us the sender and fee
 * wallet, not the creator recipient.
 */

export const revalidate = 30;

const client = createPublicClient({
  chain: base,
  transport: http(process.env.BASE_RPC_URL || undefined),
});

// Base produces a block roughly every 2 seconds, so ~43,200 blocks ≈ 24h.
const LOOKBACK_BLOCKS = BigInt(43_200);
const WINDOW_HOURS = 24;

export async function GET(req: Request) {
  const ip = getClientIp(req);
  const { allowed, resetSeconds } = await checkRateLimit(
    redis,
    `stats:${ip}`,
    RATE_LIMIT,
    RATE_WINDOW_SECONDS
  );
  if (!allowed) {
    return Response.json(
      { error: "Too many requests, please slow down." },
      { status: 429, headers: { "Retry-After": String(resetSeconds) } }
    );
  }

  try {
    const latest = await client.getBlockNumber();

    const fromBlock =
      latest > LOOKBACK_BLOCKS ? latest - LOOKBACK_BLOCKS : BigInt(0);

    const TRANSFER_EVENT = parseAbiItem(
      "event Transfer(address indexed from, address indexed to, uint256 value)"
    );

    // Base RPC providers commonly cap eth_getLogs at 10,000 blocks.
    // Query the 24h window in safe chunks instead of requesting 43,200 blocks at once.
    const MAX_LOG_BLOCK_RANGE = BigInt(9_000);
    const logs = [];

    for (
      let chunkFrom = fromBlock;
      chunkFrom <= latest;
      chunkFrom += MAX_LOG_BLOCK_RANGE + BigInt(1)
    ) {
      const chunkTo =
        chunkFrom + MAX_LOG_BLOCK_RANGE > latest
          ? latest
          : chunkFrom + MAX_LOG_BLOCK_RANGE;

      const chunkLogs = await client.getLogs({
        address: USDC_ADDRESS,
        event: TRANSFER_EVENT,
        args: {
          to: PLATFORM_FEE_WALLET,
        },
        fromBlock: chunkFrom,
        toBlock: chunkTo,
      });

      logs.push(...chunkLogs);
    }

    const tipCount = logs.length;

    const supporters = new Set(
      logs
        .map((log) => log.args.from?.toLowerCase())
        .filter(Boolean)
    );

    const totalFeeUnits = logs.reduce(
      (sum, log) => sum + (log.args.value ?? BigInt(0)),
      BigInt(0)
    );

    const totalVolumeUnits =
      (totalFeeUnits * BigInt(FEE_DENOMINATOR)) /
      BigInt(PLATFORM_FEE_BPS);

    return Response.json({
      tipCount,
      totalVolumeUsdc: Number(formatUnits(totalVolumeUnits, USDC_DECIMALS)),
      supporterCount: supporters.size,
      windowHours: WINDOW_HOURS,
    });
  } catch (err) {
    console.error("Stats API error:", err);

    return Response.json(
      {
        tipCount: 0,
        totalVolumeUsdc: 0,
        supporterCount: 0,
        windowHours: WINDOW_HOURS,
        error: true,
      },
      { status: 200 }
    );
  }
}
