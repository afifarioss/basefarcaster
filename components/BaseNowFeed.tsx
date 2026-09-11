"use client";

import { useCallback, useEffect, useState } from "react";
import {
  BaseNowSignal,
  type BaseNowSignalData,
} from "@/components/BaseNowSignal";

type RecentZapsMeta = {
  source?: string;
  verified?: boolean;
  network?: string;
  description?: string;
};

type RecentZapsResponse = {
  zaps?: BaseNowSignalData[];
  meta?: RecentZapsMeta;
};

export function BaseNowFeed() {
  const [zaps, setZaps] = useState<BaseNowSignalData[]>([]);
  const [meta, setMeta] = useState<RecentZapsMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);

  const loadZaps = useCallback(async () => {
    try {
      setError(false);

      const response = await fetch("/api/recent-zaps", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to load activity");
      }

      const data = (await response.json()) as RecentZapsResponse;

      setZaps(Array.isArray(data.zaps) ? data.zaps : []);
      setMeta(data.meta ?? null);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadZaps();

    const interval = window.setInterval(() => {
      void loadZaps();
    }, 30000);

    return () => window.clearInterval(interval);
  }, [loadZaps]);

  const handleRefresh = () => {
    if (refreshing) return;

    setRefreshing(true);
    void loadZaps();
  };

  const verified = meta?.verified === true;
  const source = meta?.source ?? "BaseZap";
  const network = meta?.network ?? "Base";

  if (loading) {
    return (
      <section className="mx-auto w-full max-w-3xl">
        <div className="mb-6">
          <div className="h-3 w-20 animate-pulse rounded bg-white/[0.06]" />
          <div className="mt-3 h-7 w-56 animate-pulse rounded bg-white/[0.06]" />
          <div className="mt-2 h-4 w-80 max-w-full animate-pulse rounded bg-white/[0.04]" />
        </div>

        <div className="space-y-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="glass-card h-40 animate-pulse"
              aria-hidden="true"
            />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mx-auto w-full max-w-3xl">
        <div className="glass-card p-7 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04]">
            <span className="h-2 w-2 rounded-full bg-white/40" />
          </div>

          <p className="mt-4 text-sm font-medium text-white/75">
            The signal feed is temporarily unavailable.
          </p>

          <p className="mx-auto mt-1.5 max-w-sm text-xs leading-5 text-white/40">
            Base NOW could not retrieve the latest verified activity.
          </p>

          <button
            type="button"
            onClick={handleRefresh}
            className="btn-secondary mt-5 px-4 py-2 text-sm"
          >
            Try again
          </button>
        </div>
      </section>
    );
  }

  if (zaps.length === 0) {
    return (
      <section className="mx-auto w-full max-w-3xl">
        <div className="glass-card relative overflow-hidden p-8 text-center">
          <div className="pointer-events-none absolute left-1/2 top-0 h-32 w-32 -translate-x-1/2 rounded-full bg-base-blue/10 blur-3xl" />

          <div className="relative">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04]">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-base-blueLight opacity-40" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-base-blueLight" />
              </span>
            </div>

            <div className="mt-5 flex items-center justify-center gap-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35">
                Base NOW
              </p>

              {verified && (
                <span className="rounded-full border border-white/[0.06] bg-white/[0.025] px-2 py-0.5 text-[8px] font-semibold uppercase tracking-[0.14em] text-white/30">
                  Verified
                </span>
              )}
            </div>

            <h2 className="mt-2 font-display text-xl font-semibold text-white">
              Waiting for the next signal
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/45">
              {meta?.description ??
                "Base NOW is waiting for verified Base activity to become a signal."}
            </p>

            <div className="mx-auto mt-6 flex max-w-xs items-center justify-center gap-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/25">
              <span>Signal</span>
              <span>→</span>
              <span>Context</span>
              <span>→</span>
              <span>Action</span>
            </div>

            <div className="mt-5 flex items-center justify-center gap-2 text-[9px] uppercase tracking-[0.14em] text-white/20">
              <span>{source}</span>
              <span>•</span>
              <span>{network}</span>
              <span>•</span>
              <span>Listening</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-3xl">
      <div className="mb-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-base-blueLight opacity-40" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-base-blueLight" />
              </span>

              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
                Live signal layer
              </p>
            </div>

            <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-white">
              What&apos;s happening on Base
            </h2>

            <p className="mt-1.5 max-w-xl text-sm leading-6 text-white/40">
              Verified activity, transformed into signals you can understand
              and act on.
            </p>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="shrink-0 text-xs font-medium text-white/45 transition hover:text-white disabled:cursor-wait disabled:opacity-40"
          >
            {refreshing ? "Updating…" : "Refresh"}
          </button>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2">
          {[
            ["01", "Signal", "What happened"],
            ["02", "Context", "Why it matters"],
            ["03", "Action", "What you can do"],
          ].map(([number, label, description]) => (
            <div
              key={number}
              className="rounded-xl border border-white/[0.06] bg-white/[0.025] px-3 py-3"
            >
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-semibold tracking-[0.14em] text-base-blueLight/60">
                  {number}
                </span>

                <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/50">
                  {label}
                </span>
              </div>

              <p className="mt-1 text-[10px] text-white/30">
                {description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-white/[0.05] bg-white/[0.02] px-3 py-2.5">
          <div className="flex min-w-0 items-center gap-2">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-base-blueLight" />

            <span className="truncate text-[9px] font-semibold uppercase tracking-[0.14em] text-white/30">
              {verified ? "Onchain verified" : "Signal source"}
            </span>
          </div>

          <span className="shrink-0 text-[9px] uppercase tracking-[0.12em] text-white/20">
            {source} · {network}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {zaps.map((zap, index) => (
          <div
            key={zap.txHash}
            className="animate-fade-up"
            style={{
              animationDelay: `${Math.min(index * 70, 350)}ms`,
            }}
          >
            <BaseNowSignal signal={zap} />
          </div>
        ))}
      </div>

      <div className="mt-7 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 text-center">
        <p className="text-xs font-medium text-white/60">
          Base is bigger than this feed.
        </p>

        <p className="mx-auto mt-1.5 max-w-md text-[11px] leading-5 text-white/35">
          Today, Base NOW starts with verified BaseZap activity. The signal
          engine is designed to expand into a broader view of meaningful Base
          activity.
        </p>

        <div className="mt-4 flex items-center justify-center gap-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/25">
          <span>Signal</span>
          <span>→</span>
          <span>Context</span>
          <span>→</span>
          <span>Action</span>
        </div>

        <div className="mt-4 flex items-center justify-center gap-2 text-[9px] text-white/20">
          <span>Auto-refreshing</span>
          <span>•</span>
          <span>Every 30 seconds</span>
        </div>
      </div>
    </section>
  );
}
