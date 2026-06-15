export type UserRole = "teacher" | "student"

export type QuizStatus = "Actif" | "Brouillon" | "Terminé" | "Expiré"

export type GradingSystem = "standard" | "canadien"

export type SessionStatus = "en_cours" | "termine"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
}

export interface Choice {
  id: string
  text: string
  isCorrect: boolean
}

export interface Question {
  id: string
  text: string
  choices: Choice[]
  points: number
  penaltyPoints: number
}

export interface Quiz {
  id: string
  title: string
  description?: string
  questions: Question[]
  createdAt: Date
  teacherId: string
  status: QuizStatus
  durationMinutes: number
  expiresAt: Date
  gradingSystem: GradingSystem
}

/** Table de liaison Quiz_Assignment */
export interface QuizAssignment {
  id: string
  quizId: string
  userId: string
}

/** Table Quiz_Session (remplace Result) */
export interface QuizSession {
  id: string
  userId: string
  quizId: string
  startedAt: Date
  currentQuestionId: string | null
  status: SessionStatus
  score: number
}

/** Table Student_Response */
export interface StudentResponse {
  id: string
  sessionId: string
  questionId: string
  answerId: string
  answeredAt: Date
}

export interface StudentAnswer {
  questionId: string
  selectedChoiceId: string
}
