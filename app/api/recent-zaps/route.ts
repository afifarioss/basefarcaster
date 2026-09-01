export const dynamic = "force-dynamic";

import { NextRequest } from "next/server";
import { Redis } from "@upstash/redis";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const redis = new Redis({
  url: process.env.KV_REST_API_URL as string,
  token: process.env.KV_REST_API_TOKEN as string,
});

export const revalidate = 30;

const MAX_ZAPS = 12;

const RATE_LIMIT = 20;
const RATE_WINDOW_SECONDS = 60;

type TipRecord = {
  from: string;
  to: string;
  amountUsdc: number;
  txHash: string;
  tokenSymbol: string;
  timestamp: number;
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

  return { from, to, amountUsdc, txHash, tokenSymbol, timestamp };
}

export async function GET(req: NextRequest) {
  const ip = getClientIp(req);
  const { allowed, resetSeconds } = await checkRateLimit(
    redis,
    `recent-zaps:${ip}`,
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
    const rawMembers = await redis.zrange("tips:history", 0, MAX_ZAPS - 1, {
      rev: true,
    });

    const tips: TipRecord[] = (rawMembers as unknown[])
      .map(parseTipRecord)
      .filter((t): t is TipRecord => t !== null);

    const addresses = Array.from(
      new Set(tips.flatMap((t) => [t.from.toLowerCase(), t.to.toLowerCase()]))
    );

    const identities = new Map<
      string,
      { username: string; displayName: string; pfpUrl: string }
    >();

    const apiKey = process.env.NEYNAR_API_KEY;

    if (apiKey && addresses.length > 0) {
      // Check Redis cache first
      const uncached: string[] = [];
      for (const addr of addresses) {
        const cacheKey = `neynar:addr:${addr}`;
        try {
          const cached = await redis.get<string>(cacheKey);
          if (cached === "__NO_USER__") continue;
          if (cached) {
            const parsed = JSON.parse(cached);
            if (parsed && parsed.username) {
              identities.set(addr, {
                username: parsed.username,
                displayName: parsed.displayName ?? parsed.username,
                pfpUrl: parsed.pfpUrl ?? "",
              });
              continue;
            }
          }
        } catch {}
        uncached.push(addr);
      }

      if (uncached.length > 0) {
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
                  username?: string;
                  display_name?: string;
                  pfp_url?: string;
                };
                if (profile.username) {
                  const identity = {
                    username: profile.username,
                    displayName: profile.display_name ?? profile.username,
                    pfpUrl: profile.pfp_url ?? "",
                  };
                  identities.set(addr, identity);
                  await redis.set(
                    `neynar:addr:${addr}`,
                    JSON.stringify({
                      ...identity,
                      fid: (match as { fid?: number }).fid ?? 0,
                    }),
                    { ex: 300 }
                  );
                } else {
                  await redis.set(`neynar:addr:${addr}`, "__NO_USER__", {
                    ex: 120,
                  });
                }
              } else {
                await redis.set(`neynar:addr:${addr}`, "__NO_USER__", {
                  ex: 120,
                });
              }
            }
          }
        } catch {}
      }
    }

    const zaps = tips.map((t) => ({
      txHash: t.txHash,
      amountUsdc: t.amountUsdc,
      timestamp: Math.floor(t.timestamp / 1000),
      from: {
        address: t.from,
        ...(identities.get(t.from.toLowerCase()) ?? {}),
      },
      to: {
        address: t.to,
        ...(identities.get(t.to.toLowerCase()) ?? {}),
      },
    }));

    return Response.json({ zaps });
  } catch (err) {
    console.error("Recent zaps API error:", err);
    return Response.json({ zaps: [], error: true }, { status: 200 });
  }
}
