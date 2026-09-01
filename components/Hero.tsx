"use client";

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

    document.getElementById("tip-card")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <section className="relative overflow-hidden px-5 pb-10 pt-12 text-center sm:pb-14 sm:pt-20">
      <div className="mx-auto max-w-2xl">
        <div className="animate-fade-up">
          <span className="chip !cursor-default gap-1.5 !border-white/[0.1] !bg-white/[0.04] text-xs text-white/60">
            <span className="h-1.5 w-1.5 animate-pulse-slow rounded-full bg-base-blueLight" />
            Social tipping on Base
          </span>
        </div>

        <h1 className="mx-auto mt-6 max-w-2xl animate-fade-up font-display text-[2.35rem] font-bold leading-[1.03] tracking-tight text-white sm:text-6xl">
          {recipientLabel ? (
            <>
              Support{" "}
              <span className="bg-gradient-to-r from-base-blueLight via-white to-white/70 bg-clip-text text-transparent">
                {recipientLabel}
              </span>{" "}
              onchain.
            </>
          ) : (
            <>
              For people who don&apos;t trust
              <br />
              <span className="bg-gradient-to-r from-base-blueLight via-white to-white/70 bg-clip-text text-transparent">
                crypto testimonials.
              </span>
            </>
          )}
        </h1>

        <p className="mx-auto mt-5 max-w-lg animate-fade-up text-[17px] leading-relaxed text-white/60 sm:text-lg">
          {recipientLabel
            ? "Good. Don't trust them. Verify the transaction yourself — it's public and verifiable on Base."
            : "Good. Don't trust them. Verify the transaction yourself. Support someone onchain with Find → Choose → Confirm."}
        </p>

        <div className="mt-6 animate-fade-up">
          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1.5 text-xs text-white/40">
            <span>Find</span>
            <span className="text-white/15">→</span>
            <span>Choose</span>
            <span className="text-white/15">→</span>
            <span>Confirm</span>
          </div>
        </div>

        <div className="mt-7 flex animate-fade-up flex-col items-center gap-3">
          <button
            onClick={handleCtaClick}
            className="btn-primary w-full max-w-[300px] !py-4 text-base shadow-lg shadow-base-blue/10"
          >
            {recipientLabel
              ? `Tip ${recipientLabel}`
              : "Find someone to tip →"}
          </button>

          <p className="text-xs text-white/35">
            No hype · No fake numbers · Verify it on Base
          </p>

          <a
            href="#how-it-works"
            className="mt-1 text-xs text-white/40 underline underline-offset-2 transition hover:text-white/70"
          >
            See how it works ↓
          </a>
        </div>

        <div className="mx-auto mt-8 max-w-lg border-t border-white/[0.06] pt-5">
          <p className="text-[11px] leading-relaxed text-white/30">
            Your support goes directly to the recipient&apos;s Base wallet.
            The transaction can be independently verified onchain.
          </p>
        </div>
      </div>
    </section>
  );
}
