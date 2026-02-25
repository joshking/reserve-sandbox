"use client"

import { useState } from "react"
import Link from "next/link"
import Navbar from "@/components/Navbar"
import { Search, ChevronDown, ChevronUp, Shield, Lock, Coins, ArrowRight, ArrowUpRight, LockKeyholeOpen } from "lucide-react"

type EarnView = "index-dtf" | "yield-staking" | "defi-yield"

const tabs: { id: EarnView; label: string }[] = [
  { id: "index-dtf", label: "Index DTF Governance" },
  { id: "yield-staking", label: "Yield DTF Staking" },
  { id: "defi-yield", label: "DeFi Yield" },
]

// ── Data ──────────────────────────────────────────────────────────────────────

type GovRow = {
  id: string
  govToken: string
  vlToken: string
  govTokenColor: string
  chain: "ETH" | "Base" | "Solana"
  tvlUsd: string
  tvlRsr: string
  hasBalance: boolean
  lockedRsr?: string
  lockedTotal?: string
  governs: string
  apy: string
}

const CHAIN_COLORS: Record<string, string> = {
  ETH: "#627eea",
  Base: "#0052ff",
  Solana: "#9945ff",
}

const govRows: GovRow[] = [
  {
    id: "row1",
    govToken: "RSR",
    vlToken: "vlRSR-MVTT10F",
    govTokenColor: "#0151af",
    chain: "ETH",
    tvlUsd: "$4.82M",
    tvlRsr: "377M RSR",
    hasBalance: false,
    governs: "MVTT10F",
    apy: "10.34",
  },
  {
    id: "row2",
    govToken: "RSR",
    vlToken: "vlRSR-CLX",
    govTokenColor: "#0151af",
    chain: "ETH",
    tvlUsd: "$2.14M",
    tvlRsr: "167M RSR",
    hasBalance: true,
    lockedRsr: "1.34M RSR",
    lockedTotal: "56.6M RSR",
    governs: "CLX",
    apy: "4.75",
  },
  {
    id: "row3",
    govToken: "RSR",
    vlToken: "vlRSR-BGCI",
    govTokenColor: "#0151af",
    chain: "ETH",
    tvlUsd: "$890K",
    tvlRsr: "69.6M RSR",
    hasBalance: false,
    governs: "BGCI",
    apy: "10.34",
  },
  {
    id: "row4",
    govToken: "RSR",
    vlToken: "vlRSR-BAIX",
    govTokenColor: "#0151af",
    chain: "Base",
    tvlUsd: "$1.43M",
    tvlRsr: "111M RSR",
    hasBalance: false,
    governs: "BAIX",
    apy: "10.34",
  },
  {
    id: "row5",
    govToken: "RSR",
    vlToken: "vlRSR-BEX",
    govTokenColor: "#0151af",
    chain: "Base",
    tvlUsd: "$542K",
    tvlRsr: "42.3M RSR",
    hasBalance: true,
    lockedRsr: "1.34M RSR",
    lockedTotal: "56.6M RSR",
    governs: "BEX",
    apy: "4.75",
  },
  {
    id: "row6",
    govToken: "RSR",
    vlToken: "vlRSR-DGI",
    govTokenColor: "#0151af",
    chain: "ETH",
    tvlUsd: "$198K",
    tvlRsr: "15.5M RSR",
    hasBalance: false,
    governs: "DGI",
    apy: "10.34",
  },
]

const yieldDtfs = [
  { ticker: "EUSD",  name: "Electronic Dollar",  tvl: "$89.2M", rsrStaked: "890M", apy: "5.2",  collat: "112%", color: "#10b981" },
  { ticker: "HYUSD", name: "High Yield USD",      tvl: "$24.1M", rsrStaked: "241M", apy: "9.8",  collat: "118%", color: "#f59e0b" },
  { ticker: "USDP",  name: "USDC Plus",           tvl: "$12.7M", rsrStaked: "128M", apy: "7.1",  collat: "115%", color: "#3b82f6" },
  { ticker: "ETHP",  name: "ETH Plus",            tvl: "$8.4M",  rsrStaked: "84M",  apy: "11.3", collat: "122%", color: "#627eea" },
  { ticker: "BTCP",  name: "BTC Plus",            tvl: "$5.1M",  rsrStaked: "51M",  apy: "8.7",  collat: "119%", color: "#f97316" },
]

