"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import {
  ArrowUpRight, ArrowRight, TrendingUp, TrendingDown,
  Globe, Flower2, Scale, Landmark, MoreVertical,
  ArrowDownUp, CheckSquare, Lock, Copy,
} from "lucide-react"

const FONT = "'TWK Lausanne', system-ui, sans-serif"

// ── Chart data & helpers ───────────────────────────────────────────────────────

const CW = 937
const CH = 352
const CMAX = 1000

function toY(val: number) { return CH - (val / CMAX) * CH }

type ChartPoint = {
  label: string
  x: number
  rsr: number
  vl: number
  srsr: number
  ydtf: number
  idtf: number
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
  const c1 = d.rsr
  const c2 = c1 + d.vl
  const c3 = c2 + d.srsr
  const c4 = c3 + d.ydtf
  const c5 = c4 + d.idtf
  return [0, c1, c2, c3, c4, c5]
}

function areaPath(data: ChartPoint[], idx: 1 | 2 | 3 | 4 | 5): string {
  const prevIdx = (idx - 1) as 0 | 1 | 2 | 3 | 4
  const fwd = data.map((d, i) => `${i === 0 ? "M" : "L"}${d.x},${toY(getCum(d)[idx])}`).join(" ")
  const bwd = [...data].reverse().map(d => `L${d.x},${idx > 1 ? toY(getCum(d)[prevIdx]) : CH}`).join(" ")
  return `${fwd} ${bwd} Z`
}

// ── Shared primitives ──────────────────────────────────────────────────────────

function SectionHeading({
  icon,
  title,
  subtitle,
  subtitleLink,
  rightContent,
}: {
  icon: React.ReactNode
  title: string
  subtitle: string
  subtitleLink?: string
  rightContent?: React.ReactNode
}) {
  return (
    <div style={{
      display: "flex", alignItems: "flex-start", justifyContent: "space-between",
      paddingLeft: 24, marginBottom: 16,
    }}>
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
    <div style={{
      background: "white",
      border: "1px solid #e0d5c7",
      borderRadius: 20,
      overflow: "hidden",
      width: "100%",
    }}>
      {children}
    </div>
  )
}

// Table row with stretch layout — cells fill full height
function TRow({ children, bordered = true, minHeight = 96 }: { children: React.ReactNode; bordered?: boolean; minHeight?: number }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "stretch",
      minHeight,
      borderBottom: bordered ? "1px solid #e5e5e5" : "none",
      width: "100%",
    }}>
      {children}
    </div>
  )
}

// Header row (65px, cells centered)
function THead({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "stretch",
      height: 65,
      borderBottom: "1px solid #e5e5e5",
      width: "100%",
    }}>
      {children}
    </div>
  )
}

// A single cell — content is vertically centered within the stretched height
function Cell({ children, width, flex }: { children: React.ReactNode; width?: number; flex?: number }) {
  return (
    <div style={{
      width: flex ? undefined : width,
      flex: flex ?? undefined,
      flexShrink: 0,
      padding: "0 24px",
      display: "flex",
      alignItems: "center",
    }}>
      {children}
    </div>
  )
}

function THCell({ children, width, flex }: { children: React.ReactNode; width?: number; flex?: number }) {
  return (
    <div style={{
      width: flex ? undefined : width,
      flex: flex ?? undefined,
      flexShrink: 0,
      padding: "0 24px",
      display: "flex",
      alignItems: "center",
    }}>
      <span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 300, color: "#666" }}>{children}</span>
    </div>
  )
}

function TokenBubble({ letter, color, size = 32 }: { letter: string; color: string; size?: number }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: color,
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
    }}>
      <span style={{ fontFamily: FONT, fontWeight: 700, color: "white", fontSize: size * 0.375, lineHeight: 1 }}>{letter}</span>
    </div>
  )
}

function ValuePair({ main, sub, mainWeight = 700, mainColor = "#0a0d10" }: {
  main: string; sub: string; mainWeight?: number; mainColor?: string
}) {
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
    <button style={{
      background: "#0151af", color: "white",
      border: "1px solid #0151af", borderRadius: 42,
      height: 32, padding: "0 12px",
      fontFamily: FONT, fontSize: 14, fontWeight: 500,
      cursor: "pointer", whiteSpace: "nowrap",
    }}>
      Claim
    </button>
  )
}

