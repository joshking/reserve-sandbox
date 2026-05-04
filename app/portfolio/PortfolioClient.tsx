"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import {
  ArrowUpRight, ArrowRight, TrendingUp, TrendingDown,
  Globe, Flower2, Scale, Landmark, MoreVertical,
  ArrowDownUp, CheckSquare, Lock, Copy,
  ChartLine, ChevronDown, Gift, FileDown, Search, ArrowUpDown,
} from "lucide-react"

const FONT = "'TWK Lausanne', system-ui, sans-serif"

// ── Breakpoints ───────────────────────────────────────────────────────────────

function useBreakpoint() {
  const [bp, setBp] = useState({ tablet: false, mobile: false })
  useEffect(() => {
    const check = () => setBp({
      tablet: window.innerWidth < 1100,
      mobile: window.innerWidth < 768,
    })
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])
  return bp
}

// ── Overview chart data ───────────────────────────────────────────────────────

const CW = 937
const CH = 352
const CMAX = 1000

function toY(val: number) { return CH - (val / CMAX) * CH }

type ChartPoint = {
  label: string; x: number
  rsr: number; vl: number; srsr: number; ydtf: number; idtf: number
}

const CHART_DATA: ChartPoint[] = [
  { label: "5 Dec",  x: 0,   rsr: 378,    vl: 44,    srsr: 42,    ydtf: 20,    idtf: 34    },
  { label: "11 Dec", x: 63,  rsr: 392,    vl: 44,    srsr: 42,    ydtf: 20,    idtf: 37    },
  { label: "17 Dec", x: 125, rsr: 418,    vl: 44,    srsr: 42,    ydtf: 20,    idtf: 40    },
  { label: "23 Dec", x: 188, rsr: 458,    vl: 44,    srsr: 44,    ydtf: 21,    idtf: 43    },
  { label: "29 Dec", x: 250, rsr: 428,    vl: 44,    srsr: 42,    ydtf: 20,    idtf: 38    },
  { label: "04 Jan", x: 313, rsr: 492,    vl: 44,    srsr: 44,    ydtf: 21,    idtf: 48    },
  { label: "10 Jan", x: 375, rsr: 558,    vl: 44,    srsr: 44,    ydtf: 21,    idtf: 52    },
  { label: "16 Jan", x: 438, rsr: 518,    vl: 44,    srsr: 43,    ydtf: 21,    idtf: 46    },
  { label: "22 Jan", x: 500, rsr: 578,    vl: 44,    srsr: 44,    ydtf: 22,    idtf: 50    },
  { label: "28 Jan", x: 563, rsr: 618,    vl: 45,    srsr: 44,    ydtf: 22,    idtf: 52    },
  { label: "03 Feb", x: 625, rsr: 658,    vl: 45,    srsr: 45,    ydtf: 22,    idtf: 55    },
  { label: "09 Feb", x: 688, rsr: 198,    vl: 44,    srsr: 43,    ydtf: 20,    idtf: 22    },
  { label: "15 Feb", x: 750, rsr: 132,    vl: 44,    srsr: 43,    ydtf: 21,    idtf: 24    },
  { label: "21 Feb", x: 813, rsr: 118.60, vl: 43.81, srsr: 43.52, ydtf: 21.92, idtf: 37.00 },
  { label: "27 Feb", x: 875, rsr: 198,    vl: 44,    srsr: 43,    ydtf: 21,    idtf: 34    },
  { label: "05 Mar", x: 937, rsr: 438,    vl: 44,    srsr: 43,    ydtf: 21,    idtf: 43    },
]

const CHART_LAYERS = [
  { label: "RSR",         key: "rsr"  as const, color: "#7b8fcc" },
  { label: "Vote-locked", key: "vl"   as const, color: "#e2c06a" },
  { label: "Staked RSR",  key: "srsr" as const, color: "#e8907a" },
  { label: "Yield DTFs",  key: "ydtf" as const, color: "#6abcaa" },
  { label: "Index DTFs",  key: "idtf" as const, color: "#a8bce0" },
]

function getCum(d: ChartPoint): [number, number, number, number, number, number] {
  const c1 = d.rsr; const c2 = c1 + d.vl; const c3 = c2 + d.srsr
  const c4 = c3 + d.ydtf; const c5 = c4 + d.idtf
  return [0, c1, c2, c3, c4, c5]
}

function areaPath(data: ChartPoint[], idx: 1 | 2 | 3 | 4 | 5): string {
  const prevIdx = (idx - 1) as 0 | 1 | 2 | 3 | 4
  const fwd = data.map((d, i) => `${i === 0 ? "M" : "L"}${d.x},${toY(getCum(d)[idx])}`).join(" ")
  const bwd = [...data].reverse().map(d => `L${d.x},${idx > 1 ? toY(getCum(d)[prevIdx]) : CH}`).join(" ")
  return `${fwd} ${bwd} Z`
}

// ── Rewards chart data ────────────────────────────────────────────────────────

const RCW = 737
const RCH = 352
const RMAX = 16000

function toRY(val: number) { return RCH - (val / RMAX) * RCH }

type RewardsPoint = { label: string; x: number; staking: number; votelock: number }

const REWARDS_DATA: RewardsPoint[] = [
  { label: "Jan 2025", x: 0,    staking: 80,   votelock: 60   },
  { label: "Feb 2025", x: 67,   staking: 180,  votelock: 120  },
  { label: "Mar 2025", x: 134,  staking: 340,  votelock: 220  },
  { label: "Apr 2025", x: 201,  staking: 580,  votelock: 360  },
  { label: "May 2025", x: 268,  staking: 900,  votelock: 560  },
  { label: "Jun 2025", x: 335,  staking: 1500, votelock: 900  },
  { label: "Jul 2025", x: 402,  staking: 2400, votelock: 1400 },
  { label: "Aug 2025", x: 469,  staking: 3400, votelock: 2000 },
  { label: "Sep 2025", x: 536,  staking: 4500, votelock: 2800 },
  { label: "Oct 2025", x: 603,  staking: 5300, votelock: 3500 },
  { label: "Nov 2025", x: 670,  staking: 5900, votelock: 4400 },
  { label: "Dec 2025", x: 737,  staking: 6462, votelock: 5562 },
]

const RSR_MAX = 45000
function toRSRY(val: number) { return RCH - (val / RSR_MAX) * RCH }

type RSRPoint = { label: string; x: number; total: number }
const RSR_DATA: RSRPoint[] = [
  { label: "Jan 2025", x: 0,    total: 200   },
  { label: "Feb 2025", x: 67,   total: 600   },
  { label: "Mar 2025", x: 134,  total: 1400  },
  { label: "Apr 2025", x: 201,  total: 2800  },
  { label: "May 2025", x: 268,  total: 5000  },
  { label: "Jun 2025", x: 335,  total: 8500  },
  { label: "Jul 2025", x: 402,  total: 14000 },
  { label: "Aug 2025", x: 469,  total: 20000 },
  { label: "Sep 2025", x: 536,  total: 28000 },
  { label: "Oct 2025", x: 603,  total: 34000 },
  { label: "Nov 2025", x: 670,  total: 39000 },
  { label: "Dec 2025", x: 737,  total: 42132 },
]

type Preset = "24hr" | "7d" | "1m" | "3m" | "6m" | "alltime"

const PRESET_SLICES: Record<Preset, number> = {
  "24hr": 1, "7d": 2, "1m": 2, "3m": 4, "6m": 7, "alltime": 12,
}

const PRESET_DATES: Record<Preset, { from: string; to: string }> = {
  "24hr":    { from: "2025-12-31", to: "2025-12-31" },
  "7d":      { from: "2025-12-25", to: "2025-12-31" },
  "1m":      { from: "2025-12-01", to: "2025-12-31" },
  "3m":      { from: "2025-10-01", to: "2025-12-31" },
  "6m":      { from: "2025-07-01", to: "2025-12-31" },
  "alltime": { from: "2025-01-01", to: "2025-12-31" },
}

function formatDateDisplay(iso: string): string {
  if (!iso) return ""
  const [y, m, d] = iso.split("-")
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
  return `${months[parseInt(m) - 1]} ${d}, ${y}`
}

type PresetTotals = { staking: string; votelock: string; total: string; pct: string; change: string; positive: boolean }

const USD_PRESET_TOTALS: Record<Preset, PresetTotals> = {
  "24hr":    { staking: "$12.18",    votelock: "$9.51",     total: "$21.69",     pct: "2.1%",  change: "+$0.45",     positive: true },
  "7d":      { staking: "$98.43",    votelock: "$83.02",    total: "$181.45",    pct: "4.2%",  change: "+$7.32",     positive: true },
  "1m":      { staking: "$562.98",   votelock: "$484.31",   total: "$1,047.29",  pct: "9.5%",  change: "+$90.62",    positive: true },
  "3m":      { staking: "$1,962.31", votelock: "$1,762.98", total: "$3,725.29",  pct: "15.2%", change: "+$499.41",   positive: true },
  "6m":      { staking: "$4,562.31", votelock: "$3,962.98", total: "$8,525.29",  pct: "24.8%", change: "+$1,692.18", positive: true },
  "alltime": { staking: "$6,999.24", votelock: "$5,562.98", total: "$12,562.22", pct: "6.8%",  change: "+$362.45",   positive: true },
}

