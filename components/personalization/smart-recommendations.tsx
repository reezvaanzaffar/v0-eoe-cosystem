"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Video, PenToolIcon as Tool, Star, ArrowRight, X } from "lucide-react"
import { usePersonalizationStore } from "@/store/personalization-store"
import type { ContentRecommendation } from "@/types/personalization"

const mockRecommendations: ContentRecommendation[] = [
  {
    id: "1",
    title: "Product Research Masterclass",
    description: "Learn advanced techniques for finding profitable products",
    url: "/courses/product-research",
    type: "course",
    persona: ["startup-sam", "learning-larry"],
    priority: 10,
    engagementLevel: "beginner",
  },
  {
    id: "2",
    title: "Scaling Your Amazon Business",
    description: "Strategies for growing from 6 to 7 figures",
    url: "/guides/scaling-strategies",
    type: "article",
    persona: ["scaling-sarah"],
    priority: 9,
    engagementLevel: "intermediate",
  },
  {
    id: "3",
    title: "Investment Due Diligence Checklist",
    description: "Complete checklist for evaluating Amazon businesses",
    url: "/tools/due-diligence",
    type: "tool",
    persona: ["investor-ian"],
    priority: 8,
    engagementLevel: "advanced",
  },
  {
    id: "4",
    title: "Building Your Service Portfolio",
    description: "How to position yourself as an Amazon expert",
    url: "/guides/service-portfolio",
    type: "article",
    persona: ["provider-priya"],
    priority: 7,
    engagementLevel: "intermediate",
  },
]

interface SmartRecommendationsProps {
  maxRecommendations?: number
  showDismiss?: boolean
  variant?: "sidebar" | "inline" | "modal"
}

export function SmartRecommendations({
  maxRecommendations = 3,
  showDismiss = true,
  variant = "sidebar",
}: SmartRecommendationsProps) {
  const { currentPersona, engagementLevel, trackBehavior, addRecommendation } = usePersonalizationStore()
  const [recommendations, setRecommendations] = useState<ContentRecommendation[]>([])
  const [dismissedIds, setDismissedIds] = useState<string[]>([])

  useEffect(() => {
    if (!currentPersona) return

    // Filter recommendations based on persona and engagement level
    const filteredRecommendations = mockRecommendations
      .filter((rec) => {
        return (
          rec.persona.includes(currentPersona.persona) &&
          rec.engagementLevel === engagementLevel &&
          !dismissedIds.includes(rec.id)
        )
      })
      .sort((a, b) => b.priority - a.priority)
      .slice(0, maxRecommendations)

    setRecommendations(filteredRecommendations)

    // Add to store
    filteredRecommendations.forEach((rec) => addRecommendation(rec))
  }, [currentPersona, engagementLevel, dismissedIds, maxRecommendations, addRecommendation])

  const handleRecommendationClick = (recommendation: ContentRecommendation) => {
    trackBehavior("recommendation_click", {
      recommendationId: recommendation.id,
      type: recommendation.type,
      persona: currentPersona?.persona,
    })
  }

  const handleDismiss = (id: string) => {
    setDismissedIds((prev) => [...prev, id])
    trackBehavior("recommendation_dismiss", { recommendationId: id })
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "course":
        return <BookOpen className="h-4 w-4" />
      case "video":
        return <Video className="h-4 w-4" />
      case "tool":
        return <Tool className="h-4 w-4" />
      default:
        return <Star className="h-4 w-4" />
    }
  }

  const getVariantStyles = () => {
    switch (variant) {
      case "inline":
        return "grid grid-cols-1 md:grid-cols-3 gap-4"
      case "modal":
        return "space-y-4 max-w-md"
      default:
        return "space-y-3"
    }
  }

  if (recommendations.length === 0) return null

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Recommended for You</h3>
        <Badge variant="outline" className="text-xs">
          {currentPersona?.persona.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
        </Badge>
      </div>

      <div className={getVariantStyles()}>
        {recommendations.map((recommendation, index) => (
          <motion.div
            key={recommendation.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="relative group hover:shadow-md transition-shadow">
              {showDismiss && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleDismiss(recommendation.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}

              <CardHeader className="pb-3">
                <div className="flex items-start space-x-2">
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-600">{getIcon(recommendation.type)}</div>
                  <div className="flex-1">
                    <CardTitle className="text-sm font-medium">{recommendation.title}</CardTitle>
                    <CardDescription className="text-xs mt-1">{recommendation.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs capitalize">
                    {recommendation.type}
                  </Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-xs"
                    onClick={() => handleRecommendationClick(recommendation)}
                  >
                    View <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {variant === "sidebar" && (
        <Button variant="outline" className="w-full text-sm">
          View All Recommendations
        </Button>
      )}
    </div>
  )
}
