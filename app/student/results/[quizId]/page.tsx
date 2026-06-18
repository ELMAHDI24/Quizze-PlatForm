"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { Playfair_Display } from "next/font/google"
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react"
import {
  canStudentAccessQuiz,
  CURRENT_STUDENT_ID,
  getQuizResultStatusLabel,
  getStudentQuizResults,
  MOCK_ASSIGNMENTS,
  MOCK_QUIZZES,
} from "@/lib/quiz-utils"

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700"],
})

export default function StudentResultDetailPage() {
  const params = useParams()
  const quizId = params.quizId as string

  const quiz = MOCK_QUIZZES.find((q) => q.id === quizId)
  const result = getStudentQuizResults(CURRENT_STUDENT_ID).find((r) => r.quizId === quizId)

  if (
    !quiz ||
    !result ||
    !canStudentAccessQuiz(CURRENT_STUDENT_ID, quizId, MOCK_ASSIGNMENTS)
  ) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-16 text-[#707070]">
        <p>Résultat introuvable.</p>
        <Link href="/student/results" className="text-sm font-semibold text-[#4DA091]">
          Retour à mes résultats
        </Link>
      </div>
    )
  }

  const percentage = Math.round((result.score / result.total) * 100)
  const correctCount = Math.round((result.score / result.total) * quiz.questions.length)

  return (
    <div className="flex-1 px-6 py-8 md:px-10 md:py-10 lg:px-12">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8 flex items-start gap-4">
          <Link
            href="/student/results"
            className="mt-1 flex h-10 w-10 items-center justify-center rounded-xl border border-[#E8E4DC] bg-white text-[#707070] transition-colors hover:border-[#4DA091]/40 hover:text-[#4DA091]"
            aria-label="Retour"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className={`${playfair.className} text-3xl font-bold text-[#2D2D2D]`}>
              Détail du résultat
            </h1>
            <p className="mt-1 text-sm text-[#707070]">{quiz.title}</p>
          </div>
        </header>

        <div className="mb-8 rounded-3xl border border-[#E8E4DC] bg-white p-6 text-center shadow-sm md:p-8">
          <p className="text-sm text-[#707070]">Note finale</p>
          <p className={`${playfair.className} mt-2 text-5xl font-bold text-[#2D2D2D]`}>
            {result.score}
            <span className="text-2xl text-[#707070]">/{result.total}</span>
          </p>
          <p className="mt-3 text-sm text-[#707070]">
            {percentage}% — {getQuizResultStatusLabel(result.status)}
          </p>
          <p className="mt-1 text-xs text-[#707070]">Passé le {result.date}</p>
        </div>

        <section className="rounded-3xl border border-[#E8E4DC] bg-white p-5 shadow-sm md:p-6">
          <h2 className="mb-4 text-lg font-semibold text-[#2D2D2D]">Récapitulatif</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-xl bg-[#F9F7F2] px-4 py-3 text-sm">
              <span className="text-[#707070]">Questions du quiz</span>
              <span className="font-semibold text-[#2D2D2D]">{quiz.questions.length}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-[#F9F7F2] px-4 py-3 text-sm">
              <span className="text-[#707070]">Réponses correctes (estimé)</span>
              <span className="font-semibold text-[#2D2D2D]">~{correctCount}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-[#F9F7F2] px-4 py-3 text-sm">
              <span className="text-[#707070]">Système de notation</span>
              <span className="font-semibold text-[#2D2D2D]">
                {result.gradingSystem === "canadien" ? "Canadien" : "Standard"}
              </span>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            {quiz.questions.map((question, index) => {
              const isCorrect = index < correctCount
              return (
                <div
                  key={question.id}
                  className="flex items-start gap-3 rounded-xl border border-[#F0EDE6] px-4 py-3"
                >
                  {isCorrect ? (
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#4DA091]" />
                  ) : (
                    <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#D32F2F]" />
                  )}
                  <div>
                    <p className="text-xs font-semibold text-[#707070]">Question {index + 1}</p>
                    <p
                      className="text-sm text-[#2D2D2D]"
                      dangerouslySetInnerHTML={{ __html: question.text }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </div>
    </div>
  )
}
