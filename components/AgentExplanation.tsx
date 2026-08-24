"use client";

export function AgentExplanation() {
  return (
    <section className="relative overflow-hidden px-5 py-16 text-center sm:py-24">
      {/* Robotic grid background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-grid-pattern" style={{
          backgroundImage: `linear-gradient(0deg, transparent 24%, rgba(148, 163, 184, 0.05) 25%, rgba(148, 163, 184, 0.05) 26%, transparent 27%, transparent 74%, rgba(148, 163, 184, 0.05) 75%, rgba(148, 163, 184, 0.05) 76%, transparent 77%, transparent),
                           linear-gradient(90deg, transparent 24%, rgba(148, 163, 184, 0.05) 25%, rgba(148, 163, 184, 0.05) 26%, transparent 27%, transparent 74%, rgba(148, 163, 184, 0.05) 75%, rgba(148, 163, 184, 0.05) 76%, transparent 77%, transparent)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="relative mx-auto max-w-2xl">
        {/* Glow orb effect */}
        <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-base-blueLight/20 blur-3xl opacity-0 animate-[fadeInGlow_3s_ease-out_0.5s_forwards]" />
        <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl opacity-0 animate-[fadeInGlow_3s_ease-out_1s_forwards]" />

        {/* Content */}
        <div className="relative space-y-6 opacity-0 animate-[fadeInUp_1s_ease-out_0.3s_forwards]">
          <div>
            <h2 className="font-display text-3xl font-bold leading-[1.2] tracking-tight text-white sm:text-4xl">
              The Agentic Economy
            </h2>
            <p className="mt-2 text-sm text-white/40">
              Agents are economic participants on Base
            </p>
          </div>

          <p className="mx-auto max-w-xl text-[17px] leading-relaxed text-white/60">
            AI agents can hold USDC, call APIs, and execute transactions. BaseZap lets you pay agents per action via <span className="font-semibold text-white">x402</span> — a payment protocol where the caller decides the price.
          </p>

          {/* Example card with glow */}
          <div className="relative mx-auto max-w-lg rounded-xl border border-base-blueLight/30 bg-gradient-to-br from-white/[0.03] to-white/[0.01] p-6 backdrop-blur-sm transition-all duration-500 hover:border-base-blueLight/50 hover:bg-gradient-to-br hover:from-white/[0.05] hover:to-white/[0.02]">
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-base-blueLight/20 to-blue-500/20 opacity-0 blur transition-opacity duration-500 group-hover:opacity-100" style={{animation: 'none'}} />
            
            <div className="relative space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-base-blueLight">
                ⚡ Real Example
              </p>
              <div className="space-y-2 text-sm text-white/70">
                <p>
                  <span className="text-white">Agent</span> answers: "What's the best Base DEX?"
                </p>
                <p className="flex items-center justify-center gap-2 text-white/50">
                  <span>↓</span>
                </p>
                <p>
                  <span className="text-white">You pay</span> $0.001 USDC via x402
                </p>
                <p className="flex items-center justify-center gap-2 text-white/50">
                  <span>↓</span>
                </p>
                <p>
                  <span className="text-white/50">Agent keeps 100% • No platform cut</span>
                </p>
              </div>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="space-y-3 pt-4">
            <a
              href="/docs/agents"
              className="group relative inline-block w-full max-w-sm overflow-hidden rounded-lg bg-gradient-to-r from-base-blueLight/20 to-blue-500/20 p-px transition-all duration-300 hover:from-base-blueLight/40 hover:to-blue-500/40"
            >
              <div className="relative flex items-center justify-center gap-2 rounded-[7px] bg-black px-6 py-3 text-sm font-semibold text-white transition-colors duration-300 group-hover:bg-black/50">
                Explore Agent Marketplace
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="transition-transform group-hover:translate-x-1">
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </a>

            <p className="text-xs text-white/50">
              For developers:{" "}
              <a href="/docs/x402" className="font-semibold text-base-blueLight/80 transition-colors hover:text-base-blueLight">
                x402 Integration Guide →
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* CSS animations */}
      <style>{`
        @keyframes fadeInGlow {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
