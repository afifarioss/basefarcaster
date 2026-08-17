import { NextRequest, NextResponse } from "next/server";
import { resolveFarcasterUser } from "@/lib/resolve-farcaster-user";

/**
 * x402-gated version of /api/resolve-user, for external agents
 * discovering BaseZap via Agent.market / Bazaar. Payment enforcement
 * happens entirely in middleware.ts before this handler ever runs —
 * by the time this code executes, payment has already settled.
 *
 * Same underlying resolver as the free /api/resolve-user route (shared
 * via lib/resolve-farcaster-user.ts), just priced for agent traffic.
 */
export async function GET(req: NextRequest) {
  const result = await resolveFarcasterUser({
    username: req.nextUrl.searchParams.get("username"),
    fid: req.nextUrl.searchParams.get("fid"),
  });

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json(result);
}
