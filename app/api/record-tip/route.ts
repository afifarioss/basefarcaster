import { Redis } from "@upstash/redis";
import { isAddress } from "viem";

const redis = new Redis({
  url: process.env.KV_REST_API_URL as string,
  token: process.env.KV_REST_API_TOKEN as string,
});

// Sanity ceiling — not a business rule, just a guard against obviously
// fabricated/junk values reaching the public leaderboard.
const MAX_REASONABLE_USDC = 1_000_000;

export async function POST(req: Request) {
  try {
    const { from, to, amountUsdc, callsId } = await req.json();

    if (
      typeof from !== "string" ||
      typeof to !== "string" ||
      !isAddress(from) ||
      !isAddress(to) ||
      typeof amountUsdc !== "number" ||
      !Number.isFinite(amountUsdc) ||
      amountUsdc <= 0 ||
      amountUsdc > MAX_REASONABLE_USDC ||
      typeof callsId !== "string" ||
      callsId.length === 0
    ) {
      return Response.json({ ok: false }, { status: 400 });
    }

    // Idempotency guard: callsId is unique per sendCalls invocation and is
    // available synchronously in onSuccess, before the real tx hash resolves.
    // Prevents double-crediting the leaderboard on retry/duplicate POSTs.
    const isNew = await redis.set(`tip:seen:${callsId}`, "1", {
      nx: true,
      ex: 86400,
    });

    if (!isNew) {
      console.warn("record-tip: duplicate callsId ignored", callsId);
      return Response.json({ ok: true, duplicate: true });
    }

    const fromKey = from.toLowerCase();
    const toKey = to.toLowerCase();

    // Sorted sets: member = address, score = cumulative USDC volume.
    await Promise.all([
      redis.zincrby("leaderboard:senders", amountUsdc, fromKey),
      redis.zincrby("leaderboard:recipients", amountUsdc, toKey),
    ]);

    return Response.json({ ok: true });
  } catch (err) {
    console.error("record-tip error:", err);
    // Best-effort — never block or surface this to the tipper.
    return Response.json({ ok: false }, { status: 200 });
  }
}
