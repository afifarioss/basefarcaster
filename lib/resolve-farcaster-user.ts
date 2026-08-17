/**
 * Shared Farcaster user resolution logic, used by both:
 *  - /api/resolve-user (free, powers the app's own tipping UI)
 *  - /api/agent/resolve-username (x402-gated, for external agents via
 *    Agent.market / Bazaar discovery)
 *
 * Kept as one function so both routes stay in sync — fixing a bug or
 * changing the Neynar response shape only needs to happen once.
 */

export type ResolvedFarcasterUser = {
  username: string;
  displayName: string;
  pfpUrl: string;
  address: `0x${string}`;
  fid: number;
};

export type ResolveError = {
  error: string;
  status: 400 | 404 | 422 | 500;
};

export async function resolveFarcasterUser(params: {
  username?: string | null;
  fid?: string | null;
}): Promise<ResolvedFarcasterUser | ResolveError> {
  const usernameParam = params.username?.replace(/^@/, "").toLowerCase();
  const fidParam = params.fid;

  if (!usernameParam && !fidParam) {
    return { error: "Missing username or fid", status: 400 };
  }

  const apiKey = process.env.NEYNAR_API_KEY;
  if (!apiKey) {
    return { error: "Server misconfigured: missing Neynar API key", status: 500 };
  }

  try {
    let user;

    if (fidParam) {
      const res = await fetch(
        `https://api.neynar.com/v2/farcaster/user/bulk?fids=${encodeURIComponent(fidParam)}`,
        {
          headers: { accept: "application/json", "x-api-key": apiKey },
          next: { revalidate: 60 },
        }
      );
      if (!res.ok) return { error: "User not found", status: 404 };
      const data = await res.json();
      user = data?.users?.[0];
    } else {
      const res = await fetch(
        `https://api.neynar.com/v2/farcaster/user/by_username?username=${encodeURIComponent(
          usernameParam!
        )}`,
        {
          headers: { accept: "application/json", "x-api-key": apiKey },
          next: { revalidate: 60 },
        }
      );
      if (!res.ok) return { error: "User not found", status: 404 };
      const data = await res.json();
      user = data?.user;
    }

    if (!user) {
      return { error: "User not found", status: 404 };
    }

    const address =
      user.verified_addresses?.primary?.eth_address ??
      user.verified_addresses?.eth_addresses?.[0] ??
      null;

    if (!address) {
      return { error: "No verified wallet address for this user", status: 422 };
    }

    return {
      username: user.username,
      displayName: user.display_name,
      pfpUrl: user.pfp_url,
      address,
      fid: user.fid,
    };
  } catch {
    return { error: "Failed to resolve user", status: 500 };
  }
}
