"use client"

import { useState } from "react"
import { Users, Search, UserCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [draft, setDraft] = useState<string[]>(selectedIds)

  const filtered = MOCK_STUDENTS.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())
  )

  const toggleStudent = (id: string) => {
    setDraft((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const selectAll = () => setDraft(MOCK_STUDENTS.map((s) => s.id))
  const clearAll = () => setDraft([])

  const handleConfirm = () => {
    onChange(draft)
    setOpen(false)
  }

  const handleOpen = (isOpen: boolean) => {
    if (isOpen) setDraft(selectedIds)
    setOpen(isOpen)
  }

  return (
    <div className="space-y-2">
      <Dialog open={open} onOpenChange={handleOpen}>
        <DialogTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="w-full justify-start gap-2 h-12 border-dashed"
          >
            <Users className="h-4 w-4 text-[#4DA091]" />
            {selectedIds.length > 0 ? (
              <span>
                <strong>{selectedIds.length}</strong> étudiant
                {selectedIds.length > 1 ? "s" : ""} sélectionné
                {selectedIds.length > 1 ? "s" : ""}
              </span>
            ) : (
              <span className="text-muted-foreground">
                Affecter des étudiants au quiz
              </span>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-[#4DA091]" />
              Affectation des étudiants
            </DialogTitle>
            <DialogDescription>
              Sélectionnez les étudiants autorisés à passer ce quiz.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher un étudiant..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" onClick={selectAll}>
                Tout sélectionner
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={clearAll}>
                Tout désélectionner
              </Button>
              <Badge variant="secondary" className="ml-auto">
                {draft.length} / {MOCK_STUDENTS.length}
              </Badge>
            </div>

            <div className="max-h-64 overflow-y-auto space-y-1 rounded-lg border p-2">
              {filtered.map((student) => (
                <label
                  key={student.id}
                  className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 hover:bg-muted/50 transition-colors"
                >
                  <Checkbox
                    checked={draft.includes(student.id)}
                    onCheckedChange={() => toggleStudent(student.id)}
                    className="data-[state=checked]:bg-[#4DA091] data-[state=checked]:border-[#4DA091]"
                  />
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#A8D5CC]/30 text-xs font-semibold text-[#4DA091]">
                    {student.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{student.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {student.email}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="button" onClick={handleConfirm}>
              Confirmer ({draft.length})
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {selectedIds.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selectedIds.map((id) => {
            const student = MOCK_STUDENTS.find((s) => s.id === id)
            if (!student) return null
            return (
              <Badge key={id} variant="secondary" className="text-xs">
                {student.name}
              </Badge>
            )
          })}
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
