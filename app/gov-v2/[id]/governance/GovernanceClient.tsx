"use client"

import { useState, useEffect, useRef } from "react"
import { usePathname, useRouter } from "next/navigation"
import {
  Copy, ArrowUpRight, Coins, LayoutGrid, Hash, Users, Lock, PlusCircle, Search, X,
} from "lucide-react"
import DecorativeTable from "@/components/DecorativeTable"
import ProposalTypeMenu from "@/components/ProposalTypeMenu"

const FONT = "'TWK Lausanne', system-ui, sans-serif"

// ── Data ──────────────────────────────────────────────────────────────────────

const proposals = [
  { title: "February 2026 BGCI",          quorum: true, for: "100%", against: "0%",  abstain: "0%",  status: "Executed", type: "Normal"    },
  { title: "January 2026 Rebalance",      quorum: true, for: "100%", against: "0%",  abstain: "0%",  status: "Executed", type: "Normal"    },
  { title: "March 2026 Rebalance",        quorum: false, for: "0%",  against: "0%",  abstain: "0%",  status: "Active",   type: "Fast"      },
  { title: "Emergency Fee Update",        quorum: false, for: "0%",  against: "0%",  abstain: "0%",  status: "Pending",  type: "Fast"      },
  { title: "December 2025 Rebalance",     quorum: true, for: "100%", against: "0%",  abstain: "0%",  status: "Executed", type: "Normal"    },
  { title: "November 2025 Rebalance",     quorum: true, for: "100%", against: "0%",  abstain: "0%",  status: "Executed", type: "Normal"    },
  { title: "Reduce quorum threshold",     quorum: false, for: "0%",  against: "0%",  abstain: "0%",  status: "Queued",   type: "Normal"    },
  { title: "BGCI October Rebalance",      quorum: true, for: "100%", against: "0%",  abstain: "0%",  status: "Executed", type: "Normal"    },
  { title: "update DAO governance cycle", quorum: true, for: "100%", against: "0%",  abstain: "0%",  status: "Executed", type: "Normal"    },
  { title: "bgci september rebalance",    quorum: true, for: "100%", against: "0%",  abstain: "0%",  status: "Executed", type: "Normal"    },
  { title: "Expand basket to 40 tokens",  quorum: true, for: "60%",  against: "20%", abstain: "20%", status: "Active",   type: "Contested" },
  { title: "BGCI uDOT dust removal",      quorum: true, for: "100%", against: "0%",  abstain: "0%",  status: "Executed", type: "Fast"      },
  { title: "BGCI August Rebalance",       quorum: true, for: "100%", against: "0%",  abstain: "0%",  status: "Executed", type: "Normal"    },
  { title: "DTF V4 Upgrade",              quorum: true, for: "100%", against: "0%",  abstain: "0%",  status: "Executed", type: "Normal"    },
]

const STATUS_FILTERS = ["All", "Active", "Pending", "Queued", "Executed", "Defeated"] as const
type StatusFilter = typeof STATUS_FILTERS[number]

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

// ── Governance Proposal List ──────────────────────────────────────────────────

