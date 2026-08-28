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
    <section className="relative overflow-hidden px-5 pb-10 pt-12 text-center sm:pt-20">
      <div className="mx-auto max-w-lg">
        <div className="animate-fade-up [animation-delay:0ms]">
          <span className="chip !cursor-default gap-1.5 !border-white/[0.1] !bg-white/[0.04] text-xs text-white/60">
            <span className="h-1.5 w-1.5 animate-pulse-slow rounded-full bg-base-blueLight" />
            Built on Base × Farcaster
          </span>
        </div>

        <h1 className="mt-6 animate-fade-up font-display text-[2.15rem] font-bold leading-[1.06] tracking-tight text-white [animation-delay:80ms] sm:text-5xl">
          {recipientLabel ? (
            <>
              Send tokens to{" "}
              <span className="bg-gradient-to-r from-base-blueLight to-white bg-clip-text text-transparent">
                {recipientLabel}
              </span>
            </>
          ) : (
            <>
              Send tokens.
              <br />
              <span className="bg-gradient-to-r from-base-blueLight via-white to-white/70 bg-clip-text text-transparent">
                Support people. Build onchain.
              </span>
            </>
          )}
        </h1>

        <p className="mx-auto mt-5 max-w-sm animate-fade-up text-[17px] leading-relaxed text-white/60 [animation-delay:120ms]">
          {recipientLabel
            ? "Send a direct onchain tip to their Base wallet — fast, transparent, and non-custodial."
            : "Send USDC, VVV, or DIEM directly to Base users and Farcaster users."}
        </p>

        {!recipientLabel && (
          <p className="mx-auto mt-3 max-w-sm animate-fade-up text-sm leading-relaxed text-white/40 [animation-delay:150ms]">
            Tip creators. Support builders. Explore the Base × Farcaster ecosystem.
          </p>
        )}

        <div className="mt-6 animate-fade-up [animation-delay:200ms]">
          <TrustBar />
        </div>

        <div className="mt-7 flex animate-fade-up flex-col items-center gap-3 [animation-delay:240ms]">
          <button
            onClick={handleCtaClick}
            className="btn-primary w-full max-w-[280px] !py-4 text-base"
          >
            {recipientLabel ? `Tip ${recipientLabel}` : "Tip someone →"}
          </button>

          <p className="text-xs text-white/35">
            ~10 seconds · Any Base wallet · Settles onchain
          </p>

          <a
            href="#how-it-works"
            className="text-xs text-white/40 underline underline-offset-2 hover:text-white/60"
          >
            See how it works ↓
          </a>

          <div className="mt-2 flex flex-wrap items-center justify-center gap-x-2 gap-y-1.5 text-[11px] text-white/40">
            <span className="flex items-center gap-1">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/[0.06] text-[10px] font-semibold text-white/60">1</span>
              Find a Base or Farcaster user
            </span>
            <span className="text-white/20">→</span>
            <span className="flex items-center gap-1">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/[0.06] text-[10px] font-semibold text-white/60">2</span>
              Pick USDC · VVV · DIEM
            </span>
            <span className="text-white/20">→</span>
            <span className="flex items-center gap-1">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/[0.06] text-[10px] font-semibold text-white/60">3</span>
              Confirm wallet
            </span>
          </div>
        </div>

        {!recipientLabel && (
          <>
            <div className="mt-7 animate-fade-up [animation-delay:300ms]">
              <div className="glass-card px-5 py-5 text-left">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-base-blueLight/80">
                      Meet $ZAP
                    </p>
                    <h2 className="mt-1 font-display text-lg font-bold text-white">
                      The BaseZap ecosystem token.
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-white/45">
                      A community token at the heart of the BaseZap story — built around tipping, participation, and an open onchain economy.
                    </p>
                  </div>

                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-[#D4AF37]/30 bg-[#D4AF37]/[0.06] font-display font-bold text-[#D4AF37]">
                    Z
                  </div>
                </div>

                <div className="mt-4 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/30">
                    Base Mainnet · $ZAP Contract
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <code className="min-w-0 flex-1 truncate text-[11px] text-white/60">
                      0x8C1ca2c32CD197a27CA049aA0427f64192aD3ba3
                    </code>
                    <button
                      type="button"
                      onClick={() =>
                        navigator.clipboard?.writeText(
                          "0x8C1ca2c32CD197a27CA049aA0427f64192aD3ba3"
                        )
                      }
                      className="flex-shrink-0 rounded-md border border-white/[0.08] px-2.5 py-1.5 text-[10px] font-semibold text-white/60 hover:text-white"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                <a
                  href="https://basescan.org/token/0x8C1ca2c32CD197a27CA049aA0427f64192aD3ba3"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 block rounded-lg border border-white/[0.08] px-3 py-2 text-center text-[11px] font-semibold text-white/55 hover:text-white"
                >
                  View $ZAP on BaseScan ↗
                </a>

                <p className="mt-3 text-[10px] leading-relaxed text-white/30">
                  Launched on Base Mainnet via Bankr. Always verify the contract address before buying or adding $ZAP.
                </p>

                <p className="mt-3 text-[11px] text-white/30">
                  Explore $ZAP as the ecosystem grows. Future utility will be announced as it goes live.
                </p>
              </div>
            </div>

            <a
              href="/stake"
              className="mt-3 flex w-full items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.03] px-5 py-4 text-left transition hover:border-white/[0.14] hover:bg-white/[0.05]"
            >
              <span>
                <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-white/35">
                  Hold VVV?
                </span>
                <span className="mt-0.5 block text-sm font-semibold text-white">
                  Stake VVV with Venice
                </span>
              </span>
              <span className="text-sm text-base-blueLight">→</span>
            </a>
          </>
        )}

        <div className="mt-7 animate-fade-up [animation-delay:360ms]">
          <Testimonial />
        </div>

        <div className="mt-4 animate-fade-up [animation-delay:400ms]">
          <SocialProof />
        </div>
      </div>
    </section>
  );
}