function OutlineBtn({ label, color = "#0151af" }: { label: string; color?: string }) {
  return (
    <button style={{
      background: "none", color,
      border: "1px solid #e5e5e5", borderRadius: 42,
      height: 32, padding: "0 12px",
      fontFamily: FONT, fontSize: 14, fontWeight: 500,
      cursor: "pointer", whiteSpace: "nowrap",
    }}>
      {label}
    </button>
  )
}

function StatusPill({ label, color }: { label: string; color: string }) {
  return (
    <div style={{
      border: "1px solid #e5e5e5", borderRadius: 42,
      height: 32, padding: "0 12px",
      display: "inline-flex", alignItems: "center",
    }}>
      <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 500, color, whiteSpace: "nowrap" }}>{label}</span>
    </div>
  )
}

// ── Portfolio chart ────────────────────────────────────────────────────────────

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
    let nearest = 0
    let minDist = Infinity
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
    <div style={{
      position: "absolute", top: 16,
      left: hpPct > 55 ? undefined : `calc(${hpPct}% + 14px)`,
      right: hpPct > 55 ? `calc(${100 - hpPct}% + 14px)` : undefined,
      background: "white", borderRadius: 12,
      padding: "12px 14px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
      minWidth: 195, zIndex: 10, pointerEvents: "none",
    }}>
      <p style={{ fontFamily: FONT, fontSize: 12, fontWeight: 300, color: "#666", margin: "0 0 8px" }}>
        {hp.label}, {hpYear}
      </p>
      {CHART_LAYERS.map((layer) => (
        <div key={layer.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, marginBottom: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: layer.color, flexShrink: 0 }} />
            <span style={{ fontFamily: FONT, fontSize: 13, fontWeight: 300, color: "#0a0d10" }}>{layer.label}</span>
          </div>
          <span style={{ fontFamily: FONT, fontSize: 13, fontWeight: 500, color: "#0a0d10" }}>
            ${(hp[layer.key] as number).toFixed(2)}
          </span>
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
      {/* Value + tabs */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div style={{ paddingLeft: 24, display: "flex", flexDirection: "column", gap: 8 }}>
          <span style={{ fontFamily: FONT, fontSize: 46, fontWeight: 500, color: "#0151af", lineHeight: "50px" }}>
            $31,373.24
          </span>
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
              <button
                key={t}
                onClick={() => setActiveTab(key)}
                style={{
                  padding: "6px 10px", borderRadius: isActive ? 14 : 6,
                  border: "none", cursor: "pointer",
                  background: isActive ? "white" : "transparent",
                  boxShadow: isActive ? "0 1px 8px 2px rgba(0,0,0,0.05)" : "none",
                  fontFamily: FONT, fontSize: 14,
                  fontWeight: isActive ? 500 : 300,
                  color: isActive ? "#0151af" : "#0a0d10",
                  whiteSpace: "nowrap",
                }}
              >
                {t}
              </button>
            )
          })}
        </div>
      </div>

      {/* Chart + Y-axis */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 16, width: "100%" }}>
        <div
          ref={containerRef}
          style={{ flex: 1, minWidth: 0, position: "relative", height: 400, cursor: "crosshair" }}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoverIdx(null)}
        >
          <svg viewBox={`0 0 ${CW} ${CH}`} width="100%" height="370" preserveAspectRatio="none" style={{ display: "block" }}>
            {([1, 2, 3, 4, 5] as const).map((idx) => (
              <path
                key={idx}
                d={areaPath(CHART_DATA, idx)}
                fill={CHART_LAYERS[idx - 1].color}
                fillOpacity={0.85}
              />
            ))}
            {hp && (
              <line x1={hp.x} y1={0} x2={hp.x} y2={CH} stroke="#bbb" strokeWidth={0.8} />
            )}
            {hp && hpCum && CHART_LAYERS.map((layer, i) => (
              <circle
                key={layer.key}
                cx={hp.x}
                cy={toY(hpCum[(i + 1) as 1 | 2 | 3 | 4 | 5])}
                r={3.5}
                fill={layer.color}
                stroke="white"
                strokeWidth={1.5}
              />
            ))}
          </svg>
          {/* X-axis */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
            {xLabels.map((l) => (
              <span key={l} style={{ fontFamily: "'Lato', sans-serif", fontSize: 11, color: "#999" }}>{l}</span>
            ))}
          </div>
          {tooltip}
        </div>
        {/* Y-axis */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: 370, flexShrink: 0 }}>
          {yLabels.map((l) => (
            <span key={l} style={{ fontFamily: "'Lato', sans-serif", fontSize: 11, color: "#666", textAlign: "right", display: "block" }}>{l}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Sidebar cards ──────────────────────────────────────────────────────────────

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
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
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

function RewardsCard() {
  return (
    <div style={{ background: "white", border: "1px solid #e0d5c7", borderRadius: 20, padding: "16px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
      <div>
        <p style={{ fontFamily: FONT, fontSize: 20, fontWeight: 700, color: "#0151af", margin: "0 0 4px" }}>Rewards Available</p>
        <p style={{ fontFamily: FONT, fontSize: 14, fontWeight: 300, color: "#666", margin: 0 }}>
          Your total participation awards available across all chains
        </p>
      </div>
      <span style={{ fontFamily: FONT, fontSize: 20, fontWeight: 700, color: "#0151af" }}>$43.23</span>
      <button style={{
        background: "#0151af", color: "white", border: "none",
        borderRadius: 16, padding: "8px 16px",
        fontFamily: FONT, fontSize: 12, fontWeight: 500,
        cursor: "pointer", alignSelf: "flex-start",
      }}>
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

// ── Section: DTF Positions ─────────────────────────────────────────────────────

function DTFPositionsSection() {
  const rows = [
    {
      name: "CoinMarketCap 20 Index DTF", ticker: "$LCAP", letter: "L", color: "#1a4fc4",
      perf: "-9.61%", perfAbs: "-$84.29 USDC", perfPos: false,
      unrealized: "$342.28", unrealizedSub: "USDC", unrealizedColor: "#ef4345",
      avgPrice: "$144.08",
      mktCap: "$13,151,364", mktCapSub: "USDC",
      balance: "5.5K", balanceSub: "CMC20",
      value: "$342.28", valueSub: "USDC",
    },
    {
      name: "Alpha Base Index", ticker: "$ABX", letter: "A", color: "#6366f1",
      perf: "+1.87%", perfAbs: "+$204.29 USDC", perfPos: true,
      unrealized: "$198.73", unrealizedSub: "USDC", unrealizedColor: "#23c45f",
      avgPrice: "$0.0007381",
      mktCap: "$110,098", mktCapSub: "USDC",
      balance: "132.2K", balanceSub: "ABX",
      value: "$198.73", valueSub: "USDC",
    },
  ]

  return (
    <div style={{ padding: "0 40px", marginBottom: 32 }}>
      <SectionHeading
        icon={<Globe size={20} color="#0151af" />}
        title="DTF Positions"
        subtitle="Your Decentralized Token Folios investments."
        rightContent={
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: FONT, fontSize: 16, fontWeight: 500, color: "#0151af", textDecoration: "none", paddingRight: 24 }}>
            Browse all Index DTFs <ArrowRight size={16} />
          </Link>
        }
      />
      <TableCard>
        <THead>
          <THCell width={320}>Name</THCell>
          <THCell width={180}>
            Performance <span style={{ color: "#999", marginLeft: 4 }}>(24H)</span>
          </THCell>
          <THCell width={150}>Unrealized P/L</THCell>
          <THCell width={150}>Average price</THCell>
          <THCell width={150}>Market Cap</THCell>
          <THCell width={130}>Balance</THCell>
          <THCell flex={1}>Value</THCell>
        </THead>
        {rows.map((row, i) => (
          <TRow key={row.ticker} bordered={i < rows.length - 1}>
            <Cell width={320}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <TokenBubble letter={row.letter} color={row.color} />
                <div>
                  <p style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, color: "#0a0d10", margin: "0 0 2px" }}>{row.name}</p>
                  <p style={{ fontFamily: FONT, fontSize: 16, fontWeight: 300, color: "#666", margin: 0 }}>{row.ticker}</p>
                </div>
              </div>
            </Cell>
            <Cell width={180}><PerfCell pct={row.perf} abs={row.perfAbs} positive={row.perfPos} /></Cell>
            <Cell width={150}>
              <div>
                <p style={{ fontFamily: FONT, fontSize: 16, fontWeight: 300, color: row.unrealizedColor, margin: "0 0 3px" }}>{row.unrealized}</p>
                <p style={{ fontFamily: FONT, fontSize: 13, fontWeight: 300, color: "#999", margin: 0 }}>{row.unrealizedSub}</p>
              </div>
            </Cell>
            <Cell width={150}>
              <span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 300, color: "#0a0d10" }}>{row.avgPrice}</span>
            </Cell>
            <Cell width={150}><ValuePair main={row.mktCap} sub={row.mktCapSub} mainWeight={300} /></Cell>
            <Cell width={130}><ValuePair main={row.balance} sub={row.balanceSub} mainWeight={300} /></Cell>
            <Cell flex={1}><ValuePair main={row.value} sub={row.valueSub} /></Cell>
          </TRow>
        ))}
      </TableCard>
    </div>
  )
}

// ── Section: Available Rewards ─────────────────────────────────────────────────

function AvailableRewardsSection() {
  const rows = [
    { token: "MVTT10F", letter: "M", color: "#0e7dbd", balance: "600", balanceSub: "MVTT10F", value: "$3.98", valueSub: "USD" },
    { token: "MVDA25", letter: "V", color: "#0e7dbd", balance: "600", balanceSub: "MVDA25", value: "$3.98", valueSub: "USD" },
  ]
  return (
    <div style={{ padding: "0 40px", marginBottom: 32 }}>
      <SectionHeading
        icon={<Flower2 size={20} color="#0151af" />}
        title="Available Rewards"
        subtitle="Earn rewards by staking or participating in governance."
        subtitleLink="Learn more"
      />
      <TableCard>
        <THead>
          <THCell width={320}>Reward Token</THCell>
          <THCell width={250}>Balance</THCell>
          <THCell width={250}>Value</THCell>
          <THCell flex={1}>Claim</THCell>
        </THead>
        {rows.map((row, i) => (
          <TRow key={row.token} bordered={i < rows.length - 1}>
            <Cell width={320}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <TokenBubble letter={row.letter} color={row.color} />
                <span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, color: "#0a0d10" }}>{row.token}</span>
              </div>
            </Cell>
            <Cell width={250}><ValuePair main={row.balance} sub={row.balanceSub} /></Cell>
            <Cell width={250}><ValuePair main={row.value} sub={row.valueSub} /></Cell>
            <Cell flex={1}><ClaimBtn /></Cell>
          </TRow>
        ))}
      </TableCard>
    </div>
  )
}

