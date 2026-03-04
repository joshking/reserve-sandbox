"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Binoculars, Coins, BadgePlus, Flower2, LayoutGrid, ChevronDown,
  ArrowRight, ArrowUpRight, Microscope, Route, Ear, Send,
  Search, Moon, Wallet,
  LandmarkIcon,
} from "lucide-react"

const FONT = "'TWK Lausanne', system-ui, sans-serif"

// ── More-menu data ─────────────────────────────────────────────────────────────

type MoreItem = {
  label: string
  desc: string
  icon: React.ReactNode
  href: string
  external: boolean
}

function CircleIcon({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      width: 44, height: 44, borderRadius: "50%",
      border: "1.5px solid #e0d8cc",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
    }}>
      {children}
    </div>
  )
}

function RSquareIcon() {
  return (
    <div style={{
      width: 44, height: 44, borderRadius: "10px",
      background: "#1a2f6e",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
    }}>
      <span style={{ fontSize: 20, fontWeight: 700, color: "white", fontFamily: FONT, lineHeight: 1 }}>
        ℝ
      </span>
    </div>
  )
}

function TelegramIcon() {
  return (
    <div style={{
      width: 44, height: 44, borderRadius: "50%",
      background: "#29a8e8",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
    }}>
      <Send size={20} color="white" strokeWidth={1.5} />
    </div>
  )
}

const MORE_ITEMS: MoreItem[] = [
  { label: "DTF Explorer",      desc: "Get an overview of everything going on",     icon: <CircleIcon><Microscope size={20} color="#444" strokeWidth={1.5} /></CircleIcon>, href: "/",                                  external: false },
  { label: "Reserve Bridge",    desc: "Transfer DTFs across chains",                icon: <CircleIcon><Route      size={20} color="#444" strokeWidth={1.5} /></CircleIcon>, href: "/bridge",                            external: false },
  { label: "Yield DTF Creator", desc: "Create a new overcollateralized Yield DTF", icon: <CircleIcon><Flower2    size={20} color="#444" strokeWidth={1.5} /></CircleIcon>, href: "/create",                            external: false },
  { label: "Feedback",          desc: "File issues or upvote existing ones",        icon: <div style={{ width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Ear size={28} color="#a78bfa" strokeWidth={1.5} /></div>, href: "https://github.com", external: true },
  { label: "Reserve Blog",      desc: "Stay up to date in long form",               icon: <RSquareIcon />,                                                                 href: "https://blog.reserve.org",           external: true },
  { label: "Reserve Docs",      desc: "Understand the project and protocols",       icon: <RSquareIcon />,                                                                 href: "https://docs.reserve.org",           external: true },
  { label: "Reserve Forum",     desc: "Discussions of ecosystem ideas",             icon: <RSquareIcon />,                                                                 href: "https://forum.reserve.org",          external: true },
  { label: "Reserve Telegram",  desc: "Join the conversation or ask questions",     icon: <TelegramIcon />,                                                                href: "https://t.me/reserveprotocol",       external: true },
]

function MoreMenu() {
  return (
    <div style={{
      position: "absolute",
      top: "calc(100% + 4px)",
      left: 0,
      zIndex: 100,
      background: "#f2ebe0",
      borderRadius: "20px",
      padding: "10px",
      width: "360px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
      display: "flex",
      flexDirection: "column",
      gap: "4px",
    }}>
      {MORE_ITEMS.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          target={item.external ? "_blank" : undefined}
          rel={item.external ? "noopener noreferrer" : undefined}
          style={{
            display: "flex", alignItems: "center", gap: "12px",
            background: "white", borderRadius: "14px",
            padding: "12px 12px",
            textDecoration: "none",
          }}
        >
          {item.icon}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#0a0d10", fontFamily: FONT, lineHeight: "19px" }}>
              {item.label}
            </div>
            <div style={{ fontSize: 13, fontWeight: 300, color: "#888", fontFamily: FONT, lineHeight: "17px", marginTop: 2 }}>
              {item.desc}
            </div>
          </div>
          {item.external ? (
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              border: "1.5px solid #e0d8cc",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <ArrowUpRight size={16} color="#888" strokeWidth={1.5} />
            </div>
          ) : (
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "#0151af",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <ArrowRight size={16} color="white" strokeWidth={2} />
            </div>
          )}
        </Link>
      ))}
    </div>
  )
}

