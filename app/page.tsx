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
    <span
      aria-hidden="true"
      className="transition-transform duration-200 group-hover:translate-x-1"
    >
      →
    </span>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-noise-grid">
      <style>{`
        @keyframes aperture-breathe {
          0%, 100% {
            transform: scale(1);
            filter: drop-shadow(0 0 18px rgba(47,107,255,.18));
          }
          50% {
            transform: scale(1.025);
            filter: drop-shadow(0 0 34px rgba(47,107,255,.38));
          }
        }

        @keyframes aperture-orbit {
          0%, 100% {
            opacity: .45;
          }
          50% {
            opacity: .9;
          }
        }

        .aperture-hero {
          animation: aperture-breathe 5s ease-in-out infinite;
        }

        .aperture-signal {
          animation: aperture-orbit 3s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .aperture-hero,
          .aperture-signal {
            animation: none;
          }
        }
      `}</style>

      <header className="relative z-20 border-b border-white/[0.06] bg-surface-void/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <a href="/" className="flex items-center gap-2.5">
            <img
              src="/brand/basezap-emblem-color.svg"
              alt=""
              aria-hidden="true"
              className="h-8 w-8"
            />
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

      <section className="relative px-5 pb-24 pt-16 sm:px-8 sm:pb-32 sm:pt-20">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[760px] bg-[radial-gradient(circle_at_50%_15%,rgba(47,107,255,0.14),transparent_58%)]" />
        <div className="pointer-events-none absolute left-1/2 top-32 h-[460px] w-[460px] -translate-x-1/2 rounded-full bg-base-blue/10 blur-[140px]" />

        <div className="relative mx-auto max-w-6xl">
          <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
            <a
              href="/now"
              aria-label="Explore BaseNow"
              className="group relative mb-10 block rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-base-blueLight focus-visible:ring-offset-8 focus-visible:ring-offset-[#050709]"
            >
              <div className="pointer-events-none absolute inset-[-34px] rounded-full bg-base-blue/10 blur-3xl transition duration-500 group-hover:bg-base-blue/20" />
              <div className="aperture-signal pointer-events-none absolute inset-[-12px] rounded-full border border-base-blueLight/10" />
              <img
                src="/brand/basezap-emblem-color.svg"
                alt="BaseZap Aperture Z"
                className="aperture-hero relative h-44 w-44 transition duration-500 group-hover:scale-[1.06] sm:h-56 sm:w-56 lg:h-64 lg:w-64"
              />
            </a>

            <p className="animate-fade-up text-[10px] font-semibold uppercase tracking-[0.28em] text-base-blueLight/80">
              BaseZap · Base Mainnet
            </p>

            <h1 className="mt-5 max-w-4xl font-display text-[3.4rem] font-bold leading-[0.92] tracking-[-0.055em] text-white sm:text-7xl lg:text-[6.5rem]">
              The interaction
              <br />
              layer for{" "}
              <span className="bg-gradient-to-r from-base-blueLight via-white to-white/45 bg-clip-text text-transparent">
                Base.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-7 text-white/50 sm:text-lg">
              See what is happening on Base. Discover people, projects,
              agents, and activity — then decide where to go next.
            </p>

            <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
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

            <div className="mt-14 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/25">
              <span className="text-base-blueLight/70">See</span>
              <span>→</span>
              <span>Explore</span>
              <span>→</span>
              <span>Interact</span>
            </div>
          </div>

          <div className="mt-20 grid gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.08] sm:grid-cols-3">
            {[
              ["01", "SEE", "Signals show you where something is happening."],
              ["02", "EXPLORE", "Follow the people, projects, and agents behind it."],
              ["03", "INTERACT", "Move from discovery to an onchain action."],
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
              Choose a direction. Go deeper only when something catches your
              attention.
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
        <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_50%_100%,rgba(47,107,255,0.14),transparent_65%)]" />

        <div className="relative mx-auto max-w-4xl text-center">
          <img
            src="/brand/basezap-emblem-color.svg"
            alt=""
            aria-hidden="true"
            className="mx-auto mb-8 h-16 w-16 opacity-80"
          />

          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-base-blueLight/70">
            Enter BaseZap
          </p>

          <h2 className="mt-4 font-display text-4xl font-bold tracking-[-0.045em] text-white sm:text-6xl">
            Discover first.
            <br />
            Then act.
          </h2>

          <p className="mx-auto mt-5 max-w-lg text-sm leading-6 text-white/40 sm:text-base">
            Explore the Base economy, find a signal worth following, and move
            into the application when you are ready.
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
