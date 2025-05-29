"use client"

import { Pie, PieChart, ResponsiveContainer, Cell } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface RevenueSource {
  name: string
  revenue: number
  percentage: number
  channel: string
}

interface RevenueAttributionProps {
  data: RevenueSource[]
}

export function RevenueAttribution({ data }: RevenueAttributionProps) {
  // Provide default data if none is provided
  const defaultData: RevenueSource[] = [
    { name: "Direct Traffic", revenue: 45000, percentage: 35, channel: "Direct" },
    { name: "Google Ads", revenue: 32000, percentage: 25, channel: "Paid Search" },
    { name: "Facebook Ads", revenue: 25600, percentage: 20, channel: "Social Media" },
    { name: "Email Marketing", revenue: 16000, percentage: 12.5, channel: "Email" },
    { name: "Referrals", revenue: 9600, percentage: 7.5, channel: "Referral" },
  ]

  const chartData = data.length > 0 ? data : defaultData

  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#8dd1e1"]

  const totalRevenue = chartData.reduce((sum, source) => sum + source.revenue, 0)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer
          config={{
            revenue: {
              label: "Revenue",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="revenue"
                label={({ name, percentage }) => `${name}: ${percentage}%`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>

        <div className="space-y-4">
          <div className="text-center">
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Revenue</div>
          </div>
          <div className="space-y-2">
            {chartData.map((source, index) => (
              <div key={source.name} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[index % colors.length] }} />
                  <span className="text-sm font-medium">{source.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">${source.revenue.toLocaleString()}</div>
                  <div className="text-xs text-gray-600">{source.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
