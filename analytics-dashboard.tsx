"use client"

import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FunnelVisualization } from "@/components/analytics/funnel-visualization"
import { PersonaPerformance } from "@/components/analytics/persona-performance"
import { ShadowFunnelTracker } from "@/components/analytics/shadow-funnel-tracker"
import { RevenueAttribution } from "@/components/analytics/revenue-attribution"
import { IntegrationStatus } from "@/components/analytics/integration-status"
import { useAnalyticsStore } from "@/store/analytics-store"

export function AnalyticsDashboard() {
  const { funnelData, personaData, shadowFunnelData, revenueData, integrationData, fetchAnalyticsData } =
    useAnalyticsStore()

  useEffect(() => {
    fetchAnalyticsData()
  }, [fetchAnalyticsData])

  // Safe calculations with proper null checks and default values
  const totalConversions = (funnelData?.stages || []).reduce((acc, stage) => {
    return acc + (stage?.conversions || 0)
  }, 0)

  const averagePersonaScore = (() => {
    const personas = personaData?.personas || []
    if (personas.length === 0) return 0
    const total = personas.reduce((acc, persona) => acc + (persona?.score || 0), 0)
    return total / personas.length
  })()

  const totalShadowTouchpoints = (shadowFunnelData?.touchpoints || []).reduce((acc, touchpoint) => {
    return acc + (touchpoint?.count || 0)
  }, 0)

  const totalRevenue = (revenueData?.sources || []).reduce((acc, source) => {
    return acc + (source?.revenue || 0)
  }, 0)

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Conversions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalConversions.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg. Persona Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averagePersonaScore.toFixed(1)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Shadow Touchpoints</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalShadowTouchpoints.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="funnel">
        <TabsList className="mb-4">
          <TabsTrigger value="funnel">Funnel Analysis</TabsTrigger>
          <TabsTrigger value="persona">Persona Performance</TabsTrigger>
          <TabsTrigger value="shadow">Shadow Funnel</TabsTrigger>
          <TabsTrigger value="revenue">Revenue Attribution</TabsTrigger>
          <TabsTrigger value="integration">Integration Status</TabsTrigger>
        </TabsList>

        <TabsContent value="funnel">
          <Card>
            <CardHeader>
              <CardTitle>Funnel Visualization</CardTitle>
              <CardDescription>
                Track conversion rates through each stage of your marketing and sales funnel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FunnelVisualization data={funnelData?.stages} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="persona">
          <Card>
            <CardHeader>
              <CardTitle>Persona Performance</CardTitle>
              <CardDescription>
                Compare engagement and conversion metrics across different user personas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PersonaPerformance data={personaData?.personas} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shadow">
          <Card>
            <CardHeader>
              <CardTitle>Shadow Funnel Tracker</CardTitle>
              <CardDescription>Monitor off-site touchpoints and their impact on your conversion funnel</CardDescription>
            </CardHeader>
            <CardContent>
              <ShadowFunnelTracker data={shadowFunnelData?.touchpoints} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Attribution</CardTitle>
              <CardDescription>Understand which channels and campaigns are driving revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <RevenueAttribution data={revenueData?.sources} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integration">
          <Card>
            <CardHeader>
              <CardTitle>Integration Status</CardTitle>
              <CardDescription>Monitor the health and performance of your analytics integrations</CardDescription>
            </CardHeader>
            <CardContent>
              <IntegrationStatus data={integrationData?.platforms} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
