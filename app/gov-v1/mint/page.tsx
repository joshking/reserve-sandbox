import { Suspense } from "react"
import MintClient from "./MintClient"

export default function MintPage() {
  return (
    <Suspense>
      <MintClient />
    </Suspense>
  )
}