const RSR_PRESET_TOTALS: Record<Preset, PresetTotals> = {
  "24hr":    { staking: "",           votelock: "58.42",     total: "58.42",     pct: "2.1%", change: "+1.21",   positive: true },
  "7d":      { staking: "",           votelock: "312.18",    total: "312.18",    pct: "2.1%", change: "+6.32",   positive: true },
  "1m":      { staking: "",           votelock: "1,842.31",  total: "1,842.31",  pct: "2.1%", change: "+38.25",  positive: true },
  "3m":      { staking: "",           votelock: "8,421.92",  total: "8,421.92",  pct: "2.1%", change: "+174.91", positive: true },
  "6m":      { staking: "",           votelock: "21,432.18", total: "21,432.18", pct: "2.1%", change: "+445.13", positive: true },
  "alltime": { staking: "",           votelock: "42,131.92", total: "42,131.92", pct: "2.3%", change: "+971.453",positive: true },
}

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

function labelToIso(label: string): string {
  const [mon, year] = label.split(" ")
  const m = String(MONTH_NAMES.indexOf(mon) + 1).padStart(2, "0")
  return `${year}-${m}-01`
}

function filterByDateRange<T extends { label: string }>(data: T[], from: string, to: string): T[] {
  if (!from && !to) return data
  return data.filter(d => {
    const iso = labelToIso(d.label)
    return (!from || iso >= from) && (!to || iso <= to)
  })
}

function rewardsPath(data: RewardsPoint[], layer: "staking" | "votelock"): string {
  const pts = data.map((d, i) => ({
    ...d,
    nx: data.length === 1 ? RCW / 2 : (i / (data.length - 1)) * RCW,
  }))
  const fwd = pts.map((d, i) => {
    const topVal = layer === "staking" ? d.staking + d.votelock : d.votelock
    return `${i === 0 ? "M" : "L"}${d.nx},${toRY(topVal)}`
  }).join(" ")
  const bwd = [...pts].reverse().map(d => {
    const botVal = layer === "staking" ? d.votelock : 0
    return `L${d.nx},${toRY(botVal)}`
  }).join(" ")
  return `${fwd} ${bwd} Z`
}

function rsrPath(data: RSRPoint[]): string {
  const pts = data.map((d, i) => ({
    ...d,
    nx: data.length === 1 ? RCW / 2 : (i / (data.length - 1)) * RCW,
  }))
  const fwd = pts.map((d, i) => `${i === 0 ? "M" : "L"}${d.nx},${toRSRY(d.total)}`).join(" ")
  const bwd = [...pts].reverse().map(d => `L${d.nx},${RCH}`).join(" ")
  return `${fwd} ${bwd} Z`
}

// ── Shared primitives ─────────────────────────────────────────────────────────

function SectionHeading({
  icon, title, subtitle, subtitleLink, rightContent,
}: {
  icon: React.ReactNode; title: string; subtitle: string
  subtitleLink?: string; rightContent?: React.ReactNode
}) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", paddingLeft: 24, marginBottom: 16 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {icon}
          <span style={{ fontFamily: FONT, fontSize: 18, fontWeight: 700, color: "#0151af" }}>{title}</span>
        </div>
        <p style={{ fontFamily: FONT, fontSize: 16, fontWeight: 300, color: "#0a0d10", margin: 0 }}>
          {subtitle}
          {subtitleLink && (
            <> <Link href="#" style={{ color: "#0151af", textDecoration: "none" }}>{subtitleLink}</Link>.</>
          )}
        </p>
      </div>
      {rightContent}
    </div>
  )
}

function TableCard({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: "white", border: "1px solid #e0d5c7", borderRadius: 20, overflow: "hidden", width: "100%" }}>
      {children}
    </div>
  )
}

function TRow({ children, bordered = true, minHeight = 96 }: { children: React.ReactNode; bordered?: boolean; minHeight?: number }) {
  return (
    <div style={{ display: "flex", alignItems: "stretch", minHeight, borderBottom: bordered ? "1px solid #e5e5e5" : "none", width: "100%" }}>
      {children}
    </div>
  )
}

function THead({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "stretch", height: 65, borderBottom: "1px solid #e5e5e5", width: "100%" }}>
      {children}
    </div>
  )
}

function Cell({ children, width, flex }: { children: React.ReactNode; width?: number; flex?: number }) {
  return (
    <div style={{ width: flex ? undefined : width, flex: flex ?? undefined, flexShrink: 0, padding: "0 24px", display: "flex", alignItems: "center" }}>
      {children}
    </div>
  )
}

function THCell({ children, width, flex }: { children: React.ReactNode; width?: number; flex?: number }) {
  return (
    <div style={{ width: flex ? undefined : width, flex: flex ?? undefined, flexShrink: 0, padding: "0 24px", display: "flex", alignItems: "center" }}>
      <span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 300, color: "#666" }}>{children}</span>
    </div>
  )
}

function TokenBubble({ letter, color, size = 32 }: { letter: string; color: string; size?: number }) {
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <span style={{ fontFamily: FONT, fontWeight: 700, color: "white", fontSize: size * 0.375, lineHeight: 1 }}>{letter}</span>
    </div>
  )
}

function ValuePair({ main, sub, mainWeight = 700, mainColor = "#0a0d10" }: { main: string; sub: string; mainWeight?: number; mainColor?: string }) {
  return (
    <div>
      <p style={{ fontFamily: FONT, fontSize: 16, fontWeight: mainWeight, color: mainColor, margin: "0 0 3px 0" }}>{main}</p>
      <p style={{ fontFamily: FONT, fontSize: 13, fontWeight: 300, color: "#999", margin: 0 }}>{sub}</p>
    </div>
  )
}

function PerfCell({ pct, abs, positive }: { pct: string; abs: string; positive: boolean }) {
  const color = positive ? "#23c45f" : "#ef4345"
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 2, marginBottom: 3 }}>
        {positive ? <TrendingUp size={14} color={color} /> : <TrendingDown size={14} color={color} />}
        <span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 300, color }}>{pct}</span>
      </div>
      <span style={{ fontFamily: FONT, fontSize: 13, fontWeight: 300, color: "#999" }}>{abs}</span>
    </div>
  )
}

