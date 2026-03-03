"use client"

import { useRouter } from "next/navigation"
import { ArrowRight } from "lucide-react"

const FONT = "'TWK Lausanne', system-ui, sans-serif"

const wallets = [
  {
    name: "MetaMask",
    description: "Available as a browser extension and mobile app",
    color: "#F6851B",
    letter: "M",
  },
  {
    name: "WalletConnect",
    description: "Connect using QR code or deep link",
    color: "#3B99FC",
    letter: "W",
  },
  {
    name: "Coinbase Wallet",
    description: "Connect your Coinbase self-custody wallet",
    color: "#0052FF",
    letter: "C",
  },
  {
    name: "Safe",
    description: "Connect a Safe multi-signature wallet",
    color: "#12B76A",
    letter: "S",
  },
  {
    name: "Rabby",
    description: "The wallet built for DeFi users",
    color: "#8B5CF6",
    letter: "R",
  },
]

export default function ConnectWalletClient() {
  const router = useRouter()

  return (
    <div style={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <div style={{ width: "100%", maxWidth: "520px" }}>

        {/* Heading */}
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{
            fontSize: "28px", fontWeight: 700, color: "#0a0d10",
            fontFamily: FONT, margin: "0 0 8px", lineHeight: 1.2,
          }}>
            Connect a wallet
          </h1>
          <p style={{
            fontSize: "15px", fontWeight: 300, color: "#888",
            fontFamily: FONT, margin: 0, lineHeight: 1.6,
          }}>
            To create a governance proposal, connect a compatible Web3 wallet.
          </p>
        </div>

        {/* Wallet list */}
        <div style={{
          background: "#f9eddd",
          borderRadius: "24px",
          padding: "4px",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
        }}>
          {wallets.map((w) => (
            <button
              key={w.name}
              onClick={() => router.push("/gov-v1/governance/propose?type=normal")}
              style={{
                display: "flex", alignItems: "center", gap: "14px",
                background: "white", borderRadius: "20px",
                padding: "16px 20px",
                border: "none", cursor: "pointer",
                textAlign: "left", width: "100%",
              }}
            >
              {/* Icon */}
              <div style={{
                width: 44, height: 44, borderRadius: "50%",
                background: w.color,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <span style={{
                  fontSize: "18px", fontWeight: 700, color: "white", fontFamily: FONT,
                }}>
                  {w.letter}
                </span>
              </div>

              {/* Label */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: "16px", fontWeight: 600, color: "#0a0d10",
                  fontFamily: FONT, marginBottom: "2px",
                }}>
                  {w.name}
                </div>
                <div style={{
                  fontSize: "13px", fontWeight: 300, color: "#999",
                  fontFamily: FONT,
                }}>
                  {w.description}
                </div>
              </div>

              {/* Arrow */}
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                background: "#0151af",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <ArrowRight size={14} color="white" strokeWidth={2} />
              </div>
            </button>
          ))}
        </div>

        {/* Footer note */}
        <p style={{
          fontSize: "13px", fontWeight: 300, color: "#aaa",
          fontFamily: FONT, textAlign: "center",
          margin: "20px 0 0", lineHeight: 1.6,
        }}>
          By connecting a wallet you agree to the{" "}
          <span style={{ color: "#0151af", cursor: "pointer" }}>Terms of Service</span>
        </p>

      </div>
    </div>
  )
}
