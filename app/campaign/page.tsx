import { Hero } from "@/components/Hero";
import { CAMPAIGN_BUILDERS, CAMPAIGN_TITLE, CAMPAIGN_SUBTITLE } from "@/lib/campaignBuilders";
import Link from "next/link";

export const metadata = {
  title: CAMPAIGN_TITLE,
  description: CAMPAIGN_SUBTITLE,
};

export default function CampaignPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-900/50 backdrop-blur">
        <div className="mx-auto max-w-2xl px-4 py-8 text-center sm:px-6">
          <h1 className="mb-2 text-3xl font-bold text-white sm:text-4xl">
            {CAMPAIGN_TITLE}
          </h1>
          <p className="text-base text-slate-300">{CAMPAIGN_SUBTITLE}</p>
        </div>
      </div>

      {/* Builders Grid */}
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <div className="mb-8 text-center">
          <p className="text-slate-400">
            Pick a builder below, then zap them USDC on Base.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {CAMPAIGN_BUILDERS.map((builder) => (
            <BuilderCard key={builder.username} builder={builder} />
          ))}
        </div>

        {/* CTA back to hero */}
        <div className="mt-12 text-center">
          <Link href="/#tip">
            <button className="inline-block rounded-lg bg-blue-500 px-6 py-3 font-semibold text-white transition hover:bg-blue-600">
              Tip a Builder
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function BuilderCard({
  builder,
}: {
  builder: {
    username: string;
    displayName: string;
    description: string;
    reason: string;
  };
}) {
  return (
    <Link href={`/#tip?recipient=${builder.username}`}>
      <div className="group cursor-pointer rounded-lg border border-slate-600 bg-slate-800/50 p-5 transition hover:border-blue-400 hover:bg-slate-800">
        <div className="mb-2 flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-white">{builder.displayName}</h3>
            <p className="text-sm text-slate-400">{builder.description}</p>
          </div>
        </div>
        <p className="text-xs text-slate-300">{builder.reason}</p>
        <div className="mt-4 inline-block text-sm font-medium text-blue-400 transition group-hover:text-blue-300">
          Tip now →
        </div>
      </div>
    </Link>
  );
}
