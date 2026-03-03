"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Copy, ArrowUpRight, Calendar, Coins, ChevronRight,
  ChevronDown, LayoutGrid, Clock, Users, Hash, Percent,
  Timer, CheckCircle2, ArrowRight, Target, Landmark, ArrowLeftRight,
} from "lucide-react"

// ── Data ──────────────────────────────────────────────────────────────────────

const tokenHoldings = [
  { name: "Virtuals",              symbol: "$VIRTUALS", weight: "60.67", color: "#6b4fbb" },
  { name: "Avalanche (Universal)", symbol: "$AIXBT",    weight: "12.58", color: "#3b82f6" },
  { name: "Freysa AI",             symbol: "$AIXBT",    weight: "10.04", color: "#8b5cf6" },
  { name: "Avalanche (Universal)", symbol: "$GAME",     weight: "3.83",  color: "#14b8a6" },
  { name: "Cookie DAO",            symbol: "$COOKIES",  weight: "3.29",  color: "#3b82f6" },
  { name: "Rei",                   symbol: "$REI",      weight: "2.46",  color: "#9ca3af" },
  { name: "Toshi",                 symbol: "$TOSHI",    weight: "2.18",  color: "#60a5fa" },
  { name: "VaderAI",               symbol: "$VADER",    weight: "1.99",  color: "#1e3a8a" },
]

const govParams = [
  { label: "Voting Delay",       value: "2 Days", Icon: Clock,    desc: null },
  { label: "Voting Period",      value: "2 Days", Icon: Calendar, desc: null },
  { label: "Proposal Threshold", value: "0.01%",  Icon: Percent,  desc: "[Defined as in the actual token amount needed and what it is]" },
  { label: "Voting Quorum",      value: "10%",    Icon: Users,    desc: "[Defined as in the actual token amount needed and what it is]" },
  { label: "Execution Delay",    value: "2 Days", Icon: Timer,    desc: null },
]

const feeRows = [
  { label: "Fixed Platform Share", value: "50.00%", addr: null,            Icon: LayoutGrid },
  { label: "Governance Share",     value: "20.00%", addr: null,            Icon: Landmark },
  { label: "Creator Share",        value: "20.00%", addr: "0x4ed4...efed", Icon: Users },
  { label: "Other Recipient 1",    value: "5.00%",  addr: "0x4ed4...efed", Icon: Hash },
  { label: "Other Recipient 2",    value: "5.00%",  addr: "0x4ed4...efed", Icon: Hash },
]

// Chart SVG — 660×260 viewport, upward-trending line
const CHART_W = 660
const CHART_H = 260
const rawPoints: [number, number][] = [
  [0,220],[22,205],[44,215],[66,200],[88,210],
  [110,195],[132,185],[154,198],[176,175],[198,160],
  [220,170],[242,155],[264,145],[286,160],[308,140],
  [330,125],[352,138],[374,118],[396,105],[418,118],
  [440,98],[462,82],[484,95],[506,70],[528,52],
  [550,68],[572,48],[594,32],[616,45],[638,22],[660,10],
]
const pointsStr = rawPoints.map(([x,y]) => `${x},${y}`).join(" ")
const areaPath  = `M 0,${CHART_H} L ${rawPoints.map(([x,y]) => `${x},${y}`).join(" L ")} L ${CHART_W},${CHART_H} Z`

// ── Helpers ───────────────────────────────────────────────────────────────────

function SectionIconCircle({ Icon }: { Icon: React.ElementType }) {
  return (
    <div style={{
      width: 40, height: 40, borderRadius: "50%",
      border: "1px solid #e5e5e5",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
    }}>
      <Icon size={18} color="#0a0d10" />
    </div>
  )
}

function IconCircleBtn({ Icon, size = 28 }: { Icon: React.ElementType; size?: number }) {
  return (
    <button style={{
      width: size, height: size, borderRadius: "50%",
      border: "1px solid #e5e5e5", background: "white",
      display: "flex", alignItems: "center", justifyContent: "center",
      cursor: "pointer", padding: 0, flexShrink: 0,
    }}>
      <Icon size={size * 0.5} color="#0a0d10" />
    </button>
  )
}

