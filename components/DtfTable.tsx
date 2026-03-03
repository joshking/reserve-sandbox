"use client"

import { useState } from "react"
import Link from "next/link"
import { Search } from "lucide-react"

type Chain = "all" | "ETH" | "Base" | "Solana"

type Dtf = {
  ticker: string
  name: string
  price: string
  change7d: number
  annualizedTvlFee: string
  backingColors: string[]
  tags: string
  chain: "ETH" | "Base" | "Solana"
  logoColor: string
}

const dtfs: Dtf[] = [
  {
    ticker: "BAIX",
    name: "Base AI Index",
    price: "$1.43",
    change7d: 2.23,
    annualizedTvlFee: "2%",
    backingColors: ["#8b5cf6", "#22d3ee", "#3b82f6", "#eab308"],
    tags: "AI, Base",
    chain: "Base",
    logoColor: "#2d57f1",
  },
  {
    ticker: "BEX",
    name: "Base Ecosystem Index",
    price: "$14.34",
    change7d: 14.23,
    annualizedTvlFee: "2%",
    backingColors: ["#8b5cf6", "#22d3ee", "#3b82f6", "#eab308"],
    tags: "Ecosystem, Base",
    chain: "Base",
    logoColor: "#2d57f1",
  },
  {
    ticker: "MVTT10F",
    name: "CoinMarketCap 20 Index",
    price: "$144.01",
    change7d: 3.07,
    annualizedTvlFee: "1%",
    backingColors: ["#f59e0b", "#3b82f6", "#a855f7", "#10b981"],
    tags: "Index, ETH",
    chain: "ETH",
    logoColor: "#f59e0b",
  },
  {
    ticker: "BGCI",
    name: "Bloomberg Galaxy Crypto",
    price: "$48.32",
    change7d: -2.14,
    annualizedTvlFee: "0.75%",
    backingColors: ["#f97316", "#3b82f6", "#22d3ee", "#a855f7"],
    tags: "Index, ETH",
    chain: "ETH",
    logoColor: "#1d4ed8",
  },
  {
    ticker: "DGI",
    name: "DeFi Growth Index",
    price: "$88.50",
    change7d: -4.22,
    annualizedTvlFee: "0.8%",
    backingColors: ["#10b981", "#3b82f6", "#a855f7"],
    tags: "DeFi, ETH",
    chain: "ETH",
    logoColor: "#10b981",
  },
]

const chains: { id: Chain; label: string }[] = [
  { id: "all", label: "All chains" },
  { id: "ETH", label: "ETH" },
  { id: "Base", label: "Base" },
  { id: "Solana", label: "Solana" },
]

const CHAIN_COLORS: Record<string, string> = {
  ETH: "#627eea",
  Base: "#0052ff",
  Solana: "#9945ff",
}

