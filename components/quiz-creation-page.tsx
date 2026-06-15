"use client"

import { useState } from "react"
import { useApp, generateAccessCode, generateId } from "@/lib/app-context"
import { Question, Choice, Quiz } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft, Plus, Trash2, GripVertical } from "lucide-react"

interface QuizCreationPageProps {
  onBack: () => void
  onQuizCreated: () => void
}

export function QuizCreationPage({ onBack, onQuizCreated }: QuizCreationPageProps) {
  const { user, addQuiz } = useApp()
  const [title, setTitle] = useState("")
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: generateId(),
      text: "",
      choices: [
        { id: generateId(), text: "", isCorrect: true },
        { id: generateId(), text: "", isCorrect: false },
        { id: generateId(), text: "", isCorrect: false },
        { id: generateId(), text: "", isCorrect: false },
      ],
    },
  ])
  const [error, setError] = useState("")

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: generateId(),
        text: "",
        choices: [
          { id: generateId(), text: "", isCorrect: true },
          { id: generateId(), text: "", isCorrect: false },
          { id: generateId(), text: "", isCorrect: false },
          { id: generateId(), text: "", isCorrect: false },
        ],
      },
    ])
  }

  const removeQuestion = (questionId: string) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((q) => q.id !== questionId))
    }
  }

  const updateQuestion = (questionId: string, text: string) => {
    setQuestions(
      questions.map((q) => (q.id === questionId ? { ...q, text } : q))
    )
  }

  const updateChoice = (questionId: string, choiceId: string, text: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              choices: q.choices.map((c) =>
                c.id === choiceId ? { ...c, text } : c
              ),
            }
          : q
      )
    )
  }

  const setCorrectChoice = (questionId: string, choiceId: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              choices: q.choices.map((c) => ({
                ...c,
                isCorrect: c.id === choiceId,
              })),
            }
          : q
      )
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!title.trim()) {
      setError("Veuillez donner un titre à votre quiz")
      return
    }

    for (const question of questions) {
      if (!question.text.trim()) {
        setError("Toutes les questions doivent avoir un énoncé")
        return
      }
      for (const choice of question.choices) {
        if (!choice.text.trim()) {
          setError("Tous les choix de réponse doivent être remplis")
          return
        }
      }
    }

    const newQuiz: Quiz = {
      id: generateId(),
      title: title.trim(),
      accessCode: generateAccessCode(),
      questions,
      createdAt: new Date(),
      teacherId: user?.id || "teacher-1",
    }

    addQuiz(newQuiz)
    onQuizCreated()
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-3xl items-center gap-4 px-4 py-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
          <div className="h-6 w-px bg-border" />
          <h1 className="font-semibold">Créer un nouveau quiz</h1>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations du quiz</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="title">Titre du quiz</Label>
                <Input
                  id="title"
                  placeholder="Ex: Introduction à JavaScript"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Questions</h2>
              <Button type="button" variant="outline" onClick={addQuestion}>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter une question
              </Button>
            </div>

            {questions.map((question, questionIndex) => (
              <Card key={question.id} className="overflow-hidden">
                <CardHeader className="bg-muted/50 pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GripVertical className="h-5 w-5 text-muted-foreground" />
                      <CardTitle className="text-base">
                        Question {questionIndex + 1}
                      </CardTitle>
                    </div>
                    {questions.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeQuestion(question.id)}
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`question-${question.id}`}>
                      Énoncé de la question
                    </Label>
                    <Input
                      id={`question-${question.id}`}
                      placeholder="Tapez votre question ici..."
                      value={question.text}
                      onChange={(e) => updateQuestion(question.id, e.target.value)}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>Choix de réponses</Label>
                    <p className="text-sm text-muted-foreground">
                      Sélectionnez la bonne réponse
                    </p>
                    <RadioGroup
                      value={question.choices.find((c) => c.isCorrect)?.id}
                      onValueChange={(value) => setCorrectChoice(question.id, value)}
                      className="space-y-2"
                    >
                      {question.choices.map((choice, choiceIndex) => (
                        <div
                          key={choice.id}
                          className={`flex items-center gap-3 rounded-lg border p-3 transition-colors ${
                            choice.isCorrect
                              ? "border-accent bg-accent/10"
                              : "hover:bg-muted/50"
                          }`}
                        >
                          <RadioGroupItem value={choice.id} id={choice.id} />
                          <Input
                            placeholder={`Choix ${choiceIndex + 1}`}
                            value={choice.text}
                            onChange={(e) =>
                              updateChoice(question.id, choice.id, e.target.value)
                            }
                            className="border-0 bg-transparent p-0 focus-visible:ring-0"
                          />
                          {choice.isCorrect && (
                            <span className="ml-auto whitespace-nowrap text-xs font-medium text-accent">
                              Bonne réponse
                            </span>
                          )}
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={onBack}>
              Annuler
            </Button>
            <Button type="submit" className="flex-1">
              Créer le quiz
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
