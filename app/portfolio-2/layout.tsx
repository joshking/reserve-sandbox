import Navbar from "@/components/Navbar"

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar />
      {children}
    </div>
  )
}
