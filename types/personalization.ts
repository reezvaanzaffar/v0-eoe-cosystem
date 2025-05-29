export interface PersonaProfile {
  id: string
  persona: "startup-sam" | "scaling-sarah" | "learning-larry" | "investor-ian" | "provider-priya"
  confidence: number
  lastUpdated: string
  engagementScore: number
  serviceReadiness: number
  preferredContent: string[]
  completedActions: string[]
}

export interface PersonalizationRule {
  id: string
  name: string
  conditions: PersonalizationCondition[]
  actions: PersonalizationAction[]
  priority: number
  active: boolean
  testGroup?: string
}

export interface PersonalizationCondition {
  type: "persona" | "engagement" | "behavior" | "device" | "time" | "page"
  operator: "equals" | "greater_than" | "less_than" | "contains" | "in"
  value: any
  weight: number
}

export interface PersonalizationAction {
  type: "content" | "cta" | "navigation" | "recommendation" | "redirect"
  target: string
  value: any
  variant?: string
}

export interface ContentRecommendation {
  id: string
  title: string
  description: string
  url: string
  type: "article" | "video" | "tool" | "service" | "course"
  persona: string[]
  priority: number
  engagementLevel: "beginner" | "intermediate" | "advanced"
}

export interface BehavioralTrigger {
  id: string
  event: string
  conditions: Record<string, any>
  action: PersonalizationAction
  cooldown: number
  lastTriggered?: string
}

export interface PersonalizationSession {
  sessionId: string
  persona: PersonaProfile | null
  appliedRules: string[]
  recommendations: ContentRecommendation[]
  behaviorScore: number
  startTime: string
  lastActivity: string
}
