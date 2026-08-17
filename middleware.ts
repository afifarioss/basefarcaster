import { paymentMiddleware } from "x402-next";
import { facilitator } from "@coinbase/x402";

/**
 * x402 payment gate for BaseZap's agent-facing endpoints.
 *
 * Only /api/agent/resolve-username is protected. Everything else
 * (including the free /api/resolve-user used by the app's own UI, and
 * the free tools in /api/agent) is untouched — the matcher below is
 * the only thing that determines what gets gated.
 *
 * Payment settles to the same wallet as the platform's existing fee
 * address, so agent-traffic revenue lands in one place.
 */
export default paymentMiddleware(
  "0x7845D45d9E53268EBFf3C4a9daBb994cE5b93918",
  {
    "/api/agent/resolve-username": {
      price: "$0.001",
      network: "base",
      config: {
        description:
          "Resolve a Farcaster username to their verified wallet address on Base.",
      },
    },
  },
  facilitator
);

export const config = {
  matcher: ["/api/agent/resolve-username"],
};
