"use client";

import Image from "next/image";
import { useMiniKit } from "@coinbase/onchainkit/minikit";

export function ProfileCard() {
  const { context } = useMiniKit();
  const user = context?.user;

  if (!user) return null;

  return (
    <div className="glass-card flex animate-fade-up items-center gap-3 px-4 py-3">
      {user.pfpUrl ? (
        <Image
          src={user.pfpUrl}
          alt={user.username ?? "Farcaster profile picture"}
          width={40}
          height={40}
          className="h-10 w-10 rounded-full border border-white/[0.08] object-cover"
        />
      ) : (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-base-blue/20 text-sm font-bold text-base-blueLight">
          {user.username?.slice(0, 2).toUpperCase() ?? "FC"}
        </div>
      )}
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-white">
          {user.displayName ?? user.username ?? `FID ${user.fid}`}
        </p>
        <p className="text-xs text-white/45">
          @{user.username ?? "farcaster"} · FID {user.fid}
        </p>
      </div>
      <span className="ml-auto flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-400">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        Verified
      </span>
    </div>
  );
}
