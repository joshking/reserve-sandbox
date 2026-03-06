import Navbar from "@/components/Navbar"
import GovernanceSidebar from "@/components/GovernanceSidebar"

export default function GovV3Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fff" }}>
      <Navbar />
      <div style={{ maxWidth: "1400px", margin: "0 auto", display: "flex" }}>
        <div style={{ width: 212, flexShrink: 0, position: "sticky", top: 0, height: "fit-content" }}>
          <GovernanceSidebar />
        </div>
        <div style={{ flex: 1, display: "flex", gap: "8px", padding: "8px 8px 64px", minWidth: 0 }}>
          {children}
        </div>
      </div>
    </div>
  )
}
