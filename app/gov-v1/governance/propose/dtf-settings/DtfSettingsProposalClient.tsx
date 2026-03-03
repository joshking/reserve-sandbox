"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Asterisk, ChevronDown, Info, ImageIcon, Zap, X, Hash, Clock, Landmark, RefreshCw, Timer, Layers, Pause, CalendarDays, FileText, ShieldCheck } from "lucide-react"

const FONT = "'TWK Lausanne', system-ui, sans-serif"
const CREAM = "#f9eddd"
const OFF_WHITE = "#fefbf8"
const BLUE = "#0151af"

const SECTIONS = [
  "Basics",
  "Roles",
  "Fees & Distribution",
  "Auctions",
  "Remove Dust Tokens",
  "Governance",
]

type RoleId = "guardian" | "brandManager" | "auctionLauncher"

type RoleDef = {
  id: RoleId
  label: string
  icon: React.ReactNode
  description: React.ReactNode
  addLabel: string
}

const ROLES: RoleDef[] = [
  {
    id: "guardian",
    label: "Guardian",
    icon: <Info size={16} />,
    description: (
      <>
        A trusted actor that can veto any proposal prior to execution.{" "}
        <span style={{ color: BLUE, cursor: "pointer" }}>Use connected wallet.</span>
      </>
    ),
    addLabel: "Add additional guardian",
  },
  {
    id: "brandManager",
    label: "Brand Manager",
    icon: <ImageIcon size={16} />,
    description: (
      <>
        A trusted actor that can manage social links and appearances of the DTF in the Register UI.
        This gives brand manager ability to update things on{" "}
        <span style={{ color: BLUE, cursor: "pointer" }}>Reserve.org</span> but no protocol level
        controls.{" "}
        <span style={{ color: BLUE, cursor: "pointer" }}>Use connected wallet.</span>
      </>
    ),
    addLabel: "Add additional brand manager",
  },
  {
    id: "auctionLauncher",
    label: "Auction launcher",
    icon: <Zap size={16} />,
    description: (
      <>
        A trusted actor responsible for launching auctions that are approved by governance.{" "}
        <span style={{ color: BLUE, cursor: "pointer" }}>Use connected wallet.</span>
      </>
    ),
    addLabel: "Add additional auction launcher",
  },
]

function RoleSection({
  role,
  addresses,
  onAdd,
  onRemove,
  onChange,
}: {
  role: RoleDef
  addresses: string[]
  onAdd: () => void
  onRemove: (index: number) => void
  onChange: (index: number, value: string) => void
}) {
  return (
    <div
      style={{
        border: "1px solid #e5e5e5",
        borderRadius: "16px",
        overflow: "hidden",
      }}
    >
      {/* Role header */}
      <div style={{ padding: "16px 16px 12px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              border: "1px solid #e5e5e5",
              color: "#333",
              flexShrink: 0,
              marginTop: "2px",
            }}
          >
            {role.icon}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <span
              style={{
                fontSize: "16px",
                fontWeight: 700,
                color: "#0a0d10",
                lineHeight: "20px",
                fontFamily: FONT,
              }}
            >
              {role.label}
            </span>
            <span
              style={{
                fontSize: "14px",
                fontWeight: 300,
                color: "#666",
                lineHeight: "20px",
                fontFamily: FONT,
              }}
            >
              {role.description}
            </span>
          </div>
        </div>
      </div>

      {/* Address inputs */}
      <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: "8px" }}>
        {addresses.map((addr, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "#f5f5f5",
                border: "1px solid #e5e5e5",
                borderRadius: "12px",
                padding: "12px 16px",
                gap: "8px",
              }}
            >
              <input
                value={addr}
                onChange={(e) => onChange(i, e.target.value)}
                placeholder="0x..."
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  fontSize: "14px",
                  fontWeight: 300,
                  fontFamily: "monospace",
                  color: "#0a0d10",
                  minWidth: 0,
                }}
              />
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: 300,
                  color: "#999",
                  fontFamily: FONT,
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                {i === 0 ? "Address" : `Address ${i + 1}`}
              </span>
            </div>
            {i > 0 && (
              <button
                onClick={() => onRemove(i)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  border: "1px solid #e5e5e5",
                  background: "transparent",
                  color: "#666",
                  cursor: "pointer",
                  flexShrink: 0,
                  padding: 0,
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Add button */}
      <div style={{ padding: "12px 16px 16px" }}>
        <button
          onClick={onAdd}
          style={{
            width: "100%",
            padding: "14px",
            background: "#f5f5f5",
            border: "none",
            borderRadius: "12px",
            fontSize: "14px",
            fontWeight: 500,
            color: BLUE,
            fontFamily: FONT,
            cursor: "pointer",
            textAlign: "center",
          }}
        >
          + {role.addLabel}
        </button>
      </div>
    </div>
  )
}

