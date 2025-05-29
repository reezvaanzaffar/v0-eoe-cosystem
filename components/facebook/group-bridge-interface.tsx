"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, MessageSquare, Heart, Share2, ExternalLink, TrendingUp, Hash, RefreshCw } from "lucide-react"
import { useFacebookIntegrationStore } from "@/store/facebook-integration-store"

export function GroupBridgeInterface() {
  const {
    groupStats,
    recentPosts,
    isGroupMember,
    isConnected,
    lastSync,
    syncGroupData,
    setIsConnected,
    setIsGroupMember,
  } = useFacebookIntegrationStore()

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Initialize with mock data
    const initializeData = async () => {
      setIsLoading(true)
      await syncGroupData()
      setIsConnected(true)
      setIsGroupMember(true) // Mock user as group member
      setIsLoading(false)
    }

    initializeData()
  }, [syncGroupData, setIsConnected, setIsGroupMember])

  const handleJoinGroup = () => {
    window.open("https://www.facebook.com/groups/ecommerceoutset/", "_blank")
  }

  const handleRefreshData = async () => {
    setIsLoading(true)
    await syncGroupData()
    setIsLoading(false)
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const postTime = new Date(timestamp)
    const diffInHours = Math.floor((now.getTime() - postTime.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    return `${Math.floor(diffInHours / 24)}d ago`
  }

  return (
    <div className="space-y-6">
      {/* Group Stats Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/20 rounded-full">
                  <Users className="h-8 w-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Ecommerce Outset Community</h2>
                  <p className="text-blue-100">Join {groupStats?.totalMembers.toLocaleString()}+ Amazon Sellers</p>
                </div>
              </div>

              <div className="text-right">
                {isGroupMember ? (
                  <Badge className="bg-green-500 text-white">Member</Badge>
                ) : (
                  <Button onClick={handleJoinGroup} className="bg-white text-blue-600 hover:bg-blue-50">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Join Group
                  </Button>
                )}
              </div>
            </div>

            {groupStats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold">{groupStats.totalMembers.toLocaleString()}</p>
                  <p className="text-sm text-blue-100">Total Members</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{groupStats.activeMembers.toLocaleString()}</p>
                  <p className="text-sm text-blue-100">Active Members</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{groupStats.postsToday}</p>
                  <p className="text-sm text-blue-100">Posts Today</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{groupStats.engagementRate}%</p>
                  <p className="text-sm text-blue-100">Engagement Rate</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Group Activity */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>Latest Group Discussions</span>
                </CardTitle>
                <CardDescription>Recent posts from the community</CardDescription>
              </div>

              <div className="flex items-center space-x-2">
                {lastSync && (
                  <span className="text-xs text-gray-500">Last updated: {new Date(lastSync).toLocaleTimeString()}</span>
                )}
                <Button variant="outline" size="sm" onClick={handleRefreshData} disabled={isLoading}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              {recentPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    <Avatar>
                      <AvatarImage src={post.author.profilePicture || "/placeholder.svg"} />
                      <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-semibold">{post.author.name}</span>
                        <span className="text-sm text-gray-500">{formatTimeAgo(post.createdTime)}</span>
                        {post.persona && (
                          <Badge variant="outline" className="text-xs">
                            {post.persona[0].replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                          </Badge>
                        )}
                      </div>

                      <p className="text-gray-800 mb-3">{post.message}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Heart className="h-4 w-4" />
                            <span>{post.likes}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageSquare className="h-4 w-4" />
                            <span>{post.comments}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Share2 className="h-4 w-4" />
                            <span>{post.shares}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          {post.hashtags.map((hashtag) => (
                            <Badge key={hashtag} variant="secondary" className="text-xs">
                              {hashtag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <Button variant="outline" onClick={handleJoinGroup}>
                <ExternalLink className="h-4 w-4 mr-2" />
                View All Discussions in Group
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Trending Topics */}
      {groupStats && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Hash className="h-5 w-5" />
                <span>Trending Topics</span>
              </CardTitle>
              <CardDescription>Popular hashtags and discussions this week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {groupStats.topHashtags.map((hashtag, index) => (
                  <motion.div
                    key={hashtag}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Badge variant="outline" className="text-sm px-3 py-1 hover:bg-blue-50 cursor-pointer">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {hashtag}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
