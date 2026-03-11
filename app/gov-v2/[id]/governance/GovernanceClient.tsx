"use client"

import { useState, useRef, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import {
  Copy, ArrowUpRight, Coins, LayoutGrid, Hash, Users, Lock, PlusCircle,
  Search, X, ChevronDown, Check, ThumbsUp, ThumbsDown, Ban, Rocket, UserX, CircleCheckBig, HandFist,
  UserRoundCheck, UserRoundX,
} from "lucide-react"
import DecorativeTable from "@/components/DecorativeTable"
import ProposalTypeMenu from "@/components/ProposalTypeMenu"

const FONT = "'TWK Lausanne', system-ui, sans-serif"

// ── Types ─────────────────────────────────────────────────────────────────────

type ProposalStatus = "Active" | "Pending" | "Queued" | "Executed" | "Defeated"
type ProposalType = "Normal" | "Fast" | "Contested"

type ProposalData = {
  title: string
  status: ProposalStatus
  type: ProposalType
  // activeStep: 1=Delay, 2=Voting, 3=Voting finished, 4=Queued, 0=no bar
  activeStep: 0 | 1 | 2 | 3 | 4
  stepProgress: number // 0–100 within the active step
  for: string
  against: string
  abstain: string
  quorum: boolean
  delayRemaining?: string
  queueRemaining?: string
}

// ── Data ──────────────────────────────────────────────────────────────────────

const proposals: ProposalData[] = [
  {
    title: "March 2026 Rebalance",
    status: "Active", type: "Fast",
    activeStep: 2, stepProgress: 84,
    for: "50%", against: "12%", abstain: "0%", quorum: false,
  },
  {
    title: "Emergency RSR Yield Update",
    status: "Active", type: "Fast",
    activeStep: 2, stepProgress: 15,
    for: "20%", against: "0%", abstain: "0%", quorum: false,
  },
  {
    title: "Emergency Fee Update",
    status: "Pending", type: "Fast",
    activeStep: 1, stepProgress: 30,
    for: "0%", against: "0%", abstain: "0%", quorum: false,
    delayRemaining: "3 days, 22 minutes",
  },
  {
    title: "Reduce quorum threshold",
    status: "Queued", type: "Normal",
    activeStep: 4, stepProgress: 56,
    for: "100%", against: "0%", abstain: "0%", quorum: true,
    queueRemaining: "23 hours, 3 minutes",
  },
  {
    title: "Fee Cap Override",
    status: "Active", type: "Contested",
    activeStep: 2, stepProgress: 84,
    for: "50%", against: "20%", abstain: "10%", quorum: true,
  },
  {
    title: "Expand basket to 40 tokens",
    status: "Active", type: "Normal",
    activeStep: 2, stepProgress: 45,
    for: "60%", against: "20%", abstain: "20%", quorum: false,
  },
  {
    title: "Governance Parameter Update",
    status: "Pending", type: "Contested",
    activeStep: 1, stepProgress: 65,
    for: "60%", against: "20%", abstain: "20%", quorum: true,
    delayRemaining: "1 day, 4 hours",
  },
  { title: "February 2026 BGCI",         status: "Executed", type: "Normal",   activeStep: 0, stepProgress: 0, for: "100%", against: "0%",  abstain: "0%",  quorum: true  },
  { title: "January 2026 Rebalance",     status: "Executed", type: "Normal",   activeStep: 0, stepProgress: 0, for: "100%", against: "0%",  abstain: "0%",  quorum: true  },
  { title: "December 2025 Rebalance",    status: "Executed", type: "Normal",   activeStep: 0, stepProgress: 0, for: "100%", against: "0%",  abstain: "0%",  quorum: true  },
  { title: "November 2025 Rebalance",    status: "Executed", type: "Normal",   activeStep: 0, stepProgress: 0, for: "100%", against: "0%",  abstain: "0%",  quorum: true  },
  { title: "BGCI October Rebalance v2",  status: "Defeated", type: "Normal",   activeStep: 0, stepProgress: 0, for: "22%",  against: "8%",  abstain: "5%",  quorum: false },
  { title: "BGCI October Rebalance",     status: "Executed", type: "Normal",   activeStep: 0, stepProgress: 0, for: "100%", against: "0%",  abstain: "0%",  quorum: true  },
  { title: "update DAO governance cycle",status: "Executed", type: "Normal",   activeStep: 0, stepProgress: 0, for: "100%", against: "0%",  abstain: "0%",  quorum: true  },
  { title: "bgci september rebalance",   status: "Executed", type: "Normal",   activeStep: 0, stepProgress: 0, for: "100%", against: "0%",  abstain: "0%",  quorum: true  },
  { title: "BGCI uDOT dust removal",     status: "Executed", type: "Fast",     activeStep: 0, stepProgress: 0, for: "100%", against: "32%", abstain: "0%",  quorum: true  },
  { title: "BGCI August Rebalance",      status: "Executed", type: "Normal",   activeStep: 0, stepProgress: 0, for: "100%", against: "0%",  abstain: "0%",  quorum: true  },
  { title: "DTF V4 Upgrade",             status: "Executed", type: "Normal",   activeStep: 0, stepProgress: 0, for: "100%", against: "0%",  abstain: "0%",  quorum: true  },
]

const STATUS_FILTERS = ["All", "Active", "Pending", "Queued", "Executed", "Defeated"] as const
type StatusFilter = typeof STATUS_FILTERS[number]
const STATUS_OPTIONS = ["Active", "Pending", "Queued", "Executed", "Defeated"] as const
const STATUS_ORDER: Record<string, number> = { Active: 0, Pending: 1, Queued: 2, Defeated: 3, Executed: 4 }

// For filter chips only
const STATUS_STYLES: Record<string, { bg: string; color: string; border: string }> = {
  Active:   { bg: "#eff6ff", color: "#0151af", border: "#bfdbfe" },
  Pending:  { bg: "#fff7ed", color: "#c2410c", border: "#fed7aa" },
  Queued:   { bg: "#f0f9ff", color: "#0891b2", border: "#bae6fd" },
  Executed: { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0" },
  Defeated: { bg: "#fef2f2", color: "#dc2626", border: "#fecaca" },
}

// Inline status dot colors (matching Figma)
const STATUS_DOT: Record<string, string> = {
  Active:   "#3BBEFF",
  Pending:  "#f59e0b",
  Queued:   "#0891b2",
  Executed: "#3ebf6e",
  Defeated: "#ef4345",
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

// ── Progress Bar ──────────────────────────────────────────────────────────────

function getSegmentTooltip(segmentIndex: number, p: ProposalData): string {
  const { activeStep, for: pFor, against, abstain, quorum, delayRemaining, queueRemaining } = p
  const stepNum = segmentIndex + 1 // 1-based

  if (stepNum === 1) {
    if (activeStep === 1) return `Voting delay in progress. Voting begins in ${delayRemaining ?? "a few days"}.`
    if (activeStep > 1) return "Voting delay complete."
    return "Voting delay has not started."
  }
  if (stepNum === 2) {
    if (activeStep === 2) return `Voting in progress. For: ${pFor} · Against: ${against} · Abstain: ${abstain}. Quorum ${quorum ? "reached" : "not yet reached"}.`
    if (activeStep > 2) return `Voting ended. For: ${pFor} · Against: ${against} · Abstain: ${abstain}.`
    return "Voting period has not started yet."
  }
  if (stepNum === 3) {
    if (activeStep === 3) return "Voting has ended. Proposal passed, awaiting queue."
    if (activeStep > 3) return `Voting finished. Proposal passed with ${pFor} in favor.`
    return "Voting has not finished yet."
  }
  if (stepNum === 4) {
    if (activeStep === 4) return `Proposal queued for execution. Execution available in ${queueRemaining ?? "some time"}.`
    if (activeStep > 4) return "Proposal has been executed."
    return "Proposal will be queued after voting ends."
  }
  // stepNum === 5
  return "Once executed, the proposal's on-chain actions will take effect. (Illustrative)"
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
        height: 12,
        borderRadius: radius,
        background: state === "completed" ? "#3ebf6e" : "#e2e2e2",
        overflow: "visible",
        cursor: "default",
        flexShrink: state === "active" ? undefined : 0,
        flex: state === "active" ? "1 1 0" : undefined,
        width: state === "active" ? undefined : 28,
        minWidth: state === "active" ? 0 : 28,
      }}
      onMouseEnter={e => setTip({ x: e.clientX, y: e.clientY })}
      onMouseMove={e => setTip({ x: e.clientX, y: e.clientY })}
      onMouseLeave={() => setTip(null)}
    >
      {state === "active" && (
        <div style={{
          position: "absolute",
          inset: 0,
          borderRadius: radius,
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute",
            left: 0, top: 0, bottom: 0,
            width: `${progress ?? 50}%`,
            background: "#0151af",
            borderRadius: radius,
          }} />
        </div>
      )}

      {tip && (
        <div
          style={{
            position: "fixed",
            left: tip.x,
            top: tip.y - 12,
            transform: "translate(-50%, -100%)",
            zIndex: 9999,
            background: "#0a0d10",
            color: "white",
            padding: "7px 11px",
            borderRadius: "8px",
            fontSize: "13px",
            fontFamily: FONT,
            fontWeight: 300,
            whiteSpace: "nowrap",
            pointerEvents: "none",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          }}
        >
          {tooltipText}
        </div>
      )}
    </div>
  )
}