// ─── Fees & Distribution ────────────────────────────────────────────────────

const FEE_PRESETS = [0.15, 0.3, 0.5, 1, 2]

function FeeTypeCard({
  icon,
  title,
  description,
  value,
  onChange,
}: {
  icon: React.ReactNode
  title: string
  description: string
  value: number
  onChange: (v: number) => void
}) {
  return (
    <div
      style={{
        border: "1px solid #e5e5e5",
        borderRadius: "16px",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            border: "1px solid #e5e5e5",
            color: "#333",
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
        <span
          style={{ fontSize: "16px", fontWeight: 700, color: "#0a0d10", fontFamily: FONT }}
        >
          {title}
        </span>
      </div>
      <p style={{ margin: 0, fontSize: "13px", fontWeight: 300, color: "#666", lineHeight: "18px", fontFamily: FONT }}>
        {description}
      </p>
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        {/* Preset buttons */}
        <div
          style={{
            display: "flex",
            background: "#f5f5f5",
            borderRadius: "8px",
            padding: "3px",
            gap: "2px",
          }}
        >
          {FEE_PRESETS.map((p) => (
            <button
              key={p}
              onClick={() => onChange(p)}
              style={{
                padding: "8px 10px",
                borderRadius: "6px",
                border: "none",
                background: value === p ? "white" : "transparent",
                color: value === p ? BLUE : "#666",
                fontWeight: value === p ? 700 : 300,
                fontFamily: FONT,
                fontSize: "14px",
                cursor: "pointer",
                whiteSpace: "nowrap",
                boxShadow: value === p ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
              }}
            >
              {p}%
            </button>
          ))}
        </div>
        {/* Custom input */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            border: "1px solid #e5e5e5",
            borderRadius: "12px",
            padding: "10px 16px",
            background: "white",
            gap: "8px",
          }}
        >
          <input
            type="number"
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              fontSize: "16px",
              fontFamily: FONT,
              color: "#0a0d10",
              background: "transparent",
              minWidth: 0,
            }}
          />
          <span style={{ color: "#999", fontSize: "16px", fontFamily: FONT }}>%</span>
        </div>
      </div>
    </div>
  )
}

function DistributionRow({
  icon,
  title,
  description,
  displayValue,
  inputValue,
  onChange,
  fixed,
}: {
  icon: React.ReactNode
  title: string
  description: string
  displayValue?: string
  inputValue?: string
  onChange?: (v: string) => void
  fixed?: boolean
}) {
  return (
    <div
      style={{
        border: "1px solid #e5e5e5",
        borderRadius: "16px",
        padding: "14px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "16px",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            border: "1px solid #e5e5e5",
            color: "#333",
            flexShrink: 0,
            marginTop: "1px",
          }}
        >
          {icon}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px", minWidth: 0 }}>
          <span style={{ fontSize: "16px", fontWeight: 700, color: "#0a0d10", fontFamily: FONT }}>
            {title}
          </span>
          <span style={{ fontSize: "13px", fontWeight: 300, color: "#666", lineHeight: "18px", fontFamily: FONT }}>
            {description}
          </span>
        </div>
      </div>

      {fixed ? (
        <span
          style={{
            fontSize: "16px",
            fontWeight: 700,
            color: "#333",
            fontFamily: FONT,
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          {displayValue}
        </span>
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            border: "1px solid #e5e5e5",
            borderRadius: "12px",
            padding: "10px 14px",
            gap: "6px",
            width: "110px",
            flexShrink: 0,
          }}
        >
          <input
            type="number"
            value={inputValue}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder="0"
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              fontSize: "15px",
              fontFamily: FONT,
              color: "#0a0d10",
              background: "transparent",
              minWidth: 0,
              width: "60px",
            }}
          />
          <span style={{ color: "#999", fontSize: "15px", fontFamily: FONT }}>%</span>
        </div>
      )}
    </div>
  )
}

