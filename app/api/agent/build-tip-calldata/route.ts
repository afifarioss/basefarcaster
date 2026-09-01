import { encodeFunctionData, isAddress } from "viem";
import { NextRequest, NextResponse } from "next/server";
import { withX402 } from "x402-next";
import { facilitator } from "@coinbase/x402";
import {
  USDC_ADDRESS,
  USDC_DECIMALS,
  PLATFORM_FEE_WALLET,
  ERC20_ABI,
  CHAIN,
} from "@/lib/constants";
import { splitTipAmount } from "@/lib/utils";

/**
 * x402-gated version of build_tip_calldata, split out from
 * /api/agent/route.ts (which keeps get_platform_info and get_tip_quote
 * free for discovery). This is the one tool that produces real,
 * usable transfer calldata, so it's priced the same as
 * resolve-username: $0.001, charged only on success.
 */
async function handler(req: NextRequest): Promise<NextResponse<any>> {
  const body = await req.json().catch(() => ({}));
  const recipient = body?.recipient as `0x${string}`;
  const amount_usdc = Number(body?.amount_usdc);

  if (!isAddress(recipient)) {
    return NextResponse.json({ error: "recipient must be a valid 0x address" }, { status: 400 });
  }
  if (!amount_usdc || amount_usdc <= 0) {
    return NextResponse.json({ error: "amount_usdc must be a positive number" }, { status: 400 });
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

  return NextResponse.json({
    chain_id: CHAIN.id,
    calls,
    note: "UNSIGNED calldata. This endpoint does not hold keys or broadcast transactions.",
  });
}

export const POST = withX402(
  handler,
  PLATFORM_FEE_WALLET,
  {
    price: "$0.001",
    network: "base",
    config: {
      description: "Build unsigned USDC tip transfer calldata on Base.",
    },
  },
  // @ts-expect-error — see resolve-username/route.ts for details on this
  // known cross-package type mismatch between @coinbase/x402 and x402-next.
  facilitator
);
