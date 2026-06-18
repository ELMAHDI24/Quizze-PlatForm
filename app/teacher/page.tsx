import Link from "next/link"
import { Playfair_Display } from "next/font/google"
import { PlusCircle, Trophy, Clock, Users, FileText } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { getQuizCardClassName, MOCK_ASSIGNMENTS, MOCK_QUIZZES, MOCK_STUDENT_SCORES, resolveQuizStatus, isQuizInactive } from "@/lib/quiz-utils"

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700"],
})

const BEST_SCORES: Record<
  string,
  {
    label: string
    student: string
  }
> = {
  "1": { label: "19.5/20", student: "Yasmine El Amrani" },
  "2": { label: "17/20", student: "Karim Idrissi" },
}

function countAssignedStudents(quizId: string) {
  return MOCK_ASSIGNMENTS.filter((a) => a.quizId === quizId).length
}

export default function TeacherDashboard() {
  const quizzes = MOCK_QUIZZES.filter((q) => q.status !== "Brouillon")
  const featured = quizzes[0]
  const featuredScore = featured ? BEST_SCORES[featured.id]?.label ?? "—" : "—"
  const featuredStudent = featured ? BEST_SCORES[featured.id]?.student ?? "Meilleur élève" : ""

  return (
    <div className="flex-1 bg-[#F9F7F2] px-6 py-8 md:px-10 md:py-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <header className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className={`${playfair.className} text-3xl font-bold text-[#2D2D2D] md:text-4xl`}>
              Tableau de bord
            </h1>
            <p className="mt-1 text-sm text-[#707070]">
              Vue d&apos;ensemble de vos évaluations et des meilleurs résultats.
            </p>
          </div>
          <Link
            href="/teacher/quiz/new"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#C46A42] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
          >
            + Créer un quiz
          </Link>
        </header>

        {featured && (
          <section className="rounded-3xl bg-[#C46A42] px-6 py-6 text-white shadow-sm md:px-8 md:py-7">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
              Meilleure note actuelle
            </p>
            <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                  <Trophy className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm">
                    <span className="font-semibold">{featuredStudent}</span>{" "}
                    <span className="opacity-90">
                      — {featuredScore} sur « {featured.title} »
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#2D2D2D]">Vos quiz</h2>
          </div>

          <div className="space-y-4">
            {quizzes.map((quiz) => {
              const assignmentCount = countAssignedStudents(quiz.id)
              const bestScore = BEST_SCORES[quiz.id]?.label
              const resolvedStatus = resolveQuizStatus(quiz)
              const inactive = isQuizInactive(resolvedStatus)

              return (
                <article
                  key={quiz.id}
                  className={getQuizCardClassName(
                    quiz.status,
                    "flex flex-col gap-4 rounded-3xl border border-[#E8E4DC] bg-white px-5 py-4 shadow-sm md:px-6 md:py-5"
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <h3 className="text-base font-semibold text-[#2D2D2D] md:text-lg">
                        {quiz.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-[#707070]">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {quiz.durationMinutes} min
                        </span>
                        <span className="h-1 w-1 rounded-full bg-[#D0C5B7]" />
                        <span>{assignmentCount} étudiants affectés</span>
                        <span className="h-1 w-1 rounded-full bg-[#D0C5B7]" />
                        <span>{quiz.questions.length} questions</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div className="flex gap-2">
                        <Badge
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            quiz.status === "Actif"
                              ? "bg-[#E2EDE7] text-[#4DA091]"
                              : "bg-[#E8E4DC] text-[#707070]"
                          }`}
                        >
                          {quiz.status.toUpperCase()}
                        </Badge>
                        <Badge className="rounded-full bg-[#F0EDE6] px-3 py-1 text-xs font-semibold text-[#707070]">
                          {quiz.gradingSystem === "canadien" ? "Système canadien" : "Standard"}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-1 text-xs text-[#707070]">
                        <FileText className="h-3.5 w-3.5 text-[#C46A42]" />
                        {bestScore ? (
                          <span>
                            Meilleure note{" "}
                            <span className="font-semibold text-[#C46A42]">{bestScore}</span>
                          </span>
                        ) : (
                          <span>Pas encore de résultats</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 border-t border-[#F0EDE6] pt-4">
                    <Link
                      href={`/teacher/quiz/${quiz.id}/results`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-[#E8E4DC] bg-white px-4 py-2 text-xs font-semibold text-[#707070] transition-colors hover:border-[#C46A42]/40 hover:text-[#C46A42]"
                    >
                      <Trophy className="h-3.5 w-3.5" />
                      Résultats
                    </Link>
                    <Link
                      href={`/teacher/quiz/${quiz.id}/add-question`}
                      className={`inline-flex items-center gap-1.5 rounded-full border border-[#E8E4DC] bg-white px-4 py-2 text-xs font-semibold text-[#707070] transition-colors hover:border-[#C46A42]/40 hover:text-[#C46A42] ${
                        inactive ? "pointer-events-none opacity-40" : ""
                      }`}
                    >
                      <PlusCircle className="h-3.5 w-3.5" />
                      Ajouter une question
                    </Link>
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      </div>
    </div>
  )
}
