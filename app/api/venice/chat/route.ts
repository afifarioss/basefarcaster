import { NextRequest } from "next/server";

const VENICE_URL = "https://api.venice.ai/api/v1/chat/completions"\;
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
      .map((message) => ({
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

      console.error(
        `VENICE CHAT: API returned ${response.status}: ${errorText.slice(0, 500)}`
      );

      return Response.json(
        {
          error:
            response.status === 401
              ? "Venice API authentication failed."
              : response.status === 402
                ? "Venice API credits are unavailable."
                : "Venice Assistant is temporarily unavailable.",
        },
        { status: response.status === 429 ? 429 : 502 }
      );
    }

    const data = await response.json();
    const answer = data?.choices?.[0]?.message?.content;

    if (typeof answer !== "string" || !answer.trim()) {
      return Response.json(
        { error: "Venice returned an empty response." },
        { status: 502 }
      );
    }

    return Response.json({
      answer: answer.trim(),
      model: data.model || VENICE_MODEL,
    });
  } catch (error) {
    console.error(
      "VENICE CHAT: request failed",
      error instanceof Error ? error.message : String(error)
    );

    return Response.json(
      { error: "Unable to reach the Venice Assistant." },
      { status: 500 }
    );
  }
}
