"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, History, PlayCircle } from "lucide-react"
import {
  CURRENT_STUDENT_ID,
  getAssignedQuizzesForStudent,
  getQuizCardClassName,
  isQuizInactive,
  MOCK_ASSIGNMENTS,
  MOCK_QUIZZES,
} from "@/lib/quiz-utils"

export default function StudentHomePage() {
  const router = useRouter()
  const assignedQuizzes = getAssignedQuizzesForStudent(
    CURRENT_STUDENT_ID,
    MOCK_QUIZZES,
    MOCK_ASSIGNMENTS
  )

  const activeQuizzes = assignedQuizzes.filter((q) => !isQuizInactive(q.status))
  const inactiveQuizzes = assignedQuizzes.filter((q) => isQuizInactive(q.status))

  return (
    <div className="flex-1 p-4 md:p-8 max-w-5xl mx-auto w-full space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Mes évaluations</h1>
        <p className="text-slate-500">
          Quiz qui vous ont été assignés directement par votre enseignant — aucun code requis.
        </p>
      </div>

      {assignedQuizzes.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-16 text-center text-slate-500">
            Aucun quiz ne vous a encore été affecté.
          </CardContent>
        </Card>
      ) : (
        <>
          {activeQuizzes.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-800">Quiz disponibles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeQuizzes.map((quiz) => (
                  <Card key={quiz.id} className="border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start gap-2">
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          {quiz.status}
                        </Badge>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {quiz.durationMinutes} min
                        </span>
                      </div>
                      <CardTitle className="text-lg">{quiz.title}</CardTitle>
                      <CardDescription>
                        {quiz.questions.length} question{quiz.questions.length > 1 ? "s" : ""} ·
                        Notation {quiz.gradingSystem === "canadien" ? "Canadienne" : "Standard"}
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="pt-0">
                      <Button
                        className="w-full gap-2"
                        onClick={() => router.push(`/student/quiz/${quiz.id}`)}
                      >
                        <PlayCircle className="h-4 w-4" />
                        Commencer le quiz
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {inactiveQuizzes.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-800">Quiz terminés ou expirés</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {inactiveQuizzes.map((quiz) => (
                  <Card
                    key={quiz.id}
                    className={getQuizCardClassName(quiz.status, "border-slate-100 shadow-sm")}
                  >
                    <CardHeader>
                      <Badge variant="secondary">{quiz.status}</Badge>
                      <CardTitle className="text-lg">{quiz.title}</CardTitle>
                      <CardDescription>Quiz inactif — grayscale</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      <div className="pt-4 border-t border-slate-100">
        <Link href="/student/results">
          <Button variant="ghost" className="text-slate-500 hover:text-slate-900 gap-2">
            <History className="h-4 w-4" />
            Historique de mes notes
          </Button>
        </Link>
      </div>
    </div>
  )
}
