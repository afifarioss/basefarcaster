export const dynamic = "force-dynamic";

import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.KV_REST_API_URL as string,
  token: process.env.KV_REST_API_TOKEN as string,
});

export const revalidate = 30;

const MAX_ZAPS = 12;

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

export async function GET() {
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
      try {
        const url = new URL(
          "https://api.neynar.com/v2/farcaster/user/bulk-by-address"
        );
        url.searchParams.set("addresses", addresses.join(","));

        const res = await fetch(url, {
          headers: { accept: "application/json", "x-api-key": apiKey },
          next: { revalidate: 60 },
        });

        if (res.ok) {
          const data = (await res.json()) as Record<string, unknown>;
          for (const addr of addresses) {
            const users = data?.[addr];
            const match = Array.isArray(users) ? users[0] : undefined;
            if (match) {
              identities.set(addr, {
                username: match.username,
                displayName: match.display_name,
                pfpUrl: match.pfp_url,
              });
            }
          }
        }
      } catch {
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
