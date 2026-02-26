import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Reserve app | DTFs",
  description:
    "Reserve is the leading platform for permissionless DTFs and asset-backed currencies. Create, manage & trade tokenized indexes with 24/7 transparency.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        {/* figma capture */}
        <script src="https://mcp.figma.com/mcp/html-to-design/capture.js" async></script>
      </head>
      <body>{children}</body>
    </html>
  )
}
