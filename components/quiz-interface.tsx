"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useApp, generateId } from "@/lib/app-context"
import { QuizSession } from "@/lib/types"
import { calculateScore } from "@/lib/quiz-utils"
import { saveResponse, loadResponses } from "@/lib/session-storage"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { QuizTimer } from "@/components/quiz-timer"
import { quizAnswerSchema, type QuizAnswerFormValues } from "@/lib/schemas"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"

interface QuizInterfaceProps {
  onComplete: (session: QuizSession) => void
}

export function QuizInterface({ onComplete }: QuizInterfaceProps) {
  const { user, currentQuiz, addSession, addResponse } = useApp()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [sessionId] = useState(() => generateId())
  const [timeUp, setTimeUp] = useState(false)

  const form = useForm<QuizAnswerFormValues>({
    resolver: zodResolver(quizAnswerSchema),
    defaultValues: { selectedChoiceIndex: null },
  })

  if (!currentQuiz) {
    return null
  }

  const currentQuestion = currentQuiz.questions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === currentQuiz.questions.length - 1
  const progress = ((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100
  const durationMinutes = currentQuiz.durationMinutes ?? 30

  const finishQuiz = () => {
    const allResponses = loadResponses(sessionId)
    const score = calculateScore(allResponses, currentQuiz, currentQuiz.gradingSystem)
    const session: QuizSession = {
      id: sessionId,
      userId: user?.id || "student",
      quizId: currentQuiz.id,
      startedAt: new Date(),
      currentQuestionId: null,
      status: "termine",
      score,
    }
    addSession(session)
    onComplete(session)
  }

  const handleTimeUp = () => {
    setTimeUp(true)
    finishQuiz()
  }

  const handleNext = (data: QuizAnswerFormValues) => {
    if (data.selectedChoiceIndex === null || timeUp) return

    const selectedChoice = currentQuestion.choices[data.selectedChoiceIndex]
    const response = {
      id: generateId(),
      sessionId,
      questionId: currentQuestion.id,
      answerId: selectedChoice.id,
      answeredAt: new Date(),
    }
    saveResponse(response)
    addResponse(response)

    if (isLastQuestion) {
      finishQuiz()
    } else {
      setCurrentQuestionIndex((prev) => prev + 1)
      form.reset({ selectedChoiceIndex: null })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto max-w-3xl px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
            <div>
              <h1 className="font-semibold">{currentQuiz.title}</h1>
              <p className="text-sm text-muted-foreground">
                Question {currentQuestionIndex + 1} sur {currentQuiz.questions.length}
              </p>
            </div>
            <QuizTimer
              durationMinutes={durationMinutes}
              onTimeUp={handleTimeUp}
              className="w-full sm:w-56"
            />
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8">
        {timeUp && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Le temps est écoulé. Vos réponses ont été soumises automatiquement.
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleNext)}>
            <Card className="overflow-hidden">
              <div className="bg-primary p-6">
                <span className="inline-block rounded-full bg-primary-foreground/20 px-3 py-1 text-xs font-medium text-primary-foreground mb-3">
                  Question {currentQuestionIndex + 1}
                </span>
                <h2
                  className="text-xl font-semibold text-primary-foreground leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: currentQuestion.text }}
                />
              </div>
              <CardContent className="p-6">
                <FormField
                  control={form.control}
                  name="selectedChoiceIndex"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="space-y-3">
                          {currentQuestion.choices.map((choice, index) => {
                            const letter = String.fromCharCode(65 + index)
                            const isSelected = field.value === index

                            return (
                              <button
                                key={choice.id}
                                type="button"
                                onClick={() => field.onChange(index)}
                                className={`w-full flex items-center gap-4 rounded-lg border-2 p-4 text-left transition-all ${
                                  isSelected
                                    ? "border-primary bg-primary/5"
                                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                                }`}
                              >
                                <span
                                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                                    isSelected
                                      ? "bg-primary text-primary-foreground"
                                      : "bg-muted text-muted-foreground"
                                  }`}
                                >
                                  {letter}
                                </span>
                                <span className="text-base">{choice.text}</span>
                              </button>
                            )
                          })}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="mt-8 flex justify-end">
                  <Button
                    type="submit"
                    disabled={form.watch("selectedChoiceIndex") === null || timeUp}
                    size="lg"
                    className="min-w-[200px]"
                  >
                    {isLastQuestion ? "Terminer le quiz" : "Question suivante"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </Form>
      </main>
    </div>
  )
}
