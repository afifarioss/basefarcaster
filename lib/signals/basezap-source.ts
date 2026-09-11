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

export type FrequencySnapshot = {
  isCompleteHistory: boolean;
  senderCounts: Map<string, number>;
  recipientSupporters: Map<string, Set<string>>;
};

export function buildFrequencySnapshot(
  windowRecords: BaseZapTipRecord[],
  totalRecorded: number
): FrequencySnapshot {
  const senderCounts = new Map<string, number>();
  const recipientSupporters = new Map<string, Set<string>>();

  for (const record of windowRecords) {
    const from = record.from.toLowerCase();
    const to = record.to.toLowerCase();

    senderCounts.set(from, (senderCounts.get(from) ?? 0) + 1);

    const supporters = recipientSupporters.get(to) ?? new Set<string>();
    supporters.add(from);
    recipientSupporters.set(to, supporters);
  }

  return {
    isCompleteHistory: windowRecords.length >= totalRecorded,
    senderCounts,
    recipientSupporters,
  };
}

function classify(
  amountUsdc: number,
  freq: {
    senderTipCount: number;
    recipientSupporterCount: number;
    isCompleteHistory: boolean;
  }
): {
  type: string;
  importance: BaseSignal["importance"];
  label: string;
  context: string;
} {
  let type: string;
  let importance: BaseSignal["importance"];
  let label: string;
  let context: string;

  if (amountUsdc >= 5) {
    type = "large_transfer";
    importance = "high";
    label = "High-value signal";
    context = "A larger BaseZap tip was sent onchain.";
  } else if (amountUsdc >= 1) {
    type = "support";
    importance = "medium";
    label = "Support signal";
    context = "A meaningful onchain tip was sent to support another user.";
  } else {
    type = "tip";
    importance = "low";
    label = "Tip signal";
    context = "A Base user sent an onchain tip.";
  }

  const notes: string[] = [];

  if (freq.senderTipCount > 1) {
    notes.push(`This sender has sent ${freq.senderTipCount} verified tips.`);
  } else if (freq.senderTipCount === 1 && freq.isCompleteHistory) {
    notes.push("This is the sender's first recorded BaseZap tip.");
  }

  if (freq.recipientSupporterCount >= 3) {
    notes.push(
      `${freq.recipientSupporterCount} different supporters have tipped this recipient recently.`
    );

    if (importance === "low") importance = "medium";
    else if (importance === "medium") importance = "high";
  }

  if (notes.length > 0) {
    context = `${context} ${notes.join(" ")}`;
  }

  return { type, importance, label, context };
}

function toIdentity(
  address: string,
  resolved?: ResolvedIdentity
): SignalIdentity {
  return { address, ...resolved };
}

export function toBaseSignal(
  record: BaseZapTipRecord,
  identities: Map<string, ResolvedIdentity>,
  freq: FrequencySnapshot
): BaseSignal {
  const fromLower = record.from.toLowerCase();
  const toLower = record.to.toLowerCase();

  const senderTipCount = freq.senderCounts.get(fromLower) ?? 1;
  const recipientSupporterCount =
    freq.recipientSupporters.get(toLower)?.size ?? 1;

  const classification = classify(record.amountUsdc, {
    senderTipCount,
    recipientSupporterCount,
    isCompleteHistory: freq.isCompleteHistory,
  });

  const facts: BaseSignal["facts"] = [
    {
      label: "Network",
      value: "Base",
      verified: true,
    },
    {
      label: "Source",
      value: "BaseZap",
      verified: true,
    },
    {
      label: "Amount",
      value: `${record.amountUsdc} ${record.tokenSymbol}`,
      verified: true,
    },
    {
      label: "Transaction",
      value: record.txHash,
      verified: true,
    },
  ];

  if (senderTipCount > 1) {
    facts.push({
      label: "Sender activity",
      value: `${senderTipCount} recorded tips in the available history`,
      verified: false,
    });
  }

  if (recipientSupporterCount >= 3) {
    facts.push({
      label: "Recent supporters",
      value: `${recipientSupporterCount} different supporters`,
      verified: false,
    });
  }

  return {
    id: record.txHash,
    source: "BaseZap",
    sourceType: "tip",
    network: "base",
    verified: true,
    confidence: "derived",

    timestamp: Math.floor(record.timestamp / 1000),

    type: classification.type,
    importance: classification.importance,
    label: classification.label,
    context: classification.context,
    facts,

    from: toIdentity(record.from, identities.get(fromLower)),
    to: toIdentity(record.to, identities.get(toLower)),

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
