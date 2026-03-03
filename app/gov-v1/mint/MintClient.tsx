"use client"

import { useState } from "react"
import { Settings, RefreshCw, ChevronDown, ArrowUpDown, Package } from "lucide-react"

const FONT = "'TWK Lausanne', system-ui, sans-serif"
const BLUE = "#0151af"
const SWAP_NAVY = "#1a3a8f"

function BnbIcon() {
  return (
    <div style={{
      width: "28px", height: "28px", borderRadius: "50%",
      background: "#f0b90b",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
    }}>
      <Package size={14} color="white" strokeWidth={2} />
    </div>
  )
}

function DtfIcon({ label }: { label: string }) {
  return (
    <div style={{
      width: "28px", height: "28px", borderRadius: "50%",
      background: "linear-gradient(135deg, #1a3a8f 0%, #0a1f5c 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
    }}>
      <span style={{ fontSize: "10px", fontWeight: 700, color: "white", fontFamily: FONT }}>
        {label[0]}
      </span>
    </div>
  )
}

export default function MintClient() {
  const [mode, setMode] = useState<"buy" | "sell">("buy")
  const [amount, setAmount] = useState("")
  const dtfSymbol = "CMC20"

  return (
    <div style={{
      flex: 1,
      background: "#ede4d3",
      borderRadius: "20px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 24px",
      minWidth: 0,
    }}>
      <div style={{
        width: "100%",
        maxWidth: "480px",
        background: "white",
        borderRadius: "20px",
        boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
      }}>
        {/* Header */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 14px 10px",
        }}>
          <div style={{
            display: "flex",
            background: "#f0f0f0",
            borderRadius: "10px",
            padding: "3px",
          }}>
            {(["buy", "sell"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setMode(tab)}
                style={{
                  padding: "6px 18px",
                  borderRadius: "8px",
                  border: "none",
                  background: mode === tab ? "white" : "transparent",
                  boxShadow: mode === tab ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                  fontSize: "14px",
                  fontWeight: mode === tab ? 600 : 400,
                  color: mode === tab ? "#0a0d10" : "#888",
                  cursor: "pointer",
                  fontFamily: FONT,
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", gap: "6px" }}>
            {([
              <Settings key="s" size={15} color="#666" />,
              <RefreshCw key="r" size={15} color="#666" />,
            ]).map((icon, i) => (
              <button key={i} style={{
                width: "32px", height: "32px", borderRadius: "50%",
                border: "1px solid #e5e5e5", background: "white",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer",
              }}>
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* Input sections */}
        <div style={{ padding: "0 10px 10px", display: "flex", flexDirection: "column" }}>
          {/* You use */}
          <div style={{
            background: "#f5f5f5",
            borderRadius: "14px",
            padding: "12px 14px",
            position: "relative",
            zIndex: 0,
          }}>
            <div style={{
              fontSize: "13px", fontWeight: 500, color: BLUE,
              fontFamily: FONT, marginBottom: "6px",
            }}>
              You use:
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                style={{
                  flex: 1, minWidth: 0,
                  fontSize: "36px", fontWeight: 500,
                  color: amount ? "#0a0d10" : "#bbb",
                  fontFamily: FONT,
                  border: "none", background: "transparent",
                  outline: "none", padding: 0,
                }}
              />
              <button style={{
                display: "flex", alignItems: "center", gap: "6px",
                background: "white", border: "none", borderRadius: "99px",
                padding: "5px 8px 5px 5px",
                cursor: "pointer", flexShrink: 0,
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}>
                <BnbIcon />
                <span style={{ fontSize: "15px", fontWeight: 700, color: "#0a0d10", fontFamily: FONT }}>
                  BNB
                </span>
                <ChevronDown size={14} color="#666" />
              </button>
            </div>
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              marginTop: "8px",
            }}>
              <span style={{ fontSize: "12px", fontWeight: 300, color: "#999", fontFamily: FONT }}>
                $0.00
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "12px", fontWeight: 300, color: "#999", fontFamily: FONT }}>
                  Balance <strong style={{ fontWeight: 700, color: "#0a0d10" }}>0.00</strong>
                </span>
                <button style={{
                  padding: "2px 9px",
                  background: "#e2e2e2", border: "none", borderRadius: "99px",
                  fontSize: "11px", fontWeight: 500, color: "#555",
                  cursor: "pointer", fontFamily: FONT,
                }}>
                  Max
                </button>
              </div>
            </div>
          </div>

          {/* Swap button */}
          <div style={{
            display: "flex", justifyContent: "center",
            margin: "-14px 0",
            position: "relative", zIndex: 5,
          }}>
            <button style={{
              width: "28px", height: "28px",
              borderRadius: "50%",
              background: "white",
              border: "1px solid #ddd",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
            }}>
              <ArrowUpDown size={13} color="#666" />
            </button>
          </div>

          {/* You receive */}
          <div style={{
            background: "white",
            border: "1px solid #ebebeb",
            borderRadius: "14px",
            padding: "12px 14px",
            position: "relative", zIndex: 0,
          }}>
            <div style={{
              fontSize: "13px", fontWeight: 500, color: "#0a0d10",
              fontFamily: FONT, marginBottom: "6px",
            }}>
              You receive:
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{
                flex: 1, fontSize: "36px", fontWeight: 500,
                color: "#0a0d10", fontFamily: FONT,
              }}>
                0
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
                <DtfIcon label={dtfSymbol} />
                <span style={{ fontSize: "15px", fontWeight: 700, color: "#0a0d10", fontFamily: FONT }}>
                  {dtfSymbol}
                </span>
              </div>
            </div>
            <div style={{ marginTop: "8px" }}>
              <span style={{ fontSize: "12px", fontWeight: 300, color: "#999", fontFamily: FONT }}>
                $0.00
              </span>
            </div>
          </div>

          {/* CTA */}
          <button style={{
            marginTop: "8px",
            width: "100%", padding: "13px",
            background: SWAP_NAVY,
            color: "white", border: "none", borderRadius: "12px",
            fontSize: "15px", fontWeight: 600, fontFamily: FONT,
            cursor: "pointer", lineHeight: "1",
          }}>
            Switch to BNB Smart Chain
          </button>
        </div>
      </div>

      <button style={{
        marginTop: "16px",
        background: "none", border: "none", cursor: "pointer",
        fontSize: "13px", fontWeight: 300, color: "#888",
        fontFamily: FONT, textDecoration: "underline",
        textUnderlineOffset: "2px",
      }}>
        Having issues? Switch to manual minting
      </button>
    </div>
  )
}
