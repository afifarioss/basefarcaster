import { APP_NAME, APP_SHORT_NAME, APP_DESCRIPTION, APP_URL } from "@/lib/constants";

/**
 * Farcaster Mini App manifest.
 *
 * `accountAssociation` proves you (the Farcaster account deploying this
 * app) own this domain. Generate it from Warpcast:
 *   Settings → Developer → Domains → your deployed domain → Generate.
 * Paste the three resulting values into your environment variables —
 * never hardcode them, since they're tied to a specific domain.
 */
export async function GET() {
  const appConfig = {
    version: "1",
    name: APP_SHORT_NAME,
    iconUrl: `${APP_URL}/images/icon.png`,
    homeUrl: APP_URL,
    imageUrl: `${APP_URL}/images/og-image.png`,
    buttonTitle: "💙 Send a Tip",
    splashImageUrl: `${APP_URL}/images/splash.png`,
    splashBackgroundColor: "#050505",
    webhookUrl: `${APP_URL}/api/webhook`,
    subtitle: "Real USDC tips on Base",
    description: APP_DESCRIPTION,
    primaryCategory: "finance",
    tags: ["base", "usdc", "tipping", "payments", "onchain"],
    tagline: "Tipping, onchain, in one tap.",
    screenshotUrls: [`${APP_URL}/images/screenshot-1.png`],
    heroImageUrl: `${APP_URL}/images/og-image.png`,
    ogTitle: `${APP_SHORT_NAME} — Real USDC Tips on Base`,
    ogDescription: APP_DESCRIPTION,
    ogImageUrl: `${APP_URL}/images/og-image.png`,
    noindex: false,
  };

  const manifest = {
    accountAssociation: {
      header: process.env.FARCASTER_HEADER || "",
      payload: process.env.FARCASTER_PAYLOAD || "",
      signature: process.env.FARCASTER_SIGNATURE || "",
    },
    // "miniapp" is the current manifest key. "frame" is kept alongside it
    // purely for backward compatibility with older Farcaster clients —
    // both point at the same config.
    miniapp: appConfig,
    frame: appConfig,
  };

  return Response.json(manifest);
}
