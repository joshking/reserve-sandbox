import { Suspense } from "react"
import DtfSettingsProposalClient from "./DtfSettingsProposalClient"

export default function DtfSettingsPage() {
  return (
    <Suspense>
      <DtfSettingsProposalClient />
    </Suspense>
  )
}