function GovernanceProposalList() {
  const pathname = usePathname()
  const router = useRouter()
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const [activeFilter, setActiveFilter] = useState<StatusFilter>("All")
  const [searchOpen, setSearchOpen] = useState(false)
  const [search, setSearch] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false)
      }
    }
    if (showMenu) document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [showMenu])

  useEffect(() => {
    if (searchOpen) {
      // Slight delay so the width transition has started before focus
      const t = setTimeout(() => inputRef.current?.focus(), 50)
      return () => clearTimeout(t)
    } else {
      setSearch("")
    }
  }, [searchOpen])

  const filtered = proposals.filter(p => {
    const matchesStatus = activeFilter === "All" || p.status === activeFilter
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase())
    return matchesStatus && matchesSearch
  })

  return (
    <DecorativeTable
      title="Recent proposals"
      headerRight={
        <div ref={menuRef} style={{ position: "relative" }}>
          <button
            onClick={() => setShowMenu(v => !v)}
            style={{
              display: "flex", alignItems: "center", gap: "6px",
              background: "none", border: "none", cursor: "pointer", padding: 0,
              fontSize: "14px", fontFamily: FONT, fontWeight: 300, color: "#0151af",
            }}
          >
            <PlusCircle size={14} color="#0151af" />
            <span>Create proposal</span>
          </button>

          {showMenu && (
            <div style={{
              position: "absolute", top: "calc(100% + 8px)", right: 0,
              zIndex: 50,
            }}>
              <ProposalTypeMenu
                onSelect={(type) => {
                  setShowMenu(false)
                  router.push(`${pathname}/propose?type=${type}`)
                }}
              />
            </div>
          )}
        </div>
      }
    >
      {/* Filter bar */}
      <div style={{
        padding: "10px 16px",
        borderBottom: "1px solid #e5e5e5",
        display: "flex", alignItems: "center", gap: "8px",
      }}>
        {/* Search icon + expanding input */}
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <button
            onClick={() => setSearchOpen(o => !o)}
            style={{
              width: 32, height: 32, borderRadius: "8px", flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              background: searchOpen ? "#0a0d10" : "transparent",
              border: searchOpen ? "none" : "1px solid #e5e5e5",
              cursor: "pointer",
              transition: "background 0.2s ease, border-color 0.2s ease",
            }}
          >
            {searchOpen
              ? <X size={13} color="white" />
              : <Search size={13} color="#666" />
            }
          </button>

          {/* Expanding input wrapper */}
          <div style={{
            maxWidth: searchOpen ? "220px" : "0px",
            opacity: searchOpen ? 1 : 0,
            overflow: "hidden",
            transition: "max-width 0.35s cubic-bezier(0.34, 1.2, 0.64, 1), opacity 0.2s ease",
          }}>
            <input
              ref={inputRef}
              type="text"
              placeholder="Search proposals…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === "Escape" && setSearchOpen(false)}
              style={{
                width: "216px",
                padding: "7px 10px",
                borderRadius: "8px",
                border: "1px solid #e5e5e5",
                background: "#fafafa",
                fontSize: "13px", fontFamily: FONT, fontWeight: 300, color: "#0a0d10",
                outline: "none",
              }}
            />
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 20, background: "#e5e5e5", flexShrink: 0 }} />

        {/* Status filter chips */}
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
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
      </div>

      {/* Proposal rows */}
      {filtered.length === 0 ? (
        <div style={{ padding: "32px 24px", textAlign: "center", fontSize: "14px", fontFamily: FONT, fontWeight: 300, color: "#aaa" }}>
          No proposals found
        </div>
      ) : filtered.map((p, i) => {
        const chipStyle = STATUS_STYLES[p.status] ?? { bg: "#f5f5f5", color: "#555", border: "#e5e5e5" }

        const readoutRow = (
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <span style={{ fontSize: "14px", fontFamily: FONT }}>
              <span style={{ fontWeight: 300, color: "#666" }}>Quorum?: </span>
              <span style={{ fontWeight: 500, color: "#11bb8d" }}>{p.quorum ? "Yes" : "No"}</span>
            </span>
            <div style={{ width: 2, height: 2, background: "#666", flexShrink: 0 }} />
            <span style={{ fontSize: "14px", fontFamily: FONT }}>
              <span style={{ fontWeight: 300, color: "#666" }}>Votes: </span>
              <span style={{ fontWeight: 500, color: "#0151af" }}>{p.for}</span>
              <span style={{ fontWeight: 300, color: "#999" }}> / </span>
              <span style={{ fontWeight: 500, color: "#d05a67" }}>{p.against}</span>
              <span style={{ fontWeight: 300, color: "#999" }}> / </span>
              <span style={{ fontWeight: 300, color: "#666" }}>{p.abstain}</span>
            </span>
          </div>
        )

        const statusBadge = (
          <div style={{
            padding: "8px 10px", borderRadius: "999px",
            border: `1px solid ${chipStyle.border}`,
            background: chipStyle.bg,
            fontSize: "12px", fontFamily: FONT, fontWeight: 700, color: chipStyle.color,
            whiteSpace: "nowrap", flexShrink: 0, marginLeft: "16px",
          }}>
            {p.status}
          </div>
        )

        if (p.type === "Contested") {
          return (
            <div key={i} style={{
              display: "flex", flexDirection: "column", gap: "8px",
              padding: "24px", borderBottom: "1px solid #e5e5e5", cursor: "pointer",
            }}>
              {/* Orange "Contested" pill */}
              <div style={{ display: "inline-flex" }}>
                <div style={{
                  padding: "2px 8px", borderRadius: "16px",
                  border: "1px solid #ff8a00", background: "rgba(255,138,0,0.2)",
                  fontSize: "12px", fontFamily: FONT, fontWeight: 300, color: "#ff8a00",
                }}>
                  Contested
                </div>
              </div>
              {/* Content + badge */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div style={{ fontSize: "16px", fontFamily: FONT, fontWeight: 700, color: "#0a0d10" }}>{p.title}</div>
                  {readoutRow}
                </div>
                {statusBadge}
              </div>
            </div>
          )
        }

        if (p.type === "Fast") {
          return (
            <div key={i} style={{
              display: "flex", flexDirection: "column", gap: "8px",
              padding: "24px", borderBottom: "1px solid #e5e5e5", cursor: "pointer",
            }}>
              {/* Cyan "Fast" pill */}
              <div style={{ display: "inline-flex" }}>
                <div style={{
                  padding: "2px 8px", borderRadius: "16px",
                  border: "1px solid #a5f3fc", background: "rgba(8,145,178,0.1)",
                  fontSize: "12px", fontFamily: FONT, fontWeight: 300, color: "#0891b2",
                }}>
                  Fast
                </div>
              </div>
              {/* Content + badge */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div style={{ fontSize: "16px", fontFamily: FONT, fontWeight: 700, color: "#0a0d10" }}>{p.title}</div>
                  {readoutRow}
                </div>
                {statusBadge}
              </div>
            </div>
          )
        }

        return (
          <div key={i} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "18px 24px", borderBottom: "1px solid #e5e5e5", cursor: "pointer",
          }}>
            <div>
              <div style={{ fontSize: "16px", fontFamily: FONT, fontWeight: 500, color: "#0a0d10", marginBottom: "5px" }}>
                {p.title}
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
              border: `1px solid ${chipStyle.border}`, background: chipStyle.bg,
              fontSize: "13px", fontFamily: FONT, fontWeight: 400, color: chipStyle.color,
              whiteSpace: "nowrap", flexShrink: 0, marginLeft: "16px",
            }}>
              {p.status}
            </div>
          </div>
        )
      })}


      {/* Show all */}
      <div style={{ padding: "16px 24px" }}>
        <button style={{
          width: "100%", padding: "14px", borderRadius: "12px",
          border: "1px solid #e5e5e5", background: "white",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer",
          fontSize: "14px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 500, color: "#0a0d10",
        }}>
          Show all
        </button>
      </div>
    </DecorativeTable>
  )
}

