"use client"

import { useState } from "react"
import Navbar from "@/components/Navbar"
import TransactionsTable from "@/components/TransactionsTable"
import GovernanceTable from "@/components/GovernanceTable"

const FONT = "'TWK Lausanne', system-ui, sans-serif"

type Tab = "transactions" | "tokens" | "collaterals" | "governance" | "revenue"

const TABS: { id: Tab; label: string }[] = [
  { id: "transactions", label: "Transactions" },
  { id: "tokens",       label: "Tokens" },
  { id: "collaterals",  label: "Collaterals" },
  { id: "governance",   label: "Governance" },
  { id: "revenue",      label: "Revenue" },
]

export default function ExplorerPage() {
  const [tab, setTab] = useState<Tab>("transactions")

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fff" }}>
      <Navbar />

      {/* Tab bar — full width with bottom border */}
      <div style={{ borderBottom: "1px solid #e5e5e5" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 40px" }}>
          <div style={{ display: "flex", gap: "0" }}>
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  padding: "20px 24px 18px",
                  border: "none",
                  background: "transparent",
                  borderBottom: tab === t.id ? "2px solid #0151af" : "2px solid transparent",
                  marginBottom: "-1px",
                  color: tab === t.id ? "#0151af" : "#888",
                  fontSize: "15px",
                  fontFamily: FONT,
                  fontWeight: tab === t.id ? 600 : 400,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "32px 40px 60px" }}>
        {tab === "transactions" && <TransactionsTable />}
        {tab === "governance" && <GovernanceTable />}
        {tab !== "transactions" && tab !== "governance" && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "200px",
              color: "#bbb",
              fontSize: "15px",
              fontFamily: FONT,
              fontWeight: 300,
            }}
          >
            {TABS.find((t) => t.id === tab)?.label} — coming soon
          </div>
        )}
      </div>
    </div>
  )
}
