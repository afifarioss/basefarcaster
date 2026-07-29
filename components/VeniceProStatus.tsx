"use client";

import { useAccount, useReadContract } from "wagmi";
import { formatUnits } from "viem";
import {
  ERC20_ABI,
  VVV_STAKING_ADDRESS,
  VVV_PRO_STAKE_THRESHOLD,
} from "@/lib/constants";

/**
 * Shows whether the connected wallet has staked enough VVV to unlock
 * Venice Pro (100 VVV, per venice.ai/lp/vvv — verified directly, not
 * taken from any chatbot's account of its own tokenomics).
 *
 * Reads live from Venice's real staking contract. Renders nothing if no
 * wallet is connected, or if the wallet holds zero sVVV — no invented
 * numbers, no fallback guesses.
 */
export function VeniceProStatus() {
  const { address, isConnected } = useAccount();

  const { data: decimals } = useReadContract({
    address: VVV_STAKING_ADDRESS,
    abi: ERC20_ABI,
    functionName: "decimals",
    query: { enabled: isConnected },
  });

  const { data: balance } = useReadContract({
    address: VVV_STAKING_ADDRESS,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  if (!isConnected || !balance || balance === BigInt(0) || decimals === undefined) {
    return null;
  }

  const stakedAmount = Number(formatUnits(balance, decimals));
  const isProUnlocked = stakedAmount >= VVV_PRO_STAKE_THRESHOLD;

  return (
    <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[11px]">
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isProUnlocked ? "bg-emerald-400" : "bg-white/30"
        }`}
      />
      <span className="text-white/60">
        {stakedAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}{" "}
        VVV staked
      </span>
      {isProUnlocked && (
        <span className="font-semibold text-emerald-400">
          · Venice Pro unlocked
        </span>
      )}
    </div>
  );
}
