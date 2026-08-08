import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const castFid = req.nextUrl.searchParams.get("castFid");
  const origin = req.nextUrl.origin;

  if (!castFid) {
    return NextResponse.redirect(new URL("/", origin));
  }

  try {
    const res = await fetch(
      `${origin}/api/resolve-user?fid=${encodeURIComponent(castFid)}`,
      { headers: { accept: "application/json" } }
    );

    if (!res.ok) {
      return NextResponse.redirect(new URL("/", origin));
    }

    const user = await res.json();

    if (!user?.address) {
      return NextResponse.redirect(new URL("/", origin));
    }

    const redirectUrl = new URL("/", origin);
    redirectUrl.searchParams.set("to", user.address);
    redirectUrl.searchParams.set(
      "label",
      user.displayName || user.username || ""
    );

    return NextResponse.redirect(redirectUrl);
  } catch (err) {
    return NextResponse.redirect(new URL("/", origin));
  }
}
