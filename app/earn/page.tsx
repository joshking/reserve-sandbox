"use client"

import { useState } from "react"
import Navbar from "@/components/Navbar"
import {
  Search, ChevronDown, ChevronUp, ShieldCheck, LockKeyholeOpen,
  Coins, Lock, ArrowUpRight, ArrowRight, ArrowDown, AlertTriangle,
  Zap, HelpCircle,
} from "lucide-react"

const FONT = "'TWK Lausanne', system-ui, sans-serif"
const BLUE = "#0151af"
const CREAM = "#f9eddd"

const CHAIN_COLORS: Record<string, string> = {
  ETH: "#627eea",
  Base: "#0052ff",
  Solana: "#9945ff",
  Binance: "#f0b90b",
}

const DEFI_PROJECT_COLORS: Record<string, string> = {
  "Aerodrome": "#ff1744",
  "Aerodrome Slipstream": "#ff1744",
  "Uniswap": "#ff007a",
  "Beefy": "#1bc870",
  "Convex": "#3a3a5c",
  "Yearn": "#0066ff",
}

const TOKEN_COLORS: Record<string, string> = {
  RSR: "#0151af",
  ALT: "#e87d3e",
}

// ── Index DTF Governance data ──────────────────────────────────────────────────

type VoteLockEntry = {
  ticker: string
  chain: "ETH" | "Base" | "Solana"
  vlToken: string
  tvlUsd: string
  tvlToken: string
  locked: boolean
  lockedAmount?: string
  totalStaked: string
  governs: string
  apy: string
}

const indexEntries: VoteLockEntry[] = [
  { ticker: "RSR", chain: "ETH",  vlToken: "vlRSR-AI", tvlUsd: "$189,933", tvlToken: "56.6M RSR", locked: false, totalStaked: "56.6M RSR", governs: "VTF", apy: "10.34%" },
  { ticker: "RSR", chain: "Base", vlToken: "vlRSR-AI", tvlUsd: "$189,933", tvlToken: "56.6M RSR", locked: true,  lockedAmount: "1.34M RSR", totalStaked: "56.6M RSR", governs: "CLX", apy: "4.75%" },
  { ticker: "ALT", chain: "Base", vlToken: "vlRSR-AI", tvlUsd: "$189,933", tvlToken: "56.6M RSR", locked: false, totalStaked: "56.6M RSR", governs: "VTF", apy: "10.34%" },
  { ticker: "RSR", chain: "ETH",  vlToken: "vlRSR-AI", tvlUsd: "$189,933", tvlToken: "56.6M RSR", locked: false, totalStaked: "56.6M RSR", governs: "VTF", apy: "10.34%" },
  { ticker: "RSR", chain: "ETH",  vlToken: "vlRSR-AI", tvlUsd: "$189,933", tvlToken: "56.6M RSR", locked: false, totalStaked: "56.6M RSR", governs: "VTF", apy: "10.34%" },
  { ticker: "RSR", chain: "Base", vlToken: "vlRSR-AI", tvlUsd: "$189,933", tvlToken: "56.6M RSR", locked: true,  lockedAmount: "1.34M RSR", totalStaked: "56.6M RSR", governs: "CLX", apy: "4.75%" },
  { ticker: "RSR", chain: "ETH",  vlToken: "vlRSR-AI", tvlUsd: "$189,933", tvlToken: "56.6M RSR", locked: false, totalStaked: "56.6M RSR", governs: "VTF", apy: "10.34%" },
  { ticker: "RSR", chain: "ETH",  vlToken: "vlRSR-AI", tvlUsd: "$189,933", tvlToken: "56.6M RSR", locked: false, totalStaked: "56.6M RSR", governs: "VTF", apy: "10.34%" },
]

// ── Yield DTF Staking data ─────────────────────────────────────────────────────

type YieldEntry = {
  chain: "ETH" | "Base"
  stToken: string
  tvlUsd: string
  tvlToken: string
  staked: boolean
  stakedUsd?: string
  stakedToken?: string
  governs: string
  governsColor: string
  apy: string
}

const yieldEntries: YieldEntry[] = [
  { chain: "ETH",  stToken: "maatRSR",    tvlUsd: "$1,225",       tvlToken: "748.6K RSR",      staked: false,                                                  governs: "MAAT",   governsColor: "#f59e0b", apy: "27.96%" },
  { chain: "ETH",  stToken: "eth+RSR",    tvlUsd: "$1,456,509",   tvlToken: "890.1M RSR",      staked: true,  stakedUsd: "$27.42",    stakedToken: "16,759.27 eth+RSR",  governs: "ETH+",   governsColor: "#627eea", apy: "6.77%" },
  { chain: "ETH",  stToken: "eusdRSR",    tvlUsd: "$4,503,540",   tvlToken: "2.8B RSR",        staked: false,                                                  governs: "eUSD",   governsColor: "#22c55e", apy: "6.5%" },
  { chain: "Base", stToken: "bsdethRSR",  tvlUsd: "$227,395",     tvlToken: "139.0M RSR",      staked: true,  stakedUsd: "$14.62",    stakedToken: "8,937.41 bsdethRSR", governs: "bsdETH", governsColor: "#3b82f6", apy: "3.53%" },
  { chain: "Base", stToken: "bsdxRSR",   tvlUsd: "$247",          tvlToken: "150.9K RSR",      staked: false,                                                  governs: "BSDX",   governsColor: "#16a34a", apy: "3.42%" },
  { chain: "ETH",  stToken: "usd3RSR",   tvlUsd: "$825,271",      tvlToken: "504.4M RSR",      staked: false,                                                  governs: "USD3",   governsColor: "#22c55e", apy: "3.41%" },
  { chain: "Base", stToken: "vayaRSR",   tvlUsd: "$149",          tvlToken: "90.8K RSR",       staked: false,                                                  governs: "Vaya",   governsColor: "#4ade80", apy: "3.32%" },
]

