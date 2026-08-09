import { base } from "wagmi/chains";

/**
 * ─────────────────────────────────────────────────────────────────────────
 * PLATFORM FEE WALLET
 * This is the address that receives the platform fee on every tip.
 * Change this to your own wallet before deploying to production.
 * ─────────────────────────────────────────────────────────────────────────
 */
export const PLATFORM_FEE_WALLET =
  (process.env.NEXT_PUBLIC_FEE_WALLET as `0x${string}`) ||
  "0x000000000000000000000000000000000000dEaD";

/** Platform fee, in basis points. 500 = 5%. */
export const PLATFORM_FEE_BPS = 500;
export const FEE_DENOMINATOR = 10000;

/** Native USDC on Base Mainnet. */
export const USDC_ADDRESS: `0x${string}` =
  "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

export const USDC_DECIMALS = 6;

/**
 * Venice AI's VVV token on Base — verified contract, real liquidity.
 * https://basescan.org/token/0xacfE6019Ed1A7Dc6f7B508C02d1b04ec88cC21bf
 * Decimals are fetched live from the contract at runtime rather than
 * hardcoded here, since we don't hardcode facts about a token we don't
 * control.
 */
export const VVV_ADDRESS: `0x${string}` =
  "0xacfE6019Ed1A7Dc6f7B508C02d1b04ec88cC21bf";

/**
 * Tokens tippable in the app. USDC is first and is the default — per
 * product positioning, this stays a USDC-tipping app first, with VVV
 * offered as a secondary option, not the headline feature.
 */
export const TIPPABLE_TOKENS = [
  { symbol: "USDC", address: USDC_ADDRESS, decimals: USDC_DECIMALS },
  { symbol: "VVV", address: VVV_ADDRESS, decimals: null }, // fetched live
] as const;

export type TippableTokenSymbol = (typeof TIPPABLE_TOKENS)[number]["symbol"];

export const CHAIN = base;

/**
 * The default receiving wallet for tips when no creator address
 * is passed via the `to` query param. Replace with your own creator
 * wallet, or wire this up dynamically per-profile.
 */
export const DEFAULT_RECIPIENT_WALLET =
  (process.env.NEXT_PUBLIC_DEFAULT_RECIPIENT as `0x${string}`) ||
  "0x000000000000000000000000000000000000dEaD";

/** Preset tip amounts shown as quick-select chips, in USDC. */
export const TIP_PRESETS = [0.1, 1, 5] as const;

export const APP_NAME = "BaseZap";
export const APP_SHORT_NAME = "BaseZap";
export const APP_DESCRIPTION =
  "Send USDC tips to any Farcaster creator on Base in seconds. Non-custodial, transparent, and built for builders.";
export const APP_TAGLINE = "USDC tipping for Farcaster.";

export const APP_URL =
  process.env.NEXT_PUBLIC_URL || "https://basefarcaster.vercel.app";

/** Minimal ERC-20 ABI — just what we need for balance, transfer, decimals. */
export const ERC20_ABI = [
  {
    type: "function",
    name: "transfer",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "decimals",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint8" }],
  },
] as const;

/**
 * Venice's staking contract — deposit VVV here, receive sVVV back 1:1.
 * Verified: Basescan labels it "Venice: sVVV Token", and it matches
 * Venice's own official fact sheet PDF and a real wallet transaction
 * preview against venice.ai/token. Do not change without re-verifying.
 */
export const VVV_STAKING_ADDRESS: `0x${string}` =
  "0x321b7ff75154472B18EDb199033fF4D116F340Ff";

/**
 * Staked VVV required to unlock Venice Pro, per Venice's own official
 * page (venice.ai/lp/vvv): "When you stake 100 VVV you'll enjoy free
 * access to Venice Pro." Sourced directly — do not adjust without
 * re-checking that page.
 */
export const VVV_PRO_STAKE_THRESHOLD = 100;
