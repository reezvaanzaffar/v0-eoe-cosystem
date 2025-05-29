"use client"

import type React from "react"

import { useEffect } from "react"
import { useTestingStore } from "@/store/testing-store"
import { usePersonalizationStore } from "@/store/personalization-store"

interface PerformanceMonitorProps {
  children: React.ReactNode
}

export function PerformanceMonitor({ children }: PerformanceMonitorProps) {
  const { recordPerformanceMetric } = useTestingStore()
  const { currentPersona } = usePersonalizationStore()

  useEffect(() => {
    // Core Web Vitals measurement
    const measureCoreWebVitals = () => {
      // Largest Contentful Paint (LCP)
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries()
        const lastEntry = entries[entries.length - 1]

        recordPerformanceMetric({
          pageUrl: window.location.pathname,
          lcp: lastEntry.startTime,
          fid: 0,
          cls: 0,
          ttfb: 0,
          deviceType: window.innerWidth < 768 ? "mobile" : "desktop",
          persona: currentPersona?.persona,
          timestamp: new Date().toISOString(),
        })
      }).observe({ entryTypes: ["largest-contentful-paint"] })

      // First Input Delay (FID)
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries()
        entries.forEach((entry: any) => {
          recordPerformanceMetric({
            pageUrl: window.location.pathname,
            lcp: 0,
            fid: entry.processingStart - entry.startTime,
            cls: 0,
            ttfb: 0,
            deviceType: window.innerWidth < 768 ? "mobile" : "desktop",
            persona: currentPersona?.persona,
            timestamp: new Date().toISOString(),
          })
        })
      }).observe({ entryTypes: ["first-input"] })

      // Cumulative Layout Shift (CLS)
      let clsValue = 0
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value
          }
        }

        recordPerformanceMetric({
          pageUrl: window.location.pathname,
          lcp: 0,
          fid: 0,
          cls: clsValue,
          ttfb: 0,
          deviceType: window.innerWidth < 768 ? "mobile" : "desktop",
          persona: currentPersona?.persona,
          timestamp: new Date().toISOString(),
        })
      }).observe({ entryTypes: ["layout-shift"] })

      // Time to First Byte (TTFB)
      const navigationEntry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming
      if (navigationEntry) {
        const ttfb = navigationEntry.responseStart - navigationEntry.requestStart

        recordPerformanceMetric({
          pageUrl: window.location.pathname,
          lcp: 0,
          fid: 0,
          cls: 0,
          ttfb: ttfb,
          deviceType: window.innerWidth < 768 ? "mobile" : "desktop",
          persona: currentPersona?.persona,
          timestamp: new Date().toISOString(),
        })
      }
    }

    // Measure on page load
    if (document.readyState === "complete") {
      measureCoreWebVitals()
    } else {
      window.addEventListener("load", measureCoreWebVitals)
    }

    // Send performance data to Google Analytics
    const sendToGA = () => {
      if (typeof window !== "undefined" && window.gtag) {
        const navigationEntry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming

        window.gtag("event", "page_performance", {
          page_load_time: navigationEntry.loadEventEnd - navigationEntry.loadEventStart,
          dom_content_loaded: navigationEntry.domContentLoadedEventEnd - navigationEntry.domContentLoadedEventStart,
          page_url: window.location.pathname,
          device_type: window.innerWidth < 768 ? "mobile" : "desktop",
          persona: currentPersona?.persona,
        })
      }
    }

    window.addEventListener("load", sendToGA)

    return () => {
      window.removeEventListener("load", measureCoreWebVitals)
      window.removeEventListener("load", sendToGA)
    }
  }, [recordPerformanceMetric, currentPersona])

  return <>{children}</>
}