// ── DeFi Yield data ────────────────────────────────────────────────────────────

const featuredDefiCards = [
  { apy: "80.15%", desc: "w. LCAP & WETH in Aerodrome", token0: "LCA", token0Color: "#1a3a6e", token1: "ETH", token1Color: "#627eea" },
  { apy: "56.14%", desc: "w. LCAP & USDC in Aerodrome", token0: "LCA", token0Color: "#1a3a6e", token1: "USD", token1Color: "#2775ca" },
  { apy: "28.51%", desc: "w. WETH & RSR in Aerodrome",  token0: "ETH", token0Color: "#627eea", token1: "RSR", token1Color: "#0151af" },
]

type DefiEntry = {
  pool: string
  token0: string; token0Color: string
  token1: string; token1Color: string
  project: string
  chain: "ETH" | "Base" | "Binance"
  apy: string; baseApy: string; rewardApy: string; tvl: string
  assetType: "stables" | "eth" | "rsr" | "other"
}

const defiEntries: DefiEntry[] = [
  { pool: "LCAP-USOL", token0: "LCA", token0Color: "#1a3a6e", token1: "USO", token1Color: "#22c55e", project: "Aerodrome Slipstream", chain: "Base",    apy: "80.1%", baseApy: "34.4%", rewardApy: "45.7%", tvl: "$11,231",   assetType: "stables" },
  { pool: "LCAP-USDC", token0: "LCA", token0Color: "#1a3a6e", token1: "USD", token1Color: "#2775ca", project: "Aerodrome Slipstream", chain: "Base",    apy: "56.1%", baseApy: "13.7%", rewardApy: "42.4%", tvl: "$153,866", assetType: "stables" },
  { pool: "RSR-WETH",  token0: "RSR", token0Color: "#0151af", token1: "ETH", token1Color: "#627eea", project: "Uniswap",              chain: "ETH",     apy: "38.0%", baseApy: "38.0%", rewardApy: "0.0%",  tvl: "$131,996", assetType: "rsr" },
  { pool: "WETH-RSR",  token0: "ETH", token0Color: "#627eea", token1: "RSR", token1Color: "#0151af", project: "Aerodrome",            chain: "Base",    apy: "28.5%", baseApy: "0.0%",  rewardApy: "28.5%", tvl: "$19,112",  assetType: "rsr" },
  { pool: "LCAP-EUSD", token0: "LCA", token0Color: "#1a3a6e", token1: "eUS", token1Color: "#16a34a", project: "Beefy",               chain: "Base",    apy: "24.3%", baseApy: "0.0%",  rewardApy: "0.0%",  tvl: "$31,497",  assetType: "stables" },
]

// ── FAQ data ───────────────────────────────────────────────────────────────────

const faqItems = [
  {
    q: "What is vote-locking and how do I do it?",
    a: "Vote-locking commits tokens to a specific Index DTF to gain voting power over how that DTF operates. \n\nThrough token-weighted voting, lockers can weigh in on decisions like:\n• Which tokens the index includes\n• How tokens are weighted and/or rebalanced\n• Which fees are charged\n• Who can propose and/or veto changes",
    defaultOpen: true,
  },
  { q: "How do I earn rewards?", a: "You earn a pro-rata share of the DTF's fees (minting + TVL fees) based on how much and how long you lock. Rewards accrue automatically and can be claimed anytime in the app.", defaultOpen: false },
  { q: "Do I need to vote on proposals to earn rewards?", a: "No — rewards are earned just for locking. But voting on proposals (like rebalancing the basket) keeps your influence active and supports the DTF's growth.", defaultOpen: false },
  { q: "Can I unlock my tokens at any time?", a: "No, locked tokens follow the DTF's timelock rules (set during creation). Check the lock duration before committing. Early unlock is not allowed to prevent short-term manipulation.", defaultOpen: false },
]

// ── Sub-components ─────────────────────────────────────────────────────────────

function TokenIcon({ ticker, chain }: { ticker: string; chain: string }) {
  return (
    <div style={{ position: "relative", flexShrink: 0 }}>
      <div style={{
        width: 32, height: 32, borderRadius: "50%",
        background: TOKEN_COLORS[ticker] ?? "#888",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "9px", fontWeight: 700, color: "white", fontFamily: FONT, letterSpacing: "0.02em",
      }}>
        {ticker.slice(0, 3)}
      </div>
      <div style={{
        position: "absolute", bottom: -1, right: -1,
        width: 12, height: 12, borderRadius: "50%",
        background: CHAIN_COLORS[chain] ?? "#888",
        border: "1.5px solid white",
      }} />
    </div>
  )
}