// ── Governance Stats Panel ─────────────────────────────────────────────────────

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
          fontSize: "14px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 500, color: "#0151af",
        }}>
          3.42% APR
        </div>
      </div>

      <div style={{ padding: "20px" }}>
        {/* Title */}
        <h2 style={{
          fontSize: "22px", fontFamily: "'TWK Lausanne', sans-serif",
          fontWeight: 700, color: "#0a0d10", margin: "0 0 10px", lineHeight: 1.2,
        }}>
          Governed by $vIRSR-BGCI
        </h2>

        {/* Description */}
        <p style={{
          fontSize: "14px", fontFamily: "'TWK Lausanne', sans-serif",
          fontWeight: 300, color: "#0a0d10", lineHeight: 1.65, margin: "0 0 18px",
        }}>
          $RSR holders must vote-lock their tokens to become a governor. In exchange for locking
          their tokens and participating in governance, governors earn a portion of the TVL fee
          charged by the DTF.
        </p>

        {/* Vote-lock CTA */}
        <button style={{
          width: "100%", padding: "14px", borderRadius: "12px",
          border: "none", background: "#0151af",
          display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
          cursor: "pointer", marginBottom: "4px",
          fontSize: "15px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 500, color: "white",
        }}>
          <Lock size={15} color="white" />
          <span>Vote-lock $RSR</span>
        </button>

        {/* Stat rows */}
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
              <span style={{ fontSize: "14px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 300, color: "#666" }}>
                {label}
              </span>
            </div>
            <span style={{ fontSize: "15px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 700, color: "#0a0d10" }}>
              {value}
            </span>
          </div>
        ))}

        {/* Guardian rows */}
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
                <div style={{ fontSize: "11px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 300, color: "#999", marginBottom: "2px" }}>
                  Guardians
                </div>
                <div style={{ fontSize: "14px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 500, color: "#0a0d10" }}>
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

        {/* Top voting addresses */}
        <div style={{ marginTop: "12px" }}>
          <div style={{
            fontSize: "16px", fontFamily: "'TWK Lausanne', sans-serif",
            fontWeight: 500, color: "#0a0d10", marginBottom: "10px",
          }}>
            Top voting addresses
          </div>

          {/* Table header */}
          <div style={{ display: "flex", padding: "8px 0", borderBottom: "1px solid #e5e5e5" }}>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: "12px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 300, color: "#999" }}>Address</span>
            </div>
            <div style={{ width: 110, textAlign: "right" }}>
              <span style={{ fontSize: "12px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 300, color: "#999" }}>Votes</span>
            </div>
            <div style={{ width: 80, textAlign: "right" }}>
              <span style={{ fontSize: "12px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 300, color: "#999" }}>Vote weight</span>
            </div>
          </div>

          {/* Voter rows */}
          {topVoters.map((voter, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center",
              padding: "10px 0",
              borderBottom: i < topVoters.length - 1 ? "1px solid #e5e5e5" : "none",
            }}>
              <div style={{ flex: 1 }}>
                <span style={{
                  fontSize: "13px", fontFamily: "'TWK Lausanne', sans-serif",
                  fontWeight: 300, color: "#0151af", cursor: "pointer",
                }}>
                  {voter.address}
                </span>
              </div>
              <div style={{ width: 110, textAlign: "right" }}>
                <span style={{ fontSize: "13px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 300, color: "#0a0d10" }}>
                  {voter.votes}
                </span>
              </div>
              <div style={{ width: 80, textAlign: "right" }}>
                <span style={{ fontSize: "13px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 300, color: "#0a0d10" }}>
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

export default function GovernanceClient() {
  return (
    <>
      {/* Left column */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
        <GovernanceProposalList />
      </div>

      {/* Right column */}
      <div style={{ width: 458, flexShrink: 0, position: "sticky", top: "16px", alignSelf: "flex-start" }}>
        <GovernanceStatsPanel />
      </div>
    </>
  )
}
