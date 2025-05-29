"use client"

import type React from "react"

import { useEffect } from "react"
import { usePersonalizationStore } from "@/store/personalization-store"
import type { PersonalizationRule, PersonalizationCondition } from "@/types/personalization"

// Predefined personalization rules
const personalizationRules: PersonalizationRule[] = [
  {
    id: "startup-sam-high-engagement",
    name: "Startup Sam High Engagement → Launch Program Focus",
    conditions: [
      { type: "persona", operator: "equals", value: "startup-sam", weight: 1 },
      { type: "engagement", operator: "greater_than", value: 70, weight: 0.8 },
    ],
    actions: [
      { type: "content", target: "hero-section", value: "launch-program-focused" },
      { type: "cta", target: "primary-cta", value: "Start Your Launch Journey" },
      { type: "recommendation", target: "sidebar", value: "launch-program-preview" },
    ],
    priority: 10,
    active: true,
  },
  {
    id: "scaling-sarah-pricing-visits",
    name: "Scaling Sarah + Pricing Visits → Scale Consultation",
    conditions: [
      { type: "persona", operator: "equals", value: "scaling-sarah", weight: 1 },
      { type: "behavior", operator: "contains", value: "pricing-page-visit", weight: 0.9 },
    ],
    actions: [
      { type: "cta", target: "pricing-cta", value: "Book Scale Strategy Call" },
      { type: "content", target: "testimonials", value: "scaling-success-stories" },
    ],
    priority: 9,
    active: true,
  },
  {
    id: "learning-larry-video-completion",
    name: "Learning Larry + Video Completion → Master Program",
    conditions: [
      { type: "persona", operator: "equals", value: "learning-larry", weight: 1 },
      { type: "behavior", operator: "contains", value: "video-completion", weight: 0.8 },
    ],
    actions: [
      { type: "recommendation", target: "next-content", value: "master-program-preview" },
      { type: "content", target: "sidebar", value: "advanced-learning-path" },
    ],
    priority: 8,
    active: true,
  },
  {
    id: "mobile-users-simplified",
    name: "Mobile Users → Simplified Interface",
    conditions: [{ type: "device", operator: "equals", value: "mobile", weight: 1 }],
    actions: [
      { type: "navigation", target: "main-nav", value: "simplified" },
      { type: "content", target: "hero", value: "mobile-optimized" },
    ],
    priority: 5,
    active: true,
  },
  {
    id: "return-visitor-advanced",
    name: "Return Visitors → Advanced Content Priority",
    conditions: [{ type: "behavior", operator: "greater_than", value: 1, weight: 1 }],
    actions: [
      { type: "content", target: "content-priority", value: "advanced-first" },
      { type: "navigation", target: "quick-access", value: "show-advanced" },
    ],
    priority: 6,
    active: true,
  },
]

interface RuleEngineProps {
  children: React.ReactNode
}

export function PersonalizationRuleEngine({ children }: RuleEngineProps) {
  const {
    currentPersona,
    behaviorScore,
    engagementLevel,
    consentGiven,
    isPersonalizationEnabled,
    applyRule,
    trackBehavior,
  } = usePersonalizationStore()

  useEffect(() => {
    if (!consentGiven || !isPersonalizationEnabled) return

    // Apply personalization rules based on current state
    const applicableRules = personalizationRules.filter((rule) => {
      if (!rule.active) return false

      return rule.conditions.every((condition) => evaluateCondition(condition))
    })

    // Sort by priority and apply rules
    applicableRules
      .sort((a, b) => b.priority - a.priority)
      .forEach((rule) => {
        applyRule(rule)
        executeRuleActions(rule)
      })
  }, [currentPersona, behaviorScore, engagementLevel, consentGiven, isPersonalizationEnabled])

  const evaluateCondition = (condition: PersonalizationCondition): boolean => {
    switch (condition.type) {
      case "persona":
        return currentPersona?.persona === condition.value
      case "engagement":
        return compareValues(behaviorScore, condition.operator, condition.value)
      case "behavior":
        // This would check behavior history - simplified for demo
        return true
      case "device":
        return checkDeviceType() === condition.value
      default:
        return false
    }
  }

  const compareValues = (actual: number, operator: string, expected: number): boolean => {
    switch (operator) {
      case "equals":
        return actual === expected
      case "greater_than":
        return actual > expected
      case "less_than":
        return actual < expected
      default:
        return false
    }
  }

  const checkDeviceType = (): string => {
    if (typeof window === "undefined") return "desktop"
    return window.innerWidth < 768 ? "mobile" : "desktop"
  }

  const executeRuleActions = (rule: PersonalizationRule) => {
    rule.actions.forEach((action) => {
      switch (action.type) {
        case "content":
          updateContentVariant(action.target, action.value)
          break
        case "cta":
          updateCTAText(action.target, action.value)
          break
        case "recommendation":
          addContentRecommendation(action.value)
          break
        case "navigation":
          updateNavigation(action.target, action.value)
          break
      }
    })

    // Track rule application
    trackBehavior("rule_applied", { ruleId: rule.id })
  }

  const updateContentVariant = (target: string, variant: string) => {
    const elements = document.querySelectorAll(`[data-personalization-target="${target}"]`)
    elements.forEach((element) => {
      element.setAttribute("data-variant", variant)
      element.classList.add(`variant-${variant}`)
    })
  }

  const updateCTAText = (target: string, text: string) => {
    const elements = document.querySelectorAll(`[data-cta-target="${target}"]`)
    elements.forEach((element) => {
      if (element.textContent) {
        element.textContent = text
      }
    })
  }

  const addContentRecommendation = (recommendationType: string) => {
    // This would add recommendations to the store
    // Implementation would fetch appropriate content
  }

  const updateNavigation = (target: string, variant: string) => {
    const elements = document.querySelectorAll(`[data-nav-target="${target}"]`)
    elements.forEach((element) => {
      element.setAttribute("data-nav-variant", variant)
    })
  }

  return <>{children}</>
}