// ── Section: Staked Positions ──────────────────────────────────────────────────

function StakedPositionsSection() {
  return (
    <div style={{ padding: "0 40px", marginBottom: 32 }}>
      <SectionHeading
        icon={<Scale size={20} color="#0151af" />}
        title="Staked Positions"
        subtitle="Stake your RSR and earn APY."
        subtitleLink="Learn more"
      />
      <TableCard>
        <THead>
          <THCell width={320}>Position</THCell>
          <THCell width={150}>Governs</THCell>
          <THCell width={100}>APY</THCell>
          <THCell width={130}>Balance</THCell>
          <THCell width={150}>Value (USD)</THCell>
          <THCell width={150}>Value (RSR)</THCell>
          <THCell flex={1}>Actions</THCell>
        </THead>
        <TRow bordered={false}>
          <Cell width={320}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <TokenBubble letter="E" color="#0151af" />
              <span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, color: "#0a0d10" }}>eth+RSR</span>
            </div>
          </Cell>
          <Cell width={150}>
            <span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 300, color: "#666" }}>LCAP</span>
          </Cell>
          <Cell width={100}>
            <span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 300, color: "#666" }}>7.05%</span>
          </Cell>
          <Cell width={130}><ValuePair main="162.3K" sub="eth+RSR" mainWeight={300} /></Cell>
          <Cell width={150}><ValuePair main="$65.32" sub="USD" /></Cell>
          <Cell width={150}><ValuePair main="123.2K" sub="RSR" /></Cell>
          <Cell flex={1}>
            <button style={{ background: "none", border: "none", cursor: "pointer", padding: 8, display: "flex" }}>
              <MoreVertical size={20} color="#666" />
            </button>
          </Cell>
        </TRow>
      </TableCard>
    </div>
  )
}

