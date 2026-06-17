"use client"

import { usePathname } from "next/navigation"

export function Footer() {
  const pathname = usePathname()
  if (pathname === "/" || pathname.startsWith("/student") || pathname.startsWith("/teacher") || pathname.startsWith("/auth")) return null

  return (
    <footer className="mt-auto border-t bg-slate-50">
      <div className="container mx-auto flex h-16 items-center justify-center px-4">
        <p className="text-sm text-slate-500">
          &copy; {new Date().getFullYear()} QuizMaster. Tous droits réservés.
        </p>
      </div>
    </footer>
  )
}
