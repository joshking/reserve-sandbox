"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft, Calendar, FileText, Copy, ArrowUpRight,
  ThumbsUp, ThumbsDown, X, Clock, Circle, Loader2,
} from "lucide-react"

const FONT = "'TWK Lausanne', system-ui, sans-serif"
const BLUE = "#0151af"
const BORDER = "#e5e5e5"

// ── Static data ───────────────────────────────────────────────────────────────

const BASKET_TOKENS = [
  { name: "BORED",   address: "0x7073...e196", current: "12.04%", expected: "12.78%", delta: "+0.74%", color: "#22c55e" },
  { name: "NOJEET",  address: "0xA684...31f1", current: "10.69%", expected: "12.32%", delta: "+1.63%", color: "#f97316" },
  { name: "DOG",     address: "0x3b91...9e1e", current: "10.46%", expected: "12.11%", delta: "+1.65%", color: "#8b5cf6" },
  { name: "REKT",    address: "0xB3e3...ebbA", current: "14.43%", expected: "11.43%", delta: "-3%",    color: "#ef4444" },
  { name: "TOSHI",   address: "0xAC1B...B2B4", current: "12.85%", expected: "13.35%", delta: "+0.5%",  color: "#3b82f6" },
  { name: "TOSHI",   address: "0xAC1B...B2B4", current: "12.85%", expected: "13.35%", delta: "+0.5%",  color: "#3b82f6" },
  { name: "AEROBUD", address: "0xFad8...5a0d", current: "13.03%", expected: "13.47%", delta: "+0.44%", color: "#eab308" },
  { name: "MIGGLES", address: "0xB1a0...f25d", current: "14.04%", expected: "12.32%", delta: "-1.72%", color: "#ec4899" },
  { name: "SKI",     address: "0x768B...0149", current: "12.46%", expected: "12.23%", delta: "-0.23%", color: "#06b6d4" },
]

const STATUS_ITEMS = [
  {
    icon: "circle" as const,
    time: "Mon Feb 23, 09:30 am",
    title: "Proposal created",
    subtitle: "By: 0x6905...C8dE",
    isActive: false,
  },
  {
    icon: "clock" as const,
    time: null,
    title: "Voting delay",
    subtitle: "2 days\nBy: 0x6905...C8dE",
    isActive: false,
  },
  {
    icon: "clock" as const,
    time: null,
    title: "Voting delay",
    subtitle: "2 days",
    isActive: false,
  },
  {
    icon: "play" as const,
    time: null,
    title: "Voting Period",
    subtitle: "Wed Feb 25, 09:30 am",
    isActive: true,
  },
  {
    icon: "clock" as const,
    time: "Sat Feb 28, 09:30 am",
    title: "Voting Period Ends",
    subtitle: "in 22 hours, 1 minute, 51 seconds",
    isActive: false,
  },
]

// ── Basket Change Table ───────────────────────────────────────────────────────