// ── Section: Vote-locked Positions ────────────────────────────────────────────

function VoteLockedSection() {
  const rows = [
    {
      token: "vlRSR-MVDA25", letter: "#", color: "#1a6bbf",
      lockIcon: <Lock size={14} color="#666" />,
      unlockStatus: null,
      governs: "MVDA25", apy: "7.05%",
      balance: "162.3K", balanceSub: "RSR",
      value: "$442.02", valueSub: "USDC",
      action: "menu" as const,
    },
    {
      token: "vlRSR-SINGLE", letter: "#", color: "#1a6bbf",
      lockIcon: null,
      unlockStatus: { amount: "5K RSR", time: "6d 23h 59m" },
      governs: "BGCI", apy: "7.05%",
      balance: "162.3K", balanceSub: "RSR",
      value: "$442.02", valueSub: "USDC",
      action: "menu" as const,
    },
    {
      token: "vlRSR-BGCI", letter: "#", color: "#1a6bbf",
      lockIcon: <Lock size={14} color="#666" style={{ opacity: 0.5 }} />,
      unlockStatus: null,
      governs: "BGCI", apy: "6.19%",
      balance: "259.1K", balanceSub: "RSR",
      value: "$623.84", valueSub: "USDC",
      action: "withdraw" as const,
    },
  ]
  return (
    <div style={{ padding: "0 40px", marginBottom: 32 }}>
      <SectionHeading
        icon={<Landmark size={20} color="#0151af" />}
        title="Vote-locked positions"
        subtitle="Participate in governance with any ERC-20 token and earn APY rewards."
        subtitleLink="Learn more"
      />
      <TableCard>
        <THead>
          <THCell width={320}>Governance Token</THCell>
          <THCell width={150}>Governs</THCell>
          <THCell width={100}>APY</THCell>
          <THCell width={130}>Balance</THCell>
          <THCell width={150}>Value</THCell>
          <THCell flex={1}>Actions</THCell>
        </THead>
        {rows.map((row, i) => (
          <TRow key={row.token} bordered={i < rows.length - 1} minHeight={row.unlockStatus ? 117 : 96}>
            <Cell width={320}>
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
            <Cell width={150}>
              <span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 300, color: "#666" }}>{row.governs}</span>
            </Cell>
            <Cell width={100}>
              <span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 300, color: "#666" }}>{row.apy}</span>
            </Cell>
            <Cell width={130}><ValuePair main={row.balance} sub={row.balanceSub} mainWeight={300} /></Cell>
            <Cell width={150}><ValuePair main={row.value} sub={row.valueSub} /></Cell>
            <Cell flex={1}>
              {row.action === "withdraw"
                ? <OutlineBtn label="Withdraw" />
                : <button style={{ background: "none", border: "none", cursor: "pointer", padding: 8, display: "flex" }}>
                    <MoreVertical size={20} color="#666" />
                  </button>
              }
            </Cell>
          </TRow>
        ))}
      </TableCard>
    </div>
  )
}

