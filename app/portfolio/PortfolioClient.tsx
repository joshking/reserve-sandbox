"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import {
  ArrowUpRight, ArrowRight, TrendingUp, TrendingDown,
  Globe, Scale, Landmark, MoreVertical,
  ArrowDownUp, CheckSquare, Lock, Copy,
  ChartLine, ChevronDown, Gift, FileDown, Search, ArrowUpDown, Calendar, SlidersHorizontal,
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

// ── Overview chart (single-value) ────────────────────────────────────────────

const OV_CW = 937
const OV_CH = 352
const OV_MAX = 38000

type OvPoint = { label: string; x: number; val: number }
const OV_DATA: OvPoint[] = [
  { label: "JAN 2025", x: 0,   val: 1100  },
  { label: "FEB 2025", x: 85,  val: 1800  },
  { label: "MAR 2025", x: 170, val: 2800  },
  { label: "APR 2025", x: 255, val: 5200  },
  { label: "MAY 2025", x: 341, val: 8200  },
  { label: "JUN 2025", x: 426, val: 10500 },
  { label: "JUL 2025", x: 511, val: 14500 },
  { label: "AUG 2025", x: 596, val: 19000 },
  { label: "SEP 2025", x: 681, val: 24000 },
  { label: "OCT 2025", x: 766, val: 29000 },
  { label: "NOV 2025", x: 851, val: 33000 },
  { label: "DEC 2025", x: 937, val: 35800 },
]

function toOvY(val: number) { return OV_CH - (val / OV_MAX) * OV_CH }

function ovAreaPath(data: OvPoint[]): string {
  const fwd = data.map((d, i) => `${i === 0 ? "M" : "L"}${d.x},${toOvY(d.val)}`).join(" ")
  const bwd = [...data].reverse().map(d => `L${d.x},${OV_CH}`).join(" ")
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

type Preset = "24hr" | "7d" | "1m" | "3m" | "6m" | "alltime"

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
  "alltime": { staking: "$6,462.31", votelock: "$5,562.98", total: "$12,562.22", pct: "6.8%",  change: "+$362.45",   positive: true },
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

function rewardsSolidPath(data: RewardsPoint[]): string {
  const pts = data.map((d, i) => ({
    ...d,
    nx: data.length === 1 ? RCW / 2 : (i / (data.length - 1)) * RCW,
  }))
  const fwd = pts.map((d, i) => `${i === 0 ? "M" : "L"}${d.nx},${toRY(d.staking + d.votelock)}`).join(" ")
  const bwd = [...pts].reverse().map(d => `L${d.nx},${RCH}`).join(" ")
  return `${fwd} ${bwd} Z`
}

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

function rsrSolidPath(data: RSRPoint[]): string {
  const pts = data.map((d, i) => ({
    ...d,
    nx: data.length === 1 ? RCW / 2 : (i / (data.length - 1)) * RCW,
  }))
  const fwd = pts.map((d, i) => `${i === 0 ? "M" : "L"}${d.nx},${toRSRY(d.total)}`).join(" ")
  const bwd = [...pts].reverse().map(d => `L${d.nx},${RCH}`).join(" ")
  return `${fwd} ${bwd} Z`
}

const RSR_PRESET_TOTALS: Record<Preset, PresetTotals> = {
  "24hr":    { staking: "",  votelock: "58.42 RSR",     total: "58.42 RSR",     pct: "2.1%", change: "+1.21",    positive: true },
  "7d":      { staking: "",  votelock: "312.18 RSR",    total: "312.18 RSR",    pct: "2.1%", change: "+6.32",    positive: true },
  "1m":      { staking: "",  votelock: "1,842.31 RSR",  total: "1,842.31 RSR",  pct: "2.1%", change: "+38.25",   positive: true },
  "3m":      { staking: "",  votelock: "8,421.92 RSR",  total: "8,421.92 RSR",  pct: "2.1%", change: "+174.91",  positive: true },
  "6m":      { staking: "",  votelock: "21,432.18 RSR", total: "21,432.18 RSR", pct: "2.1%", change: "+445.13",  positive: true },
  "alltime": { staking: "",  votelock: "42,131.92 RSR", total: "42,131.92 RSR", pct: "2.3%", change: "+971.45",  positive: true },
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
      <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 300, color: "#666" }}>{children}</span>
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
      <p style={{ fontFamily: FONT, fontSize: 14, fontWeight: mainWeight, color: mainColor, margin: "0 0 3px 0" }}>{main}</p>
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
        <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 300, color }}>{pct}</span>
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

// ── DateRangePill ─────────────────────────────────────────────────────────────

function DateRangePill({ label }: { label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, border: "1px solid #e0d5c7", borderRadius: 8, padding: "6px 12px", background: "white", cursor: "pointer", userSelect: "none" }}>
      <Calendar size={14} color="#666" />
      <span style={{ fontFamily: FONT, fontSize: 13, fontWeight: 400, color: "#0a0d10" }}>{label}</span>
    </div>
  )
}

// ── PieDonut ──────────────────────────────────────────────────────────────────

const PIE_SEGS = [
  { val: 28217.98, label: "Index DTFs",  value: "$28,217.98", baseColor: "#0151af", revealColor: "#22c55e" },
  { val: 1217.98,  label: "Yield DTFs",  value: "$1,217.98",  baseColor: "#0e6ad6", revealColor: "#f97316" },
  { val: 989.30,   label: "Vote-locked", value: "$989.30",    baseColor: "#2684f3", revealColor: "#a855f7" },
  { val: 763.21,   label: "Staked RSR",  value: "$763.21",    baseColor: "#5ea8ff", revealColor: "#eab308" },
  { val: 1004.32,  label: "RSR",         value: "$1,004.32",  baseColor: "#a4ceff", revealColor: "#ef4444" },
]

