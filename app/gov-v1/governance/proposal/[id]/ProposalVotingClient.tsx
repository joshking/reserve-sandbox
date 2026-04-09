"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft, ArrowUpRight, Copy, Rocket, FileText, CalendarDays, Hash,
  Clock, Lock, Plus, CheckCircle2, Circle,
} from "lucide-react"

const FONT = "'TWK Lausanne', system-ui, sans-serif"

// ── Mock proposal data keyed by id ─────────────────────────────────────────────

const PROPOSALS: Record<string, {
  title: string
  forumUrl: string
  proposedOn: string
  proposedBy: string
  proposalId: string
  votingEndsIn: string
  challengeVotes: number
  challengeThreshold: number
}> = {
  p1: {
    title: "Emergency Fee Update",
    forumUrl: "https://forum.reserve.org/t/emergency-fee-update/918",
    proposedOn: "Mar 13th, 2026",
    proposedBy: "0xfb...0344",
    proposalId: "243466...5055",
    votingEndsIn: "4d 5h 34m",
    challengeVotes: 750,
    challengeThreshold: 1000,
  },
  p2: {
    title: "March 2026 Rebalance",
    forumUrl: "https://forum.reserve.org/t/march-2026-rebalance/942",
    proposedOn: "Mar 14th, 2026",
    proposedBy: "0xfb...0344",
    proposalId: "243499...1122",
    votingEndsIn: "23h 3m",
    challengeVotes: 320,
    challengeThreshold: 1000,
  },
}

const BASKET_TOKENS = [
  { name: "Pepe",   address: "0x95ad...64c4c", current: "25%", next: "20%", delta: "-5%",  deltaPositive: false },
  { name: "Pepe",   address: "0x95ad...64c4c", current: "25%", next: "20%", delta: "-5%",  deltaPositive: false },
  { name: "Pepe",   address: "0x95ad...64c4c", current: "25%", next: "20%", delta: "-5%",  deltaPositive: false },
  { name: "Pepe",   address: "0x95ad...64c4c", current: "25%", next: "20%", delta: "-5%",  deltaPositive: false },
  { name: "Pepe",   address: "0x95ad...64c4c", current: "0%",  next: "20%", delta: "+20%", deltaPositive: true  },
]

// ── Circular countdown ─────────────────────────────────────────────────────────

function CircularCountdown({ label, value }: { label: string; value: string }) {
  const r = 28
  const circumference = 2 * Math.PI * r
  // Show ~70% remaining
  const offset = circumference * 0.3

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "20px 0 16px" }}>
      <div style={{ position: "relative", width: 64, height: 64 }}>
        <svg width={64} height={64} viewBox="0 0 64 64" style={{ transform: "rotate(-90deg)" }}>
          <circle cx={32} cy={32} r={r} fill="none" stroke="#e2e2e2" strokeWidth={3} />
          <circle
            cx={32} cy={32} r={r}
            fill="none" stroke="#0151af" strokeWidth={3}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Clock size={16} color="#0151af" />
        </div>
      </div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "12px", fontFamily: FONT, fontWeight: 300, color: "#888", marginBottom: 4 }}>
          {label}
        </div>
        <div style={{ fontSize: "22px", fontFamily: FONT, fontWeight: 700, color: "#0a0d10" }}>
          {value}
        </div>
      </div>
    </div>
  )
}

// ── Status timeline ────────────────────────────────────────────────────────────

type TimelineItem = {
  icon: "plus" | "clock" | "lock" | "active" | "circle"
  label?: string         // small badge above title (e.g. "24 hours", "Fast proposal")
  timestamp?: string
  title: string
  subtitle?: string
  isCurrent?: boolean
  isUpcoming?: boolean
  hasLink?: boolean
}

