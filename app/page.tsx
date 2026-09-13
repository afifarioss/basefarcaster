import Link from "next/link";
import { Footer } from "@/components/Footer";

const destinations = [
  {
    number: "01",
    label: "DISCOVERY",
    title: "BaseNow",
    description:
      "See what is happening across Base and find people, projects, and activity worth following.",
    href: "/now",
    action: "Explore BaseNow",
  },
  {
    number: "02",
    label: "PAYMENTS",
    title: "Zap",
    description:
      "Send programmable onchain payments with BaseZap's simple payment experience.",
    href: "/zap",
    action: "Open Zap",
  },
  {
    number: "03",
    label: "AGENTS",
    title: "Agents",
    description:
      "Connect programmable payments with AI agents, MCP, and x402-enabled workflows.",
    href: "/agents",
    action: "Explore Agents",
  },
  {
    number: "04",
    label: "UTILITY",
    title: "$ZAP",
    description:
      "Explore the BaseZap utility layer and benefits connected to the ecosystem.",
    href: "/ecosystem",
    action: "Explore $ZAP",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f7f5] text-[#111111]">
      <header className="border-b border-black/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black text-sm font-bold text-white">
              B
            </div>
            <span className="text-lg font-semibold tracking-tight">
              BaseZap
            </span>
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-medium text-black/60 sm:flex">
            <Link href="/now" className="transition hover:text-black">
              BaseNow
            </Link>
            <Link href="/zap" className="transition hover:text-black">
              Zap
            </Link>
            <Link href="/agents" className="transition hover:text-black">
              Agents
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
        <div className="mx-auto max-w-7xl px-5 pb-20 pt-16 sm:px-8 sm:pb-24 sm:pt-20 lg:pb-28 lg:pt-24">
          <div className="max-w-5xl">
            <div className="mb-7 flex items-center gap-3 text-sm font-medium text-black/50">
              <span className="h-2 w-2 rounded-full bg-[#0052ff]" />
              Base Mainnet
              <span className="text-black/20">/</span>
              Onchain interaction layer
            </div>

            <h1 className="max-w-5xl text-[3rem] font-semibold leading-[0.98] tracking-[-0.055em] sm:text-6xl lg:text-[5.25rem]">
              Explore Base.
              <br />
              Then make something happen.
            </h1>

            <div className="mt-8 flex max-w-2xl flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
              <p className="max-w-xl text-lg leading-8 text-black/55 sm:text-xl">
                Explore what is happening on Base, find people and projects
                worth following, and move into simple onchain actions.
              </p>

              <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
                <Link
                  href="/app"
                  className="rounded-full bg-black px-6 py-3.5 text-center text-sm font-semibold text-white transition hover:bg-black/80"
                >
                  Launch BaseZap
                </Link>
                <Link
                  href="/now"
                  className="rounded-full border border-black/15 bg-white px-6 py-3.5 text-center text-sm font-semibold transition hover:border-black/30"
                >
                  Explore BaseNow
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-black/10 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-black/10 px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-8">
          {[
            ["01", "DISCOVER", "Understand what is happening on Base."],
            ["02", "EXPLORE", "Find people, projects, and opportunities."],
            ["03", "ACT", "Move from discovery into onchain action."],
          ].map(([number, title, description]) => (
            <div key={number} className="px-0 py-7 sm:px-7 sm:first:pl-0 sm:last:pr-0">
              <div className="mb-3 text-xs font-semibold tracking-[0.16em] text-black/35">
                {number}
              </div>
              <div className="text-sm font-semibold tracking-wide">{title}</div>
              <p className="mt-2 max-w-xs text-sm leading-6 text-black/50">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-b border-black/10">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-3 text-xs font-semibold tracking-[0.18em] text-black/35">
                EXPLORE THE PRODUCT
              </div>
              <h2 className="text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
                One ecosystem. Different ways in.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-black/50">
              Start with the part of BaseZap that matches what you want to
              discover or do.
            </p>
          </div>

          <div className="divide-y divide-black/10 border-y border-black/10">
            {destinations.map((item) => (
              <Link
                key={item.number}
                href={item.href}
                className="group grid gap-5 py-7 transition sm:grid-cols-[70px_150px_1fr_auto] sm:items-center"
              >
                <span className="text-xs font-semibold tracking-[0.15em] text-black/30">
                  {item.number}
                </span>

                <span className="text-xs font-semibold tracking-[0.15em] text-black/45">
                  {item.label}
                </span>

                <div>
                  <h3 className="text-xl font-semibold tracking-tight transition group-hover:text-[#0052ff]">
                    {item.title}
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm leading-6 text-black/50">
                    {item.description}
                  </p>
                </div>

                <span className="text-sm font-semibold text-black/50 transition group-hover:text-black">
                  {item.action} →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-black/10 bg-[#111111] text-white">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <div className="mb-5 text-xs font-semibold tracking-[0.18em] text-white/40">
                BUILT AROUND BASE
              </div>

              <h2 className="max-w-3xl text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">
                Payments, agents, and onchain software are converging.
              </h2>

              <p className="mt-6 max-w-2xl text-base leading-7 text-white/55">
                BaseZap sits at that intersection — giving people a simpler
                path from discovering something on Base to actually interacting
                with it.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 lg:justify-end">
              {["Payments", "Agents", "x402", "MCP", "Base", "Onchain"].map(
                (tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/65"
                  >
                    {tag}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-3 text-xs font-semibold tracking-[0.18em] text-black/35">
                START HERE
              </div>
              <h2 className="text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">
                Find something worth exploring.
              </h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-black/50">
                Start with discovery. Use the application when you are ready
                to interact.
              </p>
            </div>

            <Link
              href="/app"
              className="inline-flex shrink-0 items-center justify-center rounded-full bg-black px-7 py-4 text-sm font-semibold text-white transition hover:bg-black/80"
            >
              Launch BaseZap →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
