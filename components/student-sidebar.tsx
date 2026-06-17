"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { BarChart3, LogOut } from "lucide-react"
import { CURRENT_STUDENT } from "@/lib/quiz-utils"

function AppLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
      <line x1="10" y1="6.5" x2="14" y2="6.5" />
      <line x1="10" y1="17.5" x2="14" y2="17.5" />
      <line x1="6.5" y1="10" x2="6.5" y2="14" />
      <line x1="17.5" y1="10" x2="17.5" y2="14" />
    </svg>
  )
}

export function StudentSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const isQuizSession = pathname.startsWith("/student/quiz/")
  const isQuizzesActive = pathname === "/student" || isQuizSession

  if (isQuizSession) return null

  return (
    <>
      <div className="flex items-center justify-between border-b border-[#E8E4DC] bg-[#F9F7F2] px-4 py-4 md:hidden">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#4DA091]">
          <AppLogo className="h-4 w-4 text-white" />
        </div>
        <p className="text-sm font-semibold text-[#2D2D2D]">Mes quiz</p>
        <button
          type="button"
          onClick={() => router.push("/auth")}
          className="text-xs font-medium text-[#707070]"
        >
          Déconnexion
        </button>
      </div>

      <aside className="hidden w-64 shrink-0 flex-col border-r border-[#E8E4DC] bg-[#F9F7F2] md:flex">
      <div className="p-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#4DA091] shadow-sm">
          <AppLogo className="h-5 w-5 text-white" />
        </div>
      </div>

      <nav className="flex-1 px-4">
        <Link
          href="/student"
          className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
            isQuizzesActive
              ? "bg-[#E2EDE7] text-[#2D2D2D]"
              : "text-[#707070] hover:bg-[#E2EDE7]/50 hover:text-[#2D2D2D]"
          }`}
        >
          <BarChart3 className={`h-5 w-5 ${isQuizzesActive ? "text-[#4DA091]" : "text-[#707070]"}`} />
          Mes quiz
        </Link>
      </nav>

      <div className="border-t border-[#E8E4DC] p-4">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#4DA091] text-sm font-bold text-white">
            {CURRENT_STUDENT.initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[#2D2D2D]">{CURRENT_STUDENT.name}</p>
            <p className="text-xs text-[#707070]">Étudiant</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => router.push("/auth")}
          className="mt-2 flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-[#707070] transition-colors hover:bg-[#E2EDE7]/50 hover:text-[#2D2D2D]"
        >
          <LogOut className="h-4 w-4" />
          Déconnexion
        </button>
      </div>
    </aside>
    </>
  )
}
