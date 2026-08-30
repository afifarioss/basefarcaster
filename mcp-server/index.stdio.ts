import { McpServer } from "@modelcontextprotocol/server";
import { StdioServerTransport } from "@modelcontextprotocol/server/stdio";
import { z } from "zod";

const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const USDC_DECIMALS = 6;
const CHAIN_ID = 8453;
const PLATFORM_FEE_BPS = 200;
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
  const selector = "a9059cbb";
  const address = to.slice(2).toLowerCase().padStart(64, "0");
  const value = amount.toString(16).padStart(64, "0");

  return `0x${selector}${address}${value}`;
}

const server = new McpServer({
  name: "basefarcaster",
  version: "1.0.0",
});

server.registerTool(
  "get_platform_info",
  {
    description:
      "Get BaseZap platform configuration including Base chain, USDC contract, fee rate, and fee wallet.",
  },
  async () => ({
    content: [
      {
        type: "text" as const,
        text: JSON.stringify({
          chain: "base",
          chain_id: CHAIN_ID,
          usdc_address: USDC_ADDRESS,
          usdc_decimals: USDC_DECIMALS,
          platform_fee_bps: PLATFORM_FEE_BPS,
          platform_fee_percent: PLATFORM_FEE_BPS / 100,
          platform_fee_wallet: FEE_WALLET,
        }),
      },
    ],
  })
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
          type: "text" as const,
          text: JSON.stringify({
            total_usdc: amount_usdc,
            creator_receives_usdc:
              Number(recipientAmount) / 10 ** USDC_DECIMALS,
            platform_fee_usdc: Number(fee) / 10 ** USDC_DECIMALS,
            platform_fee_bps: PLATFORM_FEE_BPS,
            platform_fee_percent: PLATFORM_FEE_BPS / 100,
          }),
        },
      ],
    };
  }
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
        data: erc20TransferCalldata(recipient, recipientAmount),
        description: `Transfer ${
          Number(recipientAmount) / 10 ** USDC_DECIMALS
        } USDC to creator`,
      },
      {
        to: USDC_ADDRESS,
        data: erc20TransferCalldata(FEE_WALLET, fee),
        description: `Transfer ${
          Number(fee) / 10 ** USDC_DECIMALS
        } USDC platform fee`,
      },
    ];

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({
            chain_id: CHAIN_ID,
            calls,
            note: "UNSIGNED calldata. This MCP server does not hold keys or broadcast transactions.",
          }),
        },
      ],
    };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
