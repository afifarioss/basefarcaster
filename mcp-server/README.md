# BaseFarCaster MCP Server

Exposes BaseFarCaster's USDC tipping primitive to MCP-compatible AI agents
(Claude, or any other MCP client).

## Safety design

This server **never holds a private key, signs, or broadcasts a
transaction.** Every tool is either:

- **Read-only** (`get_platform_info`, `get_tip_quote`) — pure config lookups
  and arithmetic, no side effects, no external calls.
- **Calldata construction only** (`build_tip_calldata`) — returns *unsigned*
  ERC-20 transfer calldata as plain JSON. Signing and broadcasting always
  happen client-side, in the end user's own wallet.

This means the server has no custody risk by design — there's no key to
steal, no funds it can move on its own, and its tool surface is exactly
what it claims to be. That's intentional: it's built to hold up well under
behavioral grading tools like [Polygraph](https://www.polygraph.so/) that
specifically probe for custody and adversarial-input risk in MCP servers.

## Tools

| Tool | Type | What it does |
|---|---|---|
| `get_platform_info` | Read-only | Returns chain, USDC address, fee bps, fee wallet |
| `get_tip_quote` | Read-only | Given a USDC amount, returns the exact fee split (creator amount + platform fee) |
| `build_tip_calldata` | Calldata construction | Given a recipient + amount, returns unsigned ERC-20 `transfer` calldata for both legs of the tip |

## Run locally

```bash
cd mcp-server
npm install
npm start
```

This starts the server on stdio, ready for any MCP client to connect to.

## Use with Claude Desktop / Claude Code

Add to your MCP client config:

```json
{
  "mcpServers": {
    "basefarcaster": {
      "command": "node",
      "args": ["/absolute/path/to/basefarcaster/mcp-server/src/index.js"],
      "env": {
        "FEE_WALLET": "0xYourFeeWalletHere"
      }
    }
  }
}
```

## Environment variables

| Variable | Default | What it's for |
|---|---|---|
| `FEE_WALLET` | placeholder burn address | The wallet `build_tip_calldata` routes the 2% platform fee to |

## Example: quoting and building a tip

```
> get_tip_quote({ amount_usdc: 5 })
{
  "total_usdc": 5,
  "creator_receives_usdc": 4.9,
  "platform_fee_usdc": 0.1,
  "platform_fee_bps": 200
}

> build_tip_calldata({ recipient: "0x7845D45d9E53268EBFf3C4a9daBb994cE5b93918", amount_usdc: 5 })
{
  "chain_id": 8453,
  "calls": [
    { "to": "0x8335...a913", "data": "0xa9059cbb...", "description": "Transfer 4.9 USDC to creator" },
    { "to": "0x8335...a913", "data": "0xa9059cbb...", "description": "Transfer 0.1 USDC platform fee" }
  ],
  "note": "UNSIGNED calldata. ... pass these calls to a wallet-connected client ..."
}
```

The agent (or a human) then hands `calls` to a connected wallet — e.g. via
wagmi's `sendCalls` (EIP-5792), the same batching pattern the main
BaseFarCaster app uses — for the actual signature and broadcast.

## Why this exists

`GRANT_STRATEGY.md` in the repo root pitches BaseFarCaster's fee-split
tipping logic as a forkable primitive for adjacent use cases. This MCP
server is the first fork: the same exact-sum math and batched-transfer
pattern (`lib/utils.ts#splitTipAmount` in the main app), made callable by
AI agents instead of only a browser UI.
