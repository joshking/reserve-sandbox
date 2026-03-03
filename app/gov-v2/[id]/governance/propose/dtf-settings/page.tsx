import { Suspense } from "react"
import DtfSettingsProposalClient from "./DtfSettingsProposalClient"

export function generateStaticParams() {
  return [
    { id: "baix" },
    { id: "bex" },
    { id: "mvtt10f" },
    { id: "bgci" },
    { id: "dgi" },
  ]
}

export default function DtfSettingsPage() {
  return (
    <Suspense>
      <DtfSettingsProposalClient />
    </Suspense>
  )
}
