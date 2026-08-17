/**
 * basezap-agent — x402 paid service.
 * Exposes BaseZap's USDC tip-quoting and calldata-construction tools.
 * Same logic as app/api/agent/route.ts — read-only / calldata-construction
 * only, never holds keys or broadcasts transactions.
 */

const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const USDC_DECIMALS = 6;
const CHAIN_ID = 8453;
const PLATFORM_FEE_BPS = 500;
const FEE_DENOMINATOR = 10000n;
const FEE_WALLET = "0x7845D45d9E53268EBFf3C4a9daBb994cE5b93918";

function parseUsdc(amount: number): bigint {
  return BigInt(Math.round(amount * 10 ** USDC_DECIMALS));
}

function splitTipAmount(amountUsdc: number) {
  const total = parseUsdc(amountUsdc);
  const fee = (total * BigInt(PLATFORM_FEE_BPS)) / FEE_DENOMINATOR;
  const recipientAmount = total - fee;
  return { total, fee, recipientAmount };
}

function erc20TransferCalldata(to: string, amount: bigint): string {
  // transfer(address,uint256) selector: 0xa9059cbb
  const selector = "a9059cbb";
  const addr = to.toLowerCase().replace("0x", "").padStart(64, "0");
  const amt = amount.toString(16).padStart(64, "0");
  return `0x${selector}${addr}${amt}`;
}

export default async function handler(req: Request): Promise<Response> {
  const body = await req.json().catch(() => ({}));
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
      const recipient = String(args?.recipient ?? "");
      const amount_usdc = Number(args?.amount_usdc);
      if (!/^0x[a-fA-F0-9]{40}$/.test(recipient)) {
        return Response.json({ error: "recipient must be a valid 0x address" }, { status: 400 });
      }
      if (!amount_usdc || amount_usdc <= 0) {
        return Response.json({ error: "amount_usdc must be a positive number" }, { status: 400 });
      }
      const { fee, recipientAmount } = splitTipAmount(amount_usdc);

      const calls = [
        {
          to: USDC_ADDRESS,
          data: erc20TransferCalldata(recipient, recipientAmount),
          description: `Transfer ${Number(recipientAmount) / 10 ** USDC_DECIMALS} USDC to creator`,
        },
        {
          to: USDC_ADDRESS,
          data: erc20TransferCalldata(FEE_WALLET, fee),
          description: `Transfer ${Number(fee) / 10 ** USDC_DECIMALS} USDC platform fee`,
        },
      ];

      return Response.json({
        chain_id: CHAIN_ID,
        calls,
        note: "UNSIGNED calldata. This service does not hold keys or broadcast transactions.",
      });
    }

    return Response.json({ error: `Unknown tool: ${tool}. Use get_platform_info, get_tip_quote, or build_tip_calldata.` }, { status: 400 });
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
