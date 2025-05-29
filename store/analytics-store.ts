import { create } from "zustand"
import type {
  FunnelMetrics,
  PersonaMetrics,
  ShadowFunnelMetrics,
  IntegrationStatus,
  Alert,
  RevenueAttribution,
} from "@/types/analytics"

interface AnalyticsState {
  funnelMetrics: FunnelMetrics | null
  personaMetrics: PersonaMetrics[]
  shadowFunnelMetrics: ShadowFunnelMetrics | null
  integrationStatuses: IntegrationStatus[]
  alerts: Alert[]
  revenueAttribution: RevenueAttribution[]
  isLoading: boolean
  selectedTimeframe: "24h" | "7d" | "30d" | "90d"
  selectedPersona: string | "all"

  // Actions
  setFunnelMetrics: (metrics: FunnelMetrics) => void
  setPersonaMetrics: (metrics: PersonaMetrics[]) => void
  setShadowFunnelMetrics: (metrics: ShadowFunnelMetrics) => void
  updateIntegrationStatus: (status: IntegrationStatus) => void
  addAlert: (alert: Alert) => void
  acknowledgeAlert: (id: string) => void
  setTimeframe: (timeframe: "24h" | "7d" | "30d" | "90d") => void
  setSelectedPersona: (persona: string) => void
  refreshData: () => Promise<void>
}

export const useAnalyticsStore = create<AnalyticsState>((set, get) => ({
  funnelMetrics: null,
  personaMetrics: [],
  shadowFunnelMetrics: null,
  integrationStatuses: [],
  alerts: [],
  revenueAttribution: [],
  isLoading: false,
  selectedTimeframe: "7d",
  selectedPersona: "all",

  setFunnelMetrics: (metrics) => set({ funnelMetrics: metrics }),
  setPersonaMetrics: (metrics) => set({ personaMetrics: metrics }),
  setShadowFunnelMetrics: (metrics) => set({ shadowFunnelMetrics: metrics }),

  updateIntegrationStatus: (status) =>
    set((state) => ({
      integrationStatuses: state.integrationStatuses.map((s) => (s.platform === status.platform ? status : s)),
    })),

  addAlert: (alert) =>
    set((state) => ({
      alerts: [alert, ...state.alerts],
    })),

  acknowledgeAlert: (id) =>
    set((state) => ({
      alerts: state.alerts.map((alert) => (alert.id === id ? { ...alert, acknowledged: true } : alert)),
    })),

  setTimeframe: (timeframe) => set({ selectedTimeframe: timeframe }),
  setSelectedPersona: (persona) => set({ selectedPersona: persona }),

  refreshData: async () => {
    set({ isLoading: true })
    try {
      // Simulate API calls to refresh data
      await new Promise((resolve) => setTimeout(resolve, 2000))
      // In real implementation, this would call your API endpoints
    } finally {
      set({ isLoading: false })
    }
  },
}))
