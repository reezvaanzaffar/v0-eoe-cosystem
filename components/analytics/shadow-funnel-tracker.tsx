"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { MousePointer, Mail, Target, DollarSign, TrendingUp, Eye } from "lucide-react"
import { useAnalyticsStore } from "@/store/analytics-store"

interface ShadowFunnelTrackerProps {
  detailed?: boolean
}

export function ShadowFunnelTracker({ detailed = false }: ShadowFunnelTrackerProps) {
  const { shadowFunnelMetrics } = useAnalyticsStore()

  if (!shadowFunnelMetrics) return null

  const exitIntentConversionRate = (
    (shadowFunnelMetrics.exitIntentConversions / shadowFunnelMetrics.exitIntentTriggers) *
    100
  ).toFixed(1)

  const emailRecoveryClickRate = (
    (shadowFunnelMetrics.emailRecoveryClicks / shadowFunnelMetrics.emailRecoveryOpens) *
    100
  ).toFixed(1)

  const retargetingCTR = (
    (shadowFunnelMetrics.retargetingClicks / shadowFunnelMetrics.retargetingImpressions) *
    100
  ).toFixed(2)

  const recoveryROI = shadowFunnelMetrics.recoveryRevenue / 1000 // Assuming $1000 ad spend

  const recoveryMetrics = [
    {
      name: "Exit-Intent Popups",
      triggers: shadowFunnelMetrics.exitIntentTriggers,
      conversions: shadowFunnelMetrics.exitIntentConversions,
      rate: exitIntentConversionRate,
      icon: <MousePointer className="h-5 w-5" />,
      color: "bg-red-500",
    },
    {
      name: "Email Recovery",
      triggers: shadowFunnelMetrics.emailRecoveryOpens,
      conversions: shadowFunnelMetrics.emailRecoveryClicks,
      rate: emailRecoveryClickRate,
      icon: <Mail className="h-5 w-5" />,
      color: "bg-blue-500",
    },
    {
      name: "Retargeting Ads",
      triggers: shadowFunnelMetrics.retargetingImpressions,
      conversions: shadowFunnelMetrics.retargetingClicks,
      rate: retargetingCTR,
      icon: <Eye className="h-5 w-5" />,
      color: "bg-purple-500",
    },
  ]

  return (
    <Card className={detailed ? "col-span-full" : ""}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Target className="h-5 w-5" />
          <span>Shadow Funnel Recovery</span>
        </CardTitle>
        <CardDescription>Track recovery efforts for lost prospects</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Recovery Channels */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recoveryMetrics.map((metric) => (
              <div key={metric.name} className="border rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`p-2 rounded-lg ${metric.color} text-white`}>{metric.icon}</div>
                  <div>
                    <h4 className="font-semibold text-sm">{metric.name}</h4>
                    <p className="text-xs text-gray-600">{metric.rate}% conversion</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Triggers</span>
                    <span className="font-semibold">{metric.triggers.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Conversions</span>
                    <span className="font-semibold">{metric.conversions.toLocaleString()}</span>
                  </div>
                  <Progress value={Number.parseFloat(metric.rate)} className="h-2" />
                </div>
              </div>
            ))}
          </div>

          {/* Recovery Performance Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <Target className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-sm text-gray-600">Total Recoveries</p>
              <p className="text-2xl font-bold">{shadowFunnelMetrics.recoveryConversions}</p>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-sm text-gray-600">Recovery Revenue</p>
              <p className="text-2xl font-bold">${shadowFunnelMetrics.recoveryRevenue.toLocaleString()}</p>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-sm text-gray-600">Recovery ROI</p>
              <p className="text-2xl font-bold">{recoveryROI.toFixed(1)}x</p>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <Target className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-sm text-gray-600">Avg. Recovery Value</p>
              <p className="text-2xl font-bold">
                $
                {shadowFunnelMetrics.recoveryConversions > 0
                  ? (shadowFunnelMetrics.recoveryRevenue / shadowFunnelMetrics.recoveryConversions).toFixed(0)
                  : "0"}
              </p>
            </div>
          </div>

          {/* Detailed Breakdown */}
          {detailed && (
            <div className="space-y-4">
              <h4 className="font-semibold">Recovery Channel Performance</h4>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <MousePointer className="h-4 w-4 text-red-500" />
                    <span className="font-medium">Exit-Intent Popups</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge variant="outline">{exitIntentConversionRate}% CVR</Badge>
                    <span className="text-sm text-gray-600">
                      {shadowFunnelMetrics.exitIntentConversions} / {shadowFunnelMetrics.exitIntentTriggers}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">Email Recovery Sequence</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge variant="outline">{emailRecoveryClickRate}% CTR</Badge>
                    <span className="text-sm text-gray-600">
                      {shadowFunnelMetrics.emailRecoveryClicks} / {shadowFunnelMetrics.emailRecoveryOpens}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Eye className="h-4 w-4 text-purple-500" />
                    <span className="font-medium">Retargeting Campaigns</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge variant="outline">{retargetingCTR}% CTR</Badge>
                    <span className="text-sm text-gray-600">
                      {shadowFunnelMetrics.retargetingClicks} / {shadowFunnelMetrics.retargetingImpressions}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Optimization Recommendations */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Optimization Opportunities</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Exit-intent popup performing well - consider A/B testing different offers</li>
              <li>• Email recovery click rate could be improved with better subject lines</li>
              <li>• Retargeting CTR is above industry average - scale budget</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
