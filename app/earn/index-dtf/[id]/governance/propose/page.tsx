import { Suspense } from "react"
import ProposeClient from "./ProposeClient"

export function generateStaticParams() {
  return [
    { id: "baix" },
    { id: "bex" },
    { id: "mvtt10f" },
    { id: "bgci" },
    { id: "dgi" },
  ]
}

export default function Page() {
  return (
    <Suspense>
      <ProposeClient />
    </Suspense>
  )
}
