export type SignalImportance = "low" | "medium" | "high";

export type SignalIdentity = {
  address: string;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
};

export type SignalAction = {
  label: string;
  href: string;
  type: "external" | "internal";
};

export type BaseSignal = {
  id: string;
  source: string;
  sourceType: string;
  network: "base";
  verified: boolean;

  timestamp: number;

  type: string;
  importance: SignalImportance;

  label: string;
  context: string;

  from: SignalIdentity;
  to: SignalIdentity;

  amount?: {
    value: number;
    symbol: string;
  };

  transaction?: {
    hash: string;
  };

  action?: SignalAction;
};
