import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get("username")?.replace(/^@/, "");

  if (!username) {
    return NextResponse.json({ error: "Missing username" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://client.warpcast.com/v2/user-by-username?username=${encodeURIComponent(
        username
      )}`,
      { next: { revalidate: 60 } }
    );

    if (!res.ok) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const data = await res.json();
    const user = data?.result?.user;

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const ethWallets: string[] = user.extras?.ethWallets ?? [];
    const walletLabels: { address: string; labels: string[] }[] =
      user.extras?.walletLabels ?? [];

    // Prefer the wallet explicitly labeled "primary" — falls back to the
    // first verified eth wallet if no primary label is set.
    const primaryLabeled = walletLabels.find((w) =>
      w.labels?.includes("primary")
    );
    const address = primaryLabeled?.address ?? ethWallets[0] ?? null;

    if (!address) {
      return NextResponse.json(
        { error: "No verified wallet address for this user" },
        { status: 422 }
      );
    }

    return NextResponse.json({
      username: user.username,
      displayName: user.displayName,
      pfpUrl: user.pfp?.url,
      address,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to resolve user" },
      { status: 500 }
    );
  }
}
