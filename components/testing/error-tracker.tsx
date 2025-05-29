"use client"

import type React from "react"

import { useEffect } from "react"
import { useTestingStore } from "@/store/testing-store"
import { usePersonalizationStore } from "@/store/personalization-store"

interface ErrorTrackerProps {
  children: React.ReactNode
}

export function ErrorTracker({ children }: ErrorTrackerProps) {
  const { reportError } = useTestingStore()
  const { currentPersona } = usePersonalizationStore()

  useEffect(() => {
    // Global error handler for JavaScript errors
    const handleError = (event: ErrorEvent) => {
      reportError({
        message: event.message,
        stack: event.error?.stack || "",
        url: event.filename || window.location.href,
        lineNumber: event.lineno || 0,
        columnNumber: event.colno || 0,
        userAgent: navigator.userAgent,
        persona: currentPersona?.persona,
        severity: determineSeverity(event.message),
        resolved: false,
      })
    }

    // Unhandled promise rejection handler
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      reportError({
        message: `Unhandled Promise Rejection: ${event.reason}`,
        stack: event.reason?.stack || "",
        url: window.location.href,
        lineNumber: 0,
        columnNumber: 0,
        userAgent: navigator.userAgent,
        persona: currentPersona?.persona,
        severity: "medium",
        resolved: false,
      })
    }

    // React error boundary fallback
    const handleReactError = (error: Error, errorInfo: any) => {
      reportError({
        message: error.message,
        stack: error.stack || "",
        url: window.location.href,
        lineNumber: 0,
        columnNumber: 0,
        userAgent: navigator.userAgent,
        persona: currentPersona?.persona,
        severity: "high",
        resolved: false,
      })
    }

    // Add event listeners
    window.addEventListener("error", handleError)
    window.addEventListener("unhandledrejection", handleUnhandledRejection)

    // Cleanup
    return () => {
      window.removeEventListener("error", handleError)
      window.removeEventListener("unhandledrejection", handleUnhandledRejection)
    }
  }, [reportError, currentPersona])

  const determineSeverity = (message: string): "low" | "medium" | "high" | "critical" => {
    const lowerMessage = message.toLowerCase()

    if (lowerMessage.includes("network") || lowerMessage.includes("fetch")) {
      return "medium"
    }
    if (lowerMessage.includes("payment") || lowerMessage.includes("checkout")) {
      return "critical"
    }
    if (lowerMessage.includes("cannot read") || lowerMessage.includes("undefined")) {
      return "high"
    }

    return "low"
  }

  return <>{children}</>
}
