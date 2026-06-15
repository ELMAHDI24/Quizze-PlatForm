"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, Plus, Save, Trash2 } from "lucide-react"
import { quizCreationSchema, type QuizCreationFormValues } from "@/lib/schemas"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { StudentAssignment } from "@/components/student-assignment"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const defaultChoice = () => ({ text: "", isCorrect: false })

const defaultQuestion = () => ({
  text: "",
  choices: [
    defaultChoice(),
    defaultChoice(),
    defaultChoice(),
    { ...defaultChoice(), isCorrect: true },
  ],
})

export default function NewQuizPage() {
  const router = useRouter()

  const form = useForm<QuizCreationFormValues>({
    resolver: zodResolver(quizCreationSchema),
    defaultValues: {
      title: "",
      description: "",
      durationMinutes: 30,
      expiresAt: "",
      gradingSystem: "standard",
      questionCount: 1,
      assignedStudentIds: [],
      questions: [defaultQuestion()],
    },
  })

  const questionCount = form.watch("questionCount")
  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "questions",
  })

  useEffect(() => {
    const count = Math.max(1, Math.min(50, Number(questionCount) || 1))
    const current = form.getValues("questions")
    if (current.length < count) {
      const toAdd = count - current.length
      for (let i = 0; i < toAdd; i++) append(defaultQuestion())
    } else if (current.length > count) {
      replace(current.slice(0, count))
    }
  }, [questionCount, append, replace, form])

  const onSubmit = (data: QuizCreationFormValues) => {
    console.log("Quiz créé (sans code d'accès):", data)
    router.push("/teacher")
  }

  const setCorrectChoice = (qIndex: number, cIndex: number) => {
    const questions = form.getValues("questions")
    questions[qIndex].choices.forEach((_, i) => {
      form.setValue(`questions.${qIndex}.choices.${i}.isCorrect`, i === cIndex)
    })
  }

  return (
    <div className="p-8 max-w-4xl mx-auto w-full space-y-8">
      <div className="flex items-center gap-4 mb-2">
        <Link href="/teacher">
          <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-900">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Créer un nouveau quiz</h1>
          <p className="text-slate-500 mt-1">
            Affectation directe des étudiants — sans code d&apos;accès.
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="border-none shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="text-xl text-slate-800">Informations Générales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titre du Quiz</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Évaluation de mi-trimestre - Histoire" className="h-12" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <RichTextEditor value={field.value} onChange={field.onChange} placeholder="Description du quiz..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="durationMinutes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Durée totale (minutes)</FormLabel>
                      <FormControl>
                        <Input type="number" min={5} max={180} className="h-12" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="expiresAt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date d&apos;expiration</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" className="h-12" {...field} />
                      </FormControl>
                      <FormDescription>RG-10 : passage auto Actif → Terminé</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="gradingSystem"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Système de notation</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Choisir le système" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="canadien">Canadien (pénalités)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>RG-11 : le mode Canadien applique des points négatifs</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="questionCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre de questions à générer</FormLabel>
                      <FormControl>
                        <Input type="number" min={1} max={50} className="h-12" {...field} />
                      </FormControl>
                      <FormDescription>Génère N questions vides d&apos;un coup</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="assignedStudentIds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Affectation nominative des étudiants</FormLabel>
                    <FormControl>
                      <StudentAssignment selectedIds={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-800">Questions ({fields.length})</h2>
              <Button
                type="button"
                variant="outline"
                className="gap-2"
                onClick={() => {
                  append(defaultQuestion())
                  form.setValue("questionCount", fields.length + 1)
                }}
              >
                <Plus className="h-4 w-4" /> Ajouter une question
              </Button>
            </div>

            {fields.map((field, qIndex) => (
              <Card key={field.id} className="border-slate-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary/60" />
                <CardHeader className="pb-4 flex flex-row items-start justify-between">
                  <div className="w-full pr-4 space-y-2">
                    <FormLabel>Question {qIndex + 1}</FormLabel>
                    <FormField
                      control={form.control}
                      name={`questions.${qIndex}.text`}
                      render={({ field: qField }) => (
                        <FormItem>
                          <FormControl>
                            <RichTextEditor value={qField.value} onChange={qField.onChange} placeholder="Énoncé..." />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        remove(qIndex)
                        form.setValue("questionCount", fields.length - 1)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {[0, 1, 2, 3].map((cIndex) => (
                      <div key={cIndex} className="flex items-center gap-3">
                        <span className="w-8 h-8 flex items-center justify-center rounded-full border text-sm font-medium">
                          {String.fromCharCode(65 + cIndex)}
                        </span>
                        <FormField
                          control={form.control}
                          name={`questions.${qIndex}.choices.${cIndex}.text`}
                          render={({ field: cField }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input placeholder={`Option ${cIndex + 1}`} {...cField} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Checkbox
                          checked={form.watch(`questions.${qIndex}.choices.${cIndex}.isCorrect`)}
                          onCheckedChange={() => setCorrectChoice(qIndex, cIndex)}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-end pt-6 border-t">
            <Button type="submit" size="lg" className="gap-2">
              <Save className="h-5 w-5" />
              Publier le quiz
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
