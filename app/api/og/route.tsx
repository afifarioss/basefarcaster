import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "800px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0A0A0A",
          fontFamily: "sans-serif",
          padding: "60px 0",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            fontSize: 78,
            fontWeight: 800,
            color: "#FFFFFF",
            textAlign: "center",
            lineHeight: 1.15,
            marginBottom: 48,
          }}
        >
          <span>Tip</span>
          <span>Farcaster creators</span>
          <span>in USDC on Base</span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            border: "1px solid rgba(255,255,255,0.25)",
            borderRadius: 20,
            padding: "28px 48px",
            fontSize: 36,
            fontWeight: 600,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <img
              src="https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/0be7c7dc-a482-43cd-7401-43e7db951400/original"
              width="56"
              height="56"
              style={{ borderRadius: "999px" }}
            />
            <span style={{ color: "#4EA8FF" }}>@afifarioss</span>
          </div>

          <span style={{ color: "rgba(255,255,255,0.5)" }}>→</span>
          <span style={{ color: "#FFFFFF" }}>1 USDC</span>
          <span style={{ color: "rgba(255,255,255,0.5)" }}>→</span>

          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <img
              src="https://i.imgur.com/naZWL9n.gif"
              width="56"
              height="56"
              style={{ borderRadius: "999px" }}
            />
            <span style={{ color: "#4EA8FF" }}>@rish</span>
          </div>
        </div>

        <div
          style={{
            fontSize: 28,
            color: "rgba(255,255,255,0.55)",
            marginTop: 48,
            display: "flex",
          }}
        >
          No bridge. No gas confusion. Just tip.
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 800,
    }
  );
}