function ProposalProgressBar({ proposal }: { proposal: ProposalData }) {
  const { activeStep, stepProgress } = proposal

  return (
    <div style={{ display: "flex", gap: 4, alignItems: "center", width: "100%" }}>
      {[0, 1, 2, 3, 4].map(i => {
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
            isLast={i === 4}
          />
        )
      })}
    </div>
  )
}

// ── Feedback row (below progress bar) ─────────────────────────────────────────

function FastBadge() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
      <Rocket size={13} color="#0151af" />
      <span style={{ fontSize: "13px", fontFamily: FONT, fontWeight: 300, color: "#0151af" }}>Fast</span>
    </div>
  )
}

function ContestedBadge() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
      <HandFist size={13} color="#f08e35" />
      <span style={{ fontSize: "13px", fontFamily: FONT, fontWeight: 300, color: "#f08e35" }}>Contested</span>
    </div>
  )
}

function FeedbackRow({ p }: { p: ProposalData }) {
  const isFast = p.type === "Fast"

  if (p.status === "Pending") {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: "13px", fontFamily: FONT, fontWeight: 300, color: "#666" }}>
          {"Voting delay: "}
          <span style={{ color: "#0151af" }}>{p.delayRemaining ?? "calculating…"}</span>
        </span>
        {isFast && <FastBadge />}
      </div>
    )
  }

  if (p.status === "Active") {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: "13px", fontFamily: FONT, fontWeight: 300, color: "#666" }}>
          <style>{`
            @keyframes ellipsis {
              0%   { content: "."; }
              33%  { content: ".."; }
              66%  { content: "..."; }
              100% { content: "."; }
            }
            .voting-ellipsis::after {
              content: ".";
              display: inline-block;
              width: 1em;
              animation: ellipsis 1.2s steps(1, end) infinite;
            }
          `}</style>
          Voting in progress<span className="voting-ellipsis" />
        </span>
        {!isFast && (p.quorum
          ? <UserRoundCheck size={13} color="#3ebf6e" />
          : <UserRoundX size={13} color="#ef4345" />
        )}
        {isFast ? (
          <VoteStat icon={<ThumbsDown size={13} color="#0151af" />} value={p.against} color="#0151af" />
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <VoteStat icon={<ThumbsUp size={13} color="#0151af" />} value={p.for}     color="#0151af" />
            <VoteStat icon={<ThumbsDown size={13} color="#0151af" />} value={p.against} color="#0151af" />
            <VoteStat icon={<Ban size={13} color="#0151af" />}        value={p.abstain} color="#0151af" />
          </div>
        )}
        {isFast && <FastBadge />}
        {p.type === "Contested" && <ContestedBadge />}
      </div>
    )
  }

  if (p.status === "Queued") {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: "13px", fontFamily: FONT, fontWeight: 300, color: "#666" }}>
          {"Execution delay: "}
          <span style={{ color: "#0151af" }}>{p.queueRemaining ?? "calculating…"}</span>
        </span>
        {isFast && <FastBadge />}
      </div>
    )
  }

  return null
}

