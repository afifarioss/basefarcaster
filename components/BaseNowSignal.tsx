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
  const seconds = Math.max(0, Math.floor(Date.now() / 1000) - timestamp);

  if (seconds < 60) return "just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function Identity({ identity }: { identity: Identity }) {
  const name = getName(identity);

  return (
    <div className="flex min-w-0 items-center gap-2">
      {identity.pfpUrl ? (
        <img
          src={identity.pfpUrl}
          alt=""
          className="h-8 w-8 shrink-0 rounded-full object-cover"
        />
      ) : (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-white/70">
          {name.replace("@", "").slice(0, 1).toUpperCase()}
        </div>
      )}

      <div className="min-w-0">
        <div className="truncate text-sm font-medium text-white">{name}</div>
      </div>
    </div>
  );
}

export function BaseNowSignal({ signal }: BaseNowSignalProps) {
  return (
    <article className="glass-card p-4 transition hover:border-white/15">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-white/60">
            NOW
          </span>

          <div className="text-sm text-white/60">
            <span className="text-white/90">Onchain activity</span>
          </div>
        </div>

        <span className="shrink-0 text-xs text-white/40">
          {formatTime(signal.timestamp)}
        </span>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <Identity identity={signal.from} />

        <span className="shrink-0 text-white/30">→</span>

        <Identity identity={signal.to} />
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-lg font-semibold text-white">
            ${signal.amountUsdc.toFixed(2)} {signal.tokenSymbol}
          </p>
          <p className="mt-0.5 text-xs text-white/45">
            A Base user sent an onchain tip
          </p>
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
    </article>
  );
}
