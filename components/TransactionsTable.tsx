"use client"

import { useState } from "react"
import { ArrowLeftRight, ChevronDown, LayoutGrid, ChevronLeft, ChevronRight } from "lucide-react"

const FONT = "'TWK Lausanne', system-ui, sans-serif"

// ── Types ────────────────────────────────────────────────────────────────────

type TxType = "Mint" | "Melt" | "Redeem" | "Withdraw" | "Stake" | "Unstake"

type Tx = {
  token: string
  tokenColor: string
  tokenBg: string
  type: TxType
  amount: string
  usdValue: string
  time: string
  from: string
  fromChainColor: string
  platform: string
  platformColor: string
}

// ── Mock data (matches screenshot) ──────────────────────────────────────────

const transactions: Tx[] = [
  { token: "MAAT",   tokenColor: "#fff",    tokenBg: "#c8a84b", type: "Withdraw", amount: "125,431.56 RSR",    usdValue: "$211.48",    time: "2026-3-12 15:04", from: "0x7F73...ee36", fromChainColor: "#f97316", platform: "0xec7a...9c93", platformColor: "#6b7280" },
  { token: "bsdETH", tokenColor: "#fff",    tokenBg: "#2566d6", type: "Redeem",   amount: "3.80 bsdETH",       usdValue: "$8,345.23",  time: "2026-3-12 13:29", from: "0xFF76...fB4c", fromChainColor: "#f97316", platform: "0x56f8...e450", platformColor: "#6b7280" },
  { token: "bsdETH", tokenColor: "#fff",    tokenBg: "#2566d6", type: "Melt",     amount: "0.00 bsdETH",       usdValue: "$0.28",      time: "2026-3-12 13:29", from: "0x8e98...40A8", fromChainColor: "#f97316", platform: "0x56f8...e450", platformColor: "#6b7280" },
  { token: "bsdETH", tokenColor: "#fff",    tokenBg: "#2566d6", type: "Mint",     amount: "4.69 bsdETH",       usdValue: "$10,375.35", time: "2026-3-12 10:24", from: "0xC577...453d", fromChainColor: "#f97316", platform: "0x3e36...1c41", platformColor: "#6b7280" },
  { token: "bsdETH", tokenColor: "#fff",    tokenBg: "#2566d6", type: "Melt",     amount: "0.00 bsdETH",       usdValue: "$0.15",      time: "2026-3-12 10:24", from: "0x8e98...40A8", fromChainColor: "#f97316", platform: "0x3e36...1c41", platformColor: "#6b7280" },
  { token: "eUSD",   tokenColor: "#fff",    tokenBg: "#4b5563", type: "Stake",    amount: "200,000.00 RSR",    usdValue: "$329.72",    time: "2026-3-12 09:58", from: "0x43f1...0846", fromChainColor: "#f97316", platform: "0x5f8b...769c", platformColor: "#7c3aed" },
  { token: "bsdETH", tokenColor: "#fff",    tokenBg: "#2566d6", type: "Mint",     amount: "4.69 bsdETH",       usdValue: "$10,262.40", time: "2026-3-12 08:47", from: "0xC577...453d", fromChainColor: "#f97316", platform: "0xb9d7...b7bf", platformColor: "#6b7280" },
  { token: "bsdETH", tokenColor: "#fff",    tokenBg: "#2566d6", type: "Melt",     amount: "0.00 bsdETH",       usdValue: "$1.94",      time: "2026-3-12 08:47", from: "0x8e98...40A8", fromChainColor: "#f97316", platform: "0xb9d7...b7bf", platformColor: "#6b7280" },
  { token: "ETH+",   tokenColor: "#fff",    tokenBg: "#627eea", type: "Unstake",  amount: "3,212,231.96 RSR",  usdValue: "$5,191.61",  time: "2026-3-12 08:39", from: "0xB30d...6181", fromChainColor: "#f97316", platform: "0xd7e4...de54", platformColor: "#2566d6" },
  { token: "eUSD",   tokenColor: "#fff",    tokenBg: "#4b5563", type: "Withdraw", amount: "9,918,067.73 RSR",  usdValue: "$16,360.05", time: "2026-3-12 08:37", from: "0x8A11...9Eb9", fromChainColor: "#f97316", platform: "0x4657...ede3", platformColor: "#7c3aed" },
]

