"use client"

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface ShadowTouchpoint {
  name: string
  platform: string
  count: number
  influence: number
  timestamp: string
}

interface ShadowFunnelTrackerProps {
  data: ShadowTouchpoint[]
}

export function ShadowFunnelTracker({ data }: ShadowFunnelTrackerProps) {
  // Provide default data if none is provided
  const defaultData: ShadowTouchpoint[] = [
    { name: "Facebook Group Post", platform: "Facebook", count: 245, influence: 78, timestamp: "2024-01-15" },
    { name: "LinkedIn Article Share", platform: "LinkedIn", count: 189, influence: 65, timestamp: "2024-01-16" },
    { name: "YouTube Video Comment", platform: "YouTube", count: 156, influence: 52, timestamp: "2024-01-17" },
    { name: "Twitter Thread", platform: "Twitter", count: 298, influence: 82, timestamp: "2024-01-18" },
    { name: "Podcast Mention", platform: "Podcast", count: 87, influence: 91, timestamp: "2024-01-19" },
    { name: "Blog Comment", platform: "Blog", count: 134, influence: 45, timestamp: "2024-01-20" },
  ]

  const chartData = data.length > 0 ? data : defaultData

  // Group data by platform for visualization
  const platformData = chartData.reduce(
    (acc, touchpoint) => {
      const existing = acc.find((item) => item.platform === touchpoint.platform)
      if (existing) {
        existing.count += touchpoint.count
        existing.influence = Math.max(existing.influence, touchpoint.influence)
      } else {
        acc.push({
          platform: touchpoint.platform,
          count: touchpoint.count,
          influence: touchpoint.influence,
        })
      }
      return acc
    },
    [] as Array<{ platform: string; count: number; influence: number }>,
  )

  return (
    <div className="space-y-6">
      <ChartContainer
        config={{
          count: {
            label: "Touchpoint Count",
            color: "hsl(var(--chart-1))",
          },
          influence: {
            label: "Influence Score",
            color: "hsl(var(--chart-2))",
          },
        }}
        className="h-[400px]"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={platformData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey="platform" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="count"
              stroke="var(--color-count)"
              strokeWidth={2}
              name="Touchpoint Count"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="influence"
              stroke="var(--color-influence)"
              strokeWidth={2}
              name="Influence Score"
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {chartData.slice(0, 6).map((touchpoint, index) => (
          <div key={`${touchpoint.platform}-${index}`} className="p-4 bg-gray-50 rounded-lg">
            <div className="font-semibold text-sm mb-1">{touchpoint.name}</div>
            <div className="text-xs text-gray-600 mb-2">{touchpoint.platform}</div>
            <div className="flex justify-between text-xs">
              <span>Count: {touchpoint.count}</span>
              <span>Influence: {touchpoint.influence}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
