import Link from 'next/link'
import { BookOpen, UserCircle } from 'lucide-react'

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
          <div className="bg-primary/10 p-2 rounded-lg">
            <BookOpen className="h-5 w-5 text-primary" />
          </div>
          <span className="text-slate-800">QuizMaster</span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-4">
            <Link href="/auth" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors flex items-center gap-2">
              <UserCircle className="h-5 w-5" />
              <span>Connexion</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
