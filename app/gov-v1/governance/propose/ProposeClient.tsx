"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import ProposalCategory from "@/components/ProposalCategory"

export default function ProposeClient() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const expedited = searchParams.get("type") === "expedited"

  return (
    <div style={{
      flex: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "48px 24px",
    }}>
      <ProposalCategory
        onBack={() => router.back()}
        onSelect={(id) => {
          router.push(`${pathname}/${id}`)
        }}
        expedited={expedited}
      />
    </div>
  )
}