// ── Section: Active Proposals ─────────────────────────────────────────────────

function ActiveProposalsSection() {
  const rows = [
    {
      dtf: "CMC20", letter: "C", color: "#2d57f1",
      title: "December Rebalance",
      detail: { type: "votes", quorum: true, forPct: 65, votesFor: "100%", votesAgainst: "0%", votesAbstain: "0%" },
      date: "Dec 104, 2025", by: "0x6905...C8dE",
      id: "481244...9185",
      status: { label: "In Process", color: "#56b891" },
    },
    {
      dtf: "vlALTT-ABX", letter: "V", color: "#6366f1",
      title: "Basket Change",
      detail: { type: "countdown", text: "Voting Starts in: 1 day, 23 hours, 59 minutes" },
      date: "Dec 15, 2025", by: "0x6905...C8dE",
      id: "481244...9185",
      status: { label: "Pending", color: "#ff8a00" },
    },
  ]
  return (
    <div style={{ padding: "0 40px", marginBottom: 32 }}>
      <SectionHeading
        icon={<CheckSquare size={20} color="#0151af" />}
        title="Active Proposals"
        subtitle="View proposals from different DTFs you have vote-locked."
      />
      <TableCard>
        <THead>
          <THCell width={320}>DTF Governed</THCell>
          <THCell width={350}>Title</THCell>
          <THCell width={190}>Date Proposed</THCell>
          <THCell width={150}>ID</THCell>
          <THCell flex={1}>Status</THCell>
        </THead>
        {rows.map((row, i) => (
          <TRow key={row.dtf + i} bordered={i < rows.length - 1}>
            {/* DTF cell */}
            <Cell width={320}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <TokenBubble letter={row.letter} color={row.color} size={40} />
                <span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, color: "#0a0d10" }}>{row.dtf}</span>
              </div>
            </Cell>
            {/* Title cell */}
            <Cell width={350}>
              <div style={{ padding: "16px 0", display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, color: "#0151af", letterSpacing: -0.64 }}>
                  {row.title}
                </span>
                {row.detail.type === "votes" ? (
                  <>
                    {/* Progress bar */}
                    <div style={{ position: "relative", height: 12, background: "#d9d9d9", borderRadius: 11, width: "100%", maxWidth: 330 }}>
                      <div style={{ position: "absolute", top: 0, left: 0, height: 12, background: "#23c45f", borderRadius: 11, width: `${(row.detail as { forPct: number }).forPct}%` }} />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 300, color: "#0a0d10" }}>Quorum?:</span>
                        <span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 300, color: (row.detail as { quorum: boolean }).quorum ? "#56b891" : "#ef4345" }}>
                          {(row.detail as { quorum: boolean }).quorum ? "Yes" : "No"}
                        </span>
                      </div>
                      <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#ccc" }} />
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 300, color: "#0a0d10" }}>Votes:</span>
                        <span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 300, color: "#0151af" }}>{(row.detail as { votesFor: string }).votesFor}</span>
                        <span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 300, color: "#0a0d10" }}>/</span>
                        <span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 300, color: "#d05a67" }}>{(row.detail as { votesAgainst: string }).votesAgainst}</span>
                        <span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 300, color: "#0a0d10" }}>/</span>
                        <span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 300, color: "#0a0d10" }}>{(row.detail as { votesAbstain: string }).votesAbstain}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 300, color: "#0a0d10" }}>
                    {(row.detail as { text: string }).text}
                  </span>
                )}
              </div>
            </Cell>
            {/* Date */}
            <Cell width={190}>
              <div style={{ padding: "24px 0" }}>
                <p style={{ fontFamily: FONT, fontSize: 16, fontWeight: 300, color: "#0a0d10", margin: "0 0 2px", whiteSpace: "nowrap" }}>{row.date}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 300, color: "#666", whiteSpace: "nowrap" }}>By: {row.by}</span>
                  <ArrowUpRight size={14} color="#666" />
                </div>
              </div>
            </Cell>
            {/* ID */}
            <Cell width={150}>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 300, color: "#0a0d10" }}>{row.id}</span>
                <Copy size={14} color="#666" style={{ cursor: "pointer" }} />
              </div>
            </Cell>
            {/* Status */}
            <Cell flex={1}>
              <StatusPill label={row.status.label} color={row.status.color} />
            </Cell>
          </TRow>
        ))}
      </TableCard>
    </div>
  )
}

