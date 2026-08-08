import { NextRequest, NextResponse } from "next/server";

/**
 * Notifies a tip recipient via Neynar's managed notification service.
 * Fire-and-forget from the client after a successful tip — failures here
 * should never block or fail the tip flow itself.
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const fid = body?.fid;
  const amount = body?.amount;
  const tokenSymbol = body?.tokenSymbol ?? "USDC";

  if (!fid || typeof fid !== "number") {
    return NextResponse.json({ error: "Missing or invalid fid" }, { status: 400 });
  }

  const apiKey = process.env.NEYNAR_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Server misconfigured: missing Neynar API key" },
      { status: 500 }
    );
  }

  try {
    const res = await fetch("https://api.neynar.com/v2/farcaster/frame/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({
        target_fids: [fid],
        notification: {
          title: "You got tipped 💙",
          body: `Someone sent you ${amount} ${tokenSymbol} on BaseZap`,
          target_url: "https://basefarcaster.vercel.app",
          uuid: crypto.randomUUID(),
        },
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      return NextResponse.json(
        { error: "Neynar notification request failed", detail: errText },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed to send notification" }, { status: 500 });
  }
}
