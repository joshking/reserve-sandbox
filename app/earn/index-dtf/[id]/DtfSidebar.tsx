"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Globe2, Shuffle, Landmark, ArrowLeftRight, Fingerprint } from "lucide-react"

const sidebarItems = [
  { id: "overview",   label: "Overview",        Icon: Globe2,         suffix: "" },
  { id: "mint",       label: "Mint + Redeem",   Icon: Shuffle,        suffix: "/mint" },
  { id: "governance", label: "Governance",      Icon: Landmark,       suffix: "/governance" },
  { id: "auctions",   label: "Auctions",        Icon: ArrowLeftRight, suffix: "/auctions" },
  { id: "details",    label: "Details + Roles", Icon: Fingerprint,    suffix: "/details" },
]

function getActiveTab(pathname: string): string {
  if (pathname.includes("/mint"))       return "mint"
  if (pathname.includes("/governance")) return "governance"
  if (pathname.includes("/auctions"))   return "auctions"
  if (pathname.includes("/details"))    return "details"
  return "overview"
}

export default function DtfSidebar() {
  const pathname = usePathname()
  // pathname: /earn/index-dtf/[id][/sub...]
  const id   = pathname.split("/")[3]
  const base = `/earn/index-dtf/${id}`
  const active = getActiveTab(pathname)

  return (
    <div style={{ padding: "24px 16px", display: "flex", flexDirection: "column", gap: "2px" }}>
      {sidebarItems.map(({ id: tabId, label, Icon, suffix }) => (
        <Link
          key={tabId}
          href={`${base}${suffix}`}
          style={{
            display: "flex", alignItems: "center", gap: "12px",
            padding: "10px 8px", borderRadius: "8px",
            textDecoration: "none",
          }}
        >
          <Icon size={20} color={active === tabId ? "#0151af" : "#0a0d10"} />
          <span style={{
            fontSize: "16px", fontFamily: "'TWK Lausanne', sans-serif",
            fontWeight: 300, color: active === tabId ? "#0151af" : "#0a0d10",
            lineHeight: "17px",
          }}>
            {label}
          </span>
        </Link>
      ))}
    </div>
  )
}
