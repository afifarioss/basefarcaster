import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.KV_REST_API_URL as string,
  token: process.env.KV_REST_API_TOKEN as string,
});

export async function POST(req: Request) {
  try {
    const { from, to, amountUsdc } = await req.json();

    if (
      typeof from !== "string" ||
      typeof to !== "string" ||
      typeof amountUsdc !== "number" ||
      amountUsdc <= 0
    ) {
      return Response.json({ ok: false }, { status: 400 });
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
