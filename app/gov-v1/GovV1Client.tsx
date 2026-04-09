"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Copy, ArrowUpRight, Coins, LayoutGrid, Hash, Users, Lock, PlusCircle, Search,
  ThumbsUp, ThumbsDown, Ban, Rocket, UserRoundCheck, UserRoundX, CircleCheckBig, UserX, FileX,
} from "lucide-react"
import DecorativeTable from "@/components/DecorativeTable"

const FONT = "'TWK Lausanne', system-ui, sans-serif"

// ── Types ──────────────────────────────────────────────────────────────────────

type ProposalStatus = "Pending" | "Active" | "Queued" | "Executed" | "Dead" | "Rejected"
type ProposalType = "Normal" | "Fast" | "Contested"

type ProposalData = {
  id: string
  title: string
  status: ProposalStatus
  type: ProposalType
  // 1=Delay, 2=Voting, 3=Queue, 0=no bar (terminal states)
  activeStep: 0 | 1 | 2 | 3
  stepProgress: number   // 0–100 within the active step
  for: string
  against: string
  abstain: string
  quorum: boolean
  delayRemaining?: string
  votingRemaining?: string
  queueRemaining?: string  // if undefined + Queued → execution is ready
  executedAt?: string
}

// ── Data ──────────────────────────────────────────────────────────────────────

const INITIAL_PROPOSALS: ProposalData[] = [
  {
    id: "p1",
    title: "Emergency Fee Update",
    status: "Pending", type: "Fast",
    activeStep: 1, stepProgress: 30,
    for: "0%", against: "0%", abstain: "0%", quorum: false,
    delayRemaining: "3 days, 22 minutes",
  },
  {
    id: "p2",
    title: "March 2026 Rebalance",
    status: "Active", type: "Normal",
    activeStep: 2, stepProgress: 70,
    for: "50%", against: "20%", abstain: "10%", quorum: false,
    votingRemaining: "23 hours, 3 minutes",
  },
  {
    id: "p3",
    title: "Reduce quorum threshold",
    status: "Queued", type: "Normal",
    activeStep: 3, stepProgress: 56,
    for: "100%", against: "0%", abstain: "0%", quorum: true,
    queueRemaining: "23 hours, 3 minutes",
  },
  {
    id: "p4",
    title: "Expand basket to 40 tokens",
    status: "Queued", type: "Contested",
    activeStep: 3, stepProgress: 100,
    for: "60%", against: "20%", abstain: "20%", quorum: true,
    // no queueRemaining → execution is available now
  },
  {
    id: "p5",
    title: "February 2026 BGCI",
    status: "Executed", type: "Normal",
    activeStep: 0, stepProgress: 0,
    for: "50%", against: "20%", abstain: "10%", quorum: true,
    executedAt: "03/16/26 at 12:34 pm",
  },
  {
    id: "p6",
    title: "January 2026 Rebalance",
    status: "Executed", type: "Normal",
    activeStep: 0, stepProgress: 0,
    for: "100%", against: "0%", abstain: "0%", quorum: true,
    executedAt: "03/01/26 at 9:12 am",
  },
  {
    id: "p7",
    title: "December 2025 Rebalance",
    status: "Dead", type: "Normal",
    activeStep: 0, stepProgress: 0,
    for: "0%", against: "0%", abstain: "0%", quorum: false,
  },
  {
    id: "p8",
    title: "November 2025 Rebalance",
    status: "Rejected", type: "Normal",
    activeStep: 0, stepProgress: 0,
    for: "10%", against: "80%", abstain: "10%", quorum: true,
  },
  {
    id: "p9",
    title: "BGCI October Rebalance",
    status: "Executed", type: "Normal",
    activeStep: 0, stepProgress: 0,
    for: "100%", against: "0%", abstain: "0%", quorum: true,
    executedAt: "10/04/25 at 2:05 pm",
  },
  {
    id: "p10",
    title: "update DAO governance cycle",
    status: "Executed", type: "Normal",
    activeStep: 0, stepProgress: 0,
    for: "100%", against: "0%", abstain: "0%", quorum: true,
    executedAt: "09/18/25 at 11:30 am",
  },
  {
    id: "p11",
    title: "bgci september rebalance",
    status: "Executed", type: "Normal",
    activeStep: 0, stepProgress: 0,
    for: "100%", against: "0%", abstain: "0%", quorum: true,
    executedAt: "09/02/25 at 8:44 am",
  },
  {
    id: "p12",
    title: "BGCI uDOT dust removal",
    status: "Executed", type: "Fast",
    activeStep: 0, stepProgress: 0,
    for: "100%", against: "32%", abstain: "0%", quorum: true,
    executedAt: "08/20/25 at 3:17 pm",
  },
  {
    id: "p13",
    title: "BGCI August Rebalance",
    status: "Executed", type: "Normal",
    activeStep: 0, stepProgress: 0,
    for: "100%", against: "0%", abstain: "0%", quorum: true,
    executedAt: "08/05/25 at 10:00 am",
  },
  {
    id: "p14",
    title: "DTF V4 Upgrade",
    status: "Executed", type: "Normal",
    activeStep: 0, stepProgress: 0,
    for: "100%", against: "0%", abstain: "0%", quorum: true,
    executedAt: "07/12/25 at 1:22 pm",
  },
]

