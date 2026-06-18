"use client"

import Link from "next/link"
import { Playfair_Display } from "next/font/google"
import {
  BarChart3,
  Calendar,
  Clock,
  Pencil,
  PlusCircle,
  Trash2,
  Trophy,
  Users,
} from "lucide-react"
import {
  getQuizCardClassName,
  isQuizInactive,
  MOCK_QUIZZES,
  countAssignedStudents,
  resolveQuizStatus,
} from "@/lib/quiz-utils"

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700"],
})

function formatExpiry(date: Date) {
  return date.toLocaleDateString("fr-FR")
}

export default function TeacherQuizzesPage() {
  const quizzes = MOCK_QUIZZES.filter((q) => q.status !== "Brouillon").map((q) => ({
    ...q,
    status: resolveQuizStatus(q),
  }))

  return (
    <div className="flex-1 bg-[#F9F7F2] px-6 py-8 md:px-10 md:py-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <header className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className={`${playfair.className} text-3xl font-bold text-[#2D2D2D] md:text-4xl`}>
              Gestion des quiz
            </h1>
            <p className="mt-1 text-sm text-[#707070]">
              Les quiz expirés s&apos;affichent automatiquement en grisé (inactif).
            </p>
          </div>
          <Link
            href="/teacher/quiz/new"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#C46A42] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
          >
            + Créer un quiz
          </Link>
        </header>

        <div className="space-y-4">
          {quizzes.map((quiz) => {
            const inactive = isQuizInactive(quiz.status)
            const assignedCount = countAssignedStudents(quiz.id)

            return (
              <article
                key={quiz.id}
                className={getQuizCardClassName(
                  quiz.status,
                  "rounded-3xl border border-[#E8E4DC] bg-white px-5 py-5 shadow-sm md:px-6"
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold tracking-wide ${
                      quiz.status === "Actif"
                        ? "bg-[#E2EDE7] text-[#4DA091]"
                        : "bg-[#E8E4DC] text-[#707070]"
                    }`}
                  >
                    {quiz.status.toUpperCase()}
                  </span>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/teacher/quiz/${quiz.id}/results`}
                      className={`flex h-9 w-9 items-center justify-center rounded-lg border border-[#E8E4DC] text-[#707070] transition-colors hover:border-[#C46A42]/40 hover:text-[#C46A42] ${
                        inactive ? "pointer-events-none opacity-40" : ""
                      }`}
                      aria-label="Voir les résultats"
                    >
                      <Trophy className="h-4 w-4" />
                    </Link>
                    <Link
                      href={`/teacher/quiz/${quiz.id}/add-question`}
                      className={`flex h-9 w-9 items-center justify-center rounded-lg border border-[#E8E4DC] text-[#707070] transition-colors hover:border-[#C46A42]/40 hover:text-[#C46A42] ${
                        inactive ? "pointer-events-none opacity-40" : ""
                      }`}
                      aria-label="Ajouter une question"
                    >
                      <PlusCircle className="h-4 w-4" />
                    </Link>
                    <button
                      type="button"
                      disabled={inactive}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E8E4DC] text-[#707070] transition-colors hover:border-[#C46A42]/40 hover:text-[#C46A42] disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Modifier le quiz"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      disabled={inactive}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E8E4DC] text-[#707070] transition-colors hover:border-red-300 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Supprimer le quiz"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <h2 className={`${playfair.className} mt-4 text-xl font-bold text-[#2D2D2D]`}>
                  {quiz.title}
                </h2>

                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#707070]">
                  <span className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-[#B3A89A]" />
                    {quiz.durationMinutes} minutes
                  </span>
                  <span className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-[#B3A89A]" />
                    Expire : {formatExpiry(quiz.expiresAt)}
                  </span>
                  <span className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-[#B3A89A]" />
                    {assignedCount} étudiants affectés
                  </span>
                  <span className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-[#B3A89A]" />
                    {quiz.gradingSystem === "canadien" ? "Notation canadienne" : "Notation standard"}
                  </span>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </div>
  )
}
