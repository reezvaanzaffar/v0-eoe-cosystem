"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Cell } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface FunnelStage {
  name: string
  visitors?: number
  conversions?: number
  conversionRate?: number
}

interface FunnelVisualizationProps {
  data?: FunnelStage[]
}

export function FunnelVisualization({ data = [] }: FunnelVisualizationProps) {
  // Provide default data if none is provided
  const defaultData: FunnelStage[] = [
    { name: "Visitors", visitors: 10000, conversions: 10000, conversionRate: 100 },
    { name: "Leads", visitors: 2500, conversions: 2500, conversionRate: 25 },
    { name: "Qualified", visitors: 750, conversions: 750, conversionRate: 7.5 },
    { name: "Customers", visitors: 150, conversions: 150, conversionRate: 1.5 },
  ]

  const chartData = data && data.length > 0 ? data : defaultData

  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300"]

  // Safe data processing with null checks
  const processedData = chartData.map((stage) => ({
    name: stage.name || "Unknown",
    visitors: stage.visitors || 0,
    conversions: stage.conversions || 0,
    conversionRate: stage.conversionRate || 0,
  }))

  return (
    <div className="space-y-4">
      <ChartContainer
        config={{
          conversions: {
            label: "Conversions",
            color: "hsl(var(--chart-1))",
          },
        }}
        className="h-[400px]"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={processedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey="name" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="conversions" radius={[4, 4, 0, 0]}>
              {processedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {processedData.map((stage, index) => (
          <div key={stage.name} className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold" style={{ color: colors[index % colors.length] }}>
              {(stage.conversions || 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">{stage.name}</div>
            <div className="text-xs text-gray-500">{(stage.conversionRate || 0).toFixed(1)}%</div>
          </div>
        ))}
      </div>
    </div>
  )
}