function ClaimBtn() {
  return (
    <button style={{ background: "#0151af", color: "white", border: "1px solid #0151af", borderRadius: 42, height: 32, padding: "0 12px", fontFamily: FONT, fontSize: 14, fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap" }}>
      Claim
    </button>
  )
}

function OutlineBtn({ label, color = "#0151af" }: { label: string; color?: string }) {
  return (
    <button style={{ background: "none", color, border: "1px solid #e5e5e5", borderRadius: 42, height: 32, padding: "0 12px", fontFamily: FONT, fontSize: 14, fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap" }}>
      {label}
    </button>
  )
}

function StatusPill({ label, color }: { label: string; color: string }) {
  return (
    <div style={{ border: "1px solid #e5e5e5", borderRadius: 42, height: 32, padding: "0 12px", display: "inline-flex", alignItems: "center" }}>
      <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 500, color, whiteSpace: "nowrap" }}>{label}</span>
    </div>
  )
}

// ── Portfolio sidebar nav ─────────────────────────────────────────────────────

type Section = "overview" | "rewards" | "transactions"

function PortfolioSidebar({ section, onSection }: { section: Section; onSection: (s: Section) => void }) {
  const items: { key: Section; Icon: React.ElementType; label: string }[] = [
    { key: "overview",     Icon: ChartLine,  label: "Overview"     },
    { key: "rewards",      Icon: Gift,       label: "Rewards"      },
    { key: "transactions", Icon: ArrowUpDown, label: "Transactions" },
  ]
  return (
    <div style={{ width: 200, flexShrink: 0, padding: "32px 24px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {items.map(({ key, Icon, label }) => {
          const active = section === key
          return (
            <button
              key={key}
              onClick={() => onSection(key)}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                background: "none", border: "none", cursor: "pointer", padding: 0,
                fontFamily: FONT, fontSize: 16, fontWeight: 300,
                color: active ? "#0151af" : "#0a0d10",
                width: "100%", textAlign: "left",
              }}
            >
              <div style={{ width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", flexShrink: 0 }}>
                <Icon size={16} color={active ? "#0151af" : "#0a0d10"} />
              </div>
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── Overview chart ────────────────────────────────────────────────────────────

function PortfolioChart() {
  const [activeTab, setActiveTab] = useState<string>("7d")
  const [hoverIdx, setHoverIdx] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const tabs = ["24hr", "7d", "1m", "3m", "6m", "All time"]
  const yLabels = ["$1K", "$700", "$350", "0.0"]
  const xLabels = CHART_DATA.filter((_, i) => i % 2 === 0).map(d => d.label)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const svgX = ((e.clientX - rect.left) / rect.width) * CW
    let nearest = 0; let minDist = Infinity
    CHART_DATA.forEach((d, i) => {
      const dist = Math.abs(d.x - svgX)
      if (dist < minDist) { minDist = dist; nearest = i }
    })
    setHoverIdx(nearest)
  }

  const hp = hoverIdx !== null ? CHART_DATA[hoverIdx] : null
  const hpCum = hp ? getCum(hp) : null
  const hpPct = hp ? (hp.x / CW) * 100 : 0
  const hpTotal = hp ? hp.rsr + hp.vl + hp.srsr + hp.ydtf + hp.idtf : 0
  const hpYear = hp ? (hp.label.includes("Dec") ? "2025" : "2026") : ""

  const tooltip = hp && hpCum ? (
    <div style={{ position: "absolute", top: 16, left: hpPct > 55 ? undefined : `calc(${hpPct}% + 14px)`, right: hpPct > 55 ? `calc(${100 - hpPct}% + 14px)` : undefined, background: "white", borderRadius: 12, padding: "12px 14px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", minWidth: 195, zIndex: 10, pointerEvents: "none" }}>
      <p style={{ fontFamily: FONT, fontSize: 12, fontWeight: 300, color: "#666", margin: "0 0 8px" }}>{hp.label}, {hpYear}</p>
      {CHART_LAYERS.map((layer) => (
        <div key={layer.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, marginBottom: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: layer.color, flexShrink: 0 }} />
            <span style={{ fontFamily: FONT, fontSize: 13, fontWeight: 300, color: "#0a0d10" }}>{layer.label}</span>
          </div>
          <span style={{ fontFamily: FONT, fontSize: 13, fontWeight: 500, color: "#0a0d10" }}>${(hp[layer.key] as number).toFixed(2)}</span>
        </div>
      ))}
      <div style={{ borderTop: "1px solid #f0ece6", marginTop: 8, paddingTop: 8, display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontFamily: FONT, fontSize: 13, fontWeight: 700, color: "#0a0d10" }}>Total</span>
        <span style={{ fontFamily: FONT, fontSize: 13, fontWeight: 700, color: "#0a0d10" }}>${hpTotal.toFixed(2)}</span>
      </div>
    </div>
  ) : null

  return (
    <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div style={{ paddingLeft: 24, display: "flex", flexDirection: "column", gap: 8 }}>
          <span style={{ fontFamily: FONT, fontSize: 46, fontWeight: 500, color: "#0151af", lineHeight: "50px" }}>$31,373.24</span>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <TrendingUp size={18} color="#0151af" />
            <span style={{ fontFamily: FONT, fontSize: 18, fontWeight: 300, color: "#0151af" }}>6.8% (+$362.45)</span>
            <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 300, color: "#999" }}>7D</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", background: "#f2f2f2", borderRadius: 24, padding: 2 }}>
          {tabs.map((t) => {
            const key = t.toLowerCase().replace(" ", "")
            const isActive = activeTab === key
            return (
              <button key={t} onClick={() => setActiveTab(key)} style={{ padding: "6px 10px", borderRadius: isActive ? 14 : 6, border: "none", cursor: "pointer", background: isActive ? "white" : "transparent", boxShadow: isActive ? "0 1px 8px 2px rgba(0,0,0,0.05)" : "none", fontFamily: FONT, fontSize: 14, fontWeight: isActive ? 500 : 300, color: isActive ? "#0151af" : "#0a0d10", whiteSpace: "nowrap" }}>
                {t}
              </button>
            )
          })}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 16, width: "100%" }}>
        <div ref={containerRef} style={{ flex: 1, minWidth: 0, position: "relative", height: 400, cursor: "crosshair" }} onMouseMove={handleMouseMove} onMouseLeave={() => setHoverIdx(null)}>
          <svg viewBox={`0 0 ${CW} ${CH}`} width="100%" height="370" preserveAspectRatio="none" style={{ display: "block" }}>
            {([1, 2, 3, 4, 5] as const).map((idx) => (
              <path key={idx} d={areaPath(CHART_DATA, idx)} fill={CHART_LAYERS[idx - 1].color} fillOpacity={0.85} />
            ))}
            {hp && <line x1={hp.x} y1={0} x2={hp.x} y2={CH} stroke="#bbb" strokeWidth={0.8} />}
            {hp && hpCum && CHART_LAYERS.map((layer, i) => (
              <circle key={layer.key} cx={hp.x} cy={toY(hpCum[(i + 1) as 1 | 2 | 3 | 4 | 5])} r={3.5} fill={layer.color} stroke="white" strokeWidth={1.5} />
            ))}
          </svg>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
            {xLabels.map((l) => (
              <span key={l} style={{ fontFamily: "'Lato', sans-serif", fontSize: 11, color: "#999" }}>{l}</span>
            ))}
          </div>
          {tooltip}
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: 370, flexShrink: 0 }}>
          {yLabels.map((l) => (
            <span key={l} style={{ fontFamily: "'Lato', sans-serif", fontSize: 11, color: "#666", textAlign: "right", display: "block" }}>{l}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Overview sidebar cards ────────────────────────────────────────────────────

function BreakdownCard() {
  const rows = [
    { label: "Index DTFs", value: "$892.12" },
    { label: "RSR", value: "$393.11" },
    { label: "Staked RSR", value: "$59.31" },
    { label: "Vote-locked", value: "$442.02" },
    { label: "Yield", value: "$59.31" },
  ]
  return (
    <div style={{ background: "white", border: "1px solid #e0d5c7", borderRadius: 20, padding: "16px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <p style={{ fontFamily: FONT, fontSize: 20, fontWeight: 700, color: "#0151af", margin: "0 0 4px" }}>Portfolio Breakdown</p>
        <p style={{ fontFamily: FONT, fontSize: 14, fontWeight: 300, color: "#666", margin: 0 }}>Value by asset type</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {rows.map(({ label, value }) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 300, color: "#0a0d10" }}>{label}</span>
            <span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, color: "#0a0d10" }}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function RewardsCard({ onRewards }: { onRewards: () => void }) {
  return (
    <div style={{ background: "white", border: "1px solid #e0d5c7", borderRadius: 20, padding: "16px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
      <div>
        <p style={{ fontFamily: FONT, fontSize: 20, fontWeight: 700, color: "#0151af", margin: "0 0 4px" }}>Rewards Available</p>
        <p style={{ fontFamily: FONT, fontSize: 14, fontWeight: 300, color: "#666", margin: 0 }}>Your total participation awards available across all chains</p>
      </div>
      <span style={{ fontFamily: FONT, fontSize: 20, fontWeight: 700, color: "#0151af" }}>$43.23</span>
      <button onClick={onRewards} style={{ background: "#0151af", color: "white", border: "none", borderRadius: 16, padding: "8px 16px", fontFamily: FONT, fontSize: 12, fontWeight: 500, cursor: "pointer", alignSelf: "flex-start" }}>
        Collect Rewards
      </button>
      <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Link href="#" style={{ fontFamily: FONT, fontSize: 12, fontWeight: 300, color: "#0151af", textDecoration: "none" }}>
          Learn more about how to earn APY
        </Link>
        <ArrowUpRight size={12} color="#0151af" />
      </div>
    </div>
  )
}

// ── Overview sections ─────────────────────────────────────────────────────────

function DTFPositionsSection({ tablet, mobile }: { tablet: boolean; mobile: boolean }) {
  const rows = [
    { name: "CoinMarketCap 20 Index DTF", ticker: "$LCAP", letter: "L", color: "#1a4fc4", perf: "-9.61%", perfAbs: "-$84.29 USDC", perfPos: false, unrealized: "$342.28", unrealizedSub: "USDC", unrealizedColor: "#ef4345", avgPrice: "$144.08", mktCap: "$13,151,364", mktCapSub: "USDC", balance: "5.5K", balanceSub: "CMC20", value: "$342.28", valueSub: "USDC" },
    { name: "Alpha Base Index", ticker: "$ABX", letter: "A", color: "#6366f1", perf: "+1.87%", perfAbs: "+$204.29 USDC", perfPos: true, unrealized: "$198.73", unrealizedSub: "USDC", unrealizedColor: "#23c45f", avgPrice: "$0.0007381", mktCap: "$110,098", mktCapSub: "USDC", balance: "132.2K", balanceSub: "ABX", value: "$198.73", valueSub: "USDC" },
  ]
  const rightLink = (
    <Link href="/" style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: FONT, fontSize: 16, fontWeight: 500, color: "#0151af", textDecoration: "none", paddingRight: 24 }}>
      Browse all Index DTFs <ArrowRight size={16} />
    </Link>
  )
  return (
    <div style={{ padding: mobile ? "0 20px" : "0 40px", marginBottom: 32 }}>
      <SectionHeading icon={<Globe size={20} color="#0151af" />} title="DTF Positions" subtitle="Your Decentralized Token Folios investments." rightContent={rightLink} />
      <TableCard>
        {mobile ? (
          rows.map((row, i) => (
            <div key={row.ticker} style={{ display: "flex", alignItems: "center", padding: "20px 24px", gap: 12, borderBottom: i < rows.length - 1 ? "1px solid #e5e5e5" : "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
                <TokenBubble letter={row.letter} color={row.color} />
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontFamily: FONT, fontSize: 15, fontWeight: 700, color: "#0a0d10", margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{row.name}</p>
                  <p style={{ fontFamily: FONT, fontSize: 14, fontWeight: 300, color: "#666", margin: 0 }}>{row.ticker}</p>
                </div>
              </div>
              <div style={{ display: "flex", gap: 20, flexShrink: 0 }}>
                <ValuePair main={row.balance} sub={row.balanceSub} mainWeight={300} />
                <ValuePair main={row.value} sub={row.valueSub} />
              </div>
            </div>
          ))
        ) : (
          <>
            <THead>
              <THCell flex={1}>Name</THCell>
              <THCell width={190}>Performance <span style={{ color: "#999", marginLeft: 4 }}>(24H)</span></THCell>
              {!tablet && <THCell width={155}>Unrealized P/L</THCell>}
              {!tablet && <THCell width={155}>Average price</THCell>}
              {!tablet && <THCell width={155}>Market Cap</THCell>}
              <THCell width={145}>Balance</THCell>
              <THCell width={145}>Value</THCell>
            </THead>
            {rows.map((row, i) => (
              <TRow key={row.ticker} bordered={i < rows.length - 1}>
                <Cell flex={1}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <TokenBubble letter={row.letter} color={row.color} />
                    <div>
                      <p style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, color: "#0a0d10", margin: "0 0 2px" }}>{row.name}</p>
                      <p style={{ fontFamily: FONT, fontSize: 16, fontWeight: 300, color: "#666", margin: 0 }}>{row.ticker}</p>
                    </div>
                  </div>
                </Cell>
                <Cell width={190}><PerfCell pct={row.perf} abs={row.perfAbs} positive={row.perfPos} /></Cell>
                {!tablet && <Cell width={155}><div><p style={{ fontFamily: FONT, fontSize: 16, fontWeight: 300, color: row.unrealizedColor, margin: "0 0 3px" }}>{row.unrealized}</p><p style={{ fontFamily: FONT, fontSize: 13, fontWeight: 300, color: "#999", margin: 0 }}>{row.unrealizedSub}</p></div></Cell>}
                {!tablet && <Cell width={155}><span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 300, color: "#0a0d10" }}>{row.avgPrice}</span></Cell>}
                {!tablet && <Cell width={155}><ValuePair main={row.mktCap} sub={row.mktCapSub} mainWeight={300} /></Cell>}
                <Cell width={145}><ValuePair main={row.balance} sub={row.balanceSub} mainWeight={300} /></Cell>
                <Cell width={145}><ValuePair main={row.value} sub={row.valueSub} /></Cell>
              </TRow>
            ))}
          </>
        )}
      </TableCard>
    </div>
  )
}

function StakedPositionsSection({ tablet, mobile }: { tablet: boolean; mobile: boolean }) {
  return (
    <div style={{ padding: mobile ? "0 20px" : "0 40px", marginBottom: 32 }}>
      <SectionHeading icon={<Scale size={20} color="#0151af" />} title="Staked Positions" subtitle="Stake your RSR and earn APY." subtitleLink="Learn more" />
      <TableCard>
        {mobile ? (
          <div style={{ display: "flex", alignItems: "center", padding: "20px 24px", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
              <TokenBubble letter="E" color="#0151af" />
              <span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, color: "#0a0d10" }}>eth+RSR</span>
            </div>
            <div style={{ display: "flex", gap: 16, flexShrink: 0 }}>
              <ValuePair main="17.76K" sub="eth+RSR" mainWeight={300} />
              <ValuePair main="$65.32" sub="USDC" />
            </div>
          </div>
        ) : (
          <>
            <THead>
              <THCell flex={1}>Position</THCell>
              {!tablet && <THCell width={140}>Governs</THCell>}
              {!tablet && <THCell width={90}>APY</THCell>}
              <THCell width={145}>Balance</THCell>
              <THCell width={145}>Value (USD)</THCell>
              <THCell width={145}>Value (RSR)</THCell>
              <THCell width={130}>Actions</THCell>
            </THead>
            <TRow bordered={false}>
              <Cell flex={1}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <TokenBubble letter="E" color="#0151af" />
                  <span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, color: "#0a0d10" }}>eth+RSR</span>
                </div>
              </Cell>
              {!tablet && <Cell width={140}><span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 300, color: "#666" }}>LCAP</span></Cell>}
              {!tablet && <Cell width={90}><span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 300, color: "#666" }}>7.05%</span></Cell>}
              <Cell width={145}><ValuePair main="162.3K" sub="eth+RSR" mainWeight={300} /></Cell>
              <Cell width={145}><ValuePair main="$65.32" sub="USD" /></Cell>
              <Cell width={145}><ValuePair main="123.2K" sub="RSR" /></Cell>
              <Cell width={130}>
                <button style={{ background: "none", border: "none", cursor: "pointer", padding: 8, display: "flex" }}>
                  <MoreVertical size={20} color="#666" />
                </button>
              </Cell>
            </TRow>
          </>
        )}
      </TableCard>
    </div>
  )
}

