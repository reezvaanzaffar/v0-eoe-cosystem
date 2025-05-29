import { create } from "zustand"
import type {
  AnalyticsState,
  FunnelData,
  PersonaData,
  ShadowFunnelData,
  RevenueData,
  IntegrationData,
} from "../types/analytics"

// Mock data for initial state
const initialFunnelData: FunnelData = {
  stages: [
    { name: "Awareness", visitors: 5000, conversions: 1500 },
    { name: "Consideration", visitors: 1500, conversions: 600 },
    { name: "Decision", visitors: 600, conversions: 200 },
    { name: "Action", visitors: 200, conversions: 50 },
  ],
}

const initialPersonaData: PersonaData = {
  personas: [
    { name: "Startup Sam", score: 85, engagement: 72, conversion: 4.2 },
    { name: "Scaling Sarah", score: 92, engagement: 86, conversion: 6.8 },
    { name: "Learning Larry", score: 78, engagement: 65, conversion: 3.5 },
    { name: "Investor Ian", score: 88, engagement: 74, conversion: 5.1 },
    { name: "Provider Priya", score: 82, engagement: 70, conversion: 4.7 },
  ],
}

const initialShadowFunnelData: ShadowFunnelData = {
  touchpoints: [
    { name: "Facebook Group", count: 1250, impact: "high" },
    { name: "Podcast Mentions", count: 850, impact: "medium" },
    { name: "Word of Mouth", count: 620, impact: "high" },
    { name: "Partner Referrals", count: 480, impact: "medium" },
    { name: "Industry Events", count: 320, impact: "low" },
  ],
}

const initialRevenueData: RevenueData = {
  sources: [
    { name: "Direct Sales", revenue: 125000, percentage: 45 },
    { name: "Website", revenue: 85000, percentage: 30 },
    { name: "Partner Referrals", revenue: 42000, percentage: 15 },
    { name: "Email Campaigns", revenue: 28000, percentage: 10 },
  ],
}

const initialIntegrationData: IntegrationData = {
  platforms: [
    { name: "Google Analytics", status: "healthy", lastSync: "2 minutes ago" },
    { name: "Facebook Pixel", status: "healthy", lastSync: "5 minutes ago" },
    { name: "HubSpot", status: "warning", lastSync: "1 hour ago" },
    { name: "Mailchimp", status: "healthy", lastSync: "15 minutes ago" },
    { name: "Stripe", status: "healthy", lastSync: "10 minutes ago" },
  ],
}

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
  funnelData: initialFunnelData,
  personaData: initialPersonaData,
  shadowFunnelData: initialShadowFunnelData,
  revenueData: initialRevenueData,
  integrationData: initialIntegrationData,
  isLoading: false,
  error: null,

  fetchAnalyticsData: async () => {
    set({ isLoading: true })
    try {
      // In a real app, this would be an API call
      // For now, we'll just simulate a delay and return mock data
      await new Promise((resolve) => setTimeout(resolve, 500))

      set({
        funnelData: initialFunnelData,
        personaData: initialPersonaData,
        shadowFunnelData: initialShadowFunnelData,
        revenueData: initialRevenueData,
        integrationData: initialIntegrationData,
        isLoading: false,
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "An unknown error occurred",
        isLoading: false,
      })
    }
  },
}))
