"use client";

import { useEffect, useState } from "react";

type ZapStats = {
  available: boolean;
  priceUsd?: string;
  marketCap?: number;
  priceChange1h?: number;
};

const BUY_ZAP_URL =
  "https://dexscreener.com/base/0x8C1ca2c32CD197a27CA049aA0427f64192aD3ba3";

export function ZapWidget() {
  const [stats, setStats] = useState<ZapStats | null>(null);

  useEffect(() => {
    fetch("/api/zap-stats")
      .then((res) => res.json())
      .then(setStats)
      .catch(() => setStats({ available: false }));
  }, []);

  if (!stats?.available) return null;

  const change = stats.priceChange1h ?? 0;
  const isUp = change >= 0;

  return (
    <div className="glass-card flex w-full max-w-md items-center justify-between gap-3 px-4 py-3">
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
  );
}
