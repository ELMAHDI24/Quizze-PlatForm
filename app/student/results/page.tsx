"use client"

import Link from "next/link"
import { Playfair_Display } from "next/font/google"
import { ArrowRight, BarChart3, Calendar, Trophy } from "lucide-react"
import {
  CURRENT_STUDENT_ID,
  getQuizResultStatusLabel,
  getStudentQuizResults,
} from "@/lib/quiz-utils"
import type { QuizResultStatus } from "@/lib/quiz-utils"

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700"],
})

function getStatusBadgeClass(status: QuizResultStatus) {
  if (status === "valide") return "bg-[#E2EDE7] text-[#4DA091]"
  if (status === "rattrapage") return "bg-[#F4E1D5] text-[#C46A42]"
  return "bg-[#FDECEC] text-[#D32F2F]"
}

export default function StudentResultsPage() {
  const results = getStudentQuizResults(CURRENT_STUDENT_ID)
  const average =
    results.length > 0
      ? results.reduce((acc, r) => acc + (r.score / r.total) * 20, 0) / results.length
      : 0
  const validatedCount = results.filter((r) => r.status === "valide").length

  return (
    <div className="flex-1 px-6 py-8 md:px-10 md:py-10 lg:px-12">
      <header className="mb-10">
        <h1 className={`${playfair.className} text-3xl font-bold text-[#2D2D2D] md:text-4xl`}>
          Mes résultats
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-[#707070] md:text-base">
          Consultez vos notes et statuts pour les quiz que vous avez terminés.
        </p>
      </header>

      {results.length > 0 && (
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { label: "Quiz terminés", value: String(results.length), icon: BarChart3 },
            { label: "Moyenne générale", value: `${average.toFixed(1)}/20`, icon: Trophy },
            {
              label: "Quiz validés (≥10)",
              value: `${validatedCount}/${results.length}`,
              icon: Trophy,
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-4 rounded-2xl border border-[#E8E4DC] bg-white p-5 shadow-sm"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E2EDE7]">
                <stat.icon className="h-5 w-5 text-[#4DA091]" />
              </div>
              <div>
                <p className="text-xs text-[#707070]">{stat.label}</p>
                <p className={`${playfair.className} text-2xl font-bold text-[#2D2D2D]`}>
                  {stat.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {results.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#E8E4DC] bg-white/60 px-6 py-16 text-center text-[#707070]">
          Aucun résultat disponible pour le moment. Terminez un quiz pour voir votre note ici.
        </div>
      ) : (
        <section className="overflow-hidden rounded-2xl border border-[#E8E4DC] bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-[#E8E4DC] bg-[#FBFAF7] text-left text-xs font-semibold uppercase tracking-wide text-[#707070]">
                  <th className="px-6 py-4">Quiz</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Statut</th>
                  <th className="px-6 py-4 text-right">Note</th>
                  <th className="px-6 py-4 text-right">Détail</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result) => (
                  <tr key={result.quizId} className="border-b border-[#F0EDE6] last:border-b-0">
                    <td className="px-6 py-4">
                      <p className="font-medium text-[#2D2D2D]">{result.quizTitle}</p>
                      <p className="text-xs text-[#707070]">
                        {result.gradingSystem === "canadien"
                          ? "Notation canadienne"
                          : "Notation standard"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1.5 text-sm text-[#707070]">
                        <Calendar className="h-3.5 w-3.5" />
                        {result.date}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusBadgeClass(result.status)}`}
                      >
                        {getQuizResultStatusLabel(result.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span
                        className={`text-base font-bold ${
                          result.status === "non_valide" ? "text-[#D32F2F]" : "text-[#2D2D2D]"
                        }`}
                      >
                        {result.score}/{result.total}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/student/results/${result.quizId}`}
                        className="inline-flex items-center gap-1 text-sm font-semibold text-[#4DA091] transition-opacity hover:opacity-80"
                      >
                        Voir
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  )
}
