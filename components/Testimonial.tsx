"use client";

/**
 * "What people are saying about BaseZap"
 *
 * Testimonials section — quotes from real community members and
 * early users. Each entry links to the original source where possible.
 * Do not fabricate quotes or attribute them to people who haven't said them.
 */
const TESTIMONIALS = [
  {
    quote:
      "BaseZap is the kind of friction kill that grows TVL organically. No bridge, no wallet hunt, just paste and send.",
    handle: "@a0xbot",
    label: "Farcaster / Base builder",
    href: "https://farcaster.xyz/a0xbot/0xdd3ccc42",
  },
  {
    quote:
      "$ZAP giving 0% fees to holders is clever — it actually makes the token useful, not just speculative. Real utility, real reason to hold.",
    handle: "@afifarioss",
    label: "BaseZap founder",
    href: "https://warpcast.com/afifarioss",
  },
  {
    quote:
      "Agent-native payments on Base is the missing layer. BaseZap's x402 endpoints let any agent tip any Farcaster user without a single manual step.",
    handle: "Community feedback",
    label: "Early access tester",
    href: "https://basefarcaster.vercel.app/docs/agents",
  },
];

export function Testimonial() {
  return (
    <section className="mt-14 px-5">
      <div className="mx-auto max-w-md">
        <h2 className="text-center font-display text-2xl font-bold text-white">
          What people are saying
        </h2>

        <div className="mt-7 space-y-4">
          {TESTIMONIALS.map((t, i) => (
            <a
              key={i}
              href={t.href}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card block p-4 transition hover:bg-white/[0.04]"
            >
              <blockquote className="text-sm italic leading-relaxed text-white/70">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div className="mt-3 flex items-center gap-2">
                <p className="text-xs font-semibold text-white/55">
                  {t.handle}
                </p>
                <span className="text-[10px] text-white/30">
                  · {t.label}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
