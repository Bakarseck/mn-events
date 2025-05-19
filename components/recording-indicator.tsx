"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface RecordingIndicatorProps {
  isRecording: boolean
}

export default function RecordingIndicator({ isRecording }: RecordingIndicatorProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (!isRecording) return

    // Créer un effet de clignotement si l'enregistrement est actif
    const interval = setInterval(() => {
      setVisible((prev) => !prev)
    }, 500)

    return () => clearInterval(interval)
  }, [isRecording])

  return (
    <div
      className={cn(
        "w-3 h-3 rounded-full transition-opacity duration-200",
        isRecording ? "bg-red-600 dark:bg-red-500" : "bg-gray-300 dark:bg-gray-600",
        isRecording && !visible && "opacity-30",
      )}
    />
  )
}
