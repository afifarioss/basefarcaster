"use client";

type Identity = {
  address: string;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
};

export type BaseNowSignalData = {
  txHash: string;
  amountUsdc: number;
  tokenSymbol: string;
  timestamp: number;
  signalType: "tip" | "support" | "large_transfer";
  importance: "low" | "medium" | "high";
  signalLabel: string;
  context: string;
  from: Identity;
  to: Identity;
};

type BaseNowSignalProps = {
  signal: BaseNowSignalData;
};

function formatAddress(address: string) {
  if (address.length < 12) return address;
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

function getName(identity: Identity) {
  return identity.username
    ? `@${identity.username}`
    : identity.displayName || formatAddress(identity.address);
}

function formatTime(timestamp: number) {
  const seconds = Math.max(
    0,
    Math.floor(Date.now() / 1000) - timestamp
  );

  if (seconds < 60) return "just now";

  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);

  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);

  return `${days}d ago`;
}

function Identity({
  identity,
}: {
  identity: Identity;
}) {
  const name = getName(identity);

  return (
    <div className="flex min-w-0 items-center gap-2">
      {identity.pfpUrl ? (
        <img
          src={identity.pfpUrl}
          alt=""
          className="h-9 w-9 shrink-0 rounded-full object-cover ring-1 ring-white/10"
        />
      ) : (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-xs font-semibold text-white/60 ring-1 ring-white/10">
          {name.replace("@", "").slice(0, 1).toUpperCase()}
        </div>
      )}

      <div className="min-w-0">
        <div className="truncate text-sm font-medium text-white">
          {name}
        </div>

        <div className="truncate text-[10px] text-white/25">
          {formatAddress(identity.address)}
        </div>
      </div>
    </div>
  );
}

function getImportanceClass(
  importance: BaseNowSignalData["importance"]
) {
  if (importance === "high") {
    return "border-white/15 bg-white/[0.06] text-white/75";
  }

  if (importance === "medium") {
    return "border-white/10 bg-white/[0.04] text-white/60";
  }

  return "border-white/[0.07] bg-white/[0.025] text-white/45";
}

function getSignalIcon(signalType: BaseNowSignalData["signalType"]) {
  if (signalType === "large_transfer") return "↑";
  if (signalType === "support") return "✦";
  return "•";
}

export function BaseNowSignal({
  signal,
}: BaseNowSignalProps) {
  return (
    <article className="glass-card overflow-hidden transition hover:border-white/15">
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-semibold ${getImportanceClass(
                signal.importance
              )}`}
            >
              {getSignalIcon(signal.signalType)}
            </span>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-white/90">
                  {signal.signalLabel}
                </span>

                <span className="rounded-full border border-white/[0.06] bg-white/[0.025] px-2 py-0.5 text-[8px] font-semibold uppercase tracking-[0.14em] text-white/30">
                  Verified
                </span>
              </div>

              <p className="mt-0.5 text-[10px] text-white/30">
                BaseZap · Base
              </p>
            </div>
          </div>

          <span className="shrink-0 text-xs text-white/35">
            {formatTime(signal.timestamp)}
          </span>
        </div>

        <div className="mt-5 flex min-w-0 items-center gap-3">
          <Identity identity={signal.from} />

          <span className="shrink-0 text-lg text-white/20">
            →
          </span>

          <Identity identity={signal.to} />
        </div>

        <div className="mt-5 rounded-2xl border border-white/[0.06] bg-black/10 p-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/25">
                Signal
              </p>

              <p className="mt-1.5 font-display text-2xl font-bold text-white">
                ${signal.amountUsdc.toFixed(2)}
                <span className="ml-1.5 text-sm font-medium text-white/40">
                  {signal.tokenSymbol}
                </span>
              </p>
            </div>

            <div className="text-right">
              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/25">
                Importance
              </p>

              <p className="mt-1.5 text-xs font-medium capitalize text-white/55">
                {signal.importance}
              </p>
            </div>
          </div>

          <div className="mt-4 border-t border-white/[0.06] pt-3">
            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/25">
              Context
            </p>

            <p className="mt-1.5 text-xs leading-5 text-white/45">
              {signal.context}
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-white/20">
            <span>Signal</span>
            <span>→</span>
            <span>Context</span>
            <span>→</span>
            <span>Action</span>
          </div>

          <a
            href={`https://basescan.org/tx/${signal.txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary shrink-0 px-3 py-2 text-xs"
          >
            View transaction
          </a>
        </div>
      </div>
    </article>
  );
}
