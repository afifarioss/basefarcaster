import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import { Redis } from "@upstash/redis";
import {
  USDC_ADDRESS,
  USDC_DECIMALS,
  PLATFORM_FEE_BPS,
  PLATFORM_FEE_WALLET,
  CHAIN,
  ERC20_ABI,
} from "@/lib/constants";
import { splitTipAmount } from "@/lib/utils";
import { encodeFunctionData } from "viem";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

async function initializeServer(server: Parameters<typeof createMcpHandler>[0] extends (server: infer S) => unknown ? S : never) {
  server.registerTool(
    "get_platform_info",
    {
      description:
        "Get BaseZap platform configuration including Base chain, USDC contract, fee rate, and fee wallet.",
    },
    async () => ({
      content: [
        {
          type: "text",
          text: JSON.stringify({
            chain: "base",
            chain_id: CHAIN.id,
            usdc_address: USDC_ADDRESS,
            usdc_decimals: USDC_DECIMALS,
            platform_fee_bps: PLATFORM_FEE_BPS,
            platform_fee_percent: PLATFORM_FEE_BPS / 100,
            platform_fee_wallet: PLATFORM_FEE_WALLET,
          }),
        },
      ],
    }),
  );

  server.registerTool(
    "get_tip_quote",
    {
      description:
        "Calculate the BaseZap creator payout and 2% platform fee for a USDC tip.",
      inputSchema: {
        amount_usdc: z.number().positive().describe("Tip amount in USDC."),
      },
    },
    async ({ amount_usdc }) => {
      const { fee, recipientAmount } = splitTipAmount(amount_usdc);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              total_usdc: amount_usdc,
              creator_receives_usdc:
                Number(recipientAmount) / 10 ** USDC_DECIMALS,
              platform_fee_usdc:
                Number(fee) / 10 ** USDC_DECIMALS,
              platform_fee_bps: PLATFORM_FEE_BPS,
              platform_fee_percent: PLATFORM_FEE_BPS / 100,
            }),
          },
        ],
      };
    },
  );

  server.registerTool(
    "build_tip_calldata",
    {
      description:
        "Build unsigned ERC-20 USDC transfer calldata for a BaseZap tip. Does not hold keys or broadcast transactions.",
      inputSchema: {
        recipient: z
          .string()
          .regex(/^0x[a-fA-F0-9]{40}$/)
          .describe("Creator EVM address receiving the tip."),
        amount_usdc: z
          .number()
          .positive()
          .describe("Total tip amount in USDC."),
      },
    },
    async ({ recipient, amount_usdc }) => {
      const { fee, recipientAmount } = splitTipAmount(amount_usdc);

      const calls = [
        {
          to: USDC_ADDRESS,
          data: encodeFunctionData({
            abi: ERC20_ABI,
            functionName: "transfer",
            args: [recipient as `0x${string}`, recipientAmount],
          }),
          description: `Transfer ${
            Number(recipientAmount) / 10 ** USDC_DECIMALS
          } USDC to creator`,
        },
        {
          to: USDC_ADDRESS,
          data: encodeFunctionData({
            abi: ERC20_ABI,
            functionName: "transfer",
            args: [PLATFORM_FEE_WALLET, fee],
          }),
          description: `Transfer ${
            Number(fee) / 10 ** USDC_DECIMALS
          } USDC platform fee`,
        },
      ];

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              chain_id: CHAIN.id,
              calls,
              note: "UNSIGNED calldata. This MCP server does not hold keys or broadcast transactions.",
            }),
          },
        ],
      };
    },
  );
}

const mcpHandler = createMcpHandler(initializeServer, {
  serverInfo: {
    name: "basefarcaster",
    version: "1.0.0",
  },
});

const redis = new Redis({
  url: process.env.KV_REST_API_URL as string,
  token: process.env.KV_REST_API_TOKEN as string,
});

const MCP_RATE_LIMIT = 30;
const MCP_RATE_WINDOW_SECONDS = 60;

async function handler(request: Request) {
  const ip = getClientIp(request);
  const { allowed, resetSeconds } = await checkRateLimit(
    redis,
    `mcp:${ip}`,
    MCP_RATE_LIMIT,
    MCP_RATE_WINDOW_SECONDS
  );

  if (!allowed) {
    return Response.json(
      { error: "Too many requests, please slow down." },
      { status: 429, headers: { "Retry-After": String(resetSeconds) } }
    );
  }

  return mcpHandler(request);
}

export { handler as GET, handler as POST };
