"use client"

import { useState } from "react"
import { Diamond, LayoutGrid, ChevronDown, Tag } from "lucide-react"

const FONT = "'TWK Lausanne', system-ui, sans-serif"

// ── Types ────────────────────────────────────────────────────────────────────

type Status = "Pending" | "Active" | "Queued" | "Executed" | "Defeated"
type Category = "All" | "Yield" | "Index"

type Proposal = {
  token: string
  tokenBg: string
  title: string
  timingLabel: string | null   // "Voting starts in: 20 hours" etc.
  quorum: boolean | null       // null = not shown
  votesFor: string | null
  votesAgainst: string | null
  votesAbstain: string | null
  createdAt: string
  status: Status
}

// ── Data ────────────────────────────────────────────────────────────────────

const proposals: Proposal[] = [
  { token: "mvDEFI", tokenBg: "#6366f1", title: "Renounce ProxyAdmin Ownership For MvDEFI Index DTF",                   timingLabel: "Voting starts in: 20 hours",     quorum: null,  votesFor: null,   votesAgainst: null, votesAbstain: null, createdAt: "2026-3-12", status: "Pending" },
  { token: "hyUSD",  tokenBg: "#f59e0b", title: "Deprecate HyUSD (Mainnet)",                                             timingLabel: "Voting starts in: 1 day, 20 hours", quorum: null, votesFor: null,   votesAgainst: null, votesAbstain: null, createdAt: "2026-3-12", status: "Pending" },
  { token: "mvRWA",  tokenBg: "#0ea5e9", title: "Renounce ProxyAdmin Ownership For MvRWA Index DTF",                    timingLabel: "Voting starts in: 20 hours",     quorum: null,  votesFor: null,   votesAgainst: null, votesAbstain: null, createdAt: "2026-3-12", status: "Pending" },
  { token: "dgnETH", tokenBg: "#6d28d9", title: "Deprecate DgnETH",                                                      timingLabel: "Voting ends in: 2 days, 21 hours", quorum: false, votesFor: "0%",  votesAgainst: "0%", votesAbstain: "0%", createdAt: "2026-3-10", status: "Active"  },
  { token: "mvDEFI", tokenBg: "#6366f1", title: "Deprecate MvDEFI Index DTF",                                            timingLabel: "Voting ends in: 3 days, 21 hours", quorum: true,  votesFor: "100%",votesAgainst: "0%", votesAbstain: "0%", createdAt: "2026-3-10", status: "Active"  },
  { token: "MVDA25", tokenBg: "#0d9488", title: "Deprecate MVDA25 Index DTF",                                            timingLabel: "Voting ends in: 2 days, 21 hours", quorum: false, votesFor: "0%",  votesAgainst: "0%", votesAbstain: "0%", createdAt: "2026-3-10", status: "Active"  },
  { token: "VTF",    tokenBg: "#065f46", title: "Deprecate VTF Index DTF",                                               timingLabel: "Voting ends in: 2 days, 21 hours", quorum: false, votesFor: "0%",  votesAgainst: "0%", votesAbstain: "0%", createdAt: "2026-3-10", status: "Active"  },
  { token: "AI",     tokenBg: "#0891b2", title: "Deprecate AI Index DTF",                                                timingLabel: "Voting ends in: 8 days, 21 hours", quorum: false, votesFor: "100%",votesAgainst: "0%", votesAbstain: "0%", createdAt: "2026-3-10", status: "Active"  },
  { token: "mvRWA",  tokenBg: "#0ea5e9", title: "Deprecate MvRWA Index DTF",                                             timingLabel: "Voting ends in: 3 days, 18 hours", quorum: true,  votesFor: "100%",votesAgainst: "0%", votesAbstain: "0%", createdAt: "2026-3-10", status: "Active"  },
  { token: "ixEdel", tokenBg: "#1e1b4b", title: "Onboarding ABC Labs As Guardians, Brand Managers And Acution Launcher", timingLabel: "Voting ends in: 2 days, 17 hours", quorum: true,  votesFor: "100%",votesAgainst: "0%", votesAbstain: "0%", createdAt: "2026-3-10", status: "Active"  },
  { token: "ixEdel", tokenBg: "#1e1b4b", title: "Release 5.0.0 Upgrade",                                                 timingLabel: "Voting ends in: 2 days, 17 hours", quorum: true,  votesFor: "100%",votesAgainst: "0%", votesAbstain: "0%", createdAt: "2026-3-10", status: "Active"  },
  { token: "ABX",    tokenBg: "#1d4ed8", title: "March V2",                                                               timingLabel: null,                             quorum: true,  votesFor: "100%",votesAgainst: "0%", votesAbstain: "0%", createdAt: "2026-3-10", status: "Queued"  },
]

const STATUS_STYLES: Record<Status, { bg: string; color: string }> = {
  Pending:  { bg: "#fff7ed", color: "#ea580c" },
  Active:   { bg: "#eff6ff", color: "#3b82f6" },
  Queued:   { bg: "#f3e8ff", color: "#7c3aed" },
  Executed: { bg: "#f0fdf4", color: "#16a34a" },
  Defeated: { bg: "#fef2f2", color: "#dc2626" },
}

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
        fontSize: "8px",
        fontWeight: 700,
        color: "white",
        fontFamily: FONT,
        flexShrink: 0,
        border: "1px solid rgba(0,0,0,0.08)",
      }}
    >
      {token.slice(0, 3).toUpperCase()}
    </div>
  )
}