const defiPools = [
  { pair: "hyUSD / USDC",   protocol: "Curve",   tvl: "$14.2M", apy: "12.4", volume7d: "$3.1M",  colors: ["#10b981", "#3b82f6"] },
  { pair: "eUSD / DAI",     protocol: "Curve",   tvl: "$9.8M",  apy: "8.7",  volume7d: "$1.8M",  colors: ["#22d3ee", "#f59e0b"] },
  { pair: "MVTT10F / USDC", protocol: "Uniswap", tvl: "$6.3M",  apy: "22.4", volume7d: "$2.4M",  colors: ["#f59e0b", "#3b82f6"] },
  { pair: "RSR / ETH",      protocol: "Uniswap", tvl: "$4.7M",  apy: "18.9", volume7d: "$1.6M",  colors: ["#0151af", "#627eea"] },
  { pair: "DGI / WETH",     protocol: "Uniswap", tvl: "$2.1M",  apy: "15.2", volume7d: "$890K",  colors: ["#10b981", "#627eea"] },
]

const faqItems = [
  {
    question: "What is vote-locking and how do I do it?",
    answer: "Vote-locking means depositing RSR into a DTF's governance contract to receive vlRSR tokens. These give you voting rights on proposals and entitle you to a share of the Mint and TVL fees. To get started, connect your wallet, select a DTF from the table above, click 'Vote-lock RSR', and follow the on-screen steps.",
  },
  {
    question: "How do I earn rewards?",
    answer: "You earn a pro-rata share of the DTF's fees (minting + TVL fees) based on how much and how long you lock. Rewards accrue automatically and can be claimed anytime in the app.",
  },
  {
    question: "Do I need to vote on proposals to earn rewards?",
    answer: "No. Rewards accrue to all vlRSR holders regardless of whether they participate in governance votes. However, actively voting helps keep the DTF healthy — governance participation influences collateral composition, fee rates, and other key parameters.",
  },
  {
    question: "Can I unlock my tokens at any time?",
    answer: "There is always a 7-day unlock delay after initiating a withdrawal. During this period your tokens remain locked and continue accruing rewards. After 7 days you can claim them back to your wallet. There is no penalty or slashing for unlocking.",
  },
  {
    question: "What smart contract risk is involved?",
    answer: "Vote-locking involves interacting with Reserve Protocol's governance contracts, which have been audited but, like all smart contracts, carry inherent risk. There is no slashing risk — your RSR cannot be seized due to a governance vote — but there is always the possibility of a contract bug. Audit reports are linked in the docs.",
  },
]

// ── Shared sub-components ─────────────────────────────────────────────────────

function RsrLogo({ color = "#0151af" }: { color?: string }) {
  return (
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: "50%",
        background: color,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "9px",
        fontWeight: 700,
        color: "white",
        fontFamily: "'TWK Lausanne', sans-serif",
        letterSpacing: "0.02em",
      }}
    >
      RSR
    </div>
  )
}

function DtfLogo({ ticker, color }: { ticker: string; color: string }) {
  return (
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: "50%",
        background: color,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "9px",
        fontWeight: 700,
        color: "white",
        fontFamily: "'TWK Lausanne', sans-serif",
        letterSpacing: "0.02em",
      }}
    >
      {ticker.slice(0, 3)}
    </div>
  )
}

function TokenDots({ colors }: { colors: string[] }) {
  return (
    <div style={{ display: "flex", alignItems: "center", paddingRight: "8px" }}>
      {colors.map((color, i) => (
        <div
          key={i}
          style={{
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: color,
            border: "1px solid white",
            marginRight: i < colors.length - 1 ? "-8px" : 0,
            zIndex: colors.length - i,
            position: "relative",
          }}
        />
      ))}
    </div>
  )
}

