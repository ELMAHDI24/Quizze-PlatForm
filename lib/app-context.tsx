"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import {
  User,
  Quiz,
  QuizAssignment,
  QuizSession,
  StudentResponse,
} from "./types"
import { MOCK_ASSIGNMENTS, MOCK_QUIZZES } from "./quiz-utils"

interface AppContextType {
  user: User | null
  setUser: (user: User | null) => void
  quizzes: Quiz[]
  setQuizzes: (quizzes: Quiz[]) => void
  addQuiz: (quiz: Quiz) => void
  assignments: QuizAssignment[]
  addAssignments: (items: QuizAssignment[]) => void
  sessions: QuizSession[]
  addSession: (session: QuizSession) => void
  updateSession: (session: QuizSession) => void
  responses: StudentResponse[]
  addResponse: (response: StudentResponse) => void
  currentQuiz: Quiz | null
  setCurrentQuiz: (quiz: Quiz | null) => void
  logout: () => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [quizzes, setQuizzes] = useState<Quiz[]>(MOCK_QUIZZES)
  const [assignments, setAssignments] = useState<QuizAssignment[]>(MOCK_ASSIGNMENTS)
  const [sessions, setSessions] = useState<QuizSession[]>([])
  const [responses, setResponses] = useState<StudentResponse[]>([])
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null)

  const addQuiz = (quiz: Quiz) => setQuizzes((prev) => [...prev, quiz])
  const addAssignments = (items: QuizAssignment[]) =>
    setAssignments((prev) => [...prev, ...items])
  const addSession = (session: QuizSession) =>
    setSessions((prev) => [...prev, session])
  const updateSession = (session: QuizSession) =>
    setSessions((prev) => prev.map((s) => (s.id === session.id ? session : s)))
  const addResponse = (response: StudentResponse) =>
    setResponses((prev) => [
      ...prev.filter(
        (r) =>
          !(r.sessionId === response.sessionId && r.questionId === response.questionId)
      ),
      response,
    ])

  const logout = () => {
    setUser(null)
    setCurrentQuiz(null)
  }

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        quizzes,
        setQuizzes,
        addQuiz,
        assignments,
        addAssignments,
        sessions,
        addSession,
        updateSession,
        responses,
        addResponse,
        currentQuiz,
        setCurrentQuiz,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}
