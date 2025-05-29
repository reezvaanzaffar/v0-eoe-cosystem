"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Users, Mail, MessageSquare, CreditCard } from "lucide-react"
import { useAnalyticsStore } from "@/store/analytics-store"

interface FunnelVisualizationProps {
  detailed?: boolean
}

export function FunnelVisualization({ detailed = false }: FunnelVisualizationProps) {
  const { funnelMetrics, personaMetrics } = useAnalyticsStore()

  if (!funnelMetrics) return null

  const totalVisitors = personaMetrics.reduce((sum, persona) => sum + persona.visitors, 0)
  const totalQuizCompletions = personaMetrics.reduce((sum, persona) => sum + persona.quizCompletions, 0)
  const totalEmailCaptures = personaMetrics.reduce((sum, persona) => sum + persona.emailCaptures, 0)
  const totalInquiries = personaMetrics.reduce((sum, persona) => sum + persona.serviceInquiries, 0)
  const totalEnrollments = personaMetrics.reduce((sum, persona) => sum + persona.enrollments, 0)

  const funnelSteps = [
    {
      name: "Visitors",
      count: totalVisitors,
      icon: <Users className="h-5 w-5" />,
      color: "bg-blue-500",
      conversion: 100,
    },
    {
      name: "Quiz Completions",
      count: totalQuizCompletions,
      icon: <MessageSquare className="h-5 w-5" />,
      color: "bg-green-500",
      conversion: funnelMetrics.visitorToQuiz,
    },
    {
      name: "Email Captures",
      count: totalEmailCaptures,
      icon: <Mail className="h-5 w-5" />,
      color: "bg-purple-500",
      conversion: funnelMetrics.quizToEmail,
    },
    {
      name: "Service Inquiries",
      count: totalInquiries,
      icon: <MessageSquare className="h-5 w-5" />,
      color: "bg-orange-500",
      conversion: funnelMetrics.emailToInquiry,
    },
    {
      name: "Enrollments",
      count: totalEnrollments,
      icon: <CreditCard className="h-5 w-5" />,
      color: "bg-red-500",
      conversion: funnelMetrics.inquiryToEnrollment,
    },
  ]

  return (
    <Card className={detailed ? "col-span-full" : ""}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5" />
          <span>Conversion Funnel</span>
        </CardTitle>
        <CardDescription>Track visitor journey through your funnel</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {funnelSteps.map((step, index) => {
            const previousStep = index > 0 ? funnelSteps[index - 1] : null
            const dropOff = previousStep ? previousStep.count - step.count : 0
            const dropOffRate = previousStep ? ((dropOff / previousStep.count) * 100).toFixed(1) : "0"

            return (
              <div key={step.name} className="relative">
                {/* Step */}
                <div className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className={`p-3 rounded-lg ${step.color} text-white`}>{step.icon}</div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{step.name}</h4>
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold">{step.count.toLocaleString()}</span>
                        {index > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {step.conversion.toFixed(1)}%
                          </Badge>
                        )}
                      </div>
                    </div>

                    {index > 0 && (
                      <div className="space-y-2">
                        <Progress value={step.conversion} className="h-2" />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Conversion Rate: {step.conversion.toFixed(1)}%</span>
                          <span>
                            Drop-off: {dropOff.toLocaleString()} ({dropOffRate}%)
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Connector */}
                {index < funnelSteps.length - 1 && (
                  <div className="flex justify-center py-2">
                    <div className="w-px h-6 bg-gray-300"></div>
                  </div>
                )}
              </div>
            )
          })}

          {/* Overall Performance */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Overall Conversion</p>
                <p className="text-2xl font-bold text-green-600">{funnelMetrics.overallConversion}%</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Best Performing Step</p>
                <p className="text-lg font-semibold">Quiz to Email</p>
                <p className="text-sm text-green-600">{funnelMetrics.quizToEmail}%</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Biggest Drop-off</p>
                <p className="text-lg font-semibold">Visitor to Quiz</p>
                <p className="text-sm text-red-600">{(100 - funnelMetrics.visitorToQuiz).toFixed(1)}% loss</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
