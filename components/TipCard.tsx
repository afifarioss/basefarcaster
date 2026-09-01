"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useAccount, useConnect, useReadContract } from "wagmi";
import { useCallsStatus, useCapabilities, useSendCalls } from "wagmi/experimental";
import { encodeFunctionData } from "viem";
import {
  BASE_BUILDER_CODE_SUFFIX,
  ERC20_ABI,
  PLATFORM_FEE_BPS,
  PLATFORM_FEE_WALLET,
  TIP_PRESETS,
  TIPPABLE_TOKENS,
  USDC_DECIMALS,
  ZAP_TOKEN_ADDRESS,
  ZAP_HOLDER_THRESHOLD,
  type TippableTokenSymbol,
} from "@/lib/constants";
import { formatUsdc, formatAddress, splitTipAmount } from "@/lib/utils";
import { SuccessModal } from "./SuccessModal";

export function TipCard({
  recipient,
  recipientLabel = "this creator",
  recipientFid,
  recipientAddress,
  recipientPfpUrl,
  recipientUsername,
}: {
  recipient: `0x${string}`;
  recipientLabel?: string;
  recipientFid?: number;
  recipientAddress?: string;
  recipientPfpUrl?: string;
  recipientUsername?: string;
}) {
  const { isConnected, address, chainId } = useAccount();
  const { connectors, connect } = useConnect();
  const { sendCalls, isPending } = useSendCalls();
  const [callsId, setCallsId] = useState<string | undefined>(undefined);
  const historyRecordedRef = useRef(false);
  const { data: callsStatus } = useCallsStatus({
    id: callsId as string,
    query: {
      enabled: !!callsId,
      refetchInterval: (query) =>
        query.state.data?.status === "success" ? false : 1000,
    },
  });
  const resolvedTxHash = callsStatus?.receipts?.[0]?.transactionHash;

  const { data: availableCapabilities } = useCapabilities({ account: address });
  const paymasterSupported = useMemo(() => {
    if (!availableCapabilities || !chainId) return false;
    return availableCapabilities[chainId]?.paymasterService?.supported === true;
  }, [availableCapabilities, chainId]);

  // Check $ZAP token balance to determine fee eligibility
  const { data: zapBalance } = useReadContract({
    address: ZAP_TOKEN_ADDRESS,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: [address!],
    query: { enabled: !!address },
  });

  const isZapHolder = useMemo(() => {
    if (!zapBalance) return false;
    // $ZAP uses 18 decimals (standard ERC20)
    const threshold = BigInt(ZAP_HOLDER_THRESHOLD) * BigInt(10) ** BigInt(18);
    return zapBalance >= threshold;
  }, [zapBalance]);

  const effectiveFeeBps = isZapHolder ? 0 : PLATFORM_FEE_BPS;

  const [tokenSymbol, setTokenSymbol] =
    useState<TippableTokenSymbol>("USDC");

  const token = TIPPABLE_TOKENS.find((t) => t.symbol === tokenSymbol)!;

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
    if (
      status === "sending" &&
      callsStatus?.status === "success" &&
      resolvedTxHash
    ) {
      setStatus("success");
    }
  }, [callsStatus?.status, resolvedTxHash, status]);

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

  useEffect(() => {
    if (
      resolvedTxHash &&
      address &&
      !historyRecordedRef.current
    ) {
      historyRecordedRef.current = true;
      fetch("/api/record-tip-history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from: address,
          to: recipient,
          amountUsdc: amount,
          txHash: resolvedTxHash,
          tokenSymbol,
          feeBps: effectiveFeeBps,
        }),
      }).catch(() => {});
    }
  }, [resolvedTxHash, address, tokenSymbol, recipient, amount, effectiveFeeBps]);

  const { fee, recipientAmount } = useMemo(
    () => splitTipAmount(amount || 0, decimals, effectiveFeeBps),
    [amount, decimals, effectiveFeeBps]
  );

  async function handleTip() {
    if (amount <= 0) return;

    if (!isConnected) {
      const preferred =
        connectors.find((c) => c.id === "baseAccount") ??
        connectors.find((c) => c.id === "farcasterMiniApp") ??
        connectors[0];

      if (preferred) {
        connect({ connector: preferred });
      }
      return;
    }

    setStatus("sending");
    setErrorMsg("");

    try {
      // For $ZAP holders (0% fee): single transfer to creator only.
      // For normal users (2% fee): two transfers — creator + platform fee.
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
      ];

      // Only add fee transfer when fee > 0
      if (fee > BigInt(0)) {
        calls.push({
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
        });
      }

      sendCalls(
        {
          calls,
          capabilities: {
            ...(paymasterSupported
              ? {
                  paymasterService: {
                    url: process.env.NEXT_PUBLIC_PAYMASTER_URL as string,
                  },
                }
              : {}),
            dataSuffix: {
              value: BASE_BUILDER_CODE_SUFFIX,
              optional: true,
            },
          },
        },
        {
          onSuccess: (data) => {
            setCallsId(data.id);
            setStatus("sending");
            if (recipientFid) {
              fetch("/api/notify-tip", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  fid: recipientFid,
                  walletAddress: recipient,
                  amount,
                  tokenSymbol,
                  callsId: data.id,
                }),
              }).catch(() => {});
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

  const feePercent = effectiveFeeBps / 100;
  const feeAmount = amount ? (amount * effectiveFeeBps) / 10000 : 0;
  const creatorReceives = amount ? amount - feeAmount : 0;

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

      {/* Recipient identity — clearly shows who you're tipping */}
      {recipientAddress && recipientAddress !== recipient && (
        <div className="mt-3 flex items-center gap-3 rounded-xl border border-base-blue/20 bg-base-blue/[0.04] p-3">
          {recipientPfpUrl ? (
            <img
              src={recipientPfpUrl}
              width={40}
              height={40}
              className="rounded-full"
              alt=""
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-base-blue/15 text-sm font-bold text-base-blueLight">
              {(recipientUsername ?? "B").slice(0, 1).toUpperCase()}
            </div>
          )}
          <div className="min-w-0 flex-1">
            {recipientUsername && (
              <p className="truncate text-sm font-semibold text-white">
                @{recipientUsername}
              </p>
            )}
            <p className="truncate text-xs text-white/50">
              {formatAddress(recipientAddress)}
            </p>
          </div>
        </div>
      )}

      {/* Token selector */}
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
            {t.symbol === "DIEM" && (
              <span className="ml-1 text-[9px] text-white/35">optional</span>
            )}
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

      {/* Fee breakdown — transparent and clear */}
      <div className="mt-5 space-y-1.5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-sm">
        <div className="flex justify-between text-white/55">
          <span>{recipientLabel} receives</span>
          <span className="text-white/85">
            {formatUsdc(creatorReceives)} {tokenSymbol}
          </span>
        </div>
        <div className="flex justify-between text-white/40">
          <span>
            Platform fee{isZapHolder && " ($ZAP holder)"}
            {!isZapHolder && ` (${feePercent}%)`}
          </span>
          <span>
            {formatUsdc(feeAmount)} {tokenSymbol}
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
        {isZapHolder ? (
          <>
            $ZAP fee benefit applied — holding {ZAP_HOLDER_THRESHOLD}+ $ZAP
            grants 0% platform fee on every tip.
          </>
        ) : (
          <>
            {feePercent}% platform fee supports development —
            shown above, nothing hidden. Hold {ZAP_HOLDER_THRESHOLD}+ $ZAP
            for 0% fee.
          </>
        )}
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
