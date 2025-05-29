"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Webhook, Send, Copy, CheckCircle, AlertTriangle, Clock, Code, Activity } from "lucide-react"
import { useAutomationStore } from "@/store/automation-store"

interface WebhookEndpoint {
  id: string
  name: string
  url: string
  events: string[]
  status: "active" | "inactive" | "error"
  lastTriggered: string
  totalTriggers: number
  successRate: number
}

const mockWebhookEndpoints: WebhookEndpoint[] = [
  {
    id: "stripe-payments",
    name: "Stripe Payment Events",
    url: "/api/webhooks/stripe",
    events: ["payment.succeeded", "payment.failed", "subscription.created"],
    status: "active",
    lastTriggered: "2024-01-30T10:30:00Z",
    totalTriggers: 156,
    successRate: 98.7,
  },
  {
    id: "quiz-completion",
    name: "Persona Quiz Completion",
    url: "/api/webhooks/quiz",
    events: ["quiz.completed", "persona.identified"],
    status: "active",
    lastTriggered: "2024-01-30T09:45:00Z",
    totalTriggers: 234,
    successRate: 96.2,
  },
  {
    id: "form-submissions",
    name: "Contact Form Submissions",
    url: "/api/webhooks/forms",
    events: ["form.submitted", "lead.created"],
    status: "active",
    lastTriggered: "2024-01-30T08:20:00Z",
    totalTriggers: 89,
    successRate: 94.4,
  },
]

export function WebhookEventManager() {
  const { events, triggerWorkflow } = useAutomationStore()
  const [webhookEndpoints, setWebhookEndpoints] = useState<WebhookEndpoint[]>([])
  const [testPayload, setTestPayload] = useState("")
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>("")

  useEffect(() => {
    setWebhookEndpoints(mockWebhookEndpoints)
  }, [])

  const handleCopyWebhookUrl = (url: string) => {
    const fullUrl = `${window.location.origin}${url}`
    navigator.clipboard.writeText(fullUrl)
    // In real app, show toast notification
    alert("Webhook URL copied to clipboard!")
  }

  const handleTestWebhook = async () => {
    if (!selectedEndpoint || !testPayload) return

    try {
      const payload = JSON.parse(testPayload)
      await triggerWorkflow("test-workflow", payload)
      alert("Test webhook sent successfully!")
    } catch (error) {
      alert("Invalid JSON payload")
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-500" />
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
      case "error":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Webhook className="h-5 w-5" />
            <span>Webhook Event Manager</span>
          </CardTitle>
          <CardDescription>Manage webhook endpoints and monitor event processing</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="endpoints" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
              <TabsTrigger value="events">Recent Events</TabsTrigger>
              <TabsTrigger value="testing">Testing</TabsTrigger>
            </TabsList>

            <TabsContent value="endpoints" className="space-y-4">
              <div className="space-y-3">
                {webhookEndpoints.map((endpoint) => (
                  <motion.div
                    key={endpoint.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(endpoint.status)}
                        <div>
                          <h4 className="font-semibold">{endpoint.name}</h4>
                          <p className="text-sm text-gray-600 font-mono">{endpoint.url}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(endpoint.status)}>{endpoint.status}</Badge>
                        <Button size="sm" variant="outline" onClick={() => handleCopyWebhookUrl(endpoint.url)}>
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-gray-600">Total Triggers</p>
                        <p className="font-semibold">{endpoint.totalTriggers}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Success Rate</p>
                        <p className="font-semibold">{endpoint.successRate}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Last Triggered</p>
                        <p className="font-semibold">{new Date(endpoint.lastTriggered).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Events</p>
                        <p className="font-semibold">{endpoint.events.length}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2">Supported Events:</p>
                      <div className="flex flex-wrap gap-1">
                        {endpoint.events.map((event) => (
                          <Badge key={event} variant="secondary" className="text-xs">
                            {event}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="events" className="space-y-4">
              <div className="space-y-3">
                {events.slice(0, 10).map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(event.status)}
                      <div>
                        <p className="font-medium">Workflow: {event.workflowId}</p>
                        <p className="text-sm text-gray-600">{new Date(event.timestamp).toLocaleString()}</p>
                        {event.errorMessage && <p className="text-sm text-red-600">{event.errorMessage}</p>}
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-medium">{(event.processingTime / 1000).toFixed(1)}s</p>
                      {event.retryCount > 0 && <p className="text-xs text-gray-500">{event.retryCount} retries</p>}
                    </div>
                  </div>
                ))}

                {events.length === 0 && (
                  <div className="text-center py-8">
                    <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500">No recent events</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="testing" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Select Webhook Endpoint</label>
                  <select
                    value={selectedEndpoint}
                    onChange={(e) => setSelectedEndpoint(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="">Select an endpoint...</option>
                    {webhookEndpoints.map((endpoint) => (
                      <option key={endpoint.id} value={endpoint.id}>
                        {endpoint.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Test Payload (JSON)</label>
                  <Textarea
                    placeholder='{"event": "test", "data": {"key": "value"}}'
                    rows={8}
                    value={testPayload}
                    onChange={(e) => setTestPayload(e.target.value)}
                    className="font-mono text-sm"
                  />
                </div>

                <div className="flex space-x-3">
                  <Button onClick={handleTestWebhook} disabled={!selectedEndpoint || !testPayload}>
                    <Send className="h-4 w-4 mr-2" />
                    Send Test Webhook
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      setTestPayload(
                        JSON.stringify(
                          {
                            event: "quiz.completed",
                            data: {
                              userId: "user123",
                              persona: "startup-sam",
                              score: 85,
                              timestamp: new Date().toISOString(),
                            },
                          },
                          null,
                          2,
                        ),
                      )
                    }
                  >
                    <Code className="h-4 w-4 mr-2" />
                    Load Sample
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
