import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { resolveBasename } from "@/lib/basename";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const redis = new Redis({
  url: process.env.KV_REST_API_URL as string,
  token: process.env.KV_REST_API_TOKEN as string,
});

const RATE_LIMIT = 10;
const RATE_WINDOW_SECONDS = 60;
const MAX_NAME_LEN = 80;

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const ip = getClientIp(req);
  const { allowed, resetSeconds } = await checkRateLimit(
    redis,
    `basename:${ip}`,
    RATE_LIMIT,
    RATE_WINDOW_SECONDS
  );
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests, please slow down." },
      { status: 429, headers: { "Retry-After": String(resetSeconds) } }
    );
  }

  const name = req.nextUrl.searchParams.get("name");

  if (!name) {
    return NextResponse.json(
      { ok: false, error: "Missing name" },
      { status: 400 }
    );
  }

  const normalized = name
    .trim()
    .replace(/^@/, "")
    .toLowerCase()
    .slice(0, MAX_NAME_LEN);

  if (!normalized.endsWith(".base.eth")) {
    return NextResponse.json(
      { ok: false, error: "Not a Basename" },
      { status: 400 }
    );
  }

  // Check Redis cache
  const cacheKey = `basename:${normalized}`;
  try {
    const cached = await redis.get<string>(cacheKey);
    if (cached === "__NOT_FOUND__") {
      return NextResponse.json(
        { ok: false, error: "Basename could not be resolved", name: normalized },
        { status: 404 }
      );
    }
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed && parsed.address) {
        return NextResponse.json({ ok: true, ...parsed });
      }
    }
  } catch {}

  const result = await resolveBasename(normalized);

  if (!result) {
    await redis.set(cacheKey, "__NOT_FOUND__", { ex: 120 });
    return NextResponse.json(
      { ok: false, error: "Basename could not be resolved", name: normalized },
      { status: 404 }
    );
  }

  await redis.set(cacheKey, JSON.stringify(result), { ex: 300 });

  return NextResponse.json({ ok: true, ...result });
}