// ── Section: Voting Power ─────────────────────────────────────────────────────

function VotingPowerSection() {
  const rows = [
    { dtf: "CMC20", letter: "C", color: "#2d57f1", govToken: "vlRSR-CMCIndex", votePwr: "4.5", badge: null as null | "Delegated" | "Delegator", voteWeight: "27.1%", locker: "0x4880...c3a8", delegate: "0x4880...c3a8" },
    { dtf: "CLX", letter: "C", color: "#059669", govToken: "vlRSR-CLX", votePwr: "1.1", badge: "Delegated" as const, voteWeight: "15.85%", locker: "0x4880...c3a8", delegate: "0x4880...c3a8" },
    { dtf: "CLX", letter: "C", color: "#7c3aed", govToken: "vlRSR-CLX", votePwr: "3", badge: null as null | "Delegated" | "Delegator", voteWeight: "12.56%", locker: "0x4880...c3a8", delegate: "0x4880...c3a8" },
    { dtf: "CF Large Cap Index", letter: "C", color: "#1a4fc4", govToken: "vlRSR-LCAP", votePwr: "1.1", badge: "Delegator" as const, voteWeight: "12.56%", locker: "0x4480...c3a8", delegate: "0x4480...c3a8" },
  ]
  return (
    <div style={{ padding: "0 40px", marginBottom: 32 }}>
      <SectionHeading
        icon={<ArrowDownUp size={20} color="#0151af" />}
        title="Voting Power"
        subtitle="Including any power delegated to you."
      />
      <TableCard>
        <THead>
          <THCell width={320}>DTF Governed</THCell>
          <THCell width={200}>Governance Token</THCell>
          <THCell width={160}>Vote Power</THCell>
          <THCell width={160}>Vote Weight</THCell>
          <THCell width={200}>Vote-locker Address</THCell>
          <THCell width={192}>Delegate Address</THCell>
          <THCell width={140}>Actions</THCell>
        </THead>
        {rows.map((row, i) => (
          <TRow key={`${row.dtf}-${i}`} bordered={i < rows.length - 1}>
            <Cell width={320}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <TokenBubble letter={row.letter} color={row.color} size={28} />
                <span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 300, color: "#0151af" }}>{row.dtf}</span>
              </div>
            </Cell>
            <Cell width={200}>
              <span style={{ fontFamily: FONT, fontSize: 15, fontWeight: 300, color: "#0151af" }}>{row.govToken}</span>
            </Cell>
            <Cell width={160}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 300, color: "#0a0d10" }}>{row.votePwr}</span>
                {row.badge && (
                  <span style={{
                    fontFamily: FONT, fontSize: 12, fontWeight: 500,
                    color: row.badge === "Delegated" ? "#008632" : "#0151af",
                    background: row.badge === "Delegated" ? "rgba(35,196,95,0.15)" : "rgba(1,81,175,0.15)",
                    borderRadius: 42, height: 20, padding: "0 8px",
                    display: "inline-flex", alignItems: "center",
                  }}>
                    {row.badge}
                  </span>
                )}
              </div>
            </Cell>
            <Cell width={160}>
              <span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 300, color: "#0a0d10" }}>{row.voteWeight}</span>
            </Cell>
            <Cell width={200}>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 300, color: "#0151af" }}>{row.locker}</span>
                <ArrowUpRight size={14} color="#0151af" />
              </div>
            </Cell>
            <Cell width={192}>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 300, color: "#0151af" }}>{row.delegate}</span>
                <ArrowUpRight size={14} color="#0151af" />
              </div>
            </Cell>
            <Cell width={140}>
              <button style={{ background: "none", border: "none", cursor: "pointer", padding: 8, display: "flex" }}>
                <MoreVertical size={20} color="#666" />
              </button>
            </Cell>
          </TRow>
        ))}
      </TableCard>
    </div>
  )
}