function IndexTableRow({ entry, isLast }: { entry: VoteLockEntry; isLast: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", padding: "16px", borderBottom: isLast ? "none" : "1px solid #e5e5e5" }}>
      {/* Gov. Token */}
      <div style={{ width: 220, display: "flex", gap: 8, alignItems: "center" }}>
        <TokenIcon ticker={entry.ticker} chain={entry.chain} />
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ fontSize: 16, fontWeight: 500, color: "#000", fontFamily: FONT, lineHeight: 1.25 }}>{entry.ticker}</span>
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            <ArrowRight size={12} color="#666" />
            <span style={{ fontSize: 16, fontWeight: 300, color: "#666", fontFamily: FONT, lineHeight: "17px" }}>{entry.vlToken}</span>
          </div>
        </div>
      </div>
      {/* TVL */}
      <div style={{ width: 160, display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ fontSize: 16, fontWeight: 300, color: "#000", fontFamily: FONT, lineHeight: "17px" }}>{entry.tvlUsd}</span>
        <span style={{ fontSize: 16, fontWeight: 300, color: "#666", fontFamily: FONT, lineHeight: "17px" }}>{entry.tvlToken}</span>
      </div>
      {/* Vote-locked */}
      <div style={{ flex: 1, display: "flex", gap: 8, alignItems: "center" }}>
        {entry.locked ? (
          <>
            <Lock size={24} color="#666" />
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: 14, fontWeight: 300, color: BLUE, fontFamily: FONT, lineHeight: "18px" }}>{entry.lockedAmount}</span>
              <span style={{ fontSize: 16, fontWeight: 300, color: "#666", fontFamily: FONT, lineHeight: "17px" }}>{entry.totalStaked}</span>
            </div>
          </>
        ) : (
          <>
            <LockKeyholeOpen size={24} color="#666" />
            <span style={{ fontSize: 16, fontWeight: 300, color: "#666", fontFamily: FONT, lineHeight: "17px" }}>No</span>
          </>
        )}
      </div>
      {/* Governs */}
      <div style={{ width: 180 }}>
        <span style={{ fontSize: 16, fontWeight: 300, color: "#666", fontFamily: FONT, lineHeight: "17px" }}>{entry.governs}</span>
      </div>
      {/* APY */}
      <div style={{ width: 160, display: "flex", gap: 8, alignItems: "center", justifyContent: "flex-end" }}>
        <span style={{ fontSize: 16, fontWeight: 500, color: BLUE, fontFamily: FONT, lineHeight: 1.25, whiteSpace: "nowrap" }}>{entry.apy} APY</span>
        <ArrowUpRight size={16} color={BLUE} />
      </div>
    </div>
  )
}

function YieldTableRow({ entry, isLast }: { entry: YieldEntry; isLast: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", padding: "16px", borderBottom: isLast ? "none" : "1px solid #e5e5e5" }}>
      {/* Gov. Token */}
      <div style={{ width: 220, display: "flex", gap: 8, alignItems: "center" }}>
        <TokenIcon ticker="RSR" chain={entry.chain} />
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ fontSize: 16, fontWeight: 500, color: "#000", fontFamily: FONT, lineHeight: 1.25 }}>RSR</span>
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            <ArrowRight size={12} color="#666" />
            <span style={{ fontSize: 16, fontWeight: 300, color: "#666", fontFamily: FONT, lineHeight: "17px" }}>{entry.stToken}</span>
          </div>
        </div>
      </div>
      {/* TVL */}
      <div style={{ width: 160, display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ fontSize: 16, fontWeight: 300, color: "#000", fontFamily: FONT, lineHeight: "17px" }}>{entry.tvlUsd}</span>
        <span style={{ fontSize: 16, fontWeight: 300, color: "#666", fontFamily: FONT, lineHeight: "17px" }}>{entry.tvlToken}</span>
      </div>
      {/* Staked */}
      <div style={{ flex: 1, display: "flex", gap: 8, alignItems: "center" }}>
        {entry.staked ? (
          <>
            <Lock size={20} color="#666" />
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: 14, fontWeight: 300, color: BLUE, fontFamily: FONT, lineHeight: "18px" }}>{entry.stakedUsd}</span>
              <span style={{ fontSize: 14, fontWeight: 300, color: "#666", fontFamily: FONT, lineHeight: "17px" }}>{entry.stakedToken}</span>
            </div>
          </>
        ) : (
          <>
            <LockKeyholeOpen size={20} color="#aaa" />
            <span style={{ fontSize: 16, fontWeight: 300, color: "#aaa", fontFamily: FONT, lineHeight: "17px" }}>No</span>
          </>
        )}
      </div>
      {/* Governs */}
      <div style={{ width: 180, display: "flex", gap: 8, alignItems: "center" }}>
        <div style={{
          width: 20, height: 20, borderRadius: "50%",
          background: entry.governsColor,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "8px", fontWeight: 700, color: "white", fontFamily: FONT, flexShrink: 0,
        }}>
          {entry.governs.slice(0, 1)}
        </div>
        <span style={{ fontSize: 16, fontWeight: 300, color: "#000", fontFamily: FONT, lineHeight: "17px" }}>{entry.governs}</span>
      </div>
      {/* APY */}
      <div style={{ width: 160, display: "flex", gap: 8, alignItems: "center", justifyContent: "flex-end" }}>
        <span style={{ fontSize: 16, fontWeight: 500, color: BLUE, fontFamily: FONT, lineHeight: 1.25, whiteSpace: "nowrap" }}>{entry.apy} APY</span>
        <ArrowRight size={16} color={BLUE} />
      </div>
    </div>
  )
}

