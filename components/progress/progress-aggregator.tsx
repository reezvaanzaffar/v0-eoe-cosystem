"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Award, Target, Calendar, BookOpen, MessageSquare } from "lucide-react"
import { usePortalStore } from "@/store/portal-store"

interface Milestone {
  id: string
  title: string
  description: string
  progress: number
  target: number
  status: "completed" | "in-progress" | "upcoming"
  dueDate: string
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  earnedDate: string
  category: string
}

const milestones: Milestone[] = [
  {
    id: "1",
    title: "Product Research Complete",
    description: "Complete market research and product selection",
    progress: 85,
    target: 100,
    status: "in-progress",
    dueDate: "2024-02-15",
  },
  {
    id: "2",
    title: "Listing Optimization",
    description: "Create and optimize product listings",
    progress: 60,
    target: 100,
    status: "in-progress",
    dueDate: "2024-02-20",
  },
  {
    id: "3",
    title: "Launch Preparation",
    description: "Prepare for product launch campaign",
    progress: 30,
    target: 100,
    status: "upcoming",
    dueDate: "2024-02-25",
  },
]

const achievements: Achievement[] = [
  {
    id: "1",
    title: "First Week Complete",
    description: "Completed your first week of tasks",
    icon: "🎯",
    earnedDate: "2024-01-15",
    category: "Progress",
  },
  {
    id: "2",
    title: "Course Champion",
    description: "Completed 5 course modules",
    icon: "📚",
    earnedDate: "2024-01-20",
    category: "Learning",
  },
  {
    id: "3",
    title: "Community Contributor",
    description: "Made 10 helpful community posts",
    icon: "💬",
    earnedDate: "2024-01-25",
    category: "Community",
  },
]

export function ProgressAggregator() {
  const { progressMetrics } = usePortalStore()
  const [selectedTimeframe, setSelectedTimeframe] = useState("week")

  const progressData = [
    {
      platform: "ClickUp Tasks",
      current: progressMetrics?.clickupCompletion || 0,
      previous: 65,
      icon: <Target className="h-5 w-5" />,
      color: "bg-blue-500",
    },
    {
      platform: "Course Progress",
      current: progressMetrics?.courseProgress || 0,
      previous: 45,
      icon: <BookOpen className="h-5 w-5" />,
      color: "bg-green-500",
    },
    {
      platform: "Session Attendance",
      current: progressMetrics?.sessionAttendance || 0,
      previous: 80,
      icon: <Calendar className="h-5 w-5" />,
      color: "bg-purple-500",
    },
    {
      platform: "Community Engagement",
      current: progressMetrics?.communityEngagement || 0,
      previous: 55,
      icon: <MessageSquare className="h-5 w-5" />,
      color: "bg-orange-500",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Progress Overview</h2>
          <p className="text-gray-600">Track your advancement across all platforms</p>
        </div>

        <div className="flex space-x-2">
          {["week", "month", "quarter"].map((timeframe) => (
            <Button
              key={timeframe}
              variant={selectedTimeframe === timeframe ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTimeframe(timeframe)}
            >
              {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {progressData.map((item, index) => {
          const change = item.current - item.previous
          const isPositive = change >= 0

          return (
            <motion.div
              key={item.platform}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-lg ${item.color} text-white`}>{item.icon}</div>
                    <div className="flex items-center space-x-1">
                      {isPositive ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      )}
                      <span className={`text-sm font-medium ${isPositive ? "text-green-500" : "text-red-500"}`}>
                        {isPositive ? "+" : ""}
                        {change}%
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{item.platform}</span>
                      <span className="text-lg font-bold">{item.current}%</span>
                    </div>
                    <Progress value={item.current} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Milestones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Current Milestones</span>
          </CardTitle>
          <CardDescription>Track your progress toward key objectives</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {milestones.map((milestone) => (
              <div key={milestone.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{milestone.title}</h4>
                  <Badge
                    variant={
                      milestone.status === "completed"
                        ? "default"
                        : milestone.status === "in-progress"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {milestone.status}
                  </Badge>
                </div>

                <p className="text-sm text-gray-600 mb-3">{milestone.description}</p>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>
                      {milestone.progress}/{milestone.target}
                    </span>
                  </div>
                  <Progress value={(milestone.progress / milestone.target) * 100} className="h-2" />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Due: {milestone.dueDate}</span>
                    <span>{Math.round((milestone.progress / milestone.target) * 100)}% complete</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="h-5 w-5" />
            <span>Recent Achievements</span>
          </CardTitle>
          <CardDescription>Celebrate your accomplishments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="border rounded-lg p-4 text-center"
              >
                <div className="text-3xl mb-2">{achievement.icon}</div>
                <h4 className="font-semibold mb-1">{achievement.title}</h4>
                <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                <Badge variant="outline" className="text-xs">
                  {achievement.category}
                </Badge>
                <p className="text-xs text-gray-500 mt-2">Earned: {achievement.earnedDate}</p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
