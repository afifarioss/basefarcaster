import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "512px",
          height: "512px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0A0A0A",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 320,
            fontWeight: 900,
            color: "#D4AF37",
            display: "flex",
            lineHeight: 1,
          }}
        >
          Z
        </div>
      </div>
    ),
    {
      width: 512,
      height: 512,
    }
  );
}
