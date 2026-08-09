"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type ZapIdentity = {
  address: string;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
};

type Zap = {
  txHash: string;
  amountUsdc: number;
  timestamp: number | null;
  from: ZapIdentity;
  to: ZapIdentity;
};

function shortAddress(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function timeAgo(ts: number | null) {
  if (!ts) return "";
  const diffSec = Math.max(0, Math.floor(Date.now() / 1000) - ts);
  if (diffSec < 60) return "just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  return `${Math.floor(diffHr / 24)}d ago`;
}

function ZapAvatar({ identity }: { identity: ZapIdentity }) {
  if (identity.pfpUrl) {
    return (
      <Image
        src={identity.pfpUrl}
        alt={identity.username ?? "Farcaster profile picture"}
        width={28}
        height={28}
        className="h-7 w-7 rounded-full border border-white/[0.08] object-cover"
      />
    );
  }
  return (
    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-base-blue/20 text-[10px] font-bold text-base-blueLight">
      {identity.username?.slice(0, 2).toUpperCase() ??
        identity.address.slice(2, 4).toUpperCase()}
    </div>
  );
}

function ZapLabel({ identity }: { identity: ZapIdentity }) {
  return (
    <span className="truncate text-xs font-medium text-white">
      {identity.username ? `@${identity.username}` : shortAddress(identity.address)}
    </span>
  );
}

export function RecentZaps({ onCtaClick }: { onCtaClick?: () => void } = {}) {
  const [zaps, setZaps] = useState<Zap[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/recent-zaps")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setZaps(data.zaps ?? []);
      })
      .catch(() => {
        if (!cancelled) setZaps([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Still loading — render nothing rather than a layout-shifting skeleton.
  if (zaps === null) return null;

  if (zaps.length === 0) {
    return (
      <div className="glass-card flex animate-fade-up flex-col items-center gap-2 px-4 py-6 text-center">
        <p className="text-sm font-medium text-white/70">
          No zaps yet — be the first to reward a good cast.
        </p>
        <button onClick={onCtaClick} className="chip mt-1 !py-2 text-xs">
          Zap someone now
        </button>
      </div>
    );
  }

  return (
    <div className="glass-card flex animate-fade-up flex-col gap-1 px-4 py-3">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-white/45">
        Recent zaps
      </p>
      {zaps.map((zap) => (
        <a
          key={zap.txHash}
          href={`https://basescan.org/tx/${zap.txHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-lg px-1 py-2 transition-colors hover:bg-white/[0.03]"
        >
          <ZapAvatar identity={zap.from} />
          <ZapLabel identity={zap.from} />
          <span className="text-white/30">⚡</span>
          <ZapAvatar identity={zap.to} />
          <ZapLabel identity={zap.to} />
          <span className="ml-auto shrink-0 text-xs font-semibold text-emerald-400">
            ${zap.amountUsdc.toFixed(2)}
          </span>
          {zap.timestamp && (
            <span className="shrink-0 text-[10px] text-white/35">
              {timeAgo(zap.timestamp)}
            </span>
          )}
        </a>
      ))}
    </div>
  );
}
