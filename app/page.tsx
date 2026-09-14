import Link from "next/link";

const valueProps = [
  {
    number: "01",
    title: "Simple",
    description:
      "Find a Base user, choose a token, and send a tip without a complicated payment flow.",
  },
  {
    number: "02",
    title: "Onchain",
    description:
      "Transfers settle on Base. The payment is transparent, verifiable, and final.",
  },
  {
    number: "03",
    title: "Built for people",
    description:
      "Turn appreciation into an actual payment for creators, builders, and people worth supporting.",
  },
];

const productPaths = [
  [
    "01",
    "BASEZAP",
    "Send onchain tips and understand the payment experience.",
    "/zap",
    "Explore BaseZap",
  ],
  [
    "02",
    "AGENTIC",
    "Explore the agent and x402 interface built around programmable services.",
    "/agents",
    "Explore Agentic",
  ],
  [
    "03",
    "HUMAN",
    "Discover the people and social activity that give Base its human layer.",
    "/human",
    "Explore Human",
  ],
  [
    "04",
    "ECOSYSTEM",
    "Explore projects, builders, protocols, and Base-native applications.",
    "/ecosystem",
    "Explore Ecosystem",
  ],
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f7f5] text-[#111111]">
      <header className="border-b border-black/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/brand/basezap-emblem-color.svg"
              alt="BaseZap"
              className="h-9 w-9 object-contain"
            />
            <span className="text-lg font-semibold tracking-tight">
              BaseZap
            </span>
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-medium text-black/60 sm:flex">
            <Link href="/zap" className="transition hover:text-black">
              BaseZap
            </Link>
            <Link href="/agents" className="transition hover:text-black">
              Agentic
            </Link>
            <Link href="/human" className="transition hover:text-black">
              Human
            </Link>
            <Link href="/ecosystem" className="transition hover:text-black">
              Ecosystem
            </Link>
          </nav>

          <Link
            href="/app"
            className="rounded-full bg-black px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-black/80"
          >
            Open App →
          </Link>
        </div>
      </header>

      <section className="border-b border-black/10">
        <div className="mx-auto max-w-7xl px-5 pb-20 pt-16 sm:px-8 sm:pb-28 sm:pt-24">
          <div className="max-w-5xl">
            <div className="mb-7 flex items-center gap-3 text-sm font-medium text-black/50">
              <span className="h-2 w-2 rounded-full bg-[#0052ff]" />
              Base Mainnet
              <span className="text-black/20">/</span>
              Onchain payments
            </div>

            <h1 className="max-w-5xl text-[3.25rem] font-semibold leading-[0.92] tracking-[-0.065em] sm:text-7xl lg:text-[6.25rem]">
              Turn appreciation
              <br />
              <span className="text-black/35">into action.</span>
            </h1>

            <div className="mt-10 grid max-w-5xl gap-10 border-t border-black/10 pt-7 lg:grid-cols-[1fr_auto] lg:items-end">
              <p className="max-w-2xl text-lg leading-8 text-black/55 sm:text-xl">
                BaseZap makes it simple to support people on Base with real
                onchain payments. Find someone worth supporting, choose a
                token, and send it.
              </p>

              <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col">
                <Link
                  href="/app"
                  className="rounded-full bg-black px-7 py-3.5 text-center text-sm font-semibold text-white transition hover:bg-black/80"
                >
                  Launch BaseZap
                </Link>
                <Link
                  href="#how-it-works"
                  className="rounded-full border border-black/15 bg-white px-7 py-3.5 text-center text-sm font-semibold transition hover:border-black/30"
                >
                  See how it works
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="border-b border-black/10 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="grid grid-cols-1 divide-y divide-black/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {[
              ["01", "FIND", "Choose the person you want to support."],
              ["02", "CHOOSE", "Select the token and amount you want to send."],
              ["03", "SEND", "Confirm the transaction and settle on Base."],
            ].map(([number, title, description]) => (
              <div
                key={number}
                className="px-0 py-7 sm:px-7 sm:first:pl-0 sm:last:pr-0"
              >
                <div className="mb-3 text-xs font-semibold tracking-[0.16em] text-black/35">
                  {number}
                </div>
                <div className="text-sm font-semibold tracking-wide">
                  {title}
                </div>
                <p className="mt-2 max-w-xs text-sm leading-6 text-black/50">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-black/10">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="mb-12 max-w-2xl">
            <div className="mb-3 text-xs font-semibold tracking-[0.18em] text-black/35">
              WHY BASEZAP
            </div>
            <h2 className="text-3xl font-semibold leading-tight tracking-[-0.045em] sm:text-5xl">
              The simplest path from appreciation to payment.
            </h2>
            <p className="mt-4 text-base leading-7 text-black/50">
              BaseZap focuses on the moment that matters: moving from
              appreciation to an actual onchain transaction.
            </p>
          </div>

          <div className="grid gap-px overflow-hidden border border-black/10 bg-black/10 sm:grid-cols-3">
            {valueProps.map((item) => (
              <div
                key={item.number}
                className="group bg-[#f7f7f5] p-7 transition-colors hover:bg-white sm:p-9"
              >
                <div className="mb-8 text-xs font-semibold tracking-[0.15em] text-black/30">
                  {item.number}
                </div>
                <h3 className="text-xl font-semibold tracking-tight">
                  {item.title}
                </h3>
                <p className="mt-3 max-w-sm text-sm leading-6 text-black/50">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-black/10 bg-[#0b0b0b] text-white">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <div className="mb-4 text-xs font-semibold tracking-[0.18em] text-white/40">
                THE BASEZAP PRODUCT
              </div>
              <h2 className="max-w-3xl text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">
                One payment product. A wider Base ecosystem.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-7 text-white/55">
                BaseZap is the payment layer. Around it, explore the people,
                agents, projects, and protocols building on Base.
              </p>
            </div>

            <Link
              href="/app"
              className="inline-flex shrink-0 items-center justify-center rounded-full bg-white px-7 py-4 text-sm font-semibold text-black transition hover:bg-white/85"
            >
              Open the app →
            </Link>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="mb-10">
            <div className="mb-3 text-xs font-semibold tracking-[0.18em] text-black/35">
              EXPLORE BASEZAP
            </div>
            <h2 className="text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
              Explore the BaseZap ecosystem.
            </h2>
          </div>

          <div className="divide-y divide-black/10 border-y border-black/10">
            {productPaths.map(
              ([number, label, description, href, action]) => (
                <Link
                  key={number}
                  href={href}
                  className="group grid gap-4 border-b border-transparent py-7 transition hover:border-black/10 sm:grid-cols-[70px_150px_1fr_auto] sm:items-center"
                >
                  <span className="text-xs font-semibold tracking-[0.15em] text-black/30">
                    {number}
                  </span>

                  <span className="text-xs font-semibold tracking-[0.15em] text-black/45">
                    {label}
                  </span>

                  <p className="max-w-2xl text-sm leading-6 text-black/50 transition group-hover:text-black/70">
                    {description}
                  </p>

                  <span className="text-sm font-semibold text-black/50 transition group-hover:text-black">
                    {action} →
                  </span>
                </Link>
              )
            )}
          </div>
        </div>
      </section>

      <footer className="border-t border-black/10 bg-[#f7f7f5] px-5 py-10 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold">BaseZap</p>
            <p className="mt-1 text-xs text-black/40">
              Onchain payments on Base.
            </p>
          </div>

          <div className="flex flex-wrap gap-5 text-xs text-black/45">
            <Link href="/zap" className="hover:text-black">
              BaseZap
            </Link>
            <Link href="/agents" className="hover:text-black">
              Agentic
            </Link>
            <Link href="/human" className="hover:text-black">
              Human
            </Link>
            <Link href="/ecosystem" className="hover:text-black">
              Ecosystem
            </Link>
            <Link
              href="/app"
              className="font-semibold text-black/70 hover:text-black"
            >
              Open App
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
