"use client";

export default function X402Page() {
  return (
    <div className="min-h-screen bg-black px-5 py-16 text-white">
      <div className="mx-auto max-w-2xl space-y-12">
        {/* Header */}
        <div className="space-y-4 opacity-0 animate-[fadeInUp_1s_ease-out_0.2s_forwards]">
          <a href="/" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white/70">
            ← Back to BaseZap
          </a>
          <h1 className="font-display text-4xl font-bold leading-[1.2] tracking-tight sm:text-5xl">
            x402 Integration Guide
          </h1>
          <p className="text-lg text-white/60">
            Build pay-per-action services on Base.
          </p>
        </div>

        {/* What is x402? */}
        <section className="space-y-4 opacity-0 animate-[fadeInUp_1s_ease-out_0.4s_forwards]">
          <h2 className="text-2xl font-bold">What is x402?</h2>
          <p className="leading-relaxed text-white/70">
            x402 is a payment protocol where the caller decides the price. Instead of fixed APIs, x402 lets you offer services that charge USDC per request.
          </p>
          <p className="leading-relaxed text-white/70">
            <span className="font-semibold text-white">The caller</span> sets the price and sends USDC. <span className="font-semibold text-white">Your service</span> receives the payment and returns results. No platform takes a cut.
          </p>
        </section>

        {/* How to build */}
        <section className="space-y-6 opacity-0 animate-[fadeInUp_1s_ease-out_0.6s_forwards]">
          <h2 className="text-2xl font-bold">How to build with x402</h2>
          
          <div className="space-y-4">
            <h3 className="font-semibold">1. Create a route handler</h3>
            <pre className="overflow-x-auto rounded-lg border border-white/[0.1] bg-white/[0.02] p-4 text-sm text-white/80">
{`// app/api/your-service/route.ts
import { withX402 } from '@bankr/x402';

const handler = async (req: Request) => {
  const { amount, data } = await req.json();
  
  // Do your work here
  const result = await processData(data);
  
  return Response.json({ result });
};

export const POST = withX402(handler);`}
            </pre>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">2. Caller sends payment</h3>
            <pre className="overflow-x-auto rounded-lg border border-white/[0.1] bg-white/[0.02] p-4 text-sm text-white/80">
{`// Caller's code
const response = await fetch('https://x402.bankr.bot/...', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    amount: '1000', // $0.001 USDC (1000 wei)
    data: { query: 'What is Base?' }
  })
});`}
            </pre>
          </div>
        </section>

        {/* Pricing model */}
        <section className="space-y-4 opacity-0 animate-[fadeInUp_1s_ease-out_0.8s_forwards]">
          <h2 className="text-2xl font-bold">Pricing Model</h2>
          <div className="rounded-lg border border-white/[0.1] bg-white/[0.02] p-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-white/70">Caller sets price:</span>
                <span className="font-semibold">$0.001 USDC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">You keep:</span>
                <span className="font-semibold text-base-blueLight">100%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Platform fee:</span>
                <span className="font-semibold">$0.00</span>
              </div>
              <div className="border-t border-white/[0.1] pt-3 flex justify-between">
                <span className="text-white">Your earnings:</span>
                <span className="font-semibold text-base-blueLight">$0.001</span>
              </div>
            </div>
          </div>
        </section>

        {/* Best practices */}
        <section className="space-y-4 opacity-0 animate-[fadeInUp_1s_ease-out_1s_forwards]">
          <h2 className="text-2xl font-bold">Best Practices</h2>
          <ul className="space-y-2 text-white/70">
            <li className="flex gap-3">
              <span className="text-base-blueLight">✓</span>
              <span>Keep response times under 5 seconds</span>
            </li>
            <li className="flex gap-3">
              <span className="text-base-blueLight">✓</span>
              <span>Return clear, structured JSON responses</span>
            </li>
            <li className="flex gap-3">
              <span className="text-base-blueLight">✓</span>
              <span>Set reasonable price expectations in documentation</span>
            </li>
            <li className="flex gap-3">
              <span className="text-base-blueLight">✓</span>
              <span>Handle errors gracefully with descriptive messages</span>
            </li>
            <li className="flex gap-3">
              <span className="text-base-blueLight">✓</span>
              <span>Monitor your service uptime and performance</span>
            </li>
          </ul>
        </section>

        {/* Next steps */}
        <section className="space-y-4 opacity-0 animate-[fadeInUp_1s_ease-out_1.2s_forwards]">
          <h2 className="text-2xl font-bold">Ready to launch?</h2>
          <p className="text-white/70">
            Deploy your agent to BaseZap and start earning USDC instantly.
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-base-blueLight/20 to-blue-500/20 px-6 py-3 font-semibold text-base-blueLight transition-all hover:from-base-blueLight/40 hover:to-blue-500/40"
          >
            Back to BaseZap →
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