const STATUS_FILTERS = ["All", "Pending", "Active", "Queued", "Executed", "Dead", "Rejected"] as const
type StatusFilter = typeof STATUS_FILTERS[number]

const STATUS_ORDER: Record<string, number> = { Pending: 0, Active: 1, Queued: 2, Executed: 3, Dead: 4, Rejected: 5 }

// Used only for filter chips
const STATUS_STYLES: Record<string, { bg: string; color: string; border: string }> = {
  Pending:  { bg: "#fff7ed", color: "#c2410c", border: "#fed7aa" },
  Active:   { bg: "#eff6ff", color: "#0151af", border: "#bfdbfe" },
  Queued:   { bg: "#f0f9ff", color: "#0891b2", border: "#bae6fd" },
  Executed: { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0" },
  Dead:     { bg: "#fef2f2", color: "#dc2626", border: "#fecaca" },
  Rejected: { bg: "#fef2f2", color: "#dc2626", border: "#fecaca" },
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

// ── Progress Bar ───────────────────────────────────────────────────────────────

function getSegmentTooltip(segmentIndex: number, p: ProposalData): string {
  const { activeStep, for: pFor, against, abstain, quorum, delayRemaining, votingRemaining, queueRemaining } = p
  const stepNum = segmentIndex + 1

  if (stepNum === 1) {
    if (activeStep === 1) return `Voting delay in progress — starts in ${delayRemaining ?? "a few days"}.`
    if (activeStep > 1) return "Voting delay complete."
    return "Voting delay."
  }
  if (stepNum === 2) {
    if (activeStep === 2) return `Voting in progress${votingRemaining ? ` — ends in ${votingRemaining}` : ""}. For: ${pFor} · Against: ${against} · Abstain: ${abstain}. Quorum ${quorum ? "reached" : "not yet reached"}.`
    if (activeStep > 2) return `Voting ended. For: ${pFor} · Against: ${against} · Abstain: ${abstain}.`
    return "Voting period has not started yet."
  }
  // stepNum === 3
  if (activeStep === 3) return queueRemaining ? `Queued for execution — available in ${queueRemaining}.` : "Execution is available."
  if (activeStep > 3) return "Proposal has been executed."
  return "Execution queue — will be queued after voting."
}

function ProgressSegment({
  state,
  progress,
  tooltipText,
  isFirst,
  isLast,
}: {
  state: "completed" | "active" | "upcoming"
  progress?: number
  tooltipText: string
  isFirst?: boolean
  isLast?: boolean
}) {
  const [tip, setTip] = useState<{ x: number; y: number } | null>(null)
  const radius = isFirst ? "4px 2px 2px 4px" : isLast ? "2px 4px 4px 2px" : "2px"

  return (
    <div
      style={{
        position: "relative",
        height: 10,
        borderRadius: radius,
        background: state === "completed" ? "rgba(1, 81, 175, 0.5)" : "#e2e2e2",
        overflow: "visible",
        cursor: "default",
        flexShrink: state === "active" ? undefined : 0,
        flex: state === "active" ? "1 1 0" : undefined,
        width: state === "active" ? undefined : 36,
        minWidth: state === "active" ? 0 : 36,
      }}
      onMouseEnter={e => setTip({ x: e.clientX, y: e.clientY })}
      onMouseMove={e => setTip({ x: e.clientX, y: e.clientY })}
      onMouseLeave={() => setTip(null)}
    >
      {state === "active" && (
        <div style={{ position: "absolute", inset: 0, borderRadius: radius, overflow: "hidden" }}>
          <div style={{
            position: "absolute", left: 0, top: 0, bottom: 0,
            width: `${progress ?? 50}%`,
            background: "#0151af",
            borderRadius: radius,
          }} />
        </div>
      )}
      {tip && (
        <div style={{
          position: "fixed", left: tip.x, top: tip.y - 12,
          transform: "translate(-50%, -100%)", zIndex: 9999,
          background: "#0a0d10", color: "white",
          padding: "7px 11px", borderRadius: "8px",
          fontSize: "13px", fontFamily: FONT, fontWeight: 300,
          whiteSpace: "nowrap", pointerEvents: "none",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        }}>
          {tooltipText}
        </div>
      )}
    </div>
  )
}

function ProposalProgressBar({ proposal }: { proposal: ProposalData }) {
  const { activeStep, stepProgress } = proposal
  return (
    <div style={{ display: "flex", gap: 3, alignItems: "center", width: "100%" }}>
      {[0, 1, 2].map(i => {
        const stepNum = i + 1
        const state: "completed" | "active" | "upcoming" =
          stepNum < activeStep ? "completed" :
          stepNum === activeStep ? "active" : "upcoming"
        return (
          <ProgressSegment
            key={i}
            state={state}
            progress={state === "active" ? stepProgress : undefined}
            tooltipText={getSegmentTooltip(i, proposal)}
            isFirst={i === 0}
            isLast={i === 2}
          />
        )
      })}
    </div>
  )
}

// ── Row sub-components ─────────────────────────────────────────────────────────

function VoteStat({ icon, value, color }: { icon: React.ReactNode; value: string; color: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      {icon}
      <span style={{ fontSize: "13px", fontFamily: FONT, fontWeight: 300, color }}>{value}</span>
    </div>
  )
}

function IconTooltip({ children, text }: { children: React.ReactNode; text: string }) {
  const [tip, setTip] = useState<{ x: number; y: number } | null>(null)
  return (
    <div
      style={{ display: "flex", alignItems: "center", flexShrink: 0, cursor: "default" }}
      onMouseEnter={e => setTip({ x: e.clientX, y: e.clientY })}
      onMouseMove={e => setTip({ x: e.clientX, y: e.clientY })}
      onMouseLeave={() => setTip(null)}
    >
      {children}
      {tip && (
        <div style={{
          position: "fixed", left: tip.x, top: tip.y - 12,
          transform: "translate(-50%, -100%)", zIndex: 9999,
          background: "#0a0d10", color: "white",
          padding: "7px 11px", borderRadius: "8px",
          fontSize: "13px", fontFamily: FONT, fontWeight: 300,
          whiteSpace: "nowrap", pointerEvents: "none",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        }}>
          {text}
        </div>
      )}
    </div>
  )
}

function FeedbackRow({ p, onExecute }: { p: ProposalData; onExecute: () => void }) {
  if (p.status === "Pending") {
    return (
      <span style={{ fontSize: "13px", fontFamily: FONT, fontWeight: 300, color: "#666" }}>
        {"Voting delay: "}
        <span style={{ color: "#0151af" }}>{p.delayRemaining ?? "calculating…"}</span>
      </span>
    )
  }

  if (p.status === "Active") {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <span style={{ fontSize: "13px", fontFamily: FONT, fontWeight: 300, color: "#666" }}>
          {"Voting ends in: "}
          <strong style={{ fontWeight: 600, color: "#0a0d10" }}>{p.votingRemaining ?? "calculating…"}</strong>
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {p.quorum
            ? <IconTooltip text="Quorum reached"><UserRoundCheck size={13} color="#bbb" /></IconTooltip>
            : <IconTooltip text="Quorum not reached"><UserRoundX size={13} color="#bbb" /></IconTooltip>
          }
          <VoteStat icon={<ThumbsUp size={13} color="#16a34a" />}   value={p.for}     color="#16a34a" />
          <VoteStat icon={<ThumbsDown size={13} color="#dc2626" />} value={p.against} color="#dc2626" />
          <VoteStat icon={<Ban size={13} color="#bbb" />}           value={p.abstain} color="#999"    />
        </div>
      </div>
    )
  }

  if (p.status === "Queued") {
    const isReady = !p.queueRemaining
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <span style={{ fontSize: "13px", fontFamily: FONT, fontWeight: 300, color: "#666" }}>
          {isReady
            ? "Execution available."
            : <>{`Execution available in: `}<strong style={{ fontWeight: 600, color: "#0a0d10" }}>{p.queueRemaining}</strong></>
          }
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <CircleCheckBig size={13} color="#0151af" />
            <span style={{ fontSize: "13px", fontFamily: FONT, fontWeight: 300, color: "#0151af" }}>
              Proposal has passed.
            </span>
          </div>
          {isReady && (
            <button
              onClick={e => { e.stopPropagation(); onExecute() }}
              style={{
                padding: "6px 16px", borderRadius: "8px",
                background: "#0a0d10", border: "none", cursor: "pointer",
                fontSize: "13px", fontFamily: FONT, fontWeight: 500, color: "white",
              }}
            >
              Execute
            </button>
          )}
        </div>
      </div>
    )
  }

  if (p.status === "Executed") {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Rocket size={13} color="#bbb" />
          <span style={{ fontSize: "13px", fontFamily: FONT, fontWeight: 300, color: "#aaa" }}>
            <strong style={{ fontWeight: 600 }}>Executed</strong>{" successfully on "}{p.executedAt}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <VoteStat icon={<ThumbsUp size={13} color="#bbb" />}   value={p.for}     color="#bbb" />
          <VoteStat icon={<ThumbsDown size={13} color="#bbb" />} value={p.against} color="#bbb" />
          <VoteStat icon={<Ban size={13} color="#bbb" />}        value={p.abstain} color="#bbb" />
        </div>
      </div>
    )
  }

  if (p.status === "Dead") {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <UserX size={13} color="#bbb" />
        <span style={{ fontSize: "13px", fontFamily: FONT, fontWeight: 300, color: "#aaa" }}>
          Quorum was not reached. Proposal is now <strong style={{ fontWeight: 600 }}>dead</strong>.
        </span>
      </div>
    )
  }

  if (p.status === "Rejected") {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <FileX size={13} color="#bbb" />
          <span style={{ fontSize: "13px", fontFamily: FONT, fontWeight: 300, color: "#aaa" }}>
            Proposal was <strong style={{ fontWeight: 600 }}>rejected</strong>.
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <VoteStat icon={<ThumbsUp size={13} color="#bbb" />}   value={p.for}     color="#bbb" />
          <VoteStat icon={<ThumbsDown size={13} color="#bbb" />} value={p.against} color="#bbb" />
          <VoteStat icon={<Ban size={13} color="#bbb" />}        value={p.abstain} color="#bbb" />
        </div>
      </div>
    )
  }

  return null
}

