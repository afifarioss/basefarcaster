import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.KV_REST_API_URL as string,
  token: process.env.KV_REST_API_TOKEN as string,
});

export const revalidate = 60;

const LIMIT = 10;

type Entry = { address: string; totalUsdc: number };

export async function GET() {
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

    // Batch-resolve Farcaster identities for every address on the board.
    const addresses = Array.from(
      new Set([...senders, ...recipients].map((e) => e.address))
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
