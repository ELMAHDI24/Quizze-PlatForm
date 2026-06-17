import Link from "next/link"
import { Playfair_Display } from "next/font/google"
import { Check } from "lucide-react"

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700"],
})

export default function QuizResultPage() {
  return (
    <div className="flex min-h-screen flex-1 items-center justify-center bg-[#F9F7F2] p-6">
      <div className="w-full max-w-md rounded-3xl border border-[#E8E4DC] bg-white px-8 py-10 text-center shadow-sm">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#E2EDE7]">
          <Check className="h-8 w-8 text-[#4DA091]" strokeWidth={2.5} />
        </div>

        <h1 className={`${playfair.className} text-2xl font-bold text-[#2D2D2D] md:text-3xl`}>
          Quiz terminé
        </h1>

        <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-[#707070]">
          Votre session a été enregistrée. Le résultat sera disponible une fois la
          correction validée.
        </p>

        <Link
          href="/student"
          className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-[#4DA091] py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          Retour à mes quiz
        </Link>
      </div>
    </div>
  )
}
