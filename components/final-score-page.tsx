"use client"

import { QuizSession } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, XCircle, Home } from "lucide-react"

interface FinalScorePageProps {
  session: QuizSession
  totalQuestions: number
  onBackToHome: () => void
}

export function FinalScorePage({ session, totalQuestions, onBackToHome }: FinalScorePageProps) {
  const note = (session.score / totalQuestions) * 20
  const isPassing = note >= 10
  const percentage = totalQuestions > 0 ? (session.score / totalQuestions) * 100 : 0

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md overflow-hidden">
        <div
          className={`p-8 text-center ${
            isPassing ? "bg-accent" : "bg-destructive"
          }`}
        >
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/20">
            {isPassing ? (
              <CheckCircle2 className="h-12 w-12 text-accent-foreground" />
            ) : (
              <XCircle className="h-12 w-12 text-destructive-foreground" />
            )}
          </div>
          <h1 className={`text-2xl font-bold ${isPassing ? "text-accent-foreground" : "text-destructive-foreground"}`}>
            {isPassing ? "Félicitations !" : "Quiz terminé"}
          </h1>
          <p className={`mt-1 ${isPassing ? "text-accent-foreground/80" : "text-destructive-foreground/80"}`}>
            {isPassing
              ? "Vous avez réussi le quiz"
              : "Continuez vos efforts"}
          </p>
        </div>
        <CardContent className="p-8">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Votre note</p>
            <div className="text-6xl font-bold tracking-tight text-foreground">
              {note.toFixed(0)}
              <span className="text-2xl text-muted-foreground">/20</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Score : {session.score} / {totalQuestions} question{totalQuestions > 1 ? "s" : ""}
            </p>
          </div>

          <div className="mt-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progression</span>
              <span className="font-medium">{percentage.toFixed(0)}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-muted">
              <div
                className={`h-full transition-all duration-500 ${
                  isPassing ? "bg-accent" : "bg-destructive"
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 rounded-lg bg-muted p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-accent">{session.score}</p>
              <p className="text-xs text-muted-foreground">Correctes</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-destructive">
                {totalQuestions - session.score}
              </p>
              <p className="text-xs text-muted-foreground">Incorrectes</p>
            </div>
          </div>

          <Button onClick={onBackToHome} className="mt-6 w-full">
            <Home className="mr-2 h-4 w-4" />
            Retour à l&apos;accueil
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