// ── Section: RSR ───────────────────────────────────────────────────────────────

function RSRSection() {
  return (
    <div style={{ padding: "0 40px", marginBottom: 32 }}>
      <SectionHeading
        icon={
          <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#1a2f6e", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: "white", lineHeight: 1 }}>ℝ</span>
          </div>
        }
        title="RSR"
        subtitle="Reserve (RSR) is an ERC-20 token that defines governance, risk management, and value accrual according to the Reserve constitution."
      />
      <TableCard>
        <THead>
          <THCell width={320}>Name</THCell>
          <THCell width={200}>Performance 7D</THCell>
          <THCell width={200}>24H Change</THCell>
          <THCell width={200}>Balance</THCell>
          <THCell flex={1}>Value</THCell>
        </THead>
        <TRow bordered={false}>
          <Cell width={320}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#1a2f6e", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontFamily: FONT, fontSize: 12, fontWeight: 700, color: "white" }}>ℝ</span>
              </div>
              <span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, color: "#0a0d10" }}>RSR</span>
            </div>
          </Cell>
          <Cell width={200}><PerfCell pct="+1.23%" abs="+$2.14" positive /></Cell>
          <Cell width={200}>
            <span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 300, color: "#0a0d10" }}>7.19%</span>
          </Cell>
          <Cell width={200}><ValuePair main="230,121" sub="RSR" mainWeight={300} /></Cell>
          <Cell flex={1}><ValuePair main="$9,121.76" sub="USDC" /></Cell>
        </TRow>
      </TableCard>
    </div>
  )
}

