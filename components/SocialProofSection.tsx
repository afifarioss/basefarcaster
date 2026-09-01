"use client";

import { Testimonial } from "./Testimonial";
import { SocialProof } from "./SocialProof";

export function SocialProofSection() {
  return (
    <section className="px-5 py-10">
      <div className="mx-auto max-w-lg space-y-6">
        <Testimonial />
        <SocialProof />
      </div>
    </section>
  );
}
