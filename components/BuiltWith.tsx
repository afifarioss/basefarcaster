import Image from "next/image";

const STACK = [
  {
    name: "Base",
    category: "SETTLEMENT",
    icon: "/images/base-square-blue.svg",
    blurb:
      "The Ethereum L2 where BaseFarcaster tips settle directly onchain in seconds.",
    href: "https://base.org",
  },
  {
    name: "Farcaster",
    category: "SOCIAL IDENTITY",
    icon: "/images/farcaster-white.svg",
    blurb:
      "The decentralized social protocol connecting people, creators, and onchain identity.",
    href: "https://farcaster.xyz",
  },
  {
    name: "Bankr",
    category: "AGENT + x402",
    icon: "/images/bankr.png",
    blurb:
      "Bankr infrastructure powers BaseFarcaster's x402 agent experience and paid onchain API.",
    href: "https://bankr.bot",
  },
  {
    name: "Venice",
    category: "AI INFRASTRUCTURE",
    icon: "/images/venice-logo.png",
    blurb:
      "Optional AI infrastructure used by BaseFarcaster's Venice ecosystem features.",
    href: "https://venice.ai",
  },
];

export function BuiltWith() {
  return (
    <section className="mt-14 px-5">
      <div className="mx-auto max-w-md">
        <div className="text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-base-blueLight/60">
            Technology stack
          </p>

          <h2 className="mt-1 font-display text-2xl font-bold text-white">
            Built across the onchain ecosystem
          </h2>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-white/40">
            BaseFarcaster connects social identity, instant Base settlement,
            AI agents, and x402 payments into one tipping experience.
          </p>
        </div>

        <div className="mt-7 space-y-3">
          {STACK.map((item) => (
            <a
              key={item.name}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card flex items-center gap-4 p-4 transition hover:bg-white/[0.04]"
            >
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.04]">
                <Image
                  src={item.icon}
                  alt={`${item.name} logo`}
                  width={24}
                  height={24}
                  className="object-contain opacity-90"
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/25">
                  {item.category}
                </p>

                <div className="mt-0.5 flex items-center gap-2">
                  <p className="text-sm font-semibold text-white">
                    {item.name}
                  </p>

                  <span className="text-[10px] text-white/20">↗</span>
                </div>

                <p className="mt-0.5 text-sm leading-relaxed text-white/45">
                  {item.blurb}
                </p>
              </div>
            </a>
          ))}
        </div>

        <p className="mt-4 text-center text-[10px] leading-relaxed text-white/25">
          Technology and ecosystem references describe BaseFarcaster's
          integrations and infrastructure. They do not imply endorsement or
          partnership.
        </p>
      </div>
    </section>
  );
}
