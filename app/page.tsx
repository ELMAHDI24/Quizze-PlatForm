import Link from "next/link"
import { ArrowRight, GraduationCap, Users, BookOpen } from "lucide-react"

export default function Home() {
  return (
    <div className="relative flex-1 overflow-hidden bg-[#F9F7F2]">
      {/* Background blobs — même style que /auth */}
      <div
        className="pointer-events-none absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(circle, #F5C4A8 0%, transparent 70%)" }}
      />
      <div
        className="pointer-events-none absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(circle, #A8D5CC 0%, transparent 70%)" }}
      />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-16 md:py-24">
        <div className="max-w-3xl text-center space-y-8">
          {/* Logo */}
          <div className="flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-[#D98466] to-[#4DA091] shadow-sm">
              <BookOpen className="h-7 w-7 text-white" />
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-[#2D2D2D] leading-tight">
              L&apos;apprentissage rendu{" "}
              <span className="bg-gradient-to-r from-[#4DA091] to-[#D98466] bg-clip-text text-transparent">
                simple.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-[#707070] max-w-2xl mx-auto leading-relaxed">
              Une plateforme épurée et moderne pour créer et passer des quiz.
              Conçue pour les enseignants et les étudiants.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 max-w-lg mx-auto pt-4">
            <Link href="/auth" className="group">
              <div className="flex w-full h-16 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#D98466] to-[#4DA091] text-base font-semibold text-white shadow-md transition-opacity hover:opacity-90">
                <GraduationCap className="h-6 w-6" />
                Espace Enseignant
                <ArrowRight className="h-4 w-4 opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
              </div>
            </Link>
            <Link href="/student" className="group">
              <div className="flex w-full h-16 items-center justify-center gap-2 rounded-2xl border-2 border-[#4DA091]/30 bg-white text-base font-semibold text-[#2D2D2D] shadow-sm transition-all hover:border-[#4DA091]/50 hover:shadow-md">
                <Users className="h-6 w-6 text-[#4DA091]" />
                Espace Étudiant
              </div>
            </Link>
          </div>

          {/* Social proof — comme la page login */}
          <div className="flex items-center justify-center gap-4 pt-8">
            <div className="flex -space-x-3">
              {["A", "B", "C", "D"].map((letter) => (
                <div
                  key={letter}
                  className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#F9F7F2] bg-[#A8D5CC] text-sm font-semibold text-white"
                >
                  {letter}
                </div>
              ))}
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-[#2D2D2D]">10k+ Utilisateurs</p>
              <p className="text-xs text-[#707070]">Nous font confiance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
