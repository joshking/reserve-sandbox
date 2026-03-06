import { Suspense } from "react"
import ConfirmProposalClient from "./ConfirmProposalClient"

export default function ConfirmProposalPage() {
  return (
    <Suspense>
      <ConfirmProposalClient />
    </Suspense>
  )
}
