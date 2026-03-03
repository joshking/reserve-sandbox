import { Suspense } from "react"
import ProposalDetailClient from "./ProposalDetailClient"

export function generateStaticParams() {
  const dtfIds = ["baix", "bex", "mvtt10f", "bgci", "dgi"]
  const proposalIds = ["rebalance-test"]
  return dtfIds.flatMap((id) =>
    proposalIds.map((proposalId) => ({ id, proposalId }))
  )
}

export default function ProposalDetailPage() {
  return (
    <Suspense>
      <ProposalDetailClient />
    </Suspense>
  )
}