function PieDonut({ hoveredIdx, onHover }: {
  hoveredIdx: number | null
  onHover: (i: number | null) => void
}) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(id)
  }, [])

  const total = PIE_SEGS.reduce((s, r) => s + r.val, 0)
  const cx = 72, cy = 72, R = 64, ri = 40
  let angle = -Math.PI / 2

  const paths = PIE_SEGS.map((seg, i) => {
    const sweep = (seg.val / total) * 2 * Math.PI
    const sa = angle; angle += sweep; const ea = angle
    const cos = (a: number, r: number) => cx + r * Math.cos(a)
    const sin = (a: number, r: number) => cy + r * Math.sin(a)
    const large = sweep > Math.PI ? 1 : 0
    return {
      d: `M${cos(sa,R)},${sin(sa,R)} A${R},${R} 0 ${large} 1 ${cos(ea,R)},${sin(ea,R)} L${cos(ea,ri)},${sin(ea,ri)} A${ri},${ri} 0 ${large} 0 ${cos(sa,ri)},${sin(sa,ri)} Z`,
      i,
    }
  })

  return (
    <svg
      width={190}
      height={190}
      viewBox="0 0 144 144"
      style={{
        flexShrink: 0,
        display: "block",
        opacity: mounted ? 1 : 0,
        transition: "opacity 0.6s ease",
      }}
    >
      {paths.map(({ d, i }) => {
        const seg = PIE_SEGS[i]
        const isHovered = hoveredIdx === i
        const isDimmed = hoveredIdx !== null && !isHovered
        return (
          <path
            key={i}
            d={d}
            fill={isHovered ? seg.revealColor : seg.baseColor}
            style={{
              opacity: isDimmed ? 0.18 : 1,
              transition: "fill 0.22s ease, opacity 0.18s ease",
              cursor: "pointer",
            }}
            onMouseEnter={() => onHover(i)}
            onMouseLeave={() => onHover(null)}
          />
        )
      })}
    </svg>
  )
}

// ── Sparkline ─────────────────────────────────────────────────────────────────

