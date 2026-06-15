"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart, BookOpen, LayoutDashboard, PlusCircle, Settings, Users } from "lucide-react"

export function TeacherSidebar() {
  const pathname = usePathname()

  const isDashboardActive = pathname === '/teacher'
  const isQuizzesActive = pathname === '/teacher/quizzes' || pathname === '/teacher/quiz/new'
  const isResultsActive = pathname.includes('/results')

  return (
    <aside className="w-64 border-r bg-white flex flex-col hidden md:flex">
      <div className="p-6 border-b border-slate-100">
        <h2 className="font-semibold text-lg text-slate-800">Espace Enseignant</h2>
        <p className="text-sm text-slate-500">Gérez vos quiz et élèves</p>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <Link 
          href="/teacher" 
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
            isDashboardActive 
              ? "bg-primary/5 text-primary" 
              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          }`}
        >
          <LayoutDashboard className={`h-5 w-5 ${isDashboardActive ? "text-primary" : "text-slate-400"}`} />
          Tableau de bord
        </Link>
        <Link 
          href="/teacher/quizzes" 
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
            isQuizzesActive 
              ? "bg-primary/5 text-primary" 
              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          }`}
        >
          <BookOpen className={`h-5 w-5 ${isQuizzesActive ? "text-primary" : "text-slate-400"}`} />
          Gestion des Quiz
        </Link>
        <Link 
          href="/teacher/quiz/1/results" 
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
            isResultsActive 
              ? "bg-primary/5 text-primary" 
              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          }`}
        >
          <BarChart className={`h-5 w-5 ${isResultsActive ? "text-primary" : "text-slate-400"}`} />
          Résultats
        </Link>
      </nav>
      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
            P
          </div>
          <div>
            <p className="text-sm font-medium text-slate-800">Prof. Dupont</p>
            <p className="text-xs text-slate-500">prof@ecole.fr</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
