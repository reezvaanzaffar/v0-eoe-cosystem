"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap, Activity, LayoutTemplateIcon as Template, Webhook, BarChart3, Settings } from "lucide-react"
import { AutomationDashboardOverview } from "./components/automation/automation-dashboard-overview"
import { WorkflowTemplateLibrary } from "./components/automation/workflow-template-library"
import { WebhookEventManager } from "./components/automation/webhook-event-manager"

export default function AutomationOrchestrationHub() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="p-3 bg-purple-500 rounded-full text-white">
              <Zap className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Automation Orchestration Hub</h1>
              <p className="text-gray-600">Connect and monitor workflows across all your automation platforms</p>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-4">
            <Badge className="bg-purple-100 text-purple-800">
              <Zap className="h-3 w-3 mr-1" />
              Multi-Platform
            </Badge>
            <Badge className="bg-blue-100 text-blue-800">
              <Activity className="h-3 w-3 mr-1" />
              Real-time Monitoring
            </Badge>
            <Badge className="bg-green-100 text-green-800">
              <Template className="h-3 w-3 mr-1" />
              Pre-built Templates
            </Badge>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview" className="flex items-center space-x-2">
                <Activity className="h-4 w-4" />
                <span>Overview</span>
              </TabsTrigger>
              <TabsTrigger value="templates" className="flex items-center space-x-2">
                <Template className="h-4 w-4" />
                <span>Templates</span>
              </TabsTrigger>
              <TabsTrigger value="webhooks" className="flex items-center space-x-2">
                <Webhook className="h-4 w-4" />
                <span>Webhooks</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span>Analytics</span>
              </TabsTrigger>
              <TabsTrigger value="platforms" className="flex items-center space-x-2">
                <Zap className="h-4 w-4" />
                <span>Platforms</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <AutomationDashboardOverview />
            </TabsContent>

            <TabsContent value="templates" className="space-y-6">
              <WorkflowTemplateLibrary />
            </TabsContent>

            <TabsContent value="webhooks" className="space-y-6">
              <WebhookEventManager />
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Automation Analytics</CardTitle>
                  <CardDescription>Performance metrics and optimization insights</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <Zap className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                        <p className="text-2xl font-bold">94.5%</p>
                        <p className="text-sm text-gray-600">Overall Success Rate</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <Activity className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                        <p className="text-2xl font-bold">2.3s</p>
                        <p className="text-sm text-gray-600">Avg Processing Time</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <BarChart3 className="h-8 w-8 mx-auto mb-2 text-green-500" />
                        <p className="text-2xl font-bold">23.8%</p>
                        <p className="text-sm text-gray-600">Conversion Improvement</p>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="platforms" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Management</CardTitle>
                  <CardDescription>Configure and monitor your automation platform connections</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Zapier Integration</h4>
                      <p className="text-sm text-gray-600 mb-3">Connect to Zapier for simple workflow automation</p>
                      <Badge className="bg-green-100 text-green-800">Connected</Badge>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Make.com Integration</h4>
                      <p className="text-sm text-gray-600 mb-3">Advanced workflow automation with complex logic</p>
                      <Badge className="bg-green-100 text-green-800">Connected</Badge>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Native Platform APIs</h4>
                      <p className="text-sm text-gray-600 mb-3">Direct integration with ConvertKit, HubSpot, ClickUp</p>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Automation Settings</CardTitle>
                  <CardDescription>Configure global automation preferences and security settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Error Handling</h4>
                      <p className="text-sm text-gray-600 mb-3">Configure retry policies and error notifications</p>
                      <Badge className="bg-blue-100 text-blue-800">Configured</Badge>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Security Settings</h4>
                      <p className="text-sm text-gray-600 mb-3">Webhook security and API key management</p>
                      <Badge className="bg-green-100 text-green-800">Secure</Badge>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Compliance</h4>
                      <p className="text-sm text-gray-600 mb-3">GDPR compliance and data retention policies</p>
                      <Badge className="bg-green-100 text-green-800">Compliant</Badge>
                    </div>
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