// ── Proposal Row ───────────────────────────────────────────────────────────────

function ProposalRow({
  p,
  onExecute,
  isLast,
  onClick,
}: {
  p: ProposalData
  onExecute: () => void
  isLast: boolean
  onClick?: () => void
}) {
  const showBar = p.status === "Pending" || p.status === "Active" || p.status === "Queued"
  const isDimmed = p.status === "Executed" || p.status === "Dead" || p.status === "Rejected"

  return (
    <div
      onClick={onClick}
      style={{
        display: "flex", flexDirection: "column", gap: 10,
        padding: "16px 24px",
        borderBottom: isLast ? "none" : "1px solid #e5e5e5",
        cursor: onClick ? "pointer" : "default",
      }}
    >
      {/* Title row */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{
          fontSize: "16px", fontFamily: FONT, fontWeight: 500,
          color: isDimmed ? "#aaa" : "#0a0d10",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {p.title}
        </span>
        {p.type === "Contested" && !isDimmed && (
          <span style={{
            padding: "2px 8px", borderRadius: "16px", flexShrink: 0,
            border: "1px solid #ff8a00", background: "rgba(255,138,0,0.12)",
            fontSize: "11px", fontFamily: FONT, fontWeight: 300, color: "#ff8a00",
          }}>
            Contested
          </span>
        )}
        {p.type === "Fast" && !isDimmed && (
          <span style={{
            padding: "2px 8px", borderRadius: "16px", flexShrink: 0,
            border: "1px solid #a5f3fc", background: "rgba(8,145,178,0.08)",
            fontSize: "11px", fontFamily: FONT, fontWeight: 300, color: "#0891b2",
          }}>
            Fast
          </span>
        )}
      </div>

      {/* Progress bar */}
      {showBar && <ProposalProgressBar proposal={p} />}

      {/* Feedback */}
      <FeedbackRow p={p} onExecute={onExecute} />
    </div>
  )
}

// ── Proposal List ──────────────────────────────────────────────────────────────

function ProposalList() {
  const router = useRouter()
  const [activeFilter, setActiveFilter] = useState<StatusFilter>("All")
  const [search, setSearch] = useState("")
  const [executedIds, setExecutedIds] = useState<Set<string>>(new Set())

  const proposals = INITIAL_PROPOSALS.map(p =>
    executedIds.has(p.id)
      ? { ...p, status: "Executed" as ProposalStatus, activeStep: 0 as const, executedAt: "03/16/26 at 12:34 pm" }
      : p
  )

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
      {/* Filter + Search */}
      <div style={{ padding: "12px 16px", borderBottom: "1px solid #e5e5e5", display: "flex", flexDirection: "column", gap: "10px" }}>
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
                  border: isActive ? `1px solid ${style?.border ?? "#0a0d10"}` : "1px solid #e5e5e5",
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
      ) : filtered.map((p, i) => (
        <ProposalRow
          key={p.id}
          p={p}
          isLast={i === filtered.length - 1}
          onExecute={() => setExecutedIds(prev => new Set([...prev, p.id]))}
          onClick={p.type === "Fast" && (p.status === "Active" || p.status === "Pending")
            ? () => router.push(`/gov-v1/governance/proposal/${p.id}`)
            : undefined}
        />
      ))}

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

// ── Stats Panel ────────────────────────────────────────────────────────────────

function GovernanceStatsPanel() {
  return (
    <div style={{ background: "white", borderRadius: "20px", overflow: "hidden" }}>
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
                <span style={{ fontSize: "13px", fontFamily: FONT, fontWeight: 300, color: "#0151af", cursor: "pointer" }}>
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

// ── Page ───────────────────────────────────────────────────────────────────────

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
