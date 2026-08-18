"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type Entry = {
  address: string;
  totalUsdc: number;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
};

function shortAddress(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function EntryAvatar({ entry }: { entry: Entry }) {
  if (entry.pfpUrl) {
    return (
      <Image
        src={entry.pfpUrl}
        alt={entry.username ?? "Farcaster profile picture"}
        width={28}
        height={28}
        className="h-7 w-7 rounded-full border border-white/[0.08] object-cover"
      />
    );
  }
  return (
    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-base-blue/20 text-[10px] font-bold text-base-blueLight">
      {entry.username?.slice(0, 2).toUpperCase() ??
        entry.address.slice(2, 4).toUpperCase()}
    </div>
  );
}

function EntryRow({ entry, rank }: { entry: Entry; rank: number }) {
  return (
    <a
      href={`https://basescan.org/address/${entry.address}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2.5 rounded-lg px-1 py-2 transition-colors hover:bg-white/[0.03]"
    >
      <span className="w-4 shrink-0 text-xs font-semibold text-white/35">
        {rank}
      </span>
      <EntryAvatar entry={entry} />
      <span className="truncate text-xs font-medium text-white">
        {entry.username ? `@${entry.username}` : shortAddress(entry.address)}
      </span>
      <span className="ml-auto shrink-0 text-xs font-semibold text-emerald-400">
        ${entry.totalUsdc.toFixed(2)}
      </span>
    </a>
  );
}

export function Leaderboard() {
  const [data, setData] = useState<{
    senders: Entry[];
    recipients: Entry[];
  } | null>(null);
  const [tab, setTab] = useState<"senders" | "recipients">("senders");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/leaderboard")
      .then((res) => res.json())
      .then((d) => {
        if (!cancelled) setData({ senders: d.senders ?? [], recipients: d.recipients ?? [] });
      })
      .catch(() => {
        if (!cancelled) setData({ senders: [], recipients: [] });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (data === null) return null;

  const entries = tab === "senders" ? data.senders : data.recipients;

  return (
    <div className="glass-card flex w-full max-w-md animate-fade-up flex-col gap-1 px-4 py-3">
      <div className="mb-1 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-white/45">
          Leaderboard
        </p>
        <div className="flex gap-1 rounded-lg bg-white/[0.04] p-0.5">
          <button
            onClick={() => setTab("senders")}
            className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
              tab === "senders" ? "bg-white/[0.1] text-white" : "text-white/45"
            }`}
          >
            Top senders
          </button>
          <button
            onClick={() => setTab("recipients")}
            className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
              tab === "recipients" ? "bg-white/[0.1] text-white" : "text-white/45"
            }`}
          >
            Top earners
          </button>
        </div>
      </div>

      {entries.length === 0 ? (
        <p className="py-4 text-center text-xs text-white/40">
          No zaps yet — be the first on the board.
        </p>
      ) : (
        entries.map((entry, i) => (
          <EntryRow key={entry.address} entry={entry} rank={i + 1} />
        ))
      )}
    </div>
  );
}