function VoteStat({ icon, value, color }: { icon: React.ReactNode; value: string; color: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      {icon}
      <span style={{ fontSize: "13px", fontFamily: FONT, fontWeight: 300, color }}>{value}</span>
    </div>
  )
}

// ── Proposal Row ──────────────────────────────────────────────────────────────

function ProposalRow({ p, isLast }: { p: ProposalData; isLast: boolean }) {
  const showBar = p.status === "Active" || p.status === "Pending" || p.status === "Queued"
  const dotColor = STATUS_DOT[p.status] ?? "#666"

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: 10,
      padding: "16px 24px",
      borderBottom: isLast ? "none" : "1px solid #e5e5e5",
      cursor: "pointer",
    }}>
      {/* Top row: title + optional type badge + status */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
          <span style={{
            fontSize: "15px", fontFamily: FONT, fontWeight: 700, color: "#0a0d10",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>
            {p.title}
          </span>
        </div>

        {/* Inline status */}
        <div style={{ display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
          <span style={{ fontSize: "13px", fontFamily: FONT, fontWeight: 300, color: "#666" }}>Status:</span>
          {p.status === "Active" ? (
            <div style={{ position: "relative", width: 7, height: 7, flexShrink: 0 }}>
              <style>{`@keyframes pulse-ring { 0% { transform: scale(1); opacity: 0.6; } 100% { transform: scale(2.6); opacity: 0; } }`}</style>
              <div style={{
                position: "absolute", inset: 0, borderRadius: "50%",
                background: "#3BBEFF",
                animation: "pulse-ring 1.4s ease-out infinite",
              }} />
              <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#3BBEFF" }} />
            </div>
          ) : (
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: dotColor, flexShrink: 0 }} />
          )}
          <span style={{ fontSize: "13px", fontFamily: FONT, fontWeight: 700, color: dotColor }}>
            {p.status === "Defeated" ? "Dead" : p.status}
          </span>
        </div>
      </div>

      {/* Progress bar (Active, Pending, Queued) */}
      {showBar && <ProposalProgressBar proposal={p} />}

      {/* Feedback / vote info below bar */}
      {showBar && <FeedbackRow p={p} />}

      {/* Executed state: success message + final votes */}
      {p.status === "Executed" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <CircleCheckBig size={13} color="#0151af" />
            <span style={{ fontSize: "13px", fontFamily: FONT, fontWeight: 300, color: "#0151af" }}>
              Proposal has been executed successfully.
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <VoteStat icon={<ThumbsUp size={13} color="#bbb" />}   value={p.for}     color="#999" />
            <VoteStat icon={<ThumbsDown size={13} color="#bbb" />}  value={p.against} color="#999" />
            <VoteStat icon={<Ban size={13} color="#bbb" />}          value={p.abstain} color="#999" />
          </div>
        </div>
      )}

      {/* Defeated/Dead state */}
      {p.status === "Defeated" && (
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <UserX size={13} color="#ef4345" />
          <span style={{ fontSize: "13px", fontFamily: FONT, fontWeight: 300, color: "#ef4345" }}>
            Quorum was not reached. Proposal is now dead.
          </span>
        </div>
      )}
    </div>
  )
}

