export type SignalImportance = "low" | "medium" | "high";

export type SignalConfidence = "verified" | "derived";

export type SignalSourceType =
  | "tip"
  | "transfer"
  | "contract"
  | "token"
  | "agent"
  | "farcaster"
  | "unknown";

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

export type SignalFact = {
  label: string;
  value: string;
  verified: boolean;
};

export type BaseSignal = {
  /**
   * Stable source-specific identifier.
   * Usually a transaction hash, event id, or source record id.
   */
  id: string;

  /**
   * Human-readable source name.
   */
  source: string;

  /**
   * Machine-readable source category.
   */
  sourceType: SignalSourceType;

  /**
   * Chain/network where the signal originated.
   */
  network: "base";

  /**
   * True only when the underlying activity has been independently
   * verified by the source/onchain record.
   */
  verified: boolean;

  /**
   * Overall confidence of the signal interpretation.
   *
   * verified = directly supported by the source data
   * derived  = interpretation built from verified source data
   */
  confidence?: SignalConfidence;

  /**
   * Unix timestamp in seconds.
   */
  timestamp: number;

  /**
   * Machine-readable classification.
   */
  type: string;

  /**
   * Importance/ranking bucket.
   */
  importance: SignalImportance;

  /**
   * Human-readable classification.
   */
  label: string;

  /**
   * Short explanation of why this signal matters.
   */
  context: string;

  /**
   * Facts directly associated with the signal.
   */
  facts?: SignalFact[];

  /**
   * Primary participants.
   */
  from: SignalIdentity;
  to: SignalIdentity;

  /**
   * Optional value associated with the activity.
   */
  amount?: {
    value: number;
    symbol: string;
  };

  /**
   * Onchain transaction reference.
   */
  transaction?: {
    hash: string;
  };

  /**
   * Optional action a human or agent can take.
   */
  action?: SignalAction;
};
