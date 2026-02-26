"use client"

import { ChevronLeft, ChevronRight, Asterisk, Settings, Crown, LayoutGrid } from "lucide-react"

type Category = {
  id: string
  icon: React.ReactNode
  label: string
}

const categories: Category[] = [
  {
    id: "dtf-basket",
    icon: <Asterisk size={20} />,
    label: "DTF Basket",
  },
  {
    id: "dtf-settings",
    icon: <Settings size={20} />,
    label: "DTF Settings",
  },
  {
    id: "basket-settings",
    icon: <Crown size={20} />,
    label: "Basket settings",
  },
  {
    id: "dao",
    icon: <LayoutGrid size={20} />,
    label: "DAO",
  },
]

const BLUE = "#3d5ce5"

export default function ProposalCategory({
  onBack,
  onSelect,
}: {
  onBack: () => void
  onSelect: (id: string) => void
}) {
  return (
    <div
      style={{
        width: "478px",
        background: "#f9eddd",
        borderRadius: "16px",
        overflow: "hidden",
        fontFamily: "'TWK Lausanne', system-ui, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "20px 20px 16px",
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
            border: `1.5px solid ${BLUE}`,
            background: "transparent",
            color: BLUE,
            cursor: "pointer",
            flexShrink: 0,
            padding: 0,
          }}
        >
          <ChevronLeft size={18} strokeWidth={2} />
        </button>

        <span
          style={{
            fontSize: "18px",
            fontWeight: 700,
            color: BLUE,
            lineHeight: 1,
          }}
        >
          Select proposal category
        </span>
      </div>

      {/* Category rows */}
      <div style={{ padding: "0 16px 16px" }}>
        {categories.map((cat, i) => (
          <div key={cat.id}>
            <button
              onClick={() => onSelect(cat.id)}
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                padding: "14px 4px",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                gap: "14px",
                textAlign: "left",
              }}
            >
              {/* Icon circle */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  border: "1.5px solid rgba(0,0,0,0.15)",
                  color: "#0a0d10",
                  flexShrink: 0,
                }}
              >
                {cat.icon}
              </div>

              {/* Label */}
              <span
                style={{
                  flex: 1,
                  fontSize: "16px",
                  fontWeight: 500,
                  color: "#0a0d10",
                }}
              >
                {cat.label}
              </span>

              {/* Arrow */}
              <ChevronRight size={18} color="rgba(0,0,0,0.4)" />
            </button>

            {/* Divider (not after last item) */}
            {i < categories.length - 1 && (
              <div
                style={{
                  height: "1px",
                  background: "rgba(0,0,0,0.08)",
                  margin: "0 4px",
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