function FeesContent() {
  const [tvlFee, setTvlFee] = useState(0.3)
  const [mintFee, setMintFee] = useState(0.3)
  const [creatorPct, setCreatorPct] = useState("")
  const [governancePct, setGovernancePct] = useState("")
  const [recipients, setRecipients] = useState<{ address: string; pct: string }[]>([])

  const PLATFORM = 33
  const totalUsed =
    PLATFORM +
    (parseFloat(creatorPct) || 0) +
    (parseFloat(governancePct) || 0) +
    recipients.reduce((s, r) => s + (parseFloat(r.pct) || 0), 0)
  const remaining = parseFloat((100 - totalUsed).toFixed(4))
  const remainingColor = remaining === 0 ? "#22c55e" : remaining < 0 ? "#d05a67" : "#666"

  function addRecipient() {
    setRecipients((prev) => [...prev, { address: "", pct: "" }])
  }
  function removeRecipient(i: number) {
    setRecipients((prev) => prev.filter((_, idx) => idx !== i))
  }
  function updateRecipient(i: number, field: "address" | "pct", value: string) {
    setRecipients((prev) => {
      const next = [...prev]
      next[i] = { ...next[i], [field]: value }
      return next
    })
  }
  function evenDistribution() {
    const editableCount = 2 + recipients.length
    if (editableCount === 0) return
    const share = parseFloat(((100 - PLATFORM) / editableCount).toFixed(4)).toString()
    setCreatorPct(share)
    setGovernancePct(share)
    setRecipients((prev) => prev.map((r) => ({ ...r, pct: share })))
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Intro */}
      <p style={{ margin: 0, fontSize: "14px", fontWeight: 300, color: "#666", lineHeight: "20px", fontFamily: FONT }}>
        Index DTF generate revenue by charging fees for minting and holding the DTF. Revenue
        generated from fees can be sent to the DTF&apos;s creator, the vote-lock DAO, or any
        arbitrary address (wallet or smart contract). A portion of this revenue will automatically
        be sent to the protocol based on the TVL of the DTF. You can see a complete list of the
        platform fee schedule{" "}
        <span style={{ color: BLUE, cursor: "pointer" }}>here</span>.
      </p>

      <FeeTypeCard
        icon={<Hash size={16} />}
        title="Annualized TVL Fee"
        description="A percentage-based fee charged by the DTF based on the total value of the tokens held in the contract. The platform will keep 50% of revenue from this fee. (Min: 0.15%, Max: 10%)"
        value={tvlFee}
        onChange={setTvlFee}
      />

      <FeeTypeCard
        icon={<Clock size={16} />}
        title="Mint Fee"
        description="A one-time fee deducted from the tokens a user receives when they mint the DTF. The platform will keep 50% of revenue from this fee. (Min: 0.15%, Max: 5%)"
        value={mintFee}
        onChange={setMintFee}
      />

      {/* Fee Distribution */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <div>
          <h3 style={{ margin: "0 0 8px", fontSize: "20px", fontWeight: 700, color: BLUE, fontFamily: FONT }}>
            Fee Distribution
          </h3>
          <p style={{ margin: 0, fontSize: "14px", fontWeight: 300, color: "#666", lineHeight: "20px", fontFamily: FONT }}>
            Define what portion of the revenue goes to the DTF&apos;s creator, the vote-lock DAO,
            or any arbitrary address (wallet or smart contract).
          </p>
        </div>

        <div style={{ textAlign: "right", fontSize: "13px", fontFamily: FONT }}>
          <span style={{ color: "#999" }}>Remaining allocation: </span>
          <span style={{ color: remainingColor, fontWeight: 500 }}>{remaining}%</span>
        </div>

        <DistributionRow
          icon={<Asterisk size={16} />}
          title="Platform"
          description="Percentage of fee revenue sent to the protocol; cannot be changed by governance."
          displayValue="33 %"
          fixed
        />
        <DistributionRow
          icon={<Landmark size={16} />}
          title="Creator"
          description="Percentage of fee revenue sent to the creator of the DTF."
          inputValue={creatorPct}
          onChange={setCreatorPct}
        />
        <DistributionRow
          icon={<RefreshCw size={16} />}
          title="Governance"
          description="Percentage of fee revenue sent to the vote-lock DAO governing the DTF."
          inputValue={governancePct}
          onChange={setGovernancePct}
        />

        {/* Custom recipients */}
        {recipients.map((r, i) => (
          <div key={i} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "#f5f5f5",
                border: "1px solid #e5e5e5",
                borderRadius: "12px",
                padding: "12px 16px",
                gap: "8px",
              }}
            >
              <input
                value={r.address}
                onChange={(e) => updateRecipient(i, "address", e.target.value)}
                placeholder="0x..."
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  fontSize: "14px",
                  fontFamily: "monospace",
                  color: "#0a0d10",
                  minWidth: 0,
                }}
              />
              <span style={{ fontSize: "13px", fontWeight: 300, color: "#999", fontFamily: FONT, whiteSpace: "nowrap", flexShrink: 0 }}>
                {`Recipient ${i + 1} address`}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: "#f5f5f5",
                border: "1px solid #e5e5e5",
                borderRadius: "12px",
                padding: "12px 14px",
                gap: "6px",
                width: "110px",
                flexShrink: 0,
              }}
            >
              <input
                type="number"
                value={r.pct}
                onChange={(e) => updateRecipient(i, "pct", e.target.value)}
                placeholder="0"
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  fontSize: "14px",
                  fontFamily: FONT,
                  color: "#0a0d10",
                  minWidth: 0,
                }}
              />
              <span style={{ fontSize: "14px", color: "#999", fontFamily: FONT }}>%</span>
            </div>
            <button
              onClick={() => removeRecipient(i)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                border: "1px solid #e5e5e5",
                background: "transparent",
                color: "#666",
                cursor: "pointer",
                flexShrink: 0,
                padding: 0,
              }}
            >
              <X size={14} />
            </button>
          </div>
        ))}

        {/* Bottom actions */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "4px 0",
          }}
        >
          <button
            onClick={addRecipient}
            style={{
              background: "transparent",
              border: "none",
              color: BLUE,
              fontSize: "14px",
              fontWeight: 500,
              fontFamily: FONT,
              cursor: "pointer",
              padding: 0,
            }}
          >
            + Add additional recipients
          </button>
          <button
            onClick={evenDistribution}
            style={{
              background: "transparent",
              border: "none",
              color: BLUE,
              fontSize: "14px",
              fontWeight: 500,
              fontFamily: FONT,
              cursor: "pointer",
              padding: 0,
            }}
          >
            Even distribution
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Auctions ────────────────────────────────────────────────────────────────

