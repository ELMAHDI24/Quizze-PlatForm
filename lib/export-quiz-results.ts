import type { QuizResultRow } from "@/lib/quiz-utils"
import { getQuizResultStatusExportLabel } from "@/lib/quiz-utils"

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function escapeCsvCell(value: string) {
  if (value.includes(";") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

function formatScoreForExport(score: number) {
  return String(score).replace(".", ",")
}

export function exportQuizResultsToCsv(results: QuizResultRow[], quizTitle: string) {
  const headers = ["Étudiant", "Email", "Date et heure", "Statut", "Note finale (/20)"]
  const rows = results.map((result) => [
    result.name,
    result.email,
    result.date,
    getQuizResultStatusExportLabel(result.score),
    formatScoreForExport(result.score),
  ])

  const csv = [headers, ...rows]
    .map((row) => row.map(escapeCsvCell).join(";"))
    .join("\r\n")

  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `resultats-${slugify(quizTitle) || "quiz"}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
