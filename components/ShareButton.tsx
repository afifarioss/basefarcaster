"use client";

import { useCallback } from "react";
import { sdk } from "@farcaster/miniapp-sdk";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { buildShareUrl } from "@/lib/utils";
import { APP_URL } from "@/lib/constants";

export function ShareButton({
  text = "I just sent a real USDC tip onchain with BaseFarCaster 💙",
  className = "",
  label = "Share on Farcaster",
}: {
  text?: string;
  className?: string;
  label?: string;
}) {
  const { context } = useMiniKit();

  const handleShare = useCallback(async () => {
    const shareUrl = buildShareUrl(text, APP_URL);

    // Inside a Farcaster client, openUrl lets the host app handle the
    // compose flow natively instead of bouncing out to a browser tab.
    if (context) {
      try {
        await sdk.actions.openUrl(shareUrl);
        return;
      } catch {
        // Fall through to the plain web share below if the host
        // rejects the action for any reason.
      }
    }
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  }, [text, context]);

  return (
    <button onClick={handleShare} className={className || "btn-secondary w-full"}>
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4 12C4 7.58 7.58 4 12 4s8 3.58 8 8-3.58 8-8 8-8-3.58-8-8Z"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path
          d="M8.5 12.5 11 15l4.5-5.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {label}
    </button>
  );
}
