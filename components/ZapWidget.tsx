"use client";

import { useEffect, useState } from "react";

type ZapStats = {
  available: boolean;
  priceUsd?: string;
  marketCap?: number;
  priceChange1h?: number;
};

const ZAP_TOKEN_ADDRESS = "0x8C1ca2c32CD197a27CA049aA0427f64192aD3ba3";
const BUY_ZAP_URL = `https://dexscreener.com/base/${ZAP_TOKEN_ADDRESS}`;
const CLANKER_URL = `https://clanker.world/clanker/${ZAP_TOKEN_ADDRESS}`;

export function ZapWidget() {
  const [stats, setStats] = useState<ZapStats | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/zap-stats")
      .then((res) => res.json())
      .then(setStats)
      .catch(() => setStats({ available: false }));
  }, []);

  if (!stats?.available) return null;

  const change = stats.priceChange1h ?? 0;
  const isUp = change >= 0;
  const shortAddress = `${ZAP_TOKEN_ADDRESS.slice(0, 6)}...${ZAP_TOKEN_ADDRESS.slice(-4)}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(ZAP_TOKEN_ADDRESS);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API unavailable -- ignore, address is still visible to copy manually.
    }
  };

  return (
    <div className="glass-card flex w-full max-w-md flex-col gap-3 px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0A0A0A] border border-[#D4AF37]/40">
            <span className="font-display text-xs font-bold text-[#D4AF37]">
              Z
            </span>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">$ZAP</p>
            <p className="text-xs text-white/45">
              MCap ${stats.marketCap?.toLocaleString()}
              {stats.priceChange1h !== undefined && (
                <span className={isUp ? "text-emerald-400" : "text-red-400"}>
                  {" "}
                  {isUp ? "+" : ""}
                  {change.toFixed(1)}% 1h
                </span>
              )}
            </p>
          </div>
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

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={handleCopy}
          title={ZAP_TOKEN_ADDRESS}
          className="flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-[10px] text-white/40 transition hover:border-white/[0.15] hover:text-white/60"
        >
          <span className="font-mono">{shortAddress}</span>
          <span>{copied ? "Copied ✓" : "Tap to copy"}</span>
        </button>
        <a
          href={CLANKER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-[10px] text-white/40 transition hover:border-white/[0.15] hover:text-white/60"
        >
          <span className="font-semibold text-white/60">Deployed via Clanker</span>
        </a>
      </div>
    </div>
  );
}
