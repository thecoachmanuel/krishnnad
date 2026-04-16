"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

interface AnnouncementBarProps {
  text: string
}

export function AnnouncementBar({ text }: AnnouncementBarProps) {
  const [isVisible, setIsVisible] = React.useState(false) // Start hidden to prevent flicker
  const [hasChecked, setHasChecked] = React.useState(false)

  React.useEffect(() => {
    const isDismissed = localStorage.getItem("syndicate_announcement_dismissed")
    if (!isDismissed) {
      setIsVisible(true)
    }
    setHasChecked(true)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    localStorage.setItem("syndicate_announcement_dismissed", "true")
  }

  if (!hasChecked || !isVisible || !text) return null

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="relative overflow-hidden bg-black py-2.5 text-center text-[10px] font-black uppercase tracking-[0.2em] text-[var(--accent)] border-b border-white/5"
      >
        <div className="container mx-auto px-12 relative flex items-center justify-center">
          {/* Marquee Wrapper */}
          <div className="overflow-hidden whitespace-nowrap w-full">
            <motion.div
              animate={{ x: ["100%", "-100%"] }}
              transition={{
                repeat: Infinity,
                duration: 45,
                ease: "linear",
              }}
              className="inline-block"
            >
              {text} &nbsp; • &nbsp; {text} &nbsp; • &nbsp; {text} &nbsp; • &nbsp; {text}
            </motion.div>
          </div>

          {/* Close Button */}
          <button 
            onClick={handleClose}
            className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