// ── Graph Card ────────────────────────────────────────────────────────────────

function GraphCard() {
  const [timeRange, setTimeRange] = useState("1W")
  const [metric, setMetric]       = useState("Supply")

  return (
    <div style={{ background: "#0a0d10", borderRadius: "20px", overflow: "hidden" }}>
      {/* Dark chart area */}
      <div style={{ padding: "24px 24px 16px" }}>
        {/* Top row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
          <span style={{ fontSize: "16px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 300, color: "rgba(255,255,255,0.7)" }}>
            Total Supply
          </span>
          <div style={{
            display: "flex", alignItems: "center", gap: "8px",
            background: "rgba(255,255,255,0.12)", borderRadius: "20px",
            padding: "6px 14px", cursor: "pointer",
          }}>
            <span style={{ fontSize: "13px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 300, color: "rgba(255,255,255,0.8)" }}>
              $100.45K (100.25K $BAIX)
            </span>
            <ChevronRight size={14} color="rgba(255,255,255,0.5)" />
          </div>
        </div>

        {/* Big number */}
        <div style={{ display: "flex", alignItems: "baseline", marginBottom: "4px" }}>
          <span style={{ fontSize: "42px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 500, color: "white", lineHeight: 1.1 }}>
            10,000,000
          </span>
          <span style={{ fontSize: "42px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 500, color: "#4a9eff", lineHeight: 1.1 }}>
            .34
          </span>
        </div>

        {/* Change */}
        <div style={{ marginBottom: "20px" }}>
          <span style={{ fontSize: "14px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 300, color: "rgba(255,255,255,0.5)" }}>
            7 day change:{" "}
          </span>
          <span style={{ fontSize: "14px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 500, color: "#22c55e" }}>
            +45.56%
          </span>
        </div>

        {/* Chart SVG */}
        <div style={{ position: "relative", height: "190px", margin: "0 -8px" }}>
          <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
            <defs>
              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(74,158,255,0.25)" />
                <stop offset="100%" stopColor="rgba(74,158,255,0)" />
              </linearGradient>
            </defs>
            <path d={areaPath} fill="url(#chartGrad)" />
            <polyline points={pointsStr} fill="none" stroke="white" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
          </svg>
        </div>

        {/* Time range + metric tabs */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "12px" }}>
          <div style={{ display: "flex", gap: "2px" }}>
            {["1D", "1W", "1M", "All"].map((t) => (
              <button key={t} onClick={() => setTimeRange(t)} style={{
                padding: "5px 12px", borderRadius: "20px",
                background: timeRange === t ? "rgba(255,255,255,0.18)" : "transparent",
                border: "none", cursor: "pointer",
                fontSize: "14px", fontFamily: "'TWK Lausanne', sans-serif",
                fontWeight: timeRange === t ? 500 : 300, color: "white",
              }}>
                {t}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: "2px" }}>
            {["Price", "Market Cap", "Supply"].map((m) => (
              <button key={m} onClick={() => setMetric(m)} style={{
                padding: "5px 12px", borderRadius: "20px",
                background: metric === m ? "rgba(255,255,255,0.18)" : "transparent",
                border: "none", cursor: "pointer",
                fontSize: "14px", fontFamily: "'TWK Lausanne', sans-serif",
                fontWeight: metric === m ? 500 : 300, color: "white",
              }}>
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* White info card */}
      <div style={{ margin: "0 8px 8px", background: "white", borderRadius: "16px", padding: "16px 20px" }}>
        {/* Address row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%", background: "#0a0d10",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <span style={{ color: "white", fontSize: "11px", fontWeight: 700, fontFamily: "'TWK Lausanne', sans-serif" }}>B</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "14px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 300, color: "#0151af" }}>
              0x4ed4...efed
            </span>
            <button style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}>
              <Copy size={14} color="#999" />
            </button>
            <button style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}>
              <ArrowUpRight size={14} color="#999" />
            </button>
          </div>
        </div>

        {/* DTF name */}
        <div style={{ marginBottom: "14px" }}>
          <div style={{ fontSize: "14px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 300, color: "#666", marginBottom: "4px" }}>
            $BGCI
          </div>
          <div style={{ fontSize: "30px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 500, color: "#0a0d10", lineHeight: 1.2 }}>
            Bloomberg Galaxy Crypto Index
          </div>
        </div>

        {/* Creator row */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#22c55e", flexShrink: 0 }} />
          <span style={{ fontSize: "14px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 300, color: "#666" }}>
            Creator:
          </span>
          <span style={{ fontSize: "14px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 700, color: "#0a0d10" }}>
            Re7 Labs
          </span>
          <CheckCircle2 size={14} color="#0151af" style={{ flexShrink: 0 }} />
          <button style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}>
            <ArrowUpRight size={14} color="#999" />
          </button>
        </div>
      </div>
    </div>
  )
}

// ── About Card ────────────────────────────────────────────────────────────────

function AboutCard() {
  return (
    <div style={{ background: "white", borderRadius: "20px", overflow: "hidden" }}>
      {/* Section header */}
      <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #e5e5e5" }}>
        <SectionIconCircle Icon={LayoutGrid} />
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <Coins size={14} color="#666" />
          <span style={{ fontSize: "14px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 300, color: "#666" }}>
            TVL Fee:{" "}
            <strong style={{ fontWeight: 700, color: "#0a0d10" }}>2%</strong>
          </span>
        </div>
      </div>

      <div style={{ padding: "24px 24px 16px" }}>
        <h2 style={{ fontSize: "28px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 500, color: "#0a0d10", margin: "0 0 14px", lineHeight: 1.2 }}>
          About this DTF
        </h2>
        <p style={{ fontSize: "16px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 300, color: "#0a0d10", lineHeight: 1.65, margin: "0 0 20px" }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate.
        </p>

        <h3 style={{ fontSize: "16px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 700, color: "#0a0d10", margin: "0 0 8px" }}>
          Onchain Mandate
        </h3>
        <p style={{ fontSize: "16px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 300, color: "#0a0d10", lineHeight: 1.65, margin: "0 0 24px" }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>

        {/* Social links + Tags */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
          <div style={{ display: "flex", gap: "8px" }}>
            {[{ label: "Website" }, { label: "Twitter" }, { label: "Telegram" }].map(({ label }) => (
              <button key={label} style={{
                display: "flex", alignItems: "center", gap: "6px",
                padding: "6px 14px", borderRadius: "999px",
                border: "1px solid #e5e5e5", background: "white",
                cursor: "pointer",
                fontSize: "14px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 300, color: "#0a0d10",
              }}>
                {label}
              </button>
            ))}
          </div>
          <span style={{ fontSize: "14px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 300, color: "#666" }}>
            Tags: <span style={{ color: "#0a0d10" }}>AI, Virtuals, Base</span>
          </span>
        </div>

        {/* Token table */}
        <div>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", padding: "10px 0", borderTop: "1px solid #e5e5e5", borderBottom: "1px solid #e5e5e5" }}>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: "14px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 300, color: "#666" }}>Token</span>
            </div>
            <div style={{ width: 130 }}>
              <span style={{ fontSize: "14px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 300, color: "#666" }}>Symbol</span>
            </div>
            <div style={{ width: 80 }}>
              <span style={{ fontSize: "14px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 300, color: "#666" }}>Weight</span>
            </div>
            <div style={{ width: 120, textAlign: "right" }}>
              <span style={{ fontSize: "14px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 300, color: "#666" }}>Bridge/Basescan</span>
            </div>
          </div>

          {tokenHoldings.map((token, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center",
              padding: "14px 0",
              borderBottom: i < tokenHoldings.length - 1 ? "1px solid #e5e5e5" : "none",
            }}>
              <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: token.color, flexShrink: 0 }} />
                <span style={{ fontSize: "15px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 300, color: "#0a0d10" }}>
                  {token.name}
                </span>
              </div>
              <div style={{ width: 130 }}>
                <span style={{ fontSize: "14px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 300, color: "#0a0d10" }}>
                  {token.symbol}
                </span>
              </div>
              <div style={{ width: 80 }}>
                <span style={{ fontSize: "14px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 500, color: "#0151af" }}>
                  {token.weight}%
                </span>
              </div>
              <div style={{ width: 120, display: "flex", justifyContent: "flex-end" }}>
                <IconCircleBtn Icon={ArrowUpRight} size={30} />
              </div>
            </div>
          ))}
        </div>

        {/* View all button */}
        <button style={{
          width: "100%", padding: "14px", marginTop: "8px",
          borderRadius: "12px", border: "1px solid #e5e5e5", background: "white",
          display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
          cursor: "pointer",
          fontSize: "14px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 500, color: "#0a0d10",
        }}>
          <span>View all 10 assets</span>
          <ChevronDown size={16} color="#0a0d10" />
        </button>
      </div>
    </div>
  )
}

// ── Payouts Card ──────────────────────────────────────────────────────────────

function PayoutsCard() {
  return (
    <div style={{ background: "white", borderRadius: "20px", overflow: "hidden" }}>
      <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #e5e5e5" }}>
        <SectionIconCircle Icon={Coins} />
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <Calendar size={14} color="#666" />
          <span style={{ fontSize: "14px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 300, color: "#666" }}>
            Campaign ends: <strong style={{ fontWeight: 500, color: "#0a0d10" }}>April 1</strong>
          </span>
        </div>
      </div>

      <div style={{ padding: "24px" }}>
        <h2 style={{ fontSize: "28px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 700, color: "#92400e", margin: "0 0 12px", lineHeight: 1.2 }}>
          $240.23 in Daily Payouts
        </h2>
        <p style={{ fontSize: "16px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 300, color: "#0a0d10", lineHeight: 1.65, margin: "0 0 16px" }}>
          Earn rewards in Based ETH (bsdETH) by simply holding the Base AI Index and claiming your rewards in the Merkl UI.
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px" }}>
          <span style={{ fontSize: "14px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 300, color: "#666" }}>
            Current APR:
          </span>
          <span style={{ fontSize: "14px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 700, color: "#92400e" }}>
            340.5%
          </span>
        </div>
        <button style={{
          width: "100%", padding: "16px", borderRadius: "12px",
          border: "none", background: "#f59e0b",
          display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
          cursor: "pointer",
          fontSize: "16px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 500, color: "#0a0d10",
        }}>
          <Coins size={16} />
          <span>View Merkl Campaign</span>
        </button>
      </div>
    </div>
  )
}

// ── Governance Card ───────────────────────────────────────────────────────────

function GovernanceCard() {
  return (
    <div style={{ background: "white", borderRadius: "20px", overflow: "hidden" }}>
      <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #e5e5e5" }}>
        <SectionIconCircle Icon={Target} />
        <button style={{
          display: "flex", alignItems: "center", gap: "6px",
          background: "none", border: "none", cursor: "pointer",
        }}>
          <span style={{ fontSize: "14px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 300, color: "#0a0d10" }}>
            View non-basket governance settings
          </span>
          <ChevronRight size={14} color="#0a0d10" />
        </button>
      </div>

      <div style={{ padding: "24px" }}>
        <h2 style={{ fontSize: "28px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 500, color: "#0a0d10", margin: "0 0 16px", lineHeight: 1.2 }}>
          Basket Governance
        </h2>
        <p style={{ fontSize: "16px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 300, color: "#0a0d10", lineHeight: 1.65, margin: "0 0 24px" }}>
          $AGX is governed by the $VIRTUALS token. Virtuals holders must vote-lock their tokens to become a governor of the $AGX. Governors can propose changes to the basket and vote on proposal by other governors. In exchange for locking their tokens and participating in governance, governors earn a portion of the TVL fee charged by the DTF.
        </p>

        {/* Lock CTA */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 20px", background: "#0151af", borderRadius: "12px",
          marginBottom: "24px", cursor: "pointer",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Hash size={20} color="white" />
            <span style={{ fontSize: "16px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 500, color: "white" }}>
              Lock $RSR to Govern &amp; Earn
            </span>
          </div>
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            background: "rgba(255,255,255,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <ArrowRight size={16} color="white" />
          </div>
        </div>

        {/* Gov params */}
        {govParams.map(({ label, value, Icon, desc }, i) => (
          <div key={label} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "16px 0",
            borderBottom: i < govParams.length - 1 ? "1px solid #e5e5e5" : "none",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <SectionIconCircle Icon={Icon} />
              <div>
                <div style={{ fontSize: "14px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 300, color: "#666", marginBottom: "2px" }}>
                  {label}
                </div>
                <div style={{ fontSize: "16px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 700, color: "#0a0d10" }}>
                  {value}
                </div>
              </div>
            </div>
            {desc && (
              <span style={{ fontSize: "13px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 300, color: "#666", maxWidth: "260px", textAlign: "right" }}>
                {desc}
              </span>
            )}
          </div>
        ))}

        {/* Footer link */}
        <button style={{
          width: "100%", padding: "14px", marginTop: "16px",
          borderRadius: "12px", border: "1px solid #e5e5e5", background: "white",
          display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
          cursor: "pointer",
          fontSize: "14px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 500, color: "#0a0d10",
        }}>
          <span>View non-basket governance settings</span>
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  )
}

// ── Fees Card ─────────────────────────────────────────────────────────────────

function FeesCard() {
  return (
    <div style={{ background: "white", borderRadius: "20px", overflow: "hidden" }}>
      <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #e5e5e5" }}>
        <SectionIconCircle Icon={Percent} />
        <IconCircleBtn Icon={ChevronDown} />
      </div>

      <div style={{ padding: "24px" }}>
        <h2 style={{ fontSize: "28px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 500, color: "#0a0d10", margin: "0 0 12px", lineHeight: 1.2 }}>
          Fees &amp; Revenue Distribution
        </h2>
        <p style={{ fontSize: "16px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 300, color: "#0a0d10", lineHeight: 1.65, margin: "0 0 24px" }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>

        {/* 2-column fee highlight cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "0" }}>
          {[
            { label: "Annualized TVL Fee", value: "2.45%", Icon: LayoutGrid },
            { label: "Minting Fee",        value: "1.50%", Icon: Clock },
          ].map(({ label, value, Icon }) => (
            <div key={label} style={{
              padding: "16px", border: "1px solid #e5e5e5", borderRadius: "12px",
              display: "flex", alignItems: "center", gap: "12px",
            }}>
              <SectionIconCircle Icon={Icon} />
              <div>
                <div style={{ fontSize: "13px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 300, color: "#666", marginBottom: "2px" }}>
                  {label}
                </div>
                <div style={{ fontSize: "20px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 700, color: "#0a0d10" }}>
                  {value}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Fee distribution rows */}
        {feeRows.map(({ label, value, addr, Icon }) => (
          <div key={label} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "16px 0", borderBottom: "1px solid #e5e5e5",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <SectionIconCircle Icon={Icon} />
              <div>
                <div style={{ fontSize: "13px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 300, color: "#666", marginBottom: "2px" }}>
                  {label}
                </div>
                <div style={{ fontSize: "20px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 700, color: "#0a0d10" }}>
                  {value}
                </div>
              </div>
            </div>
            {addr && (
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "14px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 300, color: "#666" }}>
                  {addr}
                </span>
                <button style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}>
                  <Copy size={14} color="#999" />
                </button>
                <button style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}>
                  <ArrowUpRight size={14} color="#999" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Folio Graphic ─────────────────────────────────────────────────────────────

function FolioGraphic() {
  return (
    <div style={{
      background: "#0a0d10", borderRadius: "24px",
      height: "380px", marginBottom: "8px",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden",
    }}>
      {/* Top gradient lens */}
      <div style={{
        position: "absolute", top: "24px", left: "24px", right: "24px", height: "52px",
        borderRadius: "12px",
        background: "linear-gradient(90deg, #2d5a3d 0%, #4a7c3f 15%, #8ab040 30%, #c8b84a 50%, #8ab040 70%, #4a7c3f 85%, #2d5a3d 100%)",
        opacity: 0.75,
        transform: "perspective(300px) rotateX(-12deg) scaleY(0.6)",
      }} />

      {/* Bottom gradient lens */}
      <div style={{
        position: "absolute", bottom: "24px", left: "24px", right: "24px", height: "52px",
        borderRadius: "12px",
        background: "linear-gradient(90deg, #2d5a3d 0%, #4a7c3f 15%, #8ab040 30%, #c8b84a 50%, #8ab040 70%, #4a7c3f 85%, #2d5a3d 100%)",
        opacity: 0.75,
        transform: "perspective(300px) rotateX(12deg) scaleY(0.6)",
      }} />

      {/* Text */}
      <div style={{ textAlign: "center", zIndex: 1 }}>
        <div style={{ fontSize: "40px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 700, color: "white", lineHeight: 1.15 }}>
          Bloomberg
        </div>
        <div style={{ fontSize: "40px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 300, color: "rgba(255,255,255,0.65)", lineHeight: 1.15 }}>
          Indices
        </div>
      </div>
    </div>
  )
}

// ── Swap Card ─────────────────────────────────────────────────────────────────

function SwapCard() {
  return (
    <div style={{ background: "#f2f2f2", borderRadius: "24px", padding: "4px" }}>
      <div style={{ background: "white", borderRadius: "20px", padding: "16px 20px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {/* Stacked token icons */}
            <div style={{ position: "relative", width: 58, height: 28, flexShrink: 0 }}>
              <div style={{ position: "absolute", left: 0, width: 28, height: 28, borderRadius: "50%", background: "#26a17b", border: "2px solid white", zIndex: 3 }} />
              <div style={{ position: "absolute", left: 15, width: 28, height: 28, borderRadius: "50%", background: "#627eea", border: "2px solid white", zIndex: 2 }} />
              <div style={{ position: "absolute", left: 30, width: 28, height: 28, borderRadius: "50%", background: "#0a0d10", border: "2px solid white", zIndex: 1 }} />
            </div>
            <ArrowLeftRight size={16} color="#999" />
            <div style={{
              width: 28, height: 28, borderRadius: "50%", background: "#0a0d10",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ color: "white", fontSize: "9px", fontWeight: 700, fontFamily: "'TWK Lausanne', sans-serif" }}>B</span>
            </div>
          </div>

          {/* APR badge */}
          <div style={{
            display: "flex", alignItems: "center", gap: "6px",
            background: "#f59e0b", borderRadius: "999px",
            padding: "6px 12px", cursor: "pointer",
          }}>
            <Coins size={13} color="#0a0d10" />
            <span style={{ fontSize: "13px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 500, color: "#0a0d10" }}>
              340.5% APR
            </span>
            <ArrowUpRight size={13} color="#0a0d10" />
          </div>
        </div>

        {/* Title */}
        <h3 style={{
          fontSize: "22px", fontFamily: "'TWK Lausanne', sans-serif",
          fontWeight: 500, color: "#0151af", margin: "0 0 16px", lineHeight: 1.2,
        }}>
          Buy/Sell $BGCI Onchain
        </h3>

        {/* Buttons */}
        <button style={{
          width: "100%", padding: "15px", borderRadius: "12px",
          border: "none", background: "#0151af", cursor: "pointer", marginBottom: "8px",
          fontSize: "16px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 500, color: "white",
        }}>
          Buy
        </button>
        <button style={{
          width: "100%", padding: "15px", borderRadius: "12px",
          border: "2px solid #e5e5e5", background: "white", cursor: "pointer",
          fontSize: "16px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 500, color: "#0151af",
        }}>
          Sell
        </button>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function DtfDetailClient() {
  return (
    <>
      {/* Left column */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
        <div style={{ padding: "8px 0 4px" }}>
          <Link href="/gov-v2" style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            fontSize: "14px", fontFamily: "'TWK Lausanne', sans-serif",
            fontWeight: 300, color: "#666", textDecoration: "none",
          }}>
            ← Back to Earn
          </Link>
        </div>
        <GraphCard />
        <AboutCard />
        <PayoutsCard />
        <GovernanceCard />
        <FeesCard />
      </div>

      {/* Right column */}
      <div style={{ width: 458, flexShrink: 0, position: "sticky", top: "16px", alignSelf: "flex-start", paddingTop: "44px" }}>
        <FolioGraphic />
        <SwapCard />
      </div>
    </>
  )
}
