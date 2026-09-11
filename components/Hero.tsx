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

  const isPersonalized = Boolean(recipientLabel);

  return (
    <section className="relative overflow-hidden px-5 pb-12 pt-12 text-center sm:pb-16 sm:pt-20">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 flex justify-center">
        <div className="h-64 w-64 rounded-full bg-base-blue/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-3xl">
        <div className="animate-fade-up">
          <span className="chip !cursor-default gap-2 !border-white/[0.1] !bg-white/[0.04] text-xs text-white/60">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-base-blueLight opacity-50" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-base-blueLight" />
            </span>
            {isPersonalized ? "BASEZAP · ONCHAIN" : "BaseNow · LIVE"}
          </span>
        </div>

        <h1 className="mx-auto mt-6 max-w-3xl animate-fade-up font-display text-[2.7rem] font-bold leading-[0.98] tracking-tight text-white [animation-delay:80ms] sm:text-6xl">
          {isPersonalized ? (
            <>
              Support{" "}
              <span className="bg-gradient-to-r from-base-blueLight via-white to-white/70 bg-clip-text text-transparent">
                {recipientLabel}
              </span>{" "}
              onchain.
            </>
          ) : (
            <>
              See what matters
              <br />
              <span className="bg-gradient-to-r from-base-blueLight via-white to-white/70 bg-clip-text text-transparent">
                on Base.
              </span>
            </>
          )}
        </h1>

        <p className="mx-auto mt-5 max-w-xl animate-fade-up text-[17px] leading-relaxed text-white/60 [animation-delay:120ms] sm:text-lg">
          {isPersonalized
            ? "Send a direct tip to their Base wallet — fast, transparent, and non-custodial."
            : "Base is always moving. BaseNow turns verified onchain activity into signals, context, and actions you can take."}
        </p>

        <div className="mt-6 animate-fade-up [animation-delay:160ms]">
          <TrustBar />
        </div>

        <div className="mt-7 flex animate-fade-up flex-col items-center gap-3 [animation-delay:210ms]">
          <button
            onClick={handleCtaClick}
            className="btn-primary w-full max-w-[300px] !py-4 text-base shadow-lg shadow-base-blue/10"
          >
            {isPersonalized ? `Tip ${recipientLabel}` : "Send a Zap →"}
          </button>

          {!isPersonalized && (
            <a
              href="/now"
              className="btn-secondary w-full max-w-[300px] !py-3 text-sm"
            >
              Explore BaseNow
            </a>
          )}

          <p className="text-xs text-white/35">
            {isPersonalized
              ? "Non-custodial · Settles directly on Base · ~2 seconds"
              : "Discover · Understand · Act · Built on Base"}
          </p>
        </div>

        {!isPersonalized && (
          <div className="mx-auto mt-9 max-w-lg animate-fade-up [animation-delay:280ms]">
            <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.035] p-5 text-left shadow-2xl shadow-black/20">
              <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-base-blue/10 blur-3xl" />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-base-blueLight" />
                    <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
                      Verified signal
                    </span>
                  </div>

                  <span className="text-[10px] font-medium text-white/30">
                    NOW
                  </span>
                </div>

                <div className="mt-5">
                  <p className="text-xs font-medium text-base-blueLight">
                    VERIFIED BASEZAP ACTIVITY
                  </p>

                  <p className="mt-1.5 font-display text-lg font-semibold text-white">
                    A BaseZap just happened.
                  </p>

                  <p className="mt-2 text-sm leading-relaxed text-white/45">
                    BaseNow turns verified activity into something you can understand
                    and act on.
                  </p>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-2">
                  {[
                    ["WHAT", "Signal"],
                    ["WHY", "Context"],
                    ["ACT", "Action"],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-xl border border-white/[0.06] bg-black/10 px-3 py-2.5"
                    >
                      <p className="text-[9px] font-semibold tracking-[0.16em] text-white/30">
                        {label}
                      </p>
                      <p className="mt-1 text-xs font-medium text-white/70">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-4">
                  <span className="text-[10px] text-white/30">
                    Intelligence → Action
                  </span>
                  <a
                    href="/now"
                    className="text-xs font-semibold text-base-blueLight transition hover:text-white"
                  >
                    Explore →
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mx-auto mt-8 max-w-md border-t border-white/[0.06] pt-5">
          <p className="text-[11px] leading-relaxed text-white/30">
            {isPersonalized
              ? "Move value as easily as you move messages."
              : "BaseZap connects discovery, intelligence, and onchain action in one Base-native experience."}
          </p>
        </div>
      </div>
    </section>
  );
}
