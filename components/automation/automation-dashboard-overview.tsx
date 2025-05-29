"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Zap,
  Activity,
  Clock,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Pause,
  Play,
  RefreshCw,
} from "lucide-react"
import { useAutomationStore } from "@/store/automation-store"

export function AutomationDashboardOverview() {
  const { platforms, workflows, events, metrics, isLoading, refreshData, pauseWorkflow, resumeWorkflow } =
    useAutomationStore()

  useEffect(() => {
    // Initialize with mock data
    const initializeData = async () => {
      const mockPlatforms = [
        {
          id: "zapier",
          name: "Zapier",
          type: "zapier" as const,
          status: "connected" as const,
          lastSync: "2024-01-30T10:30:00Z",
          taskUsage: { current: 1250, limit: 2000, resetDate: "2024-02-01" },
        },
        {
          id: "make",
          name: "Make.com",
          type: "make" as const,
          status: "connected" as const,
          lastSync: "2024-01-30T10:25:00Z",
          taskUsage: { current: 850, limit: 1000, resetDate: "2024-02-01" },
        },
        {
          id: "convertkit",
          name: "ConvertKit",
          type: "native" as const,
          status: "connected" as const,
          lastSync: "2024-01-30T10:20:00Z",
          taskUsage: { current: 0, limit: 0, resetDate: "" },
        },
      ]

      const mockWorkflows = [
        {
          id: "1",
          name: "Startup Sam Launch Program Enrollment",
          platform: "zapier",
          persona: ["startup-sam"],
          trigger: { type: "webhook" as const, event: "stripe_payment_completed" },
          actions: [],
          status: "active" as const,
          successRate: 96.5,
          lastRun: "2024-01-30T09:45:00Z",
          totalRuns: 156,
          avgProcessingTime: 2340,
        },
        {
          id: "2",
          name: "Scaling Sarah Business Diagnostic",
          platform: "make",
          persona: ["scaling-sarah"],
          trigger: { type: "webhook" as const, event: "diagnostic_completed" },
          actions: [],
          status: "active" as const,
          successRate: 94.2,
          lastRun: "2024-01-30T08:30:00Z",
          totalRuns: 89,
          avgProcessingTime: 4560,
        },
        {
          id: "3",
          name: "Learning Larry Course Progress",
          platform: "convertkit",
          persona: ["learning-larry"],
          trigger: { type: "platform_event" as const, event: "course_module_completed" },
          actions: [],
          status: "paused" as const,
          successRate: 98.1,
          lastRun: "2024-01-29T16:20:00Z",
          totalRuns: 234,
          avgProcessingTime: 1200,
        },
      ]

      useAutomationStore.getState().setPlatforms(mockPlatforms)
      useAutomationStore.getState().setWorkflows(mockWorkflows)
      await refreshData()
    }

    initializeData()
  }, [refreshData])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "paused":
        return <Pause className="h-4 w-4 text-yellow-500" />
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "paused":
        return "bg-yellow-100 text-yellow-800"
      case "error":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const recentEvents = events.slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Metrics Overview */}
      {metrics && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Zap className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active Workflows</p>
                  <p className="text-2xl font-bold">{metrics.activeWorkflows}</p>
                  <p className="text-xs text-gray-500">of {metrics.totalWorkflows} total</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Success Rate</p>
                  <p className="text-2xl font-bold">{metrics.successRate}%</p>
                  <p className="text-xs text-green-600">+2.3% this month</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Clock className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Avg Processing</p>
                  <p className="text-2xl font-bold">{(metrics.avgProcessingTime / 1000).toFixed(1)}s</p>
                  <p className="text-xs text-gray-500">per workflow</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <DollarSign className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Cost Savings</p>
                  <p className="text-2xl font-bold">${metrics.costSavings.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">this month</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Platform Status */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Platform Status</span>
                </CardTitle>
                <CardDescription>Monitor your automation platform connections</CardDescription>
              </div>
              <Button variant="outline" onClick={refreshData} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {platforms.map((platform) => (
                <div key={platform.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold">{platform.name}</h4>
                    <Badge className={getStatusColor(platform.status)}>{platform.status}</Badge>
                  </div>

                  {platform.taskUsage.limit > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Task Usage</span>
                        <span>
                          {platform.taskUsage.current}/{platform.taskUsage.limit}
                        </span>
                      </div>
                      <Progress value={(platform.taskUsage.current / platform.taskUsage.limit) * 100} className="h-2" />
                      <p className="text-xs text-gray-500">Resets: {platform.taskUsage.resetDate}</p>
                    </div>
                  )}

                  <p className="text-xs text-gray-500 mt-2">
                    Last sync: {new Date(platform.lastSync).toLocaleTimeString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Active Workflows */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5" />
              <span>Active Workflows</span>
            </CardTitle>
            <CardDescription>Monitor and control your automation workflows</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {workflows.map((workflow) => (
                <div key={workflow.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(workflow.status)}
                      <div>
                        <h4 className="font-semibold">{workflow.name}</h4>
                        <p className="text-sm text-gray-600">
                          {workflow.platform} • {workflow.persona.join(", ")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(workflow.status)}>{workflow.status}</Badge>
                      {workflow.status === "active" ? (
                        <Button size="sm" variant="outline" onClick={() => pauseWorkflow(workflow.id)}>
                          <Pause className="h-3 w-3" />
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => resumeWorkflow(workflow.id)}>
                          <Play className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Success Rate</p>
                      <p className="font-semibold">{workflow.successRate}%</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Total Runs</p>
                      <p className="font-semibold">{workflow.totalRuns}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Avg Time</p>
                      <p className="font-semibold">{(workflow.avgProcessingTime / 1000).toFixed(1)}s</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Last Run</p>
                      <p className="font-semibold">{new Date(workflow.lastRun).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Events */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Recent Events</span>
            </CardTitle>
            <CardDescription>Latest automation executions and results</CardDescription>
          </CardHeader>
          <CardContent>
            {recentEvents.length > 0 ? (
              <div className="space-y-3">
                {recentEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(event.status)}
                      <div>
                        <p className="font-medium">
                          {workflows.find((w) => w.id === event.workflowId)?.name || "Unknown Workflow"}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(event.timestamp).toLocaleString()}
                          {event.errorMessage && ` • ${event.errorMessage}`}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-medium">{(event.processingTime / 1000).toFixed(1)}s</p>
                      {event.retryCount > 0 && <p className="text-xs text-gray-500">{event.retryCount} retries</p>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">No recent events</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
