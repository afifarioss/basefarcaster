import { Redis } from "@upstash/redis";
import {
  isAddress,
  createPublicClient,
  http,
  decodeEventLog,
  parseAbiItem,
} from "viem";
import { base } from "viem/chains";
import {
  DIEM_ADDRESS,
  DIEM_DECIMALS,
  USDC_ADDRESS,
  USDC_DECIMALS,
} from "@/lib/constants";
import { splitTipAmount } from "@/lib/utils";

const redis = new Redis({
  url: process.env.KV_REST_API_URL as string,
  token: process.env.KV_REST_API_TOKEN as string,
});

const client = createPublicClient({
  chain: base,
  transport: http(process.env.BASE_RPC_URL || undefined),
});

const MAX_REASONABLE_USDC = 1_000_000;
const TX_HASH_RE = /^0x[a-fA-F0-9]{64}$/;

const TRANSFER_EVENT = parseAbiItem(
  "event Transfer(address indexed from, address indexed to, uint256 value)"
);

export async function POST(req: Request) {
  try {
    const { from, to, amountUsdc, txHash, tokenSymbol } = await req.json();

    if (
      typeof from !== "string" ||
      typeof to !== "string" ||
      !isAddress(from) ||
      !isAddress(to) ||
      typeof amountUsdc !== "number" ||
      !Number.isFinite(amountUsdc) ||
      amountUsdc <= 0 ||
      amountUsdc > MAX_REASONABLE_USDC ||
      typeof txHash !== "string" ||
      !TX_HASH_RE.test(txHash)
    ) {
      return Response.json({ ok: false }, { status: 400 });
    }

    const selectedToken = tokenSymbol ?? "USDC";

    // History verification supports USDC and optional DIEM.
    // VVV remains outside this verification path for now.
    const tokenConfig =
      selectedToken === "USDC"
        ? { address: USDC_ADDRESS, decimals: USDC_DECIMALS }
        : selectedToken === "DIEM"
          ? { address: DIEM_ADDRESS, decimals: DIEM_DECIMALS }
          : null;

    if (!tokenConfig) {
      return Response.json(
        { ok: false, error: "unsupported token for verification" },
        { status: 400 }
      );
    }

    let receipt;
    try {
      receipt = await client.getTransactionReceipt({
        hash: txHash as `0x${string}`,
      });
    } catch (err) {
      console.warn("record-tip-history: receipt not found", txHash, err);
      return Response.json(
        { ok: false, error: "transaction not found" },
        { status: 400 }
      );
    }

    if (receipt.status !== "success") {
      return Response.json(
        { ok: false, error: "transaction did not succeed" },
        { status: 400 }
      );
    }

    if (receipt.from.toLowerCase() !== from.toLowerCase()) {
      return Response.json(
        { ok: false, error: "sender does not match transaction" },
        { status: 400 }
      );
    }

    // TipCard sends the full tip amount as two ERC20 transfers.
    // Use the selected token's own decimals so DIEM is handled as 18 decimals.
    const { recipientAmount } = splitTipAmount(
      amountUsdc,
      tokenConfig.decimals
    );

    let matched = false;
    for (const log of receipt.logs) {
      if (log.address.toLowerCase() !== tokenConfig.address.toLowerCase()) continue;
      try {
        const decoded = decodeEventLog({
          abi: [TRANSFER_EVENT],
          data: log.data,
          topics: log.topics,
        });
        const dFrom = decoded.args.from as `0x${string}`;
        const dTo = decoded.args.to as `0x${string}`;
        const dValue = decoded.args.value as bigint;

        if (
          dFrom.toLowerCase() === from.toLowerCase() &&
          dTo.toLowerCase() === to.toLowerCase() &&
          dValue === recipientAmount
        ) {
          matched = true;
          break;
        }
      } catch {
        continue;
      }
    }

    if (!matched) {
      return Response.json(
        {
          ok: false,
          error: `no matching ${selectedToken} transfer found in transaction`,
        },
        { status: 400 }
      );
    }

    // Idempotency is recorded only after the transaction has been fully
    // verified. An invalid first attempt must not poison a later valid retry.
    const isNewTx = await redis.set(`tiphistory:seen:${txHash}`, "1", {
      nx: true,
      ex: 86400,
    });

    if (!isNewTx) {
      console.warn("record-tip-history: duplicate txHash ignored", txHash);
      return Response.json({ ok: true, duplicate: true });
    }

    const fromKey = from.toLowerCase();
    const toKey = to.toLowerCase();
    const timestamp = Date.now();
    const record = JSON.stringify({
      from: fromKey,
      to: toKey,
      amountUsdc,
      txHash,
      tokenSymbol: tokenSymbol ?? "USDC",
      timestamp,
    });

    // Sorted set, scored by timestamp — newest-first pagination via zrange rev.
    // txHash inside the JSON member keeps every entry unique.
    //
    // Leaderboard credit (USDC only, matching current scope) happens here
    // because this is the only point with an onchain-verified amount —
    // /api/record-tip fired before a real tx hash existed and is now
    // deprecated to prevent double-crediting.
    const writes: Promise<unknown>[] = [
      redis.zadd("tips:history", { score: timestamp, member: record }),
    ];
    if (selectedToken === "USDC") {
      writes.push(
        redis.zincrby("leaderboard:senders", amountUsdc, fromKey),
        redis.zincrby("leaderboard:recipients", amountUsdc, toKey)
      );
    }
    await Promise.all(writes);

    return Response.json({ ok: true });
  } catch (err) {
    console.error("record-tip-history error:", err);
    // Best-effort — never block or surface this to the tipper.
    return Response.json({ ok: false }, { status: 200 });
  }
}
