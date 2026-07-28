# BaseFarCaster

Send real, onchain USDC tips on Base — in one tap, right inside Farcaster.

BaseFarCaster is a production-ready Farcaster Mini App built with Next.js 15,
OnchainKit, MiniKit, and wagmi. It works as a native Mini App inside
Warpcast/Farcaster clients and as a standalone web app, with wallet support
for Base Smart Wallet, Coinbase Wallet, the Farcaster wallet, MetaMask,
Rainbow, and any other injected wallet.

---

## Features

- **Real USDC tipping on Base** — 0.1 / 1 / 5 USDC presets, or a custom amount
- **Automatic 10% platform fee**, split onchain in the same transaction batch
- **Multi-wallet support** — Base Smart Wallet, Coinbase Wallet, Farcaster
  wallet (auto-detected inside Farcaster clients), MetaMask, Rainbow, and
  generic injected wallets
- **Farcaster profile display** — shows the connected user's FID, username,
  and avatar when running inside a Farcaster client
- **Success state with confetti** and a "Share on Farcaster" flow to close
  the loop
- **High-converting hero section** built around the 3-second rule: headline,
  benefit-driven subheadline, bright CTA, and light social proof
- **Dark, premium crypto UI** — true black background, Base Blue accents,
  soft glassmorphism, and a blue glow on primary actions
- **Proper Farcaster Mini App manifest** served dynamically from
  `/.well-known/farcaster.json`, plus a webhook stub for lifecycle events

---

## Tech stack

| Layer      | Choice                                   |
| ---------- | ----------------------------------------- |
| Framework  | Next.js 15 (App Router)                  |
| Wallet SDK | OnchainKit + MiniKit                     |
| Onchain    | wagmi + viem                              |
| Styling    | Tailwind CSS                              |
| Chain      | Base Mainnet                              |
| Token      | Native USDC (`0x8335...a913`)             |

---

## Project structure

```
basefarcaster/
├── app/
│   ├── .well-known/farcaster.json/route.ts   # Mini App manifest (dynamic)
│   ├── api/webhook/route.ts                  # Farcaster lifecycle events
│   ├── layout.tsx                            # Root layout + fc:frame meta
│   ├── page.tsx                               # Home: hero, tip flow, footer
│   ├── providers.tsx                          # wagmi / OnchainKit / MiniKit
│   └── globals.css                            # Dark theme + design tokens
├── components/
│   ├── Hero.tsx                               # 3-second-rule hero section
│   ├── TipCard.tsx                            # Amount select + send flow
│   ├── SuccessModal.tsx                       # Confetti + share on success
│   ├── WalletConnect.tsx                      # Multi-wallet connect menu
│   ├── ProfileCard.tsx                        # FID / username / avatar
│   ├── ShareButton.tsx                        # Warpcast compose share
│   └── Footer.tsx
├── lib/
│   ├── constants.ts                           # Fee wallet, USDC addr, etc.
│   └── utils.ts                               # Fee-split math, formatting
├── public/
│   ├── .well-known/                           # (unused — manifest is dynamic)
│   └── images/                                # icon, splash, OG, screenshot
├── GRANT_STRATEGY.md
└── README.md
```

---

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in:

- `NEXT_PUBLIC_ONCHAINKIT_API_KEY` — free key from the
  [Coinbase Developer Platform](https://portal.cdp.coinbase.com/) →
  OnchainKit.
- `NEXT_PUBLIC_FEE_WALLET` — the wallet that receives your 10% platform fee.
  Ships with a placeholder burn address
  (`0x000000000000000000000000000000000000dEaD`) — **change this before
  going live**.
- `NEXT_PUBLIC_DEFAULT_RECIPIENT` — the default wallet tips are sent to.
  In production, swap `TipCard`'s `recipient` prop for a per-profile address
  (e.g. resolved from the viewed FID) instead of a single static wallet.
- `NEXT_PUBLIC_URL` — your deployed URL (see step 4).

### 3. Run locally

```bash
npm run dev
```

Visit `http://localhost:3000`. Outside of a Farcaster client the app runs as
a normal web app — wallet connect will offer Coinbase/Base Smart Wallet,
MetaMask, Rainbow, and other injected wallets. The Farcaster wallet
connector auto-activates only when the app is opened inside a Farcaster
client (Warpcast, etc).

### 4. Deploy to Vercel

```bash
npm i -g vercel
vercel
```

Or connect the repo in the [Vercel dashboard](https://vercel.com/new). Add
the same environment variables from `.env.local` in
**Project Settings → Environment Variables**, then set
`NEXT_PUBLIC_URL` to your production domain (e.g.
`https://basefarcaster.vercel.app` or your custom domain) and redeploy.

### 5. Connect your Farcaster account (account association)

This step proves your Farcaster account owns the deployed domain, which is
required for the Mini App to render correctly (icon, name, launch button)
inside Farcaster clients.

1. Deploy the app first — you need a live `NEXT_PUBLIC_URL`.
2. Open Warpcast → **Settings → Developer → Domains**.
3. Enter your deployed domain and tap **Generate account association**.
4. Warpcast returns three values: `header`, `payload`, `signature`.
5. Add them to your Vercel environment variables as `FARCASTER_HEADER`,
   `FARCASTER_PAYLOAD`, and `FARCASTER_SIGNATURE`.
6. Redeploy. Verify the manifest is live at
   `https://your-domain/.well-known/farcaster.json`.
7. Paste your app URL into Warpcast's Mini App developer tool to preview
   and validate the embed.

### 6. Replace placeholder art

`public/images/icon.png`, `splash.png`, `og-image.png`, and
`screenshot-1.png` are generated placeholders. Swap them for real brand
assets before submitting to the Base or Farcaster app directories.

---

## How the fee split works

Every tip is sent as **two USDC transfers batched into a single wallet
confirmation** (via `wagmi`'s `sendCalls`, EIP-5792) where the connected
wallet supports batching — Base Smart Wallet and the Farcaster wallet both
do. Wallets without batching support fall back to two sequential prompts.

```
tip amount × 90%  → creator wallet
tip amount × 10%  → platform fee wallet
```

The split is computed in `lib/utils.ts#splitTipAmount` using integer USDC
base units (6 decimals) so the two legs always sum exactly back to the
original amount — no rounding drift.

To change the fee percentage, edit `PLATFORM_FEE_BPS` in
`lib/constants.ts` (basis points; `1000` = 10%).

---

## Wallet support notes

- **Base Smart Wallet / Coinbase Wallet** — via `coinbaseWallet` connector,
  `preference: "all"` (supports both smart wallet and EOA).
- **Farcaster wallet** — via `@farcaster/frame-wagmi-connector`. Only
  activates inside a Farcaster client; invisible/no-op on the open web.
- **MetaMask** — dedicated `metaMask()` connector for reliable deep links.
- **Rainbow & other injected wallets** — caught by the generic `injected()`
  connector, which detects any EIP-1193 provider in the browser.

---

## License

MIT — build on it freely.
