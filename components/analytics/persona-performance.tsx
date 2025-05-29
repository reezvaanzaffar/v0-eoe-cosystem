"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Users } from "lucide-react"
import { useAnalyticsStore } from "@/store/analytics-store"

interface PersonaPerformanceProps {
  detailed?: boolean
}

const personaConfig = {
  "startup-sam": {
    name: "Startup Sam",
    color: "bg-green-500",
    icon: "🚀",
    description: "New Amazon sellers",
  },
  "scaling-sarah": {
    name: "Scaling Sarah",
    color: "bg-blue-500",
    icon: "📈",
    description: "Growing businesses",
  },
  "learning-larry": {
    name: "Learning Larry",
    color: "bg-purple-500",
    icon: "🎓",
    description: "Knowledge seekers",
  },
  "investor-ian": {
    name: "Investor Ian",
    color: "bg-amber-500",
    icon: "💼",
    description: "Investment focused",
  },
  "provider-priya": {
    name: "Provider Priya",
    color: "bg-pink-500",
    icon: "🤝",
    description: "Service providers",
  },
}

export function PersonaPerformance({ detailed = false }: PersonaPerformanceProps) {
  const { personaMetrics } = useAnalyticsStore()

  const totalRevenue = personaMetrics.reduce((sum, persona) => sum + persona.revenue, 0)
  const totalVisitors = personaMetrics.reduce((sum, persona) => sum + persona.visitors, 0)

  return (
    <Card className={detailed ? "col-span-full" : ""}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="h-5 w-5" />
          <span>Persona Performance</span>
        </CardTitle>
        <CardDescription>Compare performance across different user personas</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {personaMetrics.map((persona) => {
            const config = personaConfig[persona.persona]
            const revenueShare = ((persona.revenue / totalRevenue) * 100).toFixed(1)
            const visitorShare = ((persona.visitors / totalVisitors) * 100).toFixed(1)

            return (
              <div key={persona.persona} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{config.icon}</span>
                    <div>
                      <h4 className="font-semibold">{config.name}</h4>
                      <p className="text-sm text-gray-600">{config.description}</p>
                    </div>
                  </div>
                  <Badge className={`${config.color} text-white`}>{persona.conversionRate.toFixed(2)}% CVR</Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Visitors</p>
                    <p className="text-lg font-bold">{persona.visitors.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">{visitorShare}% of total</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Enrollments</p>
                    <p className="text-lg font-bold">{persona.enrollments}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Revenue</p>
                    <p className="text-lg font-bold">${persona.revenue.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">{revenueShare}% of total</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Avg. Value</p>
                    <p className="text-lg font-bold">
                      ${persona.enrollments > 0 ? (persona.revenue / persona.enrollments).toFixed(0) : "0"}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Conversion Funnel Progress</span>
                    <span>{persona.conversionRate.toFixed(2)}%</span>
                  </div>
                  <Progress value={persona.conversionRate * 20} className="h-2" />
                </div>

                {detailed && (
                  <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Quiz Completion</p>
                      <p className="font-semibold">
                        {((persona.quizCompletions / persona.visitors) * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Email Capture</p>
                      <p className="font-semibold">
                        {((persona.emailCaptures / persona.quizCompletions) * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Inquiry Rate</p>
                      <p className="font-semibold">
                        {((persona.serviceInquiries / persona.emailCaptures) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Summary */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-3">Performance Insights</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Highest Converting Persona</p>
              <p className="font-semibold text-green-600">
                {
                  personaConfig[
                    personaMetrics.reduce((best, current) =>
                      current.conversionRate > best.conversionRate ? current : best,
                    ).persona
                  ].name
                }
              </p>
            </div>
            <div>
              <p className="text-gray-600">Highest Revenue Persona</p>
              <p className="font-semibold text-blue-600">
                {
                  personaConfig[
                    personaMetrics.reduce((best, current) => (current.revenue > best.revenue ? current : best)).persona
                  ].name
                }
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
