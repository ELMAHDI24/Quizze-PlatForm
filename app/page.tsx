import Link from "next/link"
import { Playfair_Display } from "next/font/google"
import { User, Users, Clock, BarChart3 } from "lucide-react"

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700"],
})

function AppLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
      <line x1="10" y1="6.5" x2="14" y2="6.5" />
      <line x1="10" y1="17.5" x2="14" y2="17.5" />
      <line x1="6.5" y1="10" x2="6.5" y2="14" />
      <line x1="17.5" y1="10" x2="17.5" y2="14" />
    </svg>
  )
}

const features = [
  {
    icon: Users,
    title: "Affectation nominative",
    subtitle: "pas de code d'accès",
  },
  {
    icon: Clock,
    title: "Timer synchronisé",
    subtitle: "côté serveur",
  },
  {
    icon: BarChart3,
    title: "2 systèmes de notation",
    subtitle: "standard / canadien",
  },
]

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-1 flex-col bg-[#F9F7F2]">
      <div className="flex flex-1 flex-col items-center justify-center px-4 pb-12 pt-28 md:pt-32">
        <div className="max-w-3xl space-y-8 text-center">
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#D98466] to-[#4DA091] shadow-sm">
              <AppLogo className="h-8 w-8 text-white" />
            </div>
          </div>

          <div className="space-y-4">
            <h1
              className={`${playfair.className} text-4xl font-bold leading-tight tracking-tight text-[#2D2D2D] md:text-6xl`}
            >
              L&apos;apprentissage rendu
              <br />
              <span className="text-[#C4845C]">simple.</span>
            </h1>
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-[#707070] md:text-lg">
              Une plateforme épurée et moderne pour créer et passer des quiz.
              Conçue pour les enseignants et les étudiants.
            </p>
          </div>

          <div className="mx-auto max-w-md pt-2">
            <Link href="/auth" className="group block">
              <div className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#D98466] to-[#4DA091] text-base font-semibold text-white shadow-md transition-opacity hover:opacity-90">
                <User className="h-5 w-5" />
                Inscription / Connexion
              </div>
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-4xl grid-cols-1 gap-10 px-6 pb-16 sm:grid-cols-3 sm:gap-6">
        {features.map(({ icon: Icon, title, subtitle }) => (
          <div key={title} className="flex flex-col items-center text-center">
            <Icon className="mb-3 h-6 w-6 text-[#C4845C]" strokeWidth={1.75} />
            <p className="text-sm font-bold text-[#2D2D2D]">{title}</p>
            <p className="mt-1 text-xs text-[#707070]">{subtitle}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
