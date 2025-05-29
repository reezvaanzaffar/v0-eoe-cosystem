export interface AutomationPlatform {
  id: string
  name: string
  type: "zapier" | "make" | "native"
  status: "connected" | "disconnected" | "error"
  apiKey?: string
  webhookUrl?: string
  lastSync: string
  taskUsage: {
    current: number
    limit: number
    resetDate: string
  }
}

export interface AutomationWorkflow {
  id: string
  name: string
  platform: string
  persona: string[]
  trigger: AutomationTrigger
  actions: AutomationAction[]
  status: "active" | "paused" | "error" | "draft"
  successRate: number
  lastRun: string
  totalRuns: number
  avgProcessingTime: number
  template?: boolean
}

export interface AutomationTrigger {
  type: "webhook" | "schedule" | "platform_event"
  event: string
  conditions?: Record<string, any>
  webhookUrl?: string
}

export interface AutomationAction {
  id: string
  platform: string
  type: string
  config: Record<string, any>
  order: number
  retryCount: number
  status: "pending" | "success" | "failed" | "skipped"
}

export interface AutomationEvent {
  id: string
  workflowId: string
  timestamp: string
  status: "success" | "failed" | "processing"
  triggerData: Record<string, any>
  processingTime: number
  errorMessage?: string
  retryCount: number
}

export interface AutomationTemplate {
  id: string
  name: string
  description: string
  persona: string
  category: "onboarding" | "nurture" | "service" | "retention"
  platforms: string[]
  estimatedSetupTime: number
  complexity: "simple" | "medium" | "complex"
  workflow: Omit<AutomationWorkflow, "id" | "status" | "successRate" | "lastRun" | "totalRuns">
}

export interface AutomationMetrics {
  totalWorkflows: number
  activeWorkflows: number
  successRate: number
  avgProcessingTime: number
  costSavings: number
  conversionImprovement: number
  errorCount: number
  platformUsage: Record<string, number>
}
