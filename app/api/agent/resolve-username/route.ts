import { NextRequest, NextResponse } from "next/server";
import { withX402 } from "x402-next";
import { facilitator } from "@coinbase/x402";
import { Redis } from "@upstash/redis";
import { resolveFarcasterUser } from "@/lib/resolve-farcaster-user";

const redis = new Redis({
  url: process.env.KV_REST_API_URL as string,
  token: process.env.KV_REST_API_TOKEN as string,
});

/**
 * x402-gated version of /api/resolve-user, for external agents
 * discovering BaseZap via Agent.market / Bazaar.
 *
 * Uses withX402 (route wrapper) rather than middleware.ts, for two
 * reasons:
 *  1. Route Handlers run on the Node.js runtime by default, avoiding
 *     the Edge Runtime incompatibility with @coinbase/cdp-sdk's
 *     Node-only dependencies (axios, CompressionStream, etc.) that
 *     broke the middleware.ts build.
 *  2. withX402 only settles payment AFTER a successful response
 *     (status < 400) — a failed lookup (e.g. "user not found") never
 *     charges the calling agent. paymentMiddleware would charge even
 *     on failure.
 *
 * Same underlying resolver as the free /api/resolve-user route (shared
 * via lib/resolve-farcaster-user.ts), just priced for agent traffic.
 */
async function handler(req: NextRequest): Promise<NextResponse<any>> {
  const result = await resolveFarcasterUser({
    username: req.nextUrl.searchParams.get("username"),
    fid: req.nextUrl.searchParams.get("fid"),
    redis,
  });

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json(result);
}

export const GET = withX402(
  handler,
  "0x7845D45d9E53268EBFf3C4a9daBb994cE5b93918",
  {
    price: "$0.001",
    network: "base",
    config: {
      description:
        "Resolve a Farcaster username to their verified wallet address on Base.",
    },
  },
  // @ts-expect-error — @coinbase/x402's facilitator type (from @x402/core)
  // and x402-next's expected FacilitatorConfig type (from the standalone
  // x402 package) model the same runtime shape slightly differently.
  // This is a known cross-package type mismatch, not a real config bug —
  // see build log from 2026-08-18. Safe to suppress at this one call site.
  facilitator
);
