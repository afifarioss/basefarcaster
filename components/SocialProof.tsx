"use client";

import { useEffect, useState } from "react";
import { formatUsdc } from "@/lib/utils";

export function SocialProof() {
  const [stats, setStats] = useState<{
    tipCount: number;
    totalVolumeUsdc: number;
  } | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  if (!stats || stats.tipCount === 0) {
    // Honest empty state — no invented numbers while activity is low.
    return (
      <p className="text-center text-xs text-white/35">
        Be one of the first to send a tip on Base today.
      </p>
    );
  }

  return (
    <div className="glass-card mx-auto flex w-fit items-center gap-6 px-6 py-3 text-center">
      <div>
        <p className="font-display text-lg font-bold text-white">
          {stats.tipCount}
        </p>
        <p className="text-[11px] text-white/40">tips in 24h</p>
      </div>
      <div className="h-8 w-px bg-white/10" />
      <div>
        <p className="font-display text-lg font-bold text-white">
          ${formatUsdc(stats.totalVolumeUsdc)}
        </p>
        <p className="text-[11px] text-white/40">volume in 24h</p>
      </div>
    </div>
  );
}