const AUCTION_LENGTH_PRESETS = [15, 30, 45]

function AuctionsContent() {
  const [auctionLength, setAuctionLength] = useState(30)
  const [weightControl, setWeightControl] = useState(false)

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {/* Auction length card */}
      <div
        style={{
          border: "1px solid #e5e5e5",
          borderRadius: "16px",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              border: "1px solid #e5e5e5",
              color: "#333",
              flexShrink: 0,
              marginTop: "2px",
            }}
          >
            <Timer size={16} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <span style={{ fontSize: "16px", fontWeight: 700, color: "#0a0d10", fontFamily: FONT, lineHeight: "20px" }}>
              Auction length
            </span>
            <span style={{ fontSize: "14px", fontWeight: 300, color: "#666", lineHeight: "20px", fontFamily: FONT }}>
              How long dutch auctions will run when swapping tokens out of the basket. Shorter
              auction lengths benefit from less market volatility affecting the price during the
              auction. Longer auctions benefit from having more time for discovering the best price
              when swapping two tokens.
            </span>
          </div>
        </div>

        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {/* Preset buttons */}
          <div
            style={{
              display: "flex",
              background: "#f5f5f5",
              borderRadius: "8px",
              padding: "3px",
              gap: "2px",
            }}
          >
            {AUCTION_LENGTH_PRESETS.map((p) => (
              <button
                key={p}
                onClick={() => setAuctionLength(p)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "6px",
                  border: "none",
                  background: auctionLength === p ? "white" : "transparent",
                  color: auctionLength === p ? BLUE : "#666",
                  fontWeight: auctionLength === p ? 700 : 300,
                  fontFamily: FONT,
                  fontSize: "14px",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  boxShadow: auctionLength === p ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                }}
              >
                {p}m
              </button>
            ))}
          </div>

          {/* Custom input */}
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              border: "1px solid #e5e5e5",
              borderRadius: "12px",
              padding: "10px 16px",
              background: "white",
              gap: "8px",
            }}
          >
            <input
              type="number"
              value={auctionLength}
              onChange={(e) => setAuctionLength(parseInt(e.target.value) || 0)}
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                fontSize: "16px",
                fontFamily: FONT,
                color: "#0a0d10",
                background: "transparent",
                minWidth: 0,
              }}
            />
            <span style={{ color: "#999", fontSize: "16px", fontFamily: FONT, whiteSpace: "nowrap" }}>
              minutes
            </span>
          </div>
        </div>
      </div>

      {/* Weight control card */}
      <div
        style={{
          border: "1px solid #e5e5e5",
          borderRadius: "16px",
          padding: "16px",
          display: "flex",
          alignItems: "flex-start",
          gap: "12px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            border: "1px solid #e5e5e5",
            color: "#333",
            flexShrink: 0,
            marginTop: "2px",
          }}
        >
          <Layers size={16} />
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
          <span style={{ fontSize: "16px", fontWeight: 700, color: "#0a0d10", fontFamily: FONT, lineHeight: "20px" }}>
            Weight control
          </span>
          <span style={{ fontSize: "14px", fontWeight: 300, color: "#666", lineHeight: "20px", fontFamily: FONT }}>
            Allowing the weight control will allow the rebalance to adjust the weights of the tokens
            in the basket, turning this off is recommended for tracking DTFs.
          </span>
        </div>
        {/* Toggle */}
        <button
          onClick={() => setWeightControl((v) => !v)}
          style={{
            flexShrink: 0,
            width: "44px",
            height: "24px",
            borderRadius: "12px",
            border: "none",
            background: weightControl ? BLUE : "#d1d5db",
            cursor: "pointer",
            position: "relative",
            transition: "background 0.2s ease",
            padding: 0,
            marginTop: "2px",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "2px",
              left: weightControl ? "22px" : "2px",
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              background: "white",
              transition: "left 0.2s ease",
              boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
            }}
          />
        </button>
      </div>
    </div>
  )
}

