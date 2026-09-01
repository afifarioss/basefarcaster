import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const redis = new Redis({
  url: process.env.KV_REST_API_URL as string,
  token: process.env.KV_REST_API_TOKEN as string,
});

// 8 messages per 60s per IP — chat generates paid Venice API calls,
// but legitimate usage is conversational (one message every few seconds).
const RATE_LIMIT = 8;
const RATE_WINDOW_SECONDS = 60;

const VENICE_URL = "https://api.venice.ai/api/v1/chat/completions";
const VENICE_MODEL = process.env.VENICE_CHAT_MODEL || "qwen3-4b";

const SYSTEM_PROMPT = `
You are the BaseZap Venice Assistant.

BaseZap is an independent Base application integrating Venice ecosystem assets
into social payments.

Known BaseZap features:
- USDC tipping on Base
- VVV tipping on Base
- DIEM tipping on Base
- VVV staking through the Venice staking contract
- Farcaster/Base identity resolution
- onchain tip verification and tip history
- Base Account / wallet integration
- agent-oriented BaseZap APIs
- Venice-powered image generation for BaseZap social/OG experiences

Answer questions about BaseZap, Venice integration, VVV, DIEM, staking,
Base, Farcaster, and how the application works.

Do not claim that BaseZap is officially partnered with, endorsed by, or owned
by Venice unless the user provides an official announcement establishing that.
Describe BaseZap as an independent application integrating Venice ecosystem
assets.

Do not invent token prices, yields, contract behavior, transaction results,
partnerships, or roadmap commitments.

When a question requires current blockchain or account information, explain
that the user should verify it onchain or through the relevant official
Venice/Base interface.

Keep answers concise and useful. Prefer concrete instructions.
`;

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const { allowed, resetSeconds } = await checkRateLimit(
    redis,
    `venice-chat:${ip}`,
    RATE_LIMIT,
    RATE_WINDOW_SECONDS
  );

  if (!allowed) {
    return NextResponse.json(
      { error: "Too many messages, please slow down." },
      { status: 429, headers: { "Retry-After": String(resetSeconds) } }
    );
  }

  const apiKey = process.env.VENICE_API_KEY;

  if (!apiKey) {
    return Response.json(
      {
        error:
          "Venice Assistant is not configured yet. Add VENICE_API_KEY to the production environment.",
      },
      { status: 503 }
    );
  }

  try {
    const body = await req.json();
    const incoming = Array.isArray(body?.messages)
      ? body.messages
      : [];

    const messages: ChatMessage[] = incoming
      .filter(
        (message: unknown): message is ChatMessage =>
          !!message &&
          typeof message === "object" &&
          "role" in message &&
          "content" in message &&
          (message.role === "user" || message.role === "assistant") &&
          typeof message.content === "string"
      )
      .slice(-12)
      .map((message: { role: string; content: string }) => ({
        role: message.role,
        content: message.content.slice(0, 4000),
      }));

    if (!messages.length || messages[messages.length - 1].role !== "user") {
      return Response.json(
        { error: "A user message is required." },
        { status: 400 }
      );
    }

    const response = await fetch(VENICE_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: VENICE_MODEL,
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT,
          },
          ...messages,
        ],
        max_completion_tokens: 500,
        temperature: 0.3,
        venice_parameters: {
          include_venice_system_prompt: true,
        },
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();

      console.warn(
        `VENICE CHAT: API returned ${response.status}: ${errorText.slice(0, 500)}`
      );

      if (response.status === 429) {
        return Response.json(
          { error: "Venice API rate limit reached. Please try again shortly." },
          { status: 429 }
        );
      }

      return Response.json(
        { error: "Venice Assistant encountered an error. Please try again." },
        { status: 502 }
      );
    }

    const data = await response.json();
    const reply =
      data?.choices?.[0]?.message?.content ??
      "Sorry, I couldn't generate a response.";

    return Response.json({
      role: "assistant",
      content: reply,
    });
  } catch {
    return Response.json(
      { error: "Something went wrong talking to Venice. Please try again." },
      { status: 500 }
    );
  }
}
