"use client";

import { useEffect, useState } from "react";
import { ZAP_HOLDER_THRESHOLD, ZAP_TOKEN_ADDRESS } from "@/lib/constants";

type ZapStats = {
  available: boolean;
  priceUsd?: string;
  marketCap?: number;
  priceChange1h?: number;
};

const BUY_ZAP_URL = `https://dexscreener.com/base/${ZAP_TOKEN_ADDRESS}`;
const CLANKER_URL = `https://clanker.world/clanker/${ZAP_TOKEN_ADDRESS}`;

export function ZapSection() {
  const [stats, setStats] = useState<ZapStats | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/zap-stats")
      .then((res) => res.json())
      .then(setStats)
      .catch(() => setStats({ available: false }));
  }, []);

  const change = stats?.priceChange1h ?? 0;
  const isUp = change >= 0;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(ZAP_TOKEN_ADDRESS);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API unavailable.
    }
  };

  return (
    <section className="w-full">
      <div className="glass-card w-full px-5 py-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-base-blueLight/75">
              BaseZap utility
            </p>
            <h2 className="mt-1 font-display text-xl font-bold text-white">
              $ZAP
            </h2>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-white/45">
              The utility token around BaseZap. Hold {ZAP_HOLDER_THRESHOLD}+
              $ZAP today and pay a 0% platform fee on your tips.
            </p>
          </div>

          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-[#D4AF37]/30 bg-[#D4AF37]/[0.06]">
            <span className="font-display font-bold text-[#D4AF37]">Z</span>
          </div>
        </div>

        {stats?.available && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-3">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-white/30">
                Market cap
              </p>
              <p className="mt-1 text-sm font-semibold text-white/75">
                ${stats.marketCap?.toLocaleString() ?? "—"}
              </p>
            </div>

            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-white/30">
                1h
              </p>
              <p
                className={`mt-1 text-sm font-semibold ${
                  isUp ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {isUp ? "+" : ""}
                {change.toFixed(1)}%
              </p>
            </div>

            <a
              href={BUY_ZAP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary !px-4 !py-2 text-xs"
            >
              Buy $ZAP
            </a>
          </div>
        )}

        <div className="mt-4 rounded-lg border border-base-blue/20 bg-base-blue/[0.05] px-3 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-base-blueLight/70">
            Live today
          </p>
          <p className="mt-1 text-sm leading-relaxed text-white/65">
            {ZAP_HOLDER_THRESHOLD}+ $ZAP holders pay a 0% platform fee on
            BaseZap tips. The fee is skipped entirely, so the recipient gets
            the full tip amount.
          </p>
        </div>

        <div className="mt-4 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/30">
            Base Mainnet · $ZAP contract
          </p>

          <div className="mt-1 flex items-center gap-2">
            <code className="min-w-0 flex-1 truncate text-[11px] text-white/60">
              {ZAP_TOKEN_ADDRESS}
            </code>

            <button
              type="button"
              onClick={handleCopy}
              title={ZAP_TOKEN_ADDRESS}
              className="flex-shrink-0 rounded-md border border-white/[0.08] px-2.5 py-1.5 text-[10px] font-semibold text-white/60 hover:text-white"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <a
            href={`https://basescan.org/token/${ZAP_TOKEN_ADDRESS}`}
            target="_blank"
            rel="noreferrer"
            className="flex-1 rounded-lg border border-white/[0.08] px-3 py-2 text-center text-[11px] font-semibold text-white/55 hover:text-white"
          >
            View on BaseScan ↗
          </a>

          <a
            href={CLANKER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 rounded-lg border border-white/[0.08] px-3 py-2 text-center text-[11px] font-semibold text-white/55 hover:text-white"
          >
            Clanker ↗
          </a>
        </div>

        <p className="mt-3 text-[10px] leading-relaxed text-white/30">
          Launched on Base Mainnet via Bankr. Always verify the contract
          address before buying or adding $ZAP.
        </p>

        <p className="mt-2 text-[10px] leading-relaxed text-white/25">
          Additional $ZAP utility is planned but not yet live. Only the 0%
          platform-fee benefit described above is active today.
        </p>
      </div>
    </section>
  );
}
