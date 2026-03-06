# reserve.org — Claude Code Instructions

## Project Overview
Static Next.js (App Router) site for the Reserve protocol. Deployed as a static export (`output: "export"`). Contains multiple A/B test variants of governance flows (gov-v1, gov-v2, gov-v3). This is a sandbox environment built built by a designer to test new features and layouts. Not meant for production, but will be built locally, and displayed through github pages which requires teh static export. 

## Commands
- `npm run dev` — dev server at http://localhost:3000
- `npm run build` — static export to `/out`
- `npm run lint` — ESLint

## Code Style
- **Inline styles only** — no Tailwind utility classes, no CSS modules
- Font: `'TWK Lausanne', system-ui, sans-serif` (constant: `const FONT = "'TWK Lausanne', system-ui, sans-serif"`)
- Brand blue: `#0151af`
- Cream page bg: `#ede4d3`
- Cream card outer: `#f9eddd`
- Divider/border: `#e5e5e5` (inside cards), `#f0ece6` (structural)
- Dark text: `#0a0d10`
- Muted text: `#666666`
- Max-width on all content wrappers: `1400px`

## Component Conventions
- **Always use `DecorativeTable` for section cards** (`@/components/DecorativeTable`)
  - Props: `title`, optional `onBack`, optional `headerRight`, `children`
  - Handles cream outer bg, white inner card, rounded corners
  - Never build custom card wrappers
- Icons: `lucide-react`

## File Structure Pattern
- `app/[route]/layout.tsx` — layout shell
- `app/[route]/page.tsx` — thin wrapper, imports and renders the client component
- `app/[route]/SomeClient.tsx` — actual implementation with `"use client"` at top
- Dynamic routes `[id]` require `generateStaticParams()` and `<Suspense>` wrappers

## Governance Flows (A/B Test Variants)
Three intentionally different versions of the same governance UI:
- `app/gov-v1/` — standalone governance (no [id] route)
- `app/gov-v2/[id]/governance/` — per-DTF governance (dynamic route)
- `app/gov-v3/` — standalone governance variant (mirrors gov-v1)


## Static Export Constraints
- No server-side rendering, no API routes
- All `[id]` dynamic routes require `generateStaticParams()`
- Images must use `unoptimized: true` (already set in next.config.ts)
- No `useSearchParams()` without a `<Suspense>` boundary

## Do Not
- Add Tailwind classes to JSX
- Create CSS module files
- Use `next/image` optimization features
- Add new libraries without asking first
- Auto-commit changes
