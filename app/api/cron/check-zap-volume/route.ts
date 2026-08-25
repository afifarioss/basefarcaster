import { Redis } from "@upstash/redis";

export const runtime = "edge";

const redis = new Redis({
  url: process.env.KV_REST_API_URL as string,
  token: process.env.KV_REST_API_TOKEN as string,
});

const ZAP_TOKEN_ADDRESS = "0x8C1ca2c32CD197a27CA049aA0427f64192aD3ba3";
const BANKR_WALLET = "0x050454783b290a1c90430a6968493b33092cde9d";
const WEBHOOK_URL = `https://webhooks.bankr.bot/u/${BANKR_WALLET}/zap-first-trade`;
const FIRED_KEY = "zap:first-trade-fired";

// Fires the zap-first-trade webhook exactly once: the first time 24h volume
// is observed as nonzero. Uses a Redis guard so repeated cron runs after
// the first fire are no-ops, instead of relying on Bankr's rate limit to
// silently absorb duplicate calls.
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const alreadyFired = await redis.get(FIRED_KEY);

    if (alreadyFired) {
      return Response.json({
        checked: true,
        fired: false,
        reason: "already-fired",
      });
    }

    const res = await fetch(
      `https://api.dexscreener.com/latest/dex/tokens/${ZAP_TOKEN_ADDRESS}`
    );

    if (!res.ok) {
      return Response.json({
        checked: true,
        fired: false,
      });
    }

    const data = await res.json();
    const pair = data?.pairs?.[0];
    const volume24h = pair?.volume?.h24 ?? 0;

    if (volume24h > 0) {
      const setOk = await redis.set(FIRED_KEY, "1", { nx: true });

      if (!setOk) {
        return Response.json({
          checked: true,
          fired: false,
          reason: "race-lost",
        });
      }

      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ volume24h }),
      });

      return Response.json({
        checked: true,
        fired: true,
        volume24h,
      });
    }

    return Response.json({
      checked: true,
      fired: false,
      volume24h,
    });
  } catch (err) {
    return Response.json(
      {
        checked: false,
        error: err instanceof Error ? err.message : "unknown",
      },
      { status: 500 }
    );
  }
}
