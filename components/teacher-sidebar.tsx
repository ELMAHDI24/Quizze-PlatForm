"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { BarChart3, ClipboardList, LayoutDashboard, LogOut, PlusCircle } from "lucide-react"

export function TeacherSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const isDashboardActive = pathname === "/teacher"
  const isQuizzesActive = pathname === "/teacher/quizzes"
  const isResultsActive = pathname.includes("/results")
  const isCreateQuizActive = pathname === "/teacher/quiz/new"

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-[#E8E4DC] bg-[#F9F7F2] md:flex">
      <div className="flex items-center gap-3 px-6 py-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#C46A42]/90 text-white text-sm font-semibold shadow-sm">
          QM
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#2D2D2D]">QuizMaster</p>
          <p className="text-xs text-[#707070]">Espace Enseignant</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        <Link
          href="/teacher"
          className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
            isDashboardActive
              ? "bg-[#F4E1D5] text-[#2D2D2D]"
              : "text-[#707070] hover:bg-[#F4E1D5]/60 hover:text-[#2D2D2D]"
          }`}
        >
          <LayoutDashboard
            className={`h-5 w-5 ${isDashboardActive ? "text-[#C46A42]" : "text-[#B3A89A]"}`}
          />
          Tableau de bord
        </Link>

        <Link
          href="/teacher/quizzes"
          className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
            isQuizzesActive
              ? "bg-[#F4E1D5] text-[#2D2D2D]"
              : "text-[#707070] hover:bg-[#F4E1D5]/60 hover:text-[#2D2D2D]"
          }`}
        >
          <ClipboardList
            className={`h-5 w-5 ${isQuizzesActive ? "text-[#C46A42]" : "text-[#B3A89A]"}`}
          />
          Gestion des quiz
        </Link>

        <Link
          href="/teacher/quiz/1/results"
          className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
            isResultsActive
              ? "bg-[#F4E1D5] text-[#2D2D2D]"
              : "text-[#707070] hover:bg-[#F4E1D5]/60 hover:text-[#2D2D2D]"
          }`}
        >
          <BarChart3
            className={`h-5 w-5 ${isResultsActive ? "text-[#C46A42]" : "text-[#B3A89A]"}`}
          />
          Résultats
        </Link>

        <Link
          href="/teacher/quiz/new"
          className={`mt-4 flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
            isCreateQuizActive
              ? "bg-[#F4E1D5] text-[#2D2D2D]"
              : "bg-[#C46A42] text-white shadow-sm hover:opacity-90"
          }`}
        >
          <PlusCircle
            className={`h-5 w-5 ${isCreateQuizActive ? "text-[#C46A42]" : "text-white"}`}
          />
          Créer un quiz
        </Link>
      </nav>

      <div className="border-t border-[#E8E4DC] px-4 py-4">
        <div className="flex items-center gap-3 rounded-xl px-3 py-2">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#C46A42]/15 text-sm font-semibold text-[#C46A42]">
            HL
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-[#2D2D2D]">Pr. Hamza Lakhdar</p>
            <p className="text-xs text-[#707070]">Enseignant</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => router.push("/auth")}
          className="mt-2 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[#707070] transition-colors hover:bg-[#F4E1D5]/60 hover:text-[#2D2D2D]"
        >
          <LogOut className="h-4 w-4" />
          Déconnexion
        </button>
      </div>
    </aside>
  )
}
