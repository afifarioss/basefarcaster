import { PLATFORM_FEE_WALLET } from "@/lib/constants";

const TRUST_ITEMS = [
  "Base Mainnet — tips settle onchain, typically within seconds",
  "USDC, VVV, and DIEM are supported for tipping",
  "Non-custodial — BaseZap does not custody your funds",
  "Your wallet approves the transaction before it is sent",
  "Funds are sent directly to the recipient's Base wallet",
  "Transactions can be independently verified on BaseScan",
  "The applicable platform fee is visible and verifiable onchain",
];

export function TrustChecklist() {
  return (
    <div className="glass-card w-full max-w-md p-5">
      <h3 className="font-display text-sm font-bold text-white">
        The mechanism matters more than the marketing.
      </h3>

      <ul className="mt-4 space-y-2.5">
        {TRUST_ITEMS.map((item) => (
          <li
            key={item}
            className="flex items-start gap-2.5 text-sm text-white/60"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              className="mt-0.5 flex-shrink-0"
            >
              <path
                d="M5 13l4 4L19 7"
                stroke="#3D7BFF"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <a
        href={`https://basescan.org/address/${PLATFORM_FEE_WALLET}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 block text-center text-xs text-base-blueLight underline underline-offset-2 hover:text-white"
      >
        Verify the platform fee wallet on BaseScan ↗
      </a>
    </div>
  );
}
