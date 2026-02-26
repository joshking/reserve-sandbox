"use client"

import { ArrowLeft } from "lucide-react"

export default function DecorativeTable({
  title,
  onBack,
  headerRight,
  children,
}: {
  title: string
  onBack?: () => void
  headerRight?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div
      style={{
        width: "100%",
        background: "#f9eddd",
        borderRadius: "24px",
        padding: "4px",
        display: "flex",
        flexDirection: "column",
        gap: "4px",
      }}
    >
      {/* Header — sits on the cream background */}
      <div
        style={{
          padding: "20px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {onBack && (
            <button
              onClick={onBack}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                color: "#333",
                padding: 0,
                flexShrink: 0,
              }}
            >
              <ArrowLeft size={16} strokeWidth={2} />
            </button>
          )}

          <span
            style={{
              fontSize: "20px",
              fontFamily: "'TWK Lausanne', system-ui, sans-serif",
              fontWeight: 700,
              color: "#333",
              lineHeight: "23px",
            }}
          >
            {title}
          </span>
        </div>

        {headerRight && (
          <div style={{ flexShrink: 0 }}>{headerRight}</div>
        )}
      </div>

      {/* Content — white card */}
      <div
        style={{
          background: "white",
          borderRadius: "20px",
          overflow: "hidden",
          width: "100%",
        }}
      >
        {children}
      </div>
    </div>
  )
}
