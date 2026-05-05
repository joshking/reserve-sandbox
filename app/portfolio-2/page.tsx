import { Suspense } from "react"
import PortfolioClient from "./PortfolioClient"

export default function PortfolioPage() {
  return (
    <Suspense>
      <PortfolioClient />
    </Suspense>
  )
}
