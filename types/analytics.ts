// Analytics Types

// Funnel Data Types
export interface FunnelStage {
  name: string
  visitors: number
  conversions: number
}

export interface FunnelData {
  stages: FunnelStage[]
}

// Persona Data Types
export interface PersonaMetrics {
  name: string
  score: number
  engagement: number
  conversion: number
}

export interface PersonaData {
  personas: PersonaMetrics[]
}

// Shadow Funnel Data Types
export interface TouchpointData {
  name: string
  count: number
  impact: "low" | "medium" | "high"
}

export interface ShadowFunnelData {
  touchpoints: TouchpointData[]
}

// Revenue Data Types
export interface RevenueSource {
  name: string
  revenue: number
  percentage: number
}

export interface RevenueData {
  sources: RevenueSource[]
}

// Integration Data Types
export interface IntegrationPlatform {
  name: string
  status: "healthy" | "warning" | "error"
  lastSync: string
}

export interface IntegrationData {
  platforms: IntegrationPlatform[]
}

// Analytics State
export interface AnalyticsState {
  funnelData: FunnelData
  personaData: PersonaData
  shadowFunnelData: ShadowFunnelData
  revenueData: RevenueData
  integrationData: IntegrationData
  isLoading: boolean
  error: string | null
  fetchAnalyticsData: () => Promise<void>
}
