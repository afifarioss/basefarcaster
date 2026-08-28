import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { Providers } from "./providers";
import { APP_NAME, APP_DESCRIPTION, APP_URL } from "@/lib/constants";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});

const frameEmbed = {
  version: "next",
  imageUrl: `${APP_URL}/api/og`,
  button: {
    title: "⚡ Open BaseZap",
    action: {
      type: "launch_frame",
      name: APP_NAME,
      url: APP_URL,
      splashImageUrl: `${APP_URL}/images/splash.png`,
      splashBackgroundColor: "#050505",
    },
  },
};

export const metadata: Metadata = {
  title: `${APP_NAME} — Payments on Base`,
  description: APP_DESCRIPTION,
  metadataBase: new URL(APP_URL),
  openGraph: {
    title: `${APP_NAME} — Payments on Base`,
    description: APP_DESCRIPTION,
    url: APP_URL,
    siteName: APP_NAME,
    images: [{ url: `${APP_URL}/api/og`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP_NAME} — Payments on Base`,
    description: APP_DESCRIPTION,
  },
  other: {
    "fc:frame": JSON.stringify(frameEmbed),
    "fc:miniapp": JSON.stringify(frameEmbed),
    "talentapp:project_verification":
      "2d898fbee43c648593d049b3b40ab67970ca202381e3150ee0eec03c5ab43cb8106e8521ead86f916bb0e8a808a0771a2ff0201aea0c49b21714839527e65c78",
    "virtual-protocol-site-verification": "bd23fdd9d9f402a76789cae0ce54fd39",
    "base:app_id": "6a0abb7be317310c39c9c168",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#050505",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="min-h-screen bg-surface-void font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
