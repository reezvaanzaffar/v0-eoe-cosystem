"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquare, ThumbsUp, ThumbsDown, Bug, Lightbulb, X, Star } from "lucide-react"
import { useTestingStore } from "@/store/testing-store"
import { usePersonalizationStore } from "@/store/personalization-store"

export function UserFeedbackWidget() {
  const { feedbackWidgetVisible, toggleFeedbackWidget, submitFeedback } = useTestingStore()
  const { currentPersona } = usePersonalizationStore()
  const [feedbackType, setFeedbackType] = useState<"thumbs" | "bug" | "feature" | "satisfaction">("thumbs")
  const [rating, setRating] = useState<number>(0)
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!message.trim() && feedbackType !== "thumbs") return

    setIsSubmitting(true)

    await submitFeedback({
      type: feedbackType,
      rating: feedbackType === "satisfaction" ? rating : feedbackType === "thumbs" ? (rating > 0 ? 1 : -1) : undefined,
      message: message.trim() || undefined,
      pageUrl: window.location.pathname,
      persona: currentPersona?.persona,
      status: "new",
    })

    // Reset form
    setMessage("")
    setRating(0)
    setFeedbackType("thumbs")
    setIsSubmitting(false)
    toggleFeedbackWidget()

    // Show thank you message
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("feedback_submitted"))
    }
  }

  const feedbackTypes = [
    { id: "thumbs", label: "Quick Feedback", icon: ThumbsUp },
    { id: "bug", label: "Report Bug", icon: Bug },
    { id: "feature", label: "Feature Request", icon: Lightbulb },
    { id: "satisfaction", label: "Rate Experience", icon: Star },
  ]

  return (
    <>
      {/* Feedback Trigger Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2 }}
      >
        <Button
          onClick={toggleFeedbackWidget}
          className="rounded-full w-14 h-14 shadow-lg bg-blue-600 hover:bg-blue-700"
          size="lg"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      </motion.div>

      {/* Feedback Widget */}
      <AnimatePresence>
        {feedbackWidgetVisible && (
          <motion.div
            className="fixed bottom-24 right-6 z-50 w-80"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="shadow-xl border-2">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Share Your Feedback</CardTitle>
                  <Button variant="ghost" size="sm" onClick={toggleFeedbackWidget} className="h-8 w-8 p-0">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Feedback Type Selection */}
                <div className="grid grid-cols-2 gap-2">
                  {feedbackTypes.map((type) => (
                    <Button
                      key={type.id}
                      variant={feedbackType === type.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFeedbackType(type.id as any)}
                      className="flex items-center space-x-2"
                    >
                      <type.icon className="h-4 w-4" />
                      <span className="text-xs">{type.label}</span>
                    </Button>
                  ))}
                </div>

                {/* Quick Thumbs Feedback */}
                {feedbackType === "thumbs" && (
                  <div className="flex justify-center space-x-4">
                    <Button
                      variant={rating === 1 ? "default" : "outline"}
                      size="lg"
                      onClick={() => setRating(1)}
                      className="flex-1"
                    >
                      <ThumbsUp className="h-5 w-5 mr-2" />
                      Helpful
                    </Button>
                    <Button
                      variant={rating === -1 ? "default" : "outline"}
                      size="lg"
                      onClick={() => setRating(-1)}
                      className="flex-1"
                    >
                      <ThumbsDown className="h-5 w-5 mr-2" />
                      Not Helpful
                    </Button>
                  </div>
                )}

                {/* Satisfaction Rating */}
                {feedbackType === "satisfaction" && (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">How would you rate your experience?</p>
                    <div className="flex justify-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Button key={star} variant="ghost" size="sm" onClick={() => setRating(star)} className="p-1">
                          <Star
                            className={`h-6 w-6 ${
                              star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            }`}
                          />
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Message Input */}
                {(feedbackType === "bug" ||
                  feedbackType === "feature" ||
                  (feedbackType === "thumbs" && rating !== 0) ||
                  (feedbackType === "satisfaction" && rating > 0)) && (
                  <div className="space-y-2">
                    <Textarea
                      placeholder={
                        feedbackType === "bug"
                          ? "Describe the issue you encountered..."
                          : feedbackType === "feature"
                            ? "What feature would you like to see?"
                            : "Tell us more about your experience..."
                      }
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={3}
                      className="resize-none"
                    />
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  onClick={handleSubmit}
                  disabled={
                    isSubmitting ||
                    (feedbackType !== "thumbs" && !message.trim()) ||
                    (feedbackType === "thumbs" && rating === 0) ||
                    (feedbackType === "satisfaction" && rating === 0)
                  }
                  className="w-full"
                >
                  {isSubmitting ? "Submitting..." : "Submit Feedback"}
                </Button>

                {/* Privacy Notice */}
                <p className="text-xs text-gray-500 text-center">
                  Your feedback helps us improve. We respect your privacy.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
