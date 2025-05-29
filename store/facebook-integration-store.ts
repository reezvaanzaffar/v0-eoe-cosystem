import { create } from "zustand"
import type { FacebookGroupPost, GroupMember, GroupStats, ContentSyndication } from "@/types/facebook-integration"

interface FacebookIntegrationState {
  groupStats: GroupStats | null
  recentPosts: FacebookGroupPost[]
  featuredPosts: FacebookGroupPost[]
  groupMembers: GroupMember[]
  isGroupMember: boolean
  userFacebookId: string | null
  contentSyndications: ContentSyndication[]
  isConnected: boolean
  lastSync: string | null

  // Actions
  setGroupStats: (stats: GroupStats) => void
  setRecentPosts: (posts: FacebookGroupPost[]) => void
  setFeaturedPosts: (posts: FacebookGroupPost[]) => void
  setGroupMembers: (members: GroupMember[]) => void
  setIsGroupMember: (isMember: boolean) => void
  setUserFacebookId: (id: string | null) => void
  addContentSyndication: (syndication: ContentSyndication) => void
  updateSyndicationStatus: (id: string, status: string) => void
  setIsConnected: (connected: boolean) => void
  syncGroupData: () => Promise<void>
  getPersonaFilteredPosts: (persona: string) => FacebookGroupPost[]
}

export const useFacebookIntegrationStore = create<FacebookIntegrationState>((set, get) => ({
  groupStats: null,
  recentPosts: [],
  featuredPosts: [],
  groupMembers: [],
  isGroupMember: false,
  userFacebookId: null,
  contentSyndications: [],
  isConnected: false,
  lastSync: null,

  setGroupStats: (stats) => set({ groupStats: stats }),
  setRecentPosts: (posts) => set({ recentPosts: posts }),
  setFeaturedPosts: (posts) => set({ featuredPosts: posts }),
  setGroupMembers: (members) => set({ groupMembers: members }),
  setIsGroupMember: (isMember) => set({ isGroupMember: isMember }),
  setUserFacebookId: (id) => set({ userFacebookId: id }),

  addContentSyndication: (syndication) =>
    set((state) => ({
      contentSyndications: [syndication, ...state.contentSyndications],
    })),

  updateSyndicationStatus: (id, status) =>
    set((state) => ({
      contentSyndications: state.contentSyndications.map((s) => (s.id === id ? { ...s, status } : s)),
    })),

  setIsConnected: (connected) => set({ isConnected: connected }),

  syncGroupData: async () => {
    try {
      // Mock API call - in real implementation, this would call Facebook Graph API
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const mockStats: GroupStats = {
        totalMembers: 14348,
        activeMembers: 2847,
        postsToday: 23,
        engagementRate: 8.5,
        growthRate: 2.3,
        topHashtags: ["#LaunchJourney", "#ScaleUp", "#AmazonEducation", "#ServiceProviders", "#AmazonInvesting"],
      }

      const mockPosts: FacebookGroupPost[] = [
        {
          id: "1",
          message: "Just launched my first product! Thanks to this community for all the support 🚀 #LaunchJourney",
          author: {
            name: "Sarah Johnson",
            profilePicture: "/placeholder.svg?height=40&width=40",
            id: "user1",
          },
          createdTime: "2024-01-30T10:30:00Z",
          likes: 45,
          comments: 12,
          shares: 3,
          hashtags: ["#LaunchJourney"],
          persona: ["startup-sam"],
          engagement: 85,
          type: "text",
        },
        {
          id: "2",
          message:
            "Looking for advice on scaling from 6 to 7 figures. What were your biggest challenges? #ScaleUp #Optimization",
          author: {
            name: "Mike Chen",
            profilePicture: "/placeholder.svg?height=40&width=40",
            id: "user2",
          },
          createdTime: "2024-01-30T09:15:00Z",
          likes: 32,
          comments: 18,
          shares: 5,
          hashtags: ["#ScaleUp", "#Optimization"],
          persona: ["scaling-sarah"],
          engagement: 92,
          type: "text",
        },
      ]

      set({
        groupStats: mockStats,
        recentPosts: mockPosts,
        lastSync: new Date().toISOString(),
      })
    } catch (error) {
      console.error("Failed to sync group data:", error)
    }
  },

  getPersonaFilteredPosts: (persona) => {
    const state = get()
    return state.recentPosts.filter((post) => post.persona?.includes(persona))
  },
}))
