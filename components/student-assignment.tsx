"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { MOCK_STUDENTS } from "@/lib/quiz-utils"

interface StudentAssignmentProps {
  selectedIds: string[]
  onChange: (ids: string[]) => void
  error?: string
}

export function StudentAssignment({
  selectedIds,
  onChange,
  error,
}: StudentAssignmentProps) {
  const [search, setSearch] = useState("")

  const filtered = MOCK_STUDENTS.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())
  )

  const toggleStudent = (id: string) => {
    onChange(
      selectedIds.includes(id)
        ? selectedIds.filter((x) => x !== id)
        : [...selectedIds, id]
    )
  }

  const selectAll = () => onChange(MOCK_STUDENTS.map((s) => s.id))
  const clearAll = () => onChange([])

  return (
    <div className="flex h-full flex-col rounded-3xl border border-[#E8E4DC] bg-white p-5 shadow-sm md:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-[#2D2D2D]">Affecter les étudiants</h3>
        <span className="rounded-full bg-[#E2EDE7] px-3 py-1 text-xs font-bold text-[#4DA091]">
          {selectedIds.length} SÉLECTIONNÉ{selectedIds.length === 1 ? "" : "S"}
        </span>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#707070]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un étudiant..."
          className="w-full rounded-xl border border-[#E8E4DC] bg-[#F9F7F2] py-3 pl-11 pr-4 text-sm text-[#2D2D2D] outline-none focus:ring-2 focus:ring-[#C46A42]/20"
        />
      </div>

      <div className="min-h-[280px] flex-1 space-y-1 overflow-y-auto rounded-xl border border-[#F0EDE6] p-2">
        {filtered.map((student) => (
          <label
            key={student.id}
            className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-[#F9F7F2]"
          >
            <Checkbox
              checked={selectedIds.includes(student.id)}
              onCheckedChange={() => toggleStudent(student.id)}
              className="border-[#707070]/40 data-[state=checked]:border-[#4DA091] data-[state=checked]:bg-[#4DA091]"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-[#2D2D2D]">{student.name}</p>
              <p className="truncate text-xs text-[#707070]">{student.email}</p>
            </div>
          </label>
        ))}
      </div>

      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={selectAll}
          className="text-sm font-medium text-[#C46A42] transition-opacity hover:opacity-80"
        >
          Tout sélectionner
        </button>
        <button
          type="button"
          onClick={clearAll}
          className="rounded-xl border border-[#E8E4DC] px-4 py-2 text-sm font-medium text-[#707070] transition-colors hover:bg-[#F9F7F2]"
        >
          Tout désélectionner
        </button>
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </div>
  )
}