// ── Section: Transactions ──────────────────────────────────────────────────────

function TransactionsSection() {
  const rows = [
    { date: "December 14, 2025", dtf: "CF Large Cap Index", letter: "C", color: "#1a4fc4", type: "Mint", amount: "$1,124.66", units: "(7.98)", tx: "0x053c...6c50" },
    { date: "December 14, 2025", dtf: "CF Large Cap Index", letter: "C", color: "#1a4fc4", type: "Mint", amount: "$1,124.66", units: "(7.98)", tx: "0x053c...6c50" },
    { date: "December 14, 2025", dtf: "CF Large Cap Index", letter: "C", color: "#1a4fc4", type: "Mint", amount: "$1,124.66", units: "(7.98)", tx: "0x053c...6c50" },
    { date: "December 14, 2025", dtf: "CF Large Cap Index", letter: "C", color: "#1a4fc4", type: "Mint", amount: "$1,124.66", units: "(7.98)", tx: "0x053c...6c50" },
    { date: "November 09, 2025", dtf: "CF Large Cap Index", letter: "C", color: "#1a4fc4", type: "Redeem", amount: "$702.91", units: "(4.99)", tx: "0x0c19...84ca" },
  ]
  return (
    <div style={{ padding: "0 40px", marginBottom: 32 }}>
      <SectionHeading
        icon={<ArrowDownUp size={20} color="#0151af" />}
        title="Transactions"
        subtitle="Your history of your recent transactions"
      />
      <TableCard>
        <THead>
          <THCell width={200}>Date</THCell>
          <THCell width={320}>DTF</THCell>
          <THCell width={200}>Type</THCell>
          <THCell width={200}>Amount</THCell>
          <THCell flex={1}>View</THCell>
        </THead>
        {rows.map((row, i) => (
          <TRow key={i} bordered={i < rows.length - 1}>
            <Cell width={200}>
              <span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 300, color: "#0a0d10" }}>{row.date}</span>
            </Cell>
            <Cell width={320}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <TokenBubble letter={row.letter} color={row.color} />
                <span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, color: "#0a0d10" }}>{row.dtf}</span>
              </div>
            </Cell>
            <Cell width={200}>
              <span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 300, color: "#0a0d10" }}>{row.type}</span>
            </Cell>
            <Cell width={200}>
              <span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 300, color: "#0a0d10" }}>
                {row.amount} <span style={{ color: "#666" }}>{row.units}</span>
              </span>
            </Cell>
            <Cell flex={1}>
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

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function PortfolioClient() {
  return (
    <div style={{ background: "#FEFCFB", minHeight: "100vh", paddingBottom: 80 }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>

        {/* Hero */}
        <div style={{ display: "flex", gap: 40, alignItems: "flex-start", padding: "32px 40px 48px" }}>
          <PortfolioChart />
          <div style={{ width: 300, flexShrink: 0, display: "flex", flexDirection: "column", gap: 16 }}>
            <BreakdownCard />
            <RewardsCard />
          </div>
        </div>

        {/* Sections */}
        <DTFPositionsSection />
        <AvailableRewardsSection />
        <StakedPositionsSection />
        <VoteLockedSection />
        <ActiveProposalsSection />
        <VotingPowerSection />
        <RSRSection />
        <TransactionsSection />
      </div>
    </div>
  )
}
