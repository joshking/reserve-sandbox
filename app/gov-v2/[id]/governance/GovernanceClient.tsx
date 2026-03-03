"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Copy, ArrowUpRight, Coins, LayoutGrid, Hash, Users, Lock, PlusCircle,
} from "lucide-react"
import DecorativeTable from "@/components/DecorativeTable"
import ProposalTypeMenu from "@/components/ProposalTypeMenu"

// ── Data ──────────────────────────────────────────────────────────────────────

const proposals = [
  { title: "February 2026 BGCI",          quorum: true, for: "100%", against: "0%", abstain: "0%", status: "Executed" },
  { title: "January 2026 Rebalance",      quorum: true, for: "100%", against: "0%", abstain: "0%", status: "Executed" },
  { title: "December 2025 Rebalance",     quorum: true, for: "100%", against: "0%", abstain: "0%", status: "Executed" },
  { title: "November 2025 Rebalance",     quorum: true, for: "100%", against: "0%", abstain: "0%", status: "Executed" },
  { title: "BGCI October Rebalance",      quorum: true, for: "100%", against: "0%", abstain: "0%", status: "Executed" },
  { title: "update DAO governance cycle", quorum: true, for: "100%", against: "0%", abstain: "0%", status: "Executed" },
  { title: "bgci september rebalance",    quorum: true, for: "100%", against: "0%", abstain: "0%", status: "Executed" },
  { title: "BGCI uDOT dust removal",      quorum: true, for: "100%", against: "0%", abstain: "0%", status: "Executed" },
  { title: "BGCI August Rebalance",       quorum: true, for: "100%", against: "0%", abstain: "0%", status: "Executed" },
  { title: "DTF V4 Upgrade",              quorum: true, for: "100%", against: "0%", abstain: "0%", status: "Executed" },
]

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

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false)
      }
    }
    if (showMenu) document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [showMenu])

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
              fontSize: "14px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 300, color: "#0151af",
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
      {/* Proposal rows */}
      {proposals.map((p, i) => (
        <div key={i} style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "18px 24px",
          borderBottom: "1px solid #e5e5e5",
          cursor: "pointer",
        }}>
          <div>
            <div style={{
              fontSize: "16px", fontFamily: "'TWK Lausanne', sans-serif",
              fontWeight: 500, color: "#0a0d10", marginBottom: "5px",
            }}>
              {p.title}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "5px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "13px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 300, color: "#666" }}>
                Quorum?:
              </span>
              <span style={{ fontSize: "13px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 300, color: "#16a34a" }}>
                {p.quorum ? "Yes" : "No"}
              </span>
              <span style={{ fontSize: "10px", color: "#ccc", lineHeight: 1 }}>●</span>
              <span style={{ fontSize: "13px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 300, color: "#666" }}>
                Votes:
              </span>
              <span style={{ fontSize: "13px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 500, color: "#16a34a" }}>
                {p.for}
              </span>
              <span style={{ fontSize: "13px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 300, color: "#aaa" }}>/</span>
              <span style={{ fontSize: "13px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 500, color: "#dc2626" }}>
                {p.against}
              </span>
              <span style={{ fontSize: "13px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 300, color: "#aaa" }}>/</span>
              <span style={{ fontSize: "13px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 300, color: "#666" }}>
                {p.abstain}
              </span>
            </div>
          </div>
          <div style={{
            padding: "5px 14px", borderRadius: "999px",
            border: "1px solid #e5e5e5",
            fontSize: "13px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 300, color: "#0a0d10",
            whiteSpace: "nowrap", flexShrink: 0, marginLeft: "16px",
          }}>
            {p.status}
          </div>
        </div>
      ))}

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
