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
    </footer>
  );
}