function Sparkline() {
  return (
    <svg width={48} height={28} style={{ flexShrink: 0, display: "block" }}>
      <path d="M0,20 L8,17 L16,21 L22,18 L28,15 L34,17 L40,11 L46,9" stroke="#666" strokeWidth={1.5} fill="none" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
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
  const [hoverIdx, setHoverIdx] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const yLabels = ["$36K", "$32K", "$28K", "$24K", "$20K", "$16K", "$12K", "$8K", "$4K", "0.0"]

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const svgX = ((e.clientX - rect.left) / rect.width) * OV_CW
    let nearest = 0; let minDist = Infinity
    OV_DATA.forEach((d, i) => {
      const dist = Math.abs(d.x - svgX)
      if (dist < minDist) { minDist = dist; nearest = i }
    })
    setHoverIdx(nearest)
  }

  const hp = hoverIdx !== null ? OV_DATA[hoverIdx] : null
  const hpPct = hp ? (hp.x / OV_CW) * 100 : 0

  const tooltip = hp ? (
    <div style={{ position: "absolute", top: 16, left: hpPct > 60 ? undefined : `calc(${hpPct}% + 14px)`, right: hpPct > 60 ? `calc(${100 - hpPct}% + 14px)` : undefined, background: "white", borderRadius: 10, padding: "10px 14px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", zIndex: 10, pointerEvents: "none" }}>
      <p style={{ fontFamily: FONT, fontSize: 12, fontWeight: 300, color: "#666", margin: "0 0 4px" }}>{hp.label}</p>
      <p style={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, color: "#0151af", margin: 0 }}>${(hp.val / 1000).toFixed(1)}K</p>
    </div>
  ) : null

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ fontFamily: FONT, fontSize: 11, fontWeight: 500, color: "#666", letterSpacing: 1.2, textTransform: "uppercase" }}>Total Investments</span>
          <span style={{ fontFamily: FONT, fontSize: 44, fontWeight: 700, color: "#0151af", lineHeight: "48px" }}>$12,562.22</span>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <ArrowUpRight size={14} color="#0151af" />
            <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 500, color: "#0151af" }}>6.8% (+$362.45)</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 400, color: "#0a0d10" }}>Date range:</span>
          <DateRangePill label="Jan 01, 2025" />
          <span style={{ fontFamily: FONT, fontSize: 14, color: "#666" }}>to</span>
          <DateRangePill label="Dec 25, 2025" />
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
        <div ref={containerRef} style={{ flex: 1, minWidth: 0, position: "relative", cursor: "crosshair" }} onMouseMove={handleMouseMove} onMouseLeave={() => setHoverIdx(null)}>
          <svg viewBox={`0 0 ${OV_CW} ${OV_CH}`} width="100%" height={OV_CH} preserveAspectRatio="none" style={{ display: "block" }}>
            <defs>
              <linearGradient id="ovGradP" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0c47a1" />
                <stop offset="100%" stopColor="#3878d8" />
              </linearGradient>
            </defs>
            <path d={ovAreaPath(OV_DATA)} fill="url(#ovGradP)" />
            {hp && <line x1={hp.x} y1={0} x2={hp.x} y2={OV_CH} stroke="rgba(255,255,255,0.6)" strokeWidth={1} />}
            {hp && <circle cx={hp.x} cy={toOvY(hp.val)} r={4} fill="white" stroke="#0151af" strokeWidth={2} />}
          </svg>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
            {OV_DATA.map((d) => (
              <span key={d.label} style={{ fontFamily: FONT, fontSize: 11, color: "#999", whiteSpace: "nowrap" }}>{d.label}</span>
            ))}
          </div>
          {tooltip}
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: OV_CH, flexShrink: 0, paddingBottom: 2 }}>
          {yLabels.map((l) => (
            <span key={l} style={{ fontFamily: FONT, fontSize: 11, color: "#666", textAlign: "right", display: "block", whiteSpace: "nowrap" }}>{l}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Overview sidebar cards ────────────────────────────────────────────────────

function BreakdownCard() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <p style={{ fontFamily: FONT, fontSize: 20, fontWeight: 700, color: "#0151af", margin: 0 }}>Portfolio Breakdown</p>
      <div style={{ display: "flex", alignItems: "center", gap: 44 }}>
        <PieDonut hoveredIdx={hoveredIdx} onHover={setHoveredIdx} />
        <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
          {PIE_SEGS.map((seg, i) => {
            const isHovered = hoveredIdx === i
            const isDimmed = hoveredIdx !== null && !isHovered
            return (
              <div
                key={seg.label}
                style={{
                  display: "flex", alignItems: "center", gap: 12, minWidth: 200,
                  opacity: isDimmed ? 0.28 : 1,
                  transition: "opacity 0.18s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                <div style={{
                  width: 16, height: 16,
                  background: isHovered ? seg.revealColor : seg.baseColor,
                  borderRadius: 4,
                  flexShrink: 0,
                  transition: "background 0.22s ease",
                }} />
                <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 300, color: "#0a0d10", flex: 1 }}>{seg.label}</span>
                <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, color: "#0a0d10" }}>{seg.value}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function RewardsCard({ onRewards }: { onRewards: () => void }) {
  return (
    <div style={{ background: "white", border: "1px solid #e0d5c7", borderRadius: 20, padding: 32, display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <p style={{ fontFamily: FONT, fontSize: 20, fontWeight: 700, color: "#0151af", margin: 0 }}>Pending Rewards</p>
        <p style={{ fontFamily: FONT, fontSize: 14, fontWeight: 300, color: "#666", margin: 0, lineHeight: "18px" }}>
          You have $43.23 of rewards that can be claimed. These rewards are earned by governing Index DTFs. Rewards earned from staking RSR on Yield DTFs does not require any action.
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <Link href="#" style={{ fontFamily: FONT, fontSize: 14, fontWeight: 300, color: "#0151af", textDecoration: "none" }}>
            Learn more about learning APY rewards
          </Link>
          <ArrowUpRight size={16} color="#0151af" />
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontFamily: FONT, fontSize: 32, fontWeight: 700, color: "#0151af" }}>$43.23</span>
        <button onClick={onRewards} style={{ background: "#0151af", color: "white", border: "none", borderRadius: 24, padding: "12px 16px", fontFamily: FONT, fontSize: 12, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
          Collect Rewards <ArrowRight size={16} />
        </button>
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
                  <p style={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, color: "#0a0d10", margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{row.name}</p>
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
              <THCell width={165}>Performance <span style={{ color: "#999", marginLeft: 4 }}>(24H)</span></THCell>
              {!tablet && <THCell width={130}>Unrealized P/L</THCell>}
              {!tablet && <THCell width={130}>Average price</THCell>}
              {!tablet && <THCell width={130}>Market Cap</THCell>}
              <THCell width={125}>Balance</THCell>
              <THCell width={125}>Value</THCell>
            </THead>
            {rows.map((row, i) => (
              <TRow key={row.ticker} bordered={i < rows.length - 1}>
                <Cell flex={1}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <TokenBubble letter={row.letter} color={row.color} />
                    <div>
                      <p style={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, color: "#0a0d10", margin: "0 0 2px" }}>{row.name}</p>
                      <p style={{ fontFamily: FONT, fontSize: 14, fontWeight: 300, color: "#666", margin: 0 }}>{row.ticker}</p>
                    </div>
                  </div>
                </Cell>
                <Cell width={165}><PerfCell pct={row.perf} abs={row.perfAbs} positive={row.perfPos} /></Cell>
                {!tablet && <Cell width={130}><div><p style={{ fontFamily: FONT, fontSize: 14, fontWeight: 300, color: row.unrealizedColor, margin: "0 0 3px" }}>{row.unrealized}</p><p style={{ fontFamily: FONT, fontSize: 12, fontWeight: 300, color: "#999", margin: 0 }}>{row.unrealizedSub}</p></div></Cell>}
                {!tablet && <Cell width={130}><span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 300, color: "#0a0d10" }}>{row.avgPrice}</span></Cell>}
                {!tablet && <Cell width={130}><ValuePair main={row.mktCap} sub={row.mktCapSub} mainWeight={300} /></Cell>}
                <Cell width={125}><ValuePair main={row.balance} sub={row.balanceSub} mainWeight={300} /></Cell>
                <Cell width={125}><ValuePair main={row.value} sub={row.valueSub} /></Cell>
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
              <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, color: "#0a0d10" }}>eth+RSR</span>
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
                  <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, color: "#0a0d10" }}>eth+RSR</span>
                </div>
              </Cell>
              {!tablet && <Cell width={140}><span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 300, color: "#666" }}>LCAP</span></Cell>}
              {!tablet && <Cell width={90}><span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 300, color: "#666" }}>7.05%</span></Cell>}
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
                    <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, color: "#0a0d10" }}>{row.token}</span>
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
                        <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, color: "#0a0d10" }}>{row.token}</span>
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
                {!tablet && <Cell width={140}><span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 300, color: "#666" }}>{row.governs}</span></Cell>}
                {!tablet && <Cell width={90}><span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 300, color: "#666" }}>{row.apy}</span></Cell>}
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
          <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, color: "#0a0d10" }}>{row.dtf}</span>
        </div>
        <StatusPill label={row.status.label} color={row.status.color} />
      </div>
      <p style={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, color: "#0151af", margin: "0 0 8px", letterSpacing: -0.4 }}>{row.title}</p>
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
                <Cell width={200}><div style={{ display: "flex", alignItems: "center", gap: 8 }}><TokenBubble letter={row.letter} color={row.color} size={40} /><span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, color: "#0a0d10" }}>{row.dtf}</span></div></Cell>
                <Cell flex={1}>
                  <div style={{ padding: "16px 0", display: "flex", flexDirection: "column", gap: 6 }}>
                    <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, color: "#0151af", letterSpacing: -0.64 }}>{row.title}</span>
                    {row.detail.type === "votes" ? (
                      <>
                        <div style={{ position: "relative", height: 12, background: "#d9d9d9", borderRadius: 11, width: "100%", maxWidth: 330 }}>
                          <div style={{ position: "absolute", top: 0, left: 0, height: 12, background: "#23c45f", borderRadius: 11, width: `${(row.detail as { forPct: number }).forPct}%` }} />
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                          <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 300, color: "#0a0d10" }}>Quorum?: <span style={{ color: (row.detail as { quorum: boolean }).quorum ? "#56b891" : "#ef4345" }}>{(row.detail as { quorum: boolean }).quorum ? "Yes" : "No"}</span></span>
                          <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#ccc" }} />
                          <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 300, color: "#0a0d10" }}>Votes: <span style={{ color: "#0151af" }}>{(row.detail as { votesFor: string }).votesFor}</span> / <span style={{ color: "#d05a67" }}>{(row.detail as { votesAgainst: string }).votesAgainst}</span> / {(row.detail as { votesAbstain: string }).votesAbstain}</span>
                        </div>
                      </>
                    ) : (
                      <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 300, color: "#0a0d10" }}>{(row.detail as { text: string }).text}</span>
                    )}
                  </div>
                </Cell>
                <Cell width={190}>
                  <div style={{ padding: "24px 0" }}>
                    <p style={{ fontFamily: FONT, fontSize: 14, fontWeight: 300, color: "#0a0d10", margin: "0 0 2px", whiteSpace: "nowrap" }}>{row.date}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 300, color: "#666", whiteSpace: "nowrap" }}>By: {row.by}</span>
                      <ArrowUpRight size={14} color="#666" />
                    </div>
                  </div>
                </Cell>
                <Cell width={150}><div style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 300, color: "#0a0d10" }}>{row.id}</span><Copy size={14} color="#666" style={{ cursor: "pointer" }} /></div></Cell>
                <Cell width={160}><StatusPill label={row.status.label} color={row.status.color} /></Cell>
              </TRow>
            ))}
          </>
        )}
      </TableCard>
    </div>
  )
}

