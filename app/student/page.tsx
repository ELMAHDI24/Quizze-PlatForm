"use client"

import { useRouter } from "next/navigation"
import { Playfair_Display } from "next/font/google"
import { ArrowRight, BookOpen, Clock, FileText } from "lucide-react"
import {
  CURRENT_STUDENT_ID,
  getAssignedQuizzesForStudent,
  isQuizInactive,
  MOCK_ASSIGNMENTS,
  MOCK_QUIZZES,
  MOCK_STUDENT_SCORES,
} from "@/lib/quiz-utils"
import type { Quiz } from "@/lib/types"

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700"],
})

function ActiveQuizCard({ quiz, onStart }: { quiz: Quiz; onStart: () => void }) {
  return (
    <article className="flex flex-col rounded-2xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-5 flex items-start justify-between">
        <span className="rounded-full bg-[#E2EDE7] px-3 py-1 text-xs font-bold tracking-wide text-[#4DA091]">
          ACTIF
        </span>
        <BookOpen className="h-5 w-5 text-[#4DA091]/70" strokeWidth={1.75} />
      </div>

      <h3 className={`${playfair.className} mb-4 text-xl font-bold leading-snug text-[#2D2D2D]`}>
        {quiz.title}
      </h3>

      <div className="mb-6 flex flex-wrap gap-4 text-sm text-[#707070]">
        <span className="flex items-center gap-1.5">
          <Clock className="h-4 w-4" />
          {quiz.durationMinutes} min
        </span>
        <span className="flex items-center gap-1.5">
          <FileText className="h-4 w-4" />
          {quiz.questions.length} question{quiz.questions.length > 1 ? "s" : ""}
        </span>
      </div>

      <button
        type="button"
        onClick={onStart}
        className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl bg-[#4DA091] py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
      >
        <ArrowRight className="h-4 w-4" />
        Commencer le quiz
      </button>
    </article>
  )
}

function CompletedQuizCard({ quiz }: { quiz: Quiz }) {
  const grade = MOCK_STUDENT_SCORES[quiz.id]
  const maxScore = grade?.maxScore ?? (quiz.questions.reduce((sum, q) => sum + q.points, 0) || 20)
  const score = grade?.score ?? 0

  return (
    <article className="flex flex-col rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-start justify-between">
        <span className="rounded-full bg-[#E8E4DC] px-3 py-1 text-xs font-bold tracking-wide text-[#707070]">
          TERMINÉ
        </span>
        <BookOpen className="h-5 w-5 text-[#707070]/50" strokeWidth={1.75} />
      </div>

      <h3 className={`${playfair.className} mb-4 text-xl font-bold leading-snug text-[#2D2D2D]`}>
        {quiz.title}
      </h3>

      <div className="mb-6 flex flex-wrap gap-4 text-sm text-[#707070]">
        <span className="flex items-center gap-1.5">
          <Clock className="h-4 w-4" />
          {quiz.durationMinutes} min
        </span>
        <span className="flex items-center gap-1.5">
          <FileText className="h-4 w-4" />
          {quiz.questions.length} question{quiz.questions.length > 1 ? "s" : ""}
        </span>
      </div>

      <div className="mt-auto flex items-center justify-between rounded-xl bg-[#F0EDE6] px-4 py-3.5">
        <span className="text-sm text-[#707070]">Note obtenue</span>
        <span className="text-base font-bold text-[#2D2D2D]">
          {score}/{maxScore}
        </span>
      </div>
    </article>
  )
}

export default function StudentHomePage() {
  const router = useRouter()

  const assignedQuizzes = getAssignedQuizzesForStudent(
    CURRENT_STUDENT_ID,
    MOCK_QUIZZES,
    MOCK_ASSIGNMENTS
  ).filter((q) => q.status !== "Brouillon")

  const activeQuizzes = assignedQuizzes.filter((q) => !isQuizInactive(q.status))
  const completedQuizzes = assignedQuizzes.filter((q) => isQuizInactive(q.status))
  const allQuizzes = [...activeQuizzes, ...completedQuizzes]

  return (
    <div className="flex-1 px-6 py-8 md:px-10 md:py-10 lg:px-12">
      <header className="mb-10">
        <h1 className={`${playfair.className} text-3xl font-bold text-[#2D2D2D] md:text-4xl`}>
          Mes quiz
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-[#707070] md:text-base">
          Les quiz qui vous ont été directement affectés par vos enseignants.
        </p>
      </header>

      {allQuizzes.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#E8E4DC] bg-white/60 px-6 py-16 text-center text-[#707070]">
          Aucun quiz ne vous a encore été affecté.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {activeQuizzes.map((quiz) => (
            <ActiveQuizCard
              key={quiz.id}
              quiz={quiz}
              onStart={() => router.push(`/student/quiz/${quiz.id}`)}
            />
          ))}
          {completedQuizzes.map((quiz) => (
            <CompletedQuizCard key={quiz.id} quiz={quiz} />
          ))}
        </div>
      )}
    </div>
  )
}
