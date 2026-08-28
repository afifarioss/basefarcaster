import {
  createPublicClient,
  http,
  isAddress,
  namehash,
} from "viem";
import { base } from "viem/chains";

/**
 * Base Mainnet Basenames resolver.
 *
 * This is the upgradeable L2 resolver proxy published by
 * Base's official Basenames repository.
 */
export const BASENAME_L2_RESOLVER =
  "0x426fA03fB86E510d0Dd9F70335Cf102a98b10875" as const;

const BASENAME_RESOLVER_ABI = [
  {
    type: "function",
    name: "addr",
    stateMutability: "view",
    inputs: [
      {
        name: "node",
        type: "bytes32",
      },
    ],
    outputs: [
      {
        name: "",
        type: "address",
      },
    ],
  },
] as const;

export type BasenameResolution = {
  name: string;
  address: `0x${string}`;
  chain: "base";
  chainId: 8453;
  resolver: `0x${string}`;
};

function normalizeBasename(input: string): string {
  const value = input
    .trim()
    .replace(/^@/, "")
    .toLowerCase();

  if (value.endsWith(".base.eth")) {
    return value;
  }

  return `${value}.base.eth`;
}

export async function resolveBasename(
  input: string
): Promise<BasenameResolution | null> {
  if (!input?.trim()) {
    return null;
  }

  const name = normalizeBasename(input);

  if (
    !name ||
    name === ".base.eth" ||
    !name.endsWith(".base.eth")
  ) {
    return null;
  }

  const rpcUrl =
    process.env.BASE_RPC_URL ||
    "https://mainnet.base.org";

  const client = createPublicClient({
    chain: base,
    transport: http(rpcUrl),
  });

  try {
    const address = await client.readContract({
      address: BASENAME_L2_RESOLVER,
      abi: BASENAME_RESOLVER_ABI,
      functionName: "addr",
      args: [namehash(name)],
    });

    if (
      !isAddress(address) ||
      address ===
        "0x0000000000000000000000000000000000000000"
    ) {
      return null;
    }

    return {
      name,
      address,
      chain: "base",
      chainId: 8453,
      resolver: BASENAME_L2_RESOLVER,
    };
  } catch {
    return null;
  }
}
