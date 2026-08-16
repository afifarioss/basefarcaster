import Image from "next/image";

const STACK = [
  {
    name: "Base",
    icon: "/images/base-square-blue.svg",
    blurb:
      "The Coinbase-built Ethereum L2 that settles every tip in seconds, for a fraction of a cent.",
    href: "https://base.org",
  },
  {
    name: "Farcaster",
    icon: "/images/farcaster-white.svg",
    blurb:
      "The decentralized social protocol this app lives inside — no separate download, no new account.",
    href: "https://farcaster.xyz",
  },
  {
    name: "Venice",
    icon: "/images/venice-logo.png",
    blurb:
      "Optional AI infrastructure powering VVV staking — a separate feature from tipping.",
    href: "https://venice.ai",
  },
];

export function BuiltWith() {
  return (
    <section className="mt-14 px-5">
      <div className="mx-auto max-w-md">
        <h2 className="text-center font-display text-2xl font-bold text-white">
          Built with
        </h2>
        <div className="mt-7 space-y-4">
          {STACK.map((item) => (
            <a
              key={item.name}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card flex gap-4 p-4 transition hover:bg-white/[0.04]"
            >
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white/[0.06]">
                <Image
                  src={item.icon}
                  alt={`${item.name} logo`}
                  width={18}
                  height={18}
                  className="opacity-90"
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  {item.name}
                </p>
                <p className="mt-0.5 text-sm text-white/45">{item.blurb}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
