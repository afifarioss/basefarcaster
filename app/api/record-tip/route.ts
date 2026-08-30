/**
 * DEPRECATED — leaderboard crediting moved to /api/record-tip-history,
 * which runs after the real onchain tx hash resolves and is verified
 * server-side against the actual USDC Transfer logs.
 *
 * This route fired before a real tx hash existed (only an EIP-5792 bundle
 * id), so it could only ever trust client-supplied amounts/addresses —
 * a leaderboard-gaming vector. Kept as a harmless no-op in case a stale
 * client build still calls it during rollover.
 */
export async function POST() {
  return Response.json({ ok: true, deprecated: true });
}
