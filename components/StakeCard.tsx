"use client";

import { useState } from "react";
import { useAccount, useWriteContract, useReadContract, useWaitForTransactionReceipt } from "wagmi";
import { parseUnits, formatUnits } from "viem";
import { ERC20_ABI, VVV_ADDRESS, VVV_STAKING_ADDRESS } from "@/lib/constants";

// Only the functions we actually call, taken verbatim from Basescan's
// verified "Write as Proxy" interface for the sVVV staking contract.
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
  {
    type: "function",
    name: "initiateUnstake",
    stateMutability: "nonpayable",
    inputs: [{ name: "amount", type: "uint256" }],
    outputs: [],
  },
  {
    type: "function",
    name: "finalizeUnstake",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: [],
  },
  {
    type: "function",
    name: "claim",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: [],
  },
] as const;

export function StakeCard() {
  const { address, isConnected } = useAccount();
  const [amount, setAmount] = useState("");

  const { data: vvvBalance } = useReadContract({
    address: VVV_ADDRESS,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const { writeContract: approve, data: approveHash } = useWriteContract();
  const { writeContract: stake, data: stakeHash } = useWriteContract();

  const { isLoading: isApproving, isSuccess: approved } =
    useWaitForTransactionReceipt({ hash: approveHash });
  const { isLoading: isStaking, isSuccess: staked } =
    useWaitForTransactionReceipt({ hash: stakeHash });

  function handleApprove() {
    if (!amount) return;
    approve({
      address: VVV_ADDRESS,
      abi: [
        {
          type: "function",
          name: "approve",
          stateMutability: "nonpayable",
          inputs: [
            { name: "spender", type: "address" },
            { name: "amount", type: "uint256" },
          ],
          outputs: [{ name: "", type: "bool" }],
        },
      ],
      functionName: "approve",
      args: [VVV_STAKING_ADDRESS, parseUnits(amount, 18)],
    });
  }

  function handleStake() {
    if (!amount || !address) return;
    stake({
      address: VVV_STAKING_ADDRESS,
      abi: STAKING_ABI,
      functionName: "stake",
      args: [address, parseUnits(amount, 18)],
    });
  }

  if (!isConnected) return null;

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
      <div className="flex items-center justify-between text-xs text-white/40">
        <span>Stake VVV</span>
        {vvvBalance !== undefined && (
          <span>Balance: {formatUnits(vvvBalance as bigint, 18)} VVV</span>
        )}
      </div>

      <input
        type="number"
        inputMode="decimal"
        placeholder="Amount to stake"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full rounded-lg border border-white/[0.08] bg-black/20 px-3 py-2 text-sm text-white outline-none focus:border-white/20"
      />

      <div className="flex gap-2">
        <button
          onClick={handleApprove}
          disabled={!amount || isApproving}
          className="flex-1 rounded-lg border border-white/[0.08] bg-white/[0.05] px-3 py-2 text-xs font-semibold text-white/80 transition hover:bg-white/[0.1] disabled:opacity-40"
        >
          {isApproving ? "Approving..." : approved ? "Approved ✓" : "1. Approve"}
        </button>
        <button
          onClick={handleStake}
          disabled={!amount || !approved || isStaking}
          className="flex-1 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-black transition hover:bg-white/90 disabled:opacity-40"
        >
          {isStaking ? "Staking..." : staked ? "Staked ✓" : "2. Stake"}
        </button>
      </div>

      <p className="text-center text-[10px] text-white/30">
        Staking requires two wallet confirmations: approve, then stake.
      </p>
    </div>
  );
}
