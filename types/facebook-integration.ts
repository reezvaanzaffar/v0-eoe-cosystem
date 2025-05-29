export interface FacebookGroupPost {
  id: string
  message: string
  author: {
    name: string
    profilePicture: string
    id: string
  }
  createdTime: string
  likes: number
  comments: number
  shares: number
  hashtags: string[]
  persona?: string[]
  engagement: number
  type: "text" | "image" | "video" | "link"
  attachments?: FacebookAttachment[]
}

export interface FacebookAttachment {
  type: "image" | "video" | "link"
  url: string
  title?: string
  description?: string
}

export interface GroupMember {
  id: string
  name: string
  profilePicture: string
  joinDate: string
  engagementScore: number
  persona?: string
  isWebsiteMember: boolean
  lastActivity: string
  contributionLevel: "lurker" | "participant" | "contributor" | "expert"
}

export interface GroupStats {
  totalMembers: number
  activeMembers: number
  postsToday: number
  engagementRate: number
  growthRate: number
  topHashtags: string[]
}

export interface ContentSyndication {
  id: string
  title: string
  content: string
  targetPersonas: string[]
  hashtags: string[]
  scheduledTime?: string
  status: "draft" | "scheduled" | "posted" | "failed"
  performance?: {
    reach: number
    engagement: number
    clicks: number
    conversions: number
  }
}

export interface CrossPlatformEvent {
  id: string
  title: string
  description: string
  startTime: string
  endTime: string
  type: "webinar" | "live" | "workshop" | "q&a"
  platforms: ("website" | "facebook")[]
  registrations: {
    website: number
    facebook: number
  }
  targetPersonas: string[]
}
