import { Suspense } from "react"
import DtfBasketProposalClient from "./DtfBasketProposalClient"

export default function DtfBasketProposalPage() {
  return (
    <Suspense>
      <DtfBasketProposalClient />
    </Suspense>
  )
}
