import { BaseNowFeed } from "@/components/BaseNowFeed";

export const metadata = {
  title: "Base NOW | BaseZap",
  description:
    "See what is happening on Base right now and discover useful onchain activity.",
};

export default function BaseNowPage() {
  return (
    <main className="min-h-screen bg-noise-grid">
      <div className="mx-auto w-full max-w-5xl px-4 pb-16 pt-8 sm:px-6 sm:pt-12">
        <header className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/60">
            Base NOW
          </div>

          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            What&apos;s happening on Base right now?
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-white/55 sm:text-lg">
            A simple way to discover what is happening on Base.
          </p>

          <div className="mt-7 flex justify-center">
            <span className="chip chip-active" aria-current="page">
              Live
            </span>
          </div>
        </header>

        <div className="mx-auto mt-10 max-w-3xl">
          <div className="glass-card p-4 sm:p-5">
            <p className="text-sm leading-6 text-white/60">
              Base NOW is starting with verified activity from BaseZap.
              We&apos;ll expand the feed with more useful Base activity over
              time.
            </p>
          </div>
        </div>

        <div className="mt-8">
          <BaseNowFeed />
        </div>
      </div>
    </main>
  );
}
