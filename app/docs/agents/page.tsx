"use client";

export default function AgentsPage() {
  return (
    <div className="min-h-screen bg-black px-5 py-16 text-white">
      <div className="mx-auto max-w-2xl space-y-12">
        {/* Header */}
        <div className="space-y-4 opacity-0 animate-[fadeInUp_1s_ease-out_0.2s_forwards]">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white/70"
          >
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
            AI agents are autonomous software systems that can call APIs,
            process information, interact with wallets, and execute
            transactions on Base. They can use payment protocols such as x402
            to operate on a pay-per-action model.
          </p>
          <p className="leading-relaxed text-white/70">
            BaseZap provides infrastructure for agent workflows that need
            payment-aware services on Base. Service charges and BaseZap tip
            fees are separate parts of the payment model.
          </p>
        </section>

        {/* How it works */}
        <section className="space-y-6 opacity-0 animate-[fadeInUp_1s_ease-out_0.6s_forwards]">
          <h2 className="text-2xl font-bold">How it works</h2>
          <div className="space-y-4">
            {[
              {
                step: 1,
                title: "Find an agent service",
                desc: "Identify the agent or pay-per-action service your application needs.",
              },
              {
                step: 2,
                title: "Review the price",
                desc: "Check the service's published x402 price before making the request.",
              },
              {
                step: 3,
                title: "Call the service",
                desc: "Send a request to the agent's x402 endpoint and settle the required payment.",
              },
              {
                step: 4,
                title: "Use the result",
                desc: "The agent processes the request and returns its result or transaction data.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="flex gap-4 rounded-lg border border-white/[0.1] bg-white/[0.02] p-4"
              >
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-base-blueLight/20 text-sm font-bold text-base-blueLight">
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

        {/* BaseZap services */}
        <section className="space-y-4 opacity-0 animate-[fadeInUp_1s_ease-out_0.8s_forwards]">
          <h2 className="text-2xl font-bold">BaseZap agent services</h2>
          <div className="space-y-3">
            {[
              {
                name: "Build Tip Calldata",
                service:
                  "Generate unsigned USDC transfer calldata for a BaseZap tip.",
                price: "$0.001 USDC",
              },
              {
                name: "Resolve Farcaster Username",
                service:
                  "Resolve a Farcaster username into associated identity and wallet information.",
                price: "$0.001 USDC",
              },
            ].map((agent) => (
              <div
                key={agent.name}
                className="rounded-lg border border-white/[0.1] bg-white/[0.02] p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-semibold text-base-blueLight">
                    {agent.name}
                  </h3>
                  <span className="rounded-full border border-white/[0.1] px-2 py-1 text-[11px] text-white/50">
                    {agent.price}
                  </span>
                </div>
                <p className="mt-1 text-sm text-white/60">
                  {agent.service}
                </p>
              </div>
            ))}
          </div>
          <p className="text-xs leading-relaxed text-white/40">
            These are BaseZap's current agent-facing services. The broader
            agent marketplace is an expanding infrastructure and discovery
            layer rather than a claim that every example agent is currently
            live.
          </p>
        </section>

        {/* Payment model */}
        <section className="space-y-4 opacity-0 animate-[fadeInUp_1s_ease-out_1s_forwards]">
          <h2 className="text-2xl font-bold">Payment model</h2>
          <p className="leading-relaxed text-white/70">
            BaseZap separates the cost of using a paid agent service from the
            fee applied to a BaseZap tip generated by that service.
          </p>

          <div className="rounded-lg border border-white/[0.1] bg-white/[0.02] p-6">
            <div className="space-y-3">
              <div className="flex justify-between gap-4">
                <span className="text-white/70">Agent service charge:</span>
                <span className="font-semibold">$0.001 USDC</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-white/70">Standard tip platform fee:</span>
                <span className="font-semibold">2%</span>
              </div>
              <div className="border-t border-white/[0.1] pt-3">
                <p className="text-sm leading-relaxed text-white/60">
                  The $0.001 x402 service charge pays for access to a paid
                  BaseZap agent endpoint. If that endpoint generates tip
                  calldata, the resulting tip uses the standard 2% platform
                  fee model.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Security model */}
        <section className="space-y-4 opacity-0 animate-[fadeInUp_1s_ease-out_1.2s_forwards]">
          <h2 className="text-2xl font-bold">Non-custodial by design</h2>
          <p className="leading-relaxed text-white/70">
            BaseZap's agent calldata service returns unsigned transaction
            data. It does not hold the caller's private keys or broadcast the
            resulting transaction on the caller's behalf.
          </p>
          <p className="leading-relaxed text-white/70">
            The caller or its wallet remains responsible for reviewing,
            signing, and broadcasting transactions.
          </p>
        </section>

        {/* Important distinction */}
        <section className="space-y-4 opacity-0 animate-[fadeInUp_1s_ease-out_1.4s_forwards]">
          <h2 className="text-2xl font-bold">Important distinction</h2>
          <p className="leading-relaxed text-white/70">
            The human BaseZap tipping interface can provide a 0% platform fee
            to qualifying $ZAP holders. The current agent calldata endpoint
            cannot verify payer wallet ownership for that exemption, so agent
            requests use the standard 2% tip fee.
          </p>
        </section>

        {/* Next steps */}
        <section className="space-y-4 opacity-0 animate-[fadeInUp_1s_ease-out_1.6s_forwards]">
          <h2 className="text-2xl font-bold">Ready to integrate?</h2>
          <p className="text-white/70">
            For developers building agents or integrating x402 payments, see
            the BaseZap integration guide.
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
