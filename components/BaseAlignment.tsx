/**
 * "Built for Base's future"
 *
 * Maps BaseZap's features to Jesse Pollak's July 2026 three-pillar vision:
 * "Build Base into the blockchain for global finance."
 *
 * 1. Trading — $ZAP token + DexScreener integration
 * 2. Payments — USDC tipping, stablecoin transfers for agents
 * 3. AI Agents — x402-gated services, agentic wallet infrastructure
 *
 * Each pillar is already live in BaseZap.
 */

const PILLARS = [
  {
    icon: "⚡",
    title: "Trading",
    description:
      "$ZAP token live on Base mainnet with real utility — holders get 0% platform fees. DexScreener integration for live price discovery.",
    status: "Live",
  },
  {
    icon: "💳",
    title: "Payments",
    description:
      "USDC, VVV, and DIEM tipping directly to any Base or Farcaster user. Agent-native payment endpoints for autonomous stablecoin transfers.",
    status: "Live",
  },
  {
    icon: "🤖",
    title: "AI Agents",
    description:
      "x402-gated agent APIs for username resolution and tip calldata generation. MCP server for tool discovery. Built for agentic wallet infrastructure.",
    status: "Live",
  },
];

export function BaseAlignment() {
  return (
    <section className="mt-14 px-5">
      <div className="mx-auto max-w-md">
        <p className="text-center text-[11px] font-semibold uppercase tracking-wide text-white/35">
          Built for Base&apos;s future
        </p>
        <h2 className="mt-2 text-center font-display text-2xl font-bold text-white">
          The blockchain for global finance
        </h2>
        <p className="mt-2 text-center text-sm text-white/45">
          Jesse Pollak&apos;s vision — three pillars, all addressed by BaseZap today.
        </p>

        <div className="mt-7 space-y-3">
          {PILLARS.map((p) => (
            <div key={p.title} className="glass-card p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{p.icon}</span>
                  <p className="font-display text-sm font-bold text-white">
                    {p.title}
                  </p>
                </div>
                <span className="rounded-full bg-base-blue/15 px-2.5 py-0.5 text-[10px] font-semibold text-base-blueLight">
                  {p.status}
                </span>
              </div>
              <p className="mt-2 text-sm text-white/50">
                {p.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