// ── Sub-components ───────────────────────────────────────────────────────────

function TokenLogo({ token, bg }: { token: string; bg: string }) {
  return (
    <div
      style={{
        width: 28,
        height: 28,
        borderRadius: "50%",
        background: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "9px",
        fontWeight: 700,
        color: "white",
        fontFamily: FONT,
        letterSpacing: "0.01em",
        flexShrink: 0,
        border: "1px solid rgba(0,0,0,0.08)",
      }}
    >
      {token.slice(0, 3)}
    </div>
  )
}

function PlatformIcon({ color }: { color: string }) {
  return (
    <div
      style={{
        width: 18,
        height: 18,
        borderRadius: "50%",
        border: `1.5px solid ${color}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <div style={{ width: 8, height: 1.5, background: color, borderRadius: 1 }} />
    </div>
  )
}

function BasescanDot({ color }: { color: string }) {
  return (
    <div
      style={{
        width: 16,
        height: 16,
        borderRadius: "50%",
        background: color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "8px",
        fontWeight: 800,
        color: "white",
        fontFamily: FONT,
        flexShrink: 0,
      }}
    >
      B
    </div>
  )
}

function FilterDropdown({ icon, label }: { icon?: React.ReactNode; label: string }) {
  return (
    <button
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        padding: "6px 10px",
        border: "1px solid #e5e5e5",
        borderRadius: "8px",
        background: "white",
        cursor: "pointer",
        fontSize: "13px",
        fontFamily: FONT,
        fontWeight: 400,
        color: "#0a0d10",
        whiteSpace: "nowrap",
      }}
    >
      {icon}
      {label}
      <ChevronDown size={13} color="#888" />
    </button>
  )
}

function PageButton({
  label,
  active,
  onClick,
}: {
  label: string | number
  active?: boolean
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      style={{
        minWidth: 32,
        height: 32,
        borderRadius: "6px",
        border: active ? "none" : "none",
        background: active ? "#0151af" : "transparent",
        color: active ? "white" : "#0a0d10",
        fontSize: "13px",
        fontFamily: FONT,
        fontWeight: active ? 600 : 400,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 6px",
      }}
    >
      {label}
    </button>
  )
}

// ── Main component ───────────────────────────────────────────────────────────

export default function TransactionsTable() {
  const [page, setPage] = useState(1)
  const totalPages = 75

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

      {/* Filter row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
        {/* Heading */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <ArrowLeftRight size={18} color="#0a0d10" strokeWidth={1.5} />
          <span
            style={{
              fontSize: "18px",
              fontFamily: FONT,
              fontWeight: 700,
              color: "#0a0d10",
            }}
          >
            Transactions
          </span>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {/* Wallet input */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 10px",
              border: "1px solid #e5e5e5",
              borderRadius: "8px",
              background: "white",
            }}
          >
            <p style={{ fontSize: "12px", fontFamily: FONT, fontWeight: 400, color: "#888", whiteSpace: "nowrap" }}>
              Wallet
            </p>
            <input
              placeholder="Input wallet"
              style={{
                border: "none",
                outline: "none",
                fontSize: "13px",
                fontFamily: FONT,
                fontWeight: 300,
                color: "#0a0d10",
                width: "130px",
                background: "transparent",
              }}
            />
          </div>

          <FilterDropdown
            icon={<LayoutGrid size={13} color="#888" />}
            label="All tokens"
          />
          <FilterDropdown
            icon={<ArrowLeftRight size={13} color="#888" />}
            label="9 selected"
          />
          <FilterDropdown
            icon={
              <div style={{ display: "flex", gap: "2px" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#627eea" }} />
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#0052ff", marginLeft: -3 }} />
              </div>
            }
            label="3 chains"
          />
        </div>
      </div>

      {/* Table card */}
      <div
        style={{
          border: "1px solid #e5e5e5",
          borderRadius: "12px",
          overflow: "hidden",
          background: "white",
        }}
      >
        {/* Table header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "160px 140px 220px 140px 180px 200px 1fr",
            borderBottom: "1px solid #e5e5e5",
            padding: "0 16px",
          }}
        >
          {["Token", "Type", "Amount", "USD Value", "Time", "From", "Platform"].map((col) => (
            <div
              key={col}
              style={{
                padding: "14px 8px",
                fontSize: "13px",
                fontFamily: FONT,
                fontWeight: 400,
                color: "#888",
              }}
            >
              {col}
            </div>
          ))}
        </div>

        {/* Rows */}
        {transactions.map((tx, i) => (
          <div
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "160px 140px 220px 140px 180px 200px 1fr",
              borderBottom: i < transactions.length - 1 ? "1px solid #e5e5e5" : "none",
              padding: "0 16px",
              alignItems: "center",
              transition: "background 0.1s",
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLElement).style.background = "#fafafa"
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLElement).style.background = "transparent"
            }}
          >
            {/* Token */}
            <div style={{ padding: "14px 8px", display: "flex", alignItems: "center", gap: "8px" }}>
              <TokenLogo token={tx.token} bg={tx.tokenBg} />
              <span
                style={{
                  fontSize: "14px",
                  fontFamily: FONT,
                  fontWeight: 400,
                  color: "#0151af",
                  textDecoration: "underline",
                  textDecorationColor: "rgba(1,81,175,0.3)",
                  cursor: "pointer",
                }}
              >
                {tx.token}
              </span>
            </div>

            {/* Type */}
            <div style={{ padding: "14px 8px" }}>
              <span
                style={{
                  fontSize: "14px",
                  fontFamily: FONT,
                  fontWeight: 700,
                  color: "#0a0d10",
                }}
              >
                {tx.type}
              </span>
            </div>

            {/* Amount */}
            <div style={{ padding: "14px 8px" }}>
              <span style={{ fontSize: "14px", fontFamily: FONT, fontWeight: 400, color: "#0a0d10" }}>
                {tx.amount}
              </span>
            </div>

            {/* USD Value */}
            <div style={{ padding: "14px 8px" }}>
              <span style={{ fontSize: "14px", fontFamily: FONT, fontWeight: 400, color: "#0a0d10" }}>
                {tx.usdValue}
              </span>
            </div>

            {/* Time */}
            <div style={{ padding: "14px 8px" }}>
              <span style={{ fontSize: "14px", fontFamily: FONT, fontWeight: 400, color: "#0a0d10" }}>
                {tx.time}
              </span>
            </div>

            {/* From */}
            <div style={{ padding: "14px 8px", display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "13px", fontFamily: FONT, fontWeight: 400, color: "#0a0d10" }}>
                {tx.from}
              </span>
              <BasescanDot color={tx.fromChainColor} />
            </div>

            {/* Platform */}
            <div style={{ padding: "14px 8px", display: "flex", alignItems: "center", gap: "6px" }}>
              <PlatformIcon color={tx.platformColor} />
              <span style={{ fontSize: "13px", fontFamily: FONT, fontWeight: 400, color: "#0a0d10" }}>
                {tx.platform}
              </span>
            </div>
          </div>
        ))}

        {/* Pagination footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 24px",
            borderTop: "1px solid #e5e5e5",
          }}
        >
          <span style={{ fontSize: "13px", fontFamily: FONT, fontWeight: 300, color: "#888" }}>
            Showing 10 out of 750
          </span>

          <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              style={{
                width: 32,
                height: 32,
                borderRadius: "6px",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#888",
              }}
            >
              <ChevronLeft size={15} />
            </button>

            <PageButton label={1} active={page === 1} onClick={() => setPage(1)} />
            <PageButton label={2} active={page === 2} onClick={() => setPage(2)} />
            <span style={{ padding: "0 4px", fontSize: "13px", color: "#888", fontFamily: FONT }}>...</span>
            <PageButton label={totalPages} active={page === totalPages} onClick={() => setPage(totalPages)} />

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              style={{
                width: 32,
                height: 32,
                borderRadius: "6px",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#888",
              }}
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
