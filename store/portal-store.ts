import { create } from "zustand"
import type { Client, Integration, ProgressMetrics, Notification } from "@/types/portal"

interface PortalState {
  currentClient: Client | null
  integrations: Integration[]
  progressMetrics: ProgressMetrics | null
  notifications: Notification[]
  isLoading: boolean

  // Actions
  setCurrentClient: (client: Client) => void
  updateProgressMetrics: (metrics: ProgressMetrics) => void
  addNotification: (notification: Notification) => void
  markNotificationRead: (id: string) => void
  updateIntegrationStatus: (platform: string, status: string) => void
}

export const usePortalStore = create<PortalState>((set, get) => ({
  currentClient: null,
  integrations: [],
  progressMetrics: null,
  notifications: [],
  isLoading: false,

  setCurrentClient: (client) => set({ currentClient: client }),

  updateProgressMetrics: (metrics) => set({ progressMetrics: metrics }),

  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
    })),

  markNotificationRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    })),

  updateIntegrationStatus: (platform, status) =>
    set((state) => ({
      integrations: state.integrations.map((i) => (i.platform === platform ? { ...i, status } : i)),
    })),
}))
