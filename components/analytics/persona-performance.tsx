"use client"

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from "recharts"
import { ChartContainer } from "@/components/ui/chart"

interface PersonaData {
  name: string
  engagement: number
  conversion: number
  retention: number
  revenue: number
  score: number
}

interface PersonaPerformanceProps {
  data: PersonaData[]
}

export function PersonaPerformance({ data }: PersonaPerformanceProps) {
  // Provide default data if none is provided
  const defaultData: PersonaData[] = [
    {
      name: "Startup Sam",
      engagement: 85,
      conversion: 12,
      retention: 78,
      revenue: 2500,
      score: 68,
    },
    {
      name: "Scaling Sarah",
      engagement: 92,
      conversion: 18,
      retention: 85,
      revenue: 5200,
      score: 78,
    },
    {
      name: "Learning Larry",
      engagement: 76,
      conversion: 8,
      retention: 82,
      revenue: 1200,
      score: 62,
    },
    {
      name: "Investor Ian",
      engagement: 88,
      conversion: 22,
      retention: 90,
      revenue: 8500,
      score: 82,
    },
    {
      name: "Provider Priya",
      engagement: 81,
      conversion: 15,
      retention: 79,
      revenue: 3200,
      score: 71,
    },
  ]

  const chartData = data.length > 0 ? data : defaultData

  // Transform data for radar chart
  const radarData = [
    {
      metric: "Engagement",
      ...chartData.reduce((acc, persona) => ({ ...acc, [persona.name]: persona.engagement }), {}),
    },
    {
      metric: "Conversion",
      ...chartData.reduce((acc, persona) => ({ ...acc, [persona.name]: persona.conversion }), {}),
    },
    {
      metric: "Retention",
      ...chartData.reduce((acc, persona) => ({ ...acc, [persona.name]: persona.retention }), {}),
    },
  ]

  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#8dd1e1"]

  return (
    <div className="space-y-6">
      <ChartContainer
        config={{
          engagement: {
            label: "Engagement",
            color: "hsl(var(--chart-1))",
          },
        }}
        className="h-[400px]"
      >
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="metric" />
            <PolarRadiusAxis angle={90} domain={[0, 100]} />
            {chartData.map((persona, index) => (
              <Radar
                key={persona.name}
                name={persona.name}
                dataKey={persona.name}
                stroke={colors[index % colors.length]}
                fill={colors[index % colors.length]}
                fillOpacity={0.1}
                strokeWidth={2}
              />
            ))}
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </ChartContainer>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {chartData.map((persona, index) => (
          <div key={persona.name} className="p-4 bg-gray-50 rounded-lg">
            <div className="font-semibold text-sm mb-2" style={{ color: colors[index % colors.length] }}>
              {persona.name}
            </div>
            <div className="space-y-1 text-xs">
              <div>Engagement: {persona.engagement}%</div>
              <div>Conversion: {persona.conversion}%</div>
              <div>Retention: {persona.retention}%</div>
              <div>Revenue: ${persona.revenue.toLocaleString()}</div>
              <div className="font-semibold">Score: {persona.score}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
