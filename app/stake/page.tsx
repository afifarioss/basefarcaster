"use client";

import Link from "next/link";
import { VeniceAttribution } from "@/components/VeniceAttribution";
import { VeniceProStatus } from "@/components/VeniceProStatus";
import { StakeCard } from "@/components/StakeCard";
import { WalletConnect } from "@/components/WalletConnect";
import { Footer } from "@/components/Footer";
import { APP_NAME } from "@/lib/constants";

export default function StakePage() {
  return (
    <main className="relative min-h-screen bg-noise-grid">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-white/[0.06] bg-surface-void/80 px-5 py-4 backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0A0A0A] border border-[#D4AF37]/40">
            <span className="font-display text-sm font-bold text-[#D4AF37]">Z</span>
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
            ← Back to tipping
          </Link>
          <h1 className="font-display text-2xl font-bold text-white">
            Stake VVV
          </h1>
          <p className="text-center text-sm text-white/50">
            A separate, optional feature powered by Venice AI — not part of
            core tipping.
          </p>
          <VeniceAttribution />
          <VeniceProStatus />
          <StakeCard />
        </div>
      </section>

      <Footer />
    </main>
  );
}
