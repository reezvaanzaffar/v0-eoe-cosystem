"use client"

import type React from "react"

import { useEffect } from "react"
import { useTestingStore } from "@/store/testing-store"
import { usePersonalizationStore } from "@/store/personalization-store"

interface PersonaJourneyTrackerProps {
  children: React.ReactNode
}

export function PersonaJourneyTracker({ children }: PersonaJourneyTrackerProps) {
  const { trackJourneyStep } = useTestingStore()
  const { currentPersona } = usePersonalizationStore()

  useEffect(() => {
    if (!currentPersona) return

    // Track page views as journey steps
    const trackPageView = () => {
      const path = window.location.pathname
      let stepId = "unknown"

      // Map URLs to journey steps
      if (path === "/") stepId = "homepage_visit"
      else if (path.includes("/quiz")) stepId = "quiz_started"
      else if (path.includes("/email-capture")) stepId = "email_capture"
      else if (path.includes("/services")) stepId = "services_viewed"
      else if (path.includes("/pricing")) stepId = "pricing_viewed"
      else if (path.includes("/contact")) stepId = "contact_initiated"

      trackJourneyStep(currentPersona.persona, stepId)
    }

    // Track form submissions
    const trackFormSubmission = (event: Event) => {
      const form = event.target as HTMLFormElement
      const formType = form.getAttribute("data-form-type")

      if (formType) {
        trackJourneyStep(currentPersona.persona, `${formType}_submitted`)
      }
    }

    // Track button clicks
    const trackButtonClick = (event: Event) => {
      const button = event.target as HTMLElement
      const buttonType = button.getAttribute("data-track-button")

      if (buttonType) {
        trackJourneyStep(currentPersona.persona, `${buttonType}_clicked`)
      }
    }

    // Track quiz completion
    const trackQuizCompletion = () => {
      trackJourneyStep(currentPersona.persona, "quiz_completed")
    }

    // Track email capture
    const trackEmailCapture = () => {
      trackJourneyStep(currentPersona.persona, "email_captured")
    }

    // Track service inquiry
    const trackServiceInquiry = () => {
      trackJourneyStep(currentPersona.persona, "service_inquiry_submitted")
    }

    // Initial page view tracking
    trackPageView()

    // Add event listeners
    document.addEventListener("submit", trackFormSubmission)
    document.addEventListener("click", trackButtonClick)
    window.addEventListener("quiz_completed", trackQuizCompletion)
    window.addEventListener("email_captured", trackEmailCapture)
    window.addEventListener("service_inquiry", trackServiceInquiry)

    // Cleanup
    return () => {
      document.removeEventListener("submit", trackFormSubmission)
      document.removeEventListener("click", trackButtonClick)
      window.removeEventListener("quiz_completed", trackQuizCompletion)
      window.removeEventListener("email_captured", trackEmailCapture)
      window.removeEventListener("service_inquiry", trackServiceInquiry)
    }
  }, [currentPersona, trackJourneyStep])

  return <>{children}</>
}
