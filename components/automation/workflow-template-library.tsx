"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { LayoutTemplateIcon as Template, Search, Clock, Zap, Download, Star } from "lucide-react"
import { useAutomationStore } from "@/store/automation-store"
import type { AutomationTemplate } from "@/types/automation"

const mockTemplates: AutomationTemplate[] = [
  {
    id: "startup-sam-launch",
    name: "Launch Program Enrollment",
    description: "Complete onboarding automation for new Startup Sam customers",
    persona: "startup-sam",
    category: "onboarding",
    platforms: ["zapier", "convertkit", "clickup"],
    estimatedSetupTime: 15,
    complexity: "simple",
    workflow: {
      name: "Startup Sam Launch Program Enrollment",
      platform: "zapier",
      persona: ["startup-sam"],
      trigger: {
        type: "webhook",
        event: "stripe_payment_completed",
        webhookUrl: "/api/webhooks/stripe",
      },
      actions: [
        {
          id: "1",
          platform: "convertkit",
          type: "add_subscriber_tag",
          config: { tag: "launch-program-member" },
          order: 1,
          retryCount: 0,
          status: "pending",
        },
        {
          id: "2",
          platform: "clickup",
          type: "create_project",
          config: { template: "launch-program-template" },
          order: 2,
          retryCount: 0,
          status: "pending",
        },
      ],
    },
  },
  {
    id: "scaling-sarah-diagnostic",
    name: "Business Diagnostic Workflow",
    description: "Advanced workflow for Scaling Sarah business assessment and optimization",
    persona: "scaling-sarah",
    category: "service",
    platforms: ["make", "hubspot", "calendly"],
    estimatedSetupTime: 30,
    complexity: "complex",
    workflow: {
      name: "Scaling Sarah Business Diagnostic",
      platform: "make",
      persona: ["scaling-sarah"],
      trigger: {
        type: "webhook",
        event: "diagnostic_completed",
        webhookUrl: "/api/webhooks/diagnostic",
      },
      actions: [
        {
          id: "1",
          platform: "hubspot",
          type: "create_deal",
          config: { pipeline: "scale-program", stage: "qualified" },
          order: 1,
          retryCount: 0,
          status: "pending",
        },
        {
          id: "2",
          platform: "calendly",
          type: "send_booking_link",
          config: { event_type: "strategy-session" },
          order: 2,
          retryCount: 0,
          status: "pending",
        },
      ],
    },
  },
  {
    id: "learning-larry-progress",
    name: "Learning Progress Tracker",
    description: "Track and encourage Learning Larry's educational journey",
    persona: "learning-larry",
    category: "nurture",
    platforms: ["teachable", "convertkit", "clickup"],
    estimatedSetupTime: 20,
    complexity: "medium",
    workflow: {
      name: "Learning Larry Course Progress",
      platform: "convertkit",
      persona: ["learning-larry"],
      trigger: {
        type: "platform_event",
        event: "course_module_completed",
      },
      actions: [
        {
          id: "1",
          platform: "clickup",
          type: "update_milestone",
          config: { project: "learning-path" },
          order: 1,
          retryCount: 0,
          status: "pending",
        },
      ],
    },
  },
]

export function WorkflowTemplateLibrary() {
  const { templates, deployTemplate, isLoading } = useAutomationStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedPersona, setSelectedPersona] = useState("all")

  useEffect(() => {
    useAutomationStore.getState().setTemplates(mockTemplates)
  }, [])

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory
    const matchesPersona = selectedPersona === "all" || template.persona === selectedPersona

    return matchesSearch && matchesCategory && matchesPersona
  })

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "simple":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "complex":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "onboarding":
        return "🚀"
      case "nurture":
        return "🌱"
      case "service":
        return "⚙️"
      case "retention":
        return "🔄"
      default:
        return "📋"
    }
  }

  const handleDeployTemplate = async (templateId: string) => {
    await deployTemplate(templateId)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Template className="h-5 w-5" />
            <span>Workflow Template Library</span>
          </CardTitle>
          <CardDescription>Pre-built automation templates for each persona journey</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Categories</option>
              <option value="onboarding">Onboarding</option>
              <option value="nurture">Nurture</option>
              <option value="service">Service</option>
              <option value="retention">Retention</option>
            </select>

            <select
              value={selectedPersona}
              onChange={(e) => setSelectedPersona(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Personas</option>
              <option value="startup-sam">Startup Sam</option>
              <option value="scaling-sarah">Scaling Sarah</option>
              <option value="learning-larry">Learning Larry</option>
              <option value="investor-ian">Investor Ian</option>
              <option value="provider-priya">Provider Priya</option>
            </select>
          </div>

          {/* Template Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{getCategoryIcon(template.category)}</span>
                        <div>
                          <CardTitle className="text-lg">{template.name}</CardTitle>
                          <CardDescription className="text-sm">{template.description}</CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="capitalize">
                        {template.persona.replace("-", " ")}
                      </Badge>
                      <Badge className={getComplexityColor(template.complexity)}>{template.complexity}</Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Setup Time</span>
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {template.estimatedSetupTime} min
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Platforms</span>
                        <span className="flex items-center">
                          <Zap className="h-3 w-3 mr-1" />
                          {template.platforms.length}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Category</span>
                        <span className="capitalize">{template.category}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium">Platforms:</p>
                      <div className="flex flex-wrap gap-1">
                        {template.platforms.map((platform) => (
                          <Badge key={platform} variant="secondary" className="text-xs">
                            {platform}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => handleDeployTemplate(template.id)}
                        disabled={isLoading}
                        className="flex-1"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Deploy
                      </Button>
                      <Button size="sm" variant="outline">
                        <Star className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <Template className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">No templates found</p>
              <p className="text-sm text-gray-400">Try adjusting your search criteria</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
