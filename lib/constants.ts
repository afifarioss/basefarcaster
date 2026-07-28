import { base } from "wagmi/chains";

/**
 * ─────────────────────────────────────────────────────────────────────────
 * PLATFORM FEE WALLET
 * This is the address that receives the 10% platform fee on every tip.
 * Change this to your own wallet before deploying to production.
 * ─────────────────────────────────────────────────────────────────────────
 */
export const PLATFORM_FEE_WALLET =
  (process.env.NEXT_PUBLIC_FEE_WALLET as `0x${string}`) ||
  "0x000000000000000000000000000000000000dEaD";

/** Platform fee, in basis points. 1000 = 10%. */
export const PLATFORM_FEE_BPS = 1000;
export const FEE_DENOMINATOR = 10000;

/** Native USDC on Base Mainnet. */
export const USDC_ADDRESS: `0x${string}` =
  "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

export const USDC_DECIMALS = 6;

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

export const APP_NAME = "BaseFarCaster";
export const APP_DESCRIPTION =
  "Send real USDC tips on Base, right inside Farcaster.";
export const APP_TAGLINE = "Tipping, onchain, in one tap.";

export const APP_URL =
  process.env.NEXT_PUBLIC_URL || "https://basefarcaster.vercel.app";

/** Minimal ERC-20 ABI — just what we need for balance + transfer. */
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
