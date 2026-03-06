import { Suspense } from "react"
import ReviewProposalClient from "./ReviewProposalClient"

export default function ReviewProposalPage() {
  return (
    <Suspense>
      <ReviewProposalClient />
    </Suspense>
  )
}
