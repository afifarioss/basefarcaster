"use client";

import { useEffect, useState } from "react";

type Stats = {
  tipCount: number;
  totalVolumeUsdc: number;
  supporterCount: number;
};

export function BetaStats() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(() => setStats(null));
  }, []);

  if (!stats) return null;

  const items = [
    { label: "Tips sent", value: stats.tipCount },
    { label: "USDC tipped", value: `$${stats.totalVolumeUsdc.toFixed(2)}` },
    { label: "Supporters", value: stats.supporterCount },
  ];

  return (
    <div className="grid w-full max-w-md grid-cols-3 gap-3 text-center">
      {items.map((item) => (
        <div key={item.label} className="glass-card px-3 py-4">
          <p className="font-display text-lg font-bold text-white">
            {item.value}
          </p>
          <p className="mt-1 text-[11px] text-white/40">{item.label}</p>
        </div>
      ))}
    </div>
  );
}
