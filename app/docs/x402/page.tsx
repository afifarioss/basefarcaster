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
            Build agent-powered payment flows on Base.
          </p>
        </div>

        {/* What is x402? */}
        <section className="space-y-4 opacity-0 animate-[fadeInUp_1s_ease-out_0.4s_forwards]">
          <h2 className="text-2xl font-bold">What is x402?</h2>
          <p className="leading-relaxed text-white/70">
            x402 is the payment layer BaseZap uses to expose paid agent
            capabilities over HTTP. Agents can pay for a successful API
            response with USDC on Base instead of relying on subscriptions or
            application accounts.
          </p>
          <p className="leading-relaxed text-white/70">
            BaseZap currently exposes paid endpoints for{" "}
            <span className="font-semibold text-white">
              Farcaster identity resolution
            </span>{" "}
            and{" "}
            <span className="font-semibold text-white">
              unsigned USDC tip calldata
            </span>
            .
          </p>
        </section>

        {/* Agent endpoints */}
        <section className="space-y-6 opacity-0 animate-[fadeInUp_1s_ease-out_0.6s_forwards]">
          <h2 className="text-2xl font-bold">Agent endpoints</h2>

          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="font-semibold">
                1. Resolve a Farcaster user
              </h3>
              <p className="leading-relaxed text-white/70">
                Resolve a Farcaster username or FID to a verified wallet
                address on Base.
              </p>
              <pre className="overflow-x-auto rounded-lg border border-white/[0.1] bg-white/[0.02] p-4 text-sm text-white/80">
{`GET /api/agent/resolve-username?username=afifarioss`}
              </pre>
              <p className="text-sm text-white/50">
                Price: $0.001 USDC per successful request.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">
                2. Build tip transaction calldata
              </h3>
              <p className="leading-relaxed text-white/70">
                Build unsigned USDC transfer calldata for a BaseZap tip. The
                response contains the creator transfer and the BaseZap platform
                fee transfer.
              </p>
              <pre className="overflow-x-auto rounded-lg border border-white/[0.1] bg-white/[0.02] p-4 text-sm text-white/80">
{`POST /api/agent/build-tip-calldata

{
  "recipient": "0x...",
  "amount_usdc": 1
}`}
              </pre>
              <p className="text-sm text-white/50">
                Price: $0.001 USDC per successful request.
              </p>
            </div>
          </div>
        </section>

        {/* Example request */}
        <section className="space-y-4 opacity-0 animate-[fadeInUp_1s_ease-out_0.8s_forwards]">
          <h2 className="text-2xl font-bold">Calling a paid endpoint</h2>
          <p className="leading-relaxed text-white/70">
            An agent sends its request normally. The x402 flow handles payment
            authorization and settlement when the endpoint returns
            successfully.
          </p>
          <pre className="overflow-x-auto rounded-lg border border-white/[0.1] bg-white/[0.02] p-4 text-sm text-white/80">
{`const response = await fetch(
  "https://basefarcaster.vercel.app/api/agent/resolve-username?username=afifarioss"
);

const result = await response.json();`}
          </pre>
          <p className="text-sm leading-relaxed text-white/50">
            Failed lookups return an error response and are not settled as
            successful x402 requests.
          </p>
        </section>

        {/* Tip economics */}
        <section className="space-y-4 opacity-0 animate-[fadeInUp_1s_ease-out_1s_forwards]">
          <h2 className="text-2xl font-bold">Tip economics</h2>
          <p className="leading-relaxed text-white/70">
            The x402 API fee and the tip amount are separate. The $0.001 x402
            charge pays for access to the paid agent endpoint. A tip generated
            through BaseZap follows BaseZap&apos;s tipping fee model.
          </p>

          <div className="rounded-lg border border-white/[0.1] bg-white/[0.02] p-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-white/70">Standard creator share:</span>
                <span className="font-semibold">98%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Standard platform fee:</span>
                <span className="font-semibold">2%</span>
              </div>
              <div className="border-t border-white/[0.1] pt-3 flex justify-between">
                <span className="text-white">Qualifying $ZAP holders:</span>
                <span className="font-semibold text-base-blueLight">
                  0% platform fee
                </span>
              </div>
            </div>
          </div>

          <p className="text-sm leading-relaxed text-white/50">
            The current agent calldata endpoint generates the standard 2%
            platform-fee split. The $ZAP holder benefit is supported by
            BaseZap&apos;s fee calculation for qualifying holders.
          </p>
        </section>

        {/* Security */}
        <section className="space-y-4 opacity-0 animate-[fadeInUp_1s_ease-out_1.2s_forwards]">
          <h2 className="text-2xl font-bold">Non-custodial by design</h2>
          <ul className="space-y-2 text-white/70">
            <li className="flex gap-3">
              <span className="text-base-blueLight">✓</span>
              <span>Agent endpoints do not hold user private keys</span>
            </li>
            <li className="flex gap-3">
              <span className="text-base-blueLight">✓</span>
              <span>Tip calldata is returned unsigned</span>
            </li>
            <li className="flex gap-3">
              <span className="text-base-blueLight">✓</span>
              <span>Transactions are not broadcast by the calldata endpoint</span>
            </li>
            <li className="flex gap-3">
              <span className="text-base-blueLight">✓</span>
              <span>Payments settle on Base</span>
            </li>
          </ul>
        </section>

        {/* Best practices */}
        <section className="space-y-4 opacity-0 animate-[fadeInUp_1s_ease-out_1.4s_forwards]">
          <h2 className="text-2xl font-bold">Best Practices</h2>
          <ul className="space-y-2 text-white/70">
            <li className="flex gap-3">
              <span className="text-base-blueLight">✓</span>
              <span>Validate recipient addresses before building transactions</span>
            </li>
            <li className="flex gap-3">
              <span className="text-base-blueLight">✓</span>
              <span>Use the returned calldata without modifying its destination or amount</span>
            </li>
            <li className="flex gap-3">
              <span className="text-base-blueLight">✓</span>
              <span>Handle unsuccessful API responses before relying on results</span>
            </li>
            <li className="flex gap-3">
              <span className="text-base-blueLight">✓</span>
              <span>Keep private keys in the agent&apos;s own wallet infrastructure</span>
            </li>
          </ul>
        </section>

        {/* Next steps */}
        <section className="space-y-4 opacity-0 animate-[fadeInUp_1s_ease-out_1.6s_forwards]">
          <h2 className="text-2xl font-bold">Ready to build?</h2>
          <p className="text-white/70">
            Use BaseZap&apos;s agent endpoints to discover Farcaster users and
            construct Base-native payment flows.
          </p>
          <a
            href="/docs/agents"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-base-blueLight/20 to-blue-500/20 px-6 py-3 font-semibold text-base-blueLight transition-all hover:from-base-blueLight/40 hover:to-blue-500/40"
          >
            Explore Agent APIs →
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
