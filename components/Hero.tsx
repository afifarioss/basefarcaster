"use client";

import { TrustBar } from "./TrustBar";
import { Testimonial } from "./Testimonial";
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

        <h1 className="mt-6 animate-fade-up font-display text-[2.15rem] font-bold leading-[1.1] tracking-tight text-white [animation-delay:80ms] sm:text-5xl">
          {recipientLabel ? (
            <>
              Send USDC to{" "}
              <span className="bg-gradient-to-r from-base-blueLight to-white bg-clip-text text-transparent">
                {recipientLabel}
              </span>
            </>
          ) : (
            <>
              <span className="sm:hidden">
                Zap anyone on Base.
              </span>
              <span className="hidden sm:inline">
                Zap anyone on Base.
              </span>
            </>
          )}
        </h1>

        <p className="mx-auto mt-4 max-w-sm animate-fade-up text-[17px] leading-relaxed text-white/55 [animation-delay:120ms]">
          {recipientLabel
            ? "A real tip, not just a like — sent straight to their wallet, verified onchain in ~2 seconds."
            : "People, services, and AI — all one instant payment."}
        </p>

        <p className="mx-auto mt-4 max-w-sm animate-fade-up text-base leading-relaxed text-white/60 [animation-delay:130ms]">
          {!recipientLabel && (
            <>Support creators with a direct tip. Call an AI agent and pay for the result. Both instant, both onchain, both on Base.</>
          )}
        </p>

        {/* Trust bar — token, chain, fee, and settlement time, all visible
            on the first screen, before anyone has to scroll or ask. */}
        <div className="mt-6 animate-fade-up [animation-delay:200ms]">
          <TrustBar />
        </div>

        <div className="mt-8 flex animate-fade-up flex-col items-center gap-3 [animation-delay:240ms]">
          <button onClick={handleCtaClick} className="btn-primary w-full max-w-[280px] !py-4 text-base">
            {recipientLabel ? `Tip ${recipientLabel}` : "⚡ Zap someone now"}
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
          <a href="#how-it-works" className="text-xs text-white/40 underline underline-offset-2 hover:text-white/60">
            See how it works ↓
          </a>

          <div className="mt-2 flex flex-wrap items-center justify-center gap-x-2 gap-y-1.5 text-[11px] text-white/40">
            <span className="flex items-center gap-1">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/[0.06] text-[10px] font-semibold text-white/60">1</span>
              Paste a username or cast link
            </span>
            <span className="text-white/20">→</span>
            <span className="flex items-center gap-1">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/[0.06] text-[10px] font-semibold text-white/60">2</span>
              Pick a USDC amount
            </span>
            <span className="text-white/20">→</span>
            <span className="flex items-center gap-1">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/[0.06] text-[10px] font-semibold text-white/60">3</span>
              Confirm in your wallet
            </span>
            <span className="text-white/20">→</span>
            <span className="flex items-center gap-1">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/[0.06] text-[10px] font-semibold text-white/60">4</span>
              Both settle instantly
            </span>
          </div>
        </div>

        <div className="mt-8 animate-fade-up [animation-delay:320ms]">
          <Testimonial />
        </div>
        <div className="mt-4 animate-fade-up [animation-delay:360ms]">
          <SocialProof />
        </div>
      </div>
    </section>
  );
}
