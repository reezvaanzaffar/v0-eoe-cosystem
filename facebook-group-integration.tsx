"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, MessageSquare, TrendingUp, Send, Award, Settings } from "lucide-react"
import { GroupBridgeInterface } from "./components/facebook/group-bridge-interface"
import { PersonaGroupNavigation } from "./components/facebook/persona-group-navigation"
import { MemberJourneyIntegration } from "./components/facebook/member-journey-integration"
import { ContentSyndicationManager } from "./components/facebook/content-syndication-manager"

export default function FacebookGroupIntegrationHub() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="p-3 bg-blue-500 rounded-full text-white">
              <Users className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Facebook Group Integration Hub</h1>
              <p className="text-gray-600">Connect your 14,348+ member community with your website ecosystem</p>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-4">
            <Badge className="bg-blue-100 text-blue-800">
              <Users className="h-3 w-3 mr-1" />
              14,348+ Members
            </Badge>
            <Badge className="bg-green-100 text-green-800">
              <TrendingUp className="h-3 w-3 mr-1" />
              Growing Community
            </Badge>
            <Badge className="bg-purple-100 text-purple-800">
              <MessageSquare className="h-3 w-3 mr-1" />
              Active Discussions
            </Badge>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview" className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Overview</span>
              </TabsTrigger>
              <TabsTrigger value="personas" className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4" />
                <span>Personas</span>
              </TabsTrigger>
              <TabsTrigger value="journey" className="flex items-center space-x-2">
                <Award className="h-4 w-4" />
                <span>Journey</span>
              </TabsTrigger>
              <TabsTrigger value="content" className="flex items-center space-x-2">
                <Send className="h-4 w-4" />
                <span>Content</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <GroupBridgeInterface />
            </TabsContent>

            <TabsContent value="personas" className="space-y-6">
              <PersonaGroupNavigation />
            </TabsContent>

            <TabsContent value="journey" className="space-y-6">
              <MemberJourneyIntegration />
            </TabsContent>

            <TabsContent value="content" className="space-y-6">
              <ContentSyndicationManager />
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Integration Settings</CardTitle>
                  <CardDescription>Configure your Facebook group integration preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Facebook Graph API</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Connect to Facebook Graph API for enhanced group integration features
                      </p>
                      <Badge className="bg-yellow-100 text-yellow-800">Configuration Required</Badge>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Privacy Settings</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Manage data sharing and privacy preferences for cross-platform integration
                      </p>
                      <Badge className="bg-green-100 text-green-800">Compliant</Badge>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Content Moderation</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Set up automated moderation rules for content syndication
                      </p>
                      <Badge className="bg-blue-100 text-blue-800">Active</Badge>
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
