import type { QuizSession, StudentResponse } from "@/lib/types"

const SESSION_KEY = "quiz_session"
const RESPONSES_KEY = "quiz_responses"

export function loadSession(quizId: string, userId: string): QuizSession | null {
  if (typeof window === "undefined") return null
  const raw = localStorage.getItem(`${SESSION_KEY}_${quizId}_${userId}`)
  if (!raw) return null
  try {
    const session = JSON.parse(raw) as QuizSession
    return session.status === "en_cours" ? session : null
  } catch {
    return null
  }
}

export function saveSession(session: QuizSession): void {
  if (typeof window === "undefined") return
  localStorage.setItem(
    `${SESSION_KEY}_${session.quizId}_${session.userId}`,
    JSON.stringify(session)
  )
}

export function loadResponses(sessionId: string): StudentResponse[] {
  if (typeof window === "undefined") return []
  const raw = localStorage.getItem(`${RESPONSES_KEY}_${sessionId}`)
  if (!raw) return []
  try {
    return JSON.parse(raw) as StudentResponse[]
  } catch {
    return []
  }
}

export function saveResponse(response: StudentResponse): void {
  if (typeof window === "undefined") return
  const existing = loadResponses(response.sessionId)
  const updated = [...existing.filter((r) => r.questionId !== response.questionId), response]
  localStorage.setItem(`${RESPONSES_KEY}_${response.sessionId}`, JSON.stringify(updated))
}

export function clearSession(quizId: string, userId: string): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(`${SESSION_KEY}_${quizId}_${userId}`)
}
