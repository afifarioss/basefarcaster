import { Redis } from "@upstash/redis";

export async function checkRateLimit(
  redis: Redis,
  key: string,
  limit: number,
  windowSeconds: number
): Promise<{ allowed: boolean; remaining: number; resetSeconds: number }> {
  const bucket = Math.floor(Date.now() / 1000 / windowSeconds);
  const bucketKey = `ratelimit:${key}:${bucket}`;

  const count = await redis.incr(bucketKey);
  if (count === 1) {
    await redis.expire(bucketKey, windowSeconds);
  }

  return {
    allowed: count <= limit,
    remaining: Math.max(0, limit - count),
    resetSeconds: windowSeconds,
  };
}

export function getClientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();

  const real = req.headers.get("x-real-ip");
  if (real) return real;

  return "unknown";
}
