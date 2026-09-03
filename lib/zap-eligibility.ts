import { createPublicClient, http } from "viem";
import { base } from "viem/chains";
import {
  ERC20_ABI,
  PLATFORM_FEE_BPS,
  ZAP_HOLDER_THRESHOLD,
  ZAP_TOKEN_ADDRESS,
} from "@/lib/constants";

const client = createPublicClient({
  chain: base,
  transport: http(process.env.BASE_RPC_URL || undefined),
});

const ZAP_DECIMALS = 18;

export async function getZapFeeBps(
  sender: `0x${string}`,
  blockNumber?: bigint,
): Promise<number> {
  try {
    const zapBalance = await client.readContract({
      address: ZAP_TOKEN_ADDRESS,
      abi: ERC20_ABI,
      functionName: "balanceOf",
      args: [sender],
      ...(blockNumber !== undefined ? { blockNumber } : {}),
    });

    const zapThreshold =
      BigInt(ZAP_HOLDER_THRESHOLD) * BigInt(10) ** BigInt(ZAP_DECIMALS);

    return zapBalance >= zapThreshold ? 0 : PLATFORM_FEE_BPS;
  } catch (error) {
    console.warn("getZapFeeBps: unable to verify $ZAP holder status", error);
    return PLATFORM_FEE_BPS;
  }
}
