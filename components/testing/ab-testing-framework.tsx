"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useTestingStore } from "@/store/testing-store"

interface ABTestingFrameworkProps {
  children: React.ReactNode
}

// Define active A/B tests
const activeTests = [
  {
    id: "hero_headline_test",
    type: "headline" as const,
    element: '[data-test="hero-headline"]',
    variants: {
      control: "Transform Your Amazon Business with Expert Guidance",
      variant_a: "Scale Your Amazon Empire with Proven Strategies",
      variant_b: "From Amazon Beginner to 7-Figure Success Story",
    },
    trafficSplit: 33,
  },
  {
    id: "cta_button_test",
    type: "cta" as const,
    element: '[data-test="primary-cta"]',
    variants: {
      control: "Get Started Today",
      variant_a: "Start Your Journey",
      variant_b: "Transform Your Business",
    },
    trafficSplit: 33,
  },
  {
    id: "popup_timing_test",
    type: "popup" as const,
    element: '[data-test="exit-intent-popup"]',
    variants: {
      control: "5000", // 5 seconds
      variant_a: "10000", // 10 seconds
      variant_b: "15000", // 15 seconds
    },
    trafficSplit: 33,
  },
]

export function ABTestingFramework({ children }: ABTestingFrameworkProps) {
  const { setABTestVariant, getActiveVariant } = useTestingStore()
  const [testsInitialized, setTestsInitialized] = useState(false)

  useEffect(() => {
    if (testsInitialized) return

    // Initialize A/B tests
    activeTests.forEach((test) => {
      let variant = getActiveVariant(test.id)

      // If no variant assigned, assign one
      if (!variant) {
        // Check localStorage first
        const storedVariant = localStorage.getItem(`ab_test_${test.id}`)
        if (storedVariant) {
          variant = storedVariant
        } else {
          // Assign random variant based on traffic split
          const random = Math.random() * 100
          const variants = Object.keys(test.variants)

          if (random < test.trafficSplit) {
            variant = variants[1] // variant_a
          } else if (random < test.trafficSplit * 2) {
            variant = variants[2] // variant_b
          } else {
            variant = variants[0] // control
          }
        }

        setABTestVariant(test.id, variant)
      }

      // Apply variant to DOM
      applyVariant(test, variant)
    })

    setTestsInitialized(true)
  }, [testsInitialized, setABTestVariant, getActiveVariant])

  const applyVariant = (test: (typeof activeTests)[0], variant: string) => {
    const elements = document.querySelectorAll(test.element)
    const variantValue = test.variants[variant as keyof typeof test.variants]

    elements.forEach((element) => {
      switch (test.type) {
        case "headline":
        case "cta":
          element.textContent = variantValue
          break
        case "popup":
          element.setAttribute("data-delay", variantValue)
          break
      }

      // Add variant class for styling
      element.classList.add(`variant-${variant}`)
      element.setAttribute("data-ab-test", test.id)
      element.setAttribute("data-ab-variant", variant)
    })

    // Track variant assignment
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "ab_test_assigned", {
        test_id: test.id,
        variant: variant,
        test_type: test.type,
      })
    }
  }

  // Track conversions for A/B tests
  useEffect(() => {
    const trackConversion = (event: Event) => {
      const target = event.target as HTMLElement
      const testElement = target.closest("[data-ab-test]")

      if (testElement) {
        const testId = testElement.getAttribute("data-ab-test")
        const variant = testElement.getAttribute("data-ab-variant")

        if (testId && variant && typeof window !== "undefined" && window.gtag) {
          window.gtag("event", "ab_test_conversion", {
            test_id: testId,
            variant: variant,
            conversion_type: "click",
          })
        }
      }
    }

    document.addEventListener("click", trackConversion)
    return () => document.removeEventListener("click", trackConversion)
  }, [])

  return <>{children}</>
}
