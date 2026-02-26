import DtfDetailClient from "./DtfDetailClient"

export function generateStaticParams() {
  return [{ id: "bgci" }]
}

export default function Page() {
  return <DtfDetailClient />
}
