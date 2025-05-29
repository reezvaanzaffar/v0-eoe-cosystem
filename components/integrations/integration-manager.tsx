"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { AlertCircle, CheckCircle, Clock, RefreshCw } from "lucide-react"
import { usePortalStore } from "@/store/portal-store"

interface PlatformConfig {
  id: string
  name: string
  description: string
  icon: string
  status: "connected" | "disconnected" | "error"
  lastSync?: string
  features: string[]
}

const platformConfigs: PlatformConfig[] = [
  {
    id: "clickup",
    name: "ClickUp",
    description: "Project management and task tracking",
    icon: "📋",
    status: "connected",
    lastSync: "2 minutes ago",
    features: ["Task Management", "Progress Tracking", "Team Collaboration"],
  },
  {
    id: "teachable",
    name: "Learning Platform",
    description: "Course delivery and progress tracking",
    icon: "🎓",
    status: "connected",
    lastSync: "5 minutes ago",
    features: ["Course Access", "Progress Tracking", "Assessments"],
  },
  {
    id: "calendly",
    name: "Calendar System",
    description: "Session scheduling and attendance",
    icon: "📅",
    status: "connected",
    lastSync: "1 hour ago",
    features: ["Session Booking", "Attendance Tracking", "Reminders"],
  },
  {
    id: "slack",
    name: "Community Platform",
    description: "Team communication and support",
    icon: "💬",
    status: "connected",
    lastSync: "30 seconds ago",
    features: ["Group Chat", "Direct Messages", "File Sharing"],
  },
  {
    id: "analytics",
    name: "Analytics Dashboard",
    description: "Performance metrics and insights",
    icon: "📊",
    status: "error",
    lastSync: "2 hours ago",
    features: ["Usage Analytics", "Performance Metrics", "Custom Reports"],
  },
]

export function IntegrationManager() {
  const { integrations, updateIntegrationStatus } = usePortalStore()
  const [syncing, setSyncing] = useState<string | null>(null)

  const handleSync = async (platformId: string) => {
    setSyncing(platformId)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    updateIntegrationStatus(platformId, "connected")
    setSyncing(null)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "connected":
        return <Badge className="bg-green-100 text-green-800">Connected</Badge>
      case "error":
        return <Badge className="bg-red-100 text-red-800">Error</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">Disconnected</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Platform Integrations</h2>
        <p className="text-gray-600">Manage your connected platforms and data synchronization</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {platformConfigs.map((platform) => (
          <Card key={platform.id} className="relative">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{platform.icon}</span>
                  <div>
                    <CardTitle className="text-lg">{platform.name}</CardTitle>
                    <CardDescription>{platform.description}</CardDescription>
                  </div>
                </div>
                {getStatusIcon(platform.status)}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status</span>
                {getStatusBadge(platform.status)}
              </div>

              {platform.lastSync && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Last Sync</span>
                  <span className="text-sm text-gray-600">{platform.lastSync}</span>
                </div>
              )}

              <div>
                <span className="text-sm font-medium mb-2 block">Features</span>
                <div className="flex flex-wrap gap-2">
                  {platform.features.map((feature, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center space-x-2">
                  <Switch checked={platform.status === "connected"} disabled={syncing === platform.id} />
                  <span className="text-sm">Auto-sync</span>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSync(platform.id)}
                  disabled={syncing === platform.id}
                >
                  {syncing === platform.id ? (
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-2" />
                  )}
                  Sync Now
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
