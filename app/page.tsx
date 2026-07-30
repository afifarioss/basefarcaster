"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { isAddress } from "viem";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { Hero } from "@/components/Hero";
import { TipCard } from "@/components/TipCard";
import { UsernameInput } from "@/components/UsernameInput";
import { TrustChecklist } from "@/components/TrustChecklist";
import { WalletConnect } from "@/components/WalletConnect";
import { ProfileCard } from "@/components/ProfileCard";
import { ShareButton } from "@/components/ShareButton";
import { VeniceAttribution } from "@/components/VeniceAttribution";
import { VeniceProStatus } from "@/components/VeniceProStatus";
import { StakeCard } from "@/components/StakeCard";
import { BuiltWith } from "@/components/BuiltWith";
import { Footer } from "@/components/Footer";
import {
  APP_NAME,
  DEFAULT_RECIPIENT_WALLET,
  PLATFORM_FEE_BPS,
} from "@/lib/constants";

const STEPS = [
  {
    title: "Pick an amount",
    body: "Choose a preset or enter a custom amount.",
  },
  {
    title: "Confirm in your wallet",
    body: "Base Smart Wallet, Farcaster, MetaMask, Rainbow — your call.",
  },
  {
    title: "It lands instantly",
    body: "Funds settle onchain on Base in seconds, not days.",
  },
];

function HomeContent() {
  const { setFrameReady, isFrameReady } = useMiniKit();
  const tipRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();

  // Supports personalized tip links: basefarcaster.vercel.app/?to=0x...&label=alice.eth
  // Lets anyone share a link that tips a specific creator directly, without
  // needing a full cast-action integration.
  const toParam = searchParams.get("to");
  const labelParam = searchParams.get("label");
  const recipient =
    toParam && isAddress(toParam)
      ? (toParam as `0x${string}`)
      : DEFAULT_RECIPIENT_WALLET;
  const recipientLabel = labelParam || "the creator";

  // Overrides the URL-based recipient when someone resolves a
  // @username via the input box. Falls back to the ?to= link
  // (or default wallet) when nothing has been typed.
  const [resolvedUser, setResolvedUser] = useState<{
    address: `0x${string}`;
    displayName: string;
  } | null>(null);

  const activeRecipient = resolvedUser?.address ?? recipient;
  const activeLabel = resolvedUser?.displayName ?? recipientLabel;

  useEffect(() => {
    if (!isFrameReady) setFrameReady();
  }, [isFrameReady, setFrameReady]);

  return (
    <main className="relative min-h-screen bg-noise-grid">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-white/[0.06] bg-surface-void/80 px-5 py-4 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0A0A0A] border border-[#D4AF37]/40">
            <span className="font-display text-sm font-bold text-[#D4AF37]">Z</span>
          </div>
          <span className="font-display text-[15px] font-bold text-white">
            {APP_NAME}
          </span>
        </div>
        <WalletConnect />
      </header>

      <Hero
        onCtaClick={() =>
          tipRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
        }
      />

      <section className="px-5">
        <div className="mx-auto flex max-w-md flex-col items-center gap-5">
          <ProfileCard />

          <div ref={tipRef} className="w-full space-y-3">
            <UsernameInput
              onResolve={(user) =>
                setResolvedUser(
                  user ? { address: user.address, displayName: `@${user.username}` } : null
                )
              }
            />
            <TipCard recipient={activeRecipient} recipientLabel={activeLabel} />
          </div>

          <TrustChecklist />
          <ShareButton className="btn-secondary w-full max-w-md" />
          <VeniceAttribution />
          <VeniceProStatus />
          <StakeCard />
        </div>
      </section>

      <section className="mt-16 px-5">
        <div className="mx-auto max-w-md">
          <h2 className="text-center font-display text-2xl font-bold text-white">
            How it works
          </h2>
          <div className="mt-7 space-y-4">
            {STEPS.map((step, i) => (
              <div key={step.title} className="glass-card flex gap-4 p-4">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-base-blue/12 font-display text-sm font-bold text-base-blueLight">
                  {i + 1}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    {step.title}
                  </p>
                  <p className="mt-0.5 text-sm text-white/45">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-14 px-5">
        <div className="mx-auto grid max-w-md grid-cols-3 gap-3 text-center">
          {[
            { label: "Settlement", value: "~2s" },
            { label: "Network fee", value: "<$0.01" },
            { label: "Platform fee", value: `${PLATFORM_FEE_BPS / 100}%` },
          ].map((stat) => (
            <div key={stat.label} className="glass-card px-3 py-5">
              <p className="font-display text-xl font-bold text-white">
                {stat.value}
              </p>
              <p className="mt-1 text-[11px] text-white/40">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <BuiltWith />
      <Footer />
    </main>
  );
}

export default function Home() {
  // useSearchParams requires a Suspense boundary for static rendering.
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  );
}
