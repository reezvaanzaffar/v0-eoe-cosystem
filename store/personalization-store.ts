import { create } from "zustand"
import { persist } from "zustand/middleware"
import type {
  PersonaProfile,
  PersonalizationRule,
  ContentRecommendation,
  PersonalizationSession,
} from "@/types/personalization"

interface PersonalizationState {
  currentPersona: PersonaProfile | null
  session: PersonalizationSession | null
  recommendations: ContentRecommendation[]
  appliedRules: PersonalizationRule[]
  behaviorScore: number
  engagementLevel: "low" | "medium" | "high"
  isPersonalizationEnabled: boolean
  consentGiven: boolean

  // Actions
  setPersona: (persona: PersonaProfile) => void
  updateEngagementScore: (score: number) => void
  addRecommendation: (recommendation: ContentRecommendation) => void
  applyRule: (rule: PersonalizationRule) => void
  trackBehavior: (event: string, data?: any) => void
  setConsentGiven: (consent: boolean) => void
  resetPersonalization: () => void
  getPersonalizedContent: (contentType: string) => ContentRecommendation[]
}

export const usePersonalizationStore = create<PersonalizationState>()(
  persist(
    (set, get) => ({
      currentPersona: null,
      session: null,
      recommendations: [],
      appliedRules: [],
      behaviorScore: 0,
      engagementLevel: "low",
      isPersonalizationEnabled: true,
      consentGiven: false,

      setPersona: (persona) => {
        set({ currentPersona: persona })
        // Trigger personalization rules based on new persona
        get().applyPersonalizationRules()
      },

      updateEngagementScore: (score) => {
        const newScore = Math.max(0, Math.min(100, score))
        const level = newScore < 30 ? "low" : newScore < 70 ? "medium" : "high"
        set({ behaviorScore: newScore, engagementLevel: level })
      },

      addRecommendation: (recommendation) =>
        set((state) => ({
          recommendations: [recommendation, ...state.recommendations.slice(0, 9)], // Keep top 10
        })),

      applyRule: (rule) =>
        set((state) => ({
          appliedRules: [...state.appliedRules.filter((r) => r.id !== rule.id), rule],
        })),

      trackBehavior: (event, data = {}) => {
        const state = get()
        if (!state.consentGiven || !state.isPersonalizationEnabled) return

        // Simple behavior scoring
        const scoreIncrements: Record<string, number> = {
          page_view: 1,
          content_engagement: 3,
          video_watch: 5,
          download: 7,
          form_submit: 10,
          service_inquiry: 15,
        }

        const increment = scoreIncrements[event] || 1
        state.updateEngagementScore(state.behaviorScore + increment)

        // Update session activity
        if (state.session) {
          set({
            session: {
              ...state.session,
              lastActivity: new Date().toISOString(),
            },
          })
        }
      },

      setConsentGiven: (consent) => set({ consentGiven: consent }),

      resetPersonalization: () =>
        set({
          currentPersona: null,
          session: null,
          recommendations: [],
          appliedRules: [],
          behaviorScore: 0,
          engagementLevel: "low",
        }),

      getPersonalizedContent: (contentType) => {
        const state = get()
        if (!state.currentPersona) return []

        return state.recommendations.filter(
          (rec) =>
            rec.type === contentType &&
            rec.persona.includes(state.currentPersona!.persona) &&
            rec.engagementLevel === state.engagementLevel,
        )
      },

      applyPersonalizationRules: () => {
        // This would contain the logic to apply personalization rules
        // Implementation would go here
      },
    }),
    {
      name: "personalization-storage",
      partialize: (state) => ({
        currentPersona: state.currentPersona,
        behaviorScore: state.behaviorScore,
        engagementLevel: state.engagementLevel,
        consentGiven: state.consentGiven,
      }),
    },
  ),
)
