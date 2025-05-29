import { create } from "zustand"
import type {
  AutomationPlatform,
  AutomationWorkflow,
  AutomationEvent,
  AutomationTemplate,
  AutomationMetrics,
} from "@/types/automation"

interface AutomationState {
  platforms: AutomationPlatform[]
  workflows: AutomationWorkflow[]
  events: AutomationEvent[]
  templates: AutomationTemplate[]
  metrics: AutomationMetrics | null
  isLoading: boolean
  selectedWorkflow: AutomationWorkflow | null

  // Actions
  setPlatforms: (platforms: AutomationPlatform[]) => void
  setWorkflows: (workflows: AutomationWorkflow[]) => void
  addEvent: (event: AutomationEvent) => void
  setTemplates: (templates: AutomationTemplate[]) => void
  setMetrics: (metrics: AutomationMetrics) => void
  setSelectedWorkflow: (workflow: AutomationWorkflow | null) => void
  updateWorkflowStatus: (id: string, status: string) => void
  updatePlatformStatus: (id: string, status: string) => void
  deployTemplate: (templateId: string, customizations?: Record<string, any>) => Promise<void>
  triggerWorkflow: (workflowId: string, data?: Record<string, any>) => Promise<void>
  pauseWorkflow: (workflowId: string) => void
  resumeWorkflow: (workflowId: string) => void
  refreshData: () => Promise<void>
}

export const useAutomationStore = create<AutomationState>((set, get) => ({
  platforms: [],
  workflows: [],
  events: [],
  templates: [],
  metrics: null,
  isLoading: false,
  selectedWorkflow: null,

  setPlatforms: (platforms) => set({ platforms }),
  setWorkflows: (workflows) => set({ workflows }),
  addEvent: (event) => set((state) => ({ events: [event, ...state.events.slice(0, 99)] })),
  setTemplates: (templates) => set({ templates }),
  setMetrics: (metrics) => set({ metrics }),
  setSelectedWorkflow: (workflow) => set({ selectedWorkflow: workflow }),

  updateWorkflowStatus: (id, status) =>
    set((state) => ({
      workflows: state.workflows.map((w) => (w.id === id ? { ...w, status } : w)),
    })),

  updatePlatformStatus: (id, status) =>
    set((state) => ({
      platforms: state.platforms.map((p) => (p.id === id ? { ...p, status } : p)),
    })),

  pauseWorkflow: (workflowId) => {
    get().updateWorkflowStatus(workflowId, "paused")
  },

  resumeWorkflow: (workflowId) => {
    get().updateWorkflowStatus(workflowId, "active")
  },

  deployTemplate: async (templateId, customizations = {}) => {
    set({ isLoading: true })
    try {
      // Mock API call to deploy template
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const template = get().templates.find((t) => t.id === templateId)
      if (template) {
        const newWorkflow: AutomationWorkflow = {
          id: Date.now().toString(),
          ...template.workflow,
          status: "active",
          successRate: 0,
          lastRun: new Date().toISOString(),
          totalRuns: 0,
          avgProcessingTime: 0,
        }

        set((state) => ({
          workflows: [...state.workflows, newWorkflow],
        }))
      }
    } finally {
      set({ isLoading: false })
    }
  },

  triggerWorkflow: async (workflowId, data = {}) => {
    const workflow = get().workflows.find((w) => w.id === workflowId)
    if (!workflow) return

    const event: AutomationEvent = {
      id: Date.now().toString(),
      workflowId,
      timestamp: new Date().toISOString(),
      status: "processing",
      triggerData: data,
      processingTime: 0,
      retryCount: 0,
    }

    get().addEvent(event)

    // Simulate processing
    setTimeout(() => {
      const updatedEvent = {
        ...event,
        status: Math.random() > 0.1 ? "success" : ("failed" as const),
        processingTime: Math.floor(Math.random() * 5000 + 1000),
        errorMessage: Math.random() > 0.1 ? undefined : "Mock error for demonstration",
      }

      set((state) => ({
        events: state.events.map((e) => (e.id === event.id ? updatedEvent : e)),
      }))
    }, 2000)
  },

  refreshData: async () => {
    set({ isLoading: true })
    try {
      // Mock data refresh
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockMetrics: AutomationMetrics = {
        totalWorkflows: 24,
        activeWorkflows: 18,
        successRate: 94.5,
        avgProcessingTime: 2340,
        costSavings: 15600,
        conversionImprovement: 23.8,
        errorCount: 3,
        platformUsage: {
          zapier: 12,
          make: 8,
          native: 4,
        },
      }

      set({ metrics: mockMetrics })
    } finally {
      set({ isLoading: false })
    }
  },
}))