function VoteLockedSection({ tablet, mobile }: { tablet: boolean; mobile: boolean }) {
  const rows = [
    { token: "vlRSR-MVDA25", letter: "#", color: "#1a6bbf", lockIcon: <Lock size={14} color="#666" />, unlockStatus: null, governs: "MVDA25", apy: "7.05%", balance: "162.3K", balanceSub: "RSR", value: "$442.02", valueSub: "USDC", collectAmt: "$55.31", action: "menu" as const },
    { token: "vlRSR-SINGLE", letter: "#", color: "#1a6bbf", lockIcon: null, unlockStatus: { amount: "5K RSR", time: "6d 23h 59m" }, governs: "BGCI", apy: "7.05%", balance: "162.3K", balanceSub: "RSR", value: "$442.02", valueSub: "USDC", collectAmt: "$55.31", action: "menu" as const },
    { token: "vlRSR-BGCI", letter: "#", color: "#1a6bbf", lockIcon: <Lock size={14} color="#666" style={{ opacity: 0.5 }} />, unlockStatus: null, governs: "BGCI", apy: "6.19%", balance: "259.1K", balanceSub: "RSR", value: "$623.84", valueSub: "USDC", collectAmt: null, action: "withdraw" as const },
  ]
  return (
    <div style={{ padding: mobile ? "0 20px" : "0 40px", marginBottom: 32 }}>
      <SectionHeading icon={<Landmark size={20} color="#0151af" />} title="Vote-locked positions" subtitle="Participate in governance with any ERC-20 token and earn APY rewards." subtitleLink="Learn more" />
      <TableCard>
        {mobile ? (
          rows.map((row, i) => (
            <div key={row.token} style={{ padding: "16px 24px", borderBottom: i < rows.length - 1 ? "1px solid #e5e5e5" : "none" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: row.unlockStatus ? 4 : 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <TokenBubble letter={row.letter} color={row.color} />
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, color: "#0a0d10" }}>{row.token}</span>
                    {row.lockIcon}
                  </div>
                </div>
                <button style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex" }}>
                  <MoreVertical size={20} color="#666" />
                </button>
              </div>
              {row.unlockStatus && (
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 12, paddingLeft: 42 }}>
                  <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 500, color: "#0151af" }}>{row.unlockStatus.amount}</span>
                  <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 300, color: "#666" }}>Unlock in</span>
                  <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 500, color: "#0151af" }}>{row.unlockStatus.time}</span>
                </div>
              )}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <ValuePair main={row.value} sub={row.valueSub} />
                {row.action === "withdraw" ? <OutlineBtn label="Withdraw" /> : <OutlineBtn label={`Collect ${row.collectAmt}`} />}
              </div>
            </div>
          ))
        ) : (
          <>
            <THead>
              <THCell flex={1}>Governance Token</THCell>
              {!tablet && <THCell width={140}>Governs</THCell>}
              {!tablet && <THCell width={90}>APY</THCell>}
              <THCell width={145}>Balance</THCell>
              <THCell width={145}>Value</THCell>
              <THCell width={175}>Actions</THCell>
            </THead>
            {rows.map((row, i) => (
              <TRow key={row.token} bordered={i < rows.length - 1} minHeight={row.unlockStatus ? 117 : 96}>
                <Cell flex={1}>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <TokenBubble letter={row.letter} color={row.color} />
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, color: "#0a0d10" }}>{row.token}</span>
                        {row.lockIcon}
                      </div>
                      {row.unlockStatus && (
                        <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                          <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 500, color: "#0151af" }}>{row.unlockStatus.amount}</span>
                          <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 500, color: "#666" }}>Unlock in</span>
                          <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 500, color: "#0151af" }}>{row.unlockStatus.time}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Cell>
                {!tablet && <Cell width={140}><span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 300, color: "#666" }}>{row.governs}</span></Cell>}
                {!tablet && <Cell width={90}><span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 300, color: "#666" }}>{row.apy}</span></Cell>}
                <Cell width={145}><ValuePair main={row.balance} sub={row.balanceSub} mainWeight={300} /></Cell>
                <Cell width={145}><ValuePair main={row.value} sub={row.valueSub} /></Cell>
                <Cell width={175}>
                  {row.action === "withdraw"
                    ? <OutlineBtn label="Withdraw" />
                    : <OutlineBtn label={`Collect ${row.collectAmt}`} />
                  }
                </Cell>
              </TRow>
            ))}
          </>
        )}
      </TableCard>
    </div>
  )
}

