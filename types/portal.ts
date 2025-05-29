export interface ServiceProgram {
  id: string
  name: string
  persona: "startup-sam" | "scaling-sarah" | "learning-larry" | "investor-ian" | "provider-priya"
  description: string
  color: string
  icon: string
  features: string[]
}

export interface Client {
  id: string
  name: string
  email: string
  program: ServiceProgram
  enrollmentDate: string
  status: "active" | "at-risk" | "completed" | "paused"
  progressScore: number
  lastActivity: string
}

export interface Integration {
  platform: "clickup" | "teachable" | "calendly" | "slack" | "analytics"
  status: "connected" | "disconnected" | "error"
  lastSync: string
  data?: any
}

export interface ProgressMetrics {
  clickupCompletion: number
  courseProgress: number
  sessionAttendance: number
  communityEngagement: number
  resourceUsage: number
  overallScore: number
}

export interface Notification {
  id: string
  type: "task" | "course" | "session" | "community" | "achievement"
  title: string
  message: string
  timestamp: string
  read: boolean
  actionUrl?: string
}
