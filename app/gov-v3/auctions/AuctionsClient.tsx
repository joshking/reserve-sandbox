"use client"

import { BarChart2, Activity, TrendingUp } from "lucide-react"

const FONT = "'TWK Lausanne', system-ui, sans-serif"
const BLUE = "#0151af"

// ── Data ──────────────────────────────────────────────────────────────────────

const historicalRebalances = [
  {
    title: "CMC20 February 2026 Rebalance",
    status: "Completed",
    accuracy: "100%",
    auctions: 7,
    traded: "$22,312",
    priceImpact: "+0.01%",
    proposed: "Sat Jan 31, 08:25 pm",
    proposedBy: "0x36af...3913",
  },
  {
    title: "CMC20 January 2026 Rebalance",
    status: "Completed",
    accuracy: "100%",
    auctions: 3,
    traded: "$12,812",
    priceImpact: "-0.67%",
    proposed: "Thu Jan 01, 02:09 pm",
    proposedBy: "0x03d0...da99",
  },
  {
    title: "CMC20 December 2025 Rebalance",
    status: "Completed",
    accuracy: "100%",
    auctions: 3,
    traded: "$15,593",
    priceImpact: "-0.1%",
    proposed: "Sun Nov 30, 05:39 pm",
    proposedBy: "0xb209...5015",
  },
  {
    title: "CMC20 November 2025 Rebalance",
    status: "Completed",
    accuracy: "100%",
    auctions: 5,
    traded: "$18,240",
    priceImpact: "+0.03%",
    proposed: "Fri Oct 31, 11:14 am",
    proposedBy: "0x36af...3913",
  },
  {
    title: "CMC20 October 2025 Rebalance",
    status: "Completed",
    accuracy: "100%",
    auctions: 4,
    traded: "$9,875",
    priceImpact: "-0.22%",
    proposed: "Tue Sep 30, 03:47 pm",
    proposedBy: "0x03d0...da99",
  },
]

// ── Sub-components ─────────────────────────────────────────────────────────────

function SectionHeader({
  label,
  count,
  blue,
}: {
  label: string
  count: number
  blue?: boolean
}) {
  const color = blue ? BLUE : "#0a0d10"
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <span style={{ fontSize: "18px", fontWeight: blue ? 500 : 600, color, fontFamily: FONT }}>
        {label}
      </span>
      <span style={{ fontSize: "18px", fontWeight: 600, color, fontFamily: FONT }}>
        {count}
      </span>
    </div>
  )
}

function StatColumn({
  Icon,
  label,
  value,
  valueColor,
}: {
  Icon: React.ElementType
  label: string
  value: string
  valueColor?: string
}) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px", padding: "14px 18px" }}>
      <Icon size={15} color="#999" strokeWidth={1.5} />
      <span style={{ fontSize: "12px", fontWeight: 300, color: "#999", fontFamily: FONT, marginTop: "2px" }}>
        {label}
      </span>
      <span style={{ fontSize: "16px", fontWeight: 500, color: valueColor ?? "#0a0d10", fontFamily: FONT }}>
        {value}
      </span>
    </div>
  )
}

function RebalanceCard({ r }: { r: typeof historicalRebalances[number] }) {
  const impactColor = r.priceImpact.startsWith("+") ? "#16a34a" : "#dc2626"

  return (
    <div style={{
      background: "white",
      borderRadius: "18px",
      border: "1px solid #f0ece6",
      overflow: "hidden",
    }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "18px 20px 14px",
      }}>
        <span style={{ fontSize: "18px", fontWeight: 600, color: "#0a0d10", fontFamily: FONT }}>
          {r.title}
        </span>
        <span style={{ fontSize: "15px", fontWeight: 300, color: "#999", fontFamily: FONT }}>
          {r.status}
        </span>
      </div>

      <div style={{ height: "1px", background: "#f0ece6" }} />

      <div style={{ display: "flex" }}>
        <StatColumn
          Icon={BarChart2}
          label="Rebalance accuracy"
          value={r.accuracy}
        />
        <div style={{ width: "1px", background: "#f0ece6", alignSelf: "stretch" }} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px", padding: "14px 18px" }}>
          <Activity size={15} color="#999" strokeWidth={1.5} />
          <span style={{ fontSize: "12px", fontWeight: 300, color: "#999", fontFamily: FONT, marginTop: "2px" }}>
            {r.auctions} Auctions run
          </span>
          <span style={{ fontSize: "16px", fontWeight: 500, color: "#0a0d10", fontFamily: FONT }}>
            {r.traded} Traded
          </span>
        </div>
        <div style={{ width: "1px", background: "#f0ece6", alignSelf: "stretch" }} />
        <StatColumn
          Icon={TrendingUp}
          label="Total price impact"
          value={r.priceImpact}
          valueColor={impactColor}
        />
      </div>

      <div style={{ height: "1px", background: "#f0ece6" }} />

      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 20px",
      }}>
        <span style={{ fontSize: "13px", fontWeight: 300, color: "#555", fontFamily: FONT }}>
          Proposed:{" "}
          <span style={{ textDecoration: "underline", textUnderlineOffset: "2px", cursor: "pointer" }}>
            {r.proposed}
          </span>
        </span>
        <span style={{ fontSize: "13px", fontWeight: 300, color: "#555", fontFamily: FONT }}>
          Proposed by: {r.proposedBy}
        </span>
      </div>
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function AuctionsClient() {
  return (
    <div style={{
      flex: 1,
      background: "#ede4d3",
      borderRadius: "20px",
      padding: "28px 24px",
      display: "flex",
      flexDirection: "column",
      gap: "20px",
      minWidth: 0,
    }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <SectionHeader label="Active Rebalances" count={0} blue />
        <div style={{
          background: "white",
          borderRadius: "18px",
          padding: "48px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <span style={{ fontSize: "15px", fontWeight: 300, color: "#aaa", fontFamily: FONT }}>
            No rebalances found
          </span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <SectionHeader label="Historical Rebalances" count={historicalRebalances.length} />
        {historicalRebalances.map((r) => (
          <RebalanceCard key={r.title} r={r} />
        ))}
      </div>
    </div>
  )
}
