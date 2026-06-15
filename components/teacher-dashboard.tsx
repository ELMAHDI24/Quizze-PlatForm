"use client"

import { useApp } from "@/lib/app-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, LogOut, ClipboardCopy, BarChart3 } from "lucide-react"
import { useState } from "react"

interface TeacherDashboardProps {
  onCreateQuiz: () => void
  onViewResults: (quizId: string) => void
}

export function TeacherDashboard({ onCreateQuiz, onViewResults }: TeacherDashboardProps) {
  const { user, quizzes, logout } = useApp()
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const teacherQuizzes = quizzes.filter((quiz) => quiz.teacherId === user?.id || quiz.teacherId === "teacher-1")

  const copyToClipboard = async (code: string) => {
    await navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 text-primary-foreground"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <h1 className="font-semibold">QuizMaster</h1>
              <p className="text-sm text-muted-foreground">Espace Enseignant</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Bonjour, <span className="font-medium text-foreground">{user?.name}</span>
            </span>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Mes Quiz</h2>
            <p className="text-muted-foreground">
              Gérez vos quiz et suivez les résultats de vos étudiants
            </p>
          </div>
          <Button onClick={onCreateQuiz}>
            <Plus className="mr-2 h-4 w-4" />
            Créer un nouveau quiz
          </Button>
        </div>

        {teacherQuizzes.length === 0 ? (
          <Card className="flex flex-col items-center justify-center py-16">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-8 w-8 text-muted-foreground"
              >
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="12" x2="12" y1="18" y2="12" />
                <line x1="9" x2="15" y1="15" y2="15" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold">Aucun quiz créé</h3>
            <p className="mb-4 text-muted-foreground">
              Commencez par créer votre premier quiz
            </p>
            <Button onClick={onCreateQuiz}>
              <Plus className="mr-2 h-4 w-4" />
              Créer un quiz
            </Button>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {teacherQuizzes.map((quiz) => (
              <Card key={quiz.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{quiz.title}</CardTitle>
                      <CardDescription>
                        {quiz.questions.length} question{quiz.questions.length > 1 ? "s" : ""}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary">
                      {new Date(quiz.createdAt).toLocaleDateString("fr-FR")}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Code d&apos;accès
                      </p>
                      <p className="font-mono text-2xl font-bold tracking-widest text-primary">
                        {quiz.accessCode}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(quiz.accessCode)}
                    >
                      <ClipboardCopy className="mr-2 h-4 w-4" />
                      {copiedCode === quiz.accessCode ? "Copié !" : "Copier"}
                    </Button>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => onViewResults(quiz.id)}
                  >
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Voir les résultats
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
