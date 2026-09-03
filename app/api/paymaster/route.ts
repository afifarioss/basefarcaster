import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const redis = new Redis({
  url: process.env.KV_REST_API_URL as string,
  token: process.env.KV_REST_API_TOKEN as string,
});

const PAYMASTER_URL = process.env.CDP_PAYMASTER_URL;
const RATE_LIMIT = 60;
const RATE_WINDOW_SECONDS = 60;
const ALLOWED_METHODS = new Set([
  "pm_getPaymasterStubData",
  "pm_getPaymasterData",
]);

export async function POST(req: NextRequest) {
  if (!PAYMASTER_URL) {
    console.error("Paymaster proxy: CDP_PAYMASTER_URL is not configured");
    return NextResponse.json(
      { error: "Paymaster service is not configured" },
      { status: 503 },
    );
  }

  const rate = await checkRateLimit(
    redis,
    `paymaster:${getClientIp(req)}`,
    RATE_LIMIT,
    RATE_WINDOW_SECONDS,
  );

  if (!rate.allowed) {
    return NextResponse.json(
      { error: "Too many paymaster requests" },
      {
        status: 429,
        headers: {
          "Retry-After": String(rate.resetSeconds),
        },
      },
    );
  }

  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !("method" in body) ||
    typeof body.method !== "string" ||
    !ALLOWED_METHODS.has(body.method)
  ) {
    return NextResponse.json(
      { error: "Unsupported paymaster method" },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(PAYMASTER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const text = await response.text();

    return new NextResponse(text, {
      status: response.status,
      headers: {
        "Content-Type":
          response.headers.get("content-type") || "application/json",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Paymaster proxy error:", error);
    return NextResponse.json(
      { error: "Paymaster service unavailable" },
      { status: 502 },
    );
  }
}
