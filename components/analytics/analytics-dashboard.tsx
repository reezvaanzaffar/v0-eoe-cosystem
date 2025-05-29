"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Target,
  AlertTriangle,
  RefreshCw,
  Download,
  Filter,
} from "lucide-react"
import { useAnalyticsStore } from "@/store/analytics-store"
import { FunnelVisualization } from "./funnel-visualization"
import { PersonaPerformance } from "./persona-performance"
import { ShadowFunnelTracker } from "./shadow-funnel-tracker"
import { RevenueAttribution } from "./revenue-attribution"
import { IntegrationStatus } from "./integration-status"

export function AnalyticsDashboard() {
  const {
    funnelMetrics,
    personaMetrics,
    shadowFunnelMetrics,
    alerts,
    isLoading,
    selectedTimeframe,
    setTimeframe,
    refreshData,
  } = useAnalyticsStore()

  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    // Initialize with mock data
    const mockFunnelMetrics = {
      visitorToQuiz: 15.2,
      quizToEmail: 68.5,
      emailToInquiry: 12.8,
      inquiryToEnrollment: 35.6,
      overallConversion: 1.8,
    }

    const mockPersonaMetrics = [
      {
        persona: "startup-sam" as const,
        visitors: 2450,
        quizCompletions: 385,
        emailCaptures: 264,
        serviceInquiries: 34,
        enrollments: 12,
        revenue: 11940,
        conversionRate: 0.49,
      },
      {
        persona: "scaling-sarah" as const,
        visitors: 1890,
        quizCompletions: 298,
        emailCaptures: 201,
        serviceInquiries: 28,
        enrollments: 15,
        revenue: 29850,
        conversionRate: 0.79,
      },
      {
        persona: "learning-larry" as const,
        visitors: 3200,
        quizCompletions: 512,
        emailCaptures: 348,
        serviceInquiries: 42,
        enrollments: 18,
        revenue: 17820,
        conversionRate: 0.56,
      },
    ]

    const mockShadowFunnelMetrics = {
      exitIntentTriggers: 1250,
      exitIntentConversions: 89,
      emailRecoveryOpens: 456,
      emailRecoveryClicks: 127,
      retargetingImpressions: 15600,
      retargetingClicks: 234,
      recoveryConversions: 23,
      recoveryRevenue: 4830,
    }

    useAnalyticsStore.getState().setFunnelMetrics(mockFunnelMetrics)
    useAnalyticsStore.getState().setPersonaMetrics(mockPersonaMetrics)
    useAnalyticsStore.getState().setShadowFunnelMetrics(mockShadowFunnelMetrics)
  }, [])

  const totalRevenue = personaMetrics.reduce((sum, persona) => sum + persona.revenue, 0)
  const totalVisitors = personaMetrics.reduce((sum, persona) => sum + persona.visitors, 0)
  const totalEnrollments = personaMetrics.reduce((sum, persona) => sum + persona.enrollments, 0)
  const unacknowledgedAlerts = alerts.filter((alert) => !alert.acknowledged).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600">Unified insights across all your platforms</p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={selectedTimeframe}
                onChange={(e) => setTimeframe(e.target.value as any)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>
            </div>

            <Button variant="outline" onClick={refreshData} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>

            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </motion.div>

        {/* Alerts */}
        {unacknowledgedAlerts > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  <div className="flex-1">
                    <p className="font-medium text-orange-800">
                      You have {unacknowledgedAlerts} unacknowledged alert{unacknowledgedAlerts > 1 ? "s" : ""}
                    </p>
                    <p className="text-sm text-orange-600">Review your alerts to ensure optimal performance</p>
                  </div>
                  <Button variant="outline" size="sm">
                    View Alerts
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
                </div>
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+12.5% vs last period</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Visitors</p>
                  <p className="text-2xl font-bold">{totalVisitors.toLocaleString()}</p>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+8.3% vs last period</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Enrollments</p>
                  <p className="text-2xl font-bold">{totalEnrollments}</p>
                </div>
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Target className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <div className="flex items-center mt-2">
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                <span className="text-sm text-red-600">-2.1% vs last period</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Overall Conversion</p>
                  <p className="text-2xl font-bold">{funnelMetrics?.overallConversion}%</p>
                </div>
                <div className="p-2 bg-orange-100 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-orange-600" />
                </div>
              </div>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+0.3% vs last period</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Dashboard Tabs */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="funnel">Funnel Analysis</TabsTrigger>
              <TabsTrigger value="personas">Personas</TabsTrigger>
              <TabsTrigger value="shadow">Shadow Funnel</TabsTrigger>
              <TabsTrigger value="attribution">Attribution</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <FunnelVisualization />
                <PersonaPerformance />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ShadowFunnelTracker />
                <IntegrationStatus />
              </div>
            </TabsContent>

            <TabsContent value="funnel">
              <FunnelVisualization detailed />
            </TabsContent>

            <TabsContent value="personas">
              <PersonaPerformance detailed />
            </TabsContent>

            <TabsContent value="shadow">
              <ShadowFunnelTracker detailed />
            </TabsContent>

            <TabsContent value="attribution">
              <RevenueAttribution />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}
