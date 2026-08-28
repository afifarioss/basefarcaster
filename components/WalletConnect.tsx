"use client";

import { useState, useRef, useEffect } from "react";
import { useAccount, useConnect, useDisconnect, useBalance } from "wagmi";
import { formatAddress } from "@/lib/utils";
import { USDC_ADDRESS } from "@/lib/constants";

const CONNECTOR_LABELS: Record<string, string> = {
  baseAccount: "Base Account",
  farcasterMiniApp: "Farcaster Wallet",
  coinbaseWalletSDK: "Coinbase / Base Smart Wallet",
  metaMaskSDK: "MetaMask",
  metaMask: "MetaMask",
  injected: "Browser Wallet",
};

function connectorLabel(id: string, name: string) {
  return CONNECTOR_LABELS[id] ?? name;
}

export function WalletConnect() {
  const { address, isConnected, connector } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { data: balance } = useBalance({
    address,
    token: USDC_ADDRESS,
    query: { enabled: !!address },
  });

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  if (isConnected && address) {
    return (
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.04] py-2 pl-2 pr-4 transition hover:border-white/[0.2] hover:bg-white/[0.07]"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-base-blue to-base-blueDark text-[11px] font-bold">
            {address.slice(2, 4).toUpperCase()}
          </span>
          <span className="text-sm font-medium text-white/90">
            {formatAddress(address)}
          </span>
        </button>

        {open && (
          <div className="absolute right-0 z-30 mt-2 w-64 animate-scale-in rounded-2xl border border-white/[0.08] bg-[#0D0E10] p-3 shadow-2xl">
            <div className="rounded-xl bg-white/[0.03] p-3">
              <p className="text-[11px] uppercase tracking-wide text-white/40">
                Connected via
              </p>
              <p className="mt-0.5 text-sm font-medium text-white">
                {connector ? connectorLabel(connector.id, connector.name) : "Wallet"}
              </p>
            </div>
            <div className="mt-2 rounded-xl bg-white/[0.03] p-3">
              <p className="text-[11px] uppercase tracking-wide text-white/40">
                USDC Balance
              </p>
              <p className="mt-0.5 text-sm font-medium text-white">
                {balance
                  ? `${Number(balance.formatted).toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })} USDC`
                  : "—"}
              </p>
            </div>
            <button
              onClick={() => {
                disconnect();
                setOpen(false);
              }}
              className="mt-2 w-full rounded-xl border border-white/[0.08] py-2.5 text-sm font-medium text-white/70 transition hover:border-red-500/40 hover:text-red-400"
            >
              Disconnect
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        disabled={isPending}
        className="btn-primary !px-5 !py-2.5 !text-sm"
      >
        {isPending ? "Connecting…" : "Connect Wallet"}
      </button>

      {open && (
        <div className="absolute right-0 z-30 mt-2 w-72 animate-scale-in rounded-2xl border border-white/[0.08] bg-[#0D0E10] p-2 shadow-2xl">
          {connectors.map((c) => (
            <button
              key={c.uid}
              onClick={() => {
                connect({ connector: c });
                setOpen(false);
              }}
              className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-medium text-white/85 transition hover:bg-white/[0.06]"
            >
              {connectorLabel(c.id, c.name)}
              <span className="text-white/30">→</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
