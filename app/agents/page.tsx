const concepts = [
  {
    number: "01",
    title: "Discover",
    text: "Find agent services and understand what they can do before interacting with them.",
  },
  {
    number: "02",
    title: "Price",
    text: "x402 enables machine-readable payment requirements for services that charge per request.",
  },
  {
    number: "03",
    title: "Execute",
    text: "Agents can turn a request into a programmable action instead of a manual workflow.",
  },
];

export default function AgentsPage() {
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
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[600px] bg-[radial-gradient(circle_at_50%_0%,rgba(0,82,255,0.18),transparent_65%)]" />

        <div className="relative mx-auto max-w-6xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-base-blueLight/75">
            Agents · AI + x402
          </p>

          <h1 className="mt-6 max-w-5xl font-display text-[3.5rem] font-bold leading-[0.92] tracking-[-0.055em] text-white sm:text-7xl lg:text-[6.5rem]">
            AI services
            <br />
            that can{" "}
            <span className="bg-gradient-to-r from-base-blueLight via-white to-white/45 bg-clip-text text-transparent">
              transact.
            </span>
          </h1>

          <p className="mt-8 max-w-2xl text-base leading-7 text-white/45 sm:text-lg">
            BaseZap connects the human-facing Base economy with an emerging
            machine economy — where agents can discover services, request
            capabilities, and pay for useful work.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href="/docs/agents"
              className="btn-primary inline-flex items-center justify-center gap-2 !py-3.5 px-6 text-sm"
            >
              Explore Agent Docs →
            </a>
            <a
              href="/app"
              className="inline-flex items-center justify-center rounded-xl border border-white/[0.10] bg-white/[0.025] px-6 py-3.5 text-sm font-semibold text-white/65 transition hover:border-white/[0.18] hover:text-white"
            >
              Open BaseZap
            </a>
          </div>
        </div>
      </section>

      <section className="border-y border-white/[0.06] px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.08] lg:grid-cols-3">
            {concepts.map((concept) => (
              <div key={concept.number} className="bg-[#05070b]/95 p-8 sm:p-10">
                <p className="font-mono text-[10px] text-base-blueLight/60">
                  {concept.number}
                </p>
                <h2 className="mt-9 font-display text-2xl font-bold text-white">
                  {concept.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-white/40">
                  {concept.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_0.85fr] lg:items-center">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-base-blueLight/70">
              BaseZap Agent Layer
            </p>
            <h2 className="mt-4 max-w-xl font-display text-3xl font-bold tracking-[-0.04em] text-white sm:text-5xl">
              A payment rail for programmable services.
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-6 text-white/40 sm:text-base">
              BaseZap already exposes agent-oriented capabilities through its
              API. The long-term direction is a discoverable Base economy where
              humans and agents can find useful services and transact with
              them.
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">
              Current agent surface
            </p>

            <div className="mt-5 divide-y divide-white/[0.07]">
              {[
                ["Network", "Base"],
                ["Protocol", "x402"],
                ["Public tools", "Platform info · Tip quote"],
                ["Paid tools", "Tip calldata · Username resolution"],
                ["Price", "$0.001 USDC"],
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
            Build with BaseZap
          </p>

          <div className="mt-3 flex flex-col justify-between gap-7 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
                Explore the agent interface.
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-white/40">
                Read the current tools, x402 behavior, and integration details
                before building against the platform.
              </p>
            </div>

            <a
              href="/docs/agents"
              className="btn-primary inline-flex shrink-0 items-center justify-center gap-2 !py-3.5 px-6 text-sm"
            >
              Read Agent Docs →
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/[0.06] px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between text-[10px] text-white/25">
          <span>Agents · BaseZap</span>
          <a href="/" className="transition hover:text-white/55">
            Back home →
          </a>
        </div>
      </footer>
    </main>
  );
}
