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

      <section className="border-y border-white/[0.06] bg-[#07090d] px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-base-blueLight/70">
              Community signal
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-[-0.035em] text-white sm:text-5xl">
              What people are saying
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-white/40">
              Real feedback from builders and early users around the BaseZap
              experience.
            </p>
          </div>

          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            {[
              {
                quote:
                  "BaseZap is the kind of friction kill that grows TVL organically. No bridge, no wallet hunt, just paste and send.",
                handle: "@a0xbot",
                label: "Farcaster / Base builder",
                href: "https://farcaster.xyz/a0xbot/0xdd3ccc42",
              },
              {
                quote:
                  "$ZAP giving 0% fees to holders is clever — it actually makes the token useful, not just speculative. Real utility, real reason to hold.",
                handle: "@afifarioss",
                label: "BaseZap founder",
                href: "https://warpcast.com/afifarioss",
              },
              {
                quote:
                  "Agent-native payments on Base is the missing layer. BaseZap's x402 endpoints let any agent tip any Farcaster user without a single manual step.",
                handle: "Community feedback",
                label: "Early access tester",
                href: "/docs/agents",
              },
            ].map((testimonial) => (
              <a
                key={testimonial.handle}
                href={testimonial.href}
                target={testimonial.href.startsWith("http") ? "_blank" : undefined}
                rel={
                  testimonial.href.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
                className="group flex h-full flex-col justify-between rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 transition duration-300 hover:border-base-blueLight/20 hover:bg-white/[0.045]"
              >
                <blockquote className="text-sm leading-7 text-white/65">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
                <div className="mt-8">
                  <p className="text-xs font-semibold text-white/60">
                    {testimonial.handle}
                  </p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-white/25">
                    {testimonial.label}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="relative px-5 py-20 sm:px-8 sm:py-28">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(circle_at_50%_0%,rgba(47,107,255,0.10),transparent_65%)]" />

        <div className="relative mx-auto max-w-6xl">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-base-blueLight/70">
                Built for the Base direction
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-[-0.035em] text-white sm:text-5xl">
                The infrastructure is moving toward agents.
              </h2>
              <p className="mt-5 max-w-xl text-sm leading-7 text-white/40 sm:text-base">
                Base and Coinbase are building around programmable payments,
                agent tooling, MCP, x402 and software that can actually
                transact. BaseZap is already building at that intersection.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 lg:max-w-sm lg:justify-end">
              {[
                "Payments",
                "x402",
                "MCP",
                "ERC-8021",
                "Agent tools",
                "Base",
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/[0.08] bg-white/[0.025] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/40"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.08] md:grid-cols-2">
            <article className="bg-[#05070b]/95 p-6 sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-base-blueLight/70">
                  Jesse Pollak · Base
                </p>
                <span className="font-mono text-[9px] text-white/20">
                  BASE 2026
                </span>
              </div>

              <h3 className="mt-6 font-display text-2xl font-bold tracking-tight text-white">
                Agents need rails, tools, and a way to transact.
              </h3>

              <p className="mt-4 text-sm leading-7 text-white/45">
                Base&apos;s 2026 strategy puts agent-native accounts, CLI and
                MCP access, x402, and builder attribution such as ERC-8021
                directly in the infrastructure roadmap.
              </p>

              <p className="mt-6 border-l border-base-blueLight/30 pl-4 text-xs leading-6 text-white/30">
                Base direction, not a BaseZap endorsement.
              </p>
            </article>

            <article className="bg-[#05070b]/95 p-6 sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-base-blueLight/70">
                  Brian Armstrong · Coinbase
                </p>
                <span className="font-mono text-[9px] text-white/20">
                  COINBASE 2026
                </span>
              </div>

              <h3 className="mt-6 font-display text-2xl font-bold tracking-tight text-white">
                Agents are becoming economic actors.
              </h3>

              <p className="mt-4 text-sm leading-7 text-white/45">
                Coinbase&apos;s current agent stack connects AI agents to
                trading, payments and financial workflows through MCP and CLI,
                with controls around what an agent can do.
              </p>

              <p className="mt-6 border-l border-base-blueLight/30 pl-4 text-xs leading-6 text-white/30">
                Coinbase direction, not a Coinbase endorsement of BaseZap.
              </p>
            </article>
          </div>

          <div className="mt-8 rounded-2xl border border-base-blueLight/15 bg-base-blue/5 p-6 text-center sm:p-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-base-blueLight/70">
              Where BaseZap fits
            </p>
            <p className="mx-auto mt-3 max-w-2xl font-display text-xl font-bold tracking-tight text-white sm:text-2xl">
              Discover the signal. Connect the agent. Move the value.
            </p>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/35">
              A discovery and interaction layer connecting people, payments,
              agents and onchain activity on Base.
            </p>
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
