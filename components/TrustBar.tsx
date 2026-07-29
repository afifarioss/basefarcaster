import { PLATFORM_FEE_BPS, TIPPABLE_TOKENS } from "@/lib/constants";

export function TrustBar() {
  const items = [
    { label: "Tokens", value: TIPPABLE_TOKENS.map((t) => t.symbol).join(" · ") },
    { label: "Chain", value: "Base" },
    { label: "Fee", value: `${PLATFORM_FEE_BPS / 100}%` },
    { label: "Settles", value: "~2s" },
  ];

  return (
    <div className="mx-auto flex max-w-md flex-wrap items-center justify-center gap-2">
      {items.map((item) => (
        <span
          key={item.label}
          className="chip !cursor-default !border-white/[0.08] !bg-white/[0.03] !py-1.5 !px-3 text-xs"
        >
          <span className="mr-1 text-white/40">{item.label}:</span>
          <span className="font-semibold text-white">{item.value}</span>
        </span>
      ))}
    </div>
  );
}
