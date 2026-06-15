import type { GradingSystem, Quiz, QuizStatus, QuizSession, StudentResponse } from "@/lib/types"

export function isQuizInactive(status: QuizStatus): boolean {
  return status === "Terminé" || status === "Expiré"
}

export function getQuizCardClassName(status: QuizStatus, baseClass = ""): string {
  const inactive = isQuizInactive(status)
  return [baseClass, inactive ? "grayscale opacity-70" : ""].filter(Boolean).join(" ")
}

/** RG-10 : passage automatique Actif → Terminé selon expires_at */
export function resolveQuizStatus(quiz: Quiz): QuizStatus {
  if (quiz.status === "Brouillon") return "Brouillon"
  if (new Date() > quiz.expiresAt) return "Terminé"
  return quiz.status === "Terminé" ? "Terminé" : "Actif"
}

/** RG-05 : l'étudiant ne voit que les quiz auxquels il est affecté */
export function getAssignedQuizzesForStudent(
  studentId: string,
  quizzes: Quiz[],
  assignments: { quizId: string; userId: string }[]
): Quiz[] {
  const assignedQuizIds = new Set(
    assignments.filter((a) => a.userId === studentId).map((a) => a.quizId)
  )
  return quizzes
    .filter((q) => assignedQuizIds.has(q.id))
    .map((q) => ({ ...q, status: resolveQuizStatus(q) }))
}

export function canStudentAccessQuiz(
  studentId: string,
  quizId: string,
  assignments: { quizId: string; userId: string }[]
): boolean {
  return assignments.some((a) => a.userId === studentId && a.quizId === quizId)
}

/** RG-11 : notation canadienne avec pénalités */
export function calculateScore(
  responses: StudentResponse[],
  quiz: Quiz,
  gradingSystem: GradingSystem
): number {
  let score = 0
  for (const response of responses) {
    const question = quiz.questions.find((q) => q.id === response.questionId)
    if (!question) continue
    const choice = question.choices.find((c) => c.id === response.answerId)
    if (!choice) continue

    if (choice.isCorrect) {
      score += question.points
    } else if (gradingSystem === "canadien") {
      score -= question.penaltyPoints
    }
  }
  return Math.max(0, score)
}

/** RG-07 : reprise à la dernière question non validée */
export function getResumeQuestionIndex(
  session: QuizSession | null,
  quiz: Quiz
): number {
  if (!session?.currentQuestionId) return 0
  const index = quiz.questions.findIndex((q) => q.id === session.currentQuestionId)
  return index >= 0 ? index : 0
}

export const MOCK_STUDENTS = [
  { id: "s1", name: "Sophie Martin", email: "sophie.martin@ecole.fr" },
  { id: "s2", name: "Lucas Bernard", email: "lucas.bernard@ecole.fr" },
  { id: "s3", name: "Emma Dubois", email: "emma.dubois@ecole.fr" },
  { id: "s4", name: "Thomas Petit", email: "thomas.petit@ecole.fr" },
  { id: "s5", name: "Léa Moreau", email: "lea.moreau@ecole.fr" },
  { id: "s6", name: "Hugo Laurent", email: "hugo.laurent@ecole.fr" },
  { id: "s7", name: "Chloé Simon", email: "chloe.simon@ecole.fr" },
  { id: "s8", name: "Nathan Michel", email: "nathan.michel@ecole.fr" },
] as const

export const CURRENT_STUDENT_ID = "s1"

export const MOCK_ASSIGNMENTS = [
  { id: "a1", quizId: "1", userId: "s1" },
  { id: "a2", quizId: "1", userId: "s2" },
  { id: "a3", quizId: "2", userId: "s1" },
  { id: "a4", quizId: "3", userId: "s1" },
]

export const MOCK_QUIZZES: Quiz[] = [
  {
    id: "1",
    title: "Évaluation de Mathématiques",
    description: "<p>Équations et dérivées — Chapitre 4</p>",
    teacherId: "teacher-1",
    createdAt: new Date("2024-10-12"),
    status: "Actif",
    durationMinutes: 30,
    expiresAt: new Date("2026-12-31"),
    gradingSystem: "standard",
    questions: [
      {
        id: "q1",
        text: "Quel est le résultat de l'équation <strong>2x + 5 = 15</strong> ?",
        points: 1,
        penaltyPoints: 0.25,
        choices: [
          { id: "c1", text: "x = 2", isCorrect: false },
          { id: "c2", text: "x = 5", isCorrect: true },
          { id: "c3", text: "x = 10", isCorrect: false },
          { id: "c4", text: "x = 20", isCorrect: false },
        ],
      },
      {
        id: "q2",
        text: "Quelle est la dérivée de f(x) = x² ?",
        points: 1,
        penaltyPoints: 0.25,
        choices: [
          { id: "c5", text: "2x", isCorrect: true },
          { id: "c6", text: "x", isCorrect: false },
          { id: "c7", text: "x²", isCorrect: false },
          { id: "c8", text: "2", isCorrect: false },
        ],
      },
      {
        id: "q3",
        text: "Combien vaut π arrondi à deux décimales ?",
        points: 1,
        penaltyPoints: 0.25,
        choices: [
          { id: "c9", text: "3.12", isCorrect: false },
          { id: "c10", text: "3.14", isCorrect: true },
          { id: "c11", text: "3.16", isCorrect: false },
          { id: "c12", text: "3.41", isCorrect: false },
        ],
      },
      {
        id: "q4",
        text: "Quel est l'aire d'un cercle de rayon 3 ?",
        points: 1,
        penaltyPoints: 0.25,
        choices: [
          { id: "c13", text: "6π", isCorrect: false },
          { id: "c14", text: "9π", isCorrect: true },
          { id: "c15", text: "3π", isCorrect: false },
          { id: "c16", text: "12π", isCorrect: false },
        ],
      },
      {
        id: "q5",
        text: "Résoudre : 3x - 7 = 8",
        points: 1,
        penaltyPoints: 0.25,
        choices: [
          { id: "c17", text: "x = 3", isCorrect: false },
          { id: "c18", text: "x = 5", isCorrect: true },
          { id: "c19", text: "x = 7", isCorrect: false },
          { id: "c20", text: "x = 15", isCorrect: false },
        ],
      },
    ],
  },
  {
    id: "2",
    title: "Histoire — La Révolution",
    description: "<p>Évaluation sur la Révolution française</p>",
    teacherId: "teacher-1",
    createdAt: new Date("2024-10-05"),
    status: "Terminé",
    durationMinutes: 45,
    expiresAt: new Date("2024-11-01"),
    gradingSystem: "canadien",
    questions: [
      {
        id: "q6",
        text: "En quelle année a eu lieu la prise de la Bastille ?",
        points: 2,
        penaltyPoints: 0.5,
        choices: [
          { id: "c21", text: "1789", isCorrect: true },
          { id: "c22", text: "1792", isCorrect: false },
          { id: "c23", text: "1804", isCorrect: false },
          { id: "c24", text: "1815", isCorrect: false },
        ],
      },
    ],
  },
  {
    id: "3",
    title: "Physique — Mécanique",
    description: "<p>Brouillon — à compléter</p>",
    teacherId: "teacher-1",
    createdAt: new Date("2024-11-15"),
    status: "Brouillon",
    durationMinutes: 60,
    expiresAt: new Date("2026-06-30"),
    gradingSystem: "standard",
    questions: [],
  },
]
