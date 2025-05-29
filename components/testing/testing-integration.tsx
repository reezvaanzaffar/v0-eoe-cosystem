"use client"

import type React from "react"

import { PersonaJourneyTracker } from "./persona-journey-tracker"
import { ABTestingFramework } from "./ab-testing-framework"
import { PerformanceMonitor } from "./performance-monitor"
import { UserFeedbackWidget } from "./user-feedback-widget"
import { ErrorTracker } from "./error-tracker"

interface TestingIntegrationProps {
  children: React.ReactNode
}

export function TestingIntegration({ children }: TestingIntegrationProps) {
  return (
    <ErrorTracker>
      <PerformanceMonitor>
        <PersonaJourneyTracker>
          <ABTestingFramework>
            {children}
            <UserFeedbackWidget />
          </ABTestingFramework>
        </PersonaJourneyTracker>
      </PerformanceMonitor>
    </ErrorTracker>
  )
}
