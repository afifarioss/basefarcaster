import { BaseNowFeed } from "@/components/BaseNowFeed";
import { BaseNowPulse } from "@/components/BaseNowPulse";

export const metadata = {
  title: "Base NOW | BaseZap",
  description:
    "The pulse of Base. Discover what matters, understand why it matters, and take action.",
};

export default function BaseNowPage() {
  return (
    <main className="min-h-screen bg-noise-grid">
      <div className="mx-auto w-full max-w-5xl px-4 pb-20 pt-8 sm:px-6 sm:pt-14">
        <header className="mx-auto max-w-3xl text-center">
          <div className="animate-fade-up">
            <span className="chip !cursor-default gap-2 !border-white/[0.1] !bg-white/[0.04] text-xs text-white/60">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-base-blueLight opacity-50" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-base-blueLight" />
              </span>
              BASE NOW · LIVE
            </span>
          </div>

          <p className="mt-6 animate-fade-up text-[10px] font-semibold uppercase tracking-[0.24em] text-white/30 [animation-delay:60ms]">
            The pulse of Base
          </p>

          <h1 className="mt-3 animate-fade-up font-display text-4xl font-bold tracking-tight text-white [animation-delay:100ms] sm:text-6xl">
            See what matters.
            <br />
            <span className="bg-gradient-to-r from-base-blueLight via-white to-white/60 bg-clip-text text-transparent">
              Act on it.
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl animate-fade-up text-base leading-7 text-white/55 [animation-delay:150ms] sm:text-lg">
            Base is always moving. Base NOW turns activity into signals,
            context, and actions you can actually use.
          </p>

          <div className="mx-auto mt-7 flex max-w-md animate-fade-up items-center justify-center gap-2 [animation-delay:200ms]">
            {[
              ["01", "See"],
              ["02", "Understand"],
              ["03", "Act"],
            ].map(([number, label], index) => (
              <div key={number} className="flex items-center gap-2">
                <div className="rounded-full border border-white/[0.08] bg-white/[0.035] px-3 py-2">
                  <span className="mr-1.5 text-[9px] font-semibold text-base-blueLight/60">
                    {number}
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/55">
                    {label}
                  </span>
                </div>

                {index < 2 && (
                  <span className="text-xs text-white/20" aria-hidden="true">
                    →
                  </span>
                )}
              </div>
            ))}
          </div>
        </header>

        <section className="mx-auto mt-12 max-w-3xl sm:mt-16">
          <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.025] p-5 shadow-2xl shadow-black/20 sm:p-7">
            <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-base-blue/10 blur-3xl" />

            <div className="relative">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-base-blueLight/70">
                    Intelligence layer
                  </p>

                  <h2 className="mt-2 font-display text-xl font-semibold text-white sm:text-2xl">
                    What&apos;s happening on Base right now?
                  </h2>

                  <p className="mt-2 max-w-xl text-sm leading-6 text-white/40">
                    Start with verified onchain activity. Over time, Base NOW
                    will expand into a broader view of the people, products,
                    movements, and opportunities shaping Base.
                  </p>
                </div>

                <div className="hidden shrink-0 sm:flex">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.035]">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-base-blueLight opacity-40" />
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-base-blueLight" />
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 border-t border-white/[0.06] pt-5">
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/[0.06] bg-black/10 p-4">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/25">
                      Signal
                    </p>
                    <p className="mt-2 text-sm font-medium text-white/70">
                      What changed?
                    </p>
                    <p className="mt-1 text-xs leading-5 text-white/30">
                      Surface activity worth noticing.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/[0.06] bg-black/10 p-4">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/25">
                      Context
                    </p>
                    <p className="mt-2 text-sm font-medium text-white/70">
                      Why does it matter?
                    </p>
                    <p className="mt-1 text-xs leading-5 text-white/30">
                      Turn raw activity into understanding.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/[0.06] bg-black/10 p-4">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/25">
                      Action
                    </p>
                    <p className="mt-2 text-sm font-medium text-white/70">
                      What can I do?
                    </p>
                    <p className="mt-1 text-xs leading-5 text-white/30">
                      Move from discovery to action.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-10 sm:mt-12">
          <BaseNowPulse />
        </div>

        <div className="mt-6 sm:mt-8">
          <BaseNowFeed />
        </div>

        <section className="mx-auto mt-14 max-w-3xl">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-base-blueLight/60">
                For users
              </p>

              <h2 className="mt-2 font-display text-lg font-semibold text-white">
                Find what matters before the noise.
              </h2>

              <p className="mt-2 text-xs leading-5 text-white/35">
                Discover useful Base activity without needing to understand
                every transaction, contract, or protocol.
              </p>
            </div>

            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-base-blueLight/60">
                For builders
              </p>

              <h2 className="mt-2 font-display text-lg font-semibold text-white">
                Give your product a signal.
              </h2>

              <p className="mt-2 text-xs leading-5 text-white/35">
                The long-term goal is a live discovery layer where Base
                projects, launches, communities, and agents can become
                discoverable through meaningful activity.
              </p>
            </div>
          </div>
        </section>

        <footer className="mx-auto mt-12 max-w-2xl text-center">
          <div className="mx-auto mb-4 h-px w-16 bg-white/[0.08]" />

          <p className="text-xs font-medium text-white/45">
            Base is bigger than this first signal layer.
          </p>

          <p className="mx-auto mt-2 text-[11px] leading-5 text-white/25">
            Today: verified BaseZap activity. Next: a broader signal engine.
            Eventually: intelligence that helps people and agents decide what
            to do next.
          </p>

          <p className="mt-4 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/15">
            Intelligence → Action → Base
          </p>
        </footer>
      </div>
    </main>
  );
}
