"use client";

import { type ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from "wagmi";
import { base } from "wagmi/chains";
import { coinbaseWallet, injected, metaMask } from "wagmi/connectors";
import { farcasterMiniApp } from "@farcaster/miniapp-wagmi-connector";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { MiniKitProvider } from "@coinbase/onchainkit/minikit";
import { APP_NAME } from "@/lib/constants";

const wagmiConfig = createConfig({
  chains: [base],
  transports: {
    [base.id]: http(),
  },
  connectors: [
    // Auto-connects when running inside a Farcaster client (Warpcast, Base app, etc).
    farcasterMiniApp(),
    // Base Smart Wallet + Coinbase Wallet, with in-app + popup fallback.
    coinbaseWallet({
      appName: APP_NAME,
      preference: "all",
    }),
    // MetaMask via its dedicated connector for the best deep-link UX.
    metaMask(),
    // Catch-all for injected wallets: Rainbow, Frame, Brave, generic EIP-1193.
    injected({ shimDisconnect: true }),
  ],
  ssr: true,
});

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
          chain={base}
          config={{
            appearance: {
              mode: "dark",
              theme: "base",
              name: APP_NAME,
            },
            wallet: {
              display: "modal",
              preference: "all",
            },
          }}
        >
          <MiniKitProvider
            apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
            chain={base}
          >
            {children}
          </MiniKitProvider>
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
