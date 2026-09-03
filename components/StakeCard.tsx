"use client";

import { useEffect, useMemo, useState } from "react";
import { useAccount, useConnect, useReadContract, useSwitchChain } from "wagmi";
import { useCallsStatus, useCapabilities, useSendCalls } from "wagmi/experimental";
import { parseUnits, formatUnits, encodeFunctionData } from "viem";
import { base } from "wagmi/chains";
import { ERC20_ABI, VVV_ADDRESS, VVV_STAKING_ADDRESS } from "@/lib/constants";

// Only the functions we actually call for staking
const STAKING_ABI = [
  {
    type: "function",
    name: "stake",
    stateMutability: "nonpayable",
    inputs: [
      { name: "recipient", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [],
  },
] as const;

export function StakeCard() {
  const { address, isConnected, chainId } = useAccount();
  const { connectors, connect } = useConnect();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const { sendCalls, isPending } = useSendCalls();
  const [amount, setAmount] = useState("");
  const [callsId, setCallsId] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">(
    "idle"
  );
  const [errorMsg, setErrorMsg] = useState("");

  // Poll for the batched transaction status
  const { data: callsStatus } = useCallsStatus({
    id: callsId as string,
    query: {
      enabled: !!callsId,
      refetchInterval: (query) =>
        query.state.data?.status === "success" ? false : 1000,
    },
  });
  const resolvedTxHash = callsStatus?.receipts?.[0]?.transactionHash;

  // Detect paymaster support
  const { data: availableCapabilities } = useCapabilities({ account: address });
  const paymasterSupported = useMemo(() => {
    if (!availableCapabilities || !chainId) return false;
    return availableCapabilities[chainId]?.paymasterService?.supported === true;
  }, [availableCapabilities, chainId]);

  const { data: vvvBalance } = useReadContract({
    address: VVV_ADDRESS,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const { data: vvvDecimals } = useReadContract({
    address: VVV_ADDRESS,
    abi: ERC20_ABI,
    functionName: "decimals",
  });

  const decimals = vvvDecimals ?? 18;
  const onBase = chainId === base.id;

  async function handleStake() {
    if (!isConnected) {
      const preferred =
        connectors.find((c) => c.id === "farcasterMiniApp") ?? connectors[0];
      if (preferred) connect({ connector: preferred });
      return;
    }

    if (!onBase) {
      switchChain({ chainId: base.id });
      return;
    }

    if (!amount || !address) return;

    setStatus("sending");
    setErrorMsg("");

    try {
      const amountBigInt = parseUnits(amount, decimals);

      // Batch approve + stake into one wallet confirmation
      const calls = [
        {
          capabilities: paymasterSupported
            ? {
                paymasterService: {
                  url: "/api/paymaster",
                },
              }
            : {},
          to: VVV_ADDRESS,
          data: encodeFunctionData({
            abi: ERC20_ABI,
            functionName: "approve",
            args: [VVV_STAKING_ADDRESS, amountBigInt],
          }),
        },
        {
          capabilities: paymasterSupported
            ? {
                paymasterService: {
                  url: "/api/paymaster",
                },
              }
            : {},
          to: VVV_STAKING_ADDRESS,
          data: encodeFunctionData({
            abi: STAKING_ABI,
            functionName: "stake",
            args: [address, amountBigInt],
          }),
        },
      ];

      sendCalls(
        {
          calls,
          capabilities: paymasterSupported
            ? {
                paymasterService: {
                  url: "/api/paymaster",
                },
              }
            : {},
        },
        {
          onSuccess: (data) => {
            setCallsId(data.id);
            setStatus("sending");
          },
          onError: (err: Error) => {
            setStatus("error");
            setErrorMsg(err?.message || "Staking failed");
          },
        }
      );
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err?.message || "Error preparing stake");
    }
  }

  // Auto-close success state after a delay
  useEffect(() => {
    if (callsStatus?.status === "success" && status === "sending") {
      setStatus("success");
      const timer = setTimeout(() => {
        setStatus("idle");
        setAmount("");
        setCallsId(undefined);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [callsStatus?.status, status]);

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
      <div className="flex items-center justify-between text-xs text-white/40">
        <span>Stake VVV</span>
        {vvvBalance !== undefined && (
          <span>Balance: {formatUnits(vvvBalance as bigint, decimals)} VVV</span>
        )}
      </div>

      {!isConnected ? (
        <>
          <p className="text-center text-sm leading-relaxed text-white/50">
            Connect your wallet to stake VVV on Base.
          </p>
          <button
            onClick={handleStake}
            disabled={!connectors.length}
            className="w-full rounded-lg bg-white px-3 py-2 text-xs font-semibold text-black transition hover:bg-white/90 disabled:opacity-40"
          >
            Connect wallet to stake
          </button>
        </>
      ) : !onBase ? (
        <>
          <p className="text-center text-sm leading-relaxed text-white/50">
            VVV staking is available on Base Mainnet.
          </p>
          <button
            onClick={handleStake}
            disabled={isSwitching}
            className="w-full rounded-lg bg-white px-3 py-2 text-xs font-semibold text-black transition hover:bg-white/90 disabled:opacity-40"
          >
            {isSwitching ? "Switching to Base…" : "Switch to Base"}
          </button>
        </>
      ) : (
        <>
          <input
            type="number"
            inputMode="decimal"
            min="0"
            step="any"
            placeholder="Amount to stake"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={status !== "idle"}
            className="w-full rounded-lg border border-white/[0.08] bg-black/20 px-3 py-2 text-sm text-white outline-none focus:border-white/20 disabled:opacity-50"
          />

          <button
            onClick={handleStake}
            disabled={!amount || status !== "idle" || isPending}
            className="w-full rounded-lg bg-white px-3 py-2 text-xs font-semibold text-black transition hover:bg-white/90 disabled:opacity-40"
          >
            {isPending
              ? "Staking…"
              : status === "success"
              ? "Staked ✓"
              : status === "error"
              ? "Try again"
              : "Stake VVV"}
          </button>
        </>
      )}

      {errorMsg && (
        <p className="text-center text-[10px] text-red-400">{errorMsg}</p>
      )}

      {callsId && !resolvedTxHash && (
        <p className="text-center text-[10px] text-white/40">
          Confirming on Basescan...
        </p>
      )}

      {resolvedTxHash && (
        <a
          href={`https://basescan.org/tx/${resolvedTxHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-center text-[10px] text-blue-400 hover:underline"
        >
          View on Basescan →
        </a>
      )}

      <p className="text-center text-[10px] text-white/30">
        Approve + stake batched into one transaction
        {paymasterSupported && " with gas sponsorship"}
      </p>
    </div>
  );
}
