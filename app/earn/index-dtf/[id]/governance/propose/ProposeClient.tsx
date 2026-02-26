"use client"

import { useRouter } from "next/navigation"
import Navbar from "@/components/Navbar"
import ProposalCategory from "@/components/ProposalCategory"

export default function ProposeClient() {
  const router = useRouter()

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#faf8f5",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Navbar />

      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 24px",
        }}
      >
        <ProposalCategory
          onBack={() => router.back()}
          onSelect={(id) => {
            // TODO: route to proposal creation form for each category
            console.log("Selected category:", id)
          }}
        />
      </div>
    </div>
  )
}