// ── Reserve Logo ────────────────────────────────────────────────────────────────
// DO NOT replace this logo unless explicitly instructed by the user.

function ReserveLogo() {
  return (
    <svg width="123" height="25" viewBox="0 0 123 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M4.44162 24.553V15.1042H0V11.256H4.44162V9.88904H0V6.12718H4.44162V0H14.5314C17.1759 0 19.1335 0.622858 20.4029 1.86825C21.6723 3.10177 22.3077 5.00533 22.3077 7.57923C22.3077 9.53027 21.8395 11.0988 20.9017 12.2852C19.9638 13.4593 18.6605 14.2766 16.9862 14.7352L22.663 24.553H17.4134L12.1995 15.1228H9.17546V24.553H4.44162ZM9.17546 11.2631H15.1549C16.6376 11.2631 17.3792 10.4458 17.3792 8.81275V6.29148C17.3792 5.46902 17.2133 4.88178 16.8802 4.52815C16.5609 4.16426 15.9851 3.98167 15.1549 3.98167H9.17546V11.2631ZM22.8663 15.3173C22.8663 13.8723 23.068 12.5624 23.4711 11.3867C23.8744 10.2003 24.4379 9.18852 25.1625 8.35419C25.8987 7.50799 26.7818 6.85657 27.8138 6.39801C28.8457 5.93945 29.9901 5.71098 31.2476 5.71098C32.5051 5.71098 33.6443 5.93432 34.6644 6.381C35.696 6.82769 36.5743 7.44381 37.2985 8.23225C38.0331 9.00722 38.5918 9.93621 38.971 11.0176C39.3621 12.099 39.5587 13.2681 39.5587 14.5253V16.7998H27.6192V18.0164C27.6192 19.1212 27.9813 19.9793 28.704 20.5903C29.4386 21.189 30.3046 21.4888 31.3024 21.4888C32.2983 21.4888 33.1114 21.2298 33.74 20.7138C34.3686 20.1959 34.743 19.4681 34.8609 18.5275H39.4169C39.1198 20.5716 38.2483 22.1639 36.8014 23.3044C35.3664 24.433 33.5145 24.9965 31.2492 24.9965C29.9321 24.9965 28.7517 24.7613 27.7078 24.2908C26.6762 23.8204 25.7979 23.1622 25.0736 22.316C24.3613 21.4702 23.8161 20.4529 23.4369 19.2669C23.0561 18.0789 22.8663 16.7626 22.8663 15.3173ZM27.6172 13.2902H34.8951V12.6388C34.8951 11.6286 34.5516 10.8062 33.8631 10.1714C33.1746 9.53701 32.3034 9.22061 31.2476 9.22061C30.2037 9.22061 29.3377 9.53862 28.6492 10.1714C27.9607 10.8062 27.6172 11.6286 27.6172 12.6388V13.2902ZM40.8999 18.7018H45.4559C45.6457 20.5578 46.7662 21.4868 48.8198 21.4868C49.6978 21.4868 50.4443 21.328 51.0612 21.0116C51.6779 20.6833 51.9872 20.1654 51.9872 19.4597C51.9872 18.7897 51.7324 18.3074 51.2217 18.0148C50.711 17.7083 50.0412 17.4679 49.211 17.2921L46.0078 16.6051C42.9003 15.935 41.3458 14.1784 41.3458 11.3356C41.3458 10.5369 41.5063 9.79597 41.8259 9.11568C42.1571 8.43377 42.632 7.8414 43.2489 7.33535C43.8656 6.82962 44.6189 6.43684 45.5091 6.15445C46.3989 5.85987 47.4122 5.71451 48.5514 5.71451C50.663 5.71451 52.3954 6.22024 53.7467 7.23042C55.0998 8.24092 55.8222 9.7687 55.9178 11.8128H51.3619C51.3138 10.9432 51.0355 10.2969 50.5248 9.87363C50.0155 9.43882 49.3563 9.22221 48.5498 9.22221C47.7673 9.22221 47.1268 9.39325 46.628 9.7334C46.1412 10.0617 45.8986 10.527 45.8986 11.1258C45.8986 11.7249 46.0829 12.1716 46.4502 12.4661C46.8294 12.7485 47.3217 12.9536 47.928 13.0839L51.6112 13.8774C52.2878 14.0177 52.9283 14.2295 53.5331 14.5119C54.1497 14.7827 54.6778 15.1347 55.1169 15.5695C55.5557 16.0043 55.8992 16.5203 56.1485 17.1211C56.4101 17.7202 56.54 18.4309 56.54 19.2534C56.54 20.0521 56.3673 20.7982 56.0238 21.492C55.6804 22.1857 55.1817 22.79 54.5292 23.3076C53.8765 23.8239 53.0701 24.2366 52.1083 24.5414C51.1482 24.846 50.0499 25 48.8163 25C46.3374 25 44.4207 24.4599 43.0695 23.3788C41.7183 22.2788 40.9937 20.7221 40.8999 18.7018ZM57.9357 15.3173C57.9357 13.8723 58.1371 12.5624 58.5404 11.3867C58.9435 10.2003 59.5073 9.18852 60.2299 8.35419C60.9661 7.50799 61.8492 6.85657 62.8812 6.39801C63.9132 5.93945 65.0576 5.71098 66.315 5.71098C67.5725 5.71098 68.7118 5.93432 69.7318 6.381C70.7637 6.82769 71.6417 7.44381 72.366 8.23225C73.1025 9.00722 73.6592 9.93621 74.0384 11.0176C74.4299 12.099 74.6261 13.2681 74.6261 14.5253V16.7998H62.6866V18.0164C62.6866 19.1212 63.0487 19.9793 63.7714 20.5903C64.5076 21.189 65.3736 21.4888 66.3698 21.4888C67.3657 21.4888 68.1789 21.2298 68.8074 20.7138C69.4364 20.1959 69.8104 19.4681 69.9283 18.5275H74.4843C74.1873 20.5716 73.3158 22.1639 71.8688 23.3044C70.4338 24.433 68.5838 24.9965 66.3166 24.9965C64.9996 24.9965 63.8191 24.7613 62.7752 24.2908C61.7436 23.8204 60.8653 23.1622 60.141 22.316C59.4287 21.4702 58.8836 20.4529 58.5043 19.2669C58.1251 18.0789 57.9357 16.7626 57.9357 15.3173ZM62.6866 13.2902H69.9641V12.6388C69.9641 11.6286 69.6206 10.8062 68.9321 10.1714C68.2439 9.53701 67.3724 9.22061 66.3166 9.22061C65.2731 9.22061 64.4067 9.53862 63.7182 10.1714C63.0297 10.8062 62.6866 11.6286 62.6866 12.6388V13.2902ZM76.449 24.553V6.15092H86.8239V9.67564H81.0053V24.5514H76.449V24.553ZM88.1668 6.15092H93.0424L97.0997 19.4938H97.2414L101.388 6.15092H106.21L99.6794 24.553H94.6959L88.1668 6.15092ZM106.311 15.3173C106.311 13.8723 106.513 12.5624 106.916 11.3867C107.319 10.2003 107.883 9.18852 108.605 8.35419C109.342 7.50799 110.225 6.85657 111.257 6.39801C112.289 5.93945 113.433 5.71098 114.691 5.71098C115.948 5.71098 117.088 5.93432 118.107 6.381C119.139 6.82769 120.017 7.44381 120.74 8.23225C121.476 9.00722 122.033 9.93621 122.412 11.0176C122.803 12.099 123 13.2681 123 14.5253V16.7998H111.061V18.0164C111.061 19.1212 111.423 19.9793 112.145 20.5903C112.882 21.189 113.748 21.4888 114.744 21.4888C115.74 21.4888 116.553 21.2298 117.181 20.7138C117.81 20.1959 118.184 19.4681 118.302 18.5275H122.858C122.561 20.5716 121.69 22.1639 120.243 23.3044C118.808 24.433 116.958 24.9965 114.691 24.9965C113.373 24.9965 112.193 24.7613 111.149 24.2908C110.117 23.8204 109.239 23.1622 108.515 22.316C107.803 21.4702 107.257 20.4529 106.878 19.2669C106.501 18.0789 106.311 16.7626 106.311 15.3173ZM111.062 13.2902H118.34V12.6388C118.34 11.6286 117.996 10.8062 117.308 10.1714C116.619 9.53701 115.748 9.22061 114.692 9.22061C113.649 9.22061 112.782 9.53862 112.094 10.1714C111.406 10.8062 111.062 11.6286 111.062 12.6388V13.2902Z" fill="#0151AF" />
    </svg>
  )
}

function EthIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <circle cx="8" cy="8" r="8" fill="#627EEA" />
      <path d="M8 2.5V9L11.5 7.25L8 2.5Z" fill="white" fillOpacity="0.6" />
      <path d="M8 2.5L4.5 7.25L8 9V2.5Z" fill="white" />
      <path d="M8 9.75V13.5L11.5 8L8 9.75Z" fill="white" fillOpacity="0.6" />
      <path d="M8 13.5V9.75L4.5 8L8 13.5Z" fill="white" />
    </svg>
  )
}

// ── Navbar ─────────────────────────────────────────────────────────────────────

export default function Navbar() {
  const pathname = usePathname()
  const [moreOpen, setMoreOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  return (
    <nav style={{ position: "sticky", top: 0, zIndex: 50, backgroundColor: "#fefbf8" }}>
      <div style={{
        maxWidth: "1400px",
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 24px",
      }}>
        {/* Left: Logo + Nav links */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {/* Logo — DO NOT replace */}
          <Link href="/" style={{ textDecoration: "none" }}>
            <ReserveLogo />
          </Link>

          {/* Nav links */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <NavLink href="/"       icon={<Binoculars size={16} />} label="Discover DTFs"  active={pathname === "/"} />
            <NavLink href="/earn"   icon={<LandmarkIcon size={16} />} label="Participage and Earn"     active={pathname.startsWith("/earn")} />
            <NavLink href="/create" icon={<BadgePlus  size={16} />} label="Create New DTF" active={pathname.startsWith("/create")} />

            {/* More dropdown */}
            <div
              style={{ position: "relative" }}
              onMouseEnter={() => setMoreOpen(true)}
              onMouseLeave={() => setMoreOpen(false)}
            >
              <button style={{
                display: "flex", alignItems: "center", gap: "4px",
                padding: "8px", borderRadius: "6px",
                background: "none", border: "none",
                color: moreOpen ? "#0151af" : "black",
                fontSize: "16px", fontFamily: FONT, fontWeight: 300,
                cursor: "pointer",
              }}>
                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <LayoutGrid size={16} />
                  More
                </span>
                <ChevronDown size={16} />
              </button>
              {moreOpen && <MoreMenu />}
            </div>
          </div>
        </div>

        {/* Right */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Search */}
          <button style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "8px", borderRadius: "12px",
            border: "1px solid #e5e5e5", background: "none", cursor: "pointer",
          }}>
            <Search size={16} color="#0a0d10" />
          </button>

          {/* Dark mode toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "4px 8px 4px 10px", borderRadius: "12px",
              border: "1px solid #e5e5e5", background: "none", cursor: "pointer",
            }}
          >
            <Moon size={16} color="#0a0d10" />
            <div style={{
              position: "relative", width: 24, height: 14,
              borderRadius: 8, background: darkMode ? "#0151af" : "#ccc",
              transition: "background 0.2s", flexShrink: 0,
            }}>
              <div style={{
                position: "absolute", top: 2,
                left: darkMode ? 12 : 2,
                width: 10, height: 10,
                borderRadius: "50%", background: "white",
                transition: "left 0.2s",
              }} />
            </div>
          </button>

          {/* Wallet connected */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <EthIcon />
              <span style={{ fontSize: 16, fontFamily: FONT, fontWeight: 300, color: "black", lineHeight: "22px", whiteSpace: "nowrap" }}>
                0xd3Cd...9785
              </span>
            </div>
            <button style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: "8px", borderRadius: "12px",
              border: "1px solid #e5e5e5", background: "none", cursor: "pointer",
            }}>
              <Wallet size={16} color="#0a0d10" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function NavLink({ href, icon, label, active }: {
  href: string; icon: React.ReactNode; label: string; active: boolean
}) {
  return (
    <Link href={href} style={{
      display: "flex", alignItems: "center", gap: "8px",
      padding: "8px", borderRadius: "6px",
      color: active ? "#0151af" : "rgba(0,0,0,0.8)",
      fontSize: "16px", fontFamily: FONT, fontWeight: 300,
      textDecoration: "none",
    }}>
      {icon}
      {label}
    </Link>
  )
}
