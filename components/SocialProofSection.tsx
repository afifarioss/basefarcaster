"use client";

import { SocialProof } from "./SocialProof";

export function SocialProofSection() {
  return (
    <section className="px-5 py-12">
      <div className="mx-auto max-w-lg">
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/30">
            Proof, not testimonials
          </p>
          <h2 className="mt-3 font-display text-2xl font-bold text-white">
            Don&apos;t take our word for it.
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-white/45">
            See the actual activity. Completed tips are recorded onchain and
            can be verified independently.
          </p>
        </div>

        <div className="mt-6">
          <SocialProof />
        </div>
      </div>
    </section>
  );
}
