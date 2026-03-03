"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Globe2, Shuffle, Landmark, ArrowLeftRight, Fingerprint, WalletCards, Scale } from "lucide-react"

const FONT = "'TWK Lausanne', sans-serif"

const sidebarItems: { id: string; label: string; Icon: React.ElementType; suffix: string; href?: string }[] = [
  { id: "overview",   label: "Overview",        Icon: Globe2,         suffix: "" },
  { id: "mint",       label: "Mint + Redeem",   Icon: Shuffle,        suffix: "/mint" },
  { id: "governance", label: "Governance",      Icon: Landmark,       suffix: "/governance" },
  { id: "gov-v1",     label: "Governance v1",   Icon: Scale,          suffix: "",  href: "/gov-v1" },
  { id: "auctions",   label: "Auctions",        Icon: ArrowLeftRight, suffix: "/auctions" },
  { id: "details",    label: "Details + Roles", Icon: Fingerprint,    suffix: "/details" },
]

function getActiveTab(pathname: string): string {
  if (pathname.startsWith("/gov-v1"))   return "gov-v1"
  if (pathname.includes("/mint"))       return "mint"
  if (pathname.includes("/governance")) return "governance"
  if (pathname.includes("/auctions"))   return "auctions"
  if (pathname.includes("/details"))    return "details"
  return "overview"
}

export default function DtfSidebar() {
  const pathname = usePathname()
  const id   = pathname.split("/")[2] ?? ""
  const base = `/gov-v2/${id}`
  const active = getActiveTab(pathname)
  const ticker = id.toUpperCase()

  return (
    <div style={{ padding: "16px 16px 24px", display: "flex", flexDirection: "column" }}>

      {/* Token header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "8px 8px 16px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            background: "#0a0d10",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <span style={{ fontSize: "13px", fontWeight: 700, color: "white", fontFamily: FONT }}>
              {ticker[0]}
            </span>
          </div>
          <span style={{ fontSize: "16px", fontWeight: 600, color: "#0a0d10", fontFamily: FONT }}>
            {ticker}
          </span>
        </div>
        <button style={{
          background: "none", border: "none", cursor: "pointer", padding: 0,
          display: "flex", alignItems: "center",
        }}>
          <WalletCards size={20} color="#0a0d10" strokeWidth={1.5} />
        </button>
      </div>

      {/* Divider */}
      <div style={{ height: "1px", background: "#ede4d3", marginBottom: "8px" }} />

      {/* Nav items */}
      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        {sidebarItems.map(({ id: tabId, label, Icon, suffix, href }) => (
          <Link
            key={tabId}
            href={href ?? `${base}${suffix}`}
            style={{
              display: "flex", alignItems: "center", gap: "12px",
              padding: "10px 8px", borderRadius: "8px",
              textDecoration: "none",
            }}
          >
            <Icon size={20} color={active === tabId ? "#0151af" : "#0a0d10"} />
            <span style={{
              fontSize: "16px", fontFamily: FONT,
              fontWeight: 300, color: active === tabId ? "#0151af" : "#0a0d10",
              lineHeight: "17px",
            }}>
              {label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
