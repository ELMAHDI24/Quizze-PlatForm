"use client"

import { useState } from "react"
import { useApp } from "@/lib/app-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { LogOut } from "lucide-react"

interface StudentHomeProps {
  onJoinQuiz: () => void
}

export function StudentHome({ onJoinQuiz }: StudentHomeProps) {
  const { user, quizzes, setCurrentQuiz, logout } = useApp()
  const [accessCode, setAccessCode] = useState("")
  const [error, setError] = useState("")

  const handleJoinQuiz = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const code = accessCode.trim().toUpperCase()
    if (!code) {
      setError("Veuillez entrer un code d'accès")
      return
    }

    const quiz = quizzes.find((q) => q.accessCode === code)
    if (!quiz) {
      setError("Code d'accès invalide. Vérifiez auprès de votre enseignant.")
      return
    }

    setCurrentQuiz(quiz)
    onJoinQuiz()
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
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
              <p className="text-sm text-muted-foreground">Espace Étudiant</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{user?.name}</span>
            </span>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-8 pb-8">
            <div className="text-center mb-8">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-8 w-8 text-primary"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                  <path d="M7 7h10" />
                  <path d="M7 12h10" />
                  <path d="M7 17h10" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold tracking-tight">
                Rejoindre un examen
              </h2>
              <p className="mt-2 text-muted-foreground">
                Entrez le code d&apos;accès fourni par votre enseignant
              </p>
            </div>

            <form onSubmit={handleJoinQuiz} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Code d'accès (ex: JS2024)"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                  className="text-center text-2xl font-mono tracking-widest h-14 uppercase"
                  maxLength={8}
                />
              </div>

              {error && (
                <p className="text-sm text-destructive text-center">{error}</p>
              )}

              <Button type="submit" className="w-full h-12 text-base">
                Rejoindre
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
