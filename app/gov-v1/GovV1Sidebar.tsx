"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Globe2, Shuffle, Landmark, ArrowLeftRight, Fingerprint, Scale, WalletCards } from "lucide-react"

const FONT = "'TWK Lausanne', sans-serif"

const navItems = [
  { id: "overview",    label: "Overview",        Icon: Globe2,         href: "/gov-v1/overview" },
  { id: "mint",        label: "Mint + Redeem",   Icon: Shuffle,        href: "/gov-v1/mint" },
  { id: "governance",  label: "Governance",      Icon: Landmark,       href: "/gov-v2" },
  { id: "gov-v1",      label: "Governance v1",   Icon: Scale,          href: "/gov-v1" },
  { id: "auctions",    label: "Auctions",        Icon: ArrowLeftRight, href: "/gov-v1/auctions" },
  { id: "details",     label: "Details + Roles", Icon: Fingerprint,    href: "/gov-v1/details" },
]

function getActiveTab(pathname: string): string {
  if (pathname.startsWith("/gov-v1/overview"))    return "overview"
  if (pathname.startsWith("/gov-v1/mint"))        return "mint"
  if (pathname.startsWith("/gov-v1/auctions"))    return "auctions"
  if (pathname.startsWith("/gov-v1/details"))     return "details"
  if (pathname.startsWith("/gov-v1/governance"))  return "governance"
  return "gov-v1"
}

export default function GovV1Sidebar() {
  const pathname = usePathname()
  const active = getActiveTab(pathname)

  return (
    <div style={{ padding: "16px 16px 24px", display: "flex", flexDirection: "column" }}>

      {/* Header */}
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
            <Scale size={14} color="white" strokeWidth={2} />
          </div>
          <span style={{ fontSize: "16px", fontWeight: 600, color: "#0a0d10", fontFamily: FONT }}>
            Gov v1
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
        {navItems.map(({ id, label, Icon, href }) => (
          <Link
            key={id}
            href={href}
            style={{
              display: "flex", alignItems: "center", gap: "12px",
              padding: "10px 8px", borderRadius: "8px",
              textDecoration: "none",
            }}
          >
            <Icon size={20} color={active === id ? "#0151af" : "#0a0d10"} />
            <span style={{
              fontSize: "16px", fontFamily: FONT,
              fontWeight: 300, color: active === id ? "#0151af" : "#0a0d10",
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
