"use client"

import { useEffect, useState, useCallback } from "react"
import { cn } from "@/lib/utils"

interface QuizTimerProps {
  durationMinutes: number
  onTimeUp?: () => void
  className?: string
  variant?: "bar" | "circular"
}

export function QuizTimer({
  durationMinutes,
  onTimeUp,
  className,
  variant = "bar",
}: QuizTimerProps) {
  const totalSeconds = durationMinutes * 60
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds)

  const formatTime = useCallback((seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, "0")}`
  }, [])

  useEffect(() => {
    if (secondsLeft <= 0) {
      onTimeUp?.()
      return
    }

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          onTimeUp?.()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [secondsLeft, onTimeUp])

  const progress = secondsLeft / totalSeconds
  const isWarning = secondsLeft <= 60
  const isCritical = secondsLeft <= 30

  if (variant === "circular") {
    const radius = 28
    const circumference = 2 * Math.PI * radius
    const strokeDashoffset = circumference * (1 - progress)

    return (
      <div className={cn("relative flex h-[72px] w-[72px] items-center justify-center", className)}>
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 72 72">
          <circle cx="36" cy="36" r={radius} fill="none" stroke="#E8E4DC" strokeWidth="4" />
          <circle
            cx="36"
            cy="36"
            r={radius}
            fill="none"
            stroke={isCritical ? "#D32F2F" : isWarning ? "#D98466" : "#4DA091"}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000"
          />
        </svg>
        <span
          className={cn(
            "relative text-sm font-bold tabular-nums",
            isCritical ? "text-red-600" : isWarning ? "text-[#D98466]" : "text-[#2D2D2D]"
          )}
        >
          {formatTime(secondsLeft)}
        </span>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl border px-4 py-2.5 transition-colors",
        isCritical
          ? "border-red-200 bg-red-50"
          : isWarning
            ? "border-amber-200 bg-amber-50"
            : "border-slate-200 bg-white",
        className
      )}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            Temps restant
          </span>
          <span
            className={cn(
              "font-mono text-lg font-bold tabular-nums",
              isCritical ? "text-red-600" : isWarning ? "text-amber-600" : "text-[#2D2D2D]"
            )}
          >
            {formatTime(secondsLeft)}
          </span>
        </div>
        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-1000",
              isCritical ? "bg-red-500" : isWarning ? "bg-amber-500" : "bg-[#4DA091]"
            )}
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}
