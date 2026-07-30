import { createPublicClient, http, parseAbiItem, formatUnits } from "viem";
import { base } from "viem/chains";
import {
  USDC_ADDRESS,
  USDC_DECIMALS,
  PLATFORM_FEE_WALLET,
  PLATFORM_FEE_BPS,
  FEE_DENOMINATOR,
} from "@/lib/constants";

/**
 * Real social-proof data, derived honestly from the chain: every tip sends
 * a fee-leg transfer to PLATFORM_FEE_WALLET, so counting those transfers
 * (and backing out the fee % to reconstruct total tip volume) gives an
 * accurate recent-activity count with zero fabricated numbers.
 *
 * This intentionally covers a recent block window, not all-time history —
 * a single eth_getLogs call against a public RPC has range limits. A
 * production deployment with meaningful volume should back this with a
 * proper indexer for full historical totals.
 */

export const revalidate = 30; // cache for 30s at the edge

const client = createPublicClient({ chain: base, transport: http() });

const LOOKBACK_BLOCKS = BigInt(5_000); // ~1 day on Base at ~2s blocks

export async function GET() {
  try {
    const latest = await client.getBlockNumber();
    const fromBlock = latest > LOOKBACK_BLOCKS ? latest - LOOKBACK_BLOCKS : BigInt(0);

    const logs = await client.getLogs({
      address: USDC_ADDRESS,
      event: parseAbiItem(
        "event Transfer(address indexed from, address indexed to, uint256 value)"
      ),
      args: { to: PLATFORM_FEE_WALLET },
      fromBlock,
      toBlock: latest,
    });

    const tipCount = logs.length;
    const totalFeeUnits = logs.reduce(
      (sum, log) => sum + (log.args.value ?? BigInt(0)),
      BigInt(0)
    );
    // total = fee / (bps / denominator)
    const totalVolumeUnits =
      (totalFeeUnits * BigInt(FEE_DENOMINATOR)) / BigInt(PLATFORM_FEE_BPS);

    return Response.json({
      tipCount,
      totalVolumeUsdc: Number(formatUnits(totalVolumeUnits, USDC_DECIMALS)),
      windowHours: 3,
    });
  } catch (err) {
    // Fail quiet — social proof is a nice-to-have, never block the page.
    return Response.json(
      { tipCount: 0, totalVolumeUsdc: 0, windowHours: 3, error: true },
      { status: 200 }
    );
  }
}
