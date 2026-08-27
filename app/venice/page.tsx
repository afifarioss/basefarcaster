import Link from "next/link";
import { VeniceAttribution } from "@/components/VeniceAttribution";
import { VeniceAssistant } from "@/components/VeniceAssistant";
import { WalletConnect } from "@/components/WalletConnect";
import { Footer } from "@/components/Footer";
import { APP_NAME, DIEM_ADDRESS, VVV_ADDRESS } from "@/lib/constants";

const links = [
  {
    title: "Learn about VVV",
    body: "VVV is the foundational asset of Venice. Stake it to earn yield and access Venice ecosystem utilities.",
    href: "https://venice.ai/lp/vvv",
  },
  {
    title: "Open Venice token dashboard",
    body: "Use Venice's official dashboard for staking VVV, minting DIEM, and managing your Venice position.",
    href: "https://venice.ai/token",
  },
  {
    title: "Learn about DIEM",
    body: "DIEM represents tokenized Venice compute capacity and can be transferred, traded, or staked for API credit.",
    href: "https://venice.ai/lp/diem",
  },
];

export default function VenicePage() {
  return (
    <main className="relative min-h-screen bg-noise-grid">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-white/[0.06] bg-surface-void/80 px-5 py-4 backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#D4AF37]/40 bg-[#0A0A0A]">
            <span className="font-display text-sm font-bold text-[#D4AF37]">
              Z
            </span>
          </div>
          <span className="font-display text-[15px] font-bold text-white">
            {APP_NAME}
          </span>
        </Link>
        <WalletConnect />
      </header>

      <section className="px-5 pt-10">
        <div className="mx-auto flex max-w-md flex-col items-center gap-5">
          <Link
            href="/"
            className="self-start text-xs text-white/40 hover:text-white/60"
          >
            ← Back to BaseZap
          </Link>

          <div className="text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-base-blueLight/80">
              BaseZap × Venice
            </p>

            <h1 className="mt-2 font-display text-3xl font-bold text-white">
              Build on the Venice economy.
            </h1>

            <p className="mt-3 text-sm leading-relaxed text-white/50">
              BaseZap brings Venice ecosystem assets into a Base-native social
              payment experience for Base and Farcaster users.
            </p>
          </div>

          <VeniceAttribution />

          <VeniceAssistant />

          <div className="grid w-full gap-3">
            <div className="glass-card p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/30">
                Already integrated
              </p>

              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg border border-white/[0.07] bg-black/20 p-3">
                  <p className="font-display text-lg font-bold text-white">
                    VVV
                  </p>
                  <p className="mt-1 text-[10px] text-white/35">
                    Tipping + staking
                  </p>
                </div>

                <div className="rounded-lg border border-white/[0.07] bg-black/20 p-3">
                  <p className="font-display text-lg font-bold text-white">
                    DIEM
                  </p>
                  <p className="mt-1 text-[10px] text-white/35">
                    Onchain tipping
                  </p>
                </div>

                <div className="rounded-lg border border-white/[0.07] bg-black/20 p-3">
                  <p className="font-display text-lg font-bold text-white">
                    Base
                  </p>
                  <p className="mt-1 text-[10px] text-white/35">
                    Fast settlement
                  </p>
                </div>
              </div>
            </div>

            {links.map((item) => (
              <a
                key={item.title}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card block p-4 transition hover:border-white/[0.14] hover:bg-white/[0.05]"
              >
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-sm font-semibold text-white">
                    {item.title}
                  </h2>
                  <span className="text-white/30">↗</span>
                </div>

                <p className="mt-1.5 text-xs leading-relaxed text-white/40">
                  {item.body}
                </p>
              </a>
            ))}

            <div className="glass-card p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/30">
                Base contracts
              </p>

              <div className="mt-3 space-y-3 text-[11px]">
                <div>
                  <p className="text-white/35">VVV</p>
                  <code className="break-all text-white/55">
                    {VVV_ADDRESS}
                  </code>
                </div>

                <div>
                  <p className="text-white/35">DIEM</p>
                  <code className="break-all text-white/55">
                    {DIEM_ADDRESS}
                  </code>
                </div>
              </div>
            </div>

            <Link
              href="/stake"
              className="w-full rounded-xl bg-white px-4 py-3 text-center text-xs font-semibold text-black transition hover:bg-white/90"
            >
              Stake VVV in BaseZap →
            </Link>

            <div className="glass-card p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/30">
                Built for the Venice ecosystem
              </p>

              <h2 className="mt-2 text-sm font-semibold text-white">
                Bring Venice assets into social payments on Base.
              </h2>

              <p className="mt-2 text-xs leading-relaxed text-white/40">
                BaseZap connects VVV and DIEM with Base-native tipping,
                Farcaster identity, wallet payments, and verified onchain
                transaction history.
              </p>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="rounded-lg border border-white/[0.07] bg-black/20 p-3">
                  <p className="text-xs font-semibold text-white">VVV</p>
                  <p className="mt-1 text-[10px] leading-relaxed text-white/35">
                    Stake and use inside the BaseZap ecosystem.
                  </p>
                </div>

                <div className="rounded-lg border border-white/[0.07] bg-black/20 p-3">
                  <p className="text-xs font-semibold text-white">DIEM</p>
                  <p className="mt-1 text-[10px] leading-relaxed text-white/35">
                    Transfer and tip tokenized Venice compute.
                  </p>
                </div>
              </div>

              <a
                href="https://venice.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 block rounded-lg border border-white/[0.08] px-3 py-2 text-center text-[10px] font-semibold text-white/50 transition hover:text-white"
              >
                Visit Venice AI ↗
              </a>
            </div>

            <div className="glass-card p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/30">
                Builder opportunity
              </p>

              <p className="mt-2 text-xs leading-relaxed text-white/40">
                BaseZap is already a working Base application integrating
                Venice ecosystem assets. We are continuing to expand the
                integration around social payments, onchain identity, and
                Venice-powered utility.
              </p>

              <a
                href="https://venice.ai/blog/venice-launches-27m-incentive-fund-to-advance-private-uncensored-ai-apps-agents-infrastructure"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 block rounded-lg border border-white/[0.08] px-3 py-2 text-center text-[10px] font-semibold text-white/50 transition hover:text-white"
              >
                Explore Venice Builder / Incentive Fund ↗
              </a>
            </div>
          </div>

          <p className="max-w-sm text-center text-[10px] leading-relaxed text-white/25">
            BaseZap is an independent application integrating Venice ecosystem
            assets. Official Venice links are provided for education and direct
            access; they do not imply a partnership or endorsement unless
            separately announced.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
