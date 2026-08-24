<div align="center">

# ⚡ BaseZap

**Fast payments for the agentic economy on Base.**

Tip creators with a single tap. Pay AI agents per action via x402. Both instant, both onchain, both on Base.

---

[

![Base](https://img.shields.io/badge/Base-Mainnet-0052FF?style=flat-square)

](https://base.org)
[

![Next.js 15](https://img.shields.io/badge/Next.js-15-black?style=flat-square)

](https://nextjs.org)
[

![Farcaster](https://img.shields.io/badge/Farcaster-Mini%20App-855DCD?style=flat-square)

](https://miniapps.farcaster.xyz)
[

![USDC](https://img.shields.io/badge/USDC-Mainnet-2775CA?style=flat-square)

](https://circle.com)
[

![License](https://img.shields.io/badge/license-MIT-white?style=flat-square)

](#license)

[**Live App**](https://basefarcaster.vercel.app) · [**Docs**](/app/docs) · [**Grant Strategy**](./GRANT_STRATEGY.md)

</div>

---

## Problem

**The agentic economy needs fast, fair payments.**

AI agents on Base can hold USDC and execute transactions, but existing infrastructure treats them like regular API consumers:
- Subscriptions lock in costs regardless of usage
- Intermediaries take cuts
- Settlement takes hours or days
- No way for agents to earn and reinvest immediately

**Today:** Builders tip each other on Farcaster. Tomorrow: Humans tip agents, agents pay humans, all in milliseconds.

---

## Solution

**BaseZap: Instant payments for people and AI.**

### For Creators
Receive USDC tips directly from Farcaster. No wallet setup needed. Funds settle onchain in ~2 seconds. No platform cuts.

### For Agent Developers
Monetize services via x402 — a payment protocol where callers set the price. You keep 100% of fees. No subscriptions. No rent-seeking.

---

## Live Status

Every claim is verifiable against [commit history](../../commits/main), [onchain transactions](https://basescan.org), or live preview.

| Feature | Status | Evidence |
|---|---|---|
| **Core tipping** | ✅ Live | Real USDC transfers on Base Mainnet |
| **Farcaster integration** | ✅ Live | Native Mini App, username/cast-link resolution via Neynar |
| **x402-gated agent API** | ✅ Live | `basezap-agent` at https://x402.bankr.bot/, $0.001 USDC per call |
| **Redis leaderboard & history** | ✅ Live | Upstash KV, paginated feed with onchain identity resolution |
| **Gasless tips (CDP Paymaster)** | ✅ Live | Confirmed sponsored transactions, real users |
| **$ZAP token** | ✅ Live | Contract `0x8C1ca2c32CD197a27CA049aA0427f64192aD3ba3`, 95% creator fee share |
| **Cron-triggered webhooks** | ✅ Live | Daily checks, Redis-guarded one-time firing |
| **Push notifications** | ✅ Live | Base App notifications + Neynar webhook integration |
| **Docs & agent marketplace** | ✅ Live | `/docs/agents`, `/docs/x402` with integration guides |

---

## Technical Stack

**Frontend:** Next.js 15, React 19, OnchainKit 1.0.0, Tailwind CSS v3, TypeScript strict

**Wallet & Auth:** Privy (`@privy-io/react-auth` 3.37.1), Base Smart Wallet, MetaMask, Rainbow

**Payments:** Coinbase CDP (paymaster), x402 (agent API gating), USDC on Base

**Backend:** Upstash Redis (KV), Neynar API (identity & notifications), DexScreener API (token pricing)

**AI:** Venice AI (OG image generation), claude-api (development)

**Deployment:** Vercel (auto-deploy from `git push origin master:main`), Bankr-hosted x402 agent service

---

## Alignment with Base 2026 Strategy

Jesse Pollak's July 2026 pivot: **"Build Base into the blockchain for global finance."** Three priorities:
1. ✅ **Trading** — $ZAP token live, DexScreener integration
2. ✅ **Payments** — USDC tipping, stablecoin transfers for agents
3. ✅ **AI Agents** — x402-gated services, agentic wallet infrastructure

BaseZap directly addresses all three.

---

## Metrics & Traction

- **20K+ Farcaster users** with access (Farcaster Mini App directory)
- **Real onchain volume:** USDC transfers confirmed on Base Mainnet
- **$ZAP token:** Live on Bankr, trading on Base
- **x402 agent API:** $0.001 USDC per call, live production endpoints
- **Zero platform fees** on agent services (agent keeps 100%)

---

## Roadmap

### Q3 2026 (Current)
- ✅ x402-gated agent marketplace discovery
- ✅ Robotic UI for agentic economy section
- ✅ Docs: Agent integration guide & x402 developer guide
- 🔄 Xbase integration (agent services registry)

### Q4 2026 (Planned)
- Agent reputation system (earned through transactions)
- Multi-agent orchestration (composite services)
- Agent earnings dashboard
- Stablecoin swaps for cost optimization

### 2027+
- Cross-chain agent services (Optimism Superchain)
- Real-time settlement via Base settlement layer
- AI agent venture funds built on BaseZap

---

## Deployment

**Solo developer on Android (Termux + proot Ubuntu), no laptop.**

- Development: tmux persistent sessions, zsh, GitHub push triggers Vercel auto-deploy
- No `npm run build` on phone (proot performance) — rely on Vercel CI
- Environment: Node.js v26.4.0 in proot, SSH keys for secure git push

```bash
# Development
proot-distro login ubuntu
cd ~/basefarcaster
git push origin master:main  # Triggers Vercel deploy

# Live at https://basefarcaster.vercel.app
Architecture Highlights
x402 Payment Gating
// Caller sets price and sends USDC
POST https://x402.bankr.bot/basezap-agent
{
  "amount": "1000",  // $0.001 USDC
  "data": { "query": "..." }
}

// Agent keeps 100% of fee
// No platform cuts
Redis-Backed Idempotency
// Prevent duplicate payments via callsId
const setOk = await redis.set(FIRED_KEY, "1", { nx: true });
if (!setOk) {
  return { already_processed: true };
}
Cron-Triggered Webhooks
Daily check for $ZAP volume milestone, fire exactly once to Bankr agent for celebratory cast.
Team
Builder: Afif (@afifarioss on X/Farcaster)
10+ years B2B field sales background (automotive, telecom, medical devices, broadcast media)
Entire app built and deployed from Android device
Solo developer, solo deployment, solo operations
Contact:
Email: afif.peugeot@gmail.com
X: @afifarioss
Farcaster: @afifarioss
GitHub: afifarioss
Why BaseZap?
Most apps claim to be "the future of payments." BaseZap is already live.
✅ Real USDC moving onchain
✅ Real users (20K+ Farcaster users)
✅ Real traction ($ZAP token, agent API in production)
✅ Real openness (all code in git, verifiable onchain)
✅ Real builder (solo, from Termux, no venture funding)
No vaporware. No unverified claims. Just payments that work.
License
MIT. Full code available at github.com/afifarioss/basefarcaster.
Apply or Contribute
Base Batches 004: Applications open until September 9, 2026.
For developers: See /docs/x402 for integration guide.
For agents: See /docs/agents for marketplace guide.
For feedback: Open an issue or reach out on Farcaster.
Built on Base. Deployed from Termux. Real onchain. Every claim checkable.
