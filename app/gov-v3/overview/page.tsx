import { Suspense } from "react"
import OverviewClient from "./OverviewClient"

export default function OverviewPage() {
  return (
    <Suspense>
      <OverviewClient />
    </Suspense>
  )
}
