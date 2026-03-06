import { Suspense } from "react"
import GovV1Client from "./GovV1Client"

export default function GovV1Page() {
  return (
    <Suspense>
      <GovV1Client />
    </Suspense>
  )
}