function StatusBadge({ status }: { status: Status }) {
  const s = STATUS_STYLES[status]
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "4px 14px",
        borderRadius: "999px",
        fontSize: "13px",
        fontFamily: FONT,
        fontWeight: 500,
        background: s.bg,
        color: s.color,
        whiteSpace: "nowrap",
      }}
    >
      {status}
    </span>
  )
}

function VotesLine({
  quorum,
  votesFor,
  votesAgainst,
  votesAbstain,
}: {
  quorum: boolean
  votesFor: string
  votesAgainst: string
  votesAbstain: string
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "4px", flexWrap: "wrap" }}>
      <span style={{ fontSize: "12px", fontFamily: FONT, fontWeight: 300, color: "#888" }}>Quorum?:</span>
      <span style={{ fontSize: "12px", fontFamily: FONT, fontWeight: 500, color: quorum ? "#16a34a" : "#dc2626" }}>
        {quorum ? "Yes" : "No"}
      </span>
      <span style={{ fontSize: "12px", color: "#ccc", margin: "0 2px" }}>◦</span>
      <span style={{ fontSize: "12px", fontFamily: FONT, fontWeight: 300, color: "#888" }}>Votes:</span>
      <span style={{ fontSize: "12px", fontFamily: FONT, fontWeight: 500, color: votesFor !== "0%" ? "#0151af" : "#888" }}>
        {votesFor}
      </span>
      <span style={{ fontSize: "12px", color: "#ccc" }}>/</span>
      <span style={{ fontSize: "12px", fontFamily: FONT, fontWeight: 500, color: votesAgainst !== "0%" ? "#dc2626" : "#888" }}>
        {votesAgainst}
      </span>
      <span style={{ fontSize: "12px", color: "#ccc" }}>/</span>
      <span style={{ fontSize: "12px", fontFamily: FONT, fontWeight: 300, color: "#888" }}>
        {votesAbstain}
      </span>
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

// ── Main ─────────────────────────────────────────────────────────────────────

export default function GovernanceTable() {
  const [category, setCategory] = useState<Category>("All")

  const CATEGORIES: Category[] = ["All", "Yield", "Index"]

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

      {/* Filter row */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "12px" }}>
        {/* Heading */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Diamond size={18} color="#0a0d10" strokeWidth={1.5} />
          <span style={{ fontSize: "18px", fontFamily: FONT, fontWeight: 700, color: "#0a0d10" }}>
            Proposals
          </span>
        </div>

        {/* Right filters */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: "12px" }}>

          {/* Category pill toggle */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              border: "1px solid #e5e5e5",
              borderRadius: "8px",
              overflow: "hidden",
              background: "white",
            }}
          >
            {CATEGORIES.map((cat, i) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                style={{
                  padding: "6px 14px",
                  border: "none",
                  borderLeft: i > 0 ? "1px solid #e5e5e5" : "none",
                  background: category === cat ? "#0151af" : "transparent",
                  color: category === cat ? "white" : "#888",
                  fontSize: "13px",
                  fontFamily: FONT,
                  fontWeight: category === cat ? 600 : 400,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Labeled dropdowns */}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <span style={{ fontSize: "11px", fontFamily: FONT, fontWeight: 400, color: "#aaa" }}>Tokens</span>
            <FilterDropdown icon={<LayoutGrid size={13} color="#888" />} label="All tokens" />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <span style={{ fontSize: "11px", fontFamily: FONT, fontWeight: 400, color: "#aaa" }}>Status</span>
            <FilterDropdown icon={<Tag size={13} color="#888" />} label="All statuses" />
          </div>
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
        {/* Header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "160px 1fr 150px 160px",
            borderBottom: "1px solid #e5e5e5",
            padding: "0 16px",
          }}
        >
          {["Token", "Description", "Created At", "Status"].map((col) => (
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
        {proposals.map((p, i) => (
          <div
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "160px 1fr 150px 160px",
              borderBottom: i < proposals.length - 1 ? "1px solid #e5e5e5" : "none",
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
            <div style={{ padding: "16px 8px", display: "flex", alignItems: "center", gap: "8px" }}>
              <TokenLogo token={p.token} bg={p.tokenBg} />
              <span style={{ fontSize: "14px", fontFamily: FONT, fontWeight: 400, color: "#0a0d10" }}>
                {p.token}
              </span>
            </div>

            {/* Description */}
            <div style={{ padding: "16px 8px", display: "flex", flexDirection: "column", gap: "3px" }}>
              <span
                style={{
                  fontSize: "14px",
                  fontFamily: FONT,
                  fontWeight: 400,
                  color: "#0151af",
                  textDecoration: "underline",
                  textDecorationColor: "rgba(1,81,175,0.3)",
                  cursor: "pointer",
                  lineHeight: 1.4,
                }}
              >
                {p.title}
              </span>
              {p.timingLabel && (
                <span style={{ fontSize: "12px", fontFamily: FONT, fontWeight: 300, color: "#888" }}>
                  {p.timingLabel}
                </span>
              )}
              {p.quorum !== null && p.votesFor !== null && (
                <VotesLine
                  quorum={p.quorum}
                  votesFor={p.votesFor}
                  votesAgainst={p.votesAgainst!}
                  votesAbstain={p.votesAbstain!}
                />
              )}
            </div>

            {/* Created At */}
            <div style={{ padding: "16px 8px" }}>
              <span style={{ fontSize: "14px", fontFamily: FONT, fontWeight: 400, color: "#0a0d10" }}>
                {p.createdAt}
              </span>
            </div>

            {/* Status */}
            <div style={{ padding: "16px 8px" }}>
              <StatusBadge status={p.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
