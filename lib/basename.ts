import { createPublicClient, http, isAddress } from "viem";
import { base } from "viem/chains";

const client = createPublicClient({
  chain: base,
  transport: http(process.env.BASE_RPC_URL || undefined),
});

const BASENAME_RESOLVER =
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

function normalizeBasename(name: string): string {
  return name.trim().toLowerCase().replace(/^@/, "");
}

function isBasename(name: string): boolean {
  return (
    name.endsWith(".base.eth") &&
    name.length > ".base.eth".length
  );
}

async function namehash(name: string): Promise<`0x${string}`> {
  const { namehash: viemNamehash } = await import("viem/ens");
  return viemNamehash(name);
}

export type ResolvedBasename = {
  name: string;
  address: `0x${string}`;
  chain: "base";
  chainId: 8453;
  resolver: `0x${string}`;
};

export async function resolveBasename(
  input: string
): Promise<ResolvedBasename | null> {
  const name = normalizeBasename(input);

  if (!isBasename(name)) {
    return null;
  }

  try {
    const node = await namehash(name);

    const address = await client.readContract({
      address: BASENAME_RESOLVER,
      abi: BASENAME_RESOLVER_ABI,
      functionName: "addr",
      args: [node],
    });

    if (
      !address ||
      !isAddress(address) ||
      address === "0x0000000000000000000000000000000000000000"
    ) {
      return null;
    }

    return {
      name,
      address,
      chain: "base",
      chainId: 8453,
      resolver: BASENAME_RESOLVER,
    };
  } catch {
    return null;
  }
}
