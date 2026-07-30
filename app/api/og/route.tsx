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
          position: "relative",
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: "#FFFFFF",
            textAlign: "center",
            padding: "0 90px",
            lineHeight: 1.2,
            marginBottom: 56,
            display: "flex",
          }}
        >
          Tip Farcaster creators in USDC on Base
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            border: "1px solid rgba(255,255,255,0.18)",
            borderRadius: 20,
            padding: "32px 56px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              fontSize: 38,
              fontWeight: 600,
            }}
          >
            <span style={{ color: "#4EA8FF" }}>@creator</span>
            <span style={{ color: "rgba(255,255,255,0.5)" }}>→</span>
            <span style={{ color: "#FFFFFF" }}>1 USDC</span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontSize: 38,
              fontWeight: 600,
              color: "#4EA8FF",
            }}
          >
            <span style={{ color: "rgba(255,255,255,0.5)" }}>→</span>
            Base
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 60,
            fontSize: 26,
            color: "rgba(255,255,255,0.55)",
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
