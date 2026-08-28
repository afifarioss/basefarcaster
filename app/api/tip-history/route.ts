export const dynamic = "force-dynamic";

import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.KV_REST_API_URL as string,
  token: process.env.KV_REST_API_TOKEN as string,
});

export const revalidate = 30;

const PAGE_SIZE = 15;

type TipRecord = {
  from: string;
  to: string;
  amountUsdc: number;
  txHash: string;
  tokenSymbol: string;
  timestamp: number;
};

type FarcasterIdentity = {
  username: string;
  displayName: string;
  pfpUrl: string;
};

function parseTipRecord(value: unknown): TipRecord | null {
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value) as TipRecord;
      return parsed && typeof parsed === "object" ? parsed : null;
    } catch {
      return null;
    }
  }

  if (value && typeof value === "object") {
    return value as TipRecord;
  }

  return null;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(
      0,
      parseInt(searchParams.get("page") ?? "0", 10) || 0
    );

    const start = page * PAGE_SIZE;
    const end = start + PAGE_SIZE - 1;

    const [rawMembers, total] = await Promise.all([
      redis.zrange("tips:history", start, end, { rev: true }),
      redis.zcard("tips:history"),
    ]);

    const tips: TipRecord[] = (rawMembers as unknown[])
      .map(parseTipRecord)
      .filter((t): t is TipRecord => {
        return (
          t !== null &&
          typeof t.from === "string" &&
          typeof t.to === "string" &&
          typeof t.amountUsdc === "number" &&
          typeof t.txHash === "string" &&
          typeof t.timestamp === "number"
        );
      });

    const addresses = Array.from(
      new Set(
        tips
          .flatMap((t) => [t.from, t.to])
          .map((address) => address.toLowerCase())
      )
    );

    const identities = new Map<string, FarcasterIdentity>();
    const apiKey = process.env.NEYNAR_API_KEY;

    if (apiKey && addresses.length > 0) {
      try {
        const url = new URL(
          "https://api.neynar.com/v2/farcaster/user/bulk-by-address"
        );

        url.searchParams.set("addresses", addresses.join(","));

        const res = await fetch(url, {
          headers: {
            accept: "application/json",
            "x-api-key": apiKey,
          },
          next: { revalidate: 60 },
        });

        if (res.ok) {
          const data = await res.json();

          for (const [key, users] of Object.entries(data ?? {})) {
            const match = Array.isArray(users) ? users[0] : null;

            if (!match || typeof match !== "object") continue;

            const user = match as {
              username?: string;
              display_name?: string;
              pfp_url?: string;
            };

            if (!user.username) continue;

            identities.set(key.toLowerCase(), {
              username: user.username,
              displayName: user.display_name ?? user.username,
              pfpUrl: user.pfp_url ?? "",
            });
          }
        } else {
          console.warn(
            "Tip history identity lookup failed:",
            res.status
          );
        }
      } catch (err) {
        console.warn("Tip history identity lookup error:", err);
      }
    }

    const withIdentity = tips.map((t) => ({
      txHash: t.txHash,
      amountUsdc: t.amountUsdc,
      tokenSymbol: t.tokenSymbol,
      timestamp: t.timestamp,
      from: {
        address: t.from,
        ...(identities.get(t.from.toLowerCase()) ?? {}),
      },
      to: {
        address: t.to,
        ...(identities.get(t.to.toLowerCase()) ?? {}),
      },
    }));

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
