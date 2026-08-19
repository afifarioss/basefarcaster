import { encodeFunctionData, isAddress } from "viem";
import { NextRequest } from "next/server";
import {
  USDC_ADDRESS,
  USDC_DECIMALS,
  PLATFORM_FEE_BPS,
  PLATFORM_FEE_WALLET,
  ERC20_ABI,
  CHAIN,
} from "@/lib/constants";
import { splitTipAmount } from "@/lib/utils";

// Same three tools as mcp-server/src/index.js, exposed as a single HTTP
// endpoint instead of stdio, so this can be called by any HTTP client
// (including an x402-gated agent request) instead of only a local MCP
// subprocess. Logic is identical — only the transport differs.
//
// Shares its constants and fee-split math with the main app via
// lib/constants.ts / lib/utils.ts, rather than a local copy — this is the
// single tool surface that can safely do so, since it runs in the same
// Next.js build. mcp-server/ and x402/basezap-agent/ are separate isolated
// packages and keep their own manually-synced copies by necessity.
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { tool, args } = body ?? {};

  try {
    if (tool === "get_platform_info") {
      return Response.json({
        chain: "base",
        chain_id: CHAIN.id,
        usdc_address: USDC_ADDRESS,
        usdc_decimals: USDC_DECIMALS,
        platform_fee_bps: PLATFORM_FEE_BPS,
        platform_fee_wallet: PLATFORM_FEE_WALLET,
      });
    }

    if (tool === "get_tip_quote") {
      const amount_usdc = Number(args?.amount_usdc);
      if (!amount_usdc || amount_usdc <= 0) {
        return Response.json({ error: "amount_usdc must be a positive number" }, { status: 400 });
      }
      const { fee, recipientAmount } = splitTipAmount(amount_usdc);
      return Response.json({
        total_usdc: amount_usdc,
        creator_receives_usdc: Number(recipientAmount) / 10 ** USDC_DECIMALS,
        platform_fee_usdc: Number(fee) / 10 ** USDC_DECIMALS,
        platform_fee_bps: PLATFORM_FEE_BPS,
      });
    }

    if (tool === "build_tip_calldata") {
      const recipient = args?.recipient as `0x${string}`;
      const amount_usdc = Number(args?.amount_usdc);
      if (!isAddress(recipient)) {
        return Response.json({ error: "recipient must be a valid 0x address" }, { status: 400 });
      }
      if (!amount_usdc || amount_usdc <= 0) {
        return Response.json({ error: "amount_usdc must be a positive number" }, { status: 400 });
      }
      const { fee, recipientAmount } = splitTipAmount(amount_usdc);

      const calls = [
        {
          to: USDC_ADDRESS,
          data: encodeFunctionData({
            abi: ERC20_ABI,
            functionName: "transfer",
            args: [recipient, recipientAmount],
          }),
          description: `Transfer ${Number(recipientAmount) / 10 ** USDC_DECIMALS} USDC to creator`,
        },
        {
          to: USDC_ADDRESS,
          data: encodeFunctionData({
            abi: ERC20_ABI,
            functionName: "transfer",
            args: [PLATFORM_FEE_WALLET, fee],
          }),
          description: `Transfer ${Number(fee) / 10 ** USDC_DECIMALS} USDC platform fee`,
        },
      ];

      return Response.json({
        chain_id: CHAIN.id,
        calls,
        note: "UNSIGNED calldata. This endpoint does not hold keys or broadcast transactions.",
      });
    }

    return Response.json({ error: `Unknown tool: ${tool}` }, { status: 400 });
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
