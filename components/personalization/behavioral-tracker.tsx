"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { usePersonalizationStore } from "@/store/personalization-store"

interface BehavioralTrackerProps {
  children: React.ReactNode
}

export function BehavioralTracker({ children }: BehavioralTrackerProps) {
  const { trackBehavior, consentGiven, isPersonalizationEnabled } = usePersonalizationStore()
  const startTime = useRef(Date.now())
  const lastScrollY = useRef(0)
  const engagementEvents = useRef<string[]>([])

  useEffect(() => {
    if (!consentGiven || !isPersonalizationEnabled) return

    // Track page view
    trackBehavior("page_view", {
      url: window.location.pathname,
      timestamp: new Date().toISOString(),
    })

    // Track time on page
    const handleBeforeUnload = () => {
      const timeSpent = Date.now() - startTime.current
      trackBehavior("time_on_page", {
        duration: timeSpent,
        url: window.location.pathname,
      })
    }

    // Track scroll behavior
    const handleScroll = () => {
      const scrollY = window.scrollY
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercentage = (scrollY / documentHeight) * 100

      // Track significant scroll milestones
      if (scrollPercentage > 25 && !engagementEvents.current.includes("scroll_25")) {
        engagementEvents.current.push("scroll_25")
        trackBehavior("content_engagement", { type: "scroll", percentage: 25 })
      }
      if (scrollPercentage > 50 && !engagementEvents.current.includes("scroll_50")) {
        engagementEvents.current.push("scroll_50")
        trackBehavior("content_engagement", { type: "scroll", percentage: 50 })
      }
      if (scrollPercentage > 75 && !engagementEvents.current.includes("scroll_75")) {
        engagementEvents.current.push("scroll_75")
        trackBehavior("content_engagement", { type: "scroll", percentage: 75 })
      }

      lastScrollY.current = scrollY
    }

    // Track click behavior
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      const tagName = target.tagName.toLowerCase()
      const className = target.className
      const href = target.getAttribute("href")

      // Track different types of clicks
      if (tagName === "button" || target.closest("button")) {
        trackBehavior("button_click", {
          text: target.textContent?.trim(),
          className,
        })
      }

      if (tagName === "a" || target.closest("a")) {
        trackBehavior("link_click", {
          href,
          text: target.textContent?.trim(),
          external: href?.startsWith("http") && !href.includes(window.location.hostname),
        })
      }

      // Track CTA clicks specifically
      if (target.closest("[data-cta]")) {
        trackBehavior("cta_click", {
          ctaType: target.closest("[data-cta]")?.getAttribute("data-cta"),
          text: target.textContent?.trim(),
        })
      }
    }

    // Track form interactions
    const handleFormSubmit = (event: SubmitEvent) => {
      const form = event.target as HTMLFormElement
      const formData = new FormData(form)
      const formType = form.getAttribute("data-form-type") || "unknown"

      trackBehavior("form_submit", {
        formType,
        fields: Array.from(formData.keys()),
      })
    }

    // Track video interactions
    const handleVideoPlay = (event: Event) => {
      const video = event.target as HTMLVideoElement
      trackBehavior("video_play", {
        src: video.src,
        currentTime: video.currentTime,
      })
    }

    const handleVideoEnded = (event: Event) => {
      const video = event.target as HTMLVideoElement
      trackBehavior("video_completion", {
        src: video.src,
        duration: video.duration,
      })
    }

    // Track download clicks
    const handleDownload = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      const link = target.closest("a")
      if (link && link.getAttribute("download")) {
        trackBehavior("download", {
          filename: link.getAttribute("download"),
          href: link.href,
        })
      }
    }

    // Add event listeners
    window.addEventListener("beforeunload", handleBeforeUnload)
    window.addEventListener("scroll", handleScroll, { passive: true })
    document.addEventListener("click", handleClick)
    document.addEventListener("submit", handleFormSubmit)
    document.addEventListener("click", handleDownload)

    // Video event listeners
    const videos = document.querySelectorAll("video")
    videos.forEach((video) => {
      video.addEventListener("play", handleVideoPlay)
      video.addEventListener("ended", handleVideoEnded)
    })

    // Cleanup
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
      window.removeEventListener("scroll", handleScroll)
      document.removeEventListener("click", handleClick)
      document.removeEventListener("submit", handleFormSubmit)
      document.removeEventListener("click", handleDownload)

      videos.forEach((video) => {
        video.removeEventListener("play", handleVideoPlay)
        video.removeEventListener("ended", handleVideoEnded)
      })
    }
  }, [consentGiven, isPersonalizationEnabled, trackBehavior])

  return <>{children}</>
}
