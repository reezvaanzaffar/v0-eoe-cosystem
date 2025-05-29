"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, Brain, Target, TrendingUp, Shield, RefreshCw } from "lucide-react"
import { usePersonalizationStore } from "@/store/personalization-store"
import { SmartRecommendations } from "./smart-recommendations"
import { PersonaEvolutionTracker } from "./persona-evolution-tracker"

export function PersonalizationDashboard() {
  const {
    currentPersona,
    behaviorScore,
    engagementLevel,
    isPersonalizationEnabled,
    consentGiven,
    appliedRules,
    recommendations,
    setConsentGiven,
    resetPersonalization,
  } = usePersonalizationStore()

  const [activeTab, setActiveTab] = useState("overview")

  const handleTogglePersonalization = (enabled: boolean) => {
    setConsentGiven(enabled)
    if (!enabled) {
      resetPersonalization()
    }
  }

  const getEngagementColor = (level: string) => {
    switch (level) {
      case "high":
        return "text-green-600 bg-green-100"
      case "medium":
        return "text-yellow-600 bg-yellow-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

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
            <h1 className="text-3xl font-bold text-gray-900">Personalization Dashboard</h1>
            <p className="text-gray-600">AI-powered content optimization and persona insights</p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-gray-500" />
              <span className="text-sm">Personalization</span>
              <Switch checked={consentGiven} onCheckedChange={handleTogglePersonalization} />
            </div>
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </motion.div>

        {/* Status Cards */}
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
                  <Brain className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Current Persona</p>
                  <p className="font-semibold">
                    {currentPersona
                      ? currentPersona.persona
                          .split("-")
                          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(" ")
                      : "Not Identified"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Target className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Engagement Score</p>
                  <p className="font-semibold">{behaviorScore}/100</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${getEngagementColor(engagementLevel)}`}>
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Engagement Level</p>
                  <p className="font-semibold capitalize">{engagementLevel}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <RefreshCw className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active Rules</p>
                  <p className="font-semibold">{appliedRules.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              <TabsTrigger value="evolution">Evolution</TabsTrigger>
              <TabsTrigger value="rules">Rules</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Personalization Overview</CardTitle>
                      <CardDescription>Your current personalization status and insights</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {currentPersona ? (
                        <div className="space-y-4">
                          <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
                            <span className="text-3xl">
                              {currentPersona.persona === "startup-sam"
                                ? "🚀"
                                : currentPersona.persona === "scaling-sarah"
                                  ? "📈"
                                  : currentPersona.persona === "learning-larry"
                                    ? "🎓"
                                    : currentPersona.persona === "investor-ian"
                                      ? "💼"
                                      : "🤝"}
                            </span>
                            <div>
                              <h3 className="font-semibold text-lg">
                                {currentPersona.persona
                                  .split("-")
                                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                  .join(" ")}
                              </h3>
                              <p className="text-sm text-gray-600">
                                Confidence: {currentPersona.confidence}% • Last updated:{" "}
                                {new Date(currentPersona.lastUpdated).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-3 border rounded-lg">
                              <p className="text-sm text-gray-600">Service Readiness</p>
                              <p className="text-xl font-bold">{currentPersona.serviceReadiness}%</p>
                            </div>
                            <div className="text-center p-3 border rounded-lg">
                              <p className="text-sm text-gray-600">Completed Actions</p>
                              <p className="text-xl font-bold">{currentPersona.completedActions.length}</p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Brain className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                          <p className="text-gray-500">No persona identified yet</p>
                          <p className="text-sm text-gray-400">Complete the quiz to get personalized content</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <SmartRecommendations maxRecommendations={5} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="recommendations">
              <SmartRecommendations maxRecommendations={10} variant="inline" />
            </TabsContent>

            <TabsContent value="evolution">
              <PersonaEvolutionTracker />
            </TabsContent>

            <TabsContent value="rules">
              <Card>
                <CardHeader>
                  <CardTitle>Active Personalization Rules</CardTitle>
                  <CardDescription>Rules currently applied to your experience</CardDescription>
                </CardHeader>
                <CardContent>
                  {appliedRules.length > 0 ? (
                    <div className="space-y-3">
                      {appliedRules.map((rule) => (
                        <div key={rule.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">{rule.name}</h4>
                            <span className="text-sm text-gray-500">Priority: {rule.priority}</span>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">
                            {rule.conditions.length} conditions • {rule.actions.length} actions
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {rule.actions.map((action, index) => (
                              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                {action.type}: {action.target}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Settings className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-gray-500">No active rules</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}
