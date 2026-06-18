import Link from "next/link"
import { Playfair_Display } from "next/font/google"
import { ArrowRight, PlusCircle } from "lucide-react"
import {
  isQuizInactive,
  MOCK_QUIZZES,
  resolveQuizStatus,
} from "@/lib/quiz-utils"

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700"],
})

export default function SelectQuizForQuestionPage() {
  const activeQuizzes = MOCK_QUIZZES.filter((q) => {
    if (q.status === "Brouillon") return false
    return !isQuizInactive(resolveQuizStatus(q))
  })

  return (
    <div className="flex-1 bg-[#F9F7F2] px-6 py-8 md:px-10 md:py-10">
      <div className="mx-auto max-w-3xl space-y-8">
        <header>
          <h1 className={`${playfair.className} text-3xl font-bold text-[#2D2D2D] md:text-4xl`}>
            Ajouter une question
          </h1>
          <p className="mt-2 text-sm text-[#707070]">
            Sélectionnez le quiz auquel vous souhaitez ajouter une nouvelle question.
          </p>
        </header>

        {activeQuizzes.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#E8E4DC] bg-white/60 px-6 py-16 text-center text-[#707070]">
            Aucun quiz actif disponible. Créez d&apos;abord un quiz.
          </div>
        ) : (
          <div className="space-y-3">
            {activeQuizzes.map((quiz) => (
              <Link
                key={quiz.id}
                href={`/teacher/quiz/${quiz.id}/add-question`}
                className="flex items-center justify-between gap-4 rounded-2xl border border-[#E8E4DC] bg-white px-5 py-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <div>
                  <p className="font-semibold text-[#2D2D2D]">{quiz.title}</p>
                  <p className="mt-1 text-sm text-[#707070]">
                    {quiz.questions.length} question{quiz.questions.length > 1 ? "s" : ""} —{" "}
                    {quiz.durationMinutes} min
                  </p>
                </div>
                <span className="flex shrink-0 items-center gap-1.5 text-sm font-semibold text-[#C46A42]">
                  <PlusCircle className="h-4 w-4" />
                  Ajouter
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
