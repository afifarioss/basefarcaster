import { TIP_PRESETS } from "@/lib/constants";

const flow = [
  {
    number: "01",
    title: "Find",
    text: "Resolve a person or choose a recipient you want to support.",
  },
  {
    number: "02",
    title: "Choose",
    text: `Start with ${TIP_PRESETS.map((amount) => `${amount} USDC`).join(", ")} or use a custom amount.`,
  },
  {
    number: "03",
    title: "Confirm",
    text: "Approve the onchain action in your wallet.",
  },
  {
    number: "04",
    title: "Settle",
    text: "The Zap is recorded on Base and can be publicly verified.",
  },
];

export default function ZapPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-noise-grid">
      <header className="border-b border-white/[0.06] bg-surface-void/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <a href="/" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-base-blue/60 bg-base-blue">
              <span className="font-display text-sm font-bold text-white">Z</span>
            </span>
            <span className="font-display text-[15px] font-bold text-white">
              BaseZap
            </span>
          </a>

          <div className="flex items-center gap-2">
            <a
              href="/"
              className="hidden rounded-lg px-3 py-2 text-[11px] font-semibold text-white/40 transition hover:text-white sm:block"
            >
              Home
            </a>
            <a
              href="/app"
              className="rounded-lg border border-white/[0.10] bg-white/[0.035] px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/70 transition hover:border-base-blueLight/30 hover:text-white"
            >
              Open App →
            </a>
          </div>
        </div>
      </header>

      <section className="relative px-5 pb-20 pt-20 sm:px-8 sm:pb-28 sm:pt-28">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[580px] bg-[radial-gradient(circle_at_50%_0%,rgba(0,82,255,0.18),transparent_65%)]" />

        <div className="relative mx-auto max-w-6xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-base-blueLight/75">
            Zaps · Onchain support
          </p>

          <h1 className="mt-6 max-w-4xl font-display text-[3.5rem] font-bold leading-[0.92] tracking-[-0.055em] text-white sm:text-7xl lg:text-[6.5rem]">
            Support someone
            <br />
            <span className="bg-gradient-to-r from-base-blueLight via-white to-white/45 bg-clip-text text-transparent">
              onchain.
            </span>
          </h1>

          <p className="mt-8 max-w-2xl text-base leading-7 text-white/45 sm:text-lg">
            A Zap is a simple way to send onchain support on Base. Choose a
            recipient, select an amount, confirm in your wallet, and let the
            transaction speak for itself.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href="/app"
              className="btn-primary inline-flex items-center justify-center gap-2 !py-3.5 px-6 text-sm"
            >
              Send a Zap →
            </a>
            <a
              href="/"
              className="inline-flex items-center justify-center rounded-xl border border-white/[0.10] bg-white/[0.025] px-6 py-3.5 text-sm font-semibold text-white/65 transition hover:border-white/[0.18] hover:text-white"
            >
              Back to BaseZap
            </a>
          </div>
        </div>
      </section>

      <section className="border-y border-white/[0.06] px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.08] sm:grid-cols-2 lg:grid-cols-4">
            {flow.map((item) => (
              <div key={item.number} className="bg-[#05070b]/95 p-7">
                <p className="font-mono text-[10px] text-base-blueLight/60">
                  {item.number}
                </p>
                <h2 className="mt-8 font-display text-xl font-bold text-white">
                  {item.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-white/40">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_0.8fr] lg:items-center">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-base-blueLight/70">
              Built for Base
            </p>
            <h2 className="mt-4 max-w-xl font-display text-3xl font-bold tracking-[-0.04em] text-white sm:text-5xl">
              Simple enough to use.
              <br />
              Onchain enough to verify.
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-6 text-white/40 sm:text-base">
              BaseZap keeps the interaction focused. The recipient, amount,
              wallet confirmation, and transaction are the important parts.
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">
              Supported today
            </p>

            <div className="mt-5 divide-y divide-white/[0.07]">
              {[
                ["Network", "Base Mainnet"],
                ["Primary asset", "USDC"],
                ["Other supported tokens", "VVV · DIEM"],
                ["Standard platform fee", "2%"],
                ["$ZAP benefit", "100+ holders pay 0%"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-4 py-4"
                >
                  <span className="text-xs text-white/35">{label}</span>
                  <span className="text-right text-xs font-semibold text-white/70">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/[0.06] px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-6xl rounded-2xl border border-base-blue/15 bg-base-blue/[0.035] p-7 sm:p-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-base-blueLight/65">
            BaseZap App
          </p>
          <div className="mt-3 flex flex-col justify-between gap-7 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
                Ready to send one?
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-white/40">
                Open the full application to resolve a recipient and make your
                first onchain Zap.
              </p>
            </div>

            <a
              href="/app"
              className="btn-primary inline-flex shrink-0 items-center justify-center gap-2 !py-3.5 px-6 text-sm"
            >
              Open BaseZap →
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/[0.06] px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between text-[10px] text-white/25">
          <span>Zaps · BaseZap</span>
          <a href="/" className="transition hover:text-white/55">
            Back home →
          </a>
        </div>
      </footer>
    </main>
  );
}