function RoleBadge({ role }: { role: "Delegated" | "Delegator" }) {
  const isDelegated = role === "Delegated"
  return (
    <span style={{ fontFamily: FONT, fontSize: 12, fontWeight: 500, color: isDelegated ? "#0151af" : "#666", background: isDelegated ? "rgba(1,81,175,0.08)" : "#f2f2f2", borderRadius: 42, padding: "3px 10px", whiteSpace: "nowrap" }}>
      {role}
    </span>
  )
}

function VotingPowerSection({ tablet, mobile }: { tablet: boolean; mobile: boolean }) {
  const rows = [
    { dtf: "CMC20", govToken: "vlRSR-CMC20", votePwr: "28,500.00", voteWeight: "0.05%", locker: "0x45A9...82FA", delegate: "0x6905...C8dE", role: "Delegated" as const },
    { dtf: "CLX",   govToken: "vlRSR-CLX",   votePwr: "15,000.00", voteWeight: "0.03%", locker: "0x25De...666B", delegate: "0x6905...C8dE", role: "Delegated" as const },
    { dtf: "LCAP",  govToken: "vlRSR-LCAP",  votePwr: "12,400.00", voteWeight: "0.02%", locker: "0xa276...8fb4", delegate: "0x6905...C8dE", role: "Delegator" as const },
  ]
  return (
    <div style={{ padding: mobile ? "0 20px" : "0 40px", marginBottom: 32 }}>
      <SectionHeading icon={<ArrowDownUp size={20} color="#0151af" />} title="Voting Power" subtitle="Including any power delegated to me." />
      <TableCard>
        {mobile ? (
          rows.map((row, i) => (
            <div key={`${row.dtf}-${i}`} style={{ padding: "16px 24px", borderBottom: i < rows.length - 1 ? "1px solid #e5e5e5" : "none" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, color: "#0151af" }}>{row.dtf}</span>
                  <RoleBadge role={row.role} />
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 300, color: "#0a0d10" }}>{row.govToken}</span>
                <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 300, color: "#0a0d10" }}>Weight <span style={{ fontWeight: 500 }}>{row.voteWeight}</span></span>
              </div>
            </div>
          ))
        ) : (
          <>
            <THead>
              <THCell flex={1}>DTF Governed</THCell>
              <THCell width={200}>Governance Token</THCell>
              {!tablet && <THCell width={130}>Vote Power</THCell>}
              <THCell width={110}>Vote Weight</THCell>
              {!tablet && <THCell width={155}>Role</THCell>}
              {!tablet && <THCell width={165}>Locker Address</THCell>}
              {!tablet && <THCell width={165}>Delegate Address</THCell>}
            </THead>
            {rows.map((row, i) => (
              <TRow key={`${row.dtf}-${i}`} bordered={i < rows.length - 1}>
                <Cell flex={1}>
                  <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, color: "#0151af" }}>{row.dtf}</span>
                </Cell>
                <Cell width={200}>
                  <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 300, color: "#0a0d10" }}>{row.govToken}</span>
                </Cell>
                {!tablet && <Cell width={130}><span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 300, color: "#0a0d10" }}>{row.votePwr}</span></Cell>}
                <Cell width={110}><span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 300, color: "#0a0d10" }}>{row.voteWeight}</span></Cell>
                {!tablet && <Cell width={155}><RoleBadge role={row.role} /></Cell>}
                {!tablet && <Cell width={165}><div style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ fontFamily: FONT, fontSize: 13, fontWeight: 300, color: "#0a0d10" }}>{row.locker}</span><ArrowUpRight size={13} color="#666" /></div></Cell>}
                {!tablet && <Cell width={165}><div style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ fontFamily: FONT, fontSize: 13, fontWeight: 300, color: "#0a0d10" }}>{row.delegate}</span><ArrowUpRight size={13} color="#666" /></div></Cell>}
              </TRow>
            ))}
            <div style={{ borderTop: "1px solid #e5e5e5", padding: "14px 24px", display: "flex", justifyContent: "center" }}>
              <button style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontFamily: FONT, fontSize: 14, fontWeight: 500, color: "#0151af" }}>
                Show all (8) <ChevronDown size={16} color="#0151af" />
              </button>
            </div>
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
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>{rsrIcon}<span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, color: "#0a0d10" }}>RSR</span></div>
              <div style={{ textAlign: "right" }}><p style={{ fontFamily: FONT, fontSize: 13, fontWeight: 300, color: "#666", margin: "0 0 2px" }}>Balance</p><p style={{ fontFamily: FONT, fontSize: 20, fontWeight: 700, color: "#0a0d10", margin: 0 }}>$5,131.78</p></div>
            </div>
          </div>
        ) : (
          <>
            <THead>
              <THCell flex={1}>Name</THCell>
              <THCell width={220}>Performance (7D)</THCell>
              {!tablet && <THCell width={180}>24H CHG</THCell>}
              <THCell width={180}>Balance</THCell>
              <THCell width={150}>Value</THCell>
            </THead>
            <TRow bordered={false}>
              <Cell flex={1}><div style={{ display: "flex", alignItems: "center", gap: 8 }}>{rsrIcon}<span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, color: "#0a0d10" }}>RSR</span></div></Cell>
              <Cell width={220}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Sparkline />
                  <div>
                    <p style={{ fontFamily: FONT, fontSize: 14, fontWeight: 300, color: "#23c45f", margin: "0 0 2px" }}>+1.23%</p>
                    <p style={{ fontFamily: FONT, fontSize: 13, fontWeight: 300, color: "#999", margin: 0 }}>+$2.14</p>
                  </div>
                </div>
              </Cell>
              {!tablet && (
                <Cell width={180}>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <TrendingUp size={14} color="#23c45f" />
                    <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 300, color: "#23c45f" }}>7.19%</span>
                  </div>
                </Cell>
              )}
              <Cell width={180}><ValuePair main="235,123" sub="RSR" mainWeight={300} /></Cell>
              <Cell width={150}><ValuePair main="$5,131.78" sub="USD" /></Cell>
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
      <div style={{ padding: mobile ? "24px 20px 32px" : "32px 40px 40px" }}>
        <PortfolioChart />
      </div>
      <div style={{ display: "flex", flexDirection: mobile ? "column" : "row", gap: 16, alignItems: mobile ? "stretch" : "center", padding: mobile ? "16px 20px 32px" : "16px 40px 48px" }}>
        <div style={{ flex: 1, minWidth: 0 }}><BreakdownCard /></div>
        <div style={{ flex: 1, minWidth: 0 }}><RewardsCard onRewards={onRewards} /></div>
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

