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
      .filter((t): t is TipRecord => t !== null);

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
          const data = (await res.json()) as Record<string, unknown>;

          for (const [key, users] of Object.entries(data)) {
            if (!Array.isArray(users) || users.length === 0) continue;

            const user = users[0];

            if (!user || typeof user !== "object") continue;

            const profile = user as {
              fid?: number;
              username?: string;
              display_name?: string;
              pfp_url?: string;
            };

            if (
              typeof profile.fid !== "number" ||
              !profile.username
            ) {
              continue;
            }

            identities.set(key.toLowerCase(), {
              fid: profile.fid,
              username: profile.username,
              displayName: profile.display_name ?? profile.username,
              pfpUrl: profile.pfp_url ?? "",
            });
          }
        } else {
          console.warn(
            "Tip history identity lookup failed:",
            res.status
          );
        }
      } catch (err) {
        console.warn(
          "Tip history identity lookup error:",
          err
        );
      }
    }

    const withIdentity = tips.map((t) => {
      const fromIdentity = identities.get(
        t.from.toLowerCase()
      );

      const toIdentity = identities.get(
        t.to.toLowerCase()
      );

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
