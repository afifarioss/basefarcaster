import Image from "next/image";

const BADGES = [
  {
    name: "Base",
    href: "https://base.org",
    icon: "/images/base-square-blue.svg",
    label: "Built on Base",
  },
  {
    name: "Farcaster",
    href: "https://farcaster.xyz",
    icon: "/images/farcaster-white.svg",
    label: "Farcaster Mini App",
  },
];

export function VeniceAttribution() {
  return (
    <div className="mx-auto flex w-fit flex-wrap items-center justify-center gap-2">
      {BADGES.map((badge) => (
        <a
          key={badge.name}
          href={badge.href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[11px] text-white/40 transition hover:border-white/[0.15] hover:text-white/60"
        >
          <Image
            src={badge.icon}
            alt={`${badge.name} logo`}
            width={14}
            height={14}
            className="opacity-80"
          />
          <span className="font-semibold text-white/60">{badge.label}</span>
        </a>
      ))}
      <a
        href="https://venice.ai"
        target="_blank"
        rel="noopener noreferrer"
        className="transition hover:opacity-80"
      >
        <Image
          src="/images/venice-logo.png"
          alt="Built in Venice"
          width={95}
          height={44}
        />
      </a>
    </div>
  );
}
