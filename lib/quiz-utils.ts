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
  { id: "s1", name: "Yasmine El Amrani", email: "yasmine.elamrani@univ.ma" },
  { id: "s2", name: "Mehdi Bouzid", email: "mehdi.bouzid@univ.ma" },
  { id: "s3", name: "Salma Tazi", email: "salma.tazi@univ.ma" },
  { id: "s4", name: "Karim Idrissi", email: "karim.idrissi@univ.ma" },
  { id: "s5", name: "Nadia Berrada", email: "nadia.berrada@univ.ma" },
  { id: "s6", name: "Omar Saadi", email: "omar.saadi@univ.ma" },
  { id: "s7", name: "Chloé Simon", email: "chloe.simon@univ.ma" },
  { id: "s8", name: "Nathan Michel", email: "nathan.michel@univ.ma" },
] as const

export const CURRENT_STUDENT_ID = "s1"

export const CURRENT_STUDENT = {
  id: CURRENT_STUDENT_ID,
  name: "Yasmine El Amrani",
  email: "yasmine.elamrani@etablissement.ma",
  initials: "ÉT",
}

export const MOCK_STUDENT_SCORES: Record<
  string,
  { score: number; maxScore: number; date?: string }
> = {
  "2": { score: 14.5, maxScore: 20, date: "1 nov. 2024 — 14:32" },
}

export interface StudentQuizResult {
  quizId: string
  quizTitle: string
  score: number
  total: number
  date: string
  gradingSystem: GradingSystem
  status: QuizResultStatus
}

/** Résultats des quiz terminés pour un étudiant donné */
export function getStudentQuizResults(studentId: string): StudentQuizResult[] {
  const student = MOCK_STUDENTS.find((s) => s.id === studentId)
  const studentName = student?.name ?? CURRENT_STUDENT.name

  const assignedQuizIds = MOCK_ASSIGNMENTS.filter((a) => a.userId === studentId).map(
    (a) => a.quizId
  )

  const results: StudentQuizResult[] = []

  for (const quizId of assignedQuizIds) {
    const quiz = MOCK_QUIZZES.find((q) => q.id === quizId)
    if (!quiz) continue

    const resolvedStatus = resolveQuizStatus(quiz)
    const row = (MOCK_QUIZ_RESULTS[quizId] ?? []).find(
      (r) => r.name === studentName || r.email === student?.email
    )

    if (row) {
      results.push({
        quizId,
        quizTitle: quiz.title,
        score: row.score,
        total: row.total,
        date: row.date,
        gradingSystem: quiz.gradingSystem,
        status: getQuizResultStatus(row.score),
      })
      continue
    }

    const mockScore = MOCK_STUDENT_SCORES[quizId]
    if (mockScore && isQuizInactive(resolvedStatus)) {
      results.push({
        quizId,
        quizTitle: quiz.title,
        score: mockScore.score,
        total: mockScore.maxScore,
        date: mockScore.date ?? "—",
        gradingSystem: quiz.gradingSystem,
        status: getQuizResultStatus(mockScore.score),
      })
    }
  }

  return results.sort((a, b) => b.score - a.score)
}

export const TEACHER_QUIZ_ASSIGNED_COUNTS: Record<string, number> = {
  "1": 28,
  "2": 28,
  "4": 22,
}

export interface QuizResultRow {
  id: string
  name: string
  email: string
  date: string
  score: number
  total: number
}

export type QuizResultStatus = "valide" | "rattrapage" | "non_valide"

export function getQuizResultStatus(score: number): QuizResultStatus {
  if (score >= 10) return "valide"
  if (score >= 8) return "rattrapage"
  return "non_valide"
}

export function getQuizResultStatusLabel(status: QuizResultStatus) {
  if (status === "valide") return "VALIDÉ"
  if (status === "rattrapage") return "RATTRAPAGE"
  return "NON VALIDÉ"
}

