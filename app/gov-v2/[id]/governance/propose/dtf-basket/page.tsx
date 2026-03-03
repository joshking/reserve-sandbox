import DtfBasketProposalClient from "./DtfBasketProposalClient"

export function generateStaticParams() {
  return [
    { id: "baix" },
    { id: "bex" },
    { id: "mvtt10f" },
    { id: "bgci" },
    { id: "dgi" },
  ]
}

export default function DtfBasketProposalPage() {
  return <DtfBasketProposalClient />
}
