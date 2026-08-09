<div align="center">

# ⚡ BaseZap

**Instant USDC funding for Farcaster builders — one tap, ~2 second settlement, native inside Farcaster.**

[

![Base](https://img.shields.io/badge/Base-Mainnet-0052FF?style=flat-square)

](https://base.org)
[

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square)

](https://nextjs.org)
[

![Farcaster](https://img.shields.io/badge/Farcaster-Mini%20App-855DCD?style=flat-square)

](https://miniapps.farcaster.xyz)
[

![License](https://img.shields.io/badge/license-MIT-white?style=flat-square)

](#license)

[Live App](https://basefarcaster.vercel.app) · [Grant Strategy](./GRANT_STRATEGY.md) · [Report an Issue](../../issues)

</div>

---

## Live status

Actively shipped, real velocity — every claim below is checkable against
[commit history](../../commits/main) or a real onchain transaction, not
just written down.

| Feature | Status |
|---|---|
| Core USDC tipping, batched fee split | ✅ Live on Base Mainnet, confirmed with real funds |
| Tip from username or pasted cast link | ✅ Live |
| Native "Cast this zap" share loop (`composeCast`) | ✅ Live |
| Recent zaps feed (onchain, identity-resolved) | ✅ Live |
| Base / Farcaster / Venice attribution | ✅ Live, official brand assets |
| CDP Paymaster (gasless tipping) | ✅ Live — confirmed sponsored on real transactions |
| VVV staking (approve → stake) | ✅ Deployed against the verified [sVVV contract](https://basescan.org/address/0x321b7ff75154472B18EDb199033fF4D116F340Ff) |
| Push notifications on tip received | ⚙️ Wired end-to-end via Neynar-managed webhook — pending first real-world confirmation |

---

## What is this

Farcaster's social graph rewards good building and good casts with likes and
recasts — but none of that carries real economic value back to the builder
who made it. Existing tipping tools either force people to hold volatile
tokens they didn't choose, or live outside the feed entirely, bleeding
conversion at every click-through.

**BaseZap fixes that for builders specifically.** It's a Farcaster Mini App
that opens inline, inside the client, and lets anyone fund a builder with a
real, stable, onchain USDC tip in one wallet confirmation — no bridging, no
gas guesswork, no context-switch. Paste a username or a cast link, pick an
amount, done.
tip $1 USDC  →  95% to the builder, 5% platform fee, both legs batched
→  confirmed in ~2 seconds  →  <$0.01 network cost
---

## Features

- ⚡ **Fund a builder directly** — `$0.10` / `$0.50` / `$1` / `$5` presets,
  or any custom amount, sent straight to their wallet
- 🔗 **Tip from a username or a pasted cast link** — paste a
  `farcaster.xyz`/`warpcast.com` cast URL and BaseZap resolves the author
  automatically, no manual lookup needed
- 🪙 **VVV as a secondary tip currency** — [Venice AI](https://venice.ai)'s
  verified token on Base, offered as an option alongside USDC (not the
  default — this stays a USDC-first app)
- 🥩 **VVV staking** — approve → stake flow wired directly to Venice's
  real, verified sVVV contract on Base. Stake 100 VVV to unlock Venice Pro.
- ⚡ **Gasless tipping** — CDP Paymaster sponsors gas for Base Smart Wallet
  users, confirmed sponsored on real onchain transactions
- 🔗 **Personalized tip links** — `?to=0x...&label=name` funds a specific
  builder directly, no fixed single recipient required
- 📊 **Recent zaps feed** — real onchain tips, correlated from Base logs and
  resolved to Farcaster identities via Neynar, shown live on the homepage
- 🧾 **Automatic 5% platform fee**, split onchain in the same batched
  transaction as the tip itself — exact-sum math, no rounding drift
- 👛 **Every major wallet, out of the box** — Base Smart Wallet, Coinbase
  Wallet, the Farcaster wallet (auto-detected inside Farcaster clients),
  MetaMask, Rainbow, and any other injected EIP-1193 wallet
- 🪪 **Native Farcaster identity** — shows the connected user's FID,
  username, and avatar when running inside a Farcaster client
- 🎉 **Native post-tip share loop** — "Cast this zap" fires
  `sdk.actions.composeCast` directly inside Farcaster clients, turning
  every tip into free distribution
- 🌓 **Premium dark UI** — true-black background, Base Blue accents, soft
  glassmorphism, glow-on-hover primary actions
- 📄 **Correct, current Mini App manifest** — served dynamically from
  `/.well-known/farcaster.json`, with a real Neynar-managed webhook wired
  for lifecycle events and tip notifications

---

## Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 15** (App Router) | Server-rendered manifest route, edge-ready |
| Wallet SDK | **OnchainKit + MiniKit** | Reference implementation for Base Mini Apps |
| Farcaster SDK | **`@farcaster/miniapp-sdk`** + **`@farcaster/miniapp-wagmi-connector`** | Current (non-legacy) Farcaster Mini App standard |
| Onchain | **wagmi + viem** | Type-safe contract calls, EIP-5792 batched transactions |
| Gas sponsorship | **CDP Paymaster** | Sponsors gas for Base Smart Wallet tippers |
| Identity | **Neynar API** | Username/cast-link resolution, batch address→identity lookup for the zaps feed |
| Styling | **Tailwind CSS** | Fast iteration on a tightly-scoped design system |
| Chain | **Base Mainnet** | Sub-cent fees make sub-$1 tips economically viable |
| Token | **Native USDC** (`0x8335…a913`) | Stable-denominated, no volatility for builders |

---

## Contract addresses (Base Mainnet)

| Token | Address | Notes |
|---|---|---|
| USDC | [`0x8335…a913`](https://basescan.org/token/0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913) | Native Circle USDC |
| VVV | [`0xacfE…21bf`](https://basescan.org/token/0xacfE6019Ed1A7Dc6f7B508C02d1b04ec88cC21bf) | Venice AI token |
| sVVV (staking) | [`0x321b…40Ff`](https://basescan.org/address/0x321b7ff75154472B18EDb199033fF4D116F340Ff) | Verified proxy, [implementation](https://basescan.org/address/0xe37a7920dbc11253ac6d031c29f592f71b348dca) |

---

## Project structure
basefarcaster/
├── app/
│   ├── .well-known/farcaster.json/route.ts   # Mini App manifest (dynamic, env-driven)
│   ├── api/resolve-user/route.ts             # Username/FID → Farcaster identity + address
│   ├── api/recent-zaps/route.ts              # Correlates onchain tip legs, resolves identities
│   ├── api/notify-tip/route.ts               # Fires tip-received notification via Neynar webhook
│   ├── api/stats/route.ts                    # Aggregate tip/volume/supporter stats
│   ├── share/route.ts                        # Share Extension entry point (cast → resolve → tip)
│   ├── layout.tsx                            # Root layout + fc:frame / fc:miniapp embed meta
│   ├── page.tsx                              # Home: hero, tip flow, recent zaps, how-it-works
│   ├── providers.tsx                         # wagmi + OnchainKit + MiniKit setup
│   └── globals.css                           # Dark theme + design tokens
├── components/
│   ├── Hero.tsx            # 3-second-rule hero: why, what, how, CTA
│   ├── TipCard.tsx         # Amount select, live fee breakdown, batched send, paymaster
│   ├── UsernameInput.tsx   # Username or cast-link input, resolves to a recipient
│   ├── RecentZaps.tsx      # Live feed of recent onchain tips, empty-state CTA
│   ├── StakeCard.tsx       # VVV approve → stake flow
│   ├── TrustBar.tsx        # Token / chain / fee / settlement chips
│   ├── TrustChecklist.tsx  # Why-you-can-trust-this list
│   ├── VeniceAttribution.tsx  # Base / Farcaster / Venice badge row
│   ├── VeniceProStatus.tsx # Live sVVV balance + Pro-unlock status
│   ├── BuiltWith.tsx       # Base / Farcaster / Venice story section
│   ├── SuccessModal.tsx    # Confetti + "Cast this zap" native share
│   ├── WalletConnect.tsx   # Multi-wallet connect menu
│   ├── ProfileCard.tsx     # FID / username / avatar (Farcaster context)
│   ├── ShareButton.tsx     # Generic Warpcast compose-intent share (separate from composeCast)
│   └── Footer.tsx
├── lib/
│   ├── constants.ts   # Fee wallet, USDC/VVV/sVVV addresses, tip presets, app copy
│   └── utils.ts       # Exact-sum fee-split math, formatting, share URLs
├── public/images/     # icon, splash, OG, screenshot, brand-asset SVGs
├── GRANT_STRATEGY.md  # Base grant pitch, roadmap, metrics
└── README.md
---

## Getting started

### 1. Install

```bash
npm install
2. Configure environment
cp .env.example .env.local
Variable
What it's for
NEXT_PUBLIC_ONCHAINKIT_API_KEY
Free key from Coinbase Developer Platform → Client API key
NEXT_PUBLIC_PAYMASTER_URL
CDP Paymaster endpoint — sponsors gas for Base Smart Wallet tips
NEXT_PUBLIC_FEE_WALLET
Wallet that receives the 5% platform fee
NEXT_PUBLIC_DEFAULT_RECIPIENT
Fallback wallet when no ?to= or resolved recipient is set
NEYNAR_API_KEY
Username/cast-link resolution, identity lookups for the zaps feed, tip notifications
VENICE_API_KEY
OG image background generation
NEXT_PUBLIC_URL
Your deployed domain, no trailing slash
FARCASTER_HEADER / FARCASTER_PAYLOAD / FARCASTER_SIGNATURE
Server-only — generated by Warpcast, see step 5
3. Run locally
npm run dev
Outside a Farcaster client the app runs as a normal web app — wallet
connect offers Coinbase/Base Smart Wallet, MetaMask, Rainbow, and other
injected wallets. The Farcaster wallet connector auto-activates only when
opened inside a Farcaster client.
4. Deploy
npm i -g vercel
vercel
Add the same env vars in your Vercel project settings (or via
vercel env add <NAME>), then:
vercel --prod
5. Connect your Farcaster account
Required for the app to render its icon, name, and launch button correctly
inside Farcaster clients.
Deploy first — you need a live URL.
Warpcast → Settings → Developer → Domains → enter your domain →
Generate account association.
Copy the three returned values into FARCASTER_HEADER,
FARCASTER_PAYLOAD, FARCASTER_SIGNATURE.
Redeploy, then verify at https://your-domain/.well-known/farcaster.json.
Paste your URL into Warpcast's Mini App Developer Tools to preview
the live embed.
How the fee split works
Every tip is two USDC transfers, batched into a single wallet
confirmation via wagmi's sendCalls (EIP-5792) on wallets that support
it — Base Smart Wallet and the Farcaster wallet both do. Wallets without
batching support fall back to two sequential prompts.
tip amount × 95%  →  builder's wallet
tip amount × 5%   →  platform fee wallet
Computed in lib/utils.ts#splitTipAmount using integer USDC base units (6
decimals), so the two legs always sum exactly back to the original amount —
no rounding drift. Change the percentage via PLATFORM_FEE_BPS in
lib/constants.ts (basis points; 500 = 5%).
Base Smart Wallet users additionally get sponsored gas via CDP
Paymaster — the batched call above includes a capabilities.paymasterService
config, so the tip itself is the only cost. Since sendCalls returns a
bundle ID rather than a transaction hash, /api/recent-zaps and the
post-tip Basescan link both resolve the real transaction hash via
useCallsStatus before linking out.
Wallet support
Wallet
Connector
Notes
Base Smart Wallet / Coinbase Wallet
coinbaseWallet()
preference: "all" — supports smart wallet and EOA, gasless via Paymaster
Farcaster wallet
farcasterMiniApp()
Auto-activates only inside a Farcaster client
MetaMask
metaMask()
Dedicated connector for reliable deep links
Rainbow & others
injected()
Catches any EIP-1193 provider in the browser
Roadmap
See GRANT_STRATEGY.md for the full plan. Short version:
[ ] Confirm push notifications end-to-end with a real "Add Mini App" + tip
[ ] Campaign/ritual mode (e.g. weekly builder-funding prompt)
[ ] Cast actions — tip directly from the feed, no Mini App open required
[ ] Public builder profile pages (beyond the recent zaps feed)
[ ] Recurring / subscription tips
[ ] Full VVV unstake + claim UI (approve → stake shipped; unstake next)
Contributing
Issues and PRs welcome. The fee-split tipping primitive
(lib/utils.ts#splitTipAmount + batched sendCalls) is designed to be
forked into adjacent use cases — paid unlocks, bounty payouts, split
payments — so feel free to build on it.
License
MIT — build on it freely.
