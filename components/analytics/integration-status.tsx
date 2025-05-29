"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertCircle, Clock, RefreshCw } from "lucide-react"

const integrations = [
  {
    platform: "Google Analytics 4",
    status: "connected",
    lastSync: "2 minutes ago",
    dataPoints: 15420,
    icon: "📊",
  },
  {
    platform: "Facebook Insights",
    status: "connected",
    lastSync: "5 minutes ago",
    dataPoints: 8930,
    icon: "📘",
  },
  {
    platform: "ConvertKit",
    status: "connected",
    lastSync: "1 hour ago",
    dataPoints: 3240,
    icon: "✉️",
  },
  {
    platform: "Stripe",
    status: "connected",
    lastSync: "30 minutes ago",
    dataPoints: 156,
    icon: "💳",
  },
  {
    platform: "ClickUp",
    status: "error",
    lastSync: "3 hours ago",
    dataPoints: 0,
    icon: "📋",
    error: "API rate limit exceeded",
  },
  {
    platform: "Teachable",
    status: "syncing",
    lastSync: "Syncing...",
    dataPoints: 890,
    icon: "🎓",
  },
]

export function IntegrationStatus() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "syncing":
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "connected":
        return <Badge className="bg-green-100 text-green-800">Connected</Badge>
      case "error":
        return <Badge className="bg-red-100 text-red-800">Error</Badge>
      case "syncing":
        return <Badge className="bg-blue-100 text-blue-800">Syncing</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">Disconnected</Badge>
    }
  }

  const connectedCount = integrations.filter((i) => i.status === "connected").length
  const totalIntegrations = integrations.length

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Platform Integrations</span>
          <Badge variant="outline">
            {connectedCount}/{totalIntegrations} Connected
          </Badge>
        </CardTitle>
        <CardDescription>Monitor your data source connections</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {integrations.map((integration) => (
            <div key={integration.platform} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-lg">{integration.icon}</span>
                <div>
                  <p className="font-medium text-sm">{integration.platform}</p>
                  <p className="text-xs text-gray-600">{integration.dataPoints.toLocaleString()} data points</p>
                  {integration.error && <p className="text-xs text-red-600">{integration.error}</p>}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div className="text-right">
                  <div className="flex items-center space-x-1 mb-1">
                    {getStatusIcon(integration.status)}
                    {getStatusBadge(integration.status)}
                  </div>
                  <p className="text-xs text-gray-500">{integration.lastSync}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Overall Health</p>
              <p className="text-xs text-gray-600">
                {connectedCount} of {totalIntegrations} integrations working properly
              </p>
            </div>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Sync All
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
