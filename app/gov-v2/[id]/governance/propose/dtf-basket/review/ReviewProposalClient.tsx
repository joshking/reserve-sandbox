"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Asterisk, FileText, Pen, ArrowRight, RotateCcw, Turtle, Rabbit, Info } from "lucide-react"

const FONT = "'TWK Lausanne', system-ui, sans-serif"
const CREAM = "#f9eddd"
const OFF_WHITE = "#fefbf8"
const BLUE = "#0151af"

// ── Proposed Changes Data ─────────────────────────────────────────────────────

const PROPOSED_CHANGES = [
  {
    section: "Basics Update",
    isExpedited: true,
    changes: [
      { field: "Mint Fee", from: "1 day", to: "12 hours" },
      { field: "TVL Fee", from: "0.5%", to: "0.75%" },
    ],
  },
  {
    section: "Governance Parameters",
    isExpedited: false,
    changes: [
      { field: "Voting Delay", from: "2 days", to: "1 day" },
      { field: "Voting Period", from: "3 days", to: "2 days" },
    ],
  },
]

// ── Change Block ──────────────────────────────────────────────────────────────

function ChangeBlock({ field, from, to }: { field: string; from: string; to: string }) {
  return (
    <div style={{
      background: "#f5f4f2",
      border: "1px solid #e6e6e6",
      borderRadius: "16px",
      padding: "20px 24px",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <Pen size={20} color="#999" />
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{
              fontSize: "14px", fontWeight: 700, color: "#333",
              fontFamily: FONT, lineHeight: "18px", marginBottom: "2px",
            }}>
              {field}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "14px", fontWeight: 300, color: "#333", fontFamily: FONT, lineHeight: "18px" }}>
                {from}
              </span>
              <ArrowRight size={14} color="#999" />
              <span style={{ fontSize: "14px", fontWeight: 700, color: BLUE, fontFamily: FONT, lineHeight: "18px" }}>
                {to}
              </span>
            </div>
          </div>
          <button style={{
            width: "30px", height: "30px",
            background: "white",
            border: "1px solid #e5e5e5",
            borderRadius: "6px",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", flexShrink: 0,
          }}>
            <RotateCcw size={13} color="#999" />
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Proposed Changes Panel ────────────────────────────────────────────────────

function ProposedChangesPanel() {
  return (
    <div style={{
      background: "white",
      border: "4px solid #f9eddd",
      borderRadius: "24px",
      padding: "24px",
      display: "flex",
      flexDirection: "column",
      gap: "16px",
    }}>
      <span style={{
        fontSize: "16px", fontWeight: 700, color: BLUE,
        fontFamily: FONT, lineHeight: "17px",
      }}>
        Proposed Changes
      </span>

      {PROPOSED_CHANGES.map((group) => (
        <div key={group.section} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <FileText size={18} color="#333" />
            <span style={{
              fontSize: "14px", fontWeight: 700, color: "#333",
              fontFamily: FONT, lineHeight: "18px",
            }}>
              {group.section}
            </span>
            {group.isExpedited && <Rabbit size={18} color="#666" />}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {group.changes.map((change, i) => (
              <ChangeBlock key={i} field={change.field} from={change.from} to={change.to} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Steps Panel ───────────────────────────────────────────────────────────────

function StepsPanel({ onBack }: { onBack: () => void }) {
  return (
    <div style={{
      background: CREAM, borderRadius: "24px", padding: "4px",
    }}>
      <div style={{ background: "white", borderRadius: "20px" }}>
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "24px", borderBottom: "1px solid #e5e5e5",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{
              width: "24px", height: "24px", borderRadius: "50%",
              background: "linear-gradient(225deg, #0955AC 0%, #000 100%)",
              flexShrink: 0,
            }} />
            <span style={{
              fontSize: "16px", fontWeight: 700, color: "#0a0d10",
              fontFamily: FONT, lineHeight: "20px",
            }}>
              $BGCI Proposal
            </span>
          </div>
          <button
            onClick={onBack}
            style={{
              padding: "5px 14px", border: "1px solid #e5e5e5",
              borderRadius: "42px", background: "none",
              fontSize: "14px", fontWeight: 500, color: "#d05a67",
              cursor: "pointer", fontFamily: FONT,
            }}
          >
            Cancel
          </button>
        </div>

        {/* Step 1: Configure proposal (done) */}
        <div style={{ position: "relative", padding: "10px 24px 10px 56px" }}>
          <div style={{
            position: "absolute", left: "35.5px", top: "calc(50% + 12px)",
            bottom: 0, width: "1px", background: "#e5e5e5",
          }} />
          <div style={{
            position: "absolute", left: "24px", top: "50%", transform: "translateY(-50%)",
            width: "24px", height: "24px", borderRadius: "50%",
            border: `1px solid ${BLUE}`, display: "flex", alignItems: "center",
            justifyContent: "center", background: "white", zIndex: 1,
          }}>
            <Asterisk size={12} color={BLUE} />
          </div>
          <span style={{ fontSize: "16px", fontWeight: 300, color: BLUE, fontFamily: FONT, lineHeight: "17px" }}>
            Configure proposal
          </span>
        </div>

        {/* Step 2: Finalize basket proposal (done) + Edit button */}
        <div style={{ position: "relative", padding: "8px 24px 14px 56px" }}>
          <div style={{
            position: "absolute", left: "35.5px", top: 0,
            width: "1px", height: "8px", background: "#e5e5e5",
          }} />
          <div style={{
            position: "absolute", left: "35.5px", top: "32px",
            bottom: 0, width: "1px", background: "#e5e5e5",
          }} />
          <div style={{
            position: "absolute", left: "24px", top: "8px",
            width: "24px", height: "24px", borderRadius: "50%",
            border: `1px solid ${BLUE}`, display: "flex", alignItems: "center",
            justifyContent: "center", background: "white", zIndex: 1,
          }}>
            <Asterisk size={12} color={BLUE} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <span style={{ fontSize: "16px", fontWeight: 300, color: BLUE, fontFamily: FONT, lineHeight: "17px" }}>
              Finalize basket proposal
            </span>
            <button
              onClick={onBack}
              style={{
                width: "100%", padding: "16px",
                background: "white",
                color: BLUE,
                border: `2px solid ${BLUE}`,
                borderRadius: "6px",
                fontSize: "16px", fontWeight: 500, fontFamily: FONT,
                cursor: "pointer", lineHeight: "16px", textAlign: "center",
              }}
            >
              Edit proposal
            </button>
          </div>
        </div>

        {/* Step 3: Review & describe (current) + two buttons */}
        <div style={{ position: "relative", padding: "8px 24px 20px 56px" }}>
          <div style={{
            position: "absolute", left: "35.5px", top: 0,
            width: "1px", height: "8px", background: "#e5e5e5",
          }} />
          <div style={{
            position: "absolute", left: "24px", top: "8px",
            width: "24px", height: "24px", borderRadius: "50%",
            border: `1px solid ${BLUE}`, display: "flex", alignItems: "center",
            justifyContent: "center", background: "white", zIndex: 1,
          }}>
            <Asterisk size={12} color={BLUE} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <span style={{ fontSize: "16px", fontWeight: 300, color: "#0a0d10", fontFamily: FONT, lineHeight: "17px" }}>
              Review &amp; describe your proposal
            </span>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <button style={{
                width: "100%", padding: "16px",
                background: "white",
                color: BLUE,
                border: `2px solid ${BLUE}`,
                borderRadius: "6px",
                fontSize: "16px", fontWeight: 500, fontFamily: FONT,
                cursor: "pointer", lineHeight: "16px", textAlign: "center",
              }}>
                Simulate proposal
              </button>
              <button
                onClick={() => router.push(`/gov-v2/${params.id}/governance/proposal/rebalance-test`)}
                style={{
                  width: "100%", padding: "16px",
                  background: BLUE,
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "16px", fontWeight: 500, fontFamily: FONT,
                  cursor: "pointer", lineHeight: "16px", textAlign: "center",
                }}
              >
                Submit proposal onchain
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Proposal Type Option ──────────────────────────────────────────────────────

function ProposalTypeOption({
  icon,
  title,
  description,
  selected,
  onSelect,
  isLast,
}: {
  icon: React.ReactNode
  title: string
  description: string
  selected: boolean
  onSelect: () => void
  isLast: boolean
}) {
  return (
    <button
      onClick={onSelect}
      style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        width: "100%", padding: "20px 24px",
        background: selected ? "#f0f5ff" : "white",
        border: "none",
        borderBottom: isLast ? "none" : "1px solid #e5e5e5",
        cursor: "pointer", textAlign: "left", gap: "12px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1 }}>
        <div style={{
          width: "40px", height: "40px", borderRadius: "50%",
          border: "1px solid #e5e5e5",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0, color: "#333",
        }}>
          {icon}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
          <span style={{
            fontSize: "16px", fontWeight: 700, color: "#0a0d10",
            fontFamily: FONT, lineHeight: "1.25",
          }}>
            {title}
          </span>
          <span style={{
            fontSize: "14px", fontWeight: 300, color: "#666",
            fontFamily: FONT, lineHeight: "18px",
          }}>
            {description}
          </span>
        </div>
      </div>
      <div style={{
        width: "28px", height: "28px", borderRadius: "50%",
        border: `1px solid ${selected ? BLUE : "#e5e5e5"}`,
        background: selected ? BLUE : "transparent",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>
        {selected && (
          <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "white" }} />
        )}
      </div>
    </button>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ReviewProposalClient() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const [proposalTitle, setProposalTitle] = useState("")
  const [rfcLink, setRfcLink] = useState("")
  const [description, setDescription] = useState("")
  const [proposalType, setProposalType] = useState<"slow" | "fast" | null>(null)

  return (
    <>
      {/* Left column */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>

        {/* Form card */}
        <div style={{ background: CREAM, borderRadius: "24px", padding: "4px" }}>
          <div style={{
            background: OFF_WHITE, borderRadius: "20px",
            padding: "24px 8px 8px",
            display: "flex", flexDirection: "column", gap: "16px",
          }}>
            {/* Proposal title */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", padding: "0 16px" }}>
              <label style={{
                fontSize: "16px", fontWeight: 300, color: "#666",
                fontFamily: FONT, lineHeight: "17px",
              }}>
                Proposal title
              </label>
              <input
                value={proposalTitle}
                onChange={(e) => setProposalTitle(e.target.value)}
                placeholder="Input proposal title"
                style={{
                  width: "100%", padding: "16px",
                  border: "1px solid #e5e5e5", borderRadius: "6px",
                  background: "white",
                  fontSize: "16px", fontWeight: 300, color: "#0a0d10",
                  fontFamily: FONT, lineHeight: "17px",
                  outline: "none", boxSizing: "border-box",
                }}
              />
            </div>

            {/* RFC link */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", padding: "0 16px" }}>
              <label style={{
                fontSize: "16px", fontWeight: 300, color: "#666",
                fontFamily: FONT, lineHeight: "17px",
              }}>
                RFC
              </label>
              <input
                value={rfcLink}
                onChange={(e) => setRfcLink(e.target.value)}
                placeholder="Input RFC link"
                style={{
                  width: "100%", padding: "16px",
                  border: "1px solid #e5e5e5", borderRadius: "6px",
                  background: "white",
                  fontSize: "16px", fontWeight: 300, color: "#0a0d10",
                  fontFamily: FONT, lineHeight: "17px",
                  outline: "none", boxSizing: "border-box",
                }}
              />
            </div>

            {/* Description */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", padding: "0 8px" }}>
              <label style={{
                fontSize: "16px", fontWeight: 300, color: "#666",
                fontFamily: FONT, lineHeight: "17px",
                paddingLeft: "8px",
              }}>
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your proposal..."
                rows={8}
                style={{
                  width: "100%", padding: "16px",
                  border: "1px solid #e5e5e5", borderRadius: "12px",
                  background: "white",
                  fontSize: "16px", fontWeight: 300, color: "#0a0d10",
                  fontFamily: FONT, lineHeight: "1.6",
                  outline: "none", resize: "vertical",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>
        </div>

        {/* Select Proposal Type */}
        <div style={{ background: CREAM, borderRadius: "24px", padding: "4px" }}>
          <div style={{ background: OFF_WHITE, borderRadius: "20px", overflow: "hidden" }}>
            <div style={{ padding: "24px 24px 16px" }}>
              <span style={{
                fontSize: "20px", fontWeight: 700, color: BLUE,
                fontFamily: FONT, lineHeight: "23px",
              }}>
                Select Proposal Type
              </span>
            </div>

            {/* Options */}
            <div style={{
              background: "white", borderRadius: "12px",
              margin: "0 8px 8px",
              boxShadow: "0px 10px 38px 6px rgba(0,0,0,0.05)",
              overflow: "hidden",
            }}>
              <ProposalTypeOption
                icon={<Turtle size={20} />}
                title="Slow Governance"
                description="Governance with an execution delay GREATER THAN the 1 week unstaking delay"
                selected={proposalType === "slow"}
                onSelect={() => setProposalType("slow")}
                isLast={false}
              />
              <ProposalTypeOption
                icon={<Rabbit size={20} />}
                title="Fast Governance"
                description="Governance that end-to-end is suitable for rebalances (assumption: <1 week)"
                selected={proposalType === "fast"}
                onSelect={() => setProposalType("fast")}
                isLast
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right column */}
      <div style={{
        width: 380,
        flexShrink: 0,
        position: "sticky",
        top: "16px",
        alignSelf: "flex-start",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}>
        <StepsPanel onBack={() => router.back()} />
        <ProposedChangesPanel />
      </div>
    </>
  )
}
