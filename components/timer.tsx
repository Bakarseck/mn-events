"use client"

import { useState, useEffect, useRef } from "react"

interface TimerProps {
  isRunning: boolean
  initialSeconds?: number
  onTick: (seconds: number) => void
  size?: "normal" | "small"
}

export default function Timer({ isRunning, initialSeconds = 0, onTick, size = "normal" }: TimerProps) {
  const [time, setTime] = useState("00:00")
  const secondsRef = useRef(initialSeconds)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Mettre à jour le temps affiché et la référence lorsque initialSeconds change
  useEffect(() => {
    secondsRef.current = initialSeconds
    updateTimeDisplay(initialSeconds)
  }, [initialSeconds])

  // Fonction pour mettre à jour l'affichage du temps
  const updateTimeDisplay = (secs: number) => {
    const minutes = Math.floor(secs / 60)
    const remainingSeconds = secs % 60
    const formattedMinutes = String(minutes).padStart(2, "0")
    const formattedSeconds = String(remainingSeconds).padStart(2, "0")
    setTime(`${formattedMinutes}:${formattedSeconds}`)
  }

  // Gérer le démarrage/arrêt du timer
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        const newSeconds = secondsRef.current + 1
        secondsRef.current = newSeconds
        updateTimeDisplay(newSeconds)
        onTick(newSeconds)
      }, 1000)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isRunning, onTick])

  // Déterminer les tailles en fonction de la prop size
  const containerSize = size === "small" ? "w-36 h-36" : "w-64 h-64"
  const textSize = size === "small" ? "text-3xl" : "text-6xl"
  const borderWidth = size === "small" ? "border-4" : "border-6"

  return (
    <div className="relative">
      <div
        className={`${containerSize} rounded-full ${borderWidth} border-[#e9eacb] dark:border-green-900/30 flex items-center justify-center`}
      >
        <span className={`${textSize} font-bold text-green-800 dark:text-green-400`}>{time}</span>
      </div>
    </div>
  )
}
