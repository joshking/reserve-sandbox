"use client"

import { useState } from "react"
import Link from "next/link"
import { Copy, ArrowUpRight, Coins, LayoutGrid, Hash, Users, Lock, PlusCircle, Search } from "lucide-react"
import DecorativeTable from "@/components/DecorativeTable"

const FONT = "'TWK Lausanne', system-ui, sans-serif"

// ── Data ──────────────────────────────────────────────────────────────────────

const proposals = [
  { title: "February 2026 BGCI",          quorum: true, for: "100%", against: "0%",  abstain: "0%",  status: "Executed", type: "Normal"    },
  { title: "January 2026 Rebalance",      quorum: true, for: "100%", against: "0%",  abstain: "0%",  status: "Executed", type: "Normal"    },
  { title: "March 2026 Rebalance",        quorum: false, for: "0%",  against: "12%", abstain: "0%",  status: "Active",   type: "Fast"      },
  { title: "Emergency Fee Update",        quorum: false, for: "0%",  against: "0%",  abstain: "0%",  status: "Pending",  type: "Fast"      },
  { title: "December 2025 Rebalance",     quorum: true, for: "100%", against: "0%",  abstain: "0%",  status: "Executed", type: "Normal"    },
  { title: "November 2025 Rebalance",     quorum: true, for: "100%", against: "0%",  abstain: "0%",  status: "Executed", type: "Normal"    },
  { title: "Reduce quorum threshold",     quorum: false, for: "0%",  against: "0%",  abstain: "0%",  status: "Queued",   type: "Normal"    },
  { title: "BGCI October Rebalance",      quorum: true, for: "100%", against: "0%",  abstain: "0%",  status: "Executed", type: "Normal"    },
  { title: "update DAO governance cycle", quorum: true, for: "100%", against: "0%",  abstain: "0%",  status: "Executed", type: "Normal"    },
  { title: "bgci september rebalance",    quorum: true, for: "100%", against: "0%",  abstain: "0%",  status: "Executed", type: "Normal"    },
  { title: "Expand basket to 40 tokens",  quorum: true, for: "60%",  against: "20%", abstain: "20%", status: "Active",   type: "Contested" },
  { title: "BGCI uDOT dust removal",      quorum: true, for: "100%", against: "32%", abstain: "0%",  status: "Executed", type: "Fast"      },
  { title: "BGCI August Rebalance",       quorum: true, for: "100%", against: "0%",  abstain: "0%",  status: "Executed", type: "Normal"    },
  { title: "DTF V4 Upgrade",              quorum: true, for: "100%", against: "0%",  abstain: "0%",  status: "Executed", type: "Normal"    },
]

const STATUS_FILTERS = ["All", "Active", "Pending", "Queued", "Executed", "Defeated"] as const
type StatusFilter = typeof STATUS_FILTERS[number]

const STATUS_ORDER: Record<string, number> = { Active: 0, Pending: 1, Queued: 2, Executed: 3, Defeated: 4 }

