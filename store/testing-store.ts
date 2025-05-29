import { create } from "zustand"
import type {
  PersonaJourney,
  ABTestVariant,
  PerformanceMetrics,
  UserFeedback,
  AccessibilityAudit,
  ErrorReport,
} from "@/types/testing"

interface TestingState {
  // Persona Journey Tracking
  personaJourneys: PersonaJourney[]
  currentJourneyStep: string | null

  // A/B Testing
  activeTests: ABTestVariant[]
  userVariants: Record<string, string>

  // Performance Monitoring
  performanceMetrics: PerformanceMetrics[]
  coreWebVitals: {
    lcp: number
    fid: number
    cls: number
    score: number
  }

  // User Feedback
  feedbackItems: UserFeedback[]
  feedbackWidgetVisible: boolean

  // Accessibility
  accessibilityAudits: AccessibilityAudit[]
  accessibilityScore: number

  // Error Tracking
  errorReports: ErrorReport[]

  // Actions
  trackJourneyStep: (persona: string, stepId: string) => void
  setABTestVariant: (testId: string, variant: string) => void
  recordPerformanceMetric: (metric: PerformanceMetrics) => void
  submitFeedback: (feedback: Omit<UserFeedback, "id" | "timestamp">) => void
  toggleFeedbackWidget: () => void
  recordAccessibilityAudit: (audit: AccessibilityAudit) => void
  reportError: (error: Omit<ErrorReport, "id" | "timestamp">) => void
  getActiveVariant: (testId: string) => string | null
}

export const useTestingStore = create<TestingState>((set, get) => ({
  personaJourneys: [],
  currentJourneyStep: null,
  activeTests: [],
  userVariants: {},
  performanceMetrics: [],
  coreWebVitals: { lcp: 0, fid: 0, cls: 0, score: 0 },
  feedbackItems: [],
  feedbackWidgetVisible: false,
  accessibilityAudits: [],
  accessibilityScore: 0,
  errorReports: [],

  trackJourneyStep: (persona, stepId) => {
    const timestamp = new Date().toISOString()

    // Track in analytics
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "journey_step_completed", {
        persona,
        step_id: stepId,
        timestamp,
      })
    }

    set({ currentJourneyStep: stepId })
  },

  setABTestVariant: (testId, variant) => {
    set((state) => ({
      userVariants: {
        ...state.userVariants,
        [testId]: variant,
      },
    }))

    // Store in localStorage for persistence
    if (typeof window !== "undefined") {
      localStorage.setItem(`ab_test_${testId}`, variant)
    }
  },

  recordPerformanceMetric: (metric) => {
    set((state) => ({
      performanceMetrics: [...state.performanceMetrics, metric],
    }))

    // Send to analytics
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "performance_metric", {
        page_url: metric.pageUrl,
        lcp: metric.lcp,
        fid: metric.fid,
        cls: metric.cls,
        device_type: metric.deviceType,
      })
    }
  },

  submitFeedback: (feedback) => {
    const newFeedback: UserFeedback = {
      ...feedback,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      status: "new",
    }

    set((state) => ({
      feedbackItems: [...state.feedbackItems, newFeedback],
    }))

    // Send to external feedback system (e.g., Intercom)
    if (typeof window !== "undefined" && window.Intercom) {
      window.Intercom("trackEvent", "feedback_submitted", {
        type: feedback.type,
        rating: feedback.rating,
        page_url: feedback.pageUrl,
      })
    }
  },

  toggleFeedbackWidget: () => {
    set((state) => ({
      feedbackWidgetVisible: !state.feedbackWidgetVisible,
    }))
  },

  recordAccessibilityAudit: (audit) => {
    set((state) => ({
      accessibilityAudits: [...state.accessibilityAudits, audit],
      accessibilityScore: audit.score,
    }))
  },

  reportError: (error) => {
    const newError: ErrorReport = {
      ...error,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      resolved: false,
    }

    set((state) => ({
      errorReports: [...state.errorReports, newError],
    }))

    // Send to error tracking service (e.g., Sentry)
    if (typeof window !== "undefined" && window.Sentry) {
      window.Sentry.captureException(new Error(error.message), {
        extra: {
          persona: error.persona,
          url: error.url,
          severity: error.severity,
        },
      })
    }
  },

  getActiveVariant: (testId) => {
    const state = get()
    return state.userVariants[testId] || null
  },
}))
