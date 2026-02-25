"use client"

import { ArrowUpRight, Play, BookOpen } from "lucide-react"
import dynamic from "next/dynamic"

const TvlChart = dynamic(() => import("./TvlChart"), { ssr: false })

export default function HeroSection() {
  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        minHeight: "540px",
        overflow: "hidden",
        display: "flex",
        alignItems: "flex-start",
      }}
    >
      {/* Left: TVL info */}
      <div
        style={{
          padding: "60px 40px 40px",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          minWidth: "380px",
          flexShrink: 0,
        }}
      >
        {/* Avatar icon */}
        <div
          style={{
            width: "52px",
            height: "52px",
            borderRadius: "50%",
            background: "radial-gradient(circle at 40% 35%, #d0daea, #b8c8d8)",
            border: "1px solid rgba(0,0,0,0.1)",
            marginBottom: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: "radial-gradient(circle at 35% 30%, #8aaac8, #5a7a9a)",
              border: "1px solid rgba(0,0,0,0.1)",
            }}
          />
        </div>

        <p
          style={{
            color: "rgba(0,0,0,0.5)",
            fontSize: "14px",
            fontFamily: "'TWK Lausanne', sans-serif",
            fontWeight: 300,
          }}
        >
          TVL in Reserve
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <h1
            style={{
              fontSize: "48px",
              fontWeight: 300,
              fontFamily: "'TWK Lausanne', sans-serif",
              color: "#0a0d10",
              lineHeight: 1,
              letterSpacing: "-0.02em",
            }}
          >
            $128,368,356
          </h1>
          <button
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: "rgba(0,0,0,0.06)",
              border: "none",
              color: "#0a0d10",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <ArrowUpRight size={16} />
          </button>
        </div>

        <p
          style={{
            color: "rgba(0,0,0,0.5)",
            fontSize: "14px",
            fontFamily: "'TWK Lausanne', sans-serif",
            fontWeight: 300,
          }}
        >
          Annualized protocol revenue:{" "}
          <span style={{ color: "#0a0d10", fontWeight: 500 }}>$2.7M</span>
        </p>

        <div style={{ marginTop: "8px" }}>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 14px",
              borderRadius: "999px",
              background: "rgba(0,0,0,0.04)",
              border: "1px solid rgba(0,0,0,0.1)",
              color: "rgba(0,0,0,0.6)",
              fontSize: "13px",
              fontFamily: "'TWK Lausanne', sans-serif",
              fontWeight: 300,
              cursor: "pointer",
            }}
          >
            <BookOpen size={13} />
            What are DTFs?
            <div
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                background: "#1a56db",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Play size={9} fill="white" color="white" />
            </div>
          </button>
        </div>
      </div>

      {/* Right: Chart - fills remaining space, aligned to bottom */}
      <div
        style={{
          position: "absolute",
          right: 0,
          bottom: 0,
          left: "200px",
          height: "420px",
        }}
      >
        <TvlChart />
      </div>
    </section>
  )
}
