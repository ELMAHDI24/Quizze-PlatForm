"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Playfair_Display } from "next/font/google"
import { BookOpen, Calendar, Clock, Save } from "lucide-react"
import { quizCreationSchema, type QuizCreationFormValues } from "@/lib/schemas"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { StudentAssignment } from "@/components/student-assignment"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700"],
})

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
      durationMinutes: 45,
      expiresAt: "",
      gradingSystem: "standard",
      questionCount: 5,
      assignedStudentIds: [],
      questions: Array.from({ length: 5 }, () => defaultQuestion()),
    },
  })

  const questionCount = form.watch("questionCount")
  const gradingSystem = form.watch("gradingSystem")
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
    <div className="flex-1 bg-[#F9F7F2] px-6 py-8 md:px-10 md:py-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <header>
          <h1 className={`${playfair.className} text-3xl font-bold text-[#2D2D2D] md:text-4xl`}>
            Créer un nouveau quiz
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-[#707070]">
            Définissez les paramètres, puis affectez les étudiants concernés — aucun code à
            générer.
          </p>
        </header>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-start">
              <div className="space-y-5 rounded-3xl border border-[#E8E4DC] bg-white p-5 shadow-sm md:p-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-[#2D2D2D]">
                        Titre du quiz
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <BookOpen className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#707070]" />
                          <input
                            {...field}
                            type="text"
                            placeholder="Ex : Algorithmique — Structures de données"
                            className="w-full rounded-xl border border-[#E8E4DC] bg-[#F9F7F2] py-3.5 pl-12 pr-4 text-sm text-[#2D2D2D] outline-none focus:ring-2 focus:ring-[#C46A42]/20"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="durationMinutes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-[#2D2D2D]">
                          Durée totale (minutes)
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Clock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#707070]" />
                            <input
                              {...field}
                              type="number"
                              min={5}
                              max={180}
                              className="w-full rounded-xl border border-[#E8E4DC] bg-[#F9F7F2] py-3.5 pl-12 pr-4 text-sm text-[#2D2D2D] outline-none focus:ring-2 focus:ring-[#C46A42]/20"
                            />
                          </div>
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
                        <FormLabel className="text-sm font-semibold text-[#2D2D2D]">
                          Date d&apos;expiration
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#707070]" />
                            <input
                              {...field}
                              type="datetime-local"
                              className="w-full rounded-xl border border-[#E8E4DC] bg-[#F9F7F2] py-3.5 pl-12 pr-4 text-sm text-[#2D2D2D] outline-none focus:ring-2 focus:ring-[#C46A42]/20"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="gradingSystem"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-[#2D2D2D]">
                        Système de notation
                      </FormLabel>
                      <div className="flex items-center justify-between rounded-full bg-[#EDE8DF] px-5 py-3">
                        <button
                          type="button"
                          onClick={() => field.onChange("standard")}
                          className={`text-sm transition-colors ${
                            field.value === "standard"
                              ? "font-bold text-[#2D2D2D]"
                              : "font-medium text-[#707070]"
                          }`}
                        >
                          Standard
                        </button>
                        <Switch
                          checked={field.value === "canadien"}
                          onCheckedChange={(checked) =>
                            field.onChange(checked ? "canadien" : "standard")
                          }
                          className="h-6 w-11 shrink-0 border-0 bg-[#4DA091] data-[state=checked]:bg-[#C46A42] data-[state=unchecked]:bg-[#4DA091] [&>span]:size-5 [&>span]:bg-white [&>span]:data-[state=checked]:translate-x-5 [&>span]:data-[state=unchecked]:translate-x-0.5"
                        />
                        <button
                          type="button"
                          onClick={() => field.onChange("canadien")}
                          className={`text-sm transition-colors ${
                            field.value === "canadien"
                              ? "font-bold text-[#2D2D2D]"
                              : "font-medium text-[#707070]"
                          }`}
                        >
                          Canadien (pénalités)
                        </button>
                      </div>
                      {gradingSystem === "canadien" && (
                        <p className="rounded-xl bg-[#FDECEC] px-4 py-3 text-xs text-[#C46A42]">
                          Le système canadien applique des points négatifs pour chaque mauvaise
                          réponse.
                        </p>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="questionCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-[#2D2D2D]">
                        Nombre de questions à générer
                      </FormLabel>
                      <div className="flex items-center gap-4">
                        <FormControl>
                          <Slider
                            min={1}
                            max={20}
                            step={1}
                            value={[Number(field.value) || 1]}
                            onValueChange={(value) => field.onChange(value[0])}
                            className="flex-1 [&_[data-slot=slider-range]]:bg-[#C46A42] [&_[data-slot=slider-thumb]]:size-5 [&_[data-slot=slider-thumb]]:border-[#C46A42] [&_[data-slot=slider-track]]:h-2 [&_[data-slot=slider-track]]:bg-[#E8E4DC]"
                          />
                        </FormControl>
                        <span className="flex h-10 min-w-10 items-center justify-center rounded-xl bg-[#2D2D2D] px-3 text-sm font-bold text-white">
                          {field.value}
                        </span>
                      </div>
                      <p className="text-xs text-[#707070]">
                        {field.value} question{Number(field.value) > 1 ? "s" : ""} vide
                        {Number(field.value) > 1 ? "s" : ""} seront générée
                        {Number(field.value) > 1 ? "s" : ""} — la publication sera bloquée
                        jusqu&apos;à ce qu&apos;elles soient toutes complétées.
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="assignedStudentIds"
                render={({ field }) => (
                  <FormItem className="h-full">
                    <FormControl>
                      <StudentAssignment
                        selectedIds={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <section className="rounded-3xl border border-[#E8E4DC] bg-white p-5 shadow-sm md:p-6">
              <h2 className="mb-6 text-lg font-semibold text-[#2D2D2D]">
                Questions générées ({fields.length})
              </h2>

              <div className="space-y-6">
                {fields.map((field, qIndex) => (
                  <div
                    key={field.id}
                    className="rounded-2xl border border-[#F0EDE6] bg-[#FBFAF7] p-4 md:p-5"
                  >
                    <p className="mb-3 text-sm font-semibold text-[#2D2D2D]">
                      Question {qIndex + 1}
                    </p>
                    <FormField
                      control={form.control}
                      name={`questions.${qIndex}.text`}
                      render={({ field: qField }) => (
                        <FormItem className="mb-4">
                          <FormControl>
                            <RichTextEditor
                              value={qField.value}
                              onChange={qField.onChange}
                              placeholder="Énoncé de la question..."
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid gap-2">
                      {[0, 1, 2, 3].map((cIndex) => (
                        <div key={cIndex} className="flex items-center gap-3">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F0EDE6] text-sm font-semibold text-[#707070]">
                            {String.fromCharCode(65 + cIndex)}
                          </span>
                          <FormField
                            control={form.control}
                            name={`questions.${qIndex}.choices.${cIndex}.text`}
                            render={({ field: cField }) => (
                              <FormItem className="flex-1">
                                <FormControl>
                                  <input
                                    {...cField}
                                    placeholder={`Option ${cIndex + 1}`}
                                    className="w-full rounded-xl border border-[#E8E4DC] bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#C46A42]/20"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <input
                            type="radio"
                            name={`correct-${qIndex}`}
                            checked={form.watch(`questions.${qIndex}.choices.${cIndex}.isCorrect`)}
                            onChange={() => setCorrectChoice(qIndex, cIndex)}
                            className="h-4 w-4 accent-[#C46A42]"
                            aria-label={`Bonne réponse ${String.fromCharCode(65 + cIndex)}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full bg-[#C46A42] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
              >
                <Save className="h-4 w-4" />
                Publier le quiz
              </button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