// ─── Governance Parameters ───────────────────────────────────────────────────

type GovPreset = { label: string; value: number }

function GovernanceParamCard({
  icon,
  title,
  description,
  presets,
  value,
  onChange,
  unit,
}: {
  icon: React.ReactNode
  title: string
  description: React.ReactNode
  presets: GovPreset[]
  value: number
  onChange: (v: number) => void
  unit: string
}) {
  return (
    <div
      style={{
        border: "1px solid #e5e5e5",
        borderRadius: "16px",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            border: "1px solid #e5e5e5",
            color: "#333",
            flexShrink: 0,
            marginTop: "2px",
          }}
        >
          {icon}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <span style={{ fontSize: "16px", fontWeight: 700, color: "#0a0d10", fontFamily: FONT, lineHeight: "20px" }}>
            {title}
          </span>
          <span style={{ fontSize: "14px", fontWeight: 300, color: "#666", lineHeight: "20px", fontFamily: FONT }}>
            {description}
          </span>
        </div>
      </div>

      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        {/* Preset buttons */}
        <div
          style={{
            display: "flex",
            background: "#f5f5f5",
            borderRadius: "8px",
            padding: "3px",
            gap: "2px",
          }}
        >
          {presets.map((p) => (
            <button
              key={p.value}
              onClick={() => onChange(p.value)}
              style={{
                padding: "8px 12px",
                borderRadius: "6px",
                border: "none",
                background: value === p.value ? "white" : "transparent",
                color: value === p.value ? BLUE : "#666",
                fontWeight: value === p.value ? 700 : 300,
                fontFamily: FONT,
                fontSize: "13px",
                cursor: "pointer",
                whiteSpace: "nowrap",
                boxShadow: value === p.value ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Custom input */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            border: "1px solid #e5e5e5",
            borderRadius: "12px",
            padding: "10px 16px",
            background: "white",
            gap: "8px",
          }}
        >
          <input
            type="number"
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              fontSize: "16px",
              fontFamily: FONT,
              color: "#0a0d10",
              background: "transparent",
              minWidth: 0,
            }}
          />
          <span style={{ color: "#999", fontSize: "16px", fontFamily: FONT, whiteSpace: "nowrap" }}>
            {unit}
          </span>
        </div>
      </div>
    </div>
  )
}

function GovernanceContent() {
  const [votingDelay, setVotingDelay] = useState(2)
  const [votingPeriod, setVotingPeriod] = useState(3)
  const [proposalThreshold, setProposalThreshold] = useState(1)
  const [votingQuorum, setVotingQuorum] = useState(10)
  const [executionDelay, setExecutionDelay] = useState(2)

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <div>
        <h3 style={{ margin: "0 0 8px", fontSize: "20px", fontWeight: 700, color: BLUE, fontFamily: FONT }}>
          Governance Parameters
        </h3>
        <p style={{ margin: 0, fontSize: "14px", fontWeight: 300, color: "#666", lineHeight: "20px", fontFamily: FONT }}>
          Configure the governance parameters that control how proposals are created, voted on, and
          executed. These settings apply to all governance actions except basket changes, which have
          their own separate parameters.
        </p>
      </div>

      <GovernanceParamCard
        icon={<Pause size={16} />}
        title="Voting Delay"
        description="The time between a proposal being submitted and when governors can cast their votes."
        presets={[
          { label: "12 hours", value: 0.5 },
          { label: "1 day", value: 1 },
          { label: "1 day 12 hours", value: 1.5 },
          { label: "2 days", value: 2 },
        ]}
        value={votingDelay}
        onChange={setVotingDelay}
        unit="days"
      />

      <GovernanceParamCard
        icon={<CalendarDays size={16} />}
        title="Voting Period"
        description="How long governors have to cast their votes on a proposal after the voting delay."
        presets={[
          { label: "1 day", value: 1 },
          { label: "2 days", value: 2 },
          { label: "3 days", value: 3 },
          { label: "4 days", value: 4 },
        ]}
        value={votingPeriod}
        onChange={setVotingPeriod}
        unit="days"
      />

      <GovernanceParamCard
        icon={<FileText size={16} />}
        title="Proposal Threshold"
        description="The minimum percentage of governance power needed in order to initiate a proposal."
        presets={[
          { label: "0.01%", value: 0.01 },
          { label: "0.1%", value: 0.1 },
          { label: "1%", value: 1 },
          { label: "10%", value: 10 },
        ]}
        value={proposalThreshold}
        onChange={setProposalThreshold}
        unit="%"
      />

      <GovernanceParamCard
        icon={<ShieldCheck size={16} />}
        title="Voting Quorum"
        description={
          <>
            The minimum percentage of votes that must be cast as <strong>yes</strong> or{" "}
            <strong>abstain</strong> in order for the proposal to be eligible to pass (
            <strong>yes</strong> votes still must outnumber <strong>no</strong> votes in order to
            pass the proposal).
          </>
        }
        presets={[
          { label: "10%", value: 10 },
          { label: "15%", value: 15 },
          { label: "20%", value: 20 },
          { label: "25%", value: 25 },
        ]}
        value={votingQuorum}
        onChange={setVotingQuorum}
        unit="%"
      />

      <GovernanceParamCard
        icon={<Clock size={16} />}
        title="Execution Delay"
        description="The time period between when a proposal is approved and when it can be executed."
        presets={[
          { label: "12 hours", value: 0.5 },
          { label: "1 day", value: 1 },
          { label: "1 day 12 hours", value: 1.5 },
          { label: "2 days", value: 2 },
        ]}
        value={executionDelay}
        onChange={setExecutionDelay}
        unit="days"
      />
    </div>
  )
}

