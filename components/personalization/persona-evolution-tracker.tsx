"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Users, Target, Award } from "lucide-react"
import { usePersonalizationStore } from "@/store/personalization-store"

interface PersonaEvolution {
  fromPersona: string
  toPersona: string
  probability: number
  indicators: string[]
  timeframe: string
}

const mockEvolutionData: PersonaEvolution[] = [
  {
    fromPersona: "startup-sam",
    toPersona: "scaling-sarah",
    probability: 75,
    indicators: ["High engagement with scaling content", "Multiple product launches", "Revenue growth"],
    timeframe: "3-6 months",
  },
  {
    fromPersona: "learning-larry",
    toPersona: "provider-priya",
    probability: 60,
    indicators: ["Expert-level knowledge", "Community contributions", "Teaching behavior"],
    timeframe: "6-12 months",
  },
]

export function PersonaEvolutionTracker() {
  const { currentPersona, behaviorScore, trackBehavior } = usePersonalizationStore()
  const [evolutionPredictions, setEvolutionPredictions] = useState<PersonaEvolution[]>([])

  useEffect(() => {
    if (!currentPersona) return

    // Filter evolution predictions for current persona
    const relevantEvolutions = mockEvolutionData.filter((evo) => evo.fromPersona === currentPersona.persona)
    setEvolutionPredictions(relevantEvolutions)

    // Track persona evolution analysis
    trackBehavior("persona_evolution_analysis", {
      currentPersona: currentPersona.persona,
      engagementScore: behaviorScore,
      predictions: relevantEvolutions.length,
    })
  }, [currentPersona, behaviorScore, trackBehavior])

  const getPersonaDisplayName = (persona: string) => {
    return persona
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  const getPersonaIcon = (persona: string) => {
    const icons: Record<string, string> = {
      "startup-sam": "🚀",
      "scaling-sarah": "📈",
      "learning-larry": "🎓",
      "investor-ian": "💼",
      "provider-priya": "🤝",
    }
    return icons[persona] || "👤"
  }

  if (!currentPersona || evolutionPredictions.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5" />
          <span>Persona Evolution Insights</span>
        </CardTitle>
        <CardDescription>Predicted growth paths based on your engagement patterns</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
          <span className="text-2xl">{getPersonaIcon(currentPersona.persona)}</span>
          <div>
            <p className="font-semibold">Current Persona</p>
            <p className="text-sm text-gray-600">{getPersonaDisplayName(currentPersona.persona)}</p>
          </div>
          <Badge className="ml-auto">{currentPersona.confidence}% confidence</Badge>
        </div>

        {evolutionPredictions.map((evolution, index) => (
          <div key={index} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <span className="text-xl">{getPersonaIcon(evolution.toPersona)}</span>
                <div>
                  <p className="font-semibold">Potential Evolution</p>
                  <p className="text-sm text-gray-600">{getPersonaDisplayName(evolution.toPersona)}</p>
                </div>
              </div>
              <Badge variant={evolution.probability > 70 ? "default" : "secondary"}>
                {evolution.probability}% likely
              </Badge>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Evolution Probability</span>
                  <span>{evolution.probability}%</span>
                </div>
                <Progress value={evolution.probability} className="h-2" />
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Key Indicators:</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  {evolution.indicators.map((indicator, idx) => (
                    <li key={idx} className="flex items-center space-x-2">
                      <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                      <span>{indicator}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Expected timeframe: {evolution.timeframe}</span>
                <span>Based on engagement patterns</span>
              </div>
            </div>
          </div>
        ))}

        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <Users className="h-4 w-4 mx-auto mb-1 text-blue-500" />
            <p className="text-xs text-gray-600">Engagement Score</p>
            <p className="font-semibold">{behaviorScore}/100</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <Target className="h-4 w-4 mx-auto mb-1 text-green-500" />
            <p className="text-xs text-gray-600">Service Readiness</p>
            <p className="font-semibold">{currentPersona.serviceReadiness}/100</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <Award className="h-4 w-4 mx-auto mb-1 text-purple-500" />
            <p className="text-xs text-gray-600">Growth Stage</p>
            <p className="font-semibold text-xs">
              {behaviorScore < 30 ? "Early" : behaviorScore < 70 ? "Growing" : "Advanced"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
