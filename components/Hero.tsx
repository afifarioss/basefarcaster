"use client";

import { TrustBar } from "./TrustBar";

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
    <section className="relative overflow-hidden px-5 pb-10 pt-12 text-center sm:pb-14 sm:pt-20">
      <div className="mx-auto max-w-2xl">
        <div className="animate-fade-up [animation-delay:0ms]">
          <span className="chip !cursor-default gap-1.5 !border-white/[0.1] !bg-white/[0.04] text-xs text-white/60">
            <span className="h-1.5 w-1.5 animate-pulse-slow rounded-full bg-base-blueLight" />
            Social tipping on Base
          </span>
        </div>

        <h1 className="mx-auto mt-6 max-w-2xl animate-fade-up font-display text-[2.35rem] font-bold leading-[1.03] tracking-tight text-white [animation-delay:80ms] sm:text-6xl">
          {recipientLabel ? (
            <>
              Support{" "}
              <span className="bg-gradient-to-r from-base-blueLight via-white to-white/70 bg-clip-text text-transparent">
                {recipientLabel}
              </span>
              {" "}onchain.
            </>
          ) : (
            <>
              Turn support into
              <br />
              <span className="bg-gradient-to-r from-base-blueLight via-white to-white/70 bg-clip-text text-transparent">
                an onchain action.
              </span>
            </>
          )}
        </h1>

        <p className="mx-auto mt-5 max-w-lg animate-fade-up text-[17px] leading-relaxed text-white/60 [animation-delay:120ms] sm:text-lg">
          {recipientLabel
            ? "Send a direct tip to their Base wallet — fast, transparent, and non-custodial."
            : "Tip creators, builders, and friends directly on Base from a Farcaster identity or wallet."}
        </p>

        <div className="mt-6 animate-fade-up [animation-delay:180ms]">
          <TrustBar />
        </div>

        <div className="mt-7 flex animate-fade-up flex-col items-center gap-3 [animation-delay:220ms]">
          <button
            onClick={handleCtaClick}
            className="btn-primary w-full max-w-[300px] !py-4 text-base shadow-lg shadow-base-blue/10"
          >
            {recipientLabel
              ? `Tip ${recipientLabel}`
              : "Find someone to tip →"}
          </button>

          <p className="text-xs text-white/35">
            Non-custodial · Settles directly on Base · ~2 seconds
          </p>

          <a
            href="#how-it-works"
            className="mt-1 text-xs text-white/40 underline underline-offset-2 transition hover:text-white/70"
          >
            See how it works ↓
          </a>
        </div>

        <div className="mx-auto mt-7 max-w-md animate-fade-up [animation-delay:280ms]">
          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1.5 text-[11px] text-white/40">
            <span className="flex items-center gap-1.5">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/[0.06] font-semibold text-white/60">
                1
              </span>
              Find a person
            </span>

            <span className="text-white/15">→</span>

            <span className="flex items-center gap-1.5">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/[0.06] font-semibold text-white/60">
                2
              </span>
              Choose an amount
            </span>

            <span className="text-white/15">→</span>

            <span className="flex items-center gap-1.5">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/[0.06] font-semibold text-white/60">
                3
              </span>
              Confirm
            </span>
          </div>
        </div>

        <div className="mx-auto mt-9 max-w-lg border-t border-white/[0.06] pt-5">
          <p className="text-[11px] leading-relaxed text-white/30">
            Built around a simple idea: social relationships should be able to
            move value as easily as they move messages.
          </p>
        </div>
      </div>
    </section>
  );
}
