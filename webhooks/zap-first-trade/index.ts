/**
 * zap-first-trade — Bankr webhook handler.
 * Triggered by a Vercel Cron job (see app/api/cron/check-zap-volume/route.ts)
 * only on the transition from $0 to nonzero 24h volume — i.e. the first
 * real trade. Posts a celebratory cast prompt to the Bankr agent.
 */
export default async function handler(req: Request): Promise<Response> {
  const body = await req.json().catch(() => ({}));
  const volume = body?.volume24h ?? "unknown";

  return Response.json({
    prompt: `$ZAP just got its first real trade on Base! 24h volume: $${volume}. Post a short, genuine celebratory cast on Farcaster about this milestone for BaseZap's token — no hype, just excitement that real trading has started. Include the link basefarcaster.vercel.app`,
  });
}