const STATUS_STYLES: Record<string, { bg: string; color: string; border: string }> = {
  Active:   { bg: "#eff6ff", color: "#0151af", border: "#bfdbfe" },
  Pending:  { bg: "#fff7ed", color: "#c2410c", border: "#fed7aa" },
  Queued:   { bg: "#f5f5f5", color: "#555",    border: "#e5e5e5" },
  Executed: { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0" },
  Defeated: { bg: "#fef2f2", color: "#dc2626", border: "#fecaca" },
}

const topVoters = [
  { address: "0xD8B0...C940", votes: "5,079,818.00", weight: "10.84%" },
  { address: "0xb209...5015", votes: "5,000,000.00", weight: "10.67%" },
  { address: "0x49B4...6c52", votes: "4,874,620.00", weight: "10.4%"  },
  { address: "0xb3E2...E6fB", votes: "4,240,293.96", weight: "9.05%"  },
  { address: "0x03d0...da99", votes: "3,065,453.56", weight: "6.54%"  },
  { address: "0xFC0...e065",  votes: "2,000,000.00", weight: "4.27%"  },
]

const guardians = ["0x6f1D...f298", "0xD8B0...C940"]

const govStats = [
  { label: "Proposals",        value: "34",               Icon: LayoutGrid },
  { label: "Vote Supply",      value: "46,871,321",        Icon: Coins },
  { label: "Voting Addresses", value: "78",               Icon: Users },
  { label: "Vote locked",      value: "8.4K $vIRSR-BGCI", Icon: Hash },
]

// ── Proposal List ─────────────────────────────────────────────────────────────

function ProposalList() {
  const [activeFilter, setActiveFilter] = useState<StatusFilter>("All")
  const [search, setSearch] = useState("")

  const filtered = proposals
    .filter(p => {
      const matchesStatus = activeFilter === "All" || p.status === activeFilter
      const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase())
      return matchesStatus && matchesSearch
    })
    .sort((a, b) => (STATUS_ORDER[a.status] ?? 99) - (STATUS_ORDER[b.status] ?? 99))

  return (
    <DecorativeTable
      title="Recent proposals"
      headerRight={
        <Link
          href="/gov-v1/connect-wallet"
          style={{
            display: "flex", alignItems: "center", gap: "6px",
            fontSize: "14px", fontFamily: FONT, fontWeight: 300, color: "#0151af",
            textDecoration: "none",
          }}
        >
          <PlusCircle size={14} color="#0151af" />
          <span>Create proposal</span>
        </Link>
      }
    >
      {/* Filter + Search bar */}
      <div style={{ padding: "12px 16px", borderBottom: "1px solid #e5e5e5", display: "flex", flexDirection: "column", gap: "10px" }}>
        {/* Status filter chips */}
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {STATUS_FILTERS.map(status => {
            const isActive = activeFilter === status
            const style = status !== "All" ? STATUS_STYLES[status] : null
            return (
              <button
                key={status}
                onClick={() => setActiveFilter(status)}
                style={{
                  padding: "5px 13px", borderRadius: "999px", cursor: "pointer",
                  fontSize: "13px", fontFamily: FONT, fontWeight: 400,
                  border: isActive
                    ? `1px solid ${style?.border ?? "#0a0d10"}`
                    : "1px solid #e5e5e5",
                  background: isActive ? (style?.bg ?? "#0a0d10") : "white",
                  color: isActive ? (style?.color ?? "white") : "#666",
                  transition: "all 0.15s",
                }}
              >
                {status}
              </button>
            )
          })}
        </div>

        {/* Search input */}
        <div style={{ position: "relative" }}>
          <Search size={14} color="#aaa" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
          <input
            type="text"
            placeholder="Search proposals…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: "100%", boxSizing: "border-box",
              padding: "9px 12px 9px 34px", borderRadius: "10px",
              border: "1px solid #e5e5e5", background: "#fafafa",
              fontSize: "13px", fontFamily: FONT, fontWeight: 300, color: "#0a0d10",
              outline: "none",
            }}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div style={{ padding: "32px 24px", textAlign: "center", fontSize: "14px", fontFamily: FONT, fontWeight: 300, color: "#aaa" }}>
          No proposals found
        </div>
      ) : filtered.map((p, i) => {
        const chipStyle = STATUS_STYLES[p.status] ?? { bg: "#f5f5f5", color: "#555", border: "#e5e5e5" }
        return (
          <div key={i} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "18px 24px",
            borderBottom: "1px solid #e5e5e5",
            cursor: "pointer",
          }}>
            <div>
              <div style={{
                display: "flex", alignItems: "center", gap: "8px", marginBottom: "5px",
              }}>
                <span style={{ fontSize: "16px", fontFamily: FONT, fontWeight: 500, color: "#0a0d10" }}>
                  {p.title}
                </span>
                {p.type === "Contested" && (
                  <span style={{
                    padding: "2px 8px", borderRadius: "16px",
                    border: "1px solid #ff8a00", background: "rgba(255,138,0,0.2)",
                    fontSize: "11px", fontFamily: FONT, fontWeight: 300, color: "#ff8a00",
                    whiteSpace: "nowrap",
                  }}>
                    Contested
                  </span>
                )}
                {p.type === "Fast" && (
                  <span style={{
                    padding: "2px 8px", borderRadius: "16px",
                    border: "1px solid #a5f3fc", background: "rgba(8,145,178,0.1)",
                    fontSize: "11px", fontFamily: FONT, fontWeight: 300, color: "#0891b2",
                    whiteSpace: "nowrap",
                  }}>
                    Fast
                  </span>
                )}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "5px", flexWrap: "wrap" }}>
                <span style={{ fontSize: "13px", fontFamily: FONT, fontWeight: 300, color: "#666" }}>Quorum?:</span>
                <span style={{ fontSize: "13px", fontFamily: FONT, fontWeight: 300, color: "#16a34a" }}>{p.quorum ? "Yes" : "No"}</span>
                <span style={{ fontSize: "10px", color: "#ccc", lineHeight: 1 }}>●</span>
                <span style={{ fontSize: "13px", fontFamily: FONT, fontWeight: 300, color: "#666" }}>Votes:</span>
                <span style={{ fontSize: "13px", fontFamily: FONT, fontWeight: 500, color: "#16a34a" }}>{p.for}</span>
                <span style={{ fontSize: "13px", fontFamily: FONT, fontWeight: 300, color: "#aaa" }}>/</span>
                <span style={{ fontSize: "13px", fontFamily: FONT, fontWeight: 500, color: "#dc2626" }}>{p.against}</span>
                <span style={{ fontSize: "13px", fontFamily: FONT, fontWeight: 300, color: "#aaa" }}>/</span>
                <span style={{ fontSize: "13px", fontFamily: FONT, fontWeight: 300, color: "#666" }}>{p.abstain}</span>
              </div>
            </div>
            <div style={{
              padding: "5px 14px", borderRadius: "999px",
              border: `1px solid ${chipStyle.border}`,
              background: chipStyle.bg,
              fontSize: "13px", fontFamily: FONT, fontWeight: 400, color: chipStyle.color,
              whiteSpace: "nowrap", flexShrink: 0, marginLeft: "16px",
            }}>
              {p.status}
            </div>
          </div>
        )
      })}

      <div style={{ padding: "16px 24px" }}>
        <button style={{
          width: "100%", padding: "14px", borderRadius: "12px",
          border: "1px solid #e5e5e5", background: "white",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer",
          fontSize: "14px", fontFamily: FONT, fontWeight: 500, color: "#0a0d10",
        }}>
          Show all
        </button>
      </div>
    </DecorativeTable>
  )
}

