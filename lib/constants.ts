import { base } from "wagmi/chains";

/**
 * BaseZap constants
 *
 * Default creator:
 *   afifarioss.base.eth
 *
 * Resolved wallet supplied by project owner:
 *   0x7845D45d9E53268EBFf3C4a9daBb994cE5b93918
 */

/**
 * Platform fee wallet.
 *
 * NEXT_PUBLIC_FEE_WALLET overrides this in production.
 */
export const PLATFORM_FEE_WALLET =
  (process.env.NEXT_PUBLIC_FEE_WALLET as `0x${string}`) ||
  "0x7845D45d9E53268EBFf3C4a9daBb994cE5b93918";

/**
 * Platform fee.
 *
 * 200 BPS = 2%.
 */
export const PLATFORM_FEE_BPS = 200;
export const FEE_DENOMINATOR = 10000;

/**
 * Base Mainnet native USDC.
 */
export const USDC_ADDRESS: `0x${string}` =
  "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

export const USDC_DECIMALS = 6;

/**
 * Venice AI VVV token on Base Mainnet.
 */
export const VVV_ADDRESS: `0x${string}` =
  "0xacfE6019Ed1A7Dc6f7B508C02d1b04ec88cC21bf";

/**
 * Venice DIEM token on Base Mainnet.
 *
 * DIEM is an optional Venice ecosystem token/payment method.
 * It uses 18 decimals.
 */
export const DIEM_ADDRESS: `0x${string}` =
  "0xf4d97f2da56e8c3098f3a8d538db630a2606a024";

export const DIEM_DECIMALS = 18;

/**
 * Tokens supported for tipping.
 *
 * USDC is the primary/default token.
 * VVV is the secondary token.
 */
export const TIPPABLE_TOKENS = [
  {
    symbol: "USDC",
    address: USDC_ADDRESS,
    decimals: USDC_DECIMALS,
  },
  {
    symbol: "VVV",
    address: VVV_ADDRESS,
    decimals: null,
  },
  {
    symbol: "DIEM",
    address: DIEM_ADDRESS,
    decimals: DIEM_DECIMALS,
  },
] as const;

export type TippableTokenSymbol =
  (typeof TIPPABLE_TOKENS)[number]["symbol"];

/**
 * Base Mainnet.
 */
export const CHAIN = base;

/**
 * Default creator Basename.
 */
export const DEFAULT_RECIPIENT_BASENAME =
  "afifarioss.base.eth";

/**
 * Default receiving wallet for tips.
 *
 * NEXT_PUBLIC_DEFAULT_RECIPIENT overrides this value.
 */
export const DEFAULT_RECIPIENT_WALLET =
  (process.env.NEXT_PUBLIC_DEFAULT_RECIPIENT as `0x${string}`) ||
  "0x7845D45d9E53268EBFf3C4a9daBb994cE5b93918";

/**
 * Preset tip amounts shown as quick-select chips.
 *
 * Values are in the selected token's human-readable units.
 */
export const TIP_PRESETS = [0.1, 0.5, 1, 5] as const;

/**
 * Application identity.
 */
export const APP_NAME = "BaseZap";
export const APP_SHORT_NAME = "BaseZap";

/**
 * Full application description.
 *
 * Keep special-character restrictions in mind when using this
 * value in the Base manifest.
 */
export const APP_DESCRIPTION =
  "Send USDC, VVV, or DIEM directly to Base users and Farcaster users. Built on Base × Farcaster.";

/**
 * Short OG/social description.
 *
 * Keep this under 100 characters.
 */
export const APP_OG_DESCRIPTION =
  "Send USDC, VVV, or DIEM to Base and Farcaster users. Fast, transparent, and onchain.";

/**
 * Application tagline.
 *
 * Keep this under 30 characters.
 */
export const APP_TAGLINE =
  "Send tokens. Build onchain.";

/**
 * Public application URL.
 */
export const APP_URL =
  process.env.NEXT_PUBLIC_URL ||
  "https://basefarcaster.vercel.app";

/**
 * ERC-8021 Base Builder Code attribution suffix.
 *
 * Appended to supported Base transactions for builder attribution.
 */
export const BASE_BUILDER_CODE_SUFFIX =
  "0x62635f75706861636f34700b0080218021802180218021802180218021";

/**
 * Minimal ERC-20 ABI.
 *
 * Used for:
 * - transfer
 * - balanceOf
 * - decimals
 * - approve
 */
export const ERC20_ABI = [
  {
    type: "function",
    name: "transfer",
    stateMutability: "nonpayable",
    inputs: [
      {
        name: "to",
        type: "address",
      },
      {
        name: "amount",
        type: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
  },
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [
      {
        name: "account",
        type: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
  },
  {
    type: "function",
    name: "decimals",
    stateMutability: "view",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint8",
      },
    ],
  },
  {
    type: "function",
    name: "approve",
    stateMutability: "nonpayable",
    inputs: [
      {
        name: "spender",
        type: "address",
      },
      {
        name: "amount",
        type: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
  },
] as const;

/**
 * Venice VVV staking contract.
 *
 * VVV is deposited here and sVVV is received.
 */
export const VVV_STAKING_ADDRESS: `0x${string}` =
  "0x321b7ff75154472B18EDb199033fF4D116F340Ff";

/**
 * VVV required for Venice Pro.
 */
export const VVV_PRO_STAKE_THRESHOLD = 100;

/**
 * $ZAP ecosystem token on Base Mainnet.
 *
 * Holding >= ZAP_HOLDER_THRESHOLD grants 0% platform fee on tips.
 */
export const ZAP_ADDRESS: `0x${string}` =
  "0x8C1ca2c32CD197a27CA049aA0427f64192aD3ba3";

/**
 * Minimum $ZAP balance to qualify for the 0% fee benefit.
 */
export const ZAP_HOLDER_THRESHOLD = 100;
