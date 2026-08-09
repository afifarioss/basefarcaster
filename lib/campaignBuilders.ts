/**
 * Campaign builders — featured Farcaster/Base builders to tip
 * Updated: 2026
 * Format: username (without @), displayName, brief description/why they matter
 */

export interface CampaignBuilder {
  username: string;
  displayName: string;
  description: string;
  reason: string;
}

export const CAMPAIGN_BUILDERS: CampaignBuilder[] = [
  {
    username: "limone",
    displayName: "limone.eth 🍋",
    description: "Builders Garden founder",
    reason: "Shipped 20+ viral miniapps, leading studio on Base + Farcaster",
  },
  {
    username: "rish",
    displayName: "rish 🔨",
    description: "Neynar CEO",
    reason: "Stewarding Farcaster's builder-first future via Neynar",
  },
  {
    username: "linda",
    displayName: "linda 🏗️",
    description: "Farcaster dev relations",
    reason: "Chose Farcaster full-time over VC — real builder commitment",
  },
  {
    username: "dwr",
    displayName: "dwr 🔐",
    description: "Farcaster co-founder",
    reason: "Built the protocol that enabled all of this",
  },
  {
    username: "saxenasaheb",
    displayName: "saxenasaheb 🌍",
    description: "Farcaster Builders India",
    reason: "Organized global hackathons, grassroots ecosystem growth",
  },
  {
    username: "dave",
    displayName: "dave.base.eth 🟦",
    description: "Base mini apps expert",
    reason: "Educating builders on Base + miniapp best practices",
  },
  {
    username: "woj",
    displayName: "woj 🎙️",
    description: "Supercast founder",
    reason: "Building innovative onchain features only possible on Farcaster",
  },
  {
    username: "afifarioss",
    displayName: "Afif 🚀",
    description: "BaseZap builder",
    reason: "Instant USDC funding for Farcaster builders — like you!",
  },
];

export const CAMPAIGN_TITLE = "Today's Base Builders to Tip";
export const CAMPAIGN_SUBTITLE =
  "Reward the builders shaping Farcaster + Base. Real USDC, instant.";
