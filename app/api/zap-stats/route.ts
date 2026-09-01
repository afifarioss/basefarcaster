import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const runtime = "edge";
export const dynamic = "force-dynamic";

const redis = new Redis({
  url: process.env.KV_REST_API_URL as string,
  token: process.env.KV_REST_API_TOKEN as string,
});

const RATE_LIMIT = 10;
const RATE_WINDOW_SECONDS = 60;

const ZAP_TOKEN_ADDRESS = "0x8C1ca2c32CD197a27CA049aA0427f64192aD3ba3";

export async function GET(req: Request) {
  const ip = getClientIp(req);
  const { allowed, resetSeconds } = await checkRateLimit(
    redis,
    `zap-stats:${ip}`,
    RATE_LIMIT,
    RATE_WINDOW_SECONDS
  );

  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests, please slow down." },
      { status: 429, headers: { "Retry-After": String(resetSeconds) } }
    );
  }

  try {
    const res = await fetch(
      `https://api.dexscreener.com/latest/dex/tokens/${ZAP_TOKEN_ADDRESS}`,
      { next: { revalidate: 30 } }
    );
    if (!res.ok) {
      return Response.json({ available: false });
    }
    const data = await res.json();
    const pair = data?.pairs?.[0];
    if (!pair) {
      return Response.json({ available: false });
    }
    return Response.json({
      available: true,
      priceUsd: pair.priceUsd,
      marketCap: pair.fdv ?? pair.marketCap,
      priceChange1h: pair.priceChange?.h1,
    });
  } catch {
    return Response.json({ available: false });
  }
}
