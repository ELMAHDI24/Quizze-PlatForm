import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Adresse email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  isStudent: z.boolean().default(false),
  rememberSession: z.boolean().default(false),
})

export type LoginFormValues = z.infer<typeof loginSchema>

const choiceSchema = z.object({
  text: z.string().min(1, "Le choix ne peut pas être vide"),
  isCorrect: z.boolean(),
})

const questionSchema = z.object({
  text: z
    .string()
    .min(1, "L'énoncé de la question est requis")
    .refine((val) => val.replace(/<[^>]*>/g, "").trim().length > 0, {
      message: "L'énoncé de la question est requis",
    }),
  choices: z
    .array(choiceSchema)
    .length(4, "Chaque question doit avoir 4 choix")
    .refine((choices) => choices.filter((c) => c.isCorrect).length === 1, {
      message: "Une seule bonne réponse doit être sélectionnée",
    }),
})

export const quizCreationSchema = z.object({
  title: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
  description: z.string().optional(),
  durationMinutes: z.coerce
    .number()
    .min(5, "La durée minimale est de 5 minutes")
    .max(180, "La durée maximale est de 180 minutes"),
  expiresAt: z.string().min(1, "La date d'expiration est requise"),
  gradingSystem: z.enum(["standard", "canadien"], {
    required_error: "Sélectionnez un système de notation",
  }),
  questionCount: z.coerce
    .number()
    .min(1, "Au moins 1 question")
    .max(50, "Maximum 50 questions"),
  assignedStudentIds: z.array(z.string()).min(1, "Sélectionnez au moins un étudiant"),
  questions: z
    .array(questionSchema)
    .min(1, "Ajoutez au moins une question")
    .refine(
      (questions) =>
        questions.every(
          (q) =>
            q.text.replace(/<[^>]*>/g, "").trim().length > 0 &&
            q.choices.every((c) => c.text.trim().length > 0)
        ),
      { message: "RG-12 : Toutes les questions générées doivent être entièrement remplies avant publication" }
    ),
})

export type QuizCreationFormValues = z.infer<typeof quizCreationSchema>

export const quizAnswerSchema = z
  .object({
    selectedChoiceIndex: z.number().min(0).nullable(),
  })
  .refine((data) => data.selectedChoiceIndex !== null, {
    message: "Veuillez sélectionner une réponse",
    path: ["selectedChoiceIndex"],
  })

export type QuizAnswerFormValues = z.infer<typeof quizAnswerSchema>
