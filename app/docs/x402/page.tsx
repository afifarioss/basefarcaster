"use client";

export default function X402Page() {
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
            x402 Integration Guide
          </h1>
          <p className="text-lg text-white/60">
            Build pay-per-action services and agent workflows on Base.
          </p>
        </div>

        {/* What is x402? */}
        <section className="space-y-4 opacity-0 animate-[fadeInUp_1s_ease-out_0.4s_forwards]">
          <h2 className="text-2xl font-bold">What is x402?</h2>
          <p className="leading-relaxed text-white/70">
            x402 is a payment protocol for HTTP services. It lets an API or
            agent service require payment before returning a result, making
            small pay-per-action payments practical.
          </p>
          <p className="leading-relaxed text-white/70">
            On BaseZap, x402 is used for paid agent infrastructure. A caller
            pays the required service price in USDC, the request is processed,
            and the service returns its result or generated transaction data.
          </p>
        </section>

        {/* BaseZap x402 endpoints */}
        <section className="space-y-6 opacity-0 animate-[fadeInUp_1s_ease-out_0.6s_forwards]">
          <h2 className="text-2xl font-bold">BaseZap x402 services</h2>

          <div className="space-y-4">
            <div className="rounded-lg border border-white/[0.1] bg-white/[0.02] p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-semibold">Build tip calldata</h3>
                <span className="rounded-full border border-white/[0.1] px-2 py-1 text-[11px] text-white/50">
                  $0.001 USDC
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-white/60">
                Build unsigned ERC-20 transfer calldata for a BaseZap tip.
                The service does not hold keys or broadcast the transaction.
              </p>
              <code className="mt-3 block break-all text-xs text-base-blueLight/80">
                POST /api/agent/build-tip-calldata
              </code>
            </div>

            <div className="rounded-lg border border-white/[0.1] bg-white/[0.02] p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-semibold">Resolve Farcaster username</h3>
                <span className="rounded-full border border-white/[0.1] px-2 py-1 text-[11px] text-white/50">
                  $0.001 USDC
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-white/60">
                Resolve a Farcaster username into the associated user identity
                and wallet information for agent workflows.
              </p>
              <code className="mt-3 block break-all text-xs text-base-blueLight/80">
                GET /api/agent/resolve-username
              </code>
            </div>
          </div>
        </section>

        {/* Payment model */}
        <section className="space-y-4 opacity-0 animate-[fadeInUp_1s_ease-out_0.8s_forwards]">
          <h2 className="text-2xl font-bold">Payment model</h2>
          <p className="leading-relaxed text-white/70">
            BaseZap separates the payment for an agent service from the
            payment represented by a generated tip. The x402 service charge
            pays for BaseZap's agent endpoint. If the endpoint builds a tip,
            that tip follows BaseZap's normal platform-fee model.
          </p>

          <div className="rounded-lg border border-white/[0.1] bg-white/[0.02] p-6">
            <div className="space-y-3">
              <div className="flex justify-between gap-4">
                <span className="text-white/70">Agent service charge:</span>
                <span className="font-semibold">$0.001 USDC</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-white/70">Tip platform fee:</span>
                <span className="font-semibold">2%</span>
              </div>
              <div className="border-t border-white/[0.1] pt-3">
                <p className="text-sm leading-relaxed text-white/60">
                  The $0.001 x402 charge and the 2% tip fee are separate. The
                  x402 charge is for using the paid agent service; the 2% fee
                  is included in the tip transaction generated by
                  <code className="mx-1 text-base-blueLight/80">
                    build-tip-calldata
                  </code>
                  .
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="space-y-6 opacity-0 animate-[fadeInUp_1s_ease-out_1s_forwards]">
          <h2 className="text-2xl font-bold">How it works</h2>

          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold">1. Discover the service</h3>
              <p className="text-sm leading-relaxed text-white/60">
                Your application or agent identifies the BaseZap endpoint it
                needs and its published price.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">2. Pay with x402</h3>
              <p className="text-sm leading-relaxed text-white/60">
                The caller pays the required $0.001 USDC service charge on
                Base.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">3. Receive the result</h3>
              <p className="text-sm leading-relaxed text-white/60">
                BaseZap processes the request and returns the requested data
                or unsigned transaction calldata.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">4. Execute when appropriate</h3>
              <p className="text-sm leading-relaxed text-white/60">
                For tip calldata, the caller remains responsible for signing
                and broadcasting the transaction. BaseZap does not custody the
                caller's funds or private keys.
              </p>
            </div>
          </div>
        </section>

        {/* Example flow */}
        <section className="space-y-4 opacity-0 animate-[fadeInUp_1s_ease-out_1.2s_forwards]">
          <h2 className="text-2xl font-bold">Example agent flow</h2>

          <div className="rounded-lg border border-white/[0.1] bg-white/[0.02] p-6">
            <div className="space-y-3 text-sm text-white/70">
              <p>
                <span className="font-semibold text-white">Agent</span> needs
                to tip a creator.
              </p>
              <p className="text-center text-white/30">↓</p>
              <p>
                <span className="font-semibold text-white">Agent</span> calls
                BaseZap's paid calldata service.
              </p>
              <p className="text-center text-white/30">↓</p>
              <p>
                <span className="font-semibold text-white">x402</span> settles
                the $0.001 USDC service charge.
              </p>
              <p className="text-center text-white/30">↓</p>
              <p>
                <span className="font-semibold text-white">BaseZap</span>{" "}
                returns unsigned USDC transfer calldata.
              </p>
              <p className="text-center text-white/30">↓</p>
              <p>
                <span className="font-semibold text-white">Caller</span>{" "}
                signs and broadcasts the transaction on Base.
              </p>
            </div>
          </div>
        </section>

        {/* Important distinction */}
        <section className="space-y-4 opacity-0 animate-[fadeInUp_1s_ease-out_1.4s_forwards]">
          <h2 className="text-2xl font-bold">Important distinction</h2>
          <p className="leading-relaxed text-white/70">
            x402 pays for access to a paid HTTP service. It is not the same as
            the platform fee applied to a BaseZap tip.
          </p>
          <p className="leading-relaxed text-white/70">
            The current agent calldata endpoint cannot apply the human
            $ZAP-holder fee exemption because the endpoint does not receive
            wallet ownership information for the payer. Agent requests
            therefore use the standard 2% tip fee.
          </p>
        </section>

        {/* Best Practices */}
        <section className="space-y-4 opacity-0 animate-[fadeInUp_1s_ease-out_1.6s_forwards]">
          <h2 className="text-2xl font-bold">Best Practices</h2>
          <ul className="space-y-2 text-white/70">
            <li className="flex gap-3">
              <span className="text-base-blueLight">✓</span>
              <span>Document the price of every paid service clearly.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-base-blueLight">✓</span>
              <span>Return clear, structured responses.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-base-blueLight">✓</span>
              <span>Keep service response times predictable.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-base-blueLight">✓</span>
              <span>Never require callers to provide private keys.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-base-blueLight">✓</span>
              <span>Validate inputs before constructing transaction data.</span>
            </li>
          </ul>
        </section>

        {/* Next steps */}
        <section className="space-y-4 opacity-0 animate-[fadeInUp_1s_ease-out_1.8s_forwards]">
          <h2 className="text-2xl font-bold">Explore BaseZap agents</h2>
          <p className="text-white/70">
            Learn how BaseZap is building payment infrastructure for agents
            and pay-per-action services on Base.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href="/docs/agents"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-base-blueLight/20 to-blue-500/20 px-6 py-3 font-semibold text-base-blueLight transition-all hover:from-base-blueLight/40 hover:to-blue-500/40"
            >
              Agent Marketplace →
            </a>
            <a
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/[0.1] px-6 py-3 font-semibold text-white/60 transition-all hover:border-white/[0.2] hover:text-white"
            >
              Back to BaseZap
            </a>
          </div>
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
