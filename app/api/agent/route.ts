import { encodeFunctionData, isAddress, parseUnits } from "viem";
import { NextRequest } from "next/server";

const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const USDC_DECIMALS = 6;
const CHAIN_ID = 8453;
const PLATFORM_FEE_BPS = 500;
const FEE_DENOMINATOR = 10000;
const FEE_WALLET =
  process.env.FEE_WALLET || "0x7845D45d9E53268EBFf3C4a9daBb994cE5b93918";

const ERC20_ABI = [
  {
    type: "function",
    name: "transfer",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
] as const;

function splitTipAmount(amountUsdc: number) {
  const total = parseUnits(amountUsdc.toFixed(USDC_DECIMALS), USDC_DECIMALS);
  const fee = (total * BigInt(PLATFORM_FEE_BPS)) / BigInt(FEE_DENOMINATOR);
  const recipientAmount = total - fee;
  return { total, fee, recipientAmount };
}

// Same three tools as mcp-server/src/index.js, exposed as a single HTTP
// endpoint instead of stdio, so this can be called by any HTTP client
// (including an x402-gated agent request) instead of only a local MCP
// subprocess. Logic is identical — only the transport differs.
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { tool, args } = body ?? {};

  try {
    if (tool === "get_platform_info") {
      return Response.json({
        chain: "base",
        chain_id: CHAIN_ID,
        usdc_address: USDC_ADDRESS,
        usdc_decimals: USDC_DECIMALS,
        platform_fee_bps: PLATFORM_FEE_BPS,
        platform_fee_wallet: FEE_WALLET,
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
      const recipient = args?.recipient;
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
            args: [FEE_WALLET, fee],
          }),
          description: `Transfer ${Number(fee) / 10 ** USDC_DECIMALS} USDC platform fee`,
        },
      ];

      return Response.json({
        chain_id: CHAIN_ID,
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
