"use client"

import { ShipWheel, LayoutGrid, ArrowRight } from "lucide-react"

const FONT = "'TWK Lausanne', system-ui, sans-serif"
const CREAM = "#f9eddd"

const OPTIONS = [
  {
    id: "expedited" as const,
    icon: <ShipWheel size={16} />,
    title: "Expedited Proposal",
    subtitle: "Short explanation of what this is",
  },
  {
    id: "normal" as const,
    icon: <LayoutGrid size={16} />,
    title: "Normal Proposal",
    subtitle: "Short explanation of what this is",
  },
]

export default function ProposalTypeMenu({
  onSelect,
}: {
  onSelect: (type: "expedited" | "normal") => void
}) {
  return (
    <div
      style={{
        width: "360px",
        background: CREAM,
        borderRadius: "20px",
        padding: "4px",
        fontFamily: FONT,
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "20px",
          overflow: "hidden",
        }}
      >
        {OPTIONS.map((opt, i) => (
          <button
            key={opt.id}
            onClick={() => onSelect(opt.id)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              padding: "16px",
              background: "transparent",
              border: "none",
              borderBottom: i < OPTIONS.length - 1 ? "1px solid #e5e5e5" : "none",
              cursor: "pointer",
              textAlign: "left",
              gap: "8px",
            }}
          >
            {/* Left: icon + text */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  border: "1px solid black",
                  color: "black",
                  flexShrink: 0,
                }}
              >
                {opt.icon}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span
                  style={{
                    fontSize: "15px",
                    fontWeight: 700,
                    color: "black",
                    lineHeight: "18px",
                    fontFamily: FONT,
                  }}
                >
                  {opt.title}
                </span>
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: 300,
                    color: "#666",
                    lineHeight: "15px",
                    fontFamily: FONT,
                  }}
                >
                  {opt.subtitle}
                </span>
              </div>
            </div>

            {/* Right: arrow */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "#f2f2f2",
                flexShrink: 0,
                color: "black",
              }}
            >
              <ArrowRight size={16} strokeWidth={2} />
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