export function getQuizResultStatusExportLabel(score: number) {
  const status = getQuizResultStatus(score)
  if (status === "valide") return "Validé"
  if (status === "rattrapage") return "Rattrapage"
  return "Non validé"
}

export const MOCK_QUIZ_RESULTS: Record<string, QuizResultRow[]> = {
  "1": [
    { id: "r1", name: "Yasmine El Amrani", email: "yasmine.elamrani@univ.ma", date: "14 juin — 10:23", score: 18, total: 20 },
    { id: "r2", name: "Mehdi Bouzid", email: "mehdi.bouzid@univ.ma", date: "14 juin — 10:45", score: 14, total: 20 },
    { id: "r3", name: "Salma Tazi", email: "salma.tazi@univ.ma", date: "14 juin — 11:02", score: 9, total: 20 },
    { id: "r4", name: "Karim Idrissi", email: "karim.idrissi@univ.ma", date: "14 juin — 11:30", score: 16, total: 20 },
    { id: "r5", name: "Nadia Berrada", email: "nadia.berrada@univ.ma", date: "15 juin — 09:15", score: 19.5, total: 20 },
    { id: "r6", name: "Omar Saadi", email: "omar.saadi@univ.ma", date: "15 juin — 09:48", score: 11, total: 20 },
  ],
}

export function countAssignedStudents(quizId: string) {
  return TEACHER_QUIZ_ASSIGNED_COUNTS[quizId] ?? MOCK_ASSIGNMENTS.filter((a) => a.quizId === quizId).length
}

export const MOCK_ASSIGNMENTS = [
  { id: "a1", quizId: "1", userId: "s1" },
  { id: "a2", quizId: "1", userId: "s2" },
  { id: "a3", quizId: "2", userId: "s1" },
  { id: "a5", quizId: "4", userId: "s1" },
]

export const MOCK_QUIZZES: Quiz[] = [
  {
    id: "1",
    title: "Algorithmique — Structures de données",
    description: "<p>Listes, piles et files — Évaluation de mi-semestre</p>",
    teacherId: "teacher-1",
    createdAt: new Date("2024-10-12"),
    status: "Actif",
    durationMinutes: 45,
    expiresAt: new Date("2026-06-20"),
    gradingSystem: "standard",
    questions: [
      {
        id: "q1",
        text: "Quelle est la complexité moyenne d'une recherche dans un arbre binaire de recherche équilibré ?",
        points: 2,
        penaltyPoints: 0.25,
        choices: [
          { id: "c1", text: "O(1)", isCorrect: false },
          { id: "c2", text: "O(log n)", isCorrect: true },
          { id: "c3", text: "O(n)", isCorrect: false },
          { id: "c4", text: "O(n log n)", isCorrect: false },
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
    title: "Bases de données relationnelles",
    description: "<p>SQL, modèle relationnel et normalisation</p>",
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
  {
    id: "4",
    title: "Réseaux",
    description: "<p>Protocoles TCP/IP et architecture réseau</p>",
    teacherId: "teacher-1",
    createdAt: new Date("2024-11-01"),
    status: "Actif",
    durationMinutes: 45,
    expiresAt: new Date("2026-12-31"),
    gradingSystem: "standard",
    questions: [
      {
        id: "q7",
        text: "Quel protocole assure le transport fiable des données ?",
        points: 1,
        penaltyPoints: 0.25,
        choices: [
          { id: "c25", text: "UDP", isCorrect: false },
          { id: "c26", text: "TCP", isCorrect: true },
          { id: "c27", text: "ICMP", isCorrect: false },
          { id: "c28", text: "ARP", isCorrect: false },
        ],
      },
      {
        id: "q8",
        text: "Combien de bits contient une adresse IPv4 ?",
        points: 1,
        penaltyPoints: 0.25,
        choices: [
          { id: "c29", text: "16", isCorrect: false },
          { id: "c30", text: "32", isCorrect: true },
          { id: "c31", text: "64", isCorrect: false },
          { id: "c32", text: "128", isCorrect: false },
        ],
      },
    ],
  },
]
