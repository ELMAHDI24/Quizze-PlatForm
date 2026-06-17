"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Playfair_Display } from "next/font/google"
import { ArrowLeft, Download, Filter, Search } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MOCK_QUIZ_RESULTS, MOCK_QUIZZES, getQuizResultStatus, getQuizResultStatusLabel } from "@/lib/quiz-utils"
import { exportQuizResultsToCsv } from "@/lib/export-quiz-results"

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700"],
})

type StatusFilter = "all" | "valide" | "rattrapage" | "non_valide"

const STATUS_FILTER_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "Tous les statuts" },
  { value: "valide", label: "Validé" },
  { value: "rattrapage", label: "Rattrapage" },
  { value: "non_valide", label: "Non validé" },
]

function getStatusBadgeClass(status: ReturnType<typeof getQuizResultStatus>) {
  if (status === "valide") return "bg-[#E2EDE7] text-[#4DA091]"
  if (status === "rattrapage") return "bg-[#F4E1D5] text-[#C46A42]"
  return "bg-[#FDECEC] text-[#D32F2F]"
}

export default function QuizResultsPage() {
  const params = useParams()
  const quizId = params.id as string
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")

  const quiz = MOCK_QUIZZES.find((q) => q.id === quizId)
  const results = MOCK_QUIZ_RESULTS[quizId] ?? MOCK_QUIZ_RESULTS["1"] ?? []

  const filteredResults = useMemo(() => {
    return results.filter((result) => {
      const matchesSearch =
        result.name.toLowerCase().includes(search.toLowerCase()) ||
        result.email.toLowerCase().includes(search.toLowerCase())
      const status = getQuizResultStatus(result.score)
      const matchesStatus = statusFilter === "all" || status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [results, search, statusFilter])

  const averageScore =
    results.length > 0 ? results.reduce((acc, curr) => acc + curr.score, 0) / results.length : 0
  const passRate =
    results.length > 0
      ? Math.round((results.filter((r) => r.score >= 10).length / results.length) * 100)
      : 0

  const quizTitle = quiz?.title ?? "Algorithmique — Structures de données"

  const handleExport = () => {
    exportQuizResultsToCsv(filteredResults, quizTitle)
  }

  return (
    <div className="flex-1 bg-[#F9F7F2] px-6 py-8 md:px-10 md:py-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <header className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-4">
            <Link
              href="/teacher/quizzes"
              className="mt-1 flex h-10 w-10 items-center justify-center rounded-xl border border-[#E8E4DC] bg-white text-[#707070] transition-colors hover:border-[#C46A42]/40 hover:text-[#C46A42]"
              aria-label="Retour"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className={`${playfair.className} text-3xl font-bold text-[#2D2D2D] md:text-4xl`}>
                Résultats du quiz
              </h1>
              <p className="mt-1 text-sm text-[#707070]">{quizTitle}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#C46A42] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
          >
            <Download className="h-4 w-4" />
            Exporter
          </button>
        </header>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            { label: "Participants", value: String(results.length) },
            { label: "Moyenne", value: `${averageScore.toFixed(1)}/20` },
            { label: "Taux de validation (≥10)", value: `${passRate}%` },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-3xl border border-[#E8E4DC] bg-white px-6 py-5 text-center shadow-sm"
            >
              <p className="text-sm text-[#707070]">{stat.label}</p>
              <p className={`${playfair.className} mt-2 text-3xl font-bold text-[#2D2D2D]`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <section className="overflow-hidden rounded-3xl border border-[#E8E4DC] bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-[#E8E4DC] px-5 py-4 md:flex-row md:items-center md:justify-between md:px-6">
            <div className="relative w-full md:max-w-sm">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#707070]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un étudiant..."
                className="w-full rounded-xl border border-[#E8E4DC] bg-[#F9F7F2] py-3 pl-11 pr-4 text-sm text-[#2D2D2D] outline-none focus:ring-2 focus:ring-[#C46A42]/20"
              />
            </div>

            <div className="relative w-full md:w-auto">
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as StatusFilter)}>
                <SelectTrigger className="relative h-auto w-full rounded-xl border border-[#E8E4DC] bg-[#F9F7F2] py-3 pl-11 pr-4 text-sm text-[#2D2D2D] shadow-none focus:ring-2 focus:ring-[#C46A42]/20 md:min-w-[220px]">
                  <Filter className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#707070]" />
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border border-[#E8E4DC] bg-white p-2 shadow-lg">
                  {STATUS_FILTER_OPTIONS.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="rounded-xl py-2.5 pl-3 pr-3 text-sm text-[#2D2D2D] focus:bg-[#F4E1D5] data-[highlighted]:bg-[#F4E1D5] data-[state=checked]:bg-[#F4E1D5] data-[state=checked]:font-semibold [&>span:first-child]:hidden"
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px]">
              <thead>
                <tr className="border-b border-[#E8E4DC] bg-[#FBFAF7] text-left text-xs font-semibold uppercase tracking-wide text-[#707070]">
                  <th className="px-6 py-4">Étudiant</th>
                  <th className="px-6 py-4">Date et heure</th>
                  <th className="px-6 py-4">Statut</th>
                  <th className="px-6 py-4 text-right">Note finale</th>
                </tr>
              </thead>
              <tbody>
                {filteredResults.map((result) => {
                  const status = getQuizResultStatus(result.score)

                  return (
                    <tr key={result.id} className="border-b border-[#F0EDE6] last:border-b-0">
                      <td className="px-6 py-4">
                        <p className="font-medium text-[#2D2D2D]">{result.name}</p>
                        <p className="text-xs text-[#707070]">{result.email}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#707070]">{result.date}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusBadgeClass(status)}`}
                        >
                          {getQuizResultStatusLabel(status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span
                          className={`text-base font-bold ${
                            status === "non_valide" ? "text-[#D32F2F]" : "text-[#2D2D2D]"
                          }`}
                        >
                          {result.score}/{result.total}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}
