import { Suspense } from "react"
import AuctionsClient from "./AuctionsClient"

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
    <Suspense>
      <AuctionsClient />
    </Suspense>
  )
}
