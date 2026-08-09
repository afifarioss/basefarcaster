"use client";

import { TrustBar } from "./TrustBar";
import { SocialProof } from "./SocialProof";

export function Hero({
  onCtaClick,
  recipientLabel,
}: {
  onCtaClick?: () => void;
  recipientLabel?: string | null;
}) {
  const handleCtaClick = () => {
    if (onCtaClick) {
      onCtaClick();
      return;
    }

    const target = document.getElementById("tip-card");
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return (
    <section className="relative overflow-hidden px-5 pb-10 pt-14 text-center sm:pt-20">
      <div className="mx-auto max-w-lg">
        <div className="animate-fade-up [animation-delay:0ms]">
          <span className="chip !cursor-default gap-1.5 !border-white/[0.1] !bg-white/[0.04] text-xs text-white/60">
            <span className="h-1.5 w-1.5 animate-pulse-slow rounded-full bg-base-blueLight" />
            Live on Base Mainnet
          </span>
        </div>

        <h1 className="mt-6 animate-fade-up font-display text-[2.4rem] font-bold leading-[1.08] tracking-tight text-white [animation-delay:80ms] sm:text-5xl">
          {recipientLabel ? (
            <>
              Show{" "}
              <span className="bg-gradient-to-r from-base-blueLight to-white bg-clip-text text-transparent">
                {recipientLabel}
              </span>{" "}
                some love.
            </>
          ) : (
            <>
              Tip Farcaster users
              <br />
              <span className="bg-gradient-to-r from-base-blueLight to-white bg-clip-text text-transparent">
                with USDC on Base.
              </span>
            </>
          )}
        </h1>

        <p className="mx-auto mt-4 max-w-sm animate-fade-up text-sm font-medium text-base-blueLight [animation-delay:120ms]">
          {recipientLabel
            ? "A real tip, not just a like — sent straight to their wallet."
            : "Reward good Farcaster casts with real USDC — not just a like."}
        </p>

        <p className="mx-auto mt-3 max-w-sm animate-fade-up text-[17px] leading-relaxed text-white/55 [animation-delay:160ms]">
          {recipientLabel
            ? "Send them USDC on Base — they'll see it instantly. Verified onchain, ~2 seconds."
            : "Paste a username or cast link, choose an amount, and zap them instantly."}
        </p>

        {/* Trust bar — token, chain, fee, and settlement time, all visible
            on the first screen, before anyone has to scroll or ask. */}
        <div className="mt-6 animate-fade-up [animation-delay:200ms]">
          <TrustBar />
        </div>

        <div className="mt-8 flex animate-fade-up flex-col items-center gap-3 [animation-delay:240ms]">
          <button onClick={handleCtaClick} className="btn-primary w-full max-w-[280px] !py-4 text-base">
            {recipientLabel ? `Tip ${recipientLabel}` : "Zap someone now"}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 12h14M13 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <p className="text-xs text-white/35">
            Takes ~10 seconds · Works with any Base wallet
          </p>

            <div className="mt-2 flex flex-wrap items-center justify-center gap-x-2 gap-y-1.5 text-[11px] text-white/40">
              <span className="flex items-center gap-1">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/[0.06] text-[10px] font-semibold text-white/60">1</span>
                Paste a username
              </span>
              <span className="text-white/20">→</span>
              <span className="flex items-center gap-1">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/[0.06] text-[10px] font-semibold text-white/60">2</span>
                Pick an amount
              </span>
              <span className="text-white/20">→</span>
              <span className="flex items-center gap-1">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/[0.06] text-[10px] font-semibold text-white/60">3</span>
                They get USDC instantly
              </span>
            </div>
        </div>

        <div className="mt-8 animate-fade-up [animation-delay:320ms]">
          <SocialProof />
        </div>
      </div>
    </section>
  );
}
