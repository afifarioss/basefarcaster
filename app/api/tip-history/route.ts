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

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(0, parseInt(searchParams.get("page") ?? "0", 10) || 0);
    const start = page * PAGE_SIZE;
    const end = start + PAGE_SIZE - 1;

    const [rawMembers, total] = await Promise.all([
      redis.zrange("tips:history", start, end, { rev: true }),
      redis.zcard("tips:history"),
    ]);

    const tips: TipRecord[] = (rawMembers as string[])
      .map((m) => {
        try {
          return JSON.parse(m) as TipRecord;
        } catch {
          return null;
        }
      })
      .filter((t): t is TipRecord => t !== null);

    // Batch-resolve Farcaster identities for every address on this page.
    const addresses = Array.from(
      new Set(tips.flatMap((t) => [t.from, t.to]))
    );

    const identities = new Map<
      string,
      { username: string; displayName: string; pfpUrl: string }
    >();

    const apiKey = process.env.NEYNAR_API_KEY;

    if (apiKey && addresses.length > 0) {
      try {
        const res = await fetch(
          `https://api.neynar.com/v2/farcaster/user/bulk-by-address?addresses=${addresses.join(
            ","
          )}`,
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
          for (const addr of addresses) {
            const match = data?.[addr]?.[0];
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
        // Identity resolution is best-effort — falls back to raw address below.
      }
    }

    const withIdentity = tips.map((t) => ({
      txHash: t.txHash,
      amountUsdc: t.amountUsdc,
      tokenSymbol: t.tokenSymbol,
      timestamp: t.timestamp,
      from: { address: t.from, ...(identities.get(t.from) ?? {}) },
      to: { address: t.to, ...(identities.get(t.to) ?? {}) },
    }));

    return Response.json({
      tips: withIdentity,
      page,
      pageSize: PAGE_SIZE,
      total,
      hasMore: end + 1 < total,
    });
  } catch (err) {
    console.error("Tip history API error:", err);
    return Response.json(
      { tips: [], page: 0, pageSize: PAGE_SIZE, total: 0, hasMore: false, error: true },
      { status: 200 }
    );
  }
}
