import { NextRequest } from "next/server";
import {
  USDC_ADDRESS,
  USDC_DECIMALS,
  PLATFORM_FEE_BPS,
  PLATFORM_FEE_WALLET,
  CHAIN,
} from "@/lib/constants";
import { splitTipAmount } from "@/lib/utils";

// Free discovery tools only. build_tip_calldata (the tool that produces
// real, usable transfer calldata) has been split out to
// /api/agent/build-tip-calldata, which is x402-gated at $0.001/request —
// same pattern as resolve-username. get_platform_info and get_tip_quote
// stay free here to encourage agent discovery/adoption before they pay
// for the real action.
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

    return Response.json(
      {
        error: `Unknown tool: ${tool}. Use get_platform_info or get_tip_quote. For build_tip_calldata, POST /api/agent/build-tip-calldata ($0.001 via x402).`,
      },
      { status: 400 }
    );
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