function Sparkline({ positive }: { positive: boolean }) {
  const path = positive
    ? "M0,26 C8,24 12,20 20,18 C28,16 30,14 38,10 C44,7 50,5 60,2"
    : "M0,4 C8,6 14,10 22,14 C30,18 34,20 42,22 C50,24 54,24 60,28"
  const color = positive ? "#16a34a" : "#dc2626"
  return (
    <svg
      width="60"
      height="32"
      viewBox="0 0 60 32"
      fill="none"
      style={{ flexShrink: 0 }}
    >
      <path
        d={path}
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function DtfTable({ category: _category }: { category: string }) {
  const [selectedChain, setSelectedChain] = useState<Chain>("all")
  const [search, setSearch] = useState("")

  const filtered = dtfs.filter((dtf) => {
    if (selectedChain !== "all" && dtf.chain !== selectedChain) return false
    if (
      search &&
      !dtf.name.toLowerCase().includes(search.toLowerCase()) &&
      !dtf.ticker.toLowerCase().includes(search.toLowerCase()) &&
      !dtf.tags.toLowerCase().includes(search.toLowerCase())
    )
      return false
    return true
  })

  return (
    <div
      style={{
        background: "#f9eddd",
        borderRadius: "24px",
        padding: "4px",
        display: "flex",
        flexDirection: "column",
        gap: "4px",
      }}
    >
      {/* ── Top bar: search + chain filter ── */}
      <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
        {/* Search */}
        <div
          style={{
            background: "white",
            borderRadius: "20px",
            flex: 1,
            height: "62px",
            display: "flex",
            alignItems: "center",
            padding: "0 24px",
            gap: "12px",
          }}
        >
          <Search size={15} style={{ color: "rgba(0,0,0,0.4)", flexShrink: 0 }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, ticker or collateral"
            style={{
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: "16px",
              fontFamily: "'TWK Lausanne', sans-serif",
              fontWeight: 300,
              color: "rgba(0,0,0,0.7)",
              flex: 1,
              lineHeight: "17px",
            }}
          />
        </div>

        {/* Chain filter */}
        <div
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "16px",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              background: "#f2f2f2",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              padding: "4px",
              gap: "2px",
            }}
          >
            {chains.map(({ id, label }) => {
              const active = selectedChain === id
              return (
                <button
                  key={id}
                  onClick={() => setSelectedChain(id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    padding: "4px 10px",
                    borderRadius: "6px",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontFamily: "'TWK Lausanne', sans-serif",
                    fontWeight: active ? 500 : 300,
                    color: active ? "#0151af" : "rgba(0,0,0,0.65)",
                    whiteSpace: "nowrap",
                    lineHeight: "18px",
                    transition: "all 0.12s",
                  }}
                >
                  {id !== "all" && (
                    <div
                      style={{
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        background: CHAIN_COLORS[id] ?? "#888",
                        flexShrink: 0,
                      }}
                    />
                  )}
                  {label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Table ── */}
      <div
        style={{
          background: "white",
          borderRadius: "20px",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            borderBottom: "1px solid #e5e5e5",
          }}
        >
          <HeaderCell width={320} align="left">Name</HeaderCell>
          <HeaderCell width={180} align="left">Backing</HeaderCell>
          <HeaderCell width={160} align="left">Tags</HeaderCell>
          <HeaderCell width={240} align="right">Performance (Last 7 Days)</HeaderCell>
          <HeaderCell width={120} align="right">Price</HeaderCell>
          <HeaderCell flex align="right">Annualized TVL Fee</HeaderCell>
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div
            style={{
              padding: "40px 24px",
              textAlign: "center",
              fontSize: "14px",
              fontFamily: "'TWK Lausanne', sans-serif",
              fontWeight: 300,
              color: "#666",
            }}
          >
            No DTFs found
          </div>
        ) : (
          filtered.map((dtf, i) => (
            <Link
              key={dtf.ticker}
              href={`/gov-v2/${dtf.ticker.toLowerCase()}`}
              style={{
                display: "flex",
                height: "80px",
                alignItems: "center",
                borderBottom: i < filtered.length - 1 ? "1px solid #e5e5e5" : "none",
                cursor: "pointer",
                transition: "background 0.1s",
                textDecoration: "none",
                color: "inherit",
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLElement).style.background = "#fafafa"
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLElement).style.background = "transparent"
              }}
            >
              {/* Name */}
              <div
                style={{
                  width: 320,
                  padding: "0 24px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  overflow: "hidden",
                  height: "100%",
                }}
              >
                {/* Logo with chain badge */}
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: dtf.logoColor,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "9px",
                      fontWeight: 700,
                      color: "white",
                      fontFamily: "'TWK Lausanne', sans-serif",
                      letterSpacing: "0.02em",
                    }}
                  >
                    {dtf.ticker.slice(0, 3)}
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      bottom: -1,
                      right: -1,
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      background: CHAIN_COLORS[dtf.chain] ?? "#888",
                      border: "1.5px solid white",
                    }}
                  />
                </div>
                {/* Name + ticker */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: "16px",
                      fontFamily: "'TWK Lausanne', sans-serif",
                      fontWeight: 700,
                      color: "#000",
                      lineHeight: 1.25,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {dtf.name}
                  </div>
                  <div
                    style={{
                      fontSize: "16px",
                      fontFamily: "'TWK Lausanne', sans-serif",
                      fontWeight: 300,
                      color: "#666",
                      lineHeight: "17px",
                      marginTop: "4px",
                    }}
                  >
                    ${dtf.ticker}
                  </div>
                </div>
              </div>

              {/* Backing */}
              <div
                style={{
                  width: 180,
                  padding: "0 24px",
                  display: "flex",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    height: 20,
                    width: `${dtf.backingColors.length * 14 + 6}px`,
                    flexShrink: 0,
                  }}
                >
                  {dtf.backingColors.map((color, idx) => (
                    <div
                      key={idx}
                      style={{
                        position: "absolute",
                        left: idx * 14,
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        background: color,
                        border: "2px solid white",
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div
                style={{
                  width: 160,
                  padding: "0 24px",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  overflow: "hidden",
                }}
              >
                <p
                  style={{
                    fontSize: "16px",
                    fontFamily: "'TWK Lausanne', sans-serif",
                    fontWeight: 300,
                    color: "#000",
                    lineHeight: 1.39,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {dtf.tags}
                </p>
              </div>

              {/* Performance */}
              <div
                style={{
                  width: 240,
                  padding: "0 24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: "12px",
                  height: "100%",
                }}
              >
                <span
                  style={{
                    fontSize: "16px",
                    fontFamily: "'TWK Lausanne', sans-serif",
                    fontWeight: 300,
                    color: dtf.change7d >= 0 ? "#16a34a" : "#dc2626",
                    lineHeight: 1.39,
                    whiteSpace: "nowrap",
                  }}
                >
                  {dtf.change7d >= 0 ? "+" : ""}
                  {dtf.change7d.toFixed(2)}%
                </span>
                <Sparkline positive={dtf.change7d >= 0} />
              </div>

              {/* Price */}
              <div
                style={{
                  width: 120,
                  padding: "0 24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  height: "100%",
                }}
              >
                <p
                  style={{
                    fontSize: "16px",
                    fontFamily: "'TWK Lausanne', sans-serif",
                    fontWeight: 300,
                    color: "#000",
                    lineHeight: 1.39,
                  }}
                >
                  {dtf.price}
                </p>
              </div>

              {/* Annualized TVL Fee */}
              <div
                style={{
                  flex: 1,
                  padding: "0 24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  height: "100%",
                }}
              >
                <p
                  style={{
                    fontSize: "16px",
                    fontFamily: "'TWK Lausanne', sans-serif",
                    fontWeight: 300,
                    color: "#000",
                    lineHeight: 1.39,
                  }}
                >
                  {dtf.annualizedTvlFee}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}

function HeaderCell({
  children,
  width,
  flex,
  align,
}: {
  children: React.ReactNode
  width?: number
  flex?: boolean
  align: "left" | "right"
}) {
  return (
    <div
      style={{
        ...(flex ? { flex: 1, minWidth: 0 } : { width }),
        padding: "0 24px",
        height: "52px",
        display: "flex",
        alignItems: "center",
        justifyContent: align === "right" ? "flex-end" : "flex-start",
      }}
    >
      <p
        style={{
          fontSize: "16px",
          fontFamily: "'TWK Lausanne', sans-serif",
          fontWeight: 300,
          color: "#666",
          lineHeight: "17px",
        }}
      >
        {children}
      </p>
    </div>
  )
}
