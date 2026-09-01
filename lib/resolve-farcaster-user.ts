/**
 * Shared Farcaster user resolution logic with Redis caching, used by:
 *  - /api/resolve-user (free, powers the app's own tipping UI)
 *  - /api/agent/resolve-username (x402-gated, for external agents via
 *    Agent.market / Bazaar discovery)
 *
 * Caching strategy:
 *  - Positive results cached for 5 minutes (300s) — balances freshness
 *    with Neynar quota protection.
 *  - Negative results (user not found, no address) cached for 2 minutes
 *    (120s) — prevents repeated lookups for non-existent users while
 *    allowing recovery if a user adds a wallet later.
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

const MAX_USERNAME_LEN = 64;
const MAX_FID_LEN = 20;
const CACHE_TTL_POSITIVE = 300; // 5 minutes
const CACHE_TTL_NEGATIVE = 120; // 2 minutes

function normalizeUsername(raw: string): string {
  return raw.replace(/^@/, "").toLowerCase().slice(0, MAX_USERNAME_LEN);
}

export async function resolveFarcasterUser(params: {
  username?: string | null;
  fid?: string | null;
  redis?: import("@upstash/redis").Redis | null;
}): Promise<ResolvedFarcasterUser | ResolveError> {
  const usernameParam = params.username
    ? normalizeUsername(params.username)
    : "";
  const fidParam = params.fid ? params.fid.slice(0, MAX_FID_LEN) : "";

  if (!usernameParam && !fidParam) {
    return { error: "Missing username or fid", status: 400 };
  }

  if (usernameParam && /[^a-z0-9_.-]/.test(usernameParam)) {
    return { error: "Invalid username format", status: 400 };
  }

  if (fidParam && !/^\d+$/.test(fidParam)) {
    return { error: "Invalid fid format", status: 400 };
  }

  // Build cache key
  const cacheKey = usernameParam
    ? `farcaster:user:${usernameParam}`
    : `farcaster:fid:${fidParam}`;

  // Check cache if Redis is provided
  if (params.redis) {
    try {
      const cached = await params.redis.get<string>(cacheKey);
      if (cached === "__NOT_FOUND__") {
        return { error: "User not found", status: 404 };
      }
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.username && parsed.address) {
          return parsed as ResolvedFarcasterUser;
        }
      }
    } catch {
      // Cache read failed — proceed to live lookup
    }
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
      if (!res.ok) {
        if (params.redis) {
          await params.redis.set(cacheKey, "__NOT_FOUND__", { ex: CACHE_TTL_NEGATIVE });
        }
        return { error: "User not found", status: 404 };
      }
      const data = await res.json();
      user = data?.users?.[0];
    } else {
      const res = await fetch(
        `https://api.neynar.com/v2/farcaster/user/by_username?username=${encodeURIComponent(
          usernameParam
        )}`,
        {
          headers: { accept: "application/json", "x-api-key": apiKey },
          next: { revalidate: 60 },
        }
      );
      if (!res.ok) {
        if (params.redis) {
          await params.redis.set(cacheKey, "__NOT_FOUND__", { ex: CACHE_TTL_NEGATIVE });
        }
        return { error: "User not found", status: 404 };
      }
      const data = await res.json();
      user = data?.user;
    }

    if (!user) {
      if (params.redis) {
        await params.redis.set(cacheKey, "__NOT_FOUND__", { ex: CACHE_TTL_NEGATIVE });
      }
      return { error: "User not found", status: 404 };
    }

    const address =
      user.verified_addresses?.primary?.eth_address ??
      user.verified_addresses?.eth_addresses?.[0] ??
      null;

    if (!address) {
      if (params.redis) {
        await params.redis.set(cacheKey, "__NOT_FOUND__", { ex: CACHE_TTL_NEGATIVE });
      }
      return { error: "No verified wallet address for this user", status: 422 };
    }

    const result: ResolvedFarcasterUser = {
      username: user.username,
      displayName: user.display_name,
      pfpUrl: user.pfp_url,
      address,
      fid: user.fid,
    };

    // Cache positive result
    if (params.redis) {
      await params.redis.set(cacheKey, JSON.stringify(result), {
        ex: CACHE_TTL_POSITIVE,
      });
    }

    return result;
  } catch {
    return { error: "Failed to resolve user", status: 500 };
  }
}
