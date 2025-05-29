export interface AnalyticsData {
  id: string
  source: string
  timestamp: string
  metrics: Record<string, number>
  dimensions: Record<string, string>
}

export interface FunnelMetrics {
  visitorToQuiz: number
  quizToEmail: number
  emailToInquiry: number
  inquiryToEnrollment: number
  overallConversion: number
}

export interface PersonaMetrics {
  persona: "startup-sam" | "scaling-sarah" | "learning-larry" | "investor-ian" | "provider-priya"
  visitors: number
  quizCompletions: number
  emailCaptures: number
  serviceInquiries: number
  enrollments: number
  revenue: number
  conversionRate: number
}

export interface ShadowFunnelMetrics {
  exitIntentTriggers: number
  exitIntentConversions: number
  emailRecoveryOpens: number
  emailRecoveryClicks: number
  retargetingImpressions: number
  retargetingClicks: number
  recoveryConversions: number
  recoveryRevenue: number
}

export interface IntegrationStatus {
  platform: string
  status: "connected" | "error" | "syncing"
  lastSync: string
  errorMessage?: string
  dataPoints: number
}

export interface Alert {
  id: string
  type: "warning" | "critical" | "info"
  title: string
  message: string
  timestamp: string
  acknowledged: boolean
  threshold: number
  currentValue: number
}

export interface RevenueAttribution {
  channel: string
  firstTouch: number
  lastTouch: number
  linear: number
  timeDecay: number
  position: number
}
