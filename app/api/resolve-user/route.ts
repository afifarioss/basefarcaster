import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const usernameParam = req.nextUrl.searchParams
    .get("username")
    ?.replace(/^@/, "")
    .toLowerCase();
  const fidParam = req.nextUrl.searchParams.get("fid");

  if (!usernameParam && !fidParam) {
    return NextResponse.json(
      { error: "Missing username or fid" },
      { status: 400 }
    );
  }

  const apiKey = process.env.NEYNAR_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Server misconfigured: missing Neynar API key" },
      { status: 500 }
    );
  }

  try {
    let user;

    if (fidParam) {
      const res = await fetch(
        `https://api.neynar.com/v2/farcaster/user/bulk?fids=${encodeURIComponent(
          fidParam
        )}`,
        {
          headers: {
            accept: "application/json",
            "x-api-key": apiKey,
          },
          next: { revalidate: 60 },
        }
      );

      if (!res.ok) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      const data = await res.json();
      user = data?.users?.[0];
    } else {
      const res = await fetch(
        `https://api.neynar.com/v2/farcaster/user/by_username?username=${encodeURIComponent(
          usernameParam!
        )}`,
        {
          headers: {
            accept: "application/json",
            "x-api-key": apiKey,
          },
          next: { revalidate: 60 },
        }
      );

      if (!res.ok) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      const data = await res.json();
      user = data?.user;
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const address =
      user.verified_addresses?.primary?.eth_address ??
      user.verified_addresses?.eth_addresses?.[0] ??
      null;

    if (!address) {
      return NextResponse.json(
        { error: "No verified wallet address for this user" },
        { status: 422 }
      );
    }

    return NextResponse.json({
      username: user.username,
      displayName: user.display_name,
      pfpUrl: user.pfp_url,
      address,
      fid: user.fid,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to resolve user" },
      { status: 500 }
    );
  }
}
