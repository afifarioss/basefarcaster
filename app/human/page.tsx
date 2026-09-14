"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

type Identity = {
  address: string;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
};

type Zap = {
  txHash: string;
  amountUsdc: number;
  tokenSymbol: string;
  timestamp: number;
  from: Identity;
  to: Identity;
};

function shortAddress(address: string) {
  if (!address) return "Unknown";
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
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

function IdentityLink({ identity }: { identity: Identity }) {
  const label = identity.username
    ? `@${identity.username}`
    : shortAddress(identity.address);

  if (!identity.username) {
    return (
      <span className="truncate font-mono text-sm text-white/65">
        {label}
      </span>
    );
  }

  return (
    <a
      href={`https://warpcast.com/${identity.username}`}
      target="_blank"
      rel="noreferrer"
      className="truncate text-sm font-semibold text-white/80 transition hover:text-base-blueLight"
    >
      {label}
    </a>
  );
}

function IdentityAvatar({ identity }: { identity: Identity }) {
  if (identity.pfpUrl) {
    return (
      <Image
        src={identity.pfpUrl}
        alt={identity.username ?? "Farcaster profile picture"}
        width={40}
        height={40}
        className="h-10 w-10 rounded-full border border-white/[0.08] object-cover"
      />
    );
  }

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-base-blue/15 text-xs font-bold text-base-blueLight">
      {identity.username?.slice(0, 2).toUpperCase() ??
        identity.address.slice(2, 4).toUpperCase()}
    </div>
  );
}

export default function HumanPage() {
  const [zaps, setZaps] = useState<Zap[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadPeople = useCallback(async () => {
    try {
      const response = await fetch("/api/recent-zaps", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Unable to load people");
      }

      const data = (await response.json()) as { zaps?: Zap[] };

      setZaps(Array.isArray(data.zaps) ? data.zaps : []);
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPeople();

    const interval = window.setInterval(() => {
      void loadPeople();
    }, 30000);

    return () => window.clearInterval(interval);
  }, [loadPeople]);

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

          <div className="flex items-center gap-2">
            <a
              href="/"
              className="hidden rounded-lg px-3 py-2 text-[11px] font-semibold text-white/40 transition hover:text-white sm:block"
            >
              Home
            </a>
            <a
              href="/app"
              className="rounded-lg border border-white/[0.10] bg-white/[0.035] px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/70 transition hover:border-base-blueLight/30 hover:text-white"
            >
              Open App →
            </a>
          </div>
        </div>
      </header>

      <section className="relative px-5 pb-20 pt-20 sm:px-8 sm:pb-28 sm:pt-28">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[560px] bg-[radial-gradient(circle_at_50%_0%,rgba(0,82,255,0.18),transparent_65%)]" />

        <div className="relative mx-auto max-w-6xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-base-blueLight/75">
            Human · People on Base
          </p>

          <h1 className="mt-6 max-w-4xl font-display text-[3.5rem] font-bold leading-[0.92] tracking-[-0.055em] text-white sm:text-7xl lg:text-[6.5rem]">
            The people
            <br />
            behind the{" "}
            <span className="bg-gradient-to-r from-base-blueLight via-white to-white/45 bg-clip-text text-transparent">
              activity.
            </span>
          </h1>

          <p className="mt-8 max-w-2xl text-base leading-7 text-white/45 sm:text-lg">
            Discover the creators, builders, and people participating through
            BaseZap. Human activity is where onchain transactions become real
            relationships.
          </p>
        </div>
      </section>

      <section className="border-y border-white/[0.06] px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-base-blueLight/70">
              People
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">
              Human activity on BaseZap.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/40">
              Follow the people sending and receiving support through the
              network. Profiles open directly on Farcaster when available.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#05070b]/95">
            {loading ? (
              <div className="px-5 py-14 text-center sm:px-6">
                <div className="mx-auto h-5 w-5 animate-spin rounded-full border-2 border-white/10 border-t-base-blueLight" />
                <p className="mt-4 text-xs text-white/30">
                  Finding people…
                </p>
              </div>
            ) : error ? (
              <div className="px-5 py-14 text-center sm:px-6">
                <p className="text-sm font-semibold text-white/70">
                  People activity is temporarily unavailable.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setLoading(true);
                    void loadPeople();
                  }}
                  className="mt-4 rounded-lg border border-white/[0.10] bg-white/[0.035] px-4 py-2 text-[11px] font-semibold text-white/60 transition hover:border-white/[0.18] hover:text-white"
                >
                  Try again
                </button>
              </div>
            ) : zaps.length === 0 ? (
              <div className="px-5 py-14 text-center sm:px-6">
                <p className="font-display text-lg font-bold text-white">
                  No people activity yet.
                </p>
                <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-white/30">
                  Send the first BaseZap and start the human layer.
                </p>
                <a
                  href="/app"
                  className="btn-primary mt-6 inline-flex items-center justify-center gap-2 !py-3 px-5 text-xs"
                >
                  Open the App →
                </a>
              </div>
            ) : (
              <div className="divide-y divide-white/[0.05]">
                {zaps.map((zap) => (
                  <article
                    key={zap.txHash}
                    className="px-5 py-5 transition hover:bg-white/[0.02] sm:px-6"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex min-w-0 items-center gap-3">
                        <IdentityAvatar identity={zap.from} />

                        <div className="flex min-w-0 items-center gap-2">
                          <IdentityLink identity={zap.from} />
                          <span className="shrink-0 text-white/20">→</span>
                          <IdentityLink identity={zap.to} />
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-4 text-right">
                        <span className="font-mono text-sm text-base-blueLight">
                          {zap.amountUsdc.toFixed(2)} {zap.tokenSymbol || "USDC"}
                        </span>
                        <span className="text-[10px] uppercase tracking-[0.12em] text-white/25">
                          {timeAgo(zap.timestamp)}
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          <p className="mt-4 text-[10px] leading-5 text-white/20">
            Activity refreshes automatically. Profile links open on Farcaster.
          </p>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-3">
          {[
            [
              "01",
              "Creators",
              "Support people whose work you value with a real onchain payment.",
            ],
            [
              "02",
              "Builders",
              "Discover the people contributing to the Base ecosystem through action.",
            ],
            [
              "03",
              "Communities",
              "See human relationships expressed through direct onchain support.",
            ],
          ].map(([number, title, text]) => (
            <div
              key={number}
              className="border-t border-white/[0.08] pt-6"
            >
              <p className="font-mono text-[10px] text-base-blueLight/60">
                {number}
              </p>
              <h2 className="mt-7 font-display text-2xl font-bold text-white">
                {title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-white/40">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-white/[0.06] px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-base-blueLight/70">
            Human layer
          </p>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-[-0.045em] text-white sm:text-6xl">
            Find someone worth
            <br />
            supporting.
          </h2>
          <a
            href="/app"
            className="btn-primary mt-8 inline-flex items-center justify-center gap-2 !py-3.5 px-7 text-sm"
          >
            Open BaseZap App →
          </a>
        </div>
      </section>

      <footer className="border-t border-white/[0.06] px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between text-[10px] text-white/25">
          <span>Human · BaseZap</span>
          <a href="/" className="transition hover:text-white/55">
            Back home →
          </a>
        </div>
      </footer>
    </main>
  );
}
