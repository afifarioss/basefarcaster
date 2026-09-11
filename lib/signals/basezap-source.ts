import type { BaseSignal, SignalIdentity } from "./types";

export type BaseZapTipRecord = {
  from: string;
  to: string;
  amountUsdc: number;
  txHash: string;
  tokenSymbol: string;
  timestamp: number;
};

type ResolvedIdentity = {
  username: string;
  displayName: string;
  pfpUrl: string;
};

function classify(amountUsdc: number): {
  type: string;
  importance: BaseSignal["importance"];
  label: string;
  context: string;
} {
  if (amountUsdc >= 5) {
    return {
      type: "large_transfer",
      importance: "high",
      label: "High-value signal",
      context: "A larger BaseZap tip was sent onchain.",
    };
  }

  if (amountUsdc >= 1) {
    return {
      type: "support",
      importance: "medium",
      label: "Support signal",
      context: "A meaningful onchain tip was sent to support another user.",
    };
  }

  return {
    type: "tip",
    importance: "low",
    label: "Tip signal",
    context: "A Base user sent an onchain tip.",
  };
}

function toIdentity(
  address: string,
  resolved?: ResolvedIdentity
): SignalIdentity {
  return { address, ...resolved };
}

export function toBaseSignal(
  record: BaseZapTipRecord,
  identities: Map<string, ResolvedIdentity>
): BaseSignal {
  const classification = classify(record.amountUsdc);

  return {
    id: record.txHash,
    source: "BaseZap",
    sourceType: "tip",
    network: "base",
    verified: true,

    timestamp: Math.floor(record.timestamp / 1000),

    type: classification.type,
    importance: classification.importance,
    label: classification.label,
    context: classification.context,

    from: toIdentity(record.from, identities.get(record.from.toLowerCase())),
    to: toIdentity(record.to, identities.get(record.to.toLowerCase())),

    amount: {
      value: record.amountUsdc,
      symbol: record.tokenSymbol,
    },

    transaction: {
      hash: record.txHash,
    },

    action: {
      label: "View transaction",
      href: `https://basescan.org/tx/${record.txHash}`,
      type: "external",
    },
  };
}
