"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Playfair_Display } from "next/font/google"
import { ArrowRight, Check, X } from "lucide-react"
import { QuizTimer } from "@/components/quiz-timer"
import { quizAnswerSchema, type QuizAnswerFormValues } from "@/lib/schemas"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import {
  canStudentAccessQuiz,
  calculateScore,
  CURRENT_STUDENT_ID,
  getResumeQuestionIndex,
  MOCK_ASSIGNMENTS,
  MOCK_QUIZZES,
} from "@/lib/quiz-utils"
import { generateId } from "@/lib/app-context"
import {
  loadSession,
  saveSession,
  saveResponse,
  loadResponses,
  clearSession,
} from "@/lib/session-storage"
import type { Quiz, QuizSession } from "@/lib/types"
import { cn } from "@/lib/utils"

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700"],
})

export default function QuizInterfacePage() {
  const router = useRouter()
  const params = useParams()
  const quizId = params.id as string

  const quiz = MOCK_QUIZZES.find((q) => q.id === quizId) as Quiz | undefined
  const [session, setSession] = useState<QuizSession | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [showFeedback, setShowFeedback] = useState(false)
  const [timeUp, setTimeUp] = useState(false)
  const [initialized, setInitialized] = useState(false)

  const form = useForm<QuizAnswerFormValues>({
    resolver: zodResolver(quizAnswerSchema),
    defaultValues: { selectedChoiceIndex: null },
  })

  const selectedIndex = form.watch("selectedChoiceIndex")

  useEffect(() => {
    if (!quiz) return

    if (!canStudentAccessQuiz(CURRENT_STUDENT_ID, quizId, MOCK_ASSIGNMENTS)) {
      router.push("/student")
      return
    }

    const existing = loadSession(quizId, CURRENT_STUDENT_ID)
    if (existing) {
      setSession(existing)
      setCurrentQuestionIndex(getResumeQuestionIndex(existing, quiz))
    } else {
      const newSession: QuizSession = {
        id: generateId(),
        userId: CURRENT_STUDENT_ID,
        quizId,
        startedAt: new Date(),
        currentQuestionId: quiz.questions[0]?.id ?? null,
        status: "en_cours",
        score: 0,
      }
      saveSession(newSession)
      setSession(newSession)
    }
    setInitialized(true)
  }, [quiz, quizId, router])

  if (!quiz || !initialized || !session) {
    return (
      <div className="flex flex-1 items-center justify-center bg-[#F9F7F2] p-8 text-[#707070]">
        Chargement du quiz...
      </div>
    )
  }

  const question = quiz.questions[currentQuestionIndex]
  const totalQuestions = quiz.questions.length
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1
  const correctIndex = question.choices.findIndex((c) => c.isCorrect)

  const finishQuiz = () => {
    const allResponses = loadResponses(session.id)
    const score = calculateScore(allResponses, quiz, quiz.gradingSystem)
    const finished: QuizSession = {
      ...session,
      status: "termine",
      score,
      currentQuestionId: null,
    }
    saveSession(finished)
    clearSession(quizId, CURRENT_STUDENT_ID)
    router.push(`/student/quiz/${quizId}/result`)
  }

  const advanceQuestion = (data: QuizAnswerFormValues) => {
    if (data.selectedChoiceIndex === null) return

    const selectedChoice = question.choices[data.selectedChoiceIndex]

    saveResponse({
      id: generateId(),
      sessionId: session.id,
      questionId: question.id,
      answerId: selectedChoice.id,
      answeredAt: new Date(),
    })

    if (isLastQuestion) {
      finishQuiz()
    } else {
      const nextIndex = currentQuestionIndex + 1
      const updatedSession: QuizSession = {
        ...session,
        currentQuestionId: quiz.questions[nextIndex].id,
      }
      saveSession(updatedSession)
      setSession(updatedSession)
      setCurrentQuestionIndex(nextIndex)
      setShowFeedback(false)
      form.reset({ selectedChoiceIndex: null })
    }
  }

  const handleSubmit = (data: QuizAnswerFormValues) => {
    if (data.selectedChoiceIndex === null || timeUp) return

    if (!showFeedback) {
      setShowFeedback(true)
      return
    }

    advanceQuestion(data)
  }

  const handleTimeUp = () => {
    setTimeUp(true)
    finishQuiz()
  }

  const getChoiceStyles = (index: number) => {
    const letter = String.fromCharCode(65 + index)
    const isSelected = selectedIndex === index
    const isCorrect = index === correctIndex

    if (!showFeedback) {
      return {
        letter,
        container: cn(
          "flex w-full items-center gap-4 rounded-2xl border bg-white px-5 py-4 text-left transition-all",
          isSelected
            ? "border-[#4DA091]/50 shadow-sm"
            : "border-[#E8E4DC] hover:border-[#4DA091]/30"
        ),
        badge: cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-semibold",
          isSelected ? "bg-[#E2EDE7] text-[#4DA091]" : "bg-[#F0EDE6] text-[#707070]"
        ),
        icon: null as "check" | "x" | null,
      }
    }

    if (isCorrect) {
      return {
        letter,
        container: "flex w-full items-center gap-4 rounded-2xl border border-[#4DA091] bg-[#E2EDE7] px-5 py-4 text-left",
        badge: "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#4DA091] text-white",
        icon: "check" as const,
      }
    }

    if (isSelected && !isCorrect) {
      return {
        letter,
        container: "flex w-full items-center gap-4 rounded-2xl border border-[#D32F2F] bg-[#FDECEC] px-5 py-4 text-left",
        badge: "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#D32F2F] text-white",
        icon: "x" as const,
      }
    }

    return {
      letter,
      container: "flex w-full items-center gap-4 rounded-2xl border border-[#E8E4DC] bg-white px-5 py-4 text-left opacity-80",
      badge: "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F0EDE6] text-[#707070] text-sm font-semibold",
      icon: null as "check" | "x" | null,
    }
  }

  return (
    <div className="flex min-h-screen flex-1 flex-col bg-[#F9F7F2]">
      <header className="border-b border-[#E8E4DC] px-6 py-6 md:px-10 md:py-8">
        <div className="mx-auto flex max-w-4xl items-start justify-between gap-6">
          <div>
            <h1 className={`${playfair.className} text-xl font-bold text-[#2D2D2D] md:text-2xl`}>
              {quiz.title}
            </h1>
            <p className="mt-1 text-sm text-[#707070]">
              Question {currentQuestionIndex + 1} sur {totalQuestions}
            </p>
          </div>
          <QuizTimer
            durationMinutes={quiz.durationMinutes}
            onTimeUp={handleTimeUp}
            variant="circular"
          />
        </div>
        <div className="mx-auto mt-6 max-w-4xl">
          <div className="h-1 w-full overflow-hidden rounded-full bg-[#E8E4DC]">
            <div
              className="h-full rounded-full bg-[#4DA091] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-6 py-10 md:px-10 md:py-14">
        {timeUp && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Le temps est écoulé. Votre session a été clôturée automatiquement.
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-1 flex-col">
            <div className="flex flex-1 flex-col items-center justify-center">
              <p className="mb-6 text-xs font-bold tracking-widest text-[#D98466]">
                {question.points} POINT{question.points > 1 ? "S" : ""}
              </p>

              <h2
                className={`${playfair.className} mb-12 max-w-3xl text-center text-2xl font-bold leading-snug text-[#2D2D2D] md:text-3xl`}
                dangerouslySetInnerHTML={{ __html: question.text }}
              />

              <FormField
                control={form.control}
                name="selectedChoiceIndex"
                render={({ field }) => (
                  <FormItem className="w-full max-w-2xl">
                    <FormControl>
                      <div className="space-y-3">
                        {question.choices.map((option, index) => {
                          const styles = getChoiceStyles(index)

                          return (
                            <button
                              key={option.id}
                              type="button"
                              disabled={showFeedback || timeUp}
                              onClick={() => field.onChange(index)}
                              className={styles.container}
                            >
                              <span className={styles.badge}>
                                {styles.icon === "check" ? (
                                  <Check className="h-4 w-4" />
                                ) : styles.icon === "x" ? (
                                  <X className="h-4 w-4" />
                                ) : (
                                  styles.letter
                                )}
                              </span>
                              <span className="text-base text-[#2D2D2D]">{option.text}</span>
                            </button>
                          )
                        })}
                      </div>
                    </FormControl>
                    <FormMessage className="mt-4 text-center" />
                  </FormItem>
                )}
              />
            </div>

            <div className="mt-10 flex justify-end pt-6">
              <button
                type="submit"
                disabled={selectedIndex === null || timeUp}
                className={cn(
                  "flex items-center gap-2 rounded-2xl px-8 py-3.5 text-sm font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-50",
                  showFeedback ? "bg-[#4DA091] text-white hover:opacity-90" : "bg-[#D6CDBA] text-white hover:opacity-90"
                )}
              >
                <ArrowRight className="h-4 w-4" />
                {isLastQuestion && showFeedback ? "Terminer le quiz" : "Valider et continuer"}
              </button>
            </div>
          </form>
        </Form>
      </main>
    </div>
  )
}
