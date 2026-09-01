export const dynamic = "force-dynamic";

import { NextRequest } from "next/server";
import { Redis } from "@upstash/redis";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const redis = new Redis({
  url: process.env.KV_REST_API_URL as string,
  token: process.env.KV_REST_API_TOKEN as string,
});

export const revalidate = 30;

const PAGE_SIZE = 15;
const MAX_PAGE = 50;

const RATE_LIMIT = 15;
const RATE_WINDOW_SECONDS = 60;

type TipRecord = {
  from: string;
  to: string;
  amountUsdc: number;
  txHash: string;
  tokenSymbol: string;
  timestamp: number;
};

type FarcasterIdentity = {
  fid: number;
  username: string;
  displayName: string;
  pfpUrl: string;
};

function parseTipRecord(value: unknown): TipRecord | null {
  let parsed: unknown = value;

  if (typeof value === "string") {
    try {
      parsed = JSON.parse(value);
    } catch {
      return null;
    }
  }

  if (!parsed || typeof parsed !== "object") return null;

  const record = parsed as Record<string, unknown>;

  const from = typeof record.from === "string" ? record.from : "";
  const to = typeof record.to === "string" ? record.to : "";
  const txHash = typeof record.txHash === "string" ? record.txHash : "";

  const amountUsdc = Number(record.amountUsdc);
  const timestamp = Number(record.timestamp);

  const tokenSymbol =
    typeof record.tokenSymbol === "string" && record.tokenSymbol
      ? record.tokenSymbol
      : "USDC";

  if (
    !from ||
    !to ||
    !txHash ||
    !Number.isFinite(amountUsdc) ||
    !Number.isFinite(timestamp)
  ) {
    return null;
  }

  return {
    from,
    to,
    amountUsdc,
    txHash,
    tokenSymbol,
    timestamp,
  };
}

export async function GET(req: NextRequest) {
  const ip = getClientIp(req);
  const { allowed, resetSeconds } = await checkRateLimit(
    redis,
    `tip-history:${ip}`,
    RATE_LIMIT,
    RATE_WINDOW_SECONDS
  );
  if (!allowed) {
    return Response.json(
      { error: "Too many requests, please slow down." },
      { status: 429, headers: { "Retry-After": String(resetSeconds) } }
    );
  }

  try {
    const { searchParams } = new URL(req.url);

    const page = Math.min(
      MAX_PAGE,
      Math.max(0, parseInt(searchParams.get("page") ?? "0", 10) || 0)
    );

    const start = page * PAGE_SIZE;
    const end = start + PAGE_SIZE - 1;

    const [rawMembers, total] = await Promise.all([
      redis.zrange("tips:history", start, end, { rev: true }),
      redis.zcard("tips:history"),
    ]);

    const tips: TipRecord[] = (rawMembers as unknown[])
      .map(parseTipRecord)
      .filter((t): t is TipRecord => t !== null);

    const addresses = Array.from(
      new Set(
        tips
          .flatMap((t) => [t.from, t.to])
          .map((address) => address.toLowerCase())
      )
    );

    const identities = await resolveIdentitiesCached(addresses);

    const withIdentity = tips.map((t) => {
      const fromIdentity = identities.get(t.from.toLowerCase());
      const toIdentity = identities.get(t.to.toLowerCase());

      return {
        txHash: t.txHash,
        amountUsdc: t.amountUsdc,
        tokenSymbol: t.tokenSymbol,
        timestamp: t.timestamp,

        from: {
          address: t.from,
          ...(fromIdentity ?? {}),
        },

        to: {
          address: t.to,
          ...(toIdentity ?? {}),
        },
      };
    });

    return Response.json({
      success: true,
      tips: withIdentity,
      page,
      pageSize: PAGE_SIZE,
      total,
      hasMore: end + 1 < total,
    });
  } catch (err) {
    console.error("Tip history API error:", err);

    return Response.json(
      {
        success: false,
        tips: [],
        page: 0,
        pageSize: PAGE_SIZE,
        total: 0,
        hasMore: false,
        error: true,
      },
      { status: 200 }
    );
  }
}

async function resolveIdentitiesCached(
  addresses: string[]
): Promise<Map<string, FarcasterIdentity>> {
  const identities = new Map<string, FarcasterIdentity>();
  const apiKey = process.env.NEYNAR_API_KEY;
  if (!apiKey || addresses.length === 0) return identities;

  const uncached: string[] = [];
  for (const addr of addresses) {
    const cacheKey = `neynar:addr:${addr}`;
    try {
      const cached = await redis.get<string>(cacheKey);
      if (cached === "__NO_USER__") continue;
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.username) {
          identities.set(addr, parsed);
          continue;
        }
      }
    } catch {}
    uncached.push(addr);
  }

  if (uncached.length === 0) return identities;

  try {
    const url = new URL(
      "https://api.neynar.com/v2/farcaster/user/bulk-by-address"
    );
    url.searchParams.set("addresses", uncached.join(","));

    const res = await fetch(url, {
      headers: { accept: "application/json", "x-api-key": apiKey },
      next: { revalidate: 60 },
    });

    if (res.ok) {
      const data = (await res.json()) as Record<string, unknown>;

      for (const addr of uncached) {
        const users = data?.[addr];
        const match = Array.isArray(users) ? users[0] : undefined;

        if (match && typeof match === "object") {
          const profile = match as {
            fid?: number;
            username?: string;
            display_name?: string;
            pfp_url?: string;
          };

          if (typeof profile.fid === "number" && profile.username) {
            const identity: FarcasterIdentity = {
              fid: profile.fid,
              username: profile.username,
              displayName: profile.display_name ?? profile.username,
              pfpUrl: profile.pfp_url ?? "",
            };
            identities.set(addr, identity);
            await redis.set(`neynar:addr:${addr}`, JSON.stringify(identity), {
              ex: 300,
            });
          } else {
            await redis.set(`neynar:addr:${addr}`, "__NO_USER__", { ex: 120 });
          }
        } else {
          await redis.set(`neynar:addr:${addr}`, "__NO_USER__", { ex: 120 });
        }
      }
    } else {
      console.warn("Tip history identity lookup failed:", res.status);
    }
  } catch (err) {
    console.warn("Tip history identity lookup error:", err);
  }

  return identities;
}
