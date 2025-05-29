"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users, MessageSquare, Bug, Zap, Target, AlertTriangle, CheckCircle } from "lucide-react"
import { useTestingStore } from "@/store/testing-store"

export function TestingDashboard() {
  const { personaJourneys, activeTests, performanceMetrics, feedbackItems, errorReports, accessibilityScore } =
    useTestingStore()

  const [activeTab, setActiveTab] = useState("overview")

  // Calculate metrics
  const totalFeedback = feedbackItems.length
  const positiveFeedback = feedbackItems.filter((f) => f.rating && f.rating > 0).length
  const activeBugs = errorReports.filter((e) => !e.resolved).length
  const runningTests = activeTests.filter((t) => t.isActive).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">Testing & Optimization Dashboard</h1>
          <p className="text-gray-600">Monitor user journeys, A/B tests, performance, and feedback</p>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Target className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active A/B Tests</p>
                  <p className="text-2xl font-bold">{runningTests}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">User Feedback</p>
                  <p className="text-2xl font-bold">{totalFeedback}</p>
                  <p className="text-xs text-green-600">
                    {totalFeedback > 0 ? Math.round((positiveFeedback / totalFeedback) * 100) : 0}% positive
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Bug className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active Issues</p>
                  <p className="text-2xl font-bold">{activeBugs}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Zap className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Accessibility Score</p>
                  <p className="text-2xl font-bold">{accessibilityScore}/100</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Dashboard */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="journeys">User Journeys</TabsTrigger>
              <TabsTrigger value="abtests">A/B Tests</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="feedback">Feedback</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Conversion Funnel Overview</CardTitle>
                    <CardDescription>Journey completion rates by persona</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {["startup-sam", "scaling-sarah", "learning-larry", "investor-ian", "provider-priya"].map(
                        (persona) => (
                          <div key={persona} className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="capitalize">{persona.replace("-", " ")}</span>
                              <span>75%</span>
                            </div>
                            <Progress value={75} className="h-2" />
                          </div>
                        ),
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Feedback</CardTitle>
                    <CardDescription>Latest user feedback and ratings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {feedbackItems.slice(0, 5).map((feedback) => (
                        <div key={feedback.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <Badge variant={feedback.type === "bug" ? "destructive" : "default"}>
                                {feedback.type}
                              </Badge>
                              {feedback.rating && (
                                <div className="flex items-center">
                                  {feedback.rating > 0 ? (
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                  ) : (
                                    <AlertTriangle className="h-4 w-4 text-red-500" />
                                  )}
                                </div>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{feedback.message || "Quick feedback"}</p>
                            <p className="text-xs text-gray-400">{feedback.pageUrl}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="journeys">
              <Card>
                <CardHeader>
                  <CardTitle>Persona Journey Analysis</CardTitle>
                  <CardDescription>Track user progression through conversion funnels</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500">Journey tracking data will appear here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="abtests">
              <Card>
                <CardHeader>
                  <CardTitle>A/B Test Results</CardTitle>
                  <CardDescription>Monitor test performance and statistical significance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Target className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500">A/B test results will appear here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance">
              <Card>
                <CardHeader>
                  <CardTitle>Core Web Vitals</CardTitle>
                  <CardDescription>Monitor page performance and user experience metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Zap className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500">Performance metrics will appear here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="feedback">
              <Card>
                <CardHeader>
                  <CardTitle>User Feedback Analysis</CardTitle>
                  <CardDescription>Analyze user feedback trends and satisfaction</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {feedbackItems.map((feedback) => (
                      <div key={feedback.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant={feedback.type === "bug" ? "destructive" : "default"}>{feedback.type}</Badge>
                          <span className="text-sm text-gray-500">
                            {new Date(feedback.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm mb-2">{feedback.message}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>Page: {feedback.pageUrl}</span>
                          {feedback.persona && <span>Persona: {feedback.persona}</span>}
                          {feedback.rating && <span>Rating: {feedback.rating}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}
