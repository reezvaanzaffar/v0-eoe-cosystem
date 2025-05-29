"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Send,
  Calendar,
  Hash,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  ExternalLink,
} from "lucide-react"
import { useFacebookIntegrationStore } from "@/store/facebook-integration-store"

export function ContentSyndicationManager() {
  const { contentSyndications, addContentSyndication, updateSyndicationStatus } = useFacebookIntegrationStore()
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    hashtags: "",
    targetPersonas: [] as string[],
    scheduledTime: "",
  })

  const handleCreateSyndication = () => {
    const syndication = {
      id: Date.now().toString(),
      title: newPost.title,
      content: newPost.content,
      targetPersonas: newPost.targetPersonas,
      hashtags: newPost.hashtags.split(",").map((tag) => tag.trim()),
      scheduledTime: newPost.scheduledTime || undefined,
      status: "draft" as const,
    }

    addContentSyndication(syndication)
    setNewPost({
      title: "",
      content: "",
      hashtags: "",
      targetPersonas: [],
      scheduledTime: "",
    })
  }

  const handlePostToGroup = (id: string) => {
    updateSyndicationStatus(id, "posted")
    // In real implementation, this would post to Facebook Group
    alert("Content posted to Facebook Group!")
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "posted":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "scheduled":
        return <Clock className="h-4 w-4 text-blue-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "posted":
        return "bg-green-100 text-green-800"
      case "failed":
        return "bg-red-100 text-red-800"
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const personaOptions = [
    { id: "startup-sam", name: "Startup Sam", hashtags: "#LaunchJourney #BeginnerSeller" },
    { id: "scaling-sarah", name: "Scaling Sarah", hashtags: "#ScaleUp #Optimization" },
    { id: "learning-larry", name: "Learning Larry", hashtags: "#AmazonEducation #DeepDive" },
    { id: "investor-ian", name: "Investor Ian", hashtags: "#AmazonInvesting #Portfolio" },
    { id: "provider-priya", name: "Provider Priya", hashtags: "#ServiceProviders #Networking" },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Send className="h-5 w-5" />
            <span>Content Syndication Manager</span>
          </CardTitle>
          <CardDescription>Create and schedule content for the Facebook group</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="create" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="create">Create Content</TabsTrigger>
              <TabsTrigger value="scheduled">Scheduled Posts</TabsTrigger>
              <TabsTrigger value="analytics">Performance</TabsTrigger>
            </TabsList>

            <TabsContent value="create" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Post Title</label>
                  <Input
                    placeholder="Enter post title..."
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Content</label>
                  <Textarea
                    placeholder="Write your post content here..."
                    rows={6}
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Target Personas</label>
                    <div className="space-y-2">
                      {personaOptions.map((persona) => (
                        <label key={persona.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={newPost.targetPersonas.includes(persona.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewPost({
                                  ...newPost,
                                  targetPersonas: [...newPost.targetPersonas, persona.id],
                                })
                              } else {
                                setNewPost({
                                  ...newPost,
                                  targetPersonas: newPost.targetPersonas.filter((p) => p !== persona.id),
                                })
                              }
                            }}
                            className="rounded"
                          />
                          <span className="text-sm">{persona.name}</span>
                          <span className="text-xs text-gray-500">{persona.hashtags}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Hashtags</label>
                    <Input
                      placeholder="#hashtag1, #hashtag2, #hashtag3"
                      value={newPost.hashtags}
                      onChange={(e) => setNewPost({ ...newPost, hashtags: e.target.value })}
                    />
                    <p className="text-xs text-gray-500 mt-1">Separate hashtags with commas</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Schedule Time (Optional)</label>
                  <Input
                    type="datetime-local"
                    value={newPost.scheduledTime}
                    onChange={(e) => setNewPost({ ...newPost, scheduledTime: e.target.value })}
                  />
                </div>

                <div className="flex space-x-3">
                  <Button onClick={handleCreateSyndication} className="flex-1">
                    <Send className="h-4 w-4 mr-2" />
                    {newPost.scheduledTime ? "Schedule Post" : "Post Now"}
                  </Button>
                  <Button variant="outline">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Preview in Group
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="scheduled" className="space-y-4">
              <div className="space-y-3">
                {contentSyndications.map((syndication) => (
                  <motion.div
                    key={syndication.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold">{syndication.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{syndication.content.substring(0, 100)}...</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(syndication.status)}
                        <Badge className={getStatusColor(syndication.status)}>{syndication.status}</Badge>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{syndication.targetPersonas.length} personas</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Hash className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{syndication.hashtags.length} hashtags</span>
                        </div>
                        {syndication.scheduledTime && (
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {new Date(syndication.scheduledTime).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>

                      {syndication.status === "draft" && (
                        <Button size="sm" onClick={() => handlePostToGroup(syndication.id)}>
                          Post Now
                        </Button>
                      )}
                    </div>

                    {syndication.performance && (
                      <div className="mt-3 pt-3 border-t grid grid-cols-4 gap-4 text-center">
                        <div>
                          <p className="text-sm text-gray-600">Reach</p>
                          <p className="font-semibold">{syndication.performance.reach}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Engagement</p>
                          <p className="font-semibold">{syndication.performance.engagement}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Clicks</p>
                          <p className="font-semibold">{syndication.performance.clicks}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Conversions</p>
                          <p className="font-semibold">{syndication.performance.conversions}</p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}

                {contentSyndications.length === 0 && (
                  <div className="text-center py-8">
                    <Send className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500">No content syndications yet</p>
                    <p className="text-sm text-gray-400">Create your first post to get started</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-500" />
                    <p className="text-2xl font-bold">2.4K</p>
                    <p className="text-sm text-gray-600">Total Reach</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <BarChart3 className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                    <p className="text-2xl font-bold">8.5%</p>
                    <p className="text-sm text-gray-600">Engagement Rate</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <ExternalLink className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                    <p className="text-2xl font-bold">156</p>
                    <p className="text-sm text-gray-600">Website Clicks</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Content Performance by Persona</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {personaOptions.map((persona) => (
                      <div key={persona.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="font-medium">{persona.name}</span>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-600">{Math.floor(Math.random() * 500 + 100)} reach</span>
                          <span className="text-sm text-gray-600">
                            {(Math.random() * 10 + 5).toFixed(1)}% engagement
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
