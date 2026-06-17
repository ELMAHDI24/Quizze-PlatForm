"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, User } from "lucide-react"

export function Navbar() {
  const pathname = usePathname()
  const isHome = pathname === "/"
  const isStudent = pathname.startsWith("/student")
  const isTeacher = pathname.startsWith("/teacher")
  const isAuth = pathname.startsWith("/auth")

  if (isHome) {
    return (
      <header className="absolute top-0 left-0 right-0 z-50 px-6 py-6 lg:px-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link
            href="/"
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#D98466] to-[#4DA091] shadow-sm transition-opacity hover:opacity-90"
          >
            <BookOpen className="h-5 w-5 text-white" />
          </Link>
          <Link
            href="/auth"
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2D2D2D] shadow-sm transition-opacity hover:opacity-90"
            aria-label="Connexion"
          >
            <User className="h-5 w-5 text-white" />
          </Link>
        </div>
      </header>
    )
  }

  if (isStudent || isTeacher || isAuth) return null

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
          <div className="rounded-lg bg-primary/10 p-2">
            <BookOpen className="h-5 w-5 text-primary" />
          </div>
          <span className="text-slate-800">QuizMaster</span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-4">
            <Link
              href="/auth"
              className="flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-primary"
            >
              <User className="h-5 w-5" />
              <span>Connexion</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
