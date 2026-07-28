"use client";

import { useMemo, useState } from "react";
import { useAccount, useConnect } from "wagmi";
// EIP-5792 batched calls are still exposed from wagmi's experimental entry
// point as of wagmi v2.13. Check the wagmi changelog when upgrading —
// this may move to the root `wagmi` export in a future major version.
import { useSendCalls } from "wagmi/experimental";
import { encodeFunctionData } from "viem";
import {
  ERC20_ABI,
  PLATFORM_FEE_BPS,
  TIP_PRESETS,
  USDC_ADDRESS,
} from "@/lib/constants";
import { formatUsdc, splitTipAmount } from "@/lib/utils";
import { SuccessModal } from "./SuccessModal";

export function TipCard({
  recipient,
  recipientLabel = "this creator",
}: {
  recipient: `0x${string}`;
  recipientLabel?: string;
}) {
  const { isConnected } = useAccount();
  const { connectors, connect } = useConnect();
  const { sendCalls, isPending } = useSendCalls();

  const [selected, setSelected] = useState<number>(TIP_PRESETS[1]);
  const [custom, setCustom] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">(
    "idle"
  );
  const [txHash, setTxHash] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState("");

  const amount = useMemo(() => {
    if (isCustom) {
      const n = parseFloat(custom);
      return isNaN(n) || n <= 0 ? 0 : n;
    }
    return selected;
  }, [isCustom, custom, selected]);

  const { fee, recipientAmount } = useMemo(
    () => splitTipAmount(amount || 0),
    [amount]
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
      // Two ERC-20 transfers batched into one wallet confirmation where the
      // connector supports EIP-5792 (Smart Wallet, Farcaster wallet, etc.);
      // falls back to sequential prompts on wallets without batching.
      const calls = [
        {
          to: USDC_ADDRESS,
          data: encodeFunctionData({
            abi: ERC20_ABI,
            functionName: "transfer",
            args: [recipient, recipientAmount],
          }),
        },
        {
          to: USDC_ADDRESS,
          data: encodeFunctionData({
            abi: ERC20_ABI,
            functionName: "transfer",
            args: [
              (process.env.NEXT_PUBLIC_FEE_WALLET as `0x${string}`) ||
                "0x000000000000000000000000000000000000dEaD",
              fee,
            ],
          }),
        },
      ];

      sendCalls(
        { calls },
        {
          onSuccess: (data) => {
            setTxHash(data.id);
            setStatus("success");
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

      <div className="mt-5 grid grid-cols-3 gap-2">
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
            ${formatUsdc(preset)}
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
            {formatUsdc(amount ? amount * (1 - PLATFORM_FEE_BPS / 10000) : 0)} USDC
          </span>
        </div>
        <div className="flex justify-between text-white/40">
          <span>Platform fee (10%)</span>
          <span>{formatUsdc(amount ? amount * (PLATFORM_FEE_BPS / 10000) : 0)} USDC</span>
        </div>
        <div className="!mt-2.5 flex justify-between border-t border-white/[0.06] pt-2.5 font-semibold text-white">
          <span>Total</span>
          <span>{formatUsdc(amount)} USDC</span>
        </div>
      </div>

      <p className="mt-3 text-center text-[11px] leading-relaxed text-white/35">
        A 10% platform fee supports BaseFarCaster and keeps tipping free to
        build on.
      </p>

      <button
        onClick={handleTip}
        disabled={amount <= 0 || status === "sending" || isPending}
        className="btn-primary mt-4 w-full !py-4 text-base"
      >
        {status === "sending" || isPending
          ? "Confirm in wallet…"
          : isConnected
          ? `Tip $${formatUsdc(amount)} USDC`
          : "Connect & Tip"}
      </button>

      {status === "error" && (
        <p className="mt-3 text-center text-xs text-red-400">{errorMsg}</p>
      )}

      {status === "success" && (
        <SuccessModal
          amount={amount}
          txHash={txHash}
          onClose={() => setStatus("idle")}
        />
      )}
    </div>
  );
}
