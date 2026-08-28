import { Redis } from "@upstash/redis";
import {
  isAddress,
  createPublicClient,
  http,
  decodeEventLog,
  parseAbiItem,
} from "viem";
import { base } from "viem/chains";
import { USDC_ADDRESS, USDC_DECIMALS } from "@/lib/constants";
import { splitTipAmount } from "@/lib/utils";

const redis = new Redis({
  url: process.env.KV_REST_API_URL as string,
  token: process.env.KV_REST_API_TOKEN as string,
});

const client = createPublicClient({
  chain: base,
  transport: http(),
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

    // On-chain verification currently only covers USDC — the only token
    // this route is actually called for from the client (see TipCard).
    if ((tokenSymbol ?? "USDC") !== "USDC") {
      return Response.json(
        { ok: false, error: "unsupported token for verification" },
        { status: 400 }
      );
    }

    // Idempotency guard keyed on the real tx hash — prevents replaying the
    // same valid transaction to inflate history with duplicate entries.
    const isNewTx = await redis.set(`tiphistory:seen:${txHash}`, "1", {
      nx: true,
      ex: 86400,
    });
    if (!isNewTx) {
      console.warn("record-tip-history: duplicate txHash ignored", txHash);
      return Response.json({ ok: true, duplicate: true });
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

    // The onchain recipient leg is amountUsdc minus the platform fee —
    // TipCard sends the full tip amount as two separate ERC20 transfers.
    const { recipientAmount } = splitTipAmount(amountUsdc, USDC_DECIMALS);

    let matched = false;
    for (const log of receipt.logs) {
      if (log.address.toLowerCase() !== USDC_ADDRESS.toLowerCase()) continue;
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
        { ok: false, error: "no matching USDC transfer found in transaction" },
        { status: 400 }
      );
    }

    const timestamp = Date.now();
    const record = JSON.stringify({
      from: from.toLowerCase(),
      to: to.toLowerCase(),
      amountUsdc,
      txHash,
      tokenSymbol: tokenSymbol ?? "USDC",
      timestamp,
    });

    // Sorted set, scored by timestamp — newest-first pagination via zrange rev.
    // txHash inside the JSON member keeps every entry unique.
    await redis.zadd("tips:history", { score: timestamp, member: record });

    return Response.json({ ok: true });
  } catch (err) {
    console.error("record-tip-history error:", err);
    // Best-effort — never block or surface this to the tipper.
    return Response.json({ ok: false }, { status: 200 });
  }
}
