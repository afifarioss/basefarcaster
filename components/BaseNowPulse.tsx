"use client";

import { useCallback, useEffect, useState } from "react";

type Stats = {
  tipCount: number;
  totalVolumeUsdc: number;
  supporterCount: number;
  windowHours?: number;
};

export function BaseNowPulse() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const loadStats = useCallback(async () => {
    try {
      const response = await fetch("/api/stats", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to load pulse");
      }

      const data = (await response.json()) as Stats;
      setStats(data);
    } catch {
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadStats();

    const interval = window.setInterval(() => {
      void loadStats();
    }, 30000);

    return () => window.clearInterval(interval);
  }, [loadStats]);

  const tipCount = stats?.tipCount ?? 0;
  const volume = stats?.totalVolumeUsdc ?? 0;
  const supporters = stats?.supporterCount ?? 0;
  const windowHours = stats?.windowHours ?? 24;

  return (
    <section className="mx-auto w-full max-w-3xl">
      <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.025] p-5 shadow-2xl shadow-black/20 sm:p-6">
        <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-base-blue/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-base-blueLight/[0.04] blur-3xl" />

        <div className="relative">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-base-blueLight opacity-40" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-base-blueLight" />
                </span>

                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-base-blueLight/70">
                  Live pulse
                </p>
              </div>

              <h2 className="mt-2 font-display text-xl font-semibold tracking-tight text-white sm:text-2xl">
                The pulse of Base
              </h2>

              <p className="mt-1.5 text-xs leading-5 text-white/35">
                Verified BaseZap activity over the last {windowHours} hours.
              </p>
            </div>

            <div className="hidden shrink-0 sm:block">
              <span className="rounded-full border border-white/[0.07] bg-white/[0.035] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-white/30">
                Onchain verified
              </span>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2">
            <div className="rounded-2xl border border-white/[0.06] bg-black/10 p-4">
              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/25">
                Signals
              </p>

              <p className="mt-2 font-display text-2xl font-bold text-white">
                {loading ? "—" : tipCount}
              </p>

              <p className="mt-1 text-[10px] text-white/30">
                verified tips
              </p>
            </div>

            <div className="rounded-2xl border border-white/[0.06] bg-black/10 p-4">
              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/25">
                Flow
              </p>

              <p className="mt-2 font-display text-2xl font-bold text-white">
                {loading ? "—" : `$${volume.toFixed(2)}`}
              </p>

              <p className="mt-1 text-[10px] text-white/30">
                USDC activity
              </p>
            </div>

            <div className="rounded-2xl border border-white/[0.06] bg-black/10 p-4">
              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/25">
                People
              </p>

              <p className="mt-2 font-display text-2xl font-bold text-white">
                {loading ? "—" : supporters}
              </p>

              <p className="mt-1 text-[10px] text-white/30">
                unique supporters
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-4">
            <p className="text-[10px] text-white/25">
              {tipCount > 0
                ? "Activity is moving on Base."
                : "Waiting for verified activity."}
            </p>

            <div className="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-white/20">
              <span>Signal</span>
              <span>→</span>
              <span>Context</span>
              <span>→</span>
              <span>Action</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
