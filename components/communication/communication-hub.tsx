"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Send, Phone, Video, Bell, Search, Archive, Star } from "lucide-react"

interface Message {
  id: string
  sender: string
  senderRole: "coach" | "client" | "system" | "community"
  subject: string
  content: string
  timestamp: string
  platform: "clickup" | "course" | "calendar" | "direct" | "community"
  read: boolean
  priority: "high" | "medium" | "low"
  attachments?: string[]
}

const messages: Message[] = [
  {
    id: "1",
    sender: "Sarah Johnson",
    senderRole: "coach",
    subject: "Weekly Check-in Reminder",
    content:
      "Hi! Just a reminder about our weekly check-in tomorrow at 2 PM. Please review your ClickUp tasks before our call.",
    timestamp: "2024-01-30 10:30",
    platform: "direct",
    read: false,
    priority: "high",
  },
  {
    id: "2",
    sender: "Course Platform",
    senderRole: "system",
    subject: "New Module Available",
    content: "Module 3: Advanced Product Research is now available. Complete it before your next session.",
    timestamp: "2024-01-30 09:15",
    platform: "course",
    read: false,
    priority: "medium",
  },
  {
    id: "3",
    sender: "Mike Chen",
    senderRole: "community",
    subject: "Great question about PPC!",
    content:
      "Thanks for sharing your PPC strategy in the community. I had a similar experience with keyword optimization.",
    timestamp: "2024-01-29 16:45",
    platform: "community",
    read: true,
    priority: "low",
  },
]

export function CommunicationHub() {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterPlatform, setFilterPlatform] = useState("all")
  const [newMessage, setNewMessage] = useState("")

  const filteredMessages = messages.filter((message) => {
    const matchesSearch =
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPlatform = filterPlatform === "all" || message.platform === filterPlatform
    return matchesSearch && matchesPlatform
  })

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "clickup":
        return "📋"
      case "course":
        return "🎓"
      case "calendar":
        return "📅"
      case "community":
        return "💬"
      default:
        return "✉️"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="border-b p-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Communication Hub</h2>

        <div className="flex space-x-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <select
            value={filterPlatform}
            onChange={(e) => setFilterPlatform(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="all">All Platforms</option>
            <option value="direct">Direct Messages</option>
            <option value="clickup">ClickUp</option>
            <option value="course">Course Platform</option>
            <option value="calendar">Calendar</option>
            <option value="community">Community</option>
          </select>
        </div>

        <div className="flex space-x-2">
          <Button size="sm" variant="outline">
            <Phone className="h-4 w-4 mr-2" />
            Schedule Call
          </Button>
          <Button size="sm" variant="outline">
            <Video className="h-4 w-4 mr-2" />
            Video Chat
          </Button>
          <Button size="sm" variant="outline">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </Button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Message List */}
        <div className="w-1/3 border-r overflow-y-auto">
          <div className="p-4 space-y-2">
            {filteredMessages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedMessage?.id === message.id
                    ? "bg-blue-50 border-blue-200"
                    : message.read
                      ? "bg-white hover:bg-gray-50"
                      : "bg-blue-25 hover:bg-blue-50"
                }`}
                onClick={() => setSelectedMessage(message)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getPlatformIcon(message.platform)}</span>
                    <span className="font-medium text-sm">{message.sender}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {!message.read && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                    <Badge className={`text-xs ${getPriorityColor(message.priority)}`}>{message.priority}</Badge>
                  </div>
                </div>

                <h4 className="font-semibold text-sm mb-1">{message.subject}</h4>
                <p className="text-xs text-gray-600 line-clamp-2">{message.content}</p>

                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500">{message.timestamp}</span>
                  <Badge variant="outline" className="text-xs">
                    {message.platform}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Message Detail */}
        <div className="flex-1 flex flex-col">
          {selectedMessage ? (
            <>
              <div className="border-b p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getPlatformIcon(selectedMessage.platform)}</span>
                    <div>
                      <h3 className="font-semibold">{selectedMessage.subject}</h3>
                      <p className="text-sm text-gray-600">
                        From: {selectedMessage.sender} • {selectedMessage.timestamp}
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Star className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Archive className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Badge className={getPriorityColor(selectedMessage.priority)}>
                  {selectedMessage.priority} priority
                </Badge>
              </div>

              <div className="flex-1 p-4 overflow-y-auto">
                <div className="prose max-w-none">
                  <p>{selectedMessage.content}</p>
                </div>
              </div>

              <div className="border-t p-4">
                <div className="flex space-x-2">
                  <Textarea
                    placeholder="Type your reply..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1"
                    rows={3}
                  />
                  <Button>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Select a message to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
