import { Suspense } from "react"
import ConfirmProposalClient from "./ConfirmProposalClient"

export function generateStaticParams() {
  return [
    { id: "baix" },
    { id: "bex" },
    { id: "mvtt10f" },
    { id: "bgci" },
    { id: "dgi" },
  ]
}

export default function ConfirmProposalPage() {
  return (
    <Suspense>
      <ConfirmProposalClient />
    </Suspense>
  )
}
