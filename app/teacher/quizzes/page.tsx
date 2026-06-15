"use client"

import Link from "next/link"
import { PlusCircle, Search, MoreHorizontal, Edit, Trash2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import type { QuizStatus } from "@/lib/types"
import { isQuizInactive } from "@/lib/quiz-utils"

const quizzes: { id: number; title: string; assigned: number; date: string; status: QuizStatus; duration: number }[] = [
  { id: 1, title: "Mathématiques - Chapitre 4", assigned: 24, date: "12 Oct 2024", status: "Actif", duration: 30 },
  { id: 2, title: "Histoire - La Révolution", assigned: 31, date: "05 Oct 2024", status: "Terminé", duration: 45 },
  { id: 3, title: "Physique - Mécanique", assigned: 0, date: "À venir", status: "Brouillon", duration: 60 },
  { id: 4, title: "Français - Conjugaison", assigned: 18, date: "01 Nov 2024", status: "Actif", duration: 20 },
  { id: 5, title: "SVT - Génétique", assigned: 12, date: "15 Nov 2024", status: "Expiré", duration: 40 },
]

export default function TeacherQuizzesPage() {
  return (
    <div className="p-8 max-w-6xl mx-auto w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Gestion des Quiz</h1>
          <p className="text-slate-500 mt-1">Consultez, modifiez ou supprimez vos évaluations.</p>
        </div>
        <Link href="/teacher/quiz/new">
          <Button size="lg" className="gap-2 shadow-md">
            <PlusCircle className="h-5 w-5" />
            Nouveau Quiz
          </Button>
        </Link>
      </div>

      <Card className="border-slate-200 shadow-sm overflow-hidden bg-white">
        <CardHeader className="border-b border-slate-100 bg-slate-50/30 pb-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input placeholder="Rechercher un quiz..." className="pl-9 bg-white" />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Select defaultValue="tous">
                <SelectTrigger className="w-[180px] bg-white">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tous">Tous les statuts</SelectItem>
                  <SelectItem value="actif">Actif</SelectItem>
                  <SelectItem value="brouillon">Brouillon</SelectItem>
                  <SelectItem value="termine">Terminé</SelectItem>
                  <SelectItem value="expire">Expiré</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                <TableHead className="font-semibold text-slate-700">Titre du Quiz</TableHead>
                <TableHead className="font-semibold text-slate-700">Étudiants affectés</TableHead>
                <TableHead className="font-semibold text-slate-700">Durée</TableHead>
                <TableHead className="font-semibold text-slate-700">Date de création</TableHead>
                <TableHead className="font-semibold text-slate-700">Statut</TableHead>
                <TableHead className="text-right font-semibold text-slate-700">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quizzes.map((quiz) => (
                <TableRow
                  key={quiz.id}
                  className={`hover:bg-slate-50/50 transition-colors ${isQuizInactive(quiz.status) ? "grayscale opacity-70" : ""}`}
                >
                  <TableCell className="font-medium text-slate-900">{quiz.title}</TableCell>
                  <TableCell className="text-slate-600">{quiz.assigned} étudiant(s)</TableCell>
                  <TableCell className="text-slate-600">{quiz.duration} min</TableCell>
                  <TableCell className="text-slate-600">{quiz.date}</TableCell>
                  <TableCell>
                    <Badge
                      variant={quiz.status === "Actif" ? "default" : quiz.status === "Terminé" || quiz.status === "Expiré" ? "secondary" : "outline"}
                      className={quiz.status === "Actif" ? "bg-green-100 text-green-800 hover:bg-green-100" : quiz.status === "Expiré" ? "bg-orange-100 text-orange-800" : ""}
                    >
                      {quiz.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0" disabled={isQuizInactive(quiz.status)}>
                          <span className="sr-only">Ouvrir le menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link href={`/teacher/quiz/${quiz.id}/results`} className="cursor-pointer">
                            <Eye className="mr-2 h-4 w-4 text-slate-500" />
                            Voir les résultats
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4 text-slate-500" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600 focus:text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="p-4 border-t border-slate-100">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">2</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </Card>
    </div>
  )
}
