import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get("username")?.replace(/^@/, "").toLowerCase();

  if (!username) {
    return NextResponse.json({ error: "Missing username" }, { status: 400 });
  }

  const apiKey = process.env.NEYNAR_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Server misconfigured: missing Neynar API key" },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(
      `https://api.neynar.com/v2/farcaster/user/by_username?username=${encodeURIComponent(
        username
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
    const user = data?.user;

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
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to resolve user" },
      { status: 500 }
    );
  }
}
