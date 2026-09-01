"use client";

import { ZAP_TOKEN_ADDRESS, ZAP_HOLDER_THRESHOLD } from "@/lib/constants";

export function ZapSection() {
  return (
    <section className="px-5 py-10">
      <div className="mx-auto max-w-lg">
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
                A community token at the heart of the BaseZap story — built
                around tipping, participation, and an open onchain economy.
              </p>
            </div>

            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-[#D4AF37]/30 bg-[#D4AF37]/[0.06] font-display font-bold text-[#D4AF37]">
              Z
            </div>
          </div>

          {/* Current functionality — verified, live today */}
          <div className="mt-4 rounded-lg border border-base-blue/20 bg-base-blue/[0.05] px-3 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-base-blueLight/70">
              Live today
            </p>
            <p className="mt-1 text-sm leading-relaxed text-white/70">
              Hold {ZAP_HOLDER_THRESHOLD}+ $ZAP and pay a 0% platform fee on
              every tip — the fee is skipped entirely, so the recipient gets
              the full amount.
            </p>
          </div>

          <div className="mt-4 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/30">
              Base Mainnet · $ZAP Contract
            </p>
            <div className="mt-1 flex items-center gap-2">
              <code className="min-w-0 flex-1 truncate text-[11px] text-white/60">
                {ZAP_TOKEN_ADDRESS}
              </code>
              <button
                type="button"
                onClick={() =>
                  navigator.clipboard?.writeText(ZAP_TOKEN_ADDRESS)
                }
                className="flex-shrink-0 rounded-md border border-white/[0.08] px-2.5 py-1.5 text-[10px] font-semibold text-white/60 hover:text-white"
              >
                Copy
              </button>
            </div>
          </div>

          <a
            href={`https://basescan.org/token/${ZAP_TOKEN_ADDRESS}`}
            target="_blank"
            rel="noreferrer"
            className="mt-3 block rounded-lg border border-white/[0.08] px-3 py-2 text-center text-[11px] font-semibold text-white/55 hover:text-white"
          >
            View $ZAP on BaseScan ↗
          </a>

          <p className="mt-3 text-[10px] leading-relaxed text-white/30">
            Launched on Base Mainnet via Bankr. Always verify the contract
            address before buying or adding $ZAP.
          </p>

          {/* Future plans — explicitly labeled as not-yet-live */}
          <p className="mt-3 text-[11px] text-white/30">
            Planned, not yet live: additional $ZAP utility as the ecosystem
            grows. Future utility will be announced when it goes live —
            nothing beyond the 0% fee benefit above is active today.
          </p>
        </div>
      </div>
    </section>
  );
}
