const signals = [
  {
    number: "01",
    title: "Projects",
    text: "Find products and builders shaping what is being built on Base.",
  },
  {
    number: "02",
    title: "Agents",
    text: "Follow AI services and programmable economies emerging around Base.",
  },
  {
    number: "03",
    title: "People",
    text: "Discover creators, builders, and communities through meaningful activity.",
  },
  {
    number: "04",
    title: "Activity",
    text: "Turn onchain signals into places worth exploring and actions worth taking.",
  },
];

export default function BaseNowPage() {
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
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[560px] bg-[radial-gradient(circle_at_50%_0%,rgba(0,82,255,0.18),transparent_65%)]" />

        <div className="relative mx-auto max-w-6xl">
          <div className="max-w-4xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-base-blueLight/75">
              BaseNow · Discovery Layer
            </p>

            <h1 className="mt-6 font-display text-[3.5rem] font-bold leading-[0.92] tracking-[-0.055em] text-white sm:text-7xl lg:text-[6.5rem]">
              See what is
              <br />
              happening on{" "}
              <span className="bg-gradient-to-r from-base-blueLight via-white to-white/45 bg-clip-text text-transparent">
                Base.
              </span>
            </h1>

            <p className="mt-8 max-w-2xl text-base leading-7 text-white/45 sm:text-lg">
              BaseNow is the discovery layer we are building for the Base
              economy — connecting signals, projects, agents, people, and
              activity so users can move from discovery to action.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href="/app"
                className="btn-primary inline-flex items-center justify-center gap-2 !py-3.5 px-6 text-sm"
              >
                Enter BaseZap App →
              </a>
              <a
                href="/"
                className="inline-flex items-center justify-center rounded-xl border border-white/[0.10] bg-white/[0.025] px-6 py-3.5 text-sm font-semibold text-white/65 transition hover:border-white/[0.18] hover:text-white"
              >
                Back to BaseZap
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/[0.06] px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.08] sm:grid-cols-2">
            {signals.map((signal) => (
              <div
                key={signal.number}
                className="bg-[#05070b]/95 p-7 sm:p-9"
              >
                <p className="font-mono text-[10px] text-base-blueLight/60">
                  {signal.number}
                </p>
                <h2 className="mt-8 font-display text-2xl font-bold tracking-tight text-white">
                  {signal.title}
                </h2>
                <p className="mt-3 max-w-md text-sm leading-6 text-white/40">
                  {signal.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-base-blueLight/70">
            The model
          </p>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-[-0.04em] text-white sm:text-5xl">
            Signal → Explore → Understand → Act
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-white/40 sm:text-base">
            BaseNow is designed to make the Base ecosystem easier to navigate.
            A useful signal should lead somewhere: to a project, a person, an
            agent, a transaction, or an application.
          </p>

          <div className="mt-10 grid gap-3 sm:grid-cols-4">
            {["Signal", "Explore", "Understand", "Act"].map((step, index) => (
              <div
                key={step}
                className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-5"
              >
                <span className="font-mono text-[10px] text-base-blueLight/55">
                  0{index + 1}
                </span>
                <p className="mt-3 text-sm font-semibold text-white/75">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/[0.06] px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 rounded-2xl border border-base-blue/15 bg-base-blue/[0.035] p-7 sm:flex-row sm:items-center sm:p-10">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-base-blueLight/65">
              BaseZap
            </p>
            <h2 className="mt-3 font-display text-2xl font-bold text-white sm:text-3xl">
              Ready to move from discovery to action?
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-white/40">
              Open the application to find someone, resolve a recipient, and
              send an onchain Zap on Base.
            </p>
          </div>

          <a
            href="/app"
            className="btn-primary inline-flex shrink-0 items-center gap-2 !py-3.5 px-6 text-sm"
          >
            Open BaseZap →
          </a>
        </div>
      </section>

      <footer className="border-t border-white/[0.06] px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between text-[10px] text-white/25">
          <span>BaseNow · BaseZap</span>
          <a href="/" className="transition hover:text-white/55">
            basezap.home →
          </a>
        </div>
      </footer>
    </main>
  );
}