function FilterPill({ label, colors }: { label: string; colors: string[] }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        border: "1px solid #e5e5e5",
        borderRadius: "16px",
        padding: "20px",
        background: "white",
        cursor: "pointer",
        flexShrink: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <TokenDots colors={colors} />
        <span
          style={{
            fontSize: "16px",
            fontFamily: "'TWK Lausanne', sans-serif",
            fontWeight: 300,
            color: "rgba(0,0,0,0.7)",
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </span>
      </div>
      <ChevronDown size={16} color="rgba(0,0,0,0.4)" />
    </div>
  )
}

function TableShell({ toolbar, children }: { toolbar: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ padding: "0 0 24px" }}>
      <div
        style={{
          background: "#f9eddd",
          borderRadius: "24px",
          padding: "4px",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
        }}
      >
        {/* Search + filter bar — separate white element */}
        <div
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "16px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {toolbar}
        </div>

        {/* Table — separate white element */}
        <div
          style={{
            background: "white",
            borderRadius: "20px",
            overflow: "hidden",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

function ColHeader({ children, width, flex, align = "left" }: {
  children: React.ReactNode
  width?: number
  flex?: boolean
  align?: "left" | "right"
}) {
  return (
    <div
      style={{
        ...(flex ? { flex: 1, minWidth: 0 } : { width }),
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: align === "right" ? "flex-end" : "flex-start",
      }}
    >
      <span
        style={{
          fontSize: "16px",
          fontFamily: "'TWK Lausanne', sans-serif",
          fontWeight: 300,
          color: "#666",
          lineHeight: "17px",
        }}
      >
        {children}
      </span>
    </div>
  )
}

// ── Index DTF Governance ──────────────────────────────────────────────────────

function IndexDtfView() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div>
      {/* Hero */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "48px 0 40px",
          gap: "24px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: "24px",
            maxWidth: "940px",
          }}
        >
          <h1
            style={{
              fontSize: "54px",
              fontFamily: "'TWK Lausanne', sans-serif",
              fontWeight: 300,
              color: "#0151af",
              lineHeight: 1.24,
              margin: 0,
              width: "940px",
            }}
          >
            Vote-Lock on Index DTFs
          </h1>
          <p
            style={{
              fontSize: "20px",
              fontFamily: "'TWK Lausanne', sans-serif",
              fontWeight: 300,
              color: "#000",
              lineHeight: "29px",
              maxWidth: "755px",
            }}
          >
            Use any ERC20 to govern an Index DTF in exchange for a portion of the Mint and TVL
            fees. There is smart contract risk associated with vote locking your ERC20, but there
            is no slashing risk associated.
          </p>
          <div style={{ height: "1px", width: "600px", background: "#e5e5e5" }} />
          <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
            {[
              { icon: <Shield size={16} />, label: "No Slashing Risk" },
              { icon: <Lock size={16} />, label: "Always 7-day unlock delays" },
              { icon: <Coins size={16} />, label: "Payouts in DTF" },
            ].map(({ icon, label }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ color: "#0a0d10", display: "flex" }}>{icon}</span>
                <span
                  style={{
                    fontSize: "16px",
                    fontFamily: "'TWK Lausanne', sans-serif",
                    fontWeight: 300,
                    color: "#0a0d10",
                    lineHeight: 1.25,
                  }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <TableShell toolbar={
        <>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              border: "1px solid #e5e5e5",
              borderRadius: "16px",
              padding: "20px 24px",
              flex: 1,
            }}
          >
            <Search size={16} color="rgba(0,0,0,0.4)" style={{ flexShrink: 0 }} />
            <span
              style={{
                fontSize: "16px",
                fontFamily: "'TWK Lausanne', sans-serif",
                fontWeight: 300,
                color: "rgba(0,0,0,0.7)",
              }}
            >
              Search gov token or DTF
            </span>
          </div>
          <FilterPill label="All Vote-lock tokens" colors={["#0151af", "#10b981", "#f59e0b"]} />
          <FilterPill label="All Chains" colors={["#627eea", "#0052ff", "#9945ff"]} />
        </>
      }>

        {/* Table */}
        <div>
          {/* Header */}
          <div style={{ display: "flex", height: "52px", alignItems: "center", borderBottom: "1px solid #e5e5e5" }}>
            <ColHeader width={240}>Gov. Token</ColHeader>
            <ColHeader width={180}>TVL</ColHeader>
            <ColHeader width={200}>Vote-locked</ColHeader>
            <ColHeader width={180}>Governs</ColHeader>
            <ColHeader flex align="right">Avg 14-day%</ColHeader>
          </div>

          {/* Rows */}
          {govRows.map((row, i) => (
            <Link
              key={row.id}
              href={`/earn/index-dtf/${row.governs.toLowerCase()}`}
              style={{
                display: "flex",
                alignItems: "center",
                height: "80px",
                borderBottom: i < govRows.length - 1 ? "1px solid #e5e5e5" : "none",
                cursor: "pointer",
                transition: "background 0.1s",
                textDecoration: "none",
                color: "inherit",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#fafafa" }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent" }}
            >
              {/* Gov. Token */}
              <div style={{ width: 240, padding: "0 24px", display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <RsrLogo color={row.govTokenColor} />
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      background: CHAIN_COLORS[row.chain],
                      border: "1.5px solid white",
                    }}
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px", minWidth: 0 }}>
                  <span style={{ fontSize: "16px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 500, color: "#000", lineHeight: 1.25 }}>
                    {row.govToken}
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <ArrowRight size={16} color="#666" style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: "14px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 300, color: "#666", lineHeight: "17px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {row.vlToken}
                    </span>
                  </div>
                </div>
              </div>

              {/* TVL */}
              <div style={{ width: 180, padding: "0 24px", display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ fontSize: "16px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 500, color: "#000", lineHeight: 1.25 }}>
                  {row.tvlUsd}
                </span>
                <span style={{ fontSize: "14px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 300, color: "#666", lineHeight: "18px" }}>
                  {row.tvlRsr}
                </span>
              </div>

              {/* Vote-locked */}
              <div style={{ width: 200, padding: "0 24px", display: "flex", alignItems: "center", gap: "12px" }}>
                {row.hasBalance ? (
                  <>
                    <Lock size={24} color="#0151af" style={{ flexShrink: 0 }} />
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      <span style={{ fontSize: "14px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 500, color: "#0151af", lineHeight: "18px" }}>
                        {row.lockedRsr}
                      </span>
                      <span style={{ fontSize: "14px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 300, color: "#666", lineHeight: "18px" }}>
                        {row.lockedTotal}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <LockKeyholeOpen size={24} color="#666" style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: "16px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 300, color: "#666", lineHeight: 1.25 }}>
                      No
                    </span>
                  </>
                )}
              </div>

              {/* Governs */}
              <div style={{ width: 180, padding: "0 24px", overflow: "hidden" }}>
                <span style={{ fontSize: "16px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 300, color: "#666", lineHeight: 1.25, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}>
                  {row.governs}
                </span>
              </div>

              {/* Avg 14-day% */}
              <div style={{ flex: 1, padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "6px" }}>
                <span style={{ fontSize: "16px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 500, color: "#0151af", lineHeight: 1.25 }}>
                  {row.apy}% APY
                </span>
                <ArrowUpRight size={16} color="#0151af" style={{ flexShrink: 0 }} />
              </div>
            </Link>
          ))}
        </div>
      </TableShell>

      {/* FAQ */}
      <div style={{ paddingBottom: "64px" }}>
        <h2
          style={{
            textAlign: "center",
            fontSize: "32px",
            fontFamily: "'TWK Lausanne', sans-serif",
            fontWeight: 700,
            color: "#0151af",
            margin: "0 0 32px",
            lineHeight: "38px",
          }}
        >
          Vote Lock Frequently Asked Questions
        </h2>

        <div style={{ borderTop: "1px solid #e5e5e5" }}>
          {faqItems.map((item, i) => {
            const isOpen = openFaq === i
            return (
              <div key={i}>
                {/* Row header */}
                <div
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "24px",
                    background: isOpen ? "#f9eddd" : "white",
                    borderBottom: "1px solid #e5e5e5",
                    cursor: "pointer",
                    gap: "16px",
                    transition: "background 0.15s",
                  }}
                >
                  <span
                    style={{
                      fontSize: "26px",
                      fontFamily: "'TWK Lausanne', sans-serif",
                      fontWeight: 700,
                      color: "#0151af",
                      lineHeight: "30px",
                    }}
                  >
                    {item.question}
                  </span>
                  {isOpen
                    ? <ChevronUp size={32} color="#0151af" style={{ flexShrink: 0 }} />
                    : <ChevronDown size={32} color="#0151af" style={{ flexShrink: 0 }} />
                  }
                </div>

                {/* Answer */}
                {isOpen && (
                  <div
                    style={{
                      padding: "24px",
                      background: "#f9eddd",
                      borderBottom: "1px solid #e5e5e5",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "18px",
                        fontFamily: "'TWK Lausanne', sans-serif",
                        fontWeight: 300,
                        color: "#0151af",
                        lineHeight: "26px",
                        margin: 0,
                      }}
                    >
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ── Yield DTF Staking ─────────────────────────────────────────────────────────

function YieldStakingView() {
  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "48px 0 40px",
          gap: "24px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: "24px",
            maxWidth: "940px",
          }}
        >
          <h1
            style={{
              fontSize: "54px",
              fontFamily: "'TWK Lausanne', sans-serif",
              fontWeight: 300,
              color: "#0151af",
              lineHeight: 1.24,
              margin: 0,
            }}
          >
            Stake RSR on Yield DTFs
          </h1>
          <p
            style={{
              fontSize: "20px",
              fontFamily: "'TWK Lausanne', sans-serif",
              fontWeight: 300,
              color: "#000",
              lineHeight: "29px",
              maxWidth: "755px",
            }}
          >
            Stake RSR as overcollateralization for Yield DTFs and earn a share of their yield. RSR
            stakers serve as the first-loss capital layer — in exchange for bearing that risk, they
            receive pro-rata yield from the DTF&apos;s revenue streams.
          </p>
          <div style={{ height: "1px", width: "600px", background: "#e5e5e5" }} />
          <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
            {[
              { icon: <Shield size={16} />, label: "Overcollateralization only" },
              { icon: <Lock size={16} />, label: "No vote-lock required" },
              { icon: <Coins size={16} />, label: "Payouts in yield" },
            ].map(({ icon, label }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ color: "#0a0d10", display: "flex" }}>{icon}</span>
                <span
                  style={{
                    fontSize: "16px",
                    fontFamily: "'TWK Lausanne', sans-serif",
                    fontWeight: 300,
                    color: "#0a0d10",
                    lineHeight: 1.25,
                  }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <TableShell toolbar={
        <>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              border: "1px solid #e5e5e5",
              borderRadius: "16px",
              padding: "20px 24px",
              flex: 1,
            }}
          >
            <Search size={16} color="rgba(0,0,0,0.4)" style={{ flexShrink: 0 }} />
            <span
              style={{
                fontSize: "16px",
                fontFamily: "'TWK Lausanne', sans-serif",
                fontWeight: 300,
                color: "rgba(0,0,0,0.7)",
              }}
            >
              Search by name or ticker
            </span>
          </div>
          <FilterPill label="All Chains" colors={["#627eea", "#0052ff", "#9945ff"]} />
        </>
      }>

        <div>
          <div style={{ display: "flex", height: "17px", alignItems: "center" }}>
            <ColHeader width={480}>DTF Name</ColHeader>
            <ColHeader width={200}>Staking APY</ColHeader>
            <ColHeader width={200}>Collateralization</ColHeader>
            <ColHeader flex align="right">Balance / Rewards</ColHeader>
          </div>

          {yieldDtfs.map((dtf, i) => (
            <div
              key={dtf.ticker}
              style={{
                display: "flex",
                alignItems: "center",
                borderBottom: i < yieldDtfs.length - 1 ? "1px solid #e5e5e5" : "none",
                height: "80px",
                cursor: "pointer",
                transition: "background 0.1s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#fafafa" }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent" }}
            >
              <div style={{ width: 480, padding: "0 24px", display: "flex", alignItems: "center", gap: "12px" }}>
                <DtfLogo ticker={dtf.ticker} color={dtf.color} />
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <span style={{ fontSize: "16px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 700, color: "#000", lineHeight: 1.25 }}>
                    {dtf.name}
                  </span>
                  <span style={{ fontSize: "16px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 300, color: "#666", lineHeight: "17px" }}>
                    ${dtf.ticker}
                  </span>
                </div>
              </div>
              <div style={{ width: 200, padding: "0 24px" }}>
                <span style={{ fontSize: "16px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 500, color: "#0151af" }}>
                  {dtf.apy}% APY
                </span>
              </div>
              <div style={{ width: 200, padding: "0 24px" }}>
                <span
                  style={{
                    display: "inline-block",
                    padding: "3px 10px",
                    borderRadius: "999px",
                    background: "rgba(22,163,74,0.08)",
                    color: "#16a34a",
                    fontSize: "14px",
                    fontFamily: "'TWK Lausanne', sans-serif",
                    fontWeight: 500,
                  }}
                >
                  {dtf.collat}
                </span>
              </div>
              <div style={{ flex: 1, padding: "0 24px", display: "flex", justifyContent: "flex-end" }}>
                <button
                  style={{
                    padding: "7px 12px",
                    borderRadius: "42px",
                    background: "transparent",
                    border: "1px solid #e5e5e5",
                    color: "#0a0d10",
                    fontSize: "14px",
                    fontFamily: "'TWK Lausanne', sans-serif",
                    fontWeight: 500,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    lineHeight: "18px",
                  }}
                >
                  Stake RSR
                </button>
              </div>
            </div>
          ))}
        </div>
      </TableShell>
    </div>
  )
}

// ── DeFi Yield ────────────────────────────────────────────────────────────────

function DeFiYieldView() {
  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "48px 0 40px",
          gap: "24px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: "24px",
            maxWidth: "940px",
          }}
        >
          <h1
            style={{
              fontSize: "54px",
              fontFamily: "'TWK Lausanne', sans-serif",
              fontWeight: 300,
              color: "#0151af",
              lineHeight: 1.24,
              margin: 0,
            }}
          >
            Provide Liquidity, Earn Yield
          </h1>
          <p
            style={{
              fontSize: "20px",
              fontFamily: "'TWK Lausanne', sans-serif",
              fontWeight: 300,
              color: "#000",
              lineHeight: "29px",
              maxWidth: "755px",
            }}
          >
            Provide liquidity to DEX pools containing Reserve DTFs and earn trading fees plus
            liquidity mining rewards. Pools are available on Curve and Uniswap.
          </p>
          <div style={{ height: "1px", width: "600px", background: "#e5e5e5" }} />
          <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
            {[
              { icon: <Shield size={16} />, label: "No lock-up required" },
              { icon: <Lock size={16} />, label: "Withdraw anytime" },
              { icon: <Coins size={16} />, label: "Trading fee rewards" },
            ].map(({ icon, label }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ color: "#0a0d10", display: "flex" }}>{icon}</span>
                <span
                  style={{
                    fontSize: "16px",
                    fontFamily: "'TWK Lausanne', sans-serif",
                    fontWeight: 300,
                    color: "#0a0d10",
                    lineHeight: 1.25,
                  }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <TableShell toolbar={
        <>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              border: "1px solid #e5e5e5",
              borderRadius: "16px",
              padding: "20px 24px",
              flex: 1,
            }}
          >
            <Search size={16} color="rgba(0,0,0,0.4)" style={{ flexShrink: 0 }} />
            <span
              style={{
                fontSize: "16px",
                fontFamily: "'TWK Lausanne', sans-serif",
                fontWeight: 300,
                color: "rgba(0,0,0,0.7)",
              }}
            >
              Search by pool or protocol
            </span>
          </div>
          <FilterPill label="All Protocols" colors={["#627eea", "#f97316"]} />
          <FilterPill label="All Chains" colors={["#627eea", "#0052ff", "#9945ff"]} />
        </>
      }>

        <div>
          <div style={{ display: "flex", height: "17px", alignItems: "center" }}>
            <ColHeader width={400}>Pool</ColHeader>
            <ColHeader width={200}>TVL</ColHeader>
            <ColHeader width={200}>Volume (7d)</ColHeader>
            <ColHeader flex align="right">APY</ColHeader>
          </div>

          {defiPools.map((pool, i) => (
            <div
              key={pool.pair}
              style={{
                display: "flex",
                alignItems: "center",
                borderBottom: i < defiPools.length - 1 ? "1px solid #e5e5e5" : "none",
                height: "80px",
                cursor: "pointer",
                transition: "background 0.1s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#fafafa" }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent" }}
            >
              <div style={{ width: 400, padding: "0 24px", display: "flex", alignItems: "center", gap: "12px" }}>
                {/* Double logo */}
                <div style={{ position: "relative", width: "46px", height: "32px", flexShrink: 0 }}>
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: pool.colors[0],
                      border: "2px solid white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "8px",
                      fontWeight: 700,
                      color: "white",
                      fontFamily: "'TWK Lausanne', sans-serif",
                    }}
                  >
                    {pool.pair.split(" / ")[0].slice(0, 3)}
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      left: 14,
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: pool.colors[1],
                      border: "2px solid white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "8px",
                      fontWeight: 700,
                      color: "white",
                      fontFamily: "'TWK Lausanne', sans-serif",
                    }}
                  >
                    {pool.pair.split(" / ")[1].slice(0, 3)}
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <span style={{ fontSize: "16px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 700, color: "#000", lineHeight: 1.25 }}>
                    {pool.pair}
                  </span>
                  <span style={{ fontSize: "16px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 300, color: "#666", lineHeight: "17px" }}>
                    {pool.protocol}
                  </span>
                </div>
              </div>
              <div style={{ width: 200, padding: "0 24px" }}>
                <span style={{ fontSize: "16px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 300, color: "#000" }}>
                  {pool.tvl}
                </span>
              </div>
              <div style={{ width: 200, padding: "0 24px" }}>
                <span style={{ fontSize: "16px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 300, color: "#000" }}>
                  {pool.volume7d}
                </span>
              </div>
              <div style={{ flex: 1, padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "16px" }}>
                <span style={{ fontSize: "16px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 500, color: "#0151af" }}>
                  {pool.apy}% APY
                </span>
                <button
                  style={{
                    padding: "7px 12px",
                    borderRadius: "42px",
                    background: "transparent",
                    border: "1px solid #e5e5e5",
                    color: "#0a0d10",
                    fontSize: "14px",
                    fontFamily: "'TWK Lausanne', sans-serif",
                    fontWeight: 500,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    lineHeight: "18px",
                  }}
                >
                  Add Liquidity
                </button>
              </div>
            </div>
          ))}
        </div>
      </TableShell>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function EarnPage() {
  const [view, setView] = useState<EarnView>("index-dtf")

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#ffffff" }}>
      <Navbar />

      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 40px" }}>
        {/* Tab bar */}
        <div style={{ display: "flex", justifyContent: "center", paddingTop: "40px" }}>
          <div
            style={{
              background: "#f2f2f2",
              borderRadius: "50px",
              padding: "2px",
              display: "flex",
              alignItems: "center",
            }}
          >
            {tabs.map((tab) => {
              const active = view === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setView(tab.id)}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "48px",
                    background: active ? "white" : "transparent",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "16px",
                    fontFamily: "'TWK Lausanne', sans-serif",
                    fontWeight: 300,
                    color: active ? "#0151af" : "#666",
                    boxShadow: active ? "0px 1px 8px 0px rgba(0,0,0,0.05)" : "none",
                    transition: "all 0.12s",
                    whiteSpace: "nowrap",
                    lineHeight: "18px",
                  }}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* View content */}
        {view === "index-dtf" && <IndexDtfView />}
        {view === "yield-staking" && <YieldStakingView />}
        {view === "defi-yield" && <DeFiYieldView />}
      </div>
    </div>
  )
}