function ActiveProposalsSection({ tablet, mobile }: { tablet: boolean; mobile: boolean }) {
  const rows = [
    { dtf: "CMC20", letter: "C", color: "#2d57f1", title: "December Rebalance", detail: { type: "votes", quorum: true, forPct: 65, votesFor: "100%", votesAgainst: "0%", votesAbstain: "0%" }, date: "Dec 104, 2025", by: "0x6905...C8dE", id: "481244...9185", status: { label: "In Process", color: "#56b891" } },
    { dtf: "vlALTT-ABX", letter: "V", color: "#6366f1", title: "Basket Change", detail: { type: "countdown", text: "Voting Starts in: 1 day, 23 hours, 59 minutes" }, date: "Dec 15, 2025", by: "0x6905...C8dE", id: "481244...9185", status: { label: "Pending", color: "#ff8a00" } },
  ]
  const cardRows = rows.map((row, i) => (
    <div key={row.dtf + i} style={{ padding: "20px 24px", borderBottom: i < rows.length - 1 ? "1px solid #e5e5e5" : "none" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <TokenBubble letter={row.letter} color={row.color} size={40} />
          <span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, color: "#0a0d10" }}>{row.dtf}</span>
        </div>
        <StatusPill label={row.status.label} color={row.status.color} />
      </div>
      <p style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, color: "#0151af", margin: "0 0 8px", letterSpacing: -0.4 }}>{row.title}</p>
      {row.detail.type === "votes" ? (
        <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "4px 12px" }}>
          <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 300, color: "#0a0d10" }}>Quorum?: <span style={{ color: (row.detail as { quorum: boolean }).quorum ? "#56b891" : "#ef4345" }}>{(row.detail as { quorum: boolean }).quorum ? "Yes" : "No"}</span></span>
          <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#ccc" }} />
          <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 300, color: "#0a0d10" }}>Votes: <span style={{ color: "#0151af" }}>{(row.detail as { votesFor: string }).votesFor}</span> / <span style={{ color: "#d05a67" }}>{(row.detail as { votesAgainst: string }).votesAgainst}</span> / {(row.detail as { votesAbstain: string }).votesAbstain}</span>
        </div>
      ) : (
        <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 300, color: "#0a0d10" }}>{(row.detail as { text: string }).text}</span>
      )}
    </div>
  ))
  return (
    <div style={{ padding: mobile ? "0 20px" : "0 40px", marginBottom: 32 }}>
      <SectionHeading icon={<CheckSquare size={20} color="#0151af" />} title="Active Proposals" subtitle="View proposals from different DTFs you have vote-locked." />
      <TableCard>
        {(tablet || mobile) ? cardRows : (
          <>
            <THead>
              <THCell width={200}>DTF Governed</THCell>
              <THCell flex={1}>Title</THCell>
              <THCell width={190}>Date Proposed</THCell>
              <THCell width={150}>ID</THCell>
              <THCell width={160}>Status</THCell>
            </THead>
            {rows.map((row, i) => (
              <TRow key={row.dtf + i} bordered={i < rows.length - 1}>
                <Cell width={200}><div style={{ display: "flex", alignItems: "center", gap: 8 }}><TokenBubble letter={row.letter} color={row.color} size={40} /><span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, color: "#0a0d10" }}>{row.dtf}</span></div></Cell>
                <Cell flex={1}>
                  <div style={{ padding: "16px 0", display: "flex", flexDirection: "column", gap: 6 }}>
                    <span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, color: "#0151af", letterSpacing: -0.64 }}>{row.title}</span>
                    {row.detail.type === "votes" ? (
                      <>
                        <div style={{ position: "relative", height: 12, background: "#d9d9d9", borderRadius: 11, width: "100%", maxWidth: 330 }}>
                          <div style={{ position: "absolute", top: 0, left: 0, height: 12, background: "#23c45f", borderRadius: 11, width: `${(row.detail as { forPct: number }).forPct}%` }} />
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                          <span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 300, color: "#0a0d10" }}>Quorum?: <span style={{ color: (row.detail as { quorum: boolean }).quorum ? "#56b891" : "#ef4345" }}>{(row.detail as { quorum: boolean }).quorum ? "Yes" : "No"}</span></span>
                          <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#ccc" }} />
                          <span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 300, color: "#0a0d10" }}>Votes: <span style={{ color: "#0151af" }}>{(row.detail as { votesFor: string }).votesFor}</span> / <span style={{ color: "#d05a67" }}>{(row.detail as { votesAgainst: string }).votesAgainst}</span> / {(row.detail as { votesAbstain: string }).votesAbstain}</span>
                        </div>
                      </>
                    ) : (
                      <span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 300, color: "#0a0d10" }}>{(row.detail as { text: string }).text}</span>
                    )}
                  </div>
                </Cell>
                <Cell width={190}>
                  <div style={{ padding: "24px 0" }}>
                    <p style={{ fontFamily: FONT, fontSize: 16, fontWeight: 300, color: "#0a0d10", margin: "0 0 2px", whiteSpace: "nowrap" }}>{row.date}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 300, color: "#666", whiteSpace: "nowrap" }}>By: {row.by}</span>
                      <ArrowUpRight size={14} color="#666" />
                    </div>
                  </div>
                </Cell>
                <Cell width={150}><div style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 300, color: "#0a0d10" }}>{row.id}</span><Copy size={14} color="#666" style={{ cursor: "pointer" }} /></div></Cell>
                <Cell width={160}><StatusPill label={row.status.label} color={row.status.color} /></Cell>
              </TRow>
            ))}
          </>
        )}
      </TableCard>
    </div>
  )
}

function VotingPowerSection({ tablet, mobile }: { tablet: boolean; mobile: boolean }) {
  const rows = [
    { dtf: "CMC20", letter: "C", color: "#2d57f1", govToken: "vlRSR-CMCIndex", votePwr: "4.5", badge: null as null | "Delegated" | "Delegator", voteWeight: "27.1%", locker: "0x4880...c3a8", delegate: "0x4880...c3a8" },
    { dtf: "CLX", letter: "C", color: "#059669", govToken: "vlRSR-CLX", votePwr: "1.1", badge: "Delegated" as const, voteWeight: "15.85%", locker: "0x4880...c3a8", delegate: "0x4880...c3a8" },
    { dtf: "CLX", letter: "C", color: "#7c3aed", govToken: "vlRSR-CLX", votePwr: "3", badge: null as null | "Delegated" | "Delegator", voteWeight: "12.56%", locker: "0x4880...c3a8", delegate: "0x4880...c3a8" },
    { dtf: "CF Large Cap Index", letter: "C", color: "#1a4fc4", govToken: "vlRSR-LCAP", votePwr: "1.1", badge: "Delegator" as const, voteWeight: "12.56%", locker: "0x4480...c3a8", delegate: "0x4480...c3a8" },
  ]
  return (
    <div style={{ padding: mobile ? "0 20px" : "0 40px", marginBottom: 32 }}>
      <SectionHeading icon={<ArrowDownUp size={20} color="#0151af" />} title="Voting Power" subtitle="Including any power delegated to me." />
      <TableCard>
        {mobile ? (
          rows.map((row, i) => (
            <div key={`${row.dtf}-${i}`} style={{ padding: "16px 24px", borderBottom: i < rows.length - 1 ? "1px solid #e5e5e5" : "none" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: row.badge ? 8 : 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <TokenBubble letter={row.letter} color={row.color} size={40} />
                  <span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, color: "#0151af" }}>{row.dtf}</span>
                </div>
                <button style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex" }}><MoreVertical size={20} color="#666" /></button>
              </div>
              {row.badge && (
                <div style={{ marginBottom: 12 }}>
                  <span style={{ fontFamily: FONT, fontSize: 13, fontWeight: 500, color: row.badge === "Delegated" ? "#008632" : "#0151af", background: row.badge === "Delegated" ? "rgba(35,196,95,0.15)" : "rgba(1,81,175,0.15)", borderRadius: 42, padding: "4px 10px", display: "inline-flex", alignItems: "center" }}>{row.badge}</span>
                </div>
              )}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 300, color: "#0a0d10" }}>Governance token <span style={{ color: "#0151af" }}>{row.govToken}</span></span>
                <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 300, color: "#0a0d10" }}>Weight <span style={{ fontWeight: 500 }}>{row.voteWeight}</span></span>
              </div>
            </div>
          ))
        ) : (
          <>
            <THead>
              <THCell flex={1}>DTF Governed</THCell>
              <THCell width={170}>Governance Token</THCell>
              {!tablet && <THCell width={130}>Vote Power</THCell>}
              <THCell width={120}>Vote Weight</THCell>
              {!tablet && <THCell width={160}>Vote-locker Address</THCell>}
              {!tablet && <THCell width={160}>Delegate Address</THCell>}
              <THCell width={130}>Actions</THCell>
            </THead>
            {rows.map((row, i) => (
              <TRow key={`${row.dtf}-${i}`} bordered={i < rows.length - 1}>
                <Cell flex={1}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                    <TokenBubble letter={row.letter} color={row.color} size={28} />
                    <span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 300, color: "#0151af", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{row.dtf}</span>
                  </div>
                </Cell>
                <Cell width={170}><span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 300, color: "#0151af", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}>{row.govToken}</span></Cell>
                {!tablet && (
                  <Cell width={130}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 300, color: "#0a0d10" }}>{row.votePwr}</span>
                      {row.badge && <span style={{ fontFamily: FONT, fontSize: 12, fontWeight: 500, color: row.badge === "Delegated" ? "#008632" : "#0151af", background: row.badge === "Delegated" ? "rgba(35,196,95,0.15)" : "rgba(1,81,175,0.15)", borderRadius: 42, height: 20, padding: "0 8px", display: "inline-flex", alignItems: "center" }}>{row.badge}</span>}
                    </div>
                  </Cell>
                )}
                <Cell width={120}><span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 300, color: "#0a0d10" }}>{row.voteWeight}</span></Cell>
                {!tablet && <Cell width={160}><div style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 300, color: "#0151af" }}>{row.locker}</span><ArrowUpRight size={14} color="#0151af" /></div></Cell>}
                {!tablet && <Cell width={160}><div style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 300, color: "#0151af" }}>{row.delegate}</span><ArrowUpRight size={14} color="#0151af" /></div></Cell>}
                <Cell width={130}><button style={{ background: "none", border: "none", cursor: "pointer", padding: 8, display: "flex" }}><MoreVertical size={20} color="#666" /></button></Cell>
              </TRow>
            ))}
          </>
        )}
      </TableCard>
    </div>
  )
}

