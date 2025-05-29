"use client"

import { CheckCircle, XCircle, AlertCircle, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface IntegrationPlatform {
  name: string
  status: "connected" | "disconnected" | "warning" | "pending"
  lastSync: string
  health: number
  type: string
}

interface IntegrationStatusProps {
  data: IntegrationPlatform[]
}

export function IntegrationStatus({ data }: IntegrationStatusProps) {
  // Provide default data if none is provided
  const defaultData: IntegrationPlatform[] = [
    {
      name: "Google Analytics 4",
      status: "connected",
      lastSync: "2024-01-20T10:30:00Z",
      health: 98,
      type: "Analytics",
    },
    {
      name: "Stripe",
      status: "connected",
      lastSync: "2024-01-20T10:25:00Z",
      health: 100,
      type: "Payment",
    },
    {
      name: "ConvertKit",
      status: "warning",
      lastSync: "2024-01-20T09:45:00Z",
      health: 85,
      type: "Email",
    },
    {
      name: "HubSpot",
      status: "connected",
      lastSync: "2024-01-20T10:20:00Z",
      health: 95,
      type: "CRM",
    },
    {
      name: "Facebook Graph API",
      status: "pending",
      lastSync: "2024-01-20T08:30:00Z",
      health: 0,
      type: "Social",
    },
    {
      name: "Zapier",
      status: "disconnected",
      lastSync: "2024-01-19T15:20:00Z",
      health: 0,
      type: "Automation",
    },
  ]

  const platformData = data.length > 0 ? data : defaultData

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "disconnected":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case "pending":
        return <Clock className="h-5 w-5 text-blue-500" />
      default:
        return <XCircle className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      connected: "default",
      disconnected: "destructive",
      warning: "secondary",
      pending: "outline",
    } as const

    return (
      <Badge variant={variants[status as keyof typeof variants] || "outline"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const formatLastSync = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 60) {
      return `${diffMins} minutes ago`
    } else if (diffMins < 1440) {
      return `${Math.floor(diffMins / 60)} hours ago`
    } else {
      return `${Math.floor(diffMins / 1440)} days ago`
    }
  }

  const connectedCount = platformData.filter((p) => p.status === "connected").length
  const totalCount = platformData.length
  const overallHealth = Math.round(platformData.reduce((sum, platform) => sum + platform.health, 0) / totalCount)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{connectedCount}</div>
          <div className="text-sm text-gray-600">Connected</div>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold">{totalCount}</div>
          <div className="text-sm text-gray-600">Total Integrations</div>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{overallHealth}%</div>
          <div className="text-sm text-gray-600">Overall Health</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {platformData.map((platform) => (
          <div key={platform.name} className="p-4 border rounded-lg bg-white">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                {getStatusIcon(platform.status)}
                <span className="font-semibold">{platform.name}</span>
              </div>
              {getStatusBadge(platform.status)}
            </div>
            <div className="text-xs text-gray-600 mb-2">{platform.type}</div>
            <div className="flex justify-between items-center text-sm">
              <span>Health: {platform.health}%</span>
              <span>Last sync: {formatLastSync(platform.lastSync)}</span>
            </div>
            <div className="mt-2 bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${platform.health}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