function FaqItem({ q, a, defaultOpen = false }: { q: string; a: string | null; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          width: "100%", padding: "24px",
          background: open ? CREAM : "transparent",
          border: "1px solid #e5e5e5",
          cursor: "pointer", textAlign: "left",
        }}
      >
        <span style={{ fontSize: 26, fontWeight: 700, color: BLUE, fontFamily: FONT, lineHeight: "30px" }}>{q}</span>
        {open ? <ChevronUp size={32} color="#0a0d10" /> : <ChevronDown size={32} color="#0a0d10" />}
      </button>
      {open && a && (
        <div style={{ background: CREAM, border: "1px solid #e5e5e5", padding: "24px" }}>
          <p style={{ fontSize: 18, fontWeight: 300, color: BLUE, fontFamily: FONT, lineHeight: "26px", whiteSpace: "pre-wrap", margin: 0 }}>{a}</p>
        </div>
      )}
    </div>
  )
}

function DefiTokenPair({ token0, token0Color, token1, token1Color }: { token0: string; token0Color: string; token1: string; token1Color: string }) {
  return (
    <div style={{ position: "relative", width: 44, height: 28, flexShrink: 0 }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 28, height: 28, borderRadius: "50%", background: token0Color, border: "2px solid white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 700, color: "white", fontFamily: FONT }}>
        {token0}
      </div>
      <div style={{ position: "absolute", left: 16, top: 0, width: 28, height: 28, borderRadius: "50%", background: token1Color, border: "2px solid white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 700, color: "white", fontFamily: FONT }}>
        {token1}
      </div>
    </div>
  )
}

function FeaturedCard({ card }: { card: typeof featuredDefiCards[0] }) {
  return (
    <div style={{ flex: 1, background: CREAM, borderRadius: 16, padding: "20px 24px", display: "flex", gap: 16, alignItems: "center", minWidth: 0 }}>
      <div style={{ width: 80, height: 80, borderRadius: 12, background: "rgba(0,0,0,0.05)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <DefiTokenPair token0={card.token0} token0Color={card.token0Color} token1={card.token1} token1Color={card.token1Color} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 12, fontWeight: 300, color: "#666", fontFamily: FONT, margin: "0 0 2px 0" }}>Earn up to</p>
        <p style={{ fontSize: 22, fontWeight: 700, color: BLUE, fontFamily: FONT, margin: "0 0 2px 0", lineHeight: 1.2 }}>
          {card.apy} <span style={{ fontSize: 15, fontWeight: 500 }}>APY</span>
        </p>
        <p style={{ fontSize: 13, fontWeight: 300, color: "#666", fontFamily: FONT, margin: "0 0 12px 0" }}>{card.desc}</p>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button style={{ background: BLUE, color: "white", border: "none", borderRadius: 8, padding: "6px 16px", fontSize: 13, fontWeight: 500, fontFamily: FONT, cursor: "pointer" }}>
            View
          </button>
          <div style={{ width: 28, height: 28, borderRadius: "50%", border: "1px solid #e5e5e5", background: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ArrowUpRight size={14} color="#666" />
          </div>
        </div>
      </div>
    </div>
  )
}

function DefiTableRow({ entry, isLast }: { entry: DefiEntry; isLast: boolean }) {
  const chainLabel = entry.chain === "ETH" ? "Ethereum" : entry.chain
  return (
    <div style={{ display: "flex", alignItems: "center", padding: "14px 0", borderBottom: isLast ? "none" : "1px solid #f0f0f0" }}>
      <div style={{ flex: 2, display: "flex", gap: 10, alignItems: "center" }}>
        <DefiTokenPair token0={entry.token0} token0Color={entry.token0Color} token1={entry.token1} token1Color={entry.token1Color} />
        <a href="#" style={{ fontSize: 15, fontWeight: 500, color: BLUE, fontFamily: FONT, textDecoration: "underline", whiteSpace: "nowrap" }}>{entry.pool}</a>
      </div>
      <div style={{ flex: 2, display: "flex", gap: 8, alignItems: "center" }}>
        <div style={{ width: 20, height: 20, borderRadius: "50%", background: DEFI_PROJECT_COLORS[entry.project] ?? "#888", flexShrink: 0 }} />
        <span style={{ fontSize: 15, fontWeight: 300, color: "#000", fontFamily: FONT }}>{entry.project}</span>
      </div>
      <div style={{ flex: 1, display: "flex", gap: 6, alignItems: "center" }}>
        <div style={{ width: 16, height: 16, borderRadius: "50%", background: CHAIN_COLORS[entry.chain] ?? "#888", flexShrink: 0 }} />
        <span style={{ fontSize: 15, fontWeight: 300, color: "#000", fontFamily: FONT }}>{chainLabel}</span>
      </div>
      <div style={{ flex: 1, textAlign: "right" }}>
        <span style={{ fontSize: 15, fontWeight: 300, color: "#000", fontFamily: FONT }}>{entry.apy}</span>
      </div>
      <div style={{ flex: 1, textAlign: "right" }}>
        <span style={{ fontSize: 15, fontWeight: 300, color: "#000", fontFamily: FONT }}>{entry.baseApy}</span>
      </div>
      <div style={{ flex: 1, textAlign: "right" }}>
        <span style={{ fontSize: 15, fontWeight: 300, color: "#000", fontFamily: FONT }}>{entry.rewardApy}</span>
      </div>
      <div style={{ flex: 1, textAlign: "right" }}>
        <span style={{ fontSize: 15, fontWeight: 300, color: "#000", fontFamily: FONT }}>{entry.tvl}</span>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function EarnPage() {
  const [activeTab, setActiveTab] = useState("index-dtf")
  const [search, setSearch] = useState("")
  const [yieldChain, setYieldChain] = useState<"all" | "ETH" | "Base">("all")
  const [defiAsset, setDefiAsset] = useState<"all" | "stables" | "eth" | "rsr">("all")
  const [defiChain, setDefiChain] = useState<"all" | "ETH" | "Base" | "Binance">("all")

  const isYield = activeTab === "yield-dtf"
  const isDefi = activeTab === "defi-yield"

  const filteredYield = yieldEntries.filter((e) => {
    if (yieldChain !== "all" && e.chain !== yieldChain) return false
    if (search && !e.stToken.toLowerCase().includes(search.toLowerCase()) && !e.governs.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const filteredDefi = defiEntries.filter((e) => {
    if (defiChain !== "all" && e.chain !== defiChain) return false
    if (defiAsset !== "all" && e.assetType !== defiAsset) return false
    if (search && !e.pool.toLowerCase().includes(search.toLowerCase()) && !e.project.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div style={{ minHeight: "100vh", background: "#fefbf8" }}>
      <Navbar />
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40, padding: "48px 72px" }}>

          {/* Tab group */}
          <div style={{ background: "#f2f2f2", borderRadius: 50, padding: 2, display: "flex", alignItems: "center" }}>
            {[
              { id: "index-dtf", label: "Index DTF Governance" },
              { id: "yield-dtf", label: "Yield DTF Staking" },
              { id: "defi-yield", label: "DeFi Yield" },
            ].map(({ id, label }) => {
              const isActive = activeTab === id
              return (
                <button
                  key={id}
                  onClick={() => { setActiveTab(id); setSearch("") }}
                  style={{
                    padding: "8px 12px", borderRadius: 48, border: "none",
                    background: isActive ? "white" : "transparent",
                    boxShadow: isActive ? "0px 1px 8px 2px rgba(0,0,0,0.05)" : "none",
                    fontSize: 16, fontWeight: 300,
                    color: isActive ? BLUE : "#666",
                    fontFamily: FONT, lineHeight: "18px",
                    cursor: "pointer", whiteSpace: "nowrap",
                  }}
                >
                  {label}
                </button>
              )
            })}
          </div>

          {/* Hero text */}
          {isDefi ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 20, alignItems: "center", textAlign: "center", width: "100%" }}>
              <h1 style={{ fontSize: 54, fontWeight: 300, color: BLUE, fontFamily: FONT, lineHeight: 1.24, margin: 0, maxWidth: 700 }}>
                Provide liquidity across DeFi & earn more with your DTFs
              </h1>
              <p style={{ fontSize: 18, fontWeight: 300, color: "#000", fontFamily: FONT, lineHeight: "26px", margin: 0 }}>
                DeFi yield opportunities for DTFs in Aerodrome, Convex, Beefy, Yearn & Others
              </p>
              <button style={{ display: "flex", gap: 8, alignItems: "center", padding: "10px 20px", border: "1px solid #e5e5e5", borderRadius: 24, background: "white", cursor: "pointer" }}>
                <Zap size={15} color={BLUE} />
                <span style={{ fontSize: 15, fontWeight: 500, color: BLUE, fontFamily: FONT }}>How are APYs so high?</span>
                <HelpCircle size={15} color="#999" />
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 32, alignItems: "center", width: 940 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 24, alignItems: "center", textAlign: "center" }}>
                <h1 style={{ fontSize: 54, fontWeight: 300, color: BLUE, fontFamily: FONT, lineHeight: 1.24, margin: 0, width: "100%" }}>
                  {isYield ? "Stake RSR on Yield DTFs" : "Vote-Lock on Index DTFs"}
                </h1>
                <p style={{ fontSize: 20, fontWeight: 300, color: "#000", fontFamily: FONT, lineHeight: "29px", margin: 0, maxWidth: 755 }}>
                  {isYield
                    ? "Stake RSR to govern a Yield DTF and protect it from depegging in exchange for a cut of the underlying yield. There is smart contract and slashing risk associated with staking your RSR."
                    : "Use any ERC20 to govern an Index DTF in exchange for a portion of the Mint and TVL fees. There is smart contract risk associated with vote locking your ERC20, but there is no slashing risk associated."
                  }
                </p>
              </div>

              <div style={{ width: 600, height: 1, background: "#e5e5e5" }} />

              <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
                {isYield ? (
                  <>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <AlertTriangle size={16} color="#000" />
                      <span style={{ fontSize: 16, fontWeight: 300, color: "#000", fontFamily: FONT, lineHeight: 1.25 }}>Slashing Risk</span>
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <LockKeyholeOpen size={16} color="#000" />
                      <span style={{ fontSize: 16, fontWeight: 300, color: "#000", fontFamily: FONT, lineHeight: 1.25 }}>14-day unlock delays</span>
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <Coins size={16} color="#000" />
                      <span style={{ fontSize: 16, fontWeight: 300, color: "#000", fontFamily: FONT, lineHeight: 1.25 }}>Payouts in RSR</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <ShieldCheck size={16} color="#000" />
                      <span style={{ fontSize: 16, fontWeight: 300, color: "#000", fontFamily: FONT, lineHeight: 1.25 }}>No Slashing Risk</span>
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <LockKeyholeOpen size={16} color="#000" />
                      <span style={{ fontSize: 16, fontWeight: 300, color: "#000", fontFamily: FONT, lineHeight: 1.25 }}>Always 7-day unlock delays</span>
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <Coins size={16} color="#000" />
                      <span style={{ fontSize: 16, fontWeight: 300, color: "#000", fontFamily: FONT, lineHeight: 1.25 }}>Payouts in DTF</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Table section */}
        {isDefi ? (
          <div style={{ padding: "0 72px 24px" }}>
            {/* Featured cards */}
            <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
              {featuredDefiCards.map((card, i) => (
                <FeaturedCard key={i} card={card} />
              ))}
            </div>

            {/* Search + filters + table */}
            <div style={{ background: "white", border: "1px solid #e5e5e5", borderRadius: 16, overflow: "hidden" }}>
              {/* Filters row */}
              <div style={{ display: "flex", gap: 12, alignItems: "center", padding: "12px 16px", borderBottom: "1px solid #f0f0f0" }}>
                {/* Search */}
                <div style={{ flex: 1, display: "flex", gap: 10, alignItems: "center", padding: "8px 16px", border: "1px solid #e5e5e5", borderRadius: 8 }}>
                  <Search size={14} color="rgba(0,0,0,0.4)" style={{ flexShrink: 0 }} />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search pool"
                    style={{ border: "none", outline: "none", background: "transparent", fontSize: 15, fontFamily: FONT, fontWeight: 300, color: "rgba(0,0,0,0.7)", flex: 1 }}
                  />
                </div>

                {/* Asset type pills */}
                <div style={{ display: "flex", gap: 2, alignItems: "center", padding: "4px", background: "#f5f5f5", borderRadius: 8 }}>
                  {[
                    { id: "all",     label: "All",     color: undefined },
                    { id: "stables", label: "Stables", color: "#22c55e" },
                    { id: "eth",     label: "ETH",     color: CHAIN_COLORS.ETH },
                    { id: "rsr",     label: "RSR",     color: BLUE },
                  ].map(({ id, label, color }) => {
                    const active = defiAsset === id
                    return (
                      <button
                        key={id}
                        onClick={() => setDefiAsset(id as typeof defiAsset)}
                        style={{
                          display: "flex", gap: 5, alignItems: "center",
                          padding: "5px 12px", borderRadius: 6, border: "none",
                          background: active ? "white" : "transparent",
                          fontSize: 14, fontWeight: active ? 500 : 300,
                          color: "#000", fontFamily: FONT, cursor: "pointer",
                          boxShadow: active ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                        }}
                      >
                        {color && <div style={{ width: 10, height: 10, borderRadius: "50%", background: color, flexShrink: 0 }} />}
                        {label}
                      </button>
                    )
                  })}
                </div>

                <div style={{ width: 1, height: 24, background: "#e5e5e5", flexShrink: 0 }} />

                {/* Chain pills */}
                <div style={{ display: "flex", gap: 2, alignItems: "center", padding: "4px", background: "#f5f5f5", borderRadius: 8 }}>
                  {[
                    { id: "all",     label: "All chains", color: undefined },
                    { id: "ETH",     label: "Ethereum",   color: CHAIN_COLORS.ETH },
                    { id: "Base",    label: "Base",       color: CHAIN_COLORS.Base },
                    { id: "Binance", label: "Binance",    color: CHAIN_COLORS.Binance },
                  ].map(({ id, label, color }) => {
                    const active = defiChain === id
                    return (
                      <button
                        key={id}
                        onClick={() => setDefiChain(id as typeof defiChain)}
                        style={{
                          display: "flex", gap: 5, alignItems: "center",
                          padding: "5px 12px", borderRadius: 6, border: "none",
                          background: active ? "white" : "transparent",
                          fontSize: 14, fontWeight: active ? 500 : 300,
                          color: "#000", fontFamily: FONT, cursor: "pointer",
                          boxShadow: active ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                        }}
                      >
                        {color && <div style={{ width: 10, height: 10, borderRadius: "50%", background: color, flexShrink: 0 }} />}
                        {label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Table header */}
              <div style={{ display: "flex", alignItems: "center", padding: "12px 16px", borderBottom: "1px solid #f0f0f0" }}>
                <div style={{ flex: 2 }}>
                  <span style={{ fontSize: 14, fontWeight: 300, color: "#666", fontFamily: FONT }}>Pool</span>
                </div>
                <div style={{ flex: 2 }}>
                  <span style={{ fontSize: 14, fontWeight: 300, color: "#666", fontFamily: FONT }}>Project</span>
                </div>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 14, fontWeight: 300, color: "#666", fontFamily: FONT }}>Chain</span>
                </div>
                <div style={{ flex: 1, display: "flex", gap: 4, alignItems: "center", justifyContent: "flex-end" }}>
                  <span style={{ fontSize: 14, fontWeight: 300, color: "#666", fontFamily: FONT }}>APY</span>
                  <HelpCircle size={12} color="#bbb" />
                  <ArrowDown size={12} color="#666" />
                </div>
                <div style={{ flex: 1, display: "flex", gap: 4, alignItems: "center", justifyContent: "flex-end" }}>
                  <span style={{ fontSize: 14, fontWeight: 300, color: "#666", fontFamily: FONT }}>Base APY</span>
                  <HelpCircle size={12} color="#bbb" />
                </div>
                <div style={{ flex: 1, display: "flex", gap: 4, alignItems: "center", justifyContent: "flex-end" }}>
                  <span style={{ fontSize: 14, fontWeight: 300, color: "#666", fontFamily: FONT }}>Reward APY</span>
                  <HelpCircle size={12} color="#bbb" />
                </div>
                <div style={{ flex: 1, textAlign: "right" }}>
                  <span style={{ fontSize: 14, fontWeight: 300, color: "#666", fontFamily: FONT }}>TVL</span>
                </div>
              </div>

              {/* Table rows */}
              <div style={{ padding: "0 16px" }}>
                {filteredDefi.length === 0 ? (
                  <div style={{ padding: "40px 0", textAlign: "center", fontSize: 14, fontFamily: FONT, fontWeight: 300, color: "#666" }}>
                    No pools found
                  </div>
                ) : (
                  filteredDefi.map((entry, i) => (
                    <DefiTableRow key={i} entry={entry} isLast={i === filteredDefi.length - 1} />
                  ))
                )}
              </div>
            </div>
          </div>
        ) : (
        <div style={{ padding: "0 72px 24px" }}>
          <div style={{ background: CREAM, borderRadius: 20, padding: 8, display: "flex", flexDirection: "column", gap: 24 }}>

            {/* Search + filters */}
            <div style={{ background: "white", borderRadius: 24, display: "flex", gap: 8, alignItems: "center" }}>
              <div style={{
                border: "1px solid #e5e5e5", borderRadius: 16, flex: 1, height: 57,
                display: "flex", alignItems: "center", padding: "0 32px 0 24px", gap: 12,
              }}>
                <Search size={16} color="rgba(0,0,0,0.4)" style={{ flexShrink: 0 }} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={isYield ? "Search DTF name or symbol" : "Search by name, ticker or collateral"}
                  style={{
                    border: "none", outline: "none", background: "transparent",
                    fontSize: 16, fontFamily: FONT, fontWeight: 300,
                    color: "rgba(0,0,0,0.7)", flex: 1, lineHeight: "17px",
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: 8, alignItems: "center", padding: "8px 8px 8px 0" }}>
                {isYield ? (
                  <>
                    {/* All DTFs dropdown */}
                    <button style={{
                      background: "white", border: "1px solid #e5e5e5", borderRadius: 16,
                      display: "flex", gap: 8, alignItems: "center", padding: "0 20px",
                      height: 57, cursor: "pointer",
                    }}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        {[CHAIN_COLORS.ETH, CHAIN_COLORS.Base].map((color, i) => (
                          <div key={i} style={{
                            width: 16, height: 16, borderRadius: "50%",
                            background: color, border: "1.5px solid white",
                            marginRight: -8, zIndex: 2 - i, flexShrink: 0, position: "relative",
                          }} />
                        ))}
                      </div>
                      <span style={{ fontSize: 16, fontWeight: 300, color: "rgba(0,0,0,0.7)", fontFamily: FONT, lineHeight: "17px", marginLeft: 8 }}>
                        All DTFs
                      </span>
                      <ChevronDown size={16} color="rgba(0,0,0,0.7)" />
                    </button>

                    {/* Chain pill group */}
                    <div style={{
                      background: "white", border: "1px solid #e5e5e5", borderRadius: 16,
                      display: "flex", alignItems: "center", gap: 4, padding: "8px 12px", height: 57,
                    }}>
                      {[
                        { id: "all" as const, label: "All chains" },
                        { id: "ETH" as const, label: "Ethereum", color: CHAIN_COLORS.ETH },
                        { id: "Base" as const, label: "Base", color: CHAIN_COLORS.Base },
                      ].map(({ id, label, color }) => {
                        const active = yieldChain === id
                        return (
                          <button
                            key={id}
                            onClick={() => setYieldChain(id)}
                            style={{
                              display: "flex", alignItems: "center", gap: 6,
                              padding: "6px 12px", borderRadius: 8, border: "none",
                              background: active ? "#f2f2f2" : "transparent",
                              fontSize: 14, fontWeight: active ? 500 : 300,
                              color: active ? "#000" : "rgba(0,0,0,0.6)",
                              fontFamily: FONT, cursor: "pointer", whiteSpace: "nowrap",
                            }}
                          >
                            {color && (
                              <div style={{ width: 14, height: 14, borderRadius: "50%", background: color, flexShrink: 0 }} />
                            )}
                            {label}
                          </button>
                        )
                      })}
                    </div>
                  </>
                ) : (
                  <>
                    {/* Vote-lock tokens */}
                    <button style={{
                      background: "white", border: "1px solid #e5e5e5", borderRadius: 16,
                      display: "flex", gap: 8, alignItems: "center", padding: "0 20px",
                      height: 57, cursor: "pointer",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", marginRight: 4 }}>
                        {["#0151af", "#e87d3e", "#22c55e"].map((color, i) => (
                          <div key={i} style={{
                            width: 16, height: 16, borderRadius: "50%",
                            background: color, border: "1.5px solid white",
                            marginRight: -8, zIndex: 3 - i, flexShrink: 0, position: "relative",
                          }} />
                        ))}
                      </div>
                      <span style={{ fontSize: 16, fontWeight: 300, color: "rgba(0,0,0,0.7)", fontFamily: FONT, lineHeight: "17px", marginLeft: 8 }}>
                        All Vote-lock tokens
                      </span>
                      <ChevronDown size={16} color="rgba(0,0,0,0.7)" />
                    </button>

                    {/* Chain dropdown */}
                    <button style={{
                      background: "white", border: "1px solid #e5e5e5", borderRadius: 16,
                      display: "flex", gap: 8, alignItems: "center", padding: "0 20px",
                      height: 57, cursor: "pointer",
                    }}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        {[CHAIN_COLORS.ETH, CHAIN_COLORS.Base, CHAIN_COLORS.Solana].map((color, i) => (
                          <div key={i} style={{
                            width: 16, height: 16, borderRadius: "50%",
                            background: color, border: "1.5px solid white",
                            marginRight: -8, zIndex: 3 - i, flexShrink: 0, position: "relative",
                          }} />
                        ))}
                      </div>
                      <span style={{ fontSize: 16, fontWeight: 300, color: "rgba(0,0,0,0.7)", fontFamily: FONT, lineHeight: "17px", marginLeft: 8 }}>
                        All Chains
                      </span>
                      <ChevronDown size={16} color="rgba(0,0,0,0.7)" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Table */}
            <div style={{ background: "white", borderRadius: 20, overflow: "hidden" }}>
              {/* Header */}
              <div style={{ display: "flex", alignItems: "flex-end", padding: "32px 16px", borderBottom: "1px solid #e5e5e5" }}>
                <div style={{ width: 220 }}>
                  <span style={{ fontSize: 16, fontWeight: 300, color: "#000", fontFamily: FONT, lineHeight: "17px" }}>Gov. Token</span>
                </div>
                <div style={{ width: 160 }}>
                  <span style={{ fontSize: 16, fontWeight: 300, color: "#000", fontFamily: FONT, lineHeight: "17px" }}>TVL</span>
                </div>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 16, fontWeight: 300, color: "#000", fontFamily: FONT, lineHeight: "17px" }}>
                    {isYield ? "Staked" : "Vote-locked"}
                  </span>
                </div>
                <div style={{ width: 180 }}>
                  <span style={{ fontSize: 16, fontWeight: 300, color: "#000", fontFamily: FONT, lineHeight: "17px" }}>Governs</span>
                </div>
                <div style={{ width: 160, display: "flex", gap: 5, alignItems: "center", justifyContent: "flex-end" }}>
                  <span style={{ fontSize: 16, fontWeight: 300, color: "#000", fontFamily: FONT, lineHeight: "17px" }}>
                    {isYield ? "Avg. 30d%" : "Avg 14-day%"}
                  </span>
                  <ArrowDown size={16} color="#000" />
                </div>
              </div>

              {isYield ? (
                filteredYield.map((entry, i) => (
                  <YieldTableRow key={i} entry={entry} isLast={i === filteredYield.length - 1} />
                ))
              ) : (
                indexEntries.map((entry, i) => (
                  <IndexTableRow key={i} entry={entry} isLast={i === indexEntries.length - 1} />
                ))
              )}
            </div>
          </div>
        </div>
        )}

        {/* FAQ */}
        <div style={{ display: "flex", flexDirection: "column", gap: 32, alignItems: "center", padding: "32px 0 64px", maxWidth: 1112, margin: "0 auto" }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: BLUE, fontFamily: FONT, lineHeight: "38px", textAlign: "center", margin: 0 }}>
            Vote Lock Frequently Asked Questions
          </h2>
          <div style={{ width: "100%" }}>
            {faqItems.map(({ q, a, defaultOpen }, i) => (
              <FaqItem key={i} q={q} a={a} defaultOpen={defaultOpen} />
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
