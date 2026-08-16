import { APP_NAME, PLATFORM_FEE_BPS } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="mt-12 border-t border-white/[0.06] px-5 py-8 text-center">
      <p className="text-xs text-white/35">
        {APP_NAME} · Built on{" "}
        <span className="font-medium text-white/50">Base</span>
      </p>
      <p className="mt-1.5 text-[11px] text-white/25">
        A {PLATFORM_FEE_BPS / 100}% platform fee is applied to every tip and
        supports ongoing development. All transfers are onchain and final.
      </p>
      <p className="mt-3 text-[11px] text-white/30">
        Built solo by{" "}
        <a
          href="https://farcaster.xyz/afifarioss"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/45 underline underline-offset-2 hover:text-white/70"
        >
          @afifarioss
        </a>
      </p>
    </footer>
  );
}
