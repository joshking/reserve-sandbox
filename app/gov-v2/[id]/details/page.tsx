import { Suspense } from "react"
import DetailsClient from "./DetailsClient"

export function generateStaticParams() {
  return [
    { id: "baix" },
    { id: "bex" },
    { id: "mvtt10f" },
    { id: "bgci" },
    { id: "dgi" },
  ]
}

export default function DetailsPage() {
  return (
    <Suspense>
      <DetailsClient />
    </Suspense>
  )
}
