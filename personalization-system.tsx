"use client"

import { PersonalizationRuleEngine } from "./components/personalization/rule-engine"
import { BehavioralTracker } from "./components/personalization/behavioral-tracker"
import { AIContentOptimizer } from "./components/personalization/ai-content-optimizer"
import { PersonalizationDashboard } from "./components/personalization/personalization-dashboard"

export default function SmartPersonalizationSystem() {
  return (
    <PersonalizationRuleEngine>
      <BehavioralTracker>
        <AIContentOptimizer>
          <PersonalizationDashboard />
        </AIContentOptimizer>
      </BehavioralTracker>
    </PersonalizationRuleEngine>
  )
}