function RSRSection({ tablet, mobile }: { tablet: boolean; mobile: boolean }) {
  const rsrIcon = (
    <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#1a2f6e", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <span style={{ fontFamily: FONT, fontSize: 12, fontWeight: 700, color: "white" }}>ℝ</span>
    </div>
  )
  return (
    <div style={{ padding: mobile ? "0 20px" : "0 40px", marginBottom: 32 }}>
      <SectionHeading icon={<div style={{ width: 22, height: 22, borderRadius: "50%", background: "#1a2f6e", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><span style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: "white", lineHeight: 1 }}>ℝ</span></div>} title="RSR" subtitle="Reserve Rights (RSR) is an ERC-20 token that unifies governance, risk management, and value accrual across the Reserve ecosystem." />
      <TableCard>
        {mobile ? (
          <div style={{ padding: "16px 24px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>{rsrIcon}<span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, color: "#0a0d10" }}>RSR</span></div>
              <div style={{ textAlign: "right" }}><p style={{ fontFamily: FONT, fontSize: 13, fontWeight: 300, color: "#666", margin: "0 0 2px" }}>Balance</p><p style={{ fontFamily: FONT, fontSize: 20, fontWeight: 700, color: "#0a0d10", margin: 0 }}>$5,131.78</p></div>
            </div>
          </div>
        ) : (
          <>
            <THead>
              <THCell flex={1}>Name</THCell>
              <THCell width={200}>Performance 7D</THCell>
              {!tablet && <THCell width={200}>24H Change</THCell>}
              <THCell width={200}>Balance</THCell>
              <THCell width={150}>Value</THCell>
            </THead>
            <TRow bordered={false}>
              <Cell flex={1}><div style={{ display: "flex", alignItems: "center", gap: 8 }}>{rsrIcon}<span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, color: "#0a0d10" }}>RSR</span></div></Cell>
              <Cell width={200}><PerfCell pct="+1.23%" abs="+$2.14" positive /></Cell>
              {!tablet && <Cell width={200}><span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 300, color: "#0a0d10" }}>7.19%</span></Cell>}
              <Cell width={200}><ValuePair main="230,121" sub="RSR" mainWeight={300} /></Cell>
              <Cell width={150}><ValuePair main="$9,121.76" sub="USDC" /></Cell>
            </TRow>
          </>
        )}
      </TableCard>
    </div>
  )
}

// ── Overview view ─────────────────────────────────────────────────────────────

function OverviewView({ tablet, mobile, onRewards }: { tablet: boolean; mobile: boolean; onRewards: () => void }) {
  return (
    <>
      <div style={{ display: "flex", flexDirection: mobile ? "column" : "row", gap: mobile ? 20 : 40, alignItems: "flex-start", padding: mobile ? "24px 20px 32px" : "32px 40px 48px" }}>
        <PortfolioChart />
        <div style={{ width: mobile ? "100%" : 300, flexShrink: 0, display: "flex", flexDirection: "column", gap: 16 }}>
          <BreakdownCard />
          <RewardsCard onRewards={onRewards} />
        </div>
      </div>
      <DTFPositionsSection tablet={tablet} mobile={mobile} />
      <StakedPositionsSection tablet={tablet} mobile={mobile} />
      <VoteLockedSection tablet={tablet} mobile={mobile} />
      <ActiveProposalsSection tablet={tablet} mobile={mobile} />
      <VotingPowerSection tablet={tablet} mobile={mobile} />
      <RSRSection tablet={tablet} mobile={mobile} />
    </>
  )
}

// ── Rewards chart ─────────────────────────────────────────────────────────────