const TIMELINE: TimelineItem[] = [
  {
    icon: "plus",
    timestamp: "Mon Mar 13, 09:30 am",
    title: "Proposal created",
    subtitle: "By: 0xfb...0344",
    hasLink: true,
  },
  {
    icon: "clock",
    label: "24 hours",
    title: "Voting delay",
  },
  {
    icon: "lock",
    timestamp: "Tue Mar 14, 09:30 am",
    title: "Snapshot taken",
    subtitle: "0xfb...0344",
    hasLink: true,
  },
  {
    icon: "active",
    title: "Voting period",
    isCurrent: true,
  },
  {
    icon: "circle",
    timestamp: "Fri Mar 20, 09:30 am",
    title: "Voting period ends",
    subtitle: "in 4 days",
    isUpcoming: true,
  },
  {
    icon: "clock",
    label: "Fast proposal",
    title: "Execution delay",
    subtitle: "1 week delay",
    isUpcoming: true,
  },
  {
    icon: "circle",
    title: "Execute proposal",
    isUpcoming: true,
  },
]

function TimelineIcon({ item }: { item: TimelineItem }) {
  const size = 28
  const iconSize = 13

  if (item.isCurrent) {
    return (
      <div style={{
        width: size, height: size, borderRadius: "50%", flexShrink: 0,
        background: "#0151af",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "white" }} />
      </div>
    )
  }

  if (item.isUpcoming) {
    return (
      <div style={{
        width: size, height: size, borderRadius: "50%", flexShrink: 0,
        border: "1.5px solid #ddd", background: "white",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Circle size={iconSize} color="#ccc" />
      </div>
    )
  }

  if (item.icon === "plus") {
    return (
      <div style={{
        width: size, height: size, borderRadius: "50%", flexShrink: 0,
        border: "1.5px solid #e5e5e5", background: "white",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Plus size={iconSize} color="#0a0d10" />
      </div>
    )
  }

  if (item.icon === "clock") {
    return (
      <div style={{
        width: size, height: size, borderRadius: "50%", flexShrink: 0,
        border: "1.5px solid #e5e5e5", background: "white",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Clock size={iconSize} color="#0a0d10" />
      </div>
    )
  }

  if (item.icon === "lock") {
    return (
      <div style={{
        width: size, height: size, borderRadius: "50%", flexShrink: 0,
        border: "1.5px solid #e5e5e5", background: "white",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Lock size={iconSize} color="#0a0d10" />
      </div>
    )
  }

  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", flexShrink: 0,
      border: "1.5px solid #e5e5e5", background: "white",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <CheckCircle2 size={iconSize} color="#0a0d10" />
    </div>
  )
}

function StatusTimeline() {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {TIMELINE.map((item, i) => {
        const isLast = i === TIMELINE.length - 1
        const muted = item.isUpcoming

        return (
          <div key={i} style={{ display: "flex", gap: 12, position: "relative" }}>
            {/* Icon + vertical line */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
              <TimelineIcon item={item} />
              {!isLast && (
                <div style={{
                  width: 1.5,
                  flex: 1,
                  minHeight: 16,
                  background: item.isCurrent ? "#0151af" : "#e5e5e5",
                  margin: "2px 0",
                }} />
              )}
            </div>

            {/* Content */}
            <div style={{ paddingBottom: isLast ? 0 : 16, paddingTop: 4, minWidth: 0 }}>
              {item.label && (
                <div style={{
                  display: "inline-block",
                  padding: "1px 7px", borderRadius: "99px",
                  border: "1px solid #e5e5e5", background: "#fafafa",
                  fontSize: "11px", fontFamily: FONT, fontWeight: 300, color: "#888",
                  marginBottom: 3,
                }}>
                  {item.label}
                </div>
              )}
              {item.timestamp && (
                <div style={{ fontSize: "11px", fontFamily: FONT, fontWeight: 300, color: muted ? "#bbb" : "#999", marginBottom: 2 }}>
                  {item.timestamp}
                </div>
              )}
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{
                  fontSize: "13px", fontFamily: FONT,
                  fontWeight: item.isCurrent ? 600 : 500,
                  color: muted ? "#bbb" : item.isCurrent ? "#0a0d10" : "#0a0d10",
                }}>
                  {item.title}
                </span>
                {item.hasLink && !muted && (
                  <ArrowUpRight size={12} color="#0151af" style={{ flexShrink: 0 }} />
                )}
              </div>
              {item.subtitle && (
                <div style={{ fontSize: "12px", fontFamily: FONT, fontWeight: 300, color: muted ? "#ccc" : "#888", marginTop: 1 }}>
                  {item.subtitle}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Basket Change Table ────────────────────────────────────────────────────────

function BasketChangeTable() {
  const [view, setView] = useState<"summary" | "raw">("summary")

  return (
    <div style={{ background: "white", borderRadius: "16px", overflow: "hidden", border: "1px solid #e5e5e5" }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "18px 24px", borderBottom: "1px solid #e5e5e5",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: "17px", fontFamily: FONT, fontWeight: 700, color: "#0151af" }}>
            Basket Change
          </span>
          <ArrowUpRight size={14} color="#0151af" />
        </div>
        <div style={{
          display: "flex", border: "1px solid #e5e5e5", borderRadius: "8px", overflow: "hidden",
        }}>
          {(["summary", "raw"] as const).map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              style={{
                padding: "5px 14px",
                fontSize: "12px", fontFamily: FONT, fontWeight: 400,
                background: view === v ? "#0a0d10" : "white",
                color: view === v ? "white" : "#666",
                border: "none", cursor: "pointer",
                textTransform: "capitalize",
              }}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Table header */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 100px 100px 80px",
        padding: "10px 24px", borderBottom: "1px solid #e5e5e5",
        fontSize: "12px", fontFamily: FONT, fontWeight: 300, color: "#999",
      }}>
        <span>Token</span>
        <span style={{ textAlign: "right" }}>Current</span>
        <span style={{ textAlign: "right", color: "#0151af" }}>New</span>
        <span style={{ textAlign: "right" }}>Delta</span>
      </div>

      {BASKET_TOKENS.map((token, i) => (
        <div
          key={i}
          style={{
            display: "grid", gridTemplateColumns: "1fr 100px 100px 80px",
            padding: "12px 24px",
            borderBottom: i < BASKET_TOKENS.length - 1 ? "1px solid #f0ece6" : "none",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 28, height: 28, borderRadius: "50%", background: "#0a0d10", flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ fontSize: "10px", color: "white", fontFamily: FONT }}>P</span>
            </div>
            <div>
              <div style={{ fontSize: "14px", fontFamily: FONT, fontWeight: 500, color: "#0a0d10" }}>
                {token.name}
              </div>
              <div style={{ fontSize: "11px", fontFamily: FONT, fontWeight: 300, color: "#999" }}>
                {token.address}
              </div>
            </div>
          </div>
          <div style={{ textAlign: "right", fontSize: "14px", fontFamily: FONT, fontWeight: 300, color: "#0a0d10" }}>
            {token.current}
          </div>
          <div style={{ textAlign: "right", fontSize: "14px", fontFamily: FONT, fontWeight: 500, color: "#0151af" }}>
            {token.next}
          </div>
          <div style={{
            textAlign: "right", fontSize: "14px", fontFamily: FONT, fontWeight: 500,
            color: token.deltaPositive ? "#16a34a" : "#dc2626",
          }}>
            {token.delta}
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function ProposalVotingClient({ id }: { id: string }) {
  const router = useRouter()
  const [voted, setVoted] = useState(false)
  const proposal = PROPOSALS[id] ?? PROPOSALS["p1"]
  const pct = Math.round((proposal.challengeVotes / proposal.challengeThreshold) * 100)

  return (
    <div style={{ display: "flex", gap: 8, width: "100%", alignItems: "flex-start" }}>

      {/* ── Left column ───────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8, minWidth: 0 }}>

        {/* Header bar */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "12px 0 4px",
        }}>
          <button
            onClick={() => router.back()}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              width: 32, height: 32, borderRadius: "8px",
              border: "1px solid #e5e5e5", background: "white",
              cursor: "pointer",
            }}
          >
            <ArrowLeft size={15} color="#0a0d10" />
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: "13px", fontFamily: FONT, fontWeight: 300, color: "#666" }}>
                Your voting power:
              </span>
              <span style={{ fontSize: "13px", fontFamily: FONT, fontWeight: 600, color: "#0a0d10" }}>
                1.5M
              </span>
              <button style={{
                display: "flex", alignItems: "center", gap: 4,
                background: "none", border: "none", cursor: "pointer", padding: 0,
              }}>
                <span style={{ fontSize: "13px", fontFamily: FONT, fontWeight: 300, color: "#0151af" }}>
                  ⇆ Delegate
                </span>
              </button>
            </div>
            <div style={{ width: 1, height: 14, background: "#e5e5e5" }} />
            <button style={{
              display: "flex", alignItems: "center", gap: 5,
              background: "none", border: "none", cursor: "pointer", padding: 0,
            }}>
              <span style={{ fontSize: "13px", fontFamily: FONT, fontWeight: 300, color: "#666" }}>
                ↓ Download snapshot
              </span>
            </button>
          </div>
        </div>

        {/* Proposal title card */}
        <div style={{
          background: "white", borderRadius: "16px", padding: "24px",
          border: "1px solid #e5e5e5",
        }}>
          {/* Title */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <Rocket size={20} color="#0151af" />
            <h1 style={{
              fontSize: "24px", fontFamily: FONT, fontWeight: 700, color: "#0a0d10",
              margin: 0,
            }}>
              {proposal.title}
            </h1>
          </div>

          {/* Forum link */}
          <a
            href={proposal.forumUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block", marginBottom: 20,
              fontSize: "13px", fontFamily: FONT, fontWeight: 300, color: "#0151af",
              textDecoration: "underline", textDecorationColor: "rgba(1,81,175,0.3)",
            }}
          >
            {proposal.forumUrl}
          </a>

          {/* Divider */}
          <div style={{ height: 1, background: "#f0ece6", marginBottom: 16 }} />

          {/* Metadata row */}
          <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <div style={{
                width: 28, height: 28, borderRadius: "6px", border: "1px solid #e5e5e5",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <FileText size={13} color="#0a0d10" />
              </div>
              <div>
                <div style={{ fontSize: "11px", fontFamily: FONT, fontWeight: 300, color: "#999" }}>Proposed on</div>
                <div style={{ fontSize: "13px", fontFamily: FONT, fontWeight: 500, color: "#0a0d10" }}>{proposal.proposedOn}</div>
              </div>
            </div>

            <div style={{ width: 1, height: 28, background: "#f0ece6" }} />

            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <div style={{
                width: 28, height: 28, borderRadius: "6px", border: "1px solid #e5e5e5",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <CalendarDays size={13} color="#0a0d10" />
              </div>
              <div>
                <div style={{ fontSize: "11px", fontFamily: FONT, fontWeight: 300, color: "#999" }}>Proposed by</div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ fontSize: "13px", fontFamily: FONT, fontWeight: 500, color: "#0a0d10" }}>{proposal.proposedBy}</span>
                  <ArrowUpRight size={12} color="#0151af" />
                </div>
              </div>
            </div>

            <div style={{ width: 1, height: 28, background: "#f0ece6" }} />

            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <div style={{
                width: 28, height: 28, borderRadius: "6px", border: "1px solid #e5e5e5",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <Hash size={13} color="#0a0d10" />
              </div>
              <div>
                <div style={{ fontSize: "11px", fontFamily: FONT, fontWeight: 300, color: "#999" }}>ID</div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ fontSize: "13px", fontFamily: FONT, fontWeight: 500, color: "#0a0d10" }}>{proposal.proposalId}</span>
                  <button style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}>
                    <Copy size={12} color="#999" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Basket change */}
        <BasketChangeTable />
      </div>

      {/* ── Right column (sticky) ─────────────────────────────────────────────── */}
      <div style={{ width: 300, flexShrink: 0, position: "sticky", top: 16, alignSelf: "flex-start", display: "flex", flexDirection: "column", gap: 8 }}>

        {/* Voting power + timer card */}
        <div style={{ background: "white", borderRadius: "16px", overflow: "hidden", border: "1px solid #e5e5e5" }}>

          {/* Voting power header */}
          <div style={{
            padding: "14px 18px", borderBottom: "1px solid #e5e5e5",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: "13px", fontFamily: FONT, fontWeight: 300, color: "#666" }}>
                ✦ Your voting power:
              </span>
              <span style={{ fontSize: "13px", fontFamily: FONT, fontWeight: 600, color: "#0a0d10" }}>
                1.5M
              </span>
            </div>
            <button style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
              <span style={{ fontSize: "13px", fontFamily: FONT, fontWeight: 300, color: "#0151af" }}>
                ⇆ Delegate
              </span>
            </button>
          </div>

          {/* Timer */}
          <div style={{ background: "#f7f8fa", padding: "0 18px 4px" }}>
            <CircularCountdown label="Voting period ends in" value={proposal.votingEndsIn} />
          </div>

          {/* Info text */}
          <div style={{ padding: "14px 18px", borderTop: "1px solid #e5e5e5", borderBottom: "1px solid #e5e5e5" }}>
            <p style={{
              fontSize: "12px", fontFamily: FONT, fontWeight: 300,
              color: "#888", lineHeight: 1.6, margin: 0,
            }}>
              This fast proposal can be challenged only. If the threshold is reached, it becomes a
              contested proposal, and resubmitted in a standard voting process.
            </p>
          </div>

          {/* Vote to challenge button */}
          <div style={{ padding: "14px 18px" }}>
            <button
              onClick={() => setVoted(true)}
              style={{
                width: "100%", padding: "13px",
                borderRadius: "10px", border: "none",
                background: voted ? "#16a34a" : "#0151af",
                cursor: voted ? "default" : "pointer",
                fontSize: "14px", fontFamily: FONT, fontWeight: 600, color: "white",
                transition: "background 0.2s",
              }}
            >
              {voted ? "✓ Challenge submitted" : "Vote to Challenge"}
            </button>
          </div>
        </div>

        {/* Current votes card */}
        <div style={{ background: "white", borderRadius: "16px", padding: "18px", border: "1px solid #e5e5e5" }}>
          <div style={{ fontSize: "14px", fontFamily: FONT, fontWeight: 600, color: "#0a0d10", marginBottom: 14 }}>
            Current votes
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{
                width: 16, height: 16, borderRadius: "50%", border: "1.5px solid #0151af",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#0151af" }} />
              </div>
              <span style={{ fontSize: "13px", fontFamily: FONT, fontWeight: 400, color: "#0a0d10" }}>
                Challenge
              </span>
            </div>
            <span style={{ fontSize: "13px", fontFamily: FONT, fontWeight: 300, color: "#666" }}>
              {proposal.challengeVotes} of {proposal.challengeThreshold}{" "}
              <span style={{ fontWeight: 600, color: "#0a0d10" }}>({pct}%)</span>
            </span>
          </div>

          {/* Progress bar */}
          <div style={{ height: 6, borderRadius: 3, background: "#f0ece6", overflow: "hidden" }}>
            <div style={{
              height: "100%", borderRadius: 3,
              background: "#dc2626",
              width: `${pct}%`,
              transition: "width 0.3s ease",
            }} />
          </div>
        </div>

        {/* Status timeline card */}
        <div style={{ background: "white", borderRadius: "16px", padding: "18px", border: "1px solid #e5e5e5" }}>
          <div style={{ fontSize: "14px", fontFamily: FONT, fontWeight: 600, color: "#0a0d10", marginBottom: 16 }}>
            Status
          </div>
          <StatusTimeline />
        </div>

      </div>
    </div>
  )
}
