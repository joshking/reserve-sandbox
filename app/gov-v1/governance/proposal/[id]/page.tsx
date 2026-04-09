import { Suspense } from "react"
import ProposalVotingClient from "./ProposalVotingClient"

// All fast proposal IDs that can have a voting detail page
export function generateStaticParams() {
  return [
    { id: "p1" },
    { id: "p2" },
  ]
}

export default function ProposalVotingPage({ params }: { params: { id: string } }) {
  return (
    <Suspense>
      <ProposalVotingClient id={params.id} />
    </Suspense>
  )
}
