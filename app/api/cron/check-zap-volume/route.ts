export const runtime = "edge";

const ZAP_TOKEN_ADDRESS = "0x8C1ca2c32CD197a27CA049aA0427f64192aD3ba3";
const BANKR_WALLET = "0x050454783b290a1c90430a6968493b33092cde9d";
const WEBHOOK_URL = `https://webhooks.bankr.bot/u/${BANKR_WALLET}/zap-first-trade`;

// Simple in-memory-free check: relies on KV or similar for persistence in
// production. For now, checks live volume and fires unconditionally when
// nonzero — Bankr's rate limit (10/min, 1000/day) prevents spam, and this
// cron should be scheduled at a low frequency (e.g. every 30 min).
export async function GET() {
  try {
    const res = await fetch(
      `https://api.dexscreener.com/latest/dex/tokens/${ZAP_TOKEN_ADDRESS}`
    );
    if (!res.ok) return Response.json({ checked: true, fired: false });

    const data = await res.json();
    const pair = data?.pairs?.[0];
    const volume24h = pair?.volume?.h24 ?? 0;

    if (volume24h > 0) {
      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ volume24h }),
      });
      return Response.json({ checked: true, fired: true, volume24h });
    }

    return Response.json({ checked: true, fired: false, volume24h });
  } catch (err) {
    return Response.json(
      { checked: false, error: err instanceof Error ? err.message : "unknown" },
      { status: 500 }
    );
  }
}