// ── Filter menu (Customize Report dropdown) ───────────────────────────────────

type ValueBasis = "market" | "purchase"
type Currency = "usd" | "rsr"

function RadioOption({ checked, onSelect, label, blueDot = false }: { checked: boolean; onSelect: () => void; label: string; blueDot?: boolean }) {
  const dotColor = blueDot ? "#0151af" : "#0a0d10"
  return (
    <button onClick={onSelect} style={{ display: "flex", alignItems: "center", gap: 12, padding: "7px 0", border: "none", background: "none", cursor: "pointer", width: "100%", textAlign: "left" }}>
      <div style={{ width: 20, height: 20, borderRadius: "50%", border: `1.5px solid ${checked ? dotColor : "#d0cac2"}`, background: "white", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        {checked && <div style={{ width: 10, height: 10, borderRadius: "50%", background: dotColor }} />}
      </div>
      <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 500, color: checked ? "#0a0d10" : "#999" }}>{label}</span>
    </button>
  )
}

function FilterMenu({
  valueBasis, onValueBasis, currency, onCurrency, onClose,
}: {
  valueBasis: ValueBasis
  onValueBasis: (v: ValueBasis) => void
  currency: Currency
  onCurrency: (v: Currency) => void
  onClose: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener("mousedown", handle)
    return () => document.removeEventListener("mousedown", handle)
  }, [onClose])

  return (
    <div ref={ref} style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, width: 284, background: "white", border: "1px solid #e0d5c7", borderRadius: 20, padding: "20px 24px", zIndex: 200, boxShadow: "0 8px 32px rgba(0,0,0,0.10)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, color: "#0151af" }}>Customize Report</span>
        <button style={{ background: "none", border: "1px solid #e0d5c7", borderRadius: 8, padding: "5px 7px", cursor: "pointer", display: "flex", alignItems: "center" }}>
          <FileDown size={16} color="#888" />
        </button>
      </div>
      <div style={{ marginBottom: 20 }}>
        <p style={{ fontFamily: FONT, fontSize: 14, fontWeight: 500, color: "#0a0d10", margin: "0 0 2px" }}>Value basis:</p>
        <RadioOption checked={valueBasis === "market"} onSelect={() => onValueBasis("market")} label="Current market value" blueDot />
        <RadioOption checked={valueBasis === "purchase"} onSelect={() => onValueBasis("purchase")} label="Time of purchase" blueDot />
      </div>
      <div style={{ borderTop: "1px solid #f0ece6", paddingTop: 20 }}>
        <p style={{ fontFamily: FONT, fontSize: 14, fontWeight: 500, color: "#0a0d10", margin: "0 0 2px" }}>Currency</p>
        <RadioOption checked={currency === "usd"} onSelect={() => onCurrency("usd")} label="USD" />
        <RadioOption checked={currency === "rsr"} onSelect={() => onCurrency("rsr")} label="RSR" />
      </div>
    </div>
  )
}

// ── Rewards chart ─────────────────────────────────────────────────────────────

