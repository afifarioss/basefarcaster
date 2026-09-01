export const dynamic = "force-dynamic";

import { NextRequest } from "next/server";
import { Redis } from "@upstash/redis";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const redis = new Redis({
  url: process.env.KV_REST_API_URL as string,
  token: process.env.KV_REST_API_TOKEN as string,
});

export const revalidate = 60;

const LIMIT = 10;

const RATE_LIMIT = 10;
const RATE_WINDOW_SECONDS = 60;

type Entry = { address: string; totalUsdc: number };

export async function GET(req: NextRequest) {
  const ip = getClientIp(req);
  const { allowed, resetSeconds } = await checkRateLimit(
    redis,
    `leaderboard:${ip}`,
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
    const [rawSenders, rawRecipients] = await Promise.all([
      redis.zrange("leaderboard:senders", 0, LIMIT - 1, {
        rev: true,
        withScores: true,
      }),
      redis.zrange("leaderboard:recipients", 0, LIMIT - 1, {
        rev: true,
        withScores: true,
      }),
    ]);

    const toEntries = (raw: (string | number)[]): Entry[] => {
      const entries: Entry[] = [];
      for (let i = 0; i < raw.length; i += 2) {
        entries.push({
          address: String(raw[i]),
          totalUsdc: Number(raw[i + 1]),
        });
      }
      return entries;
    };

    const senders = toEntries(rawSenders as (string | number)[]);
    const recipients = toEntries(rawRecipients as (string | number)[]);

    const addresses = Array.from(
      new Set([...senders, ...recipients].map((e) => e.address))
    );

    const identities = new Map<
      string,
      { username: string; displayName: string; pfpUrl: string }
    >();

    const apiKey = process.env.NEYNAR_API_KEY;

    if (apiKey && addresses.length > 0) {
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
          const res = await fetch(
            `https://api.neynar.com/v2/farcaster/user/bulk-by-address?addresses=${uncached.join(",")}`,
            {
              headers: {
                accept: "application/json",
                "x-api-key": apiKey,
              },
              next: { revalidate: 60 },
            }
          );

          if (res.ok) {
            const data = await res.json();
            for (const addr of uncached) {
              const match = data?.[addr]?.[0];
              if (match) {
                const identity = {
                  username: match.username,
                  displayName: match.display_name,
                  pfpUrl: match.pfp_url,
                };
                identities.set(addr, identity);
                await redis.set(
                  `neynar:addr:${addr}`,
                  JSON.stringify({ ...identity, fid: match.fid ?? 0 }),
                  { ex: 300 }
                );
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

    const withIdentity = (entries: Entry[]) =>
      entries.map((e) => ({
        address: e.address,
        totalUsdc: e.totalUsdc,
        ...(identities.get(e.address) ?? {}),
      }));

    return Response.json({
      senders: withIdentity(senders),
      recipients: withIdentity(recipients),
    });
  } catch (err) {
    console.error("Leaderboard API error:", err);
    return Response.json(
      { senders: [], recipients: [], error: true },
      { status: 200 }
    );
  }
}
