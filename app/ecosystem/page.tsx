import { Footer } from "@/components/Footer";
import { ZAP_HOLDER_THRESHOLD, ZAP_TOKEN_ADDRESS } from "@/lib/constants";

const pillars = [
  {
    number: "01",
    title: "$ZAP",
    eyebrow: "BASEZAP UTILITY",
    description:
      "The utility layer around BaseZap. Hold 100+ $ZAP today to unlock 0% platform fees on your tips.",
  },
  {
    number: "02",
    title: "Venice",
    eyebrow: "PRIVATE AI",
    description:
      "Explore the Venice connection across private AI, staking, credits, and intelligent onchain applications.",
  },
  {
    number: "03",
    title: "Ecosystem",
    eyebrow: "WHAT COMES NEXT",
    description:
      "The longer-term direction is a connected ecosystem where people, agents, applications, and onchain activity can interact.",
  },
];

export default function EcosystemPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-noise-grid">
      <header className="relative z-20 border-b border-white/[0.06] bg-surface-void/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <a href="/" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-base-blue/60 bg-base-blue shadow-lg shadow-base-blue/20">
              <span className="font-display text-sm font-bold text-white">Z</span>
            </span>
            <span className="font-display text-[15px] font-bold tracking-tight text-white">
              BaseZap
            </span>
          </a>

          <a
            href="/app"
            className="rounded-lg border border-white/[0.10] bg-white/[0.035] px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/70 transition hover:border-base-blueLight/30 hover:bg-white/[0.06] hover:text-white"
          >
            Open App →
          </a>
        </div>
      </header>

      <section className="relative px-5 pb-20 pt-24 sm:px-8 sm:pb-28 sm:pt-32">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[560px] bg-[radial-gradient(circle_at_50%_0%,rgba(0,82,255,0.18),transparent_65%)]" />

        <div className="relative mx-auto max-w-6xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-base-blueLight/80">
            BaseZap · Ecosystem
          </p>

          <h1 className="mt-6 max-w-4xl font-display text-5xl font-bold leading-[0.94] tracking-[-0.05em] text-white sm:text-7xl lg:text-[6rem]">
            The utility
            <br />
            behind the{" "}
            <span className="bg-gradient-to-r from-base-blueLight via-white to-white/45 bg-clip-text text-transparent">
              network.
            </span>
          </h1>

          <p className="mt-8 max-w-2xl text-base leading-7 text-white/45 sm:text-lg">
            Explore $ZAP, the Venice connection, and the ecosystem direction
            around BaseZap.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href="#zap"
              className="btn-primary inline-flex items-center justify-center gap-2 !py-3.5 px-6 text-sm"
            >
              Explore $ZAP →
            </a>
            <a
              href="/venice"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.10] bg-white/[0.025] px-6 py-3.5 text-sm font-semibold text-white/75 transition hover:border-white/[0.18] hover:bg-white/[0.05] hover:text-white"
            >
              Explore Venice →
            </a>
          </div>
        </div>
      </section>

      <section className="border-y border-white/[0.06] px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.08] md:grid-cols-3">
          {pillars.map((pillar) => (
            <div key={pillar.number} className="bg-[#05070b]/95 p-6 sm:p-8">
              <p className="font-mono text-[10px] text-base-blueLight/60">
                {pillar.number}
              </p>
              <p className="mt-8 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/30">
                {pillar.eyebrow}
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold text-white">
                {pillar.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-white/40">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="zap" className="px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-[1fr_0.8fr] lg:items-center">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-base-blueLight/70">
                Live utility
              </p>

              <h2 className="mt-4 font-display text-4xl font-bold tracking-[-0.04em] text-white sm:text-5xl">
                $ZAP
              </h2>

              <p className="mt-5 max-w-xl text-sm leading-7 text-white/45 sm:text-base">
                $ZAP is the BaseZap ecosystem token. The utility that is live
                today is simple: qualifying holders receive a 0% platform fee
                on BaseZap tips.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <div className="glass-card px-4 py-3">
                  <p className="font-display text-xl font-bold text-white">
                    {ZAP_HOLDER_THRESHOLD}+
                  </p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-white/30">
                    $ZAP required
                  </p>
                </div>

                <div className="glass-card px-4 py-3">
                  <p className="font-display text-xl font-bold text-white">
                    0%
                  </p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-white/30">
                    platform fee
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-card p-6 sm:p-8">
              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/30">
                Contract
              </p>
              <p className="mt-3 break-all font-mono text-xs leading-6 text-white/55">
                {ZAP_TOKEN_ADDRESS}
              </p>

              <a
                href={`https://basescan.org/token/${ZAP_TOKEN_ADDRESS}`}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex text-xs font-semibold text-base-blueLight transition hover:text-white"
              >
                View on BaseScan →
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/[0.06] px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-base-blueLight/70">
              Future direction
            </p>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-[-0.035em] text-white sm:text-5xl">
              More than a fee discount.
            </h2>
            <p className="mt-5 text-sm leading-7 text-white/40 sm:text-base">
              Additional $ZAP utility may evolve as the BaseZap ecosystem
              grows. Future ideas are not presented as live features until
              they are actually shipped.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              ["Agent economy", "Connect people and agents through programmable interactions."],
              ["Discovery", "Give meaningful activity a path from signal to action."],
              ["Ecosystem access", "Build deeper connections across Base and Venice."],
            ].map(([title, text]) => (
              <div key={title} className="glass-card p-6">
                <h3 className="font-display text-lg font-bold text-white">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-white/35">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative px-5 py-24 sm:px-8 sm:py-32">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_50%_100%,rgba(0,82,255,0.14),transparent_65%)]" />

        <div className="relative mx-auto max-w-4xl text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-base-blueLight/70">
            Continue exploring
          </p>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-[-0.045em] text-white sm:text-6xl">
            Discover the
            <br />
            BaseZap ecosystem.
          </h2>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href="/now"
              className="btn-primary inline-flex items-center justify-center gap-2 !py-3.5 px-7 text-sm"
            >
              Explore BaseNow →
            </a>
            <a
              href="/app"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.10] bg-white/[0.025] px-7 py-3.5 text-sm font-semibold text-white/70 transition hover:border-white/[0.18] hover:bg-white/[0.05] hover:text-white"
            >
              Open BaseZap App →
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
