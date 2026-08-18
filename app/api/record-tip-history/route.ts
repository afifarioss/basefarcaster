import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.KV_REST_API_URL as string,
  token: process.env.KV_REST_API_TOKEN as string,
});

export async function POST(req: Request) {
  try {
    const { from, to, amountUsdc, txHash, tokenSymbol } = await req.json();

    if (
      typeof from !== "string" ||
      typeof to !== "string" ||
      typeof amountUsdc !== "number" ||
      amountUsdc <= 0 ||
      typeof txHash !== "string"
    ) {
      return Response.json({ ok: false }, { status: 400 });
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
