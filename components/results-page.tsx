"use client"

import { useApp } from "@/lib/app-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Users, TrendingUp, Award } from "lucide-react"

interface ResultsPageProps {
  quizId: string
  onBack: () => void
}

export function ResultsPage({ quizId, onBack }: ResultsPageProps) {
  const { quizzes, sessions } = useApp()
  
  const quiz = quizzes.find((q) => q.id === quizId)
  const quizSessions = sessions.filter((s) => s.quizId === quizId && s.status === "termine")

  if (!quiz) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Quiz non trouvé</p>
      </div>
    )
  }

  const averageScore = quizSessions.length > 0
    ? quizSessions.reduce((acc, s) => acc + s.score, 0) / quizSessions.length
    : 0

  const bestScore = quizSessions.length > 0
    ? Math.max(...quizSessions.map((s) => s.score))
    : 0

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
          <div className="h-6 w-px bg-border" />
          <div>
            <h1 className="font-semibold">{quiz.title}</h1>
            <p className="text-sm text-muted-foreground">Résultats des étudiants</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Participants</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{quizSessions.length}</div>
              <p className="text-xs text-muted-foreground">
                étudiant{quizSessions.length > 1 ? "s" : ""} ont passé le quiz
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Moyenne</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageScore.toFixed(1)}/20</div>
              <p className="text-xs text-muted-foreground">
                note moyenne de la classe
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Meilleure note</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bestScore.toFixed(1)}/20</div>
              <p className="text-xs text-muted-foreground">
                meilleure performance
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Détail des résultats</CardTitle>
            <CardDescription>
              Liste des étudiants ayant passé ce quiz
            </CardDescription>
          </CardHeader>
          <CardContent>
            {quizSessions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <Users className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold">Aucun résultat</h3>
                <p className="text-muted-foreground">
                  Aucun étudiant n&apos;a encore passé ce quiz
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {quiz.questions.length} question(s) · Notation {quiz.gradingSystem}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Étudiant</TableHead>
                    <TableHead>Date de passage</TableHead>
                    <TableHead className="text-right">Score</TableHead>
                    <TableHead className="text-right">Note /20</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quizSessions.map((session) => {
                    const total = quiz.questions.length
                    const note = total > 0 ? (session.score / total) * 20 : 0
                    const noteColor = note >= 10 ? "default" : "destructive"
                    
                    return (
                      <TableRow key={session.id}>
                        <TableCell className="font-medium">
                          Étudiant {session.userId}
                        </TableCell>
                        <TableCell>
                          {new Date(session.startedAt).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </TableCell>
                        <TableCell className="text-right">
                          {session.score}/{total}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant={noteColor}>
                            {note.toFixed(1)}/20
                          </Badge>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