// ─── Proposal steps ──────────────────────────────────────────────────────────

type StepType = "text-done" | "text-pending" | "cta-primary" | "cta-disabled"

const STEPS: { label: string; type: StepType }[] = [
  { label: "Configure proposal", type: "text-done" },
  { label: "Finalize basket proposal", type: "text-done" },
  { label: "Confirm & prepare proposal", type: "cta-primary" },
  { label: "Review & describe your proposal", type: "text-pending" },
  { label: "Simulate proposal", type: "cta-disabled" },
  { label: "Submit onchain", type: "cta-disabled" },
]

const CHANGES = [
  { count: 3, section: "Roles" },
  { count: 1, section: "Governance" },
]

function StepRow({
  label,
  type,
  isFirst,
  isLast,
  onClick,
}: {
  label: string
  type: StepType
  isFirst: boolean
  isLast: boolean
  onClick?: () => void
}) {
  const isButton = type === "cta-primary" || type === "cta-disabled"
  const isDone = type === "text-done"
  const iconBorderColor =
    isDone || type === "cta-primary" ? BLUE : type === "cta-disabled" ? "#ccc" : "#333"
  const iconColor = iconBorderColor

  return (
    <div
      style={{
        position: "relative",
        padding: isButton ? "8px 24px 14px 56px" : "10px 24px 10px 56px",
      }}
    >
      {/* Top connector */}
      {!isFirst && (
        <div
          style={{
            position: "absolute",
            left: "35.5px",
            top: 0,
            width: "1px",
            height: isButton ? "8px" : "calc(50% - 12px)",
            background: "#e5e5e5",
          }}
        />
      )}
      {/* Bottom connector */}
      {!isLast && (
        <div
          style={{
            position: "absolute",
            left: "35.5px",
            top: isButton ? "32px" : "calc(50% + 12px)",
            bottom: 0,
            width: "1px",
            background: "#e5e5e5",
          }}
        />
      )}

      {/* Icon */}
      <div
        style={{
          position: "absolute",
          left: "24px",
          top: isButton ? "8px" : "50%",
          transform: isButton ? "none" : "translateY(-50%)",
          width: "24px",
          height: "24px",
          borderRadius: "50%",
          border: `1px solid ${iconBorderColor}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: iconColor,
          background: "white",
          flexShrink: 0,
          zIndex: 1,
        }}
      >
        <Asterisk size={12} />
      </div>

      {/* Content */}
      {type === "text-done" && (
        <span
          style={{
            fontSize: "16px",
            fontWeight: 300,
            color: BLUE,
            lineHeight: "17px",
            fontFamily: FONT,
          }}
        >
          {label}
        </span>
      )}
      {type === "text-pending" && (
        <span
          style={{
            fontSize: "16px",
            fontWeight: 300,
            color: "#000",
            lineHeight: "17px",
            fontFamily: FONT,
          }}
        >
          {label}
        </span>
      )}
      {type === "cta-primary" && (
        <button
          onClick={onClick}
          style={{
            width: "100%",
            padding: "16px",
            background: BLUE,
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontSize: "16px",
            fontWeight: 500,
            fontFamily: FONT,
            cursor: "pointer",
            lineHeight: "16px",
            textAlign: "center",
          }}
        >
          {label}
        </button>
      )}
      {type === "cta-disabled" && (
        <button
          disabled
          style={{
            width: "100%",
            padding: "16px",
            background: "#f2f2f2",
            color: "#999",
            border: "none",
            borderRadius: "6px",
            fontSize: "16px",
            fontWeight: 300,
            fontFamily: FONT,
            cursor: "not-allowed",
            lineHeight: "16px",
            textAlign: "center",
          }}
        >
          {label}
        </button>
      )}
    </div>
  )
}

export default function DtfSettingsProposalClient() {
  const router = useRouter()
  const pathname = usePathname()
  const [openSections, setOpenSections] = useState<Set<string>>(new Set())
  const [roleAddresses, setRoleAddresses] = useState<Record<RoleId, string[]>>({
    guardian: [""],
    brandManager: [""],
    auctionLauncher: [""],
  })

  function toggleSection(label: string) {
    setOpenSections((prev) => {
      const next = new Set(prev)
      next.has(label) ? next.delete(label) : next.add(label)
      return next
    })
  }

  function addRoleAddress(id: RoleId) {
    setRoleAddresses((prev) => ({ ...prev, [id]: [...prev[id], ""] }))
  }

  function removeRoleAddress(id: RoleId, index: number) {
    setRoleAddresses((prev) => ({
      ...prev,
      [id]: prev[id].filter((_, i) => i !== index),
    }))
  }

  function updateRoleAddress(id: RoleId, index: number, value: string) {
    setRoleAddresses((prev) => {
      const next = [...prev[id]]
      next[index] = value
      return { ...prev, [id]: next }
    })
  }

  return (
    <>
      {/* Left: Accordion sections */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          minWidth: 0,
        }}
      >
        <div
          style={{
            background: CREAM,
            borderRadius: "24px",
            padding: "4px",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            fontFamily: FONT,
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                border: "1px solid #333",
                color: "#333",
                flexShrink: 0,
              }}
            >
              <Asterisk size={16} />
            </div>
            <span
              style={{
                fontSize: "20px",
                fontWeight: 700,
                color: "#333",
                lineHeight: "23px",
                fontFamily: FONT,
              }}
            >
              DTF settings proposal
            </span>
          </div>

          {/* Section rows */}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {SECTIONS.map((label) => {
              const isOpen = openSections.has(label)
              return (
                <div
                  key={label}
                  style={{
                    background: OFF_WHITE,
                    borderRadius: "20px",
                    overflow: "hidden",
                  }}
                >
                  {/* Header row */}
                  <button
                    onClick={() => toggleSection(label)}
                    style={{
                      width: "100%",
                      padding: "24px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          border: "1px solid #333",
                          color: "#333",
                          flexShrink: 0,
                        }}
                      >
                        <Asterisk size={16} />
                      </div>
                      <span
                        style={{
                          fontSize: "20px",
                          fontWeight: 700,
                          color: "#333",
                          lineHeight: "23px",
                          fontFamily: FONT,
                        }}
                      >
                        {label}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        background: "#f2f2f2",
                        color: "#666",
                        flexShrink: 0,
                        transition: "transform 0.2s ease",
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      }}
                    >
                      <ChevronDown size={16} />
                    </div>
                  </button>

                  {/* Expanded content */}
                  {isOpen && (
                    <div
                      style={{
                        padding: "16px 24px 24px",
                        borderTop: "1px solid #e5e5e5",
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                      }}
                    >
                      {label === "Fees & Distribution" && <FeesContent />}
                      {label === "Auctions" && <AuctionsContent />}
                      {label === "Governance" && <GovernanceContent />}
                      {label === "Roles" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                          <p
                            style={{
                              margin: 0,
                              fontSize: "14px",
                              fontWeight: 300,
                              color: "#666",
                              lineHeight: "20px",
                              fontFamily: FONT,
                            }}
                          >
                            The Reserve Index Protocol provides several roles that can improve the
                            safety and experience of DTF holders and governors. These roles are
                            mutable and can be changed by governance in the future.
                          </p>
                          {ROLES.map((role) => (
                            <RoleSection
                              key={role.id}
                              role={role}
                              addresses={roleAddresses[role.id]}
                              onAdd={() => addRoleAddress(role.id)}
                              onRemove={(i) => removeRoleAddress(role.id, i)}
                              onChange={(i, v) => updateRoleAddress(role.id, i, v)}
                            />
                          ))}
                        </div>
                      )}
                      {label === "Basics" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          <span
                            style={{
                              fontSize: "16px",
                              fontWeight: 700,
                              color: "#0a0d10",
                              fontFamily: FONT,
                              lineHeight: "20px",
                            }}
                          >
                            Mandate
                          </span>
                          <textarea
                            placeholder="This Index DTF will..."
                            style={{
                              width: "100%",
                              minHeight: "140px",
                              padding: "12px 16px",
                              background: OFF_WHITE,
                              border: "1px solid #e5e5e5",
                              borderRadius: "12px",
                              fontSize: "16px",
                              fontWeight: 300,
                              fontFamily: FONT,
                              color: "#0a0d10",
                              resize: "vertical",
                              outline: "none",
                              boxSizing: "border-box",
                            }}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Right: Proposal sidebar */}
      <div style={{ width: "460px", flexShrink: 0 }}>
        <div
          style={{
            background: CREAM,
            borderRadius: "24px",
            padding: "4px",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            fontFamily: FONT,
          }}
        >
          {/* Deploy actions card */}
          <div style={{ background: "white", borderRadius: "20px", overflow: "hidden" }}>
            {/* Header */}
            <div
              style={{
                padding: "24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div
                  style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "30px",
                    background: "linear-gradient(225deg, #0955ac 0%, #000 100%)",
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: "16px",
                    fontWeight: 700,
                    color: "#000",
                    fontFamily: FONT,
                  }}
                >
                  $MEME50 Proposal
                </span>
              </div>
              <button
                onClick={() => router.back()}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "32px",
                  padding: "8px 12px",
                  borderRadius: "42px",
                  border: "1px solid #e5e5e5",
                  background: "transparent",
                  color: "#d05a67",
                  fontSize: "14px",
                  fontWeight: 500,
                  fontFamily: FONT,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                Cancel
              </button>
            </div>

            {/* Steps */}
            <div style={{ paddingBottom: "8px" }}>
              {STEPS.map((step, i) => (
                <StepRow
                  key={step.label}
                  label={step.label}
                  type={step.type}
                  isFirst={i === 0}
                  isLast={i === STEPS.length - 1}
                  onClick={step.type === "cta-primary" ? () => router.push(`${pathname}/confirm`) : undefined}
                />
              ))}
            </div>
          </div>

          {/* Change summary cards */}
          {CHANGES.map((change) => (
            <div
              key={change.section}
              style={{
                background: OFF_WHITE,
                borderRadius: "20px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 24px",
                  height: "56px",
                }}
              >
                {/* Connector through icon (top half) */}
                <div
                  style={{
                    position: "absolute",
                    left: "35.5px",
                    top: 0,
                    width: "1px",
                    height: "calc(50% - 12px)",
                    background: "#e5e5e5",
                  }}
                />
                {/* Connector through icon (bottom half) */}
                <div
                  style={{
                    position: "absolute",
                    left: "35.5px",
                    top: "calc(50% + 12px)",
                    bottom: 0,
                    width: "1px",
                    background: "#e5e5e5",
                  }}
                />

                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      border: `1px solid ${BLUE}`,
                      color: BLUE,
                      background: OFF_WHITE,
                      flexShrink: 0,
                      zIndex: 1,
                      position: "relative",
                    }}
                  >
                    <Asterisk size={12} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: 300,
                        color: "#000",
                        lineHeight: "18px",
                        fontFamily: FONT,
                      }}
                    >
                      {change.count} {change.count === 1 ? "change" : "changes"} in:
                    </span>
                    <span
                      style={{
                        fontSize: "16px",
                        fontWeight: 700,
                        color: "#333",
                        lineHeight: "20px",
                        fontFamily: FONT,
                      }}
                    >
                      {change.section}
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    background: "#e6eef7",
                    color: BLUE,
                    flexShrink: 0,
                    cursor: "pointer",
                  }}
                >
                  <ChevronDown size={12} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
