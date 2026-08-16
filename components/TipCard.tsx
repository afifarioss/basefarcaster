"use client";

import { useEffect, useMemo, useState } from "react";
import { useAccount, useConnect, useReadContract } from "wagmi";
// EIP-5792 batched calls are still exposed from wagmi's experimental entry
// point as of wagmi v2.13. Check the wagmi changelog when upgrading —
// this may move to the root `wagmi` export in a future major version.
import { useCallsStatus, useCapabilities, useSendCalls } from "wagmi/experimental";
import { encodeFunctionData } from "viem";
import {
  ERC20_ABI,
  PLATFORM_FEE_BPS,
  PLATFORM_FEE_WALLET,
  TIP_PRESETS,
  TIPPABLE_TOKENS,
  USDC_DECIMALS,
  type TippableTokenSymbol,
} from "@/lib/constants";
import { formatUsdc, splitTipAmount } from "@/lib/utils";
import { SuccessModal } from "./SuccessModal";

export function TipCard({
  recipient,
  recipientLabel = "this creator",
  recipientFid,
}: {
  recipient: `0x${string}`;
  recipientLabel?: string;
  recipientFid?: number;
}) {
  const { isConnected, address, chainId } = useAccount();
  const { connectors, connect } = useConnect();
  const { sendCalls, isPending } = useSendCalls();
  const [callsId, setCallsId] = useState<string | undefined>(undefined);
  // Resolves the EIP-5792 bundle ID into a real onchain transaction hash —
  // sendCalls only gives back a bundle id (data.id), not a tx hash, and
  // that bundle id is NOT a valid Basescan link on its own.
  const { data: callsStatus } = useCallsStatus({
    id: callsId as string,
    query: {
      enabled: !!callsId,
      refetchInterval: (query) =>
        query.state.data?.status === "success" ? false : 1000,
    },
  });
  const resolvedTxHash = callsStatus?.receipts?.[0]?.transactionHash;

  // Detect whether the connected wallet actually supports gas sponsorship
  // (EIP-5792 paymasterService) before requesting it. Wallets that don't
  // support it should generally ignore an unsupported capability, but
  // checking upfront lets us know the real sponsorship state rather than
  // assuming it's always active.
  const { data: availableCapabilities } = useCapabilities({ account: address });
  const paymasterSupported = useMemo(() => {
    if (!availableCapabilities || !chainId) return false;
    return availableCapabilities[chainId]?.paymasterService?.supported === true;
  }, [availableCapabilities, chainId]);

  const [tokenSymbol, setTokenSymbol] =
    useState<TippableTokenSymbol>("USDC");
  const token = TIPPABLE_TOKENS.find((t) => t.symbol === tokenSymbol)!;

  // USDC's decimals are a known constant (6). VVV's are fetched live from
  // its own contract rather than assumed, since we don't hardcode facts
  // about a token we don't control.
  const { data: fetchedDecimals } = useReadContract({
    address: token.address,
    abi: ERC20_ABI,
    functionName: "decimals",
    query: { enabled: token.decimals === null },
  });
  const decimals = token.decimals ?? fetchedDecimals ?? 18;

  const [selected, setSelected] = useState<number>(TIP_PRESETS[2]);
  const [custom, setCustom] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">(
    "idle"
  );
  const [errorMsg, setErrorMsg] = useState("");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (status !== "sending" && !isPending) {
      setElapsedSeconds(0);
      return;
    }
    const interval = setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [status, isPending]);

  const amount = useMemo(() => {
    if (isCustom) {
      const n = parseFloat(custom);
      return isNaN(n) || n <= 0 ? 0 : n;
    }
    return selected;
  }, [isCustom, custom, selected]);

  const { fee, recipientAmount } = useMemo(
    () => splitTipAmount(amount || 0, decimals),
    [amount, decimals]
  );

  async function handleTip() {
    if (amount <= 0) return;

    if (!isConnected) {
      const preferred =
        connectors.find((c) => c.id === "farcasterMiniApp") ?? connectors[0];
      connect({ connector: preferred });
      return;
    }

    setStatus("sending");
    setErrorMsg("");

    try {
      // Two transfers batched into one wallet confirmation where the
      // connector supports EIP-5792 (Smart Wallet, Farcaster wallet, etc.);
      // falls back to sequential prompts on wallets without batching.
      const calls = [
        {
          capabilities: paymasterSupported
            ? {
                paymasterService: {
                  url: process.env.NEXT_PUBLIC_PAYMASTER_URL as string,
                },
              }
            : {},
          to: token.address,
          data: encodeFunctionData({
            abi: ERC20_ABI,
            functionName: "transfer",
            args: [recipient, recipientAmount],
          }),
        },
        {
          capabilities: paymasterSupported
            ? {
                paymasterService: {
                  url: process.env.NEXT_PUBLIC_PAYMASTER_URL as string,
                },
              }
            : {},
          to: token.address,
          data: encodeFunctionData({
            abi: ERC20_ABI,
            functionName: "transfer",
            args: [PLATFORM_FEE_WALLET, fee],
          }),
        },
      ];

      sendCalls(
        {
          calls,
          capabilities: paymasterSupported
            ? {
                paymasterService: {
                  url: process.env.NEXT_PUBLIC_PAYMASTER_URL as string,
                },
              }
            : {},
        },
        {
          onSuccess: (data) => {
            setCallsId(data.id);
            setStatus("success");
              if (recipientFid) {
                fetch("/api/notify-tip", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    fid: recipientFid,
                    amount,
                    tokenSymbol,
                  }),
                }).catch(() => {
                  // Notification is best-effort — never surface this to the tipper.
                });
              }
          },
          onError: (err) => {
            setErrorMsg(err.message.split("\n")[0].slice(0, 140));
            setStatus("error");
          },
        }
      );
    } catch (err: any) {
      setErrorMsg(err?.message?.slice(0, 140) ?? "Something went wrong.");
      setStatus("error");
    }
  }

  return (
    <div className="glass-card w-full max-w-md p-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-bold text-white">
          Send a tip
        </h3>
        <span className="chip !cursor-default !border-transparent !bg-white/[0.03] !px-3 !py-1 text-[11px] text-white/40">
          on Base
        </span>
      </div>
      <p className="mt-1 text-sm text-white/45">
        100% onchain. Delivered to {recipientLabel} in seconds.
      </p>

      {/* Token selector — USDC is the default; VVV is offered as a
          secondary option, not the headline currency. */}
      <div className="mt-4 flex gap-2">
        {TIPPABLE_TOKENS.map((t) => (
          <button
            key={t.symbol}
            onClick={() => setTokenSymbol(t.symbol)}
            className={`chip !py-2 flex-1 ${
              tokenSymbol === t.symbol ? "chip-active" : ""
            }`}
          >
            {t.symbol}
          </button>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-4 gap-2">
        {TIP_PRESETS.map((preset) => (
          <button
            key={preset}
            onClick={() => {
              setIsCustom(false);
              setSelected(preset);
            }}
            className={`chip !py-3 text-base ${
              !isCustom && selected === preset ? "chip-active" : ""
            }`}
          >
            {tokenSymbol === "USDC" ? "$" : ""}
            {formatUsdc(preset)}
          </button>
        ))}
      </div>

      <div className="mt-2">
        <button
          onClick={() => setIsCustom(true)}
          className={`chip w-full !py-3 ${isCustom ? "chip-active" : ""}`}
        >
          <input
            type="number"
            inputMode="decimal"
            placeholder="Custom amount"
            value={custom}
            onFocus={() => setIsCustom(true)}
            onChange={(e) => setCustom(e.target.value)}
            className="w-full bg-transparent text-center outline-none placeholder:text-white/35"
            min={0}
            step={0.01}
          />
        </button>
      </div>

      <div className="mt-5 space-y-1.5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-sm">
        <div className="flex justify-between text-white/55">
          <span>{recipientLabel} receives</span>
          <span className="text-white/85">
            {formatUsdc(amount ? amount * (1 - PLATFORM_FEE_BPS / 10000) : 0)}{" "}
            {tokenSymbol}
          </span>
        </div>
        <div className="flex justify-between text-white/40">
          <span>Platform fee ({PLATFORM_FEE_BPS / 100}%)</span>
          <span>
            {formatUsdc(amount ? amount * (PLATFORM_FEE_BPS / 10000) : 0)}{" "}
            {tokenSymbol}
          </span>
        </div>
        <div className="!mt-2.5 flex justify-between border-t border-white/[0.06] pt-2.5 font-semibold text-white">
          <span>Total</span>
          <span>
            {formatUsdc(amount)} {tokenSymbol}
          </span>
        </div>
      </div>

      <p className="mt-3 text-center text-[11px] leading-relaxed text-white/35">
        A {PLATFORM_FEE_BPS / 100}% platform fee supports development —
        shown above, nothing hidden.
      </p>

      <button
        onClick={handleTip}
        disabled={amount <= 0 || status === "sending" || isPending}
        className="btn-primary mt-4 w-full !py-4 text-base"
      >
        {status === "sending" || isPending
          ? "Confirm in wallet…"
          : isConnected
          ? `Tip ${formatUsdc(amount)} ${tokenSymbol}`
          : "Connect & Tip"}
      </button>

      {(status === "sending" || isPending) && elapsedSeconds >= 3 && (
        <p className="mt-3 text-center text-xs text-white/40">
          Still confirming… this can take a few extra seconds on a busy network.
        </p>
      )}

      {status === "error" && (
        <p className="mt-3 text-center text-xs text-red-400">{errorMsg}</p>
      )}

      {status === "success" && (
        <SuccessModal
          recipientLabel={recipientLabel}
          amount={amount}
          txHash={resolvedTxHash}
          tokenSymbol={tokenSymbol}
          onClose={() => setStatus("idle")}
        />
      )}
    </div>
  );
}