function RewardsChart({
  fromDate, toDate, filteredData, filteredRsrData, totals,
  valueBasis, onValueBasis, currency, onCurrency,
}: {
  fromDate: string; toDate: string
  filteredData: RewardsPoint[]; filteredRsrData: RSRPoint[]; totals: PresetTotals
  valueBasis: ValueBasis; onValueBasis: (v: ValueBasis) => void
  currency: Currency; onCurrency: (v: Currency) => void
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [chartHovered, setChartHovered] = useState(false)
  const [hoverIdx, setHoverIdx] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const isRsr = currency === "rsr"

  const usdYLabels = ["$36K", "$28K", "$20K", "$12K", "$4K", "0.0"]
  const rsrYLabels = ["45K", "36K", "27K", "18K", "9K", "0.0"]
  const yLabels = isRsr ? rsrYLabels : usdYLabels

  const activeData = isRsr ? filteredRsrData : filteredData
  const xLabels = activeData.length <= 6
    ? activeData.map(d => d.label)
    : [0, Math.floor(activeData.length * 0.2), Math.floor(activeData.length * 0.4), Math.floor(activeData.length * 0.6), Math.floor(activeData.length * 0.8), activeData.length - 1]
        .map(i => activeData[i].label)

  const currencyLabel = isRsr ? "Total RSR Rewards" : "Total USD Rewards"

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const pct = (e.clientX - rect.left) / rect.width
    const n = activeData.length
    let nearest = 0; let minDist = Infinity
    activeData.forEach((_, i) => {
      const ix = n === 1 ? 0.5 : i / (n - 1)
      const dist = Math.abs(ix - pct)
      if (dist < minDist) { minDist = dist; nearest = i }
    })
    setHoverIdx(nearest)
  }

  const hp = hoverIdx !== null ? activeData[hoverIdx] : null
  const hpNx = hp ? (activeData.length === 1 ? RCW / 2 : (hoverIdx! / (activeData.length - 1)) * RCW) : 0
  const hpPct = hpNx / RCW * 100

  const tooltip = hp ? (() => {
    const isRight = hpPct > 55
    return (
      <div style={{ position: "absolute", top: 12, ...(isRight ? { right: `calc(${100 - hpPct}% + 12px)` } : { left: `calc(${hpPct}% + 12px)` }), background: "white", borderRadius: 10, padding: "10px 14px", boxShadow: "0 4px 20px rgba(0,0,0,0.12)", zIndex: 10, pointerEvents: "none", minWidth: 140 }}>
        <p style={{ fontFamily: FONT, fontSize: 11, fontWeight: 500, color: "#999", margin: "0 0 6px", textTransform: "uppercase", letterSpacing: 0.8 }}>{hp.label}</p>
        {isRsr ? (
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: "#0151af", flexShrink: 0 }} />
            <span style={{ fontFamily: FONT, fontSize: 13, fontWeight: 300, color: "#666" }}>Vote-locked</span>
            <span style={{ fontFamily: FONT, fontSize: 13, fontWeight: 700, color: "#0a0d10", marginLeft: "auto" }}>{((hp as RSRPoint).total / 1000).toFixed(1)}K</span>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: "#0b3fa0", flexShrink: 0 }} />
              <span style={{ fontFamily: FONT, fontSize: 13, fontWeight: 300, color: "#666" }}>Vote-locked</span>
              <span style={{ fontFamily: FONT, fontSize: 13, fontWeight: 700, color: "#0a0d10", marginLeft: "auto" }}>${((hp as RewardsPoint).votelock / 1000).toFixed(1)}K</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: "#4dbfb0", flexShrink: 0 }} />
              <span style={{ fontFamily: FONT, fontSize: 13, fontWeight: 300, color: "#666" }}>Staked</span>
              <span style={{ fontFamily: FONT, fontSize: 13, fontWeight: 700, color: "#0a0d10", marginLeft: "auto" }}>${((hp as RewardsPoint).staking / 1000).toFixed(1)}K</span>
            </div>
            <div style={{ borderTop: "1px solid #f0ece6", paddingTop: 6, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: FONT, fontSize: 13, fontWeight: 500, color: "#666" }}>Total</span>
              <span style={{ fontFamily: FONT, fontSize: 13, fontWeight: 700, color: "#0151af" }}>${(((hp as RewardsPoint).staking + (hp as RewardsPoint).votelock) / 1000).toFixed(1)}K</span>
            </div>
          </>
        )}
      </div>
    )
  })() : null

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ fontFamily: FONT, fontSize: 11, fontWeight: 500, color: "#666", letterSpacing: 1.2, textTransform: "uppercase" }}>{currencyLabel}</span>
          <span style={{ fontFamily: FONT, fontSize: 44, fontWeight: 700, color: "#0151af", lineHeight: "48px" }}>{totals.total}</span>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <ArrowUpRight size={14} color="#0151af" />
            <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 500, color: "#0151af" }}>{totals.pct} ({totals.change})</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 400, color: "#0a0d10" }}>Date range:</span>
          <DateRangePill label={formatDateDisplay(fromDate)} />
          <span style={{ fontFamily: FONT, fontSize: 14, color: "#666" }}>to</span>
          <DateRangePill label={formatDateDisplay(toDate)} />
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setMenuOpen(o => !o)}
              style={{ background: menuOpen ? "#f5f0eb" : "none", border: "1px solid #e0d5c7", borderRadius: 8, cursor: "pointer", padding: "6px 8px", display: "flex", alignItems: "center" }}
            >
              <SlidersHorizontal size={14} color={menuOpen ? "#0151af" : "#666"} />
            </button>
            {menuOpen && (
              <FilterMenu
                valueBasis={valueBasis} onValueBasis={onValueBasis}
                currency={currency} onCurrency={onCurrency}
                onClose={() => setMenuOpen(false)}
              />
            )}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
        <div
          ref={containerRef}
          style={{ flex: 1, minWidth: 0, position: "relative", cursor: "crosshair" }}
          onMouseEnter={() => setChartHovered(true)}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => { setChartHovered(false); setHoverIdx(null) }}
        >
          <svg viewBox={`0 0 ${RCW} ${RCH}`} width="100%" height={RCH} preserveAspectRatio="none" style={{ display: "block" }}>
            <defs>
              <linearGradient id="rwdGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0c47a1" />
                <stop offset="100%" stopColor="#3878d8" />
              </linearGradient>
            </defs>
            {isRsr ? (
              <path d={rsrSolidPath(filteredRsrData)} fill="url(#rwdGrad)" />
            ) : chartHovered ? (
              <>
                <path d={rewardsPath(filteredData, "votelock")} fill="#0b3fa0" />
                <path d={rewardsPath(filteredData, "staking")} fill="#4dbfb0" fillOpacity={0.9} />
              </>
            ) : (
              <path d={rewardsSolidPath(filteredData)} fill="url(#rwdGrad)" />
            )}
            {hp && (
              <>
                <line x1={hpNx} y1={0} x2={hpNx} y2={RCH} stroke="rgba(255,255,255,0.5)" strokeWidth={1} />
                {isRsr ? (
                  <circle cx={hpNx} cy={toRSRY((hp as RSRPoint).total)} r={4} fill="white" stroke="#0151af" strokeWidth={2} />
                ) : (
                  <>
                    <circle cx={hpNx} cy={toRY((hp as RewardsPoint).votelock)} r={4} fill="white" stroke="#0b3fa0" strokeWidth={2} />
                    <circle cx={hpNx} cy={toRY((hp as RewardsPoint).staking + (hp as RewardsPoint).votelock)} r={4} fill="white" stroke="#4dbfb0" strokeWidth={2} />
                  </>
                )}
              </>
            )}
          </svg>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
            {xLabels.map(l => (
              <span key={l} style={{ fontFamily: FONT, fontSize: 11, color: "#999" }}>{l}</span>
            ))}
          </div>
          {tooltip}
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: RCH, flexShrink: 0 }}>
          {yLabels.map(l => (
            <span key={l} style={{ fontFamily: FONT, fontSize: 11, color: "#666", textAlign: "right", display: "block", whiteSpace: "nowrap" }}>{l}</span>
          ))}
        </div>
      </div>
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
            <Cell flex={1}><div style={{ display: "flex", alignItems: "center", gap: mobile ? 10 : 16 }}><TokenBubble letter={row.letter} color={row.color} /><span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, color: "#0a0d10" }}>{row.token}</span></div></Cell>
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
                  <p style={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, color: "#0151af", margin: "0 0 2px" }}>{row.dtf}</p>
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
                <Cell width={180}><span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 300, color: "#0a0d10" }}>{row.date}</span></Cell>
                <Cell width={280}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <TokenBubble letter={row.letter} color={row.color} />
                    <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, color: "#0151af" }}>{row.dtf}</span>
                  </div>
                </Cell>
                <Cell width={150}><span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 300, color: "#0a0d10" }}>{row.type}</span></Cell>
                <Cell width={180}>
                  <div>
                    <p style={{ fontFamily: FONT, fontSize: 14, fontWeight: 300, color: "#0a0d10", margin: "0 0 2px" }}>{row.asset}</p>
                    <p style={{ fontFamily: FONT, fontSize: 12, fontWeight: 300, color: "#999", margin: 0 }}>{row.assetAmt}</p>
                  </div>
                </Cell>
                <Cell width={190}><div style={{ display: "flex", gap: 4, alignItems: "baseline" }}><span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 300, color: "#0a0d10" }}>{row.valueWhen}</span><span style={{ fontFamily: FONT, fontSize: 12, fontWeight: 300, color: "#999" }}>(USD)</span></div></Cell>
                <Cell flex={1}><div style={{ display: "flex", gap: 4, alignItems: "baseline" }}><span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 300, color: "#0a0d10" }}>{row.valueNow}</span><span style={{ fontFamily: FONT, fontSize: 12, fontWeight: 300, color: "#999" }}>(USD)</span></div></Cell>
              </TRow>
            ))}
          </>
        )}
      </TableCard>
    </div>
  )
}

