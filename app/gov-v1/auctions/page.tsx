import { Suspense } from "react"
import AuctionsClient from "./AuctionsClient"

export default function AuctionsPage() {
  return (
    <Suspense>
      <AuctionsClient />
    </Suspense>
  )
}