// ── Status Multi-Select Dropdown ──────────────────────────────────────────────

function StatusMultiSelect({
  selected,
  onChange,
}: {
  selected: string[]
  onChange: (v: string[]) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const toggle = (status: string) => {
    onChange(selected.includes(status) ? selected.filter(s => s !== status) : [...selected, status])
  }

  const label = selected.length === 0 ? "All statuses" : selected.length === 1 ? selected[0] : `${selected.length} statuses`

  return (
    <div ref={ref} style={{ position: "relative", flexShrink: 0 }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: "flex", alignItems: "center", gap: "6px",
          padding: "9px 12px", borderRadius: "10px",
          border: "1px solid #e5e5e5", background: "#fafafa",
          fontSize: "13px", fontFamily: FONT, fontWeight: 300,
          color: selected.length > 0 ? "#0151af" : "#666",
          cursor: "pointer", whiteSpace: "nowrap",
        }}
      >
        {label}
        <ChevronDown size={13} color={selected.length > 0 ? "#0151af" : "#aaa"} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s" }} />
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", right: 0, zIndex: 50,
          background: "white", borderRadius: "12px", border: "1px solid #e5e5e5",
          boxShadow: "0 4px 16px rgba(0,0,0,0.08)", minWidth: "160px", overflow: "hidden",
        }}>
          {STATUS_OPTIONS.map(status => {
            const isChecked = selected.includes(status)
            const style = STATUS_STYLES[status]
            return (
              <button
                key={status}
                onClick={() => toggle(status)}
                style={{
                  width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "10px 14px", background: "none", border: "none",
                  cursor: "pointer", fontFamily: FONT, fontSize: "13px", fontWeight: 400,
                  color: isChecked ? style.color : "#333",
                  textAlign: "left",
                }}
              >
                <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: style.color, flexShrink: 0 }} />
                  {status}
                </span>
                {isChecked && <Check size={13} color={style.color} />}
              </button>
            )
          })}
          {selected.length > 0 && (
            <>
              <div style={{ height: 1, background: "#f0ece6", margin: "0 10px" }} />
              <button
                onClick={() => onChange([])}
                style={{
                  width: "100%", padding: "10px 14px", background: "none", border: "none",
                  cursor: "pointer", fontFamily: FONT, fontSize: "13px", fontWeight: 300,
                  color: "#999", textAlign: "left",
                }}
              >
                Clear filters
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}

// ── Governance Proposal List ──────────────────────────────────────────────────

function GovernanceProposalList() {
  const pathname = usePathname()
  const router = useRouter()
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const [activeFilter, setActiveFilter] = useState<StatusFilter>("All")
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
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
      const t = setTimeout(() => inputRef.current?.focus(), 50)
      return () => clearTimeout(t)
    } else {
      setSearch("")
    }
  }, [searchOpen])

  const filtered = proposals
    .filter(p => {
      const matchesStatus = searchOpen
        ? selectedStatuses.length === 0 || selectedStatuses.includes(p.status)
        : activeFilter === "All" || p.status === activeFilter
      const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase())
      return matchesStatus && matchesSearch
    })
    .sort((a, b) => (STATUS_ORDER[a.status] ?? 99) - (STATUS_ORDER[b.status] ?? 99))

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
        <div style={{ display: "flex", alignItems: "center", gap: "4px", flex: searchOpen ? 1 : "none", minWidth: 0 }}>
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

          <div style={{
            flex: 1,
            minWidth: 0,
            maxWidth: searchOpen ? "1000px" : "0px",
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
                width: "100%",
                padding: "7px 10px",
                borderRadius: "8px",
                border: "1px solid #e5e5e5",
                background: "#fafafa",
                fontSize: "13px", fontFamily: FONT, fontWeight: 300, color: "#0a0d10",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 20, background: "#e5e5e5", flexShrink: 0 }} />

        {/* Status filter */}
        {searchOpen ? (
          <StatusMultiSelect selected={selectedStatuses} onChange={setSelectedStatuses} />
        ) : (
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
        )}
      </div>

      {/* Proposal rows */}
      {filtered.length === 0 ? (
        <div style={{ padding: "32px 24px", textAlign: "center", fontSize: "14px", fontFamily: FONT, fontWeight: 300, color: "#aaa" }}>
          No proposals found
        </div>
      ) : filtered.map((p, i) => (
        <ProposalRow key={i} p={p} isLast={i === filtered.length - 1} />
      ))}

      {/* Show all */}
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

        {/* Top voting addresses */}
        <div style={{ marginTop: "12px" }}>
          <div style={{
            fontSize: "16px", fontFamily: FONT,
            fontWeight: 500, color: "#0a0d10", marginBottom: "10px",
          }}>
            Top voting addresses
          </div>

          <div style={{ display: "flex", padding: "8px 0", borderBottom: "1px solid #e5e5e5" }}>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: "13px", fontFamily: FONT, fontWeight: 300, color: "#999" }}>Address</span>
            </div>
            <div style={{ width: 110, textAlign: "right" }}>
              <span style={{ fontSize: "13px", fontFamily: FONT, fontWeight: 300, color: "#999" }}>Votes</span>
            </div>
            <div style={{ width: 80, textAlign: "right" }}>
              <span style={{ fontSize: "13px", fontFamily: FONT, fontWeight: 300, color: "#999" }}>Vote weight</span>
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
