"use client";

import { useState } from "react";
import Image from "next/image";
import { useAccount } from "wagmi";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { APP_URL } from "@/lib/constants";

export function ProfileCard() {
  const { context } = useMiniKit();
  const { address, isConnected } = useAccount();
  const user = context?.user;
  const [copied, setCopied] = useState(false);

  if (!user) return null;

  async function handleCopyLink() {
    if (!address) return;
    const label = user?.username ? `@${user.username}` : "me";
    const link = `${APP_URL}?to=${address}&label=${encodeURIComponent(label)}`;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API unavailable — fail silently, button just won't confirm
    }
  }

  return (
    <div className="glass-card flex animate-fade-up flex-col gap-3 px-4 py-3">
      <div className="flex items-center gap-3">
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

      {isConnected && address && (
        <button
          onClick={handleCopyLink}
          className="chip w-full !py-2.5 text-xs"
        >
          {copied ? "Copied! Paste it in a cast 💙" : "Get your tip link"}
        </button>
      )}
    </div>
  );
}
