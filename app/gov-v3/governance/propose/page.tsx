import { Suspense } from "react"
import ProposeClient from "./ProposeClient"

export default function Page() {
  return (
    <Suspense>
      <ProposeClient />
    </Suspense>
  )
}
