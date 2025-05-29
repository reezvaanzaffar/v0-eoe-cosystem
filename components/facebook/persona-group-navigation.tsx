"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExternalLink, Hash, Users, TrendingUp, MessageSquare } from "lucide-react"
import { useFacebookIntegrationStore } from "@/store/facebook-integration-store"

const personaGroupContent = {
  "startup-sam": {
    name: "Startup Sam",
    icon: "🚀",
    color: "bg-green-500",
    hashtags: ["#LaunchJourney", "#FirstProduct", "#BeginnerSeller", "#ProductResearch", "#NewSeller"],
    description: "Content for new Amazon sellers starting their journey",
    topics: [
      "Product selection strategies",
      "First launch preparation",
      "Beginner-friendly tools",
      "Common startup mistakes",
      "Launch timeline planning",
    ],
  },
  "scaling-sarah": {
    name: "Scaling Sarah",
    icon: "📈",
    color: "bg-blue-500",
    hashtags: ["#ScaleUp", "#Optimization", "#6FigureSeller", "#Growth", "#Automation"],
    description: "Advanced strategies for growing Amazon businesses",
    topics: [
      "Scaling operations",
      "Team building",
      "Process optimization",
      "Multi-channel expansion",
      "Advanced PPC strategies",
    ],
  },
  "learning-larry": {
    name: "Learning Larry",
    icon: "🎓",
    color: "bg-purple-500",
    hashtags: ["#AmazonEducation", "#DeepDive", "#Frameworks", "#Learning", "#Strategy"],
    description: "In-depth educational content and frameworks",
    topics: [
      "Amazon algorithm insights",
      "Market analysis frameworks",
      "Advanced selling strategies",
      "Industry trend analysis",
      "Educational resources",
    ],
  },
  "investor-ian": {
    name: "Investor Ian",
    icon: "💼",
    color: "bg-amber-500",
    hashtags: ["#AmazonInvesting", "#BusinessAcquisition", "#Portfolio", "#DueDiligence", "#ROI"],
    description: "Investment and acquisition focused discussions",
    topics: [
      "Business valuation methods",
      "Due diligence processes",
      "Investment opportunities",
      "Portfolio management",
      "Exit strategies",
    ],
  },
  "provider-priya": {
    name: "Provider Priya",
    icon: "🤝",
    color: "bg-pink-500",
    hashtags: ["#ServiceProviders", "#Networking", "#Expertise", "#ClientAcquisition", "#Authority"],
    description: "Service provider networking and business development",
    topics: [
      "Client acquisition strategies",
      "Service positioning",
      "Authority building",
      "Networking opportunities",
      "Business development",
    ],
  },
}

export function PersonaGroupNavigation() {
  const { getPersonaFilteredPosts } = useFacebookIntegrationStore()
  const [selectedPersona, setSelectedPersona] = useState<string>("startup-sam")

  const handleHashtagClick = (hashtag: string) => {
    const groupUrl = `https://www.facebook.com/groups/ecommerceoutset/search/?q=${encodeURIComponent(hashtag)}`
    window.open(groupUrl, "_blank")
  }

  const handleViewPersonaDiscussions = (persona: string) => {
    const hashtags = personaGroupContent[persona as keyof typeof personaGroupContent].hashtags
    const searchQuery = hashtags.join(" OR ")
    const groupUrl = `https://www.facebook.com/groups/ecommerceoutset/search/?q=${encodeURIComponent(searchQuery)}`
    window.open(groupUrl, "_blank")
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Persona-Based Group Content</span>
          </CardTitle>
          <CardDescription>Find discussions tailored to your Amazon selling journey stage</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedPersona} onValueChange={setSelectedPersona} className="space-y-4">
            <TabsList className="grid w-full grid-cols-5">
              {Object.entries(personaGroupContent).map(([key, persona]) => (
                <TabsTrigger key={key} value={key} className="text-xs">
                  <span className="mr-1">{persona.icon}</span>
                  <span className="hidden sm:inline">{persona.name.split(" ")[1]}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(personaGroupContent).map(([key, persona]) => (
              <TabsContent key={key} value={key} className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border rounded-lg p-6"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className={`p-3 rounded-full ${persona.color} text-white text-2xl`}>{persona.icon}</div>
                    <div>
                      <h3 className="text-xl font-bold">{persona.name}</h3>
                      <p className="text-gray-600">{persona.description}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center">
                        <Hash className="h-4 w-4 mr-2" />
                        Relevant Hashtags
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {persona.hashtags.map((hashtag) => (
                          <Badge
                            key={hashtag}
                            variant="outline"
                            className="cursor-pointer hover:bg-blue-50"
                            onClick={() => handleHashtagClick(hashtag)}
                          >
                            {hashtag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3 flex items-center">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Popular Topics
                      </h4>
                      <ul className="space-y-2">
                        {persona.topics.map((topic, index) => (
                          <li key={index} className="flex items-center text-sm">
                            <div className="w-1 h-1 bg-blue-500 rounded-full mr-3"></div>
                            {topic}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 flex space-x-3">
                    <Button onClick={() => handleViewPersonaDiscussions(key)} className="flex-1">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View {persona.name} Discussions
                    </Button>
                    <Button variant="outline">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Get Recommendations
                    </Button>
                  </div>
                </motion.div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
