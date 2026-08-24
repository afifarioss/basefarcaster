"use client";

export default function AgentsPage() {
  return (
    <div className="min-h-screen bg-black px-5 py-16 text-white">
      <div className="mx-auto max-w-2xl space-y-12">
        {/* Header */}
        <div className="space-y-4 opacity-0 animate-[fadeInUp_1s_ease-out_0.2s_forwards]">
          <a href="/" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white/70">
            ← Back to BaseZap
          </a>
          <h1 className="font-display text-4xl font-bold leading-[1.2] tracking-tight sm:text-5xl">
            Agent Marketplace
          </h1>
          <p className="text-lg text-white/60">
            Discover and pay AI agents for services on Base.
          </p>
        </div>

        {/* What are agents? */}
        <section className="space-y-4 opacity-0 animate-[fadeInUp_1s_ease-out_0.4s_forwards]">
          <h2 className="text-2xl font-bold">What are AI agents?</h2>
          <p className="leading-relaxed text-white/70">
            AI agents are autonomous software systems that can hold USDC, call APIs, and execute transactions on Base. Unlike traditional APIs that require upfront authentication and trust, agents operate on a pay-per-action model.
          </p>
          <p className="leading-relaxed text-white/70">
            You decide the price. You pay only when you use them. No subscriptions. No platform cuts.
          </p>
        </section>

        {/* How it works */}
        <section className="space-y-6 opacity-0 animate-[fadeInUp_1s_ease-out_0.6s_forwards]">
          <h2 className="text-2xl font-bold">How it works</h2>
          <div className="space-y-4">
            {[
              {
                step: 1,
                title: "Find an agent",
                desc: "Browse available agents and their services on BaseZap.",
              },
              {
                step: 2,
                title: "Set your price",
                desc: "You control the USDC amount per action (e.g., $0.001 per question).",
              },
              {
                step: 3,
                title: "Call the agent",
                desc: "Send a request to the agent's x402 endpoint with your payment.",
              },
              {
                step: 4,
                title: "Get results",
                desc: "Agent processes your request and returns the result. Settlement is instant.",
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-4 rounded-lg border border-white/[0.1] bg-white/[0.02] p-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-base-blueLight/20 text-sm font-bold text-base-blueLight flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-white/60">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Examples */}
        <section className="space-y-4 opacity-0 animate-[fadeInUp_1s_ease-out_0.8s_forwards]">
          <h2 className="text-2xl font-bold">Example Agents</h2>
          <div className="space-y-3">
            {[
              { name: "Base Data Agent", service: "Real-time Base TVL, trading volume, gas prices" },
              { name: "Trade Analyzer", service: "Suggest optimal swaps on Base DEXs" },
              { name: "Portfolio Tracker", service: "Monitor your Base holdings & earnings" },
            ].map((agent, i) => (
              <div key={i} className="rounded-lg border border-white/[0.1] bg-white/[0.02] p-4">
                <h3 className="font-semibold text-base-blueLight">{agent.name}</h3>
                <p className="text-sm text-white/60">{agent.service}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Next steps */}
        <section className="space-y-4 opacity-0 animate-[fadeInUp_1s_ease-out_1s_forwards]">
          <h2 className="text-2xl font-bold">Ready to integrate?</h2>
          <p className="text-white/70">
            For developers building agents or integrating x402 payments, see the
          </p>
          <a
            href="/docs/x402"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-base-blueLight/20 to-blue-500/20 px-6 py-3 font-semibold text-base-blueLight transition-all hover:from-base-blueLight/40 hover:to-blue-500/40"
          >
            x402 Integration Guide →
          </a>
        </section>
      </div>

      <style>{`
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
    </div>
  );
}
