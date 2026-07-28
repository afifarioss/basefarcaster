# BaseFarCaster — Base Grant Strategy

## One-sentence pitch

BaseFarCaster turns any Farcaster cast into a one-tap, real-USDC tip on
Base — bringing the "like button" economics of social media to actual
onchain money.

## Problem it solves

Farcaster's social graph already rewards good content with likes, recasts,
and comments — but none of that carries economic value back to the creator.
The tools that do exist for onchain tipping are either:

- **Token-based** (e.g. tip-with-a-memecoin flows), which forces creators to
  manage volatile, illiquid assets they didn't choose to hold, or
- **Off-platform**, requiring a creator to link out to a separate app,
  connect a wallet cold, and complete a multi-step flow that kills
  conversion — most tipping intent dies in the click-through.

There is no default, native, USDC-denominated tipping primitive that lives
directly inside the Farcaster client experience. BaseFarCaster is that
primitive: a Mini App that opens in under a second, defaults to a stable
asset creators actually want to hold, and completes in one wallet
confirmation.

## Why it deserves a Base grant

- **It's a distribution multiplier for Base, not just an app on Base.**
  Every tip is an onchain USDC transaction that a non-crypto-native
  Farcaster user can complete without understanding gas, bridging, or
  wallets — Base's core thesis of "onchain should feel like the internet"
  applied directly to payments.
- **It showcases Base's technical strengths end-to-end**: Base Smart Wallet
  for gasless-feeling UX, sub-cent transaction fees making sub-$1 tips
  economically viable (impossible on L1), and MiniKit/OnchainKit as the
  reference implementation for a wallet-agnostic, multi-connector Mini App.
- **It's a repeatable template, not a one-off.** The fee-split tipping
  primitive (`lib/utils.ts#splitTipAmount`, batched `sendCalls`) is
  architected to be forked into adjacent use cases — paid replies, gated
  content unlocks, bounty payouts — expanding the surface area of USDC
  transactions on Base that a grant helps seed.
- **It closes the loop on network effects.** The built-in "Share on
  Farcaster" flow after every successful tip is a growth mechanism that
  costs nothing to run and compounds: every tip is a public, onchain proof
  of a working payment rail, cast back into the feed it came from.

## Key metrics to track

| Metric | Why it matters |
| --- | --- |
| Total tip volume (USDC) | Direct measure of onchain economic activity generated |
| Number of unique tippers (wallets) | Breadth of adoption, not just whale activity |
| Number of unique recipients | Creator-side adoption and retention |
| Tip completion rate (started → confirmed) | UX/conversion health of the core flow |
| Median time-to-confirm | Proxy for whether the "3-second rule" UX promise holds up |
| % of tips via Smart Wallet vs. EOA wallets | Adoption signal for Base's smart wallet stack specifically |
| Repeat-tip rate (7-day, 30-day) | Whether the app creates habitual, not one-off, usage |
| Shares generated per 100 tips | Organic distribution / K-factor |
| Platform fee revenue | Sustainability — proof the product can run without ongoing grants |

## 3-month roadmap

**Month 1 — Ship & instrument**
- Launch on Base Mainnet with account association live in Warpcast
- Add per-profile recipient resolution (tip *any* FID, not a single fixed
  wallet) via Farcaster's identity APIs
- Wire up basic analytics (tip volume, completion funnel, wallet type mix)
- Submit to the Farcaster Mini App directory and Base's app discovery
  surfaces

**Month 2 — Retention & discovery**
- Push notifications via the webhook stub already scaffolded
  (`app/api/webhook/route.ts`) — notify creators the moment they're tipped
- Add a public tip leaderboard / creator profile page to surface social
  proof and drive repeat visits
- Support tipping directly from a cast action (Farcaster "cast actions"),
  reducing the flow from "open Mini App" to a single tap from the feed
- A/B test preset tip amounts and hero copy against completion rate

**Month 3 — Expand the primitive**
- Add batch/split tipping (tip multiple recipients — e.g. a whole thread —
  in one transaction)
- Introduce recurring/subscription tips for consistent creator income
- Publish an open template so other builders can fork the fee-split tipping
  primitive for adjacent use cases (paid unlocks, bounty payouts)
- Case study + metrics writeup for the Base ecosystem

## How grant money will be used

- **Engineering time** — implementing per-FID recipient resolution, cast
  actions integration, and the notification/retention loop above (largest
  allocation)
- **Design** — a proper brand identity and custom art (replacing the
  placeholder icon/splash/OG assets shipped in this repo) ahead of
  directory submission
- **Security review** — a focused audit of the batched-transfer flow and
  fee-split logic before scaling volume
- **Growth experiments** — small paid pushes (Farcaster ads / creator
  partnerships) to seed the first cohort of tippers and measure real
  conversion, funding the metrics in the table above
- **Infrastructure** — RPC/indexing costs as tip volume and notification
  volume scale beyond hobby-tier limits

## Competitive advantage

- **Native to the feed, not adjacent to it.** As a Mini App, BaseFarCaster
  opens inline inside Farcaster clients — no browser hand-off, no cold
  wallet connect. Competing tipping tools that live as external web apps
  lose the majority of their funnel at the click-through step.
- **USDC-first by design**, not token-first. This removes the two biggest
  objections creators have to onchain tips: price volatility and the
  awkwardness of promoting a token they didn't choose.
- **Batched, one-confirmation fee split.** The 10%-platform-fee model is
  usually implemented as two separate transactions (annoying UX) or
  handled off-chain (defeats the point). BaseFarCaster batches both legs
  into a single wallet confirmation via EIP-5792, which is only smooth on
  chains with mature smart wallet support — Base is the natural home for
  this specific pattern.
- **Wallet-agnostic from day one.** Base Smart Wallet, Coinbase Wallet, the
  Farcaster wallet, MetaMask, and Rainbow are all supported out of the box,
  so the app doesn't force a wallet choice on either side of a tip.

## Suggested grant amount & justification

**$15,000 – $25,000**, structured as an initial builder grant with a
milestone-based second tranche.

- The core product is already built and functional (this repository) — the
  ask isn't for prototype development, it's for the retention, discovery,
  and security work in the roadmap above that turns a working demo into a
  durable payment habit on Base.
- This range is proportionate to a 3-month, single-builder-plus-design
  scope (roughly one engineer + fractional design/security support) rather
  than a multi-person team ramp.
- Suggested structure: **60% at grant approval** to fund Month 1–2
  engineering and design, **40% released against the Month 3 milestones**
  (cast actions live, notification loop live, published metrics) — so the
  grant is tied to shipped, measurable outcomes rather than time elapsed.
