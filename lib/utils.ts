import { parseUnits } from "viem";
import { PLATFORM_FEE_BPS, FEE_DENOMINATOR, USDC_DECIMALS } from "./constants";

/**
 * Splits a tip amount (human-readable, e.g. 1.5) into the recipient and
 * platform-fee legs, both returned as bigint base units. Works for any
 * token's decimals — defaults to USDC's (6) since that's the primary
 * tipping currency; pass a token's own decimals for others (e.g. VVV).
 * Fee is rounded down; recipient receives the remainder, so the two legs
 * always sum exactly back to the original transfer amount.
 */
export function splitTipAmount(amount: number, decimals: number = USDC_DECIMALS) {
  const total = parseUnits(amount.toFixed(decimals), decimals);
  const fee = (total * BigInt(PLATFORM_FEE_BPS)) / BigInt(FEE_DENOMINATOR);
  const recipientAmount = total - fee;
  return { total, fee, recipientAmount };
}

export function formatAddress(address?: string, chars = 4) {
  if (!address) return "";
  return `${address.slice(0, 2 + chars)}…${address.slice(-chars)}`;
}

export function formatUsdc(amount: number) {
  return amount.toLocaleString("en-US", {
    minimumFractionDigits: amount < 1 ? 2 : 0,
    maximumFractionDigits: 2,
  });
}

/** Builds a Warpcast compose URL for the "Share on Farcaster" flow. */
export function buildShareUrl(text: string, embedUrl: string) {
  const params = new URLSearchParams({
    text,
    "embeds[]": embedUrl,
  });
  return `https://warpcast.com/~/compose?${params.toString()}`;
}
