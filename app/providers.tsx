"use client";

import { type ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from "wagmi";
import { base } from "wagmi/chains";
import { baseAccount } from "wagmi/connectors";
import { farcasterMiniApp } from "@farcaster/miniapp-wagmi-connector";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { APP_NAME } from "@/lib/constants";

const wagmiConfig = createConfig({
  chains: [base],
  transports: {
    [base.id]: http(),
  },
  connectors: [
    baseAccount({
      appName: APP_NAME,
    }),
    farcasterMiniApp(),
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
            paymaster: "/api/paymaster",
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
          miniKit={{
            enabled: true,
            autoConnect: true,
          }}
        >
          {children}
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
