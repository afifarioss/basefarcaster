"use client";

import { useCallback, useEffect, useState } from "react";

const signals = [
  {
    number: "01",
    title: "Projects",
    text: "Find products and builders shaping what is being built on Base.",
  },
  {
    number: "02",
    title: "Agents",
    text: "Follow AI services and programmable economies emerging around Base.",
  },
  {
    number: "03",
    title: "People",
    text: "Discover creators, builders, and communities through meaningful activity.",
  },
  {
    number: "04",
    title: "Activity",
    text: "Turn onchain signals into places worth exploring and actions worth taking.",
  },
];

type Identity = {
  address: string;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
};

type Zap = {
  txHash: string;
  amountUsdc: number;
  timestamp: number;
  from: Identity;
  to: Identity;
};

function shortAddress(address: string) {
  if (!address) return "Unknown";
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

function displayIdentity(identity: Identity) {
  return identity.username
    ? `@${identity.username}`
    : shortAddress(identity.address);
}

function timeAgo(timestamp: number) {
  const seconds = Math.max(0, Math.floor(Date.now() / 1000) - timestamp);

  if (seconds < 60) return `${seconds}s ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  return `${Math.floor(hours / 24)}d ago`;
}

export default function BaseNowPage() {
  const [zaps, setZaps] = useState<Zap[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [error, setError] = useState(false);

  const loadSignals = useCallback(async () => {
    try {
      const response = await fetch("/api/recent-zaps", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Unable to load signals");
      }

      const data = (await response.json()) as { zaps?: Zap[] };

      setZaps(Array.isArray(data.zaps) ? data.zaps : []);
      setLastUpdated(Date.now());
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSignals();

    const interval = window.setInterval(() => {
      void loadSignals();
    }, 30000);

    return () => window.clearInterval(interval);
  }, [loadSignals]);

  return (
    <main className="min-h-screen overflow-hidden bg-noise-grid">
      <header className="border-b border-white/[0.06] bg-surface-void/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <a href="/" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-base-blue/60 bg-base-blue">
              <span className="font-display text-sm font-bold text-white">
                Z
              </span>
            </span>
            <span className="font-display text-[15px] font-bold text-white">
              BaseZap
            </span>
          </a>

          <a
            href="/"
            className="rounded-lg px-3 py-2 text-[11px] font-semibold text-white/40 transition hover:text-white"
          >
            BaseZap Home
          </a>
        </div>
      </header>

      <section className="relative px-5 pb-16 pt-20 sm:px-8 sm:pb-20 sm:pt-28">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[560px] bg-[radial-gradient(circle_at_50%_0%,rgba(0,82,255,0.18),transparent_65%)]" />

        <div className="relative mx-auto max-w-6xl">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 animate-pulse rounded-full bg-base-blueLight shadow-[0_0_16px_rgba(0,82,255,0.8)]" />
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-base-blueLight/75">
                BaseNow · Live discovery layer
              </p>
            </div>

            <h1 className="mt-6 font-display text-[3.5rem] font-bold leading-[0.92] tracking-[-0.055em] text-white sm:text-7xl lg:text-[6.5rem]">
              See what is
              <br />
              happening on{" "}
              <span className="bg-gradient-to-r from-base-blueLight via-white to-white/45 bg-clip-text text-transparent">
                Base.
              </span>
            </h1>

            <p className="mt-8 max-w-2xl text-base leading-7 text-white/45 sm:text-lg">
              BaseNow is the discovery layer we are building for the Base
              economy — connecting signals, projects, agents, people, and
              activity so you can discover what is happening and decide where
              to go next.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/35">
              <span>Signal</span>
              <span className="text-base-blueLight/60">→</span>
              <span>Explore</span>
              <span className="text-base-blueLight/60">→</span>
              <span>Understand</span>
              <span className="text-base-blueLight/60">→</span>
              <span>Act</span>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/[0.06] px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-emerald-300/70">
                  Live signal feed
                </p>
              </div>

              <h2 className="mt-3 font-display text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">
                Something is happening.
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-white/40">
                Real activity from the BaseZap network becomes the first signal
                layer inside BaseNow. Watch it change, follow the participants,
                and inspect the transaction yourself.
              </p>
            </div>

            <div className="text-[10px] uppercase tracking-[0.16em] text-white/25">
              {lastUpdated
                ? `Updated ${timeAgo(Math.floor(lastUpdated / 1000))}`
                : "Connecting…"}
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#05070b]/95">
            <div className="border-b border-white/[0.06] px-5 py-4 sm:px-6">
              <div className="grid grid-cols-[1fr_auto] gap-4 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/25 sm:grid-cols-[1fr_120px_90px]">
                <span>Signal</span>
                <span className="hidden sm:block">Value</span>
                <span>Time</span>
              </div>
            </div>

            {loading ? (
              <div className="px-5 py-14 text-center sm:px-6">
                <div className="mx-auto h-5 w-5 animate-spin rounded-full border-2 border-white/10 border-t-base-blueLight" />
                <p className="mt-4 text-xs text-white/30">
                  Looking for activity on Base…
                </p>
              </div>
            ) : error ? (
              <div className="px-5 py-14 text-center sm:px-6">
                <p className="text-sm font-semibold text-white/70">
                  Signal feed temporarily unavailable.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setLoading(true);
                    void loadSignals();
                  }}
                  className="mt-4 rounded-lg border border-white/[0.10] bg-white/[0.035] px-4 py-2 text-[11px] font-semibold text-white/60 transition hover:border-white/[0.18] hover:text-white"
                >
                  Try again
                </button>
              </div>
            ) : zaps.length === 0 ? (
              <div className="px-5 py-14 text-center sm:px-6">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-base-blue/20 bg-base-blue/[0.06]">
                  <span className="font-display text-lg font-bold text-base-blueLight">
                    Z
                  </span>
                </div>
                <p className="mt-5 font-display text-lg font-bold text-white">
                  Waiting for the next signal.
                </p>
                <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-white/30">
                  BaseNow is connected. When new BaseZap activity arrives, it
                  will appear here as a live discovery signal.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-white/[0.05]">
                {zaps.map((zap) => (
                  <article
                    key={zap.txHash}
                    className="group px-5 py-5 transition hover:bg-white/[0.02] sm:px-6"
                  >
                    <div className="grid gap-4 sm:grid-cols-[1fr_120px_90px] sm:items-center">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 text-sm">
                          {zap.from.username ? (
                            <a
                              href={`https://warpcast.com/${zap.from.username}`}
                              target="_blank"
                              rel="noreferrer"
                              className="font-semibold text-white/80 transition hover:text-base-blueLight"
                            >
                              {displayIdentity(zap.from)}
                            </a>
                          ) : (
                            <span className="font-mono text-white/65">
                              {displayIdentity(zap.from)}
                            </span>
                          )}

                          <span className="text-white/20">→</span>

                          {zap.to.username ? (
                            <a
                              href={`https://warpcast.com/${zap.to.username}`}
                              target="_blank"
                              rel="noreferrer"
                              className="truncate font-semibold text-white/80 transition hover:text-base-blueLight"
                            >
                              {displayIdentity(zap.to)}
                            </a>
                          ) : (
                            <span className="truncate font-mono text-white/65">
                              {displayIdentity(zap.to)}
                            </span>
                          )}
                        </div>

                        <a
                          href={`https://basescan.org/tx/${zap.txHash}`}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2 inline-flex items-center gap-1.5 font-mono text-[10px] text-white/25 transition hover:text-base-blueLight"
                        >
                          {shortAddress(zap.txHash)}
                          <span>↗</span>
                        </a>
                      </div>

                      <div className="font-mono text-sm text-base-blueLight sm:text-right">
                        {zap.amountUsdc.toFixed(2)} USDC
                      </div>

                      <div className="text-[10px] uppercase tracking-[0.12em] text-white/25 sm:text-right">
                        {timeAgo(zap.timestamp)}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          <p className="mt-4 text-[10px] leading-5 text-white/20">
            Live signals refresh automatically. Transaction links open directly
            on BaseScan; Farcaster identities open on Warpcast.
          </p>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 max-w-2xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-base-blueLight/70">
              Explore the Base economy
            </p>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-[-0.04em] text-white sm:text-5xl">
              One signal can lead somewhere.
            </h2>
            <p className="mt-5 text-sm leading-6 text-white/40 sm:text-base">
              BaseNow is not just a feed. The goal is to turn activity into
              context — so you can understand who is involved, what is being
              built, and where the signal leads.
            </p>
          </div>

          <div className="grid gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.08] sm:grid-cols-2">
            {signals.map((signal) => (
              <div
                key={signal.number}
                className="bg-[#05070b]/95 p-7 transition hover:bg-white/[0.025] sm:p-9"
              >
                <p className="font-mono text-[10px] text-base-blueLight/60">
                  {signal.number}
                </p>
                <h2 className="mt-8 font-display text-2xl font-bold tracking-tight text-white">
                  {signal.title}
                </h2>
                <p className="mt-3 max-w-md text-sm leading-6 text-white/40">
                  {signal.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/[0.06] px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-base-blueLight/70">
            The model
          </p>

          <h2 className="mt-4 font-display text-3xl font-bold tracking-[-0.04em] text-white sm:text-5xl">
            Signal → Explore → Understand → Act
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-white/40 sm:text-base">
            A useful signal should lead somewhere: to a project, a person, an
            agent, a transaction, or an application. BaseNow is the layer that
            helps users find that path.
          </p>

          <div className="mt-10 grid gap-3 sm:grid-cols-4">
            {["Signal", "Explore", "Understand", "Act"].map((step, index) => (
              <div
                key={step}
                className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-5"
              >
                <span className="font-mono text-[10px] text-base-blueLight/55">
                  0{index + 1}
                </span>
                <p className="mt-3 text-sm font-semibold text-white/75">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-white/[0.06] px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between text-[10px] text-white/25">
          <span>BaseNow · BaseZap</span>
          <a href="/" className="transition hover:text-white/55">
            basezap.home →
          </a>
        </div>
      </footer>
    </main>
  );
}
