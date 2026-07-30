const TRUST_ITEMS = [
  "Base Mainnet — settles onchain in seconds",
  "USDC only for tips — no unfamiliar tokens required",
  "Non-custodial — BaseZap never holds your funds",
  "You approve every transaction in your own wallet",
  "Creators receive USDC directly to their wallet",
  "View any transaction on Basescan, anytime",
  "VVV staking is optional and separately non-custodial — you control approve and stake steps, powered by Venice",
];

export function TrustChecklist() {
  return (
    <div className="glass-card w-full max-w-md p-5">
      <h3 className="font-display text-sm font-bold text-white">
        Why you can trust this
      </h3>
      <ul className="mt-3 space-y-2.5">
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
    </div>
  );
}
