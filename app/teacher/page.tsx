import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart, Clock, FileText, PlusCircle, Users } from "lucide-react"
import type { QuizStatus } from "@/lib/types"
import { getQuizCardClassName, MOCK_ASSIGNMENTS, MOCK_QUIZZES } from "@/lib/quiz-utils"

function countAssignedStudents(quizId: string) {
  return MOCK_ASSIGNMENTS.filter((a) => a.quizId === quizId).length
}

function statusBadgeClass(status: QuizStatus) {
  if (status === "Actif") return "bg-green-100 text-green-800 hover:bg-green-100"
  if (status === "Expiré") return "bg-orange-100 text-orange-800"
  return ""
}

export default function TeacherDashboard() {
  const quizzes = MOCK_QUIZZES.slice(0, 4)

  return (
    <div className="p-8 max-w-6xl mx-auto w-full space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Tableau de bord</h1>
          <p className="text-slate-500 mt-1">Gérez vos quiz et analysez les résultats de vos élèves.</p>
        </div>
        <Link href="/teacher/quiz/new">
          <Button size="lg" className="gap-2 shadow-md">
            <PlusCircle className="h-5 w-5" />
            Créer un nouveau quiz
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 flex items-center gap-2">
              <FileText className="h-4 w-4" /> Quiz Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">{MOCK_QUIZZES.length}</div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 flex items-center gap-2">
              <Users className="h-4 w-4" /> Affectations actives
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">{MOCK_ASSIGNMENTS.length}</div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 flex items-center gap-2">
              <BarChart className="h-4 w-4" /> Moyenne Globale
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">14.2<span className="text-lg font-normal text-slate-400">/20</span></div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-slate-800 mb-6">Vos Quiz Récents</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <Card
              key={quiz.id}
              className={getQuizCardClassName(
                quiz.status,
                "flex flex-col border-slate-100 shadow-sm hover:shadow-md transition-shadow"
              )}
            >
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge
                    variant={quiz.status === "Actif" ? "default" : "secondary"}
                    className={statusBadgeClass(quiz.status)}
                  >
                    {quiz.status}
                  </Badge>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {quiz.durationMinutes} min
                  </span>
                </div>
                <CardTitle className="text-lg line-clamp-1">{quiz.title}</CardTitle>
                <CardDescription>
                  Notation {quiz.gradingSystem === "canadien" ? "Canadienne" : "Standard"}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Users className="h-4 w-4 text-slate-400" />
                  <span>{countAssignedStudents(quiz.id)} étudiant(s) affecté(s)</span>
                </div>
                <p className="mt-2 text-xs text-slate-400">
                  Expire le {new Date(quiz.expiresAt).toLocaleDateString("fr-FR")}
                </p>
              </CardContent>
              <CardFooter className="pt-4 border-t border-slate-50 gap-2">
                <Link href={`/teacher/quiz/${quiz.id}/results`} className="w-full">
                  <Button variant="outline" className="w-full">
                    <BarChart className="h-4 w-4 mr-2" /> Résultats
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
