import { Footer } from "@/components/Footer";

const destinations = [
  {
    index: "01",
    eyebrow: "DISCOVERY LAYER",
    title: "BaseNow",
    description:
      "The discovery layer we are building for the Base economy — projects, launches, agents, people, and meaningful onchain activity.",
    href: "/now",
    action: "Explore BaseNow",
  },
  {
    index: "02",
    eyebrow: "ONCHAIN SUPPORT",
    title: "Zaps",
    description:
      "Send onchain support directly on Base. Simple interactions, transparent settlement, and verifiable transactions.",
    href: "/zap",
    action: "Explore Zaps",
  },
  {
    index: "03",
    eyebrow: "AI + X402",
    title: "Agents",
    description:
      "Discover the emerging agent economy on Base — where AI services can become programmable, discoverable, and payable.",
    href: "/agents",
    action: "Explore Agents",
  },
  {
    index: "04",
    eyebrow: "BASEZAP UTILITY",
    title: "$ZAP",
    description:
      "The BaseZap ecosystem token. Hold 100+ $ZAP today to unlock 0% platform fees on your tips.",
    href: "/ecosystem",
    action: "Explore $ZAP",
  },
  {
    index: "05",
    eyebrow: "AI ECOSYSTEM",
    title: "Venice",
    description:
      "Explore the Venice connection — private AI, staking, credits, and the wider ecosystem around intelligent onchain applications.",
    href: "/venice",
    action: "Explore Venice",
  },
];

function Arrow() {
  return (
    <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">
      →
    </span>
  );
}

export default function Home() {
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

      <section className="relative px-5 pb-24 pt-24 sm:px-8 sm:pb-32 sm:pt-32">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[620px] bg-[radial-gradient(circle_at_50%_0%,rgba(0,82,255,0.20),transparent_62%)]" />
        <div className="pointer-events-none absolute left-1/2 top-24 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-base-blue/10 blur-[120px]" />

        <div className="relative mx-auto max-w-6xl">
          <div className="max-w-4xl">
            <p className="animate-fade-up text-[10px] font-semibold uppercase tracking-[0.24em] text-base-blueLight/80">
              BaseZap · Base Mainnet
            </p>

            <h1 className="mt-6 max-w-4xl font-display text-[3.5rem] font-bold leading-[0.91] tracking-[-0.055em] text-white sm:text-7xl lg:text-[6.8rem]">
              The interaction
              <br />
              layer for{" "}
              <span className="bg-gradient-to-r from-base-blueLight via-white to-white/45 bg-clip-text text-transparent">
                Base.
              </span>
            </h1>

            <p className="mt-8 max-w-2xl text-base leading-7 text-white/45 sm:text-lg">
              Discover what is happening. Support people. Pay agents.
              Explore the Base economy through one simple entry point.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href="/now"
                className="btn-primary inline-flex items-center justify-center gap-2 !py-3.5 px-6 text-sm"
              >
                Explore BaseNow <Arrow />
              </a>
              <a
                href="/app"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.10] bg-white/[0.025] px-6 py-3.5 text-sm font-semibold text-white/75 transition hover:border-white/[0.18] hover:bg-white/[0.05] hover:text-white"
              >
                Open BaseZap App <Arrow />
              </a>
            </div>
          </div>

          <div className="mt-20 grid gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.08] sm:grid-cols-3">
            {[
              ["01", "DISCOVER", "Signals become places to explore."],
              ["02", "UNDERSTAND", "Follow the people, projects, and agents behind them."],
              ["03", "ACT", "Move from information to an onchain action."],
            ].map(([number, label, text]) => (
              <div key={number} className="bg-[#05070b]/95 px-5 py-6 sm:px-6">
                <p className="font-mono text-[10px] text-base-blueLight/60">
                  {number}
                </p>
                <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35">
                  {label}
                </p>
                <p className="mt-2 max-w-xs text-sm leading-6 text-white/60">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/[0.06] px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-base-blueLight/70">
                Explore the network
              </p>
              <h2 className="mt-3 max-w-2xl font-display text-3xl font-bold tracking-[-0.035em] text-white sm:text-5xl">
                One hub. Multiple ways to enter Base.
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-white/35">
              Each destination goes deeper into a specific part of the
              BaseZap ecosystem.
            </p>
          </div>

          <div className="mt-12 divide-y divide-white/[0.07] border-y border-white/[0.07]">
            {destinations.map((destination) => (
              <a
                key={destination.index}
                href={destination.href}
                className="group grid gap-5 py-7 transition hover:bg-white/[0.015] sm:grid-cols-[70px_190px_1fr_auto] sm:items-center sm:gap-7"
              >
                <span className="font-mono text-[10px] text-white/20">
                  {destination.index}
                </span>

                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-base-blueLight/65">
                    {destination.eyebrow}
                  </p>
                  <h3 className="mt-1 font-display text-xl font-bold tracking-tight text-white">
                    {destination.title}
                  </h3>
                </div>

                <p className="max-w-xl text-sm leading-6 text-white/40">
                  {destination.description}
                </p>

                <span className="inline-flex items-center gap-2 whitespace-nowrap text-xs font-semibold text-white/45 transition group-hover:text-white">
                  {destination.action} <Arrow />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="relative px-5 py-24 sm:px-8 sm:py-32">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_50%_100%,rgba(0,82,255,0.14),transparent_65%)]" />

        <div className="relative mx-auto max-w-4xl text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-base-blueLight/70">
            Enter BaseZap
          </p>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-[-0.045em] text-white sm:text-6xl">
            Discover first.
            <br />
            Then act.
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-sm leading-6 text-white/40 sm:text-base">
            Explore the Base economy, find a signal worth following, and
            move into the application when you are ready.
          </p>

          <a
            href="/app"
            className="btn-primary mt-8 inline-flex items-center gap-2 !py-3.5 px-7 text-sm"
          >
            Launch BaseZap <Arrow />
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