function RewardsChart({
  preset, onPreset, filteredData, filteredRsrData, totals, currency,
}: {
  preset: Preset | null
  onPreset: (p: Preset) => void
  filteredData: RewardsPoint[]
  filteredRsrData: RSRPoint[]
  totals: PresetTotals
  currency: "usd" | "rsr"
}) {
  const tabs: { label: string; key: Preset }[] = [
    { label: "24hr",     key: "24hr"    },
    { label: "7d",       key: "7d"      },
    { label: "1m",       key: "1m"      },
    { label: "3m",       key: "3m"      },
    { label: "6m",       key: "6m"      },
    { label: "All time", key: "alltime" },
  ]

  const isRsr = currency === "rsr"
  const activeData = isRsr ? filteredRsrData : filteredData
  const yLabels = isRsr
    ? ["45K", "36K", "27K", "18K", "9K", "0.0"]
    : ["$36K", "$28K", "$20K", "$12K", "$4K", "0.0"]
  const xLabels = activeData.length <= 4
    ? activeData.map(d => d.label)
    : [0, Math.floor(activeData.length / 3), Math.floor(activeData.length * 2 / 3), activeData.length - 1]
        .map(i => activeData[i].label)

  return (
    <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span style={{ fontFamily: FONT, fontSize: 12, fontWeight: 500, color: "#666", letterSpacing: 1, textTransform: "uppercase" }}>
            {isRsr ? "Total RSR Rewards" : "Total USD Rewards"}
          </span>
          <span style={{ fontFamily: FONT, fontSize: 46, fontWeight: 500, color: "#0151af", lineHeight: "50px" }}>{totals.total}</span>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {totals.positive ? <TrendingUp size={18} color="#0151af" /> : <TrendingDown size={18} color="#ef4345" />}
            <span style={{ fontFamily: FONT, fontSize: 18, fontWeight: 300, color: totals.positive ? "#0151af" : "#ef4345" }}>{totals.pct} ({totals.change})</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", background: "#f2f2f2", borderRadius: 24, padding: 2 }}>
          {tabs.map(({ label, key }) => {
            const isActive = preset === key
            return (
              <button key={key} onClick={() => onPreset(key)} style={{ padding: "6px 10px", borderRadius: isActive ? 14 : 6, border: "none", cursor: "pointer", background: isActive ? "white" : "transparent", boxShadow: isActive ? "0 1px 8px 2px rgba(0,0,0,0.05)" : "none", fontFamily: FONT, fontSize: 14, fontWeight: isActive ? 500 : 300, color: isActive ? "#0151af" : "#0a0d10", whiteSpace: "nowrap" }}>
                {label}
              </button>
            )
          })}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 16, width: "100%" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <svg viewBox={`0 0 ${RCW} ${RCH}`} width="100%" height="352" preserveAspectRatio="none" style={{ display: "block" }}>
            {isRsr ? (
              <path d={rsrPath(filteredRsrData)} fill="#7b8fcc" fillOpacity={0.9} />
            ) : (
              <>
                <path d={rewardsPath(filteredData, "votelock")} fill="#6abcaa" fillOpacity={0.85} />
                <path d={rewardsPath(filteredData, "staking")} fill="#7b8fcc" fillOpacity={0.85} />
              </>
            )}
          </svg>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
            {xLabels.map((l) => (
              <span key={l} style={{ fontFamily: "'Lato', sans-serif", fontSize: 11, color: "#999" }}>{l}</span>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: 352, flexShrink: 0 }}>
          {yLabels.map((l) => (
            <span key={l} style={{ fontFamily: "'Lato', sans-serif", fontSize: 11, color: "#666", textAlign: "right", display: "block" }}>{l}</span>
          ))}
        </div>
      </div>
      {!isRsr && (
        <div style={{ display: "flex", alignItems: "center", gap: 16, paddingLeft: 4 }}>
          {[{ label: "Staking rewards", color: "#7b8fcc" }, { label: "Vote-lock rewards", color: "#6abcaa" }].map(({ label, color }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: color }} />
              <span style={{ fontFamily: FONT, fontSize: 13, fontWeight: 300, color: "#666" }}>{label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Rewards right panel ───────────────────────────────────────────────────────

function DatePickerField({ value, onChange, tooltip }: {
  value: string
  onChange: (v: string) => void
  tooltip: string
}) {
  const [hovered, setHovered] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function openPicker() {
    const el = inputRef.current as (HTMLInputElement & { showPicker?: () => void }) | null
    el?.showPicker ? el.showPicker() : el?.click()
  }

  return (
    <div
      style={{ position: "relative", flex: 1, minWidth: 0 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        onClick={openPicker}
        style={{ border: "1px solid #e5e5e5", borderRadius: 8, padding: "8px 10px", fontFamily: FONT, fontSize: 13, fontWeight: 300, color: value ? "#0a0d10" : "#999", background: "white", userSelect: "none", cursor: "pointer" }}
      >
        {value ? formatDateDisplay(value) : "—"}
      </div>
      <input
        ref={inputRef}
        type="date"
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{ position: "absolute", opacity: 0, pointerEvents: "none", width: 0, height: 0, top: 0, left: 0 }}
      />
      {hovered && (
        <div style={{ position: "absolute", bottom: "calc(100% + 6px)", left: "50%", transform: "translateX(-50%)", background: "#0a0d10", color: "white", fontFamily: FONT, fontSize: 12, fontWeight: 400, whiteSpace: "nowrap", padding: "5px 10px", borderRadius: 6, pointerEvents: "none", zIndex: 10 }}>
          {tooltip}
        </div>
      )}
    </div>
  )
}

function CustomizeReportPanel({
  fromDate, toDate, onFromDate, onToDate, currency, onCurrency,
}: {
  fromDate: string
  toDate: string
  onFromDate: (v: string) => void
  onToDate: (v: string) => void
  currency: "usd" | "rsr"
  onCurrency: (v: "usd" | "rsr") => void
}) {
  const [valueBasis, setValueBasis] = useState<"market" | "purchase">("market")

  return (
    <div style={{ background: "white", border: "1px solid #e0d5c7", borderRadius: 20, padding: "16px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, color: "#0151af" }}>Customize Report</span>
        <div
          style={{ position: "relative", display: "inline-flex" }}
          onMouseEnter={e => { const t = (e.currentTarget as HTMLElement).querySelector<HTMLElement>("[data-tooltip]"); if (t) t.style.opacity = "1" }}
          onMouseLeave={e => { const t = (e.currentTarget as HTMLElement).querySelector<HTMLElement>("[data-tooltip]"); if (t) t.style.opacity = "0" }}
        >
          <FileDown size={20} color="#666" style={{ cursor: "pointer" }} />
          <div
            data-tooltip
            style={{ position: "absolute", top: "calc(100% + 6px)", right: 0, background: "#0a0d10", color: "white", fontFamily: FONT, fontSize: 12, fontWeight: 400, whiteSpace: "nowrap", padding: "5px 10px", borderRadius: 6, opacity: 0, pointerEvents: "none", transition: "opacity 0.15s", zIndex: 10 }}
          >
            Download CSV
          </div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
        <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, color: "#0a0d10" }}>Date range:</span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <DatePickerField value={fromDate} onChange={onFromDate} tooltip="From Date" />
          <span style={{ fontFamily: FONT, fontSize: 13, color: "#999", flexShrink: 0 }}>–</span>
          <DatePickerField value={toDate} onChange={onToDate} tooltip="To Date" />
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, color: "#0a0d10" }}>Value basis:</span>
        {[
          { key: "market" as const, label: "Current market value" },
          { key: "purchase" as const, label: "Time of purchase" },
        ].map(({ key, label }) => (
          <button key={key} onClick={() => setValueBasis(key)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "3px 8px", borderRadius: 10, border: "none", background: "none", cursor: "pointer", textAlign: "left" }}>
            <div style={{ width: 16, height: 16, borderRadius: "50%", border: `1px solid ${valueBasis === key ? "#0151af" : "#e5e5e5"}`, background: "white", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {valueBasis === key && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#0151af" }} />}
            </div>
            <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 500, color: valueBasis === key ? "#0a0d10" : "#666" }}>{label}</span>
          </button>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, color: "#0a0d10" }}>Currency</span>
        {[
          { key: "usd" as const, label: "USD" },
          { key: "rsr" as const, label: "RSR" },
        ].map(({ key, label }) => (
          <button key={key} onClick={() => onCurrency(key)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "3px 8px", borderRadius: 10, border: "none", background: "none", cursor: "pointer", textAlign: "left" }}>
            <div style={{ width: 16, height: 16, borderRadius: "50%", border: `1px solid ${currency === key ? "#0151af" : "#e5e5e5"}`, background: "white", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {currency === key && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#0151af" }} />}
            </div>
            <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 500, color: currency === key ? "#0a0d10" : "#666" }}>{label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function RewardsBreakdownCard({ totals, currency }: { totals: PresetTotals; currency: "usd" | "rsr" }) {
  const isRsr = currency === "rsr"
  const rows = isRsr
    ? [{ label: "Total Vote Locked", value: totals.votelock }]
    : [{ label: "Total Staked", value: totals.staking }, { label: "Total Vote Locked", value: totals.votelock }]
  return (
    <div style={{ background: "white", border: "1px solid #e0d5c7", borderRadius: 20, padding: "16px 24px", display: "flex", flexDirection: "column", gap: 8 }}>
      <div>
        <p style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, color: "#0151af", margin: "0 0 2px" }}>
          {isRsr ? "RSR Rewards" : "USD Rewards"}
        </p>
        <p style={{ fontFamily: FONT, fontSize: 14, fontWeight: 300, color: "#666", margin: 0 }}>Based on time range above</p>
      </div>
      {rows.map(({ label, value }) => (
        <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 300, color: "#0a0d10" }}>{label}</span>
          <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, color: "#0a0d10" }}>{value}</span>
        </div>
      ))}
    </div>
  )
}

// ── Available rewards section (used in Rewards view) ─────────────────────────

function AvailableRewardsSection({ mobile }: { mobile: boolean }) {
  const rows = [
    { token: "MVTT10F", letter: "M", color: "#0e7dbd", balance: "600", balanceSub: "MVTT10F", value: "$3.98", valueSub: "USD" },
    { token: "MVDA25",  letter: "V", color: "#0e7dbd", balance: "600", balanceSub: "MVDA25",  value: "$3.98", valueSub: "USD" },
  ]
  return (
    <div style={{ padding: mobile ? "0 20px" : "0 40px", marginBottom: 32 }}>
      <SectionHeading icon={<Gift size={20} color="#0151af" />} title="Available Rewards" subtitle="Earn rewards by staking or participating in governance." subtitleLink="Learn more" />
      <TableCard>
        <THead>
          <THCell flex={1}>Reward Token</THCell>
          <THCell width={mobile ? 110 : 250}>Balance</THCell>
          <THCell width={mobile ? 110 : 250}>Value</THCell>
          <THCell width={mobile ? 80 : 150}>Claim</THCell>
        </THead>
        {rows.map((row, i) => (
          <TRow key={row.token} bordered={i < rows.length - 1}>
            <Cell flex={1}><div style={{ display: "flex", alignItems: "center", gap: mobile ? 10 : 16 }}><TokenBubble letter={row.letter} color={row.color} /><span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, color: "#0a0d10" }}>{row.token}</span></div></Cell>
            <Cell width={mobile ? 110 : 250}><ValuePair main={row.balance} sub={row.balanceSub} /></Cell>
            <Cell width={mobile ? 110 : 250}><ValuePair main={row.value} sub={row.valueSub} /></Cell>
            <Cell width={mobile ? 80 : 150}><ClaimBtn /></Cell>
          </TRow>
        ))}
      </TableCard>
    </div>
  )
}

// ── Staking and vote-lock activity section ────────────────────────────────────

function StakingActivitySection({ mobile }: { mobile: boolean }) {
  const rows = [
    { date: "December 14, 2025", dtf: "CF Large Cap Index", letter: "C", color: "#1a4fc4", type: "Stake",     asset: "RSR",   assetAmt: "+421,000", valueWhen: "$1,124.66", valueNow: "$1,124.66" },
    { date: "December 14, 2025", dtf: "CF Large Cap Index", letter: "C", color: "#1a4fc4", type: "Stake",     asset: "RSR",   assetAmt: "+421,000", valueWhen: "$1,124.66", valueNow: "$1,124.66" },
    { date: "December 14, 2025", dtf: "Open",               letter: "O", color: "#0e7dbd", type: "Vote-lock", asset: "SQUILL",assetAmt: "+50,000",  valueWhen: "$40.00",    valueNow: "$40.00"    },
  ]
  return (
    <div style={{ padding: mobile ? "0 20px" : "0 40px", marginBottom: 32 }}>
      <SectionHeading icon={<ArrowDownUp size={20} color="#0151af" />} title="Staking and Vote Lock Activity" subtitle="Your history of staking and vote-locking activity" />
      <TableCard>
        {mobile ? (
          rows.map((row, i) => (
            <div key={i} style={{ padding: "16px 24px", borderBottom: i < rows.length - 1 ? "1px solid #e5e5e5" : "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <TokenBubble letter={row.letter} color={row.color} />
                <div>
                  <p style={{ fontFamily: FONT, fontSize: 15, fontWeight: 700, color: "#0151af", margin: "0 0 2px" }}>{row.dtf}</p>
                  <p style={{ fontFamily: FONT, fontSize: 13, fontWeight: 300, color: "#666", margin: 0 }}>{row.date}</p>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 300, color: "#0a0d10" }}>{row.type} · {row.asset} {row.assetAmt}</span>
                <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 500, color: "#0a0d10" }}>{row.valueNow}</span>
              </div>
            </div>
          ))
        ) : (
          <>
            <THead>
              <THCell width={180}>Date</THCell>
              <THCell width={280}>Earned From</THCell>
              <THCell width={150}>Type</THCell>
              <THCell width={180}>Reward Asset</THCell>
              <THCell width={190}>Value when earned</THCell>
              <THCell flex={1}>Value now</THCell>
            </THead>
            {rows.map((row, i) => (
              <TRow key={i} bordered={i < rows.length - 1}>
                <Cell width={180}><span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 300, color: "#0a0d10" }}>{row.date}</span></Cell>
                <Cell width={280}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <TokenBubble letter={row.letter} color={row.color} />
                    <span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, color: "#0151af" }}>{row.dtf}</span>
                  </div>
                </Cell>
                <Cell width={150}><span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 300, color: "#0a0d10" }}>{row.type}</span></Cell>
                <Cell width={180}>
                  <div>
                    <p style={{ fontFamily: FONT, fontSize: 16, fontWeight: 300, color: "#0a0d10", margin: "0 0 2px" }}>{row.asset}</p>
                    <p style={{ fontFamily: FONT, fontSize: 13, fontWeight: 300, color: "#999", margin: 0 }}>{row.assetAmt}</p>
                  </div>
                </Cell>
                <Cell width={190}><div style={{ display: "flex", gap: 4, alignItems: "baseline" }}><span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 300, color: "#0a0d10" }}>{row.valueWhen}</span><span style={{ fontFamily: FONT, fontSize: 13, fontWeight: 300, color: "#999" }}>(USD)</span></div></Cell>
                <Cell flex={1}><div style={{ display: "flex", gap: 4, alignItems: "baseline" }}><span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 300, color: "#0a0d10" }}>{row.valueNow}</span><span style={{ fontFamily: FONT, fontSize: 13, fontWeight: 300, color: "#999" }}>(USD)</span></div></Cell>
              </TRow>
            ))}
          </>
        )}
      </TableCard>
    </div>
  )
}

