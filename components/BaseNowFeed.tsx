"use client";

import { useCallback, useEffect, useState } from "react";
import {
  BaseNowSignal,
  type BaseNowSignalData,
} from "@/components/BaseNowSignal";

type RecentZapsResponse = {
  zaps?: BaseNowSignalData[];
};

export function BaseNowFeed() {
  const [zaps, setZaps] = useState<BaseNowSignalData[]>([]);
  const [loading, setLoading] = useState(true);
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
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadZaps();

    const interval = window.setInterval(() => {
      void loadZaps();
    }, 30000);

    return () => window.clearInterval(interval);
  }, [loadZaps]);

  if (loading) {
    return (
      <section className="mx-auto w-full max-w-3xl">
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
        <div className="glass-card p-6 text-center">
          <p className="text-sm text-white/70">
            We couldn&apos;t load the latest activity.
          </p>

          <button
            type="button"
            onClick={() => {
              setLoading(true);
              void loadZaps();
            }}
            className="btn-secondary mt-4 px-4 py-2 text-sm"
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
        <div className="glass-card p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-white/60">
            NOW
          </div>

          <h2 className="mt-4 text-lg font-semibold text-white">
            Nothing happening here yet
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/50">
            Base NOW is starting with verified BaseZap activity. More Base
            activity will appear here as the feed expands.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-3xl">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/40">
            Live
          </p>
          <h2 className="mt-1 text-xl font-semibold text-white">
            What&apos;s happening
          </h2>
        </div>

        <button
          type="button"
          onClick={() => {
            setLoading(true);
            void loadZaps();
          }}
          className="text-xs text-white/50 transition hover:text-white"
        >
          Refresh
        </button>
      </div>

      <div className="space-y-3">
        {zaps.map((zap) => (
          <BaseNowSignal key={zap.txHash} signal={zap} />
        ))}
      </div>
    </section>
  );
}