// ── Rewards stat card ─────────────────────────────────────────────────────────

function RewardsStat({ title, value }: { title: string; value: string }) {
  return (
    <div style={{ flex: 1, background: "white", border: "1px solid #e0d5c7", borderRadius: 20, padding: "20px 24px" }}>
      <p style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, color: "#0151af", margin: "0 0 4px" }}>{title}</p>
      <p style={{ fontFamily: FONT, fontSize: 13, fontWeight: 300, color: "#666", margin: "0 0 16px" }}>Based on time range above</p>
      <p style={{ fontFamily: FONT, fontSize: 26, fontWeight: 700, color: "#0a0d10", margin: 0 }}>{value}</p>
    </div>
  )
}

// ── Rewards view ──────────────────────────────────────────────────────────────

function RewardsView({ mobile }: { tablet: boolean; mobile: boolean }) {
  const [valueBasis, setValueBasis] = useState<ValueBasis>("market")
  const [currency, setCurrency] = useState<Currency>("usd")

  const fromDate = PRESET_DATES["alltime"].from
  const toDate = PRESET_DATES["alltime"].to
  const filteredData = filterByDateRange(REWARDS_DATA, fromDate, toDate)
  const filteredRsrData = filterByDateRange(RSR_DATA, fromDate, toDate)
  const totals = currency === "rsr" ? RSR_PRESET_TOTALS["alltime"] : USD_PRESET_TOTALS["alltime"]

  return (
    <>
      <div style={{ padding: mobile ? "24px 20px 32px" : "32px 40px 40px" }}>
        <RewardsChart
          fromDate={fromDate} toDate={toDate}
          filteredData={filteredData}
          filteredRsrData={filteredRsrData}
          totals={totals}
          valueBasis={valueBasis} onValueBasis={setValueBasis}
          currency={currency} onCurrency={setCurrency}
        />
      </div>
      <div style={{ display: "flex", flexDirection: mobile ? "column" : "row", gap: 16, padding: mobile ? "16px 20px 32px" : "16px 40px 32px" }}>
        {currency === "usd" && <RewardsStat title="Total Staked" value={totals.staking} />}
        <RewardsStat title="Total Vote Locked" value={totals.votelock} />
      </div>
      <AvailableRewardsSection mobile={mobile} />
      <StakingActivitySection mobile={mobile} />
    </>
  )
}

// ── Transactions view ─────────────────────────────────────────────────────────

const TX_TYPE_COLORS: Record<string, { text: string; bg: string }> = {
  Stake:    { text: "#0151af", bg: "rgba(1,81,175,0.10)"    },
  Lock:     { text: "#6d44c4", bg: "rgba(109,68,196,0.10)"  },
  Vote:     { text: "#1a9e5f", bg: "rgba(26,158,95,0.10)"   },
  Delegate: { text: "#c47a00", bg: "rgba(196,122,0,0.10)"   },
  Withdraw: { text: "#c43a3a", bg: "rgba(196,58,58,0.10)"   },
}

function TypePill({ type }: { type: string }) {
  const c = TX_TYPE_COLORS[type] ?? { text: "#666", bg: "#f2f2f2" }
  return (
    <span style={{ fontFamily: FONT, fontSize: 13, fontWeight: 500, color: c.text, background: c.bg, borderRadius: 42, padding: "4px 12px", whiteSpace: "nowrap" }}>
      {type}
    </span>
  )
}

