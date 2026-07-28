"use client";

export function Hero({ onCtaClick }: { onCtaClick: () => void }) {
  return (
    <section className="relative overflow-hidden px-5 pb-10 pt-14 text-center sm:pt-20">
      <div className="mx-auto max-w-lg">
        <div className="animate-fade-up [animation-delay:0ms]">
          <span className="chip !cursor-default gap-1.5 !border-white/[0.1] !bg-white/[0.04] text-xs text-white/60">
            <span className="h-1.5 w-1.5 animate-pulse-slow rounded-full bg-base-blueLight" />
            Live on Base Mainnet
          </span>
        </div>

        <h1 className="mt-6 animate-fade-up font-display text-[2.6rem] font-bold leading-[1.05] tracking-tight text-white [animation-delay:80ms] sm:text-6xl">
          Tip in USDC.
          <br />
          <span className="bg-gradient-to-r from-base-blueLight to-white bg-clip-text text-transparent">
            Land in seconds.
          </span>
        </h1>

        <p className="mx-auto mt-5 max-w-sm animate-fade-up text-[17px] leading-relaxed text-white/55 [animation-delay:160ms]">
          Send real, onchain USDC tips to any creator on Farcaster — no
          bridging, no gas guesswork, no waiting. Just tap and send.
        </p>

        <div className="mt-8 flex animate-fade-up flex-col items-center gap-3 [animation-delay:240ms]">
          <button onClick={onCtaClick} className="btn-primary w-full max-w-[280px] !py-4 text-base">
            Send your first tip
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

        <div className="mt-9 flex animate-fade-up items-center justify-center gap-3 [animation-delay:320ms]">
          <div className="flex -space-x-2.5">
            {["#0052FF", "#3D7BFF", "#7EA6FF", "#0040CC"].map((c, i) => (
              <div
                key={i}
                className="h-7 w-7 rounded-full border-2 border-surface-void"
                style={{ background: c }}
              />
            ))}
          </div>
          <p className="text-xs text-white/45">
            Trusted by builders shipping on{" "}
            <span className="font-medium text-white/70">Base</span> &{" "}
            <span className="font-medium text-white/70">Farcaster</span>
          </p>
        </div>
      </div>
    </section>
  );
}
