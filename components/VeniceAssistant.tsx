"use client";

import { FormEvent, useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const STARTER_PROMPTS = [
  "What can I do with VVV in BaseZap?",
  "How does VVV staking work?",
  "How is Venice integrated into BaseZap?",
];

export function VeniceAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [previewLimited, setPreviewLimited] = useState(false);

  async function sendMessage(event?: FormEvent) {
    event?.preventDefault();

    const content = input.trim();
    if (!content || loading) return;

    const nextMessages: Message[] = [
      ...messages,
      { role: "user", content },
    ];

    setMessages(nextMessages);
    setInput("");
    setError("");
    setPreviewLimited(false);
    setLoading(true);

    try {
      const response = await fetch("/api/venice/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: nextMessages,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data?.code === "venice_credit_limited") {
          setPreviewLimited(true);
          return;
        }

        throw new Error(data?.error || "Venice Assistant unavailable.");
      }

      setMessages([
        ...nextMessages,
        {
          role: "assistant",
          content: data.answer,
        },
      ]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to contact Venice Assistant."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="glass-card w-full p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-base-blueLight/80">
            Venice × BaseZap
          </p>
          <h2 className="mt-1 font-display text-lg font-bold text-white">
            Venice AI Assistant
          </h2>
        </div>

        <span className="rounded-full border border-white/[0.08] px-2 py-1 text-[9px] text-white/35">
          BaseZap
        </span>
      </div>

      <p className="mt-2 text-xs leading-relaxed text-white/40">
        Explore what happens when Venice intelligence meets social payments,
        VVV, DIEM, Farcaster, and Base.
      </p>

      {messages.length === 0 && (
        <div className="mt-4 space-y-2">
          {STARTER_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => setInput(prompt)}
              className="block w-full rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-left text-[11px] text-white/50 transition hover:border-white/[0.14] hover:text-white/70"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {messages.length > 0 && (
        <div className="mt-4 max-h-80 space-y-3 overflow-y-auto">
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={
                message.role === "user"
                  ? "ml-6 rounded-lg bg-white/[0.06] p-3 text-xs text-white/70"
                  : "mr-6 rounded-lg border border-white/[0.06] bg-black/20 p-3 text-xs leading-relaxed text-white/60"
              }
            >
              <p className="mb-1 text-[9px] font-semibold uppercase tracking-wider text-white/25">
                {message.role === "user" ? "You" : "Venice"}
              </p>
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          ))}
        </div>
      )}

      {previewLimited && (
        <div className="mt-4 rounded-xl border border-white/[0.08] bg-black/20 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-base-blueLight/80">
            Limited preview
          </p>

          <p className="mt-2 text-xs font-semibold leading-relaxed text-white/80">
            Private AI. Open economy.
          </p>

          <p className="mt-2 text-[11px] leading-relaxed text-white/45">
            The Venice connection is live. This deployment currently has no
            available Venice inference credits, so the assistant is temporarily
            paused.
          </p>

          <p className="mt-2 text-[11px] leading-relaxed text-white/45">
            BaseZap continues building the social layer around the Venice
            ecosystem: VVV, DIEM, Farcaster identity, and fast settlement on
            Base.
          </p>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <a
              href="https://venice.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-white/[0.08] px-3 py-2 text-center text-[10px] font-semibold text-white/55 transition hover:text-white"
            >
              Explore Venice ↗
            </a>

            <a
              href="/"
              className="rounded-lg border border-white/[0.08] px-3 py-2 text-center text-[10px] font-semibold text-white/55 transition hover:text-white"
            >
              Explore BaseZap →
            </a>
          </div>
        </div>
      )}

      {error && (
        <p className="mt-3 rounded-lg border border-red-400/10 bg-red-400/5 p-2 text-[10px] text-red-300">
          {error}
        </p>
      )}

      <form onSubmit={sendMessage} className="mt-4 flex gap-2">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          disabled={loading}
          placeholder="Ask Venice Assistant..."
          className="min-w-0 flex-1 rounded-lg border border-white/[0.08] bg-black/20 px-3 py-2.5 text-xs text-white outline-none placeholder:text-white/25 focus:border-white/20 disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="rounded-lg bg-white px-4 py-2.5 text-xs font-semibold text-black transition hover:bg-white/90 disabled:opacity-40"
        >
          {loading ? "..." : "Ask"}
        </button>
      </form>

      <p className="mt-3 text-center text-[9px] leading-relaxed text-white/20">
        Venice AI powers the assistant. Verify transaction and token information
        onchain before acting.
      </p>
    </div>
  );
}
