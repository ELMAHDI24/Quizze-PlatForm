"use client"

import { useEffect, useState, useCallback } from "react"
import { Clock, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

interface QuizTimerProps {
  durationMinutes: number
  onTimeUp?: () => void
  className?: string
}

export function QuizTimer({ durationMinutes, onTimeUp, className }: QuizTimerProps) {
  const totalSeconds = durationMinutes * 60
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds)

  const formatTime = useCallback((seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
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

  const isWarning = secondsLeft <= 60
  const isCritical = secondsLeft <= 30
  const progress = (secondsLeft / totalSeconds) * 100

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
      {isCritical ? (
        <AlertTriangle className="h-5 w-5 text-red-500 shrink-0" />
      ) : (
        <Clock
          className={cn(
            "h-5 w-5 shrink-0",
            isWarning ? "text-amber-500" : "text-[#4DA091]"
          )}
        />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            Temps restant
          </span>
          <span
            className={cn(
              "font-mono text-lg font-bold tabular-nums",
              isCritical
                ? "text-red-600"
                : isWarning
                  ? "text-amber-600"
                  : "text-[#2D2D2D]"
            )}
          >
            {formatTime(secondsLeft)}
          </span>
        </div>
        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-1000",
              isCritical
                ? "bg-red-500"
                : isWarning
                  ? "bg-amber-500"
                  : "bg-gradient-to-r from-[#D98466] to-[#4DA091]"
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}
