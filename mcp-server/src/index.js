#!/usr/bin/env node
/**
 * BaseFarCaster MCP Server
 * ─────────────────────────────────────────────────────────────────────────
 * Exposes BaseFarCaster's USDC tipping primitive to MCP-compatible AI
 * agents. Every tool here is either read-only (quotes, platform info) or
 * constructs *unsigned* transaction calldata — this server never holds a
 * private key, never signs, and never broadcasts a transaction. Signing
 * and submission always happen client-side, in the agent's own connected
 * wallet.
 *
 * Tools:
 *   - get_platform_info   → static config: chain, USDC address, fee bps, wallets
 *   - get_tip_quote       → exact-sum fee split for a given USDC amount
 *   - build_tip_calldata  → unsigned ERC-20 transfer calldata for both legs
 *     of a tip (recipient + platform fee), ready for a wallet to sign
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { encodeFunctionData, parseUnits, isAddress } from "viem";
import { z } from "zod";

// ── Config — mirrors lib/constants.ts in the main app ──────────────────────
const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const USDC_DECIMALS = 6;
const CHAIN_ID = 8453; // Base Mainnet
const PLATFORM_FEE_BPS = 200; // 2%
const FEE_DENOMINATOR = 10000;
// Checks NEXT_PUBLIC_FEE_WALLET first — that's the name used in the main
// Next.js app (lib/constants.ts) and in Vercel production. FEE_WALLET is
// kept as a fallback name for standalone/local runs of this MCP server
// outside the main app's env.
const FEE_WALLET =
  process.env.NEXT_PUBLIC_FEE_WALLET ||
  process.env.FEE_WALLET ||
  "0x7845D45d9E53268EBFf3C4a9daBb994cE5b93918";

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
];

function splitTipAmount(amountUsdc) {
  const total = parseUnits(amountUsdc.toFixed(USDC_DECIMALS), USDC_DECIMALS);
  const fee = (total * BigInt(PLATFORM_FEE_BPS)) / BigInt(FEE_DENOMINATOR);
  const recipientAmount = total - fee;
  return { total, fee, recipientAmount };
}

// ── Tool schemas ─────────────────────────────────────────────────────────
const TOOLS = [
  {
    name: "get_platform_info",
    description:
      "Returns BaseFarCaster's static platform configuration: chain, USDC token address, platform fee (basis points), and the platform fee wallet. Read-only, no side effects.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "get_tip_quote",
    description:
      "Given a tip amount in USDC, returns the exact-sum fee split: how much the creator receives and how much goes to the 5% platform fee. Pure calculation, read-only.",
    inputSchema: {
      type: "object",
      properties: {
        amount_usdc: {
          type: "number",
          description: "Tip amount in USDC, e.g. 1.5",
          exclusiveMinimum: 0,
        },
      },
      required: ["amount_usdc"],
      additionalProperties: false,
    },
  },
  {
    name: "build_tip_calldata",
    description:
      "Constructs UNSIGNED ERC-20 transfer calldata for both legs of a tip (creator + platform fee), ready to be signed and sent by a wallet-connected client via wagmi's sendCalls or two sequential transfers. This tool does NOT sign or broadcast anything — it has no key custody and cannot move funds on its own.",
    inputSchema: {
      type: "object",
      properties: {
        recipient: {
          type: "string",
          description: "Creator's wallet address (0x...) to receive the tip",
        },
        amount_usdc: {
          type: "number",
          description: "Total tip amount in USDC, e.g. 1.5",
          exclusiveMinimum: 0,
        },
      },
      required: ["recipient", "amount_usdc"],
      additionalProperties: false,
    },
  },
];

const server = new Server(
  { name: "basefarcaster-mcp", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOLS,
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === "get_platform_info") {
      const payload = {
        chain: "base",
        chain_id: CHAIN_ID,
        usdc_address: USDC_ADDRESS,
        usdc_decimals: USDC_DECIMALS,
        platform_fee_bps: PLATFORM_FEE_BPS,
        platform_fee_wallet: FEE_WALLET,
      };
      return { content: [{ type: "text", text: JSON.stringify(payload, null, 2) }] };
    }

    if (name === "get_tip_quote") {
      const schema = z.object({ amount_usdc: z.number().positive() });
      const { amount_usdc } = schema.parse(args);
      const { total, fee, recipientAmount } = splitTipAmount(amount_usdc);
      const payload = {
        total_usdc: amount_usdc,
        creator_receives_usdc: Number(recipientAmount) / 10 ** USDC_DECIMALS,
        platform_fee_usdc: Number(fee) / 10 ** USDC_DECIMALS,
        platform_fee_bps: PLATFORM_FEE_BPS,
      };
      return { content: [{ type: "text", text: JSON.stringify(payload, null, 2) }] };
    }

    if (name === "build_tip_calldata") {
      const schema = z.object({
        recipient: z.string().refine(isAddress, "Not a valid 0x address"),
        amount_usdc: z.number().positive(),
      });
      const { recipient, amount_usdc } = schema.parse(args);
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

      const payload = {
        chain_id: CHAIN_ID,
        calls,
        note: "UNSIGNED calldata. This server does not hold keys or broadcast transactions — pass these calls to a wallet-connected client (e.g. wagmi's sendCalls / EIP-5792) for the user to review and sign.",
      };
      return { content: [{ type: "text", text: JSON.stringify(payload, null, 2) }] };
    }

    return {
      content: [{ type: "text", text: `Unknown tool: ${name}` }],
      isError: true,
    };
  } catch (err) {
    return {
      content: [{ type: "text", text: `Error: ${err.message}` }],
      isError: true,
    };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
