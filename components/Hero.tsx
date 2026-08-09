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
              Show them they matter.
              <br />
              <span className="bg-gradient-to-r from-base-blueLight to-white bg-clip-text text-transparent">
                Instantly.
              </span>
            </>
          )}
        </h1>

        <p className="mx-auto mt-5 max-w-sm animate-fade-up text-[17px] leading-relaxed text-white/55 [animation-delay:160ms]">
          {recipientLabel
            ? "Send them USDC on Base — they'll see it instantly. Verified onchain, ~2 seconds."
            : "Real USDC on Base. No bridge, no gas confusion. Verified onchain, ~2 seconds."}
        </p>

        {/* Trust bar — token, chain, fee, and settlement time, all visible
            on the first screen, before anyone has to scroll or ask. */}
        <div className="mt-6 animate-fade-up [animation-delay:200ms]">
          <TrustBar />
        </div>

        <div className="mt-8 flex animate-fade-up flex-col items-center gap-3 [animation-delay:240ms]">
          <button onClick={handleCtaClick} className="btn-primary w-full max-w-[280px] !py-4 text-base">
            {recipientLabel ? `Tip ${recipientLabel}` : "Tip in 10 seconds"}
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
        </div>

        <div className="mt-8 animate-fade-up [animation-delay:320ms]">
          <SocialProof />
        </div>
      </div>
    </section>
  );
}