function BasketChangeTable() {
  const [view, setView] = useState<"summary" | "raw">("summary")

  return (
    <div style={{ background: "white", borderRadius: "16px", overflow: "hidden", border: `1px solid ${BORDER}` }}>
      {/* Section header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "20px 24px", borderBottom: `1px solid ${BORDER}`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "18px", fontWeight: 700, color: BLUE, fontFamily: FONT }}>
            Basket Change
          </span>
          <ArrowUpRight size={16} color={BLUE} />
        </div>
        <div style={{
          display: "flex", background: "#f2f2f2", borderRadius: "8px", padding: "3px",
        }}>
          {(["summary", "raw"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              style={{
                padding: "6px 14px", borderRadius: "6px", border: "none",
                background: view === v ? "white" : "transparent",
                boxShadow: view === v ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                fontSize: "14px", fontWeight: 500, color: view === v ? "#0a0d10" : "#888",
                cursor: "pointer", fontFamily: FONT,
                textTransform: "capitalize",
              }}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{
              padding: "10px 24px", textAlign: "left",
              fontSize: "13px", fontWeight: 300, color: "#999", fontFamily: FONT,
              borderBottom: `1px solid ${BORDER}`, background: "white",
            }}>
              Token
            </th>
            <th style={{
              padding: "10px 16px", textAlign: "right",
              fontSize: "13px", fontWeight: 300, color: "#999", fontFamily: FONT,
              borderBottom: `1px solid ${BORDER}`, background: "white",
            }}>
              Current
            </th>
            <th style={{
              padding: "10px 16px", textAlign: "right",
              fontSize: "13px", fontWeight: 500, color: BLUE, fontFamily: FONT,
              borderBottom: `1px solid ${BORDER}`, background: "#eff5ff",
            }}>
              Expected
            </th>
            <th style={{
              padding: "10px 24px 10px 16px", textAlign: "right",
              fontSize: "13px", fontWeight: 300, color: "#999", fontFamily: FONT,
              borderBottom: `1px solid ${BORDER}`, background: "white",
            }}>
              Delta
            </th>
          </tr>
        </thead>
        <tbody>
          {BASKET_TOKENS.map((token, i) => {
            const isPositive = token.delta.startsWith("+")
            const isNegative = token.delta.startsWith("-")
            return (
              <tr key={i} style={{ borderBottom: i < BASKET_TOKENS.length - 1 ? `1px solid ${BORDER}` : "none" }}>
                {/* Token */}
                <td style={{ padding: "14px 24px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{
                      width: "32px", height: "32px", borderRadius: "50%",
                      background: token.color,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      <span style={{ fontSize: "11px", fontWeight: 700, color: "white", fontFamily: FONT }}>
                        {token.name[0]}
                      </span>
                    </div>
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: 700, color: "#0a0d10", fontFamily: FONT }}>
                        {token.name}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                        <span style={{ fontSize: "12px", fontWeight: 300, color: "#999", fontFamily: FONT }}>
                          {token.address}
                        </span>
                        <ArrowUpRight size={11} color="#bbb" />
                      </div>
                    </div>
                  </div>
                </td>
                {/* Current */}
                <td style={{ padding: "14px 16px", textAlign: "right" }}>
                  <span style={{ fontSize: "14px", fontWeight: 300, color: "#0a0d10", fontFamily: FONT }}>
                    {token.current}
                  </span>
                </td>
                {/* Expected */}
                <td style={{ padding: "14px 16px", textAlign: "right", background: "#eff5ff" }}>
                  <span style={{ fontSize: "14px", fontWeight: 700, color: BLUE, fontFamily: FONT }}>
                    {token.expected}
                  </span>
                </td>
                {/* Delta */}
                <td style={{ padding: "14px 24px 14px 16px", textAlign: "right" }}>
                  <span style={{
                    fontSize: "14px", fontWeight: 500, fontFamily: FONT,
                    color: isPositive ? "#16a34a" : isNegative ? "#dc2626" : "#666",
                  }}>
                    {token.delta}
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// ── Voting Power Card ─────────────────────────────────────────────────────────

function VotingPowerCard() {
  return (
    <div style={{
      background: "#f5f5f5", borderRadius: "16px", padding: "20px",
      display: "flex", flexDirection: "column", gap: "12px",
    }}>
      {/* Top row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "13px", color: "#666", fontFamily: FONT }}>✳</span>
          <span style={{ fontSize: "14px", fontWeight: 300, color: "#0a0d10", fontFamily: FONT }}>
            Your voting power: <strong style={{ fontWeight: 700 }}>5.00</strong>
          </span>
        </div>
        <button style={{
          background: "none", border: "none", cursor: "pointer",
          fontSize: "13px", fontWeight: 300, color: "#999", fontFamily: FONT,
        }}>
          ≈ Delegate
        </button>
      </div>

      {/* Countdown */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", padding: "8px 0" }}>
        <Loader2 size={20} color="#bbb" style={{ animation: "spin 1.5s linear infinite" }} />
        <span style={{ fontSize: "13px", fontWeight: 300, color: "#999", fontFamily: FONT }}>
          Voting period ends in
        </span>
        <span style={{ fontSize: "22px", fontWeight: 700, color: "#0a0d10", fontFamily: FONT }}>
          22 h, 3 m
        </span>
      </div>

      {/* Vote button */}
      <button style={{
        width: "100%", padding: "16px",
        background: "#0a1628",
        color: "white",
        border: "none", borderRadius: "10px",
        fontSize: "16px", fontWeight: 500, fontFamily: FONT,
        cursor: "pointer", lineHeight: "16px",
      }}>
        Vote on-chain
      </button>
    </div>
  )
}

// ── Current Votes Card ────────────────────────────────────────────────────────

function CurrentVotesCard() {
  return (
    <div style={{
      background: "white", borderRadius: "16px", padding: "20px",
      display: "flex", flexDirection: "column", gap: "0px",
    }}>
      <span style={{ fontSize: "16px", fontWeight: 700, color: "#0a0d10", fontFamily: FONT, marginBottom: "16px" }}>
        Current votes
      </span>

      {/* Quorum */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 0", borderBottom: `1px solid ${BORDER}`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <X size={14} color="#f97316" strokeWidth={2.5} />
          <span style={{ fontSize: "14px", fontWeight: 300, color: "#0a0d10", fontFamily: FONT }}>Quorum</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "14px", fontWeight: 500, color: "#f97316", fontFamily: FONT }}>0%</span>
          <span style={{ fontSize: "13px", fontWeight: 300, color: "#999", fontFamily: FONT }}>0 of 1</span>
        </div>
      </div>

      {/* Majority support */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 0", borderBottom: `1px solid ${BORDER}`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <X size={14} color="#888" strokeWidth={2.5} />
          <span style={{ fontSize: "14px", fontWeight: 300, color: "#0a0d10", fontFamily: FONT }}>Majority support</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "14px", fontWeight: 500, color: "#f97316", fontFamily: FONT }}>No</span>
          <span style={{ fontSize: "13px", fontWeight: 300, color: "#999", fontFamily: FONT }}>0%</span>
        </div>
      </div>

      {/* For / Against */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1px 1fr",
        padding: "12px 0", borderBottom: `1px solid ${BORDER}`,
        gap: "0",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", paddingRight: "16px" }}>
          <ThumbsUp size={16} color="#888" />
          <div>
            <div style={{ fontSize: "12px", fontWeight: 300, color: "#999", fontFamily: FONT }}>For</div>
            <div style={{ fontSize: "16px", fontWeight: 700, color: "#0a0d10", fontFamily: FONT }}>0</div>
          </div>
        </div>
        <div style={{ background: BORDER, width: "1px" }} />
        <div style={{ display: "flex", alignItems: "center", gap: "8px", paddingLeft: "16px" }}>
          <div>
            <div style={{ fontSize: "12px", fontWeight: 300, color: "#999", fontFamily: FONT, textAlign: "right" }}>Against</div>
            <div style={{ fontSize: "16px", fontWeight: 700, color: "#0a0d10", fontFamily: FONT, textAlign: "right" }}>0</div>
          </div>
          <ThumbsDown size={16} color="#888" />
        </div>
      </div>

      {/* Abstain */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 0",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{
            width: "16px", height: "16px", borderRadius: "50%",
            border: "2px solid #888",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <div style={{ width: "8px", height: "2px", background: "#888", borderRadius: "1px" }} />
          </div>
          <span style={{ fontSize: "14px", fontWeight: 300, color: "#0a0d10", fontFamily: FONT }}>Abstain</span>
        </div>
        <span style={{ fontSize: "14px", fontWeight: 300, color: "#0a0d10", fontFamily: FONT }}>0</span>
      </div>
    </div>
  )
}

// ── Status Card ───────────────────────────────────────────────────────────────

function StatusIcon({ type, isActive }: { type: "circle" | "clock" | "play"; isActive: boolean }) {
  const color = isActive ? BLUE : "#888"

  if (type === "play") {
    return (
      <div style={{
        width: "20px", height: "20px", borderRadius: "50%",
        border: `2px solid ${BLUE}`, background: BLUE,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>
        <div style={{
          width: 0, height: 0,
          borderTop: "4px solid transparent",
          borderBottom: "4px solid transparent",
          borderLeft: "6px solid white",
          marginLeft: "1px",
        }} />
      </div>
    )
  }
  if (type === "circle") {
    return (
      <div style={{
        width: "20px", height: "20px", borderRadius: "50%",
        border: `2px solid ${color}`,
        flexShrink: 0,
      }} />
    )
  }
  return <Clock size={18} color={color} style={{ flexShrink: 0 }} />
}

function StatusCard() {
  const [activeTab, setActiveTab] = useState<"for" | "against" | "abstain">("for")

  return (
    <div style={{
      background: "white", borderRadius: "16px", overflow: "hidden",
    }}>
      <div style={{ padding: "20px 20px 0" }}>
        <span style={{ fontSize: "16px", fontWeight: 700, color: "#0a0d10", fontFamily: FONT }}>
          Status
        </span>
      </div>

      {/* Timeline */}
      <div style={{ padding: "16px 20px" }}>
        {STATUS_ITEMS.map((item, i) => {
          const isLast = i === STATUS_ITEMS.length - 1
          return (
            <div key={i} style={{ position: "relative", paddingLeft: "32px", paddingBottom: isLast ? "0" : "20px" }}>
              {/* Vertical line */}
              {!isLast && (
                <div style={{
                  position: "absolute",
                  left: "9px",
                  top: "20px",
                  bottom: 0,
                  width: "2px",
                  background: i === 3 ? BLUE : BORDER,
                }} />
              )}

              {/* Icon */}
              <div style={{ position: "absolute", left: 0, top: "1px" }}>
                <StatusIcon type={item.icon} isActive={item.isActive} />
              </div>

              {/* Content */}
              <div>
                {item.time && (
                  <div style={{ fontSize: "12px", fontWeight: 300, color: "#999", fontFamily: FONT, marginBottom: "2px" }}>
                    {item.time}
                  </div>
                )}
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#0a0d10", fontFamily: FONT }}>
                  {item.title}
                </div>
                {item.subtitle.split("\n").map((line, j) => (
                  <div key={j} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <span style={{ fontSize: "13px", fontWeight: 300, color: "#666", fontFamily: FONT }}>
                      {line}
                    </span>
                    {line.startsWith("By:") && <ArrowUpRight size={11} color="#bbb" />}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Votes tabs */}
      <div style={{
        display: "flex", borderTop: `1px solid ${BORDER}`,
      }}>
        {([
          { key: "for" as const, label: "Votes for" },
          { key: "against" as const, label: "Votes against" },
          { key: "abstain" as const, label: "Abstain" },
        ]).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              flex: 1, padding: "12px 4px",
              background: "none", border: "none",
              borderBottom: activeTab === tab.key ? `2px solid ${BLUE}` : "2px solid transparent",
              fontSize: "13px", fontWeight: activeTab === tab.key ? 500 : 300,
              color: activeTab === tab.key ? BLUE : "#888",
              cursor: "pointer", fontFamily: FONT,
              marginBottom: "-1px",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ProposalDetailClient() {
  const router = useRouter()

  return (
    <>
      {/* Left column */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "16px", minWidth: 0 }}>

        {/* Back + Title card */}
        <div style={{
          background: "white", borderRadius: "20px", padding: "24px",
          display: "flex", flexDirection: "column", gap: "20px",
        }}>
          {/* Back button */}
          <button
            onClick={() => router.back()}
            style={{
              width: "32px", height: "32px", borderRadius: "50%",
              border: `1px solid ${BORDER}`, background: "white",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", flexShrink: 0,
            }}
          >
            <ArrowLeft size={16} color="#0a0d10" />
          </button>

          {/* Title */}
          <h1 style={{
            fontSize: "28px", fontWeight: 700, color: "#0a0d10",
            fontFamily: FONT, margin: 0, lineHeight: "1.2",
          }}>
            rebalance test
          </h1>

          {/* Metadata row */}
          <div style={{ display: "flex", alignItems: "center", gap: "24px", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{
                width: "28px", height: "28px", borderRadius: "6px",
                background: "#f2f2f2",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <FileText size={14} color="#666" />
              </div>
              <div>
                <div style={{ fontSize: "11px", fontWeight: 300, color: "#999", fontFamily: FONT }}>Proposed on</div>
                <div style={{ fontSize: "13px", fontWeight: 500, color: "#0a0d10", fontFamily: FONT }}>Feb 23, 2026</div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{
                width: "28px", height: "28px", borderRadius: "6px",
                background: "#f2f2f2",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Calendar size={14} color="#666" />
              </div>
              <div>
                <div style={{ fontSize: "11px", fontWeight: 300, color: "#999", fontFamily: FONT }}>Proposed by</div>
                <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                  <span style={{ fontSize: "13px", fontWeight: 500, color: BLUE, fontFamily: FONT }}>
                    0x6905...C8dE
                  </span>
                  <ArrowUpRight size={12} color={BLUE} />
                </div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{
                width: "28px", height: "28px", borderRadius: "6px",
                background: "#f2f2f2",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Copy size={14} color="#666" />
              </div>
              <div>
                <div style={{ fontSize: "11px", fontWeight: 300, color: "#999", fontFamily: FONT }}>ID</div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ fontSize: "13px", fontWeight: 500, color: "#0a0d10", fontFamily: FONT }}>
                    891109...7519
                  </span>
                  <button style={{
                    background: "none", border: "none", cursor: "pointer", padding: 0,
                    display: "flex", alignItems: "center",
                  }}>
                    <Copy size={12} color="#999" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: "1px", background: BORDER }} />

          {/* Description */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 0" }}>
            <span style={{ fontSize: "15px", fontWeight: 300, color: "#bbb", fontFamily: FONT }}>
              No description provided
            </span>
          </div>
        </div>

        {/* Basket Change */}
        <BasketChangeTable />
      </div>

      {/* Right column */}
      <div style={{
        width: 300,
        flexShrink: 0,
        position: "sticky",
        top: "16px",
        alignSelf: "flex-start",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}>
        <VotingPowerCard />
        <CurrentVotesCard />
        <StatusCard />
      </div>
    </>
  )
}
