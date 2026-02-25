"use client"

import { Globe, Flower2, Scale } from "lucide-react"

const categories = [
  {
    id: "index",
    icon: <Globe size={18} />,
    label: "Index DTFs",
    description: "Get easy exposure to narratives, indexes, and ecosystems",
  },
  {
    id: "yield",
    icon: <Flower2 size={18} />,
    label: "Yield DTFs",
    description: "Earn yield safely with diversified DeFi positions",
  },
  {
    id: "stablecoins",
    icon: <Scale size={18} />,
    label: "Stablecoins",
    description: "Overcollateralized tokens pegged to the US dollar",
  },
]

export default function CategorySelector({
  selected,
  onSelect,
}: {
  selected: string
  onSelect: (id: string) => void
}) {
  return (
    <div>
      {/* Divider with label */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          padding: "0 40px",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0",
            flex: 1,
          }}
        >
          <Globe size={14} style={{ color: "rgba(0,0,0,0.2)" }} />
          <div
            style={{
              flex: 1,
              height: "1px",
              background: "rgba(0,0,0,0.08)",
              marginLeft: "8px",
            }}
          />
        </div>

        <p
          style={{
            color: "#0a0d10",
            fontSize: "15px",
            fontFamily: "'TWK Lausanne', sans-serif",
            fontWeight: 500,
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          Select a DTF Category
        </p>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0",
            flex: 1,
          }}
        >
          <div
            style={{
              flex: 1,
              height: "1px",
              background: "rgba(0,0,0,0.08)",
              marginRight: "8px",
            }}
          />
          <Globe size={14} style={{ color: "rgba(0,0,0,0.2)" }} />
        </div>
      </div>

      {/* Category cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "0",
          padding: "0 40px",
          marginBottom: "40px",
        }}
      >
        {categories.map((cat) => {
          const isSelected = selected === cat.id
          return (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                padding: "20px 24px",
                background: isSelected ? "rgba(0,0,0,0.04)" : "transparent",
                border: isSelected
                  ? "1px solid rgba(0,0,0,0.1)"
                  : "1px solid transparent",
                borderRadius: "12px",
                color: "#0a0d10",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.15s",
              }}
            >
              <div
                style={{
                  color: isSelected ? "#0a0d10" : "rgba(0,0,0,0.35)",
                  flexShrink: 0,
                }}
              >
                {cat.icon}
              </div>
              <div>
                <div
                  style={{
                    fontSize: "15px",
                    fontFamily: "'TWK Lausanne', sans-serif",
                    fontWeight: isSelected ? 500 : 300,
                    color: isSelected ? "#0a0d10" : "rgba(0,0,0,0.6)",
                    marginBottom: "2px",
                  }}
                >
                  {cat.label}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    fontFamily: "'TWK Lausanne', sans-serif",
                    fontWeight: 300,
                    color: "rgba(0,0,0,0.4)",
                    lineHeight: "1.4",
                  }}
                >
                  {cat.description}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
