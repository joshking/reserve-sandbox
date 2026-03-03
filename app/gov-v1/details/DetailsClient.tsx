"use client"

import { Copy, ExternalLink, Info, DollarSign, Hash, FileText, Eye, ShieldCheck, Sparkles, ImageIcon } from "lucide-react"
import DecorativeTable from "@/components/DecorativeTable"

const FONT = "'TWK Lausanne', system-ui, sans-serif"
const BLUE = "#0151af"
const BORDER = "#f0ece6"

// ── Primitives ─────────────────────────────────────────────────────────────────

function RoundIcon({ children, filled }: { children: React.ReactNode; filled?: boolean }) {
  return (
    <div style={{
      width: 38, height: 38, borderRadius: "50%", flexShrink: 0,
      border: filled ? "none" : "1.5px solid #d5cfc8",
      background: filled ? "#0151af" : "transparent",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      {children}
    </div>
  )
}

function IconActions({ hasCopy, hasLink }: { hasCopy?: boolean; hasLink?: boolean }) {
  return (
    <div style={{ display: "flex", gap: "10px", flexShrink: 0, alignSelf: "center" }}>
      {hasCopy && (
        <button style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}>
          <Copy size={15} color="#bbb" />
        </button>
      )}
      {hasLink && (
        <button style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}>
          <ExternalLink size={15} color="#bbb" />
        </button>
      )}
    </div>
  )
}

// ── Detail row ─────────────────────────────────────────────────────────────────

function Row({
  icon,
  label,
  value,
  hasCopy,
  hasLink,
  filled,
  first,
  paragraph,
}: {
  icon: React.ReactNode
  label: string
  value: React.ReactNode
  hasCopy?: boolean
  hasLink?: boolean
  filled?: boolean
  first?: boolean
  paragraph?: boolean
}) {
  return (
    <div style={{
      display: "flex",
      alignItems: paragraph ? "flex-start" : "center",
      gap: "14px",
      padding: "16px 20px",
      borderTop: first ? "none" : `1px solid ${BORDER}`,
    }}>
      <div style={{ paddingTop: paragraph ? "2px" : 0 }}>
        <RoundIcon filled={filled}>{icon}</RoundIcon>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: "12px", fontWeight: 300, color: "#999", fontFamily: FONT, marginBottom: "3px" }}>
          {label}
        </div>
        <div style={{
          fontSize: paragraph ? "14px" : "16px",
          fontWeight: paragraph ? 300 : 600,
          color: "#0a0d10",
          fontFamily: FONT,
          lineHeight: paragraph ? 1.65 : 1.3,
        }}>
          {value}
        </div>
      </div>
      {(hasCopy || hasLink) && <IconActions hasCopy={hasCopy} hasLink={hasLink} />}
    </div>
  )
}

// ── Role row ───────────────────────────────────────────────────────────────────

function RoleRow({ Icon, role, address, first }: {
  Icon: React.ElementType
  role: string
  address: string
  first?: boolean
}) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "14px",
      padding: "14px 20px",
      borderTop: first ? "none" : `1px solid ${BORDER}`,
    }}>
      <RoundIcon><Icon size={15} color="#666" strokeWidth={1.5} /></RoundIcon>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: "12px", fontWeight: 300, color: "#999", fontFamily: FONT, marginBottom: "3px" }}>
          {role}
        </div>
        <div style={{ fontSize: "15px", fontWeight: 600, color: "#0a0d10", fontFamily: FONT }}>
          {address}
        </div>
      </div>
      <IconActions hasCopy hasLink />
    </div>
  )
}

// ── Data ───────────────────────────────────────────────────────────────────────

const MANDATE = `The Venionaire VLONE DTF is designed to track the Venionaire Layer-1 Select Index (VLONE), which measures the performance of leading Layer-1 blockchain protocols. These protocols constitute the foundational infrastructure of the Web3 ecosystem. The VLONE DTF offers investors diversified exposure to the performance and growth potential of premier Layer-1 assets. The index employs comprehensive qualitative and quantitative evaluation to select its constituents. Selection criteria include exchange eligibility, liquidity metrics, trading volume thresholds, and market capitalization requirements. Additionally, on-chain parameters are integrated to capture protocol-specific quality assessments through the VLONE Quality Assessment Framework. Constituents are weighted based on liquidity, market capitalization, price performance, and sector-specific quality criteria, with a 15% maximum allocation per asset to ensure diversification. The index undergoes monthly rebalancing to maintain optimal diversification and reflect evolving market dynamics.`

