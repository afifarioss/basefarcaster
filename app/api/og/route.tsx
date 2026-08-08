import { ImageResponse } from "next/og";

export const runtime = "edge";

type Recipient = { displayLabel: string; avatarUrl: string };

const DEFAULT_RECIPIENT: Recipient = {
  displayLabel: "@rish",
  avatarUrl: "https://i.imgur.com/naZWL9n.gif",
};

async function resolveRecipient(label: string | null): Promise<Recipient | null> {
  if (!label) return null;
  const username = label.replace(/^@/, "").toLowerCase();
  const apiKey = process.env.NEYNAR_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch(
      `https://api.neynar.com/v2/farcaster/user/by_username?username=${encodeURIComponent(
        username
      )}`,
      {
        headers: { accept: "application/json", "x-api-key": apiKey },
        next: { revalidate: 60 },
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const user = data?.user;
    if (!user?.pfp_url || !user?.username) return null;
    return { displayLabel: `@${user.username}`, avatarUrl: user.pfp_url };
  } catch {
    return null;
  }
}

// Generates a unique background via Venice's image API, themed around the
// tip context. Returns a base64 data URI, or null on any failure/timeout —
// callers must fall back to the static gradient rather than break the card.
async function generateVeniceBackground(prompt: string): Promise<string | null> {
  const apiKey = process.env.VENICE_API_KEY;
  if (!apiKey) {
    console.error("VENICE: missing VENICE_API_KEY env var");
    return null;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const res = await fetch("https://api.venice.ai/api/v1/images/generations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // No model specified — uses Venice's current default image model.
        // Avoids hardcoding a model ID that could be renamed/deprecated;
        // per Venice's spec, an invalid model name silently falls back to
        // default anyway, so specifying nothing is the safer choice.
        prompt,
        // Venice's documented size presets don't include an exact 1200x800
        // match for this card's aspect ratio — using a wide preset and
        // cropping with objectFit: cover below. Revisit if output looks off.
        size: "1792x1024",
        n: 1,
        response_format: "b64_json",
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);
    if (!res.ok) {
      const errText = await res.text();
      console.error(`VENICE: API returned ${res.status}: ${errText.slice(0, 300)}`);
      return null;
    }

    const data = await res.json();
    const b64 = data?.data?.[0]?.b64_json;
    if (!b64) {
      console.error("VENICE: no b64_json in response:", JSON.stringify(data).slice(0, 300));
      return null;
    }

    return `data:image/png;base64,${b64}`;
  } catch (err) {
    console.error("VENICE: threw exception:", err instanceof Error ? err.message : String(err));
    return null;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const recipient =
    (await resolveRecipient(searchParams.get("label"))) ?? DEFAULT_RECIPIENT;

  const veniceBackground = await generateVeniceBackground(
    `Abstract digital art, generosity and community, glowing neon blue and green currents on deep black, crypto and onchain finance mood, no text, no letters`
  );

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          width: "1200px",
          height: "800px",
          display: "flex",
          fontFamily: "sans-serif",
        }}
      >
        {/* Background layer: Venice-generated image if available, else the
            original static gradient fallback — never a broken/blank card. */}
        {veniceBackground ? (
          <img
            src={veniceBackground}
            width={1200}
            height={800}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "#050608",
              backgroundImage:
                "radial-gradient(circle at 15% 10%, rgba(78,168,255,0.20) 0%, transparent 40%), radial-gradient(circle at 85% 90%, rgba(0,214,127,0.16) 0%, transparent 40%), linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
              backgroundSize: "100% 100%, 100% 100%, 48px 48px, 48px 48px",
            }}
          />
        )}

        {/* Legibility overlay — darkens whichever background is active so
            text stays readable regardless of what Venice generates. */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(5,6,8,0.55)",
          }}
        />

        {/* Foreground content — unchanged from the original layout. */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "56px 0",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              border: "1px solid rgba(78,168,255,0.5)",
              borderRadius: 999,
              padding: "10px 24px",
              fontSize: 22,
              fontWeight: 600,
              color: "#4EA8FF",
              marginBottom: 40,
              backgroundColor: "rgba(78,168,255,0.08)",
            }}
          >
            <span>⚡ BASE × FARCASTER</span>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              fontSize: 76,
              fontWeight: 800,
              color: "#FFFFFF",
              textAlign: "center",
              lineHeight: 1.15,
              marginBottom: 44,
            }}
          >
            <span>Tip</span>
            <span>Farcaster creators</span>
            <span>
              in <span style={{ color: "#00D67F" }}>USDC</span> on{" "}
              <span style={{ color: "#4EA8FF" }}>Base</span>
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              border: "1px solid rgba(78,168,255,0.4)",
              borderRadius: 20,
              padding: "28px 48px",
              fontSize: 34,
              fontWeight: 600,
              backgroundColor: "rgba(255,255,255,0.03)",
              boxShadow: "0 0 40px rgba(78,168,255,0.25)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <img
                src="https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/0be7c7dc-a482-43cd-7401-43e7db951400/original"
                width="52"
                height="52"
                style={{
                  borderRadius: "999px",
                  border: "2px solid #4EA8FF",
                }}
              />
              <span style={{ color: "#4EA8FF" }}>@afifarioss</span>
            </div>

            <span style={{ color: "rgba(255,255,255,0.4)" }}>→</span>
            <span style={{ color: "#00D67F" }}>1 USDC</span>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>→</span>

            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <img
                src={recipient.avatarUrl}
                width="52"
                height="52"
                style={{
                  borderRadius: "999px",
                  border: "2px solid #4EA8FF",
                }}
              />
              <span style={{ color: "#4EA8FF" }}>{recipient.displayLabel}</span>
            </div>
          </div>

          <div
            style={{
              fontSize: 26,
              color: "rgba(255,255,255,0.5)",
              marginTop: 44,
              display: "flex",
              letterSpacing: "0.5px",
            }}
          >
            No bridge. No gas confusion. Just tip.
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 800,
    }
  );
}
