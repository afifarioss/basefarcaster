"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type TipIdentity = {
  address: string;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
};

type Tip = {
  txHash: string;
  amountUsdc: number;
  tokenSymbol: string;
  timestamp: number;
  from: TipIdentity;
  to: TipIdentity;
};

function shortAddress(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function timeAgo(ts: number) {
  const diffSec = Math.max(0, Math.floor((Date.now() - ts) / 1000));
  if (diffSec < 60) return "just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  return `${Math.floor(diffHr / 24)}d ago`;
}

function TipAvatar({ identity }: { identity: TipIdentity }) {
  if (identity.pfpUrl) {
    return (
      <Image
        src={identity.pfpUrl}
        alt={identity.username ?? "Farcaster profile picture"}
        width={26}
        height={26}
        className="h-[26px] w-[26px] rounded-full border border-white/[0.08] object-cover"
      />
    );
  }
  return (
    <div className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-base-blue/20 text-[10px] font-bold text-base-blueLight">
      {identity.username?.slice(0, 2).toUpperCase() ??
        identity.address.slice(2, 4).toUpperCase()}
    </div>
  );
}

function TipLabel({ identity }: { identity: TipIdentity }) {
  return (
    <span className="truncate text-xs font-medium text-white">
      {identity.username ? `@${identity.username}` : shortAddress(identity.address)}
    </span>
  );
}

export function TipHistory() {
  const [tips, setTips] = useState<Tip[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [initialLoaded, setInitialLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/api/tip-history?page=${page}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        setTips((prev) => (page === 0 ? data.tips ?? [] : [...prev, ...(data.tips ?? [])]));
        setHasMore(Boolean(data.hasMore));
        setInitialLoaded(true);
      })
      .catch(() => {
        if (!cancelled) setInitialLoaded(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [page]);

  if (!initialLoaded) return null;

  if (tips.length === 0) {
    return (
      <div className="glass-card flex w-full max-w-md flex-col items-center gap-2 px-4 py-6 text-center">
        <p className="text-sm font-medium text-white/70">
          No tip history yet.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card flex w-full max-w-md flex-col gap-1 px-4 py-3">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-white/45">
        Tip history
      </p>
      {tips.map((tip) => (
        <a
          key={tip.txHash}
          href={`https://basescan.org/tx/${tip.txHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-lg px-1 py-2 transition-colors hover:bg-white/[0.03]"
        >
          <TipAvatar identity={tip.from} />
          <TipLabel identity={tip.from} />
          <span className="text-white/30">⚡</span>
          <TipAvatar identity={tip.to} />
          <TipLabel identity={tip.to} />
          <span className="ml-auto shrink-0 text-xs font-semibold text-emerald-400">
            ${tip.amountUsdc.toFixed(2)}
          </span>
          <span className="shrink-0 text-[10px] text-white/35">
            {timeAgo(tip.timestamp)}
          </span>
        </a>
      ))}

      {hasMore && (
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={loading}
          className="chip mt-2 w-full !py-2 text-xs"
        >
          {loading ? "Loading…" : "Load more"}
        </button>
      )}
    </div>
  );
}
