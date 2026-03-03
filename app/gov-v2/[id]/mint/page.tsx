import { Suspense } from "react"
import MintClient from "./MintClient"

export function generateStaticParams() {
  return [
    { id: "baix" },
    { id: "bex" },
    { id: "mvtt10f" },
    { id: "bgci" },
    { id: "dgi" },
  ]
}

export default function MintPage() {
  return (
    <Suspense>
      <MintClient />
    </Suspense>
  )
}
