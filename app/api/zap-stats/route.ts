export const runtime = "edge";

const ZAP_TOKEN_ADDRESS = "0x8C1ca2c32CD197a27CA049aA0427f64192aD3ba3";

export async function GET() {
  try {
    const res = await fetch(
      `https://api.dexscreener.com/latest/dex/tokens/${ZAP_TOKEN_ADDRESS}`,
      { next: { revalidate: 30 } }
    );
    if (!res.ok) {
      return Response.json({ available: false });
    }
    const data = await res.json();
    const pair = data?.pairs?.[0];
    if (!pair) {
      return Response.json({ available: false });
    }
    return Response.json({
      available: true,
      priceUsd: pair.priceUsd,
      marketCap: pair.fdv ?? pair.marketCap,
      priceChange1h: pair.priceChange?.h1,
    });
  } catch {
    return Response.json({ available: false });
  }
}
