import { Suspense } from "react"
import ReviewProposalClient from "./ReviewProposalClient"

export function generateStaticParams() {
  return [
    { id: "baix" },
    { id: "bex" },
    { id: "mvtt10f" },
    { id: "bgci" },
    { id: "dgi" },
  ]
}

export default function ReviewProposalPage() {
  return (
    <Suspense>
      <ReviewProposalClient />
    </Suspense>
  )
}
