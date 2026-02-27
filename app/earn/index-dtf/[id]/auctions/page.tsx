export function generateStaticParams() {
  return [
    { id: "baix" },
    { id: "bex" },
    { id: "mvtt10f" },
    { id: "bgci" },
    { id: "dgi" },
  ]
}

export default function AuctionsPage() {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
      <div style={{
        background: "white", borderRadius: "20px", padding: "48px 32px",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ fontSize: "16px", fontFamily: "'TWK Lausanne', sans-serif", fontWeight: 300, color: "#999" }}>
          Auctions — coming soon
        </span>
      </div>
    </div>
  )
}
