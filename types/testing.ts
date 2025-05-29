export interface PersonaJourney {
  persona: "startup-sam" | "scaling-sarah" | "learning-larry" | "investor-ian" | "provider-priya"
  steps: JourneyStep[]
  completionRate: number
  dropOffPoints: DropOffPoint[]
}

export interface JourneyStep {
  id: string
  name: string
  completed: boolean
  timestamp?: string
  conversionRate: number
  averageTime: number
}

export interface DropOffPoint {
  stepId: string
  dropOffRate: number
  commonReasons: string[]
  optimizationSuggestions: string[]
}

export interface ABTestVariant {
  id: string
  name: string
  type: "headline" | "cta" | "popup" | "pricing" | "layout"
  element: string
  originalValue: string
  testValue: string
  trafficSplit: number
  conversions: number
  visitors: number
  conversionRate: number
  isActive: boolean
  startDate: string
  endDate?: string
}

export interface PerformanceMetrics {
  pageUrl: string
  lcp: number // Largest Contentful Paint
  fid: number // First Input Delay
  cls: number // Cumulative Layout Shift
  ttfb: number // Time to First Byte
  deviceType: "mobile" | "desktop"
  persona?: string
  timestamp: string
}

export interface UserFeedback {
  id: string
  type: "thumbs" | "bug" | "feature" | "satisfaction"
  rating?: number
  message?: string
  pageUrl: string
  persona?: string
  screenshot?: string
  timestamp: string
  status: "new" | "reviewed" | "resolved"
}

export interface AccessibilityAudit {
  pageUrl: string
  score: number
  violations: AccessibilityViolation[]
  timestamp: string
  wcagLevel: "A" | "AA" | "AAA"
}

export interface AccessibilityViolation {
  id: string
  impact: "minor" | "moderate" | "serious" | "critical"
  description: string
  help: string
  helpUrl: string
  nodes: number
}

export interface ErrorReport {
  id: string
  message: string
  stack: string
  url: string
  lineNumber: number
  columnNumber: number
  userAgent: string
  persona?: string
  timestamp: string
  severity: "low" | "medium" | "high" | "critical"
  resolved: boolean
}
