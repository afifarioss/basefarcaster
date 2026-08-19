import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { APP_URL } from "@/lib/constants";

const redis = new Redis({
  url: process.env.KV_REST_API_URL as string,
  token: process.env.KV_REST_API_TOKEN as string,
});

/**
 * Notifies a tip recipient across both notification surfaces:
 *
 *  - Neynar (FID-based): reaches Farcaster/Warpcast clients.
 *  - Base Dashboard Notifications API (wallet-based): reaches Base App
 *    users. Base App does not read FIDs or Neynar tokens — see
 *    https://docs.base.org/apps/technical-guides/base-notifications
 *
 * Both paths run independently and are fire-and-forget from the client
 * (TipCard) after a successful transfer — failures here should never
 * block or fail the tip flow itself.
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const fid = body?.fid;
  const walletAddress = body?.walletAddress;
  const amount = body?.amount;
  const tokenSymbol = body?.tokenSymbol ?? "USDC";
  const callsId = body?.callsId;

  if (!fid && !walletAddress) {
    return NextResponse.json(
      { error: "Missing fid or walletAddress" },
      { status: 400 }
    );
  }

  // Idempotency guard: same callsId used by record-tip. Prevents a
  // duplicate onSuccess fire from double-notifying the recipient.
  if (typeof callsId === "string" && callsId.length > 0) {
    const isNew = await redis.set(`notify:seen:${callsId}`, "1", {
      nx: true,
      ex: 86400,
    });
    if (!isNew) {
      console.warn("notify-tip: duplicate callsId ignored", callsId);
      return NextResponse.json({ ok: true, duplicate: true });
    }
  }

  const title = "You got tipped ⚡";
  const message = `Someone sent you ${amount} ${tokenSymbol} on BaseZap`;

  const results: Record<string, unknown> = {};

  // --- Farcaster / Warpcast, via Neynar (FID-based) ---
  if (fid && typeof fid === "number") {
    const neynarKey = process.env.NEYNAR_API_KEY;
    if (!neynarKey) {
      results.neynar = { skipped: true, reason: "missing NEYNAR_API_KEY" };
    } else {
      try {
        const res = await fetch(
          "https://api.neynar.com/v2/farcaster/frame/notifications",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": neynarKey,
            },
            body: JSON.stringify({
              target_fids: [fid],
              notification: {
                title,
                body: message,
                target_url: APP_URL,
                uuid: crypto.randomUUID(),
              },
            }),
          }
        );
        results.neynar = { ok: res.ok, status: res.status };
      } catch {
        results.neynar = { ok: false, error: "request failed" };
      }
    }
  }

  // --- Base App, via Base Dashboard Notifications API (wallet-based) ---
  if (walletAddress && typeof walletAddress === "string") {
    const baseKey = process.env.BASE_NOTIFICATIONS_API_KEY;
    if (!baseKey) {
      results.base = { skipped: true, reason: "missing BASE_NOTIFICATIONS_API_KEY" };
    } else {
      try {
        const res = await fetch(
          "https://dashboard.base.org/api/v1/notifications/send",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": baseKey,
            },
            body: JSON.stringify({
              app_url: APP_URL,
              wallet_addresses: [walletAddress],
              // Base caps title at 30 chars, message at 200 — both of
              // ours are well under, but truncate defensively.
              title: title.slice(0, 30),
              message: message.slice(0, 200),
            }),
          }
        );
        const data = await res.json().catch(() => null);
        results.base = { ok: res.ok, status: res.status, data };
      } catch {
        results.base = { ok: false, error: "request failed" };
      }
    }
  }

  // Always 200 — this endpoint is best-effort and the client ignores
  // the response body entirely.
  return NextResponse.json({ ok: true, results });
}