function TransactionsView({ mobile }: { mobile: boolean }) {
  const rows = [
    { date: "Dec 14, 2025", token: "RSR",          letter: "ℝ", color: "#1a2f6e", type: "Stake",    description: "Staked 500,000 RSR into eth+RSR",                   tx: "0x053c...6c50" },
    { date: "Dec 14, 2025", token: "vlRSR-LCAP",   letter: "#", color: "#1a6bbf", type: "Lock",     description: "Vote-locked 162,300 RSR for CF Large Cap Index",     tx: "0x1a4d...3f21" },
    { date: "Dec 12, 2025", token: "RSR",          letter: "ℝ", color: "#1a2f6e", type: "Delegate", description: "Delegated voting power to 0x4880...c3a8",            tx: "0x9f2b...c811" },
    { date: "Dec 10, 2025", token: "vlRSR-BGCI",   letter: "#", color: "#1a6bbf", type: "Vote",     description: "Voted FOR on proposal #481244 — BGCI basket rebalance", tx: "0x7c3e...9d04" },
    { date: "Dec 07, 2025", token: "vlRSR-MVDA25", letter: "#", color: "#1a6bbf", type: "Lock",     description: "Vote-locked 80,000 RSR for MVDA25",                  tx: "0x2b8a...f190" },
    { date: "Dec 03, 2025", token: "vlRSR-LCAP",   letter: "#", color: "#1a6bbf", type: "Vote",     description: "Voted FOR on proposal #480892 — add wBTC collateral", tx: "0x4f1d...a203" },
    { date: "Nov 29, 2025", token: "RSR",          letter: "ℝ", color: "#1a2f6e", type: "Stake",    description: "Staked 250,000 RSR into eth+RSR",                   tx: "0x6d1c...5a77" },
    { date: "Nov 22, 2025", token: "vlRSR-BGCI",   letter: "#", color: "#1a6bbf", type: "Withdraw", description: "Withdrew 50,000 RSR from vlRSR-BGCI",                tx: "0x3e9f...2b44" },
    { date: "Nov 15, 2025", token: "vlRSR-LCAP",   letter: "#", color: "#1a6bbf", type: "Vote",     description: "Voted AGAINST on proposal #479011 — fee adjustment", tx: "0xab12...7c93" },
    { date: "Nov 09, 2025", token: "RSR",          letter: "ℝ", color: "#1a2f6e", type: "Delegate", description: "Delegated to 0x6905...C8dE",                        tx: "0x0c19...84ca" },
    { date: "Oct 30, 2025", token: "vlRSR-MVDA25", letter: "#", color: "#1a6bbf", type: "Lock",     description: "Vote-locked 162,300 RSR for MVDA25",                tx: "0x5f8d...1e62" },
    { date: "Oct 18, 2025", token: "RSR",          letter: "ℝ", color: "#1a2f6e", type: "Stake",    description: "Staked 1,000,000 RSR into eth+RSR",                 tx: "0xe72a...08bc" },
    { date: "Oct 05, 2025", token: "vlRSR-BGCI",   letter: "#", color: "#1a6bbf", type: "Lock",     description: "Vote-locked 259,100 RSR for BGCI",                  tx: "0xc39d...f441" },
    { date: "Sep 21, 2025", token: "RSR",          letter: "ℝ", color: "#1a2f6e", type: "Withdraw", description: "Withdrew 100,000 RSR from eth+RSR staking",          tx: "0x8b5e...3d90" },
    { date: "Sep 09, 2025", token: "vlRSR-LCAP",   letter: "#", color: "#1a6bbf", type: "Delegate", description: "Delegated LCAP voting power to 0x4480...c3a8",       tx: "0xd104...9cf2" },
  ]

  return (
    <div style={{ padding: mobile ? "20px 20px 0" : "32px 40px 0" }}>
      {/* Heading */}
      <div style={{ paddingLeft: 24, marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <ArrowDownUp size={20} color="#0151af" />
          <span style={{ fontFamily: FONT, fontSize: 18, fontWeight: 700, color: "#0151af" }}>Transactions</span>
        </div>
        <p style={{ fontFamily: FONT, fontSize: 16, fontWeight: 300, color: "#0a0d10", margin: 0 }}>Your history of recent on-chain activity</p>
      </div>

      {/* Search + filters */}
      {!mobile && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 12, border: "1px solid #e5e5e5", borderRadius: 16, padding: "16px 20px", background: "white" }}>
            <Search size={16} color="#999" />
            <span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 300, color: "rgba(0,0,0,0.4)" }}>Search by token or description</span>
          </div>
          <button style={{ display: "flex", alignItems: "center", gap: 8, border: "1px solid #e5e5e5", borderRadius: 16, padding: "16px 20px", background: "white", cursor: "pointer", fontFamily: FONT, fontSize: 16, fontWeight: 300, color: "rgba(0,0,0,0.7)", whiteSpace: "nowrap" }}>
            <span>All Types</span>
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
          <THCell width={mobile ? 100 : 155}>Date</THCell>
          <THCell width={mobile ? 110 : 185}>Token</THCell>
          {!mobile && <THCell width={140}>Type</THCell>}
          <THCell flex={1}>Description</THCell>
          {!mobile && <THCell width={175}>Explorer</THCell>}
        </THead>
        {rows.map((row, i) => (
          <TRow key={i} bordered={i < rows.length - 1} minHeight={72}>
            <Cell width={mobile ? 100 : 155}>
              <span style={{ fontFamily: FONT, fontSize: mobile ? 12 : 14, fontWeight: 300, color: "#666" }}>{row.date}</span>
            </Cell>
            <Cell width={mobile ? 110 : 185}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <TokenBubble letter={row.letter} color={row.color} size={28} />
                <span style={{ fontFamily: FONT, fontSize: mobile ? 13 : 14, fontWeight: 600, color: "#0a0d10", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{row.token}</span>
              </div>
            </Cell>
            {!mobile && <Cell width={140}><TypePill type={row.type} /></Cell>}
            <Cell flex={1}>
              <span style={{ fontFamily: FONT, fontSize: mobile ? 13 : 14, fontWeight: 300, color: "#0a0d10" }}>{mobile ? `${row.type} · ` : ""}{row.description}</span>
            </Cell>
            {!mobile && (
              <Cell width={175}>
                <Link href="#" style={{ display: "flex", alignItems: "center", gap: 4, textDecoration: "none" }}>
                  <span style={{ fontFamily: FONT, fontSize: 13, fontWeight: 300, color: "#0151af" }}>{row.tx}</span>
                  <ArrowUpRight size={13} color="#0151af" />
                </Link>
              </Cell>
            )}
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
