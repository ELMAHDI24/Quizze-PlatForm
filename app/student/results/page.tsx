import Link from "next/link"
import { ArrowLeft, Award, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"

export default function StudentResultsPage() {
  const pastResults = [
    { id: 1, quizName: "Mathématiques - Chapitre 4", date: "14 Oct 2024", score: 14, total: 20 },
    { id: 2, quizName: "Histoire - La Révolution", date: "05 Oct 2024", score: 17, total: 20 },
    { id: 3, quizName: "Physique - Mécanique", date: "28 Sep 2024", score: 9, total: 20 },
    { id: 4, quizName: "Anglais - Vocabulaire", date: "15 Sep 2024", score: 19, total: 20 },
  ]

  return (
    <div className="p-8 max-w-4xl mx-auto w-full space-y-8">
      <div className="flex items-center gap-4 mb-2">
        <Link href="/student">
          <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-900">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Historique des Résultats</h1>
          <p className="text-slate-500 mt-1">Consultez vos notes précédentes (Mes Notes).</p>
        </div>
      </div>

      <Card className="border-slate-200 shadow-sm overflow-hidden bg-white">
        <CardHeader className="border-b border-slate-100 bg-slate-50/30 pb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                <CardTitle className="text-xl">Tous vos quiz passés</CardTitle>
              </div>
              <CardDescription className="mt-1">Liste de toutes vos évaluations et de vos notes finales</CardDescription>
            </div>
          </div>
          
          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-1">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input placeholder="Rechercher une matière ou un quiz..." className="pl-9 bg-slate-50/50" />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Select defaultValue="tous">
                <SelectTrigger className="w-[150px] bg-slate-50/50">
                  <SelectValue placeholder="Période" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tous">Toutes les dates</SelectItem>
                  <SelectItem value="30jours">30 derniers jours</SelectItem>
                  <SelectItem value="3mois">3 derniers mois</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                <TableHead className="font-semibold text-slate-700">Nom du Quiz</TableHead>
                <TableHead className="font-semibold text-slate-700">Date de passage</TableHead>
                <TableHead className="font-semibold text-slate-700 text-center">Statut</TableHead>
                <TableHead className="text-right font-semibold text-slate-700">Note Finale</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pastResults.map((result) => (
                <TableRow key={result.id} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell className="font-medium text-slate-900">{result.quizName}</TableCell>
                  <TableCell className="text-slate-600">{result.date}</TableCell>
                  <TableCell className="text-center">
                    {result.score >= 10 ? (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-none">Réussi</Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-none">Non acquis</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={`font-bold text-lg ${result.score >= 10 ? 'text-green-600' : 'text-red-600'}`}>
                      {result.score}
                    </span>
                    <span className="text-slate-400">/{result.total}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination */}
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
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </Card>
    </div>
  )
}
