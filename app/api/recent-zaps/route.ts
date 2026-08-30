import { createPublicClient, http, parseAbiItem, formatUnits, decodeEventLog } from "viem";
import { base } from "viem/chains";
import {
  USDC_ADDRESS,
  USDC_DECIMALS,
  PLATFORM_FEE_WALLET,
  PLATFORM_FEE_BPS,
  FEE_DENOMINATOR,
} from "../../../lib/constants";

export const revalidate = 30;

const client = createPublicClient({
  chain: base,
  transport: http(process.env.BASE_RPC_URL || undefined),
});

const LOOKBACK_BLOCKS = BigInt(5_000);
const MAX_ZAPS = 12;

const TRANSFER_EVENT = parseAbiItem(
  "event Transfer(address indexed from, address indexed to, uint256 value)"
);

type RawZap = {
  from: `0x${string}`;
  to: `0x${string}`;
  amountUsdc: number;
  txHash: `0x${string}`;
  blockNumber: bigint;
};

export async function GET() {
  try {
    const latest = await client.getBlockNumber();
    const fromBlock =
      latest > LOOKBACK_BLOCKS ? latest - LOOKBACK_BLOCKS : BigInt(0);

    const feeLogs = await client.getLogs({
      address: USDC_ADDRESS,
      event: TRANSFER_EVENT,
      args: { to: PLATFORM_FEE_WALLET },
      fromBlock,
      toBlock: latest,
    });

    // Newest first, capped — this is a feed, not a full history.
    const recentFeeLogs = [...feeLogs].reverse().slice(0, MAX_ZAPS);

    const rawZaps: RawZap[] = [];

    for (const feeLog of recentFeeLogs) {
      const tipper = feeLog.args.from;
      const feeAmount = feeLog.args.value ?? BigInt(0);
      if (!tipper || !feeLog.transactionHash) continue;

      // Find the sibling recipient-leg transfer batched in the same tx.
      const receipt = await client.getTransactionReceipt({
        hash: feeLog.transactionHash,
      });

      let recipientLeg: { to: `0x${string}`; value: bigint } | null = null;

      for (const rl of receipt.logs) {
        if (rl.address.toLowerCase() !== USDC_ADDRESS.toLowerCase()) continue;
        try {
          const decoded = decodeEventLog({
            abi: [TRANSFER_EVENT],
            data: rl.data,
            topics: rl.topics,
          });
          const dFrom = decoded.args.from as `0x${string}` | undefined;
          const dTo = decoded.args.to as `0x${string}` | undefined;
          if (
            dFrom?.toLowerCase() === tipper.toLowerCase() &&
            dTo?.toLowerCase() !== PLATFORM_FEE_WALLET.toLowerCase()
          ) {
            recipientLeg = { to: dTo as `0x${string}`, value: decoded.args.value as bigint };
            break;
          }
        } catch {
          continue;
        }
      }

      // No sibling leg found (e.g. wallet didn't batch) — skip rather than
      // show a half-correlated or fake-looking entry.
      if (!recipientLeg) continue;

      const totalVolumeUnits =
        (feeAmount * BigInt(FEE_DENOMINATOR)) / BigInt(PLATFORM_FEE_BPS);

      rawZaps.push({
        from: tipper,
        to: recipientLeg.to,
        amountUsdc: Number(formatUnits(totalVolumeUnits, USDC_DECIMALS)),
        txHash: feeLog.transactionHash,
        blockNumber: feeLog.blockNumber ?? BigInt(0),
      });
    }

    // Resolve block timestamps, deduped by block number.
    const blockTimestamps = new Map<string, number>();
    for (const z of rawZaps) {
      const key = z.blockNumber.toString();
      if (!blockTimestamps.has(key)) {
        const block = await client.getBlock({ blockNumber: z.blockNumber });
        blockTimestamps.set(key, Number(block.timestamp));
      }
    }

    // Batch-resolve Farcaster identities for every address involved —
    // one Neynar call for the whole feed, not one per address.
    const addresses = Array.from(
      new Set(rawZaps.flatMap((z) => [z.from.toLowerCase(), z.to.toLowerCase()]))
    );

    const identities = new Map<
      string,
      { username: string; displayName: string; pfpUrl: string }
    >();

    const apiKey = process.env.NEYNAR_API_KEY;

    if (apiKey && addresses.length > 0) {
      try {
        const res = await fetch(
          `https://api.neynar.com/v2/farcaster/user/bulk-by-address?addresses=${addresses.join(
            ","
          )}`,
          {
            headers: {
              accept: "application/json",
              "x-api-key": apiKey,
            },
            next: { revalidate: 60 },
          }
        );

        if (res.ok) {
          const data = await res.json();
          for (const addr of addresses) {
            const match = data?.[addr]?.[0];
            if (match) {
              identities.set(addr, {
                username: match.username,
                displayName: match.display_name,
                pfpUrl: match.pfp_url,
              });
            }
          }
        }
      } catch {
        // Identity resolution is best-effort — falls back to raw address below.
      }
    }

    const zaps = rawZaps.map((z) => ({
      txHash: z.txHash,
      amountUsdc: z.amountUsdc,
      timestamp: blockTimestamps.get(z.blockNumber.toString()) ?? null,
      from: {
        address: z.from,
        ...(identities.get(z.from.toLowerCase()) ?? {}),
      },
      to: {
        address: z.to,
        ...(identities.get(z.to.toLowerCase()) ?? {}),
      },
    }));

    return Response.json({ zaps });
  } catch (err) {
    console.error("Recent zaps API error:", err);
    return Response.json({ zaps: [], error: true }, { status: 200 });
  }
}