const roles = [
  { Icon: ShieldCheck, role: "Guardian",         address: "0x82a2...98f4" },
  { Icon: ShieldCheck, role: "Guardian",         address: "0x7f7b...fe47" },
  { Icon: Sparkles,    role: "Auction Launcher", address: "0x10C7...65e4" },
  { Icon: Sparkles,    role: "Auction Launcher", address: "0x7DaA...a868" },
  { Icon: ImageIcon,   role: "Brand Manager",    address: "0x17A7...36AA" },
  { Icon: ImageIcon,   role: "Brand Manager",    address: "0x7DaA...a868" },
]

// ── Page ───────────────────────────────────────────────────────────────────────

export default function DetailsClient() {
  return (
    <div style={{ flex: 1, display: "flex", gap: "16px", minWidth: 0 }}>

      {/* Left column */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "16px", minWidth: 0 }}>

        <DecorativeTable title="Basics">
          <Row first icon={<Info size={15} color="#666" strokeWidth={1.5} />}
            label="Name" value="Reserve Venionaire L1 Select DTF" />
          <Row icon={<DollarSign size={15} color="#666" strokeWidth={1.5} />}
            label="Ticker" value="VLONE" />
          <Row icon={<Hash size={15} color="#666" strokeWidth={1.5} />}
            label="Address" value="0xe00C...E3E4" hasCopy hasLink />
          <Row icon={<FileText size={15} color="#666" strokeWidth={1.5} />}
            label="Mandate" value={MANDATE} paragraph />
          <Row icon={<Hash size={15} color="#666" strokeWidth={1.5} />}
            label="Deployer" value="0x5f1c...70C7" hasCopy hasLink />
          <Row icon={<Hash size={15} color="#666" strokeWidth={1.5} />}
            label="Version" value="4.0.0" />
          <Row icon={<Eye size={15} color="#666" strokeWidth={1.5} />}
            label="Weight Control" value="Enabled" />
        </DecorativeTable>

        <DecorativeTable title="Governance Token">
          <Row first icon={<Hash size={15} color="#666" strokeWidth={1.5} />}
            label="Vote-Lock DAO Token" value="vlRSR-VLONE" hasCopy hasLink />
          <Row icon={<Hash size={15} color="white" strokeWidth={1.5} />}
            filled label="Underlying Token" value="RSR" hasCopy hasLink />
        </DecorativeTable>

      </div>

      {/* Right column */}
      <div style={{ width: "360px", flexShrink: 0, display: "flex", flexDirection: "column", gap: "16px" }}>

        <DecorativeTable title="Roles">
          {roles.map((r, i) => (
            <RoleRow key={i} Icon={r.Icon} role={r.role} address={r.address} first={i === 0} />
          ))}
        </DecorativeTable>

        <DecorativeTable title="Distribute Fees">
          <div style={{ padding: "20px" }}>
            <p style={{
              fontSize: "14px", fontWeight: 300, color: "#555",
              fontFamily: FONT, margin: "0 0 18px", lineHeight: 1.65,
            }}>
              Distribute accumulated fees to the recipients. Anyone can trigger this transaction.
            </p>
            <div style={{ fontSize: "12px", fontWeight: 300, color: "#999", fontFamily: FONT, marginBottom: "4px" }}>
              Pending distribution
            </div>
            <div style={{ fontSize: "18px", fontWeight: 600, color: "#0a0d10", fontFamily: FONT, marginBottom: "18px" }}>
              0.24 $VLONE{" "}
              <span style={{ fontWeight: 300, color: "#888", fontSize: "15px" }}>($12.49)</span>
            </div>
            <button style={{
              width: "100%", padding: "13px",
              background: "transparent",
              border: `1.5px solid ${BLUE}`,
              borderRadius: "12px",
              fontSize: "15px", fontWeight: 600, color: BLUE,
              fontFamily: FONT, cursor: "pointer",
            }}>
              Distribute Fees
            </button>
          </div>
        </DecorativeTable>

      </div>
    </div>
  )
}