// ── Stats Panel ───────────────────────────────────────────────────────────────

function GovernanceStatsPanel() {
  return (
    <div style={{ background: "white", borderRadius: "20px", overflow: "hidden" }}>
      {/* Top row: icon + APR badge */}
      <div style={{
        padding: "16px 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        borderBottom: "1px solid #e5e5e5",
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: "50%", background: "#0a0d10",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Hash size={18} color="white" />
        </div>
        <div style={{
          padding: "5px 14px", borderRadius: "999px",
          border: "1px solid #0151af",
          fontSize: "14px", fontFamily: FONT, fontWeight: 500, color: "#0151af",
        }}>
          3.42% APR
        </div>
      </div>

      <div style={{ padding: "20px" }}>
        <h2 style={{
          fontSize: "22px", fontFamily: FONT,
          fontWeight: 700, color: "#0a0d10", margin: "0 0 10px", lineHeight: 1.2,
        }}>
          Governed by $vIRSR-BGCI
        </h2>

        <p style={{
          fontSize: "14px", fontFamily: FONT,
          fontWeight: 300, color: "#0a0d10", lineHeight: 1.65, margin: "0 0 18px",
        }}>
          $RSR holders must vote-lock their tokens to become a governor. In exchange for locking
          their tokens and participating in governance, governors earn a portion of the TVL fee
          charged by the DTF.
        </p>

        <button style={{
          width: "100%", padding: "14px", borderRadius: "12px",
          border: "none", background: "#0151af",
          display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
          cursor: "pointer", marginBottom: "4px",
          fontSize: "15px", fontFamily: FONT, fontWeight: 500, color: "white",
        }}>
          <Lock size={15} color="white" />
          <span>Vote-lock $RSR</span>
        </button>

        {govStats.map(({ label, value, Icon }) => (
          <div key={label} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "14px 0", borderBottom: "1px solid #e5e5e5",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                border: "1px solid #e5e5e5",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <Icon size={15} color="#0a0d10" />
              </div>
              <span style={{ fontSize: "14px", fontFamily: FONT, fontWeight: 300, color: "#666" }}>
                {label}
              </span>
            </div>
            <span style={{ fontSize: "15px", fontFamily: FONT, fontWeight: 700, color: "#0a0d10" }}>
              {value}
            </span>
          </div>
        ))}

        {guardians.map((addr, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "14px 0", borderBottom: "1px solid #e5e5e5",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                border: "1px solid #e5e5e5",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <Users size={15} color="#0a0d10" />
              </div>
              <div>
                <div style={{ fontSize: "11px", fontFamily: FONT, fontWeight: 300, color: "#999", marginBottom: "2px" }}>
                  Guardians
                </div>
                <div style={{ fontSize: "14px", fontFamily: FONT, fontWeight: 500, color: "#0a0d10" }}>
                  {addr}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "4px" }}>
              <button style={{
                width: 24, height: 24, borderRadius: "4px",
                background: "#0a0d10", border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Copy size={11} color="white" />
              </button>
              <button style={{
                width: 24, height: 24, borderRadius: "4px",
                background: "none", border: "1px solid #e5e5e5", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <ArrowUpRight size={11} color="#0a0d10" />
              </button>
            </div>
          </div>
        ))}

        <div style={{ marginTop: "12px" }}>
          <div style={{
            fontSize: "16px", fontFamily: FONT,
            fontWeight: 500, color: "#0a0d10", marginBottom: "10px",
          }}>
            Top voting addresses
          </div>

          <div style={{ display: "flex", padding: "8px 0", borderBottom: "1px solid #e5e5e5" }}>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: "12px", fontFamily: FONT, fontWeight: 300, color: "#999" }}>Address</span>
            </div>
            <div style={{ width: 110, textAlign: "right" }}>
              <span style={{ fontSize: "12px", fontFamily: FONT, fontWeight: 300, color: "#999" }}>Votes</span>
            </div>
            <div style={{ width: 80, textAlign: "right" }}>
              <span style={{ fontSize: "12px", fontFamily: FONT, fontWeight: 300, color: "#999" }}>Vote weight</span>
            </div>
          </div>

          {topVoters.map((voter, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center",
              padding: "10px 0",
              borderBottom: i < topVoters.length - 1 ? "1px solid #e5e5e5" : "none",
            }}>
              <div style={{ flex: 1 }}>
                <span style={{
                  fontSize: "13px", fontFamily: FONT,
                  fontWeight: 300, color: "#0151af", cursor: "pointer",
                }}>
                  {voter.address}
                </span>
              </div>
              <div style={{ width: 110, textAlign: "right" }}>
                <span style={{ fontSize: "13px", fontFamily: FONT, fontWeight: 300, color: "#0a0d10" }}>
                  {voter.votes}
                </span>
              </div>
              <div style={{ width: 80, textAlign: "right" }}>
                <span style={{ fontSize: "13px", fontFamily: FONT, fontWeight: 300, color: "#0a0d10" }}>
                  {voter.weight}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function GovV1Client() {
  return (
    <>
      {/* Left column */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
        <ProposalList />
      </div>

      {/* Right column */}
      <div style={{ width: 458, flexShrink: 0, position: "sticky", top: "16px", alignSelf: "flex-start" }}>
        <GovernanceStatsPanel />
      </div>
    </>
  )
}
