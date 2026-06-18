"use client"

import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Playfair_Display } from "next/font/google"
import { ArrowLeft, Plus, Save } from "lucide-react"
import { addQuestionSchema, type AddQuestionFormValues } from "@/lib/schemas"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { isQuizInactive, MOCK_QUIZZES, resolveQuizStatus } from "@/lib/quiz-utils"
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

export default function AddQuestionPage() {
  const params = useParams()
  const router = useRouter()
  const quizId = params.id as string

  const quiz = MOCK_QUIZZES.find((q) => q.id === quizId)
  const status = quiz ? resolveQuizStatus(quiz) : null
  const inactive = status ? isQuizInactive(status) : true

  const form = useForm<AddQuestionFormValues>({
    resolver: zodResolver(addQuestionSchema),
    defaultValues: {
      text: "",
      points: 1,
      penaltyPoints: quiz?.gradingSystem === "canadien" ? 0.25 : 0,
      choices: [
        defaultChoice(),
        defaultChoice(),
        defaultChoice(),
        { ...defaultChoice(), isCorrect: true },
      ],
    },
  })

  const setCorrectChoice = (cIndex: number) => {
    const choices = form.getValues("choices")
    choices.forEach((_, i) => {
      form.setValue(`choices.${i}.isCorrect`, i === cIndex)
    })
  }

  const onSubmit = (data: AddQuestionFormValues) => {
    console.log(`Question ajoutée au quiz ${quizId}:`, data)
    router.push("/teacher/add-question")
  }

  if (!quiz) {
    return (
      <div className="flex flex-1 items-center justify-center px-6 py-16 text-[#707070]">
        Quiz introuvable.
      </div>
    )
  }

  if (inactive) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-16 text-[#707070]">
        <p>Ce quiz est terminé ou expiré — ajout de questions impossible.</p>
        <Link href="/teacher/add-question" className="text-sm font-semibold text-[#C46A42]">
          Retour à la gestion des quiz
        </Link>
      </div>
    )
  }

  return (
    <div className="flex-1 bg-[#F9F7F2] px-6 py-8 md:px-10 md:py-10">
      <div className="mx-auto max-w-3xl space-y-8">
        <header className="flex items-start gap-4">
          <Link
            href="/teacher/add-question"
            className="mt-1 flex h-10 w-10 items-center justify-center rounded-xl border border-[#E8E4DC] bg-white text-[#707070] transition-colors hover:border-[#C46A42]/40 hover:text-[#C46A42]"
            aria-label="Retour"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className={`${playfair.className} text-3xl font-bold text-[#2D2D2D] md:text-4xl`}>
              Ajouter une question
            </h1>
            <p className="mt-1 text-sm text-[#707070]">
              {quiz.title} — {quiz.questions.length} question
              {quiz.questions.length > 1 ? "s" : ""} existante
              {quiz.questions.length > 1 ? "s" : ""}
            </p>
          </div>
        </header>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <section className="rounded-3xl border border-[#E8E4DC] bg-white p-5 shadow-sm md:p-6">
              <div className="mb-6 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F4E1D5]">
                  <Plus className="h-4 w-4 text-[#C46A42]" />
                </div>
                <h2 className="text-lg font-semibold text-[#2D2D2D]">Nouvelle question</h2>
              </div>

              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem className="mb-5">
                    <FormLabel className="text-sm font-semibold text-[#2D2D2D]">
                      Énoncé
                    </FormLabel>
                    <FormControl>
                      <RichTextEditor
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Rédigez l'énoncé de la question..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="points"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-[#2D2D2D]">
                        Points (bonne réponse)
                      </FormLabel>
                      <FormControl>
                        <input
                          {...field}
                          type="number"
                          step="0.25"
                          min={0.25}
                          className="w-full rounded-xl border border-[#E8E4DC] bg-[#F9F7F2] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#C46A42]/20"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {quiz.gradingSystem === "canadien" && (
                  <FormField
                    control={form.control}
                    name="penaltyPoints"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-[#2D2D2D]">
                          Pénalité (mauvaise réponse)
                        </FormLabel>
                        <FormControl>
                          <input
                            {...field}
                            type="number"
                            step="0.25"
                            min={0}
                            className="w-full rounded-xl border border-[#E8E4DC] bg-[#F9F7F2] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#C46A42]/20"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <p className="mb-3 text-sm font-semibold text-[#2D2D2D]">Choix de réponse</p>
              <div className="grid gap-2">
                {[0, 1, 2, 3].map((cIndex) => (
                  <div key={cIndex} className="flex items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F0EDE6] text-sm font-semibold text-[#707070]">
                      {String.fromCharCode(65 + cIndex)}
                    </span>
                    <FormField
                      control={form.control}
                      name={`choices.${cIndex}.text`}
                      render={({ field: cField }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <input
                              {...cField}
                              placeholder={`Option ${cIndex + 1}`}
                              className="w-full rounded-xl border border-[#E8E4DC] bg-[#F9F7F2] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#C46A42]/20"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <input
                      type="radio"
                      name="correct-choice"
                      checked={form.watch(`choices.${cIndex}.isCorrect`)}
                      onChange={() => setCorrectChoice(cIndex)}
                      className="h-4 w-4 accent-[#C46A42]"
                      aria-label={`Bonne réponse ${String.fromCharCode(65 + cIndex)}`}
                    />
                  </div>
                ))}
              </div>
            </section>

            <div className="flex justify-end gap-3">
              <Link
                href="/teacher/add-question"
                className="inline-flex items-center justify-center rounded-full border border-[#E8E4DC] bg-white px-6 py-3 text-sm font-semibold text-[#707070] transition-colors hover:bg-[#F9F7F2]"
              >
                Annuler
              </Link>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full bg-[#C46A42] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
              >
                <Save className="h-4 w-4" />
                Ajouter la question
              </button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
