"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";
import { ShareButton } from "./ShareButton";
import { formatUsdc } from "@/lib/utils";

export function SuccessModal({
  amount,
  txHash,
  onClose,
}: {
  amount: number;
  txHash: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const fire = () => {
      confetti({
        particleCount: 90,
        spread: 75,
        startVelocity: 45,
        origin: { y: 0.35 },
        colors: ["#0052FF", "#3D7BFF", "#FFFFFF", "#7EA6FF"],
      });
    };
    fire();
    const t = setTimeout(fire, 250);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center">
      <div className="w-full max-w-sm animate-scale-in rounded-t-3xl border border-white/[0.08] bg-[#0B0C0E] p-6 pb-8 shadow-2xl sm:rounded-3xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-base-blue/15 shadow-glow-blue">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 13l4 4L19 7"
              stroke="#3D7BFF"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h3 className="mt-5 text-center font-display text-xl font-bold text-white">
          Tip sent onchain
        </h3>
        <p className="mt-1 text-center text-sm text-white/55">
          {formatUsdc(amount)} USDC delivered on Base. It just cleared in
          seconds.
        </p>

        <a
          href={`https://basescan.org/tx/${txHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 block truncate rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-center text-xs font-medium text-base-blueLight hover:bg-white/[0.06]"
        >
          View on Basescan ↗
        </a>

        <div className="mt-3 flex flex-col gap-2.5">
          <ShareButton
            text={`Just tipped ${formatUsdc(
              amount
            )} USDC onchain with BaseFarCaster 💙 Real money, real speed, real Base.`}
          />
          <button onClick={onClose} className="btn-primary w-full">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
