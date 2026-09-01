import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { Redis } from "@upstash/redis";
import { resolveFarcasterUser } from "@/lib/resolve-farcaster-user";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const redis = new Redis({
  url: process.env.KV_REST_API_URL as string,
  token: process.env.KV_REST_API_TOKEN as string,
});

// Tighter than the old 20/60s — this endpoint hits Neynar on cache miss,
// so 10 requests per 60s per IP is sufficient for legitimate typing/search.
const RATE_LIMIT = 10;
const RATE_WINDOW_SECONDS = 60;

export async function GET(req: NextRequest) {
  const ip = getClientIp(req);
  const { allowed, resetSeconds } = await checkRateLimit(
    redis,
    `resolve-user:${ip}`,
    RATE_LIMIT,
    RATE_WINDOW_SECONDS
  );

  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests, please slow down." },
      { status: 429, headers: { "Retry-After": String(resetSeconds) } }
    );
  }

  const result = await resolveFarcasterUser({
    username: req.nextUrl.searchParams.get("username"),
    fid: req.nextUrl.searchParams.get("fid"),
    redis,
  });

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json(result);
}
