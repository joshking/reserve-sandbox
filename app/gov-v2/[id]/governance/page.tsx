import GovernanceClient from "./GovernanceClient"

export function generateStaticParams() {
  return [
    { id: "baix" },
    { id: "bex" },
    { id: "mvtt10f" },
    { id: "bgci" },
    { id: "dgi" },
  ]
}

export default function GovernancePage() {
  return <GovernanceClient />
}
