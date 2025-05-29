"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users, Award, TrendingUp, MessageSquare, Star, ExternalLink, Target } from "lucide-react"
import { useFacebookIntegrationStore } from "@/store/facebook-integration-store"

interface MemberAchievement {
  id: string
  title: string
  description: string
  icon: string
  earnedDate: string
  platform: "website" | "facebook" | "both"
  shareToGroup: boolean
}

interface MemberProgress {
  websiteProgress: {
    coursesCompleted: number
    toolsDownloaded: number
    servicesEnrolled: number
    engagementScore: number
  }
  groupProgress: {
    postsCreated: number
    commentsPosted: number
    helpfulAnswers: number
    reputationScore: number
  }
  crossPlatformScore: number
}

const mockAchievements: MemberAchievement[] = [
  {
    id: "1",
    title: "First Product Launch",
    description: "Successfully launched your first Amazon product",
    icon: "🚀",
    earnedDate: "2024-01-25",
    platform: "website",
    shareToGroup: true,
  },
  {
    id: "2",
    title: "Community Helper",
    description: "Provided 10 helpful answers in the group",
    icon: "🤝",
    earnedDate: "2024-01-20",
    platform: "facebook",
    shareToGroup: false,
  },
  {
    id: "3",
    title: "Course Completion",
    description: "Completed the Product Research Masterclass",
    icon: "🎓",
    earnedDate: "2024-01-15",
    platform: "website",
    shareToGroup: true,
  },
]

export function MemberJourneyIntegration() {
  const { isGroupMember, userFacebookId } = useFacebookIntegrationStore()
  const [memberProgress, setMemberProgress] = useState<MemberProgress | null>(null)
  const [achievements, setAchievements] = useState<MemberAchievement[]>([])

  useEffect(() => {
    // Initialize with mock data
    const mockProgress: MemberProgress = {
      websiteProgress: {
        coursesCompleted: 3,
        toolsDownloaded: 8,
        servicesEnrolled: 1,
        engagementScore: 78,
      },
      groupProgress: {
        postsCreated: 5,
        commentsPosted: 23,
        helpfulAnswers: 12,
        reputationScore: 85,
      },
      crossPlatformScore: 82,
    }

    setMemberProgress(mockProgress)
    setAchievements(mockAchievements)
  }, [])

  const handleShareAchievement = (achievement: MemberAchievement) => {
    const shareText = `🎉 Just earned "${achievement.title}" - ${achievement.description}! Thanks to the amazing Ecommerce Outset community for the support! #Achievement #AmazonSeller`
    const groupUrl = `https://www.facebook.com/groups/ecommerceoutset/`
    window.open(`${groupUrl}?text=${encodeURIComponent(shareText)}`, "_blank")
  }

  const handleConnectFacebook = () => {
    // In real implementation, this would trigger Facebook Login
    alert("Facebook Login integration would be implemented here")
  }

  if (!memberProgress) return null

  return (
    <div className="space-y-6">
      {/* Cross-Platform Progress Overview */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Your Journey Progress</span>
            </CardTitle>
            <CardDescription>Track your progress across website and Facebook group</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Website Progress */}
              <div className="space-y-4">
                <h4 className="font-semibold flex items-center">
                  <Target className="h-4 w-4 mr-2 text-blue-500" />
                  Website Progress
                </h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Courses Completed</span>
                      <span>{memberProgress.websiteProgress.coursesCompleted}/5</span>
                    </div>
                    <Progress value={(memberProgress.websiteProgress.coursesCompleted / 5) * 100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Tools Downloaded</span>
                      <span>{memberProgress.websiteProgress.toolsDownloaded}/10</span>
                    </div>
                    <Progress value={(memberProgress.websiteProgress.toolsDownloaded / 10) * 100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Engagement Score</span>
                      <span>{memberProgress.websiteProgress.engagementScore}/100</span>
                    </div>
                    <Progress value={memberProgress.websiteProgress.engagementScore} className="h-2" />
                  </div>
                </div>
              </div>

              {/* Group Progress */}
              <div className="space-y-4">
                <h4 className="font-semibold flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2 text-green-500" />
                  Group Progress
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Posts Created</span>
                    <span className="font-semibold">{memberProgress.groupProgress.postsCreated}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Comments Posted</span>
                    <span className="font-semibold">{memberProgress.groupProgress.commentsPosted}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Helpful Answers</span>
                    <span className="font-semibold">{memberProgress.groupProgress.helpfulAnswers}</span>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Reputation Score</span>
                      <span>{memberProgress.groupProgress.reputationScore}/100</span>
                    </div>
                    <Progress value={memberProgress.groupProgress.reputationScore} className="h-2" />
                  </div>
                </div>
              </div>

              {/* Overall Score */}
              <div className="space-y-4">
                <h4 className="font-semibold flex items-center">
                  <Star className="h-4 w-4 mr-2 text-purple-500" />
                  Overall Score
                </h4>
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-600 mb-2">{memberProgress.crossPlatformScore}</div>
                  <Progress value={memberProgress.crossPlatformScore} className="h-3 mb-2" />
                  <p className="text-sm text-gray-600">Cross-Platform Engagement</p>
                </div>
                <div className="space-y-2">
                  <Badge className="w-full justify-center bg-purple-100 text-purple-800">
                    {memberProgress.crossPlatformScore >= 80
                      ? "Expert Contributor"
                      : memberProgress.crossPlatformScore >= 60
                        ? "Active Member"
                        : "Growing Member"}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Achievements */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-5 w-5" />
              <span>Recent Achievements</span>
            </CardTitle>
            <CardDescription>Celebrate your milestones across both platforms</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="border rounded-lg p-4 text-center"
                >
                  <div className="text-3xl mb-2">{achievement.icon}</div>
                  <h4 className="font-semibold mb-1">{achievement.title}</h4>
                  <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
                  <div className="flex items-center justify-between mb-3">
                    <Badge
                      variant="outline"
                      className={
                        achievement.platform === "website"
                          ? "text-blue-600"
                          : achievement.platform === "facebook"
                            ? "text-green-600"
                            : "text-purple-600"
                      }
                    >
                      {achievement.platform}
                    </Badge>
                    <span className="text-xs text-gray-500">{achievement.earnedDate}</span>
                  </div>
                  {achievement.shareToGroup && (
                    <Button size="sm" variant="outline" onClick={() => handleShareAchievement(achievement)}>
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Share to Group
                    </Button>
                  )}
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Facebook Connection Status */}
      {!isGroupMember && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-900">Connect Your Facebook Account</h3>
                  <p className="text-sm text-blue-700">
                    Link your Facebook account to sync your group activity and unlock exclusive member benefits
                  </p>
                </div>
                <Button onClick={handleConnectFacebook} className="bg-blue-600 hover:bg-blue-700">
                  Connect Facebook
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
