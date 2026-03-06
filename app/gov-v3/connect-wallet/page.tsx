import { Suspense } from "react"
import ConnectWalletClient from "./ConnectWalletClient"

export default function ConnectWalletPage() {
  return (
    <Suspense>
      <ConnectWalletClient />
    </Suspense>
  )
}
