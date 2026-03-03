# reserve.org

A UI prototype for the [Reserve Protocol](https://reserve.org) platform, built with Next.js. This app explores the DTF (Diversified Token Fund) discovery and governance experience.

## Overview

The app covers three main areas:

- **Discover DTFs** — Browse and filter available Index DTFs by category (crypto, RWA, stocks, commodities)
- **Participate & Earn** — Three sub-views for Index DTF governance (vote-locking RSR), Yield DTF staking, and DeFi liquidity pools
- **DTF Detail** — Per-DTF pages with tabs for overview, auctions, details, governance proposals, and minting

## Stack

- [Next.js 16](https://nextjs.org) (App Router)
- [React 19](https://react.dev)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Recharts](https://recharts.org) — TVL area chart
- [Lucide React](https://lucide.dev) — icons

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
app/
  page.tsx                          # Home — DTF discovery (Navbar + Hero + Category selector + DTF table)
  layout.tsx                        # Root layout + metadata
  globals.css                       # Global styles
  earn/
    index-dtf/
      page.tsx                      # Earn hub (Index DTF governance / Yield staking / DeFi yield tabs)
      [id]/
        layout.tsx                  # DTF detail shell with sidebar nav
        page.tsx                    # DTF overview
        DtfDetailClient.tsx         # Main detail content
        DtfSidebar.tsx              # Sidebar with DTF nav links
        auctions/page.tsx           # Auctions tab
        details/page.tsx            # Details tab
        mint/page.tsx               # Mint tab
        governance/
          page.tsx                  # Governance proposal list
          GovernanceClient.tsx
          proposal/[proposalId]/    # Individual proposal detail
          propose/                  # Create new proposal flow
            page.tsx
            ProposeClient.tsx
            dtf-settings/           # DTF settings proposal type
              page.tsx
              DtfSettingsProposalClient.tsx
              confirm/              # Confirmation step
components/
  Navbar.tsx                        # Sticky top nav with route-aware active states
  HeroSection.tsx                   # TVL hero with chart
  TvlChart.tsx                      # Recharts area chart (lazy-loaded)
  CategorySelector.tsx              # Index / Yield / Currencies / All filter tabs
  DtfTable.tsx                      # Main DTF listing table
  DecorativeTable.tsx               # Static decorative table used in hero
  ProposalCategory.tsx              # Proposal category card component
  ProposalTypeMenu.tsx              # Dropdown menu for proposal type selection
```

## Key Concepts

**DTF (Diversified Token Fund)** — A permissionless, on-chain index token backed by a basket of assets. Governed by RSR stakers who vote-lock their tokens to earn a share of protocol fees.

**RSR / vlRSR** — RSR is the Reserve Rights token. Staking RSR into a DTF's governance contract mints vlRSR (vote-locked RSR), which grants voting rights and fee revenue.

**Governance flow** — `Propose` → `Discuss` → `Vote` → `Queue` → `Execute`. Proposals can change DTF settings (fees, collateral weights, etc.).

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server at localhost:3000 |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | Run ESLint |
