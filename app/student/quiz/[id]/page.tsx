"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { QuizTimer } from "@/components/quiz-timer"
import { ChevronRight, RotateCcw } from "lucide-react"
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

export default function QuizInterfacePage() {
  const router = useRouter()
  const params = useParams()
  const quizId = params.id as string

  const quiz = MOCK_QUIZZES.find((q) => q.id === quizId) as Quiz | undefined
  const [session, setSession] = useState<QuizSession | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [timeUp, setTimeUp] = useState(false)
  const [initialized, setInitialized] = useState(false)

  const form = useForm<QuizAnswerFormValues>({
    resolver: zodResolver(quizAnswerSchema),
    defaultValues: { selectedChoiceIndex: null },
  })

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
      <div className="flex-1 flex items-center justify-center p-8 text-slate-500">
        Chargement du quiz...
      </div>
    )
  }

  const question = quiz.questions[currentQuestionIndex]
  const totalQuestions = quiz.questions.length
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1
  const savedCount = loadResponses(session.id).length

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

  const handleNext = (data: QuizAnswerFormValues) => {
    if (data.selectedChoiceIndex === null || timeUp) return

    const selectedChoice = question.choices[data.selectedChoiceIndex]

    // Sauvegarde instantanée à la volée (Student_Response)
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
      form.reset({ selectedChoiceIndex: null })
    }
  }

  const handleTimeUp = () => {
    setTimeUp(true)
    finishQuiz()
  }

  return (
    <div className="flex-1 flex flex-col p-4 md:p-8 max-w-4xl mx-auto w-full">
      <div className="w-full mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800">{quiz.title}</h2>
            <p className="text-slate-500 text-sm">
              Question {currentQuestionIndex + 1} sur {totalQuestions}
              {savedCount > 0 && (
                <span className="ml-2 text-[#4DA091]">
                  · {savedCount} réponse{savedCount > 1 ? "s" : ""} sauvegardée{savedCount > 1 ? "s" : ""} à la volée
                </span>
              )}
            </p>
          </div>
          <QuizTimer
            durationMinutes={quiz.durationMinutes}
            onTimeUp={handleTimeUp}
            className="w-full sm:w-64"
          />
        </div>
        <Progress value={progress} className="h-2 bg-slate-100" />
      </div>

      {currentQuestionIndex > 0 && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
          <RotateCcw className="h-4 w-4 shrink-0" />
          RG-07 : Reprise de session — vous reprenez à la question {currentQuestionIndex + 1}.
          Recommencer depuis le début est bloqué.
        </div>
      )}

      {timeUp && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          RG-09 : Le temps est écoulé. Session clôturée automatiquement.
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleNext)} className="flex-1 flex flex-col">
          <div className="flex-1 flex flex-col justify-center py-8">
            <h1
              className="text-2xl md:text-3xl font-semibold text-slate-900 text-center mb-12 leading-tight"
              dangerouslySetInnerHTML={{ __html: question.text }}
            />

            <FormField
              control={form.control}
              name="selectedChoiceIndex"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto w-full">
                      {question.choices.map((option, index) => (
                        <Card
                          key={option.id}
                          className={`cursor-pointer transition-all border-2 ${
                            field.value === index
                              ? "border-primary bg-primary/5 shadow-md"
                              : "border-slate-100 hover:border-primary/30 hover:bg-slate-50"
                          }`}
                          onClick={() => field.onChange(index)}
                        >
                          <CardContent className="p-6 flex items-center justify-center min-h-[100px]">
                            <span className="text-xl font-medium text-slate-700">{option.text}</span>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage className="text-center mt-4" />
                </FormItem>
              )}
            />
          </div>

          {/* RG-08 : pas de bouton Précédent — uniquement Valider et continuer */}
          <div className="flex justify-center mt-12 pt-8 border-t border-slate-100">
            <Button
              type="submit"
              size="lg"
              disabled={form.watch("selectedChoiceIndex") === null || timeUp}
              className="h-14 px-12 text-lg shadow-lg gap-2 w-full md:w-auto"
            >
              {isLastQuestion ? (
                "Terminer l'examen"
              ) : (
                <>
                  Valider et continuer <ChevronRight className="h-5 w-5" />
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
