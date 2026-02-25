"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, Sun, Landmark, PlusCircle, LayoutGrid, ChevronDown } from "lucide-react"

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backgroundColor: "#ffffff",
        borderBottom: "1px solid rgba(0,0,0,0.08)",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 32px",
          height: "56px",
        }}
      >
        {/* Left: Logo + Nav links */}
        <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
          {/* Logo */}
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              textDecoration: "none",
              color: "#0a0d10",
            }}
          >
            <div
              style={{
                width: "28px",
                height: "28px",
                backgroundColor: "#0a0d10",
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  color: "#ffffff",
                  fontWeight: 700,
                  fontSize: "16px",
                  fontFamily: "'TWK Lausanne', sans-serif",
                  lineHeight: 1,
                }}
              >
                R
              </span>
            </div>
            <span
              style={{
                fontFamily: "'TWK Lausanne', sans-serif",
                fontWeight: 700,
                fontSize: "17px",
                letterSpacing: "-0.02em",
                color: "#0a0d10",
              }}
            >
              Reserve
            </span>
          </Link>

          {/* Nav links */}
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <NavLink
              href="/"
              icon={<LayoutGrid size={15} />}
              label="Discover DTFs"
              active={pathname === "/"}
            />
            <NavLink
              href="/earn/index-dtf"
              icon={<Landmark size={15} />}
              label="Participate & Earn"
              active={pathname.startsWith("/earn")}
            />
            <NavLink
              href="/create"
              icon={<PlusCircle size={15} />}
              label="Create New DTF"
              active={pathname.startsWith("/create")}
            />
            <button
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                padding: "6px 10px",
                borderRadius: "6px",
                background: "none",
                border: "none",
                color: "rgba(0,0,0,0.5)",
                fontSize: "14px",
                fontFamily: "'TWK Lausanne', sans-serif",
                fontWeight: 300,
                cursor: "pointer",
              }}
            >
              More <ChevronDown size={13} />
            </button>
          </div>
        </div>

        {/* Right: Search, theme, connect */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <IconBtn>
            <Search size={16} />
          </IconBtn>
          <IconBtn>
            <Sun size={16} />
          </IconBtn>
          <button
            style={{
              padding: "8px 20px",
              borderRadius: "999px",
              background: "linear-gradient(135deg, #1a56db, #1e40af)",
              border: "none",
              color: "white",
              fontSize: "14px",
              fontFamily: "'TWK Lausanne', sans-serif",
              fontWeight: 500,
              cursor: "pointer",
              letterSpacing: "0.01em",
            }}
          >
            Connect
          </button>
        </div>
      </div>
    </nav>
  )
}

function NavLink({
  href,
  icon,
  label,
  active,
}: {
  href: string
  icon: React.ReactNode
  label: string
  active: boolean
}) {
  return (
    <Link
      href={href}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        padding: "6px 10px",
        borderRadius: "6px",
        background: active ? "rgba(0,0,0,0.06)" : "none",
        color: active ? "#0a0d10" : "rgba(0,0,0,0.5)",
        fontSize: "14px",
        fontFamily: "'TWK Lausanne', sans-serif",
        fontWeight: active ? 500 : 300,
        textDecoration: "none",
        transition: "background 0.15s, color 0.15s",
      }}
    >
      {icon}
      {label}
    </Link>
  )
}

function IconBtn({ children }: { children: React.ReactNode }) {
  return (
    <button
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "34px",
        height: "34px",
        borderRadius: "6px",
        background: "rgba(0,0,0,0.03)",
        border: "1px solid rgba(0,0,0,0.1)",
        color: "rgba(0,0,0,0.5)",
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  )
}
