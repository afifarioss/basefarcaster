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
  PLATFORM_FEE_BPS,
  FEE_DENOMINATOR,
  ZAP_TOKEN_ADDRESS,
  ZAP_HOLDER_THRESHOLD,
  ERC20_ABI,
} from "@/lib/constants";
import { splitTipAmount } from "@/lib/utils";

export const dynamic = "force-dynamic";

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

/**
 * Server-side verification that the sender actually qualifies for the
 * 0% $ZAP holder fee. Reads the sender's $ZAP token balance from the
 * block the tip tx was mined in (using the tx receipt's blockNumber),
 * so the check reflects the onchain state at the time of tipping.
 *
 * Returns true if the sender holds >= ZAP_HOLDER_THRESHOLD $ZAP.
 * Returns false otherwise — the server will then require the 2% fee
 * transfer to be present in the tx logs.
 */
async function verifyZapHolderStatus(
  sender: `0x${string}`,
  blockNumber: bigint
): Promise<boolean> {
  try {
    const balance = await client.readContract({
      address: ZAP_TOKEN_ADDRESS,
      abi: ERC20_ABI,
      functionName: "balanceOf",
      args: [sender],
      blockNumber,
    });
    const threshold =
      BigInt(ZAP_HOLDER_THRESHOLD) * BigInt(10) ** BigInt(18);
    return (balance as bigint) >= threshold;
  } catch (err) {
    console.warn(
      "record-tip-history: $ZAP balance check failed, defaulting to 2% fee verification",
      err
    );
    return false;
  }
}

export async function POST(req: Request) {
  try {
    const { from, to, amountUsdc, txHash, tokenSymbol, feeBps } =
      await req.json();

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

    // Server-side $ZAP eligibility check.
    // The client claims feeBps=0, but we don't trust it — we verify
    // the sender's actual $ZAP balance at the tx block. If they don't
    // hold 100+ $ZAP, we fall back to requiring the full 2% fee.
    const clientClaimsZeroFee =
      typeof feeBps === "number" && feeBps === 0;

    let effectiveFeeBps: number;

    if (clientClaimsZeroFee) {
      const isVerifiedZapHolder = await verifyZapHolderStatus(
        from as `0x${string}`,
        receipt.blockNumber
      );
      effectiveFeeBps = isVerifiedZapHolder ? 0 : PLATFORM_FEE_BPS;
    } else {
      effectiveFeeBps =
        typeof feeBps === "number" && feeBps >= 0 && feeBps <= PLATFORM_FEE_BPS
          ? feeBps
          : PLATFORM_FEE_BPS;
    }

    // Compute expected amounts using the effective fee rate.
    // For $ZAP holders (feeBps=0): recipientAmount = total, fee = 0
    // For normal users (feeBps=200): recipientAmount = total - 2%, fee = 2%
    const { recipientAmount, fee } = splitTipAmount(
      amountUsdc,
      tokenConfig.decimals,
      effectiveFeeBps
    );

    // Match the creator transfer — this is the primary tip identification.
    // Both 2% and 0% tips must have this transfer to the recipient.
    let recipientMatched = false;
    let feeMatched = effectiveFeeBps === 0; // 0% tips don't need fee match

    for (const log of receipt.logs) {
      if (
        log.address.toLowerCase() !== tokenConfig.address.toLowerCase()
      )
        continue;
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
          recipientMatched = true;
        }

        // For 2% tips, also verify the fee transfer exists
        if (
          effectiveFeeBps > 0 &&
          fee > BigInt(0) &&
          dFrom.toLowerCase() === from.toLowerCase() &&
          dTo.toLowerCase() ===
            (process.env.NEXT_PUBLIC_FEE_WALLET ?? "").toLowerCase() &&
          dValue === fee
        ) {
          feeMatched = true;
        }
      } catch {
        continue;
      }
    }

    if (!recipientMatched || !feeMatched) {
      return Response.json(
        {
          ok: false,
          error: `tip verification failed: recipient=${recipientMatched}, fee=${feeMatched}`,
        },
        { status: 400 }
      );
    }

    // Idempotency — only after full verification
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
      feeBps: effectiveFeeBps,
    });

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
    return Response.json({ ok: false }, { status: 200 });
  }
}
