import { NextRequest } from "next/server";

/**
 * Receives Mini App lifecycle events from Farcaster clients:
 * frame_added, frame_removed, notifications_enabled, notifications_disabled.
 *
 * Each payload is a signed JSON Farcaster Signature (JFS) envelope.
 * For production, verify the signature against the sender's registered
 * key before trusting `event`. See:
 * https://miniapps.farcaster.xyz/docs/guides/notifications
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);

  if (!body) {
    return Response.json({ ok: false, error: "Invalid payload" }, { status: 400 });
  }

  // TODO: verify JFS signature, then persist notification tokens per-FID
  // so you can send push notifications (e.g. "you received a tip!").
  console.log("Farcaster webhook event received:", body);

  return Response.json({ ok: true });
}
