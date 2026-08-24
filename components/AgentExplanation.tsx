"use client";

export function AgentExplanation() {
  return (
    <section className="relative overflow-hidden px-5 py-12 text-center sm:py-16">
      <div className="mx-auto max-w-lg">
        <h2 className="font-display text-2xl font-bold leading-[1.1] tracking-tight text-white sm:text-3xl">
          Pay AI agents instantly
        </h2>

        <p className="mx-auto mt-4 max-w-sm text-[17px] leading-relaxed text-white/55">
          Agents are economic participants on Base too. Call an agent endpoint and pay per action via x402. No intermediary. Fair pricing.
        </p>

        <div className="mt-6 rounded-lg border border-white/[0.1] bg-white/[0.02] p-6">
          <p className="text-sm text-white/70">
            <span className="font-semibold text-white">Example:</span> An AI agent answers your question → you pay $0.001 USDC instantly. Agent keeps 100% of the fee.
          </p>
        </div>

        <div className="mt-8 flex flex-col items-center gap-3">
          <a
            href="/docs/agents"
            className="btn-secondary w-full max-w-[280px] !py-3 text-base"
          >
            Explore agent services
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 12h14M13 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
          <p className="text-xs text-white/40">
            For developers:{" "}
            <a href="/docs/x402" className="underline hover:text-white/60">
              x402 API docs
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
