"use client"

import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from "recharts"

// Approximate TVL data shape matching the chart in the screenshot
const data = [
  { date: "Jan 23", tvl: 2000000 },
  { date: "Apr 23", tvl: 3500000 },
  { date: "Jul 23", tvl: 5000000 },
  { date: "Oct 23", tvl: 8000000 },
  { date: "Jan 24", tvl: 18000000 },
  { date: "Apr 24", tvl: 35000000 },
  { date: "Jul 24", tvl: 55000000 },
  { date: "Oct 24", tvl: 90000000 },
  { date: "Nov 24", tvl: 140000000 },
  { date: "Dec 24", tvl: 160000000 },
  { date: "Jan 25", tvl: 145000000 },
  { date: "Feb 25", tvl: 130000000 },
]

export default function TvlChart() {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="tvlGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(26,86,219,0.12)" />
              <stop offset="100%" stopColor="rgba(26,86,219,0.01)" />
            </linearGradient>
          </defs>
          <XAxis dataKey="date" hide />
          <Tooltip
            contentStyle={{
              background: "#ffffff",
              border: "1px solid rgba(0,0,0,0.1)",
              borderRadius: "8px",
              color: "#0a0d10",
              fontSize: "12px",
              fontFamily: "'TWK Lausanne', sans-serif",
            }}
            formatter={(value: number | undefined) => [
              value != null ? `$${(value / 1000000).toFixed(1)}M` : "",
              "TVL",
            ]}
          />
          <Area
            type="monotone"
            dataKey="tvl"
            stroke="rgba(26,86,219,0.5)"
            strokeWidth={1.5}
            fill="url(#tvlGradient)"
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