// ── Rewards view ──────────────────────────────────────────────────────────────

function RewardsView({ tablet, mobile }: { tablet: boolean; mobile: boolean }) {
  const [preset, setPreset] = useState<Preset | null>("alltime")
  const [fromDate, setFromDate] = useState(PRESET_DATES["alltime"].from)
  const [toDate, setToDate] = useState(PRESET_DATES["alltime"].to)
  const [currency, setCurrency] = useState<"usd" | "rsr">("usd")

  function handlePreset(p: Preset) {
    setPreset(p)
    setFromDate(PRESET_DATES[p].from)
    setToDate(PRESET_DATES[p].to)
  }

  function handleFromDate(v: string) {
    setFromDate(v)
    setPreset(null)
  }

  function handleToDate(v: string) {
    setToDate(v)
    setPreset(null)
  }

  const filteredData = preset
    ? REWARDS_DATA.slice(-PRESET_SLICES[preset])
    : filterByDateRange(REWARDS_DATA, fromDate, toDate)
  const filteredRsrData = preset
    ? RSR_DATA.slice(-PRESET_SLICES[preset])
    : filterByDateRange(RSR_DATA, fromDate, toDate)
  const totals = currency === "rsr"
    ? (preset ? RSR_PRESET_TOTALS[preset] : RSR_PRESET_TOTALS["alltime"])
    : (preset ? USD_PRESET_TOTALS[preset] : USD_PRESET_TOTALS["alltime"])

  return (
    <>
      <div style={{ display: "flex", flexDirection: mobile ? "column" : "row", gap: 40, alignItems: "flex-start", padding: mobile ? "24px 20px 32px" : "32px 40px 48px" }}>
        <RewardsChart
          preset={preset}
          onPreset={handlePreset}
          filteredData={filteredData}
          filteredRsrData={filteredRsrData}
          totals={totals}
          currency={currency}
        />
        <div style={{ width: mobile ? "100%" : 284, flexShrink: 0, display: "flex", flexDirection: "column", gap: 8 }}>
          <CustomizeReportPanel
            fromDate={fromDate}
            toDate={toDate}
            onFromDate={handleFromDate}
            onToDate={handleToDate}
            currency={currency}
            onCurrency={setCurrency}
          />
          <RewardsBreakdownCard totals={totals} currency={currency} />
        </div>
      </div>
      <AvailableRewardsSection mobile={mobile} />
      <StakingActivitySection mobile={mobile} />
    </>
  )
}

// ── Transactions view ─────────────────────────────────────────────────────────

function TransactionsView({ mobile }: { mobile: boolean }) {
  const rows = [
    { date: "December 14, 2025", dtf: "CF Large Cap Index", letter: "C", color: "#1a4fc4", type: "Mint",   amount: "$1,124.66", units: "(7.98)",  tx: "0x053c...6c50" },
    { date: "December 14, 2025", dtf: "CF Large Cap Index", letter: "C", color: "#1a4fc4", type: "Mint",   amount: "$1,124.66", units: "(7.98)",  tx: "0x053c...6c50" },
    { date: "December 14, 2025", dtf: "CF Large Cap Index", letter: "C", color: "#1a4fc4", type: "Mint",   amount: "$1,124.66", units: "(7.98)",  tx: "0x053c...6c50" },
    { date: "December 14, 2025", dtf: "CF Large Cap Index", letter: "C", color: "#1a4fc4", type: "Mint",   amount: "$1,124.66", units: "(7.98)",  tx: "0x053c...6c50" },
    { date: "November 09, 2025", dtf: "CF Large Cap Index", letter: "C", color: "#1a4fc4", type: "Redeem", amount: "$702.91",   units: "(4.99)",  tx: "0x0c19...84ca" },
  ]

  return (
    <div style={{ padding: mobile ? "20px 20px 0" : "32px 40px 0" }}>
      {/* Heading */}
      <div style={{ paddingLeft: 24, marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <ArrowDownUp size={20} color="#0151af" />
          <span style={{ fontFamily: FONT, fontSize: 18, fontWeight: 700, color: "#0151af" }}>Transactions</span>
        </div>
        <p style={{ fontFamily: FONT, fontSize: 16, fontWeight: 300, color: "#0a0d10", margin: 0 }}>Your history of your recent transactions</p>
      </div>

      {/* Search + filters */}
      {!mobile && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 12, border: "1px solid #e5e5e5", borderRadius: 16, padding: "16px 20px", background: "white" }}>
            <Search size={16} color="#999" />
            <span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 300, color: "rgba(0,0,0,0.4)" }}>Search by name, ticker or collateral</span>
          </div>
          <button style={{ display: "flex", alignItems: "center", gap: 8, border: "1px solid #e5e5e5", borderRadius: 16, padding: "16px 20px", background: "white", cursor: "pointer", fontFamily: FONT, fontSize: 16, fontWeight: 300, color: "rgba(0,0,0,0.7)", whiteSpace: "nowrap" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              {["#7b8fcc", "#6abcaa", "#e8907a"].map((c, i) => (
                <div key={i} style={{ width: 16, height: 16, borderRadius: "50%", background: c, border: "2px solid white", marginLeft: i > 0 ? -6 : 0, position: "relative", zIndex: 3 - i }} />
              ))}
            </div>
            <span style={{ marginLeft: 4 }}>All Vote-lock tokens</span>
            <ChevronDown size={16} color="#666" />
          </button>
          <button style={{ display: "flex", alignItems: "center", gap: 8, border: "1px solid #e5e5e5", borderRadius: 16, padding: "16px 20px", background: "white", cursor: "pointer", fontFamily: FONT, fontSize: 16, fontWeight: 300, color: "rgba(0,0,0,0.7)", whiteSpace: "nowrap" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              {["#627EEA", "#0052FF", "#9945FF"].map((c, i) => (
                <div key={i} style={{ width: 16, height: 16, borderRadius: "50%", background: c, border: "2px solid white", marginLeft: i > 0 ? -6 : 0, position: "relative", zIndex: 3 - i }} />
              ))}
            </div>
            <span style={{ marginLeft: 4 }}>All Chains</span>
            <ChevronDown size={16} color="#666" />
          </button>
        </div>
      )}

      {/* Table */}
      <TableCard>
        <THead>
          {!mobile && <THCell width={200}>Date</THCell>}
          <THCell width={mobile ? undefined : 320} flex={mobile ? 1 : undefined}>DTF</THCell>
          <THCell width={mobile ? 80 : 200}>Type</THCell>
          <THCell width={mobile ? 110 : 200}>Amount</THCell>
          <THCell width={mobile ? 80 : 248}>View</THCell>
        </THead>
        {rows.map((row, i) => (
          <TRow key={i} bordered={i < rows.length - 1}>
            {!mobile && <Cell width={200}><span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 300, color: "#0a0d10" }}>{row.date}</span></Cell>}
            <Cell width={mobile ? undefined : 320} flex={mobile ? 1 : undefined}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <TokenBubble letter={row.letter} color={row.color} />
                <span style={{ fontFamily: FONT, fontSize: mobile ? 14 : 16, fontWeight: 700, color: "#0151af" }}>{row.dtf}</span>
              </div>
            </Cell>
            <Cell width={mobile ? 80 : 200}><span style={{ fontFamily: FONT, fontSize: mobile ? 14 : 16, fontWeight: 300, color: "#0a0d10" }}>{row.type}</span></Cell>
            <Cell width={mobile ? 110 : 200}>
              <div style={{ display: "flex", gap: 4, alignItems: "baseline" }}>
                <span style={{ fontFamily: FONT, fontSize: mobile ? 13 : 16, fontWeight: 300, color: "#0a0d10" }}>{row.amount}</span>
                <span style={{ fontFamily: FONT, fontSize: 13, fontWeight: 300, color: "#999" }}>{row.units}</span>
              </div>
            </Cell>
            <Cell width={mobile ? 80 : 248}>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 300, color: "#0151af" }}>{row.tx}</span>
                <ArrowUpRight size={14} color="#0151af" />
              </div>
            </Cell>
          </TRow>
        ))}
      </TableCard>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function PortfolioClient() {
  const [section, setSection] = useState<Section>("overview")
  const { tablet, mobile } = useBreakpoint()

  return (
    <div style={{ background: "#fefcfb", minHeight: "100vh" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", alignItems: "flex-start" }}>
        <PortfolioSidebar section={section} onSection={setSection} />
        <div style={{ flex: 1, minWidth: 0, paddingBottom: 80 }}>
          {section === "overview"     && <OverviewView tablet={tablet} mobile={mobile} onRewards={() => setSection("rewards")} />}
          {section === "rewards"      && <RewardsView tablet={tablet} mobile={mobile} />}
          {section === "transactions" && <TransactionsView mobile={mobile} />}
        </div>
      </div>
    </div>
  )
}
