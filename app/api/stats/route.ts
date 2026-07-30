import { createPublicClient, http, parseAbiItem, formatUnits } from "viem";
import { base } from "viem/chains";
import {
  USDC_ADDRESS,
  USDC_DECIMALS,
  PLATFORM_FEE_WALLET,
  PLATFORM_FEE_BPS,
  FEE_DENOMINATOR,
} from "@[/lib](https://farcaster.xyz/~/channel/lib)/constants";

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
  transport: http(),
});

// Keep this small for public RPC reliability.
// 5,000 Base blocks is roughly 2.5–3 hours.
const LOOKBACK_BLOCKS = BigInt(5_000);
const WINDOW_HOURS = 3;

export async function GET() {
  try {
    const latest = await client.getBlockNumber();

    const fromBlock =
      latest > LOOKBACK_BLOCKS ? latest - LOOKBACK_BLOCKS : BigInt(0);

    const logs = await client.getLogs({
      address: USDC_ADDRESS,
      event: parseAbiItem(
        "event Transfer(address indexed from, address indexed to, uint256 value)"
      ),
      args: {
        to: PLATFORM_FEE_WALLET,
      },
      fromBlock,
      toBlock: latest,
    });

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

    // total tip volume = fee received / fee percentage
    // Example: 5% fee means total = fee * 10000 / 500
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
