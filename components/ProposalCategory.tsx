"use client"

import { ArrowLeft, ArrowRight, Asterisk, Settings, Crown, LayoutGrid } from "lucide-react"

type Category = {
  id: string
  icon: React.ReactNode
  label: string
}

const categories: Category[] = [
  {
    id: "dtf-basket",
    icon: <Asterisk size={16} />,
    label: "DTF Basket",
  },
  {
    id: "dtf-settings",
    icon: <Settings size={16} />,
    label: "DTF Settings",
  },
  {
    id: "basket-settings",
    icon: <Crown size={16} />,
    label: "Basket settings",
  },
  {
    id: "dao",
    icon: <LayoutGrid size={16} />,
    label: "DAO",
  },
]

const BLUE = "#0151af"
const EXPEDITED_DISABLED = new Set(["dtf-basket", "dao"])

export default function ProposalCategory({
  onBack,
  onSelect,
  expedited = false,
}: {
  onBack: () => void
  onSelect: (id: string) => void
  expedited?: boolean
}) {
  return (
    <div
      style={{
        width: "478px",
        background: "#f9eddd",
        borderRadius: "24px",
        padding: "4px",
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        fontFamily: "'TWK Lausanne', system-ui, sans-serif",
      }}
    >
      {/* Header — on cream background */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "16px 24px",
        }}
      >
        <button
          onClick={onBack}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            border: `1px solid ${BLUE}`,
            background: "transparent",
            color: BLUE,
            cursor: "pointer",
            flexShrink: 0,
            padding: 0,
          }}
        >
          <ArrowLeft size={16} strokeWidth={2} />
        </button>

        <span
          style={{
            fontSize: "20px",
            fontWeight: 700,
            color: BLUE,
            lineHeight: "23px",
          }}
        >
          Select proposal category
        </span>
      </div>

      {/* Options — white card */}
      <div
        style={{
          background: "white",
          borderRadius: "20px",
          overflow: "hidden",
        }}
      >
        {categories.map((cat, i) => {
          const disabled = expedited && EXPEDITED_DISABLED.has(cat.id)
          return (
            <button
              key={cat.id}
              onClick={() => !disabled && onSelect(cat.id)}
              disabled={disabled}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                padding: "24px",
                background: "transparent",
                border: "none",
                borderBottom: i < categories.length - 1 ? "1px solid #e5e5e5" : "none",
                cursor: disabled ? "not-allowed" : "pointer",
                gap: "8px",
                textAlign: "left",
                opacity: disabled ? 0.35 : 1,
              }}
            >
              {/* Left: icon + label */}
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
                  {cat.icon}
                </div>

                <span
                  style={{
                    fontSize: "20px",
                    fontWeight: 700,
                    color: "black",
                    lineHeight: "23px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {cat.label}
                </span>
              </div>

              {/* Right: grey circle arrow */}
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
          )
        })}
      </div>
    </div>
  )
}
