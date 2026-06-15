import Link from "next/link"
import { ArrowLeft, Download, FileSpreadsheet, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"

export default function QuizResultsPage() {
  const results = [
    { id: 1, name: "Sophie Martin", email: "sophie.m@ecole.fr", date: "14 Oct 2024 - 10:23", score: 18, total: 20 },
    { id: 2, name: "Lucas Bernard", email: "lucas.b@ecole.fr", date: "14 Oct 2024 - 10:45", score: 14, total: 20 },
    { id: 3, name: "Emma Dubois", email: "emma.d@ecole.fr", date: "14 Oct 2024 - 11:02", score: 9, total: 20 },
    { id: 4, name: "Thomas Petit", email: "thomas.p@ecole.fr", date: "14 Oct 2024 - 11:30", score: 16, total: 20 },
    { id: 5, name: "Léa Roux", email: "lea.r@ecole.fr", date: "15 Oct 2024 - 09:15", score: 20, total: 20 },
  ]

  const averageScore = results.reduce((acc, curr) => acc + curr.score, 0) / results.length

  return (
    <div className="p-8 max-w-5xl mx-auto w-full space-y-8">
      <div className="flex items-center gap-4 mb-2">
        <Link href="/teacher">
          <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-900">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Résultats du Quiz</h1>
          <p className="text-slate-500 mt-1">Mathématiques - Chapitre 4 (MATH4-2024)</p>
        </div>
        <Button variant="outline" className="gap-2 bg-white shadow-sm">
          <Download className="h-4 w-4" /> Exporter
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm bg-white">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-slate-500 mb-1">Participants</p>
              <div className="text-4xl font-bold text-primary">{results.length}</div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-slate-500 mb-1">Moyenne</p>
              <div className="text-4xl font-bold text-blue-600">{averageScore.toFixed(1)}<span className="text-xl text-slate-400 font-normal">/20</span></div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-slate-500 mb-1">Taux de réussite (≥ 10)</p>
              <div className="text-4xl font-bold text-green-600">
                {Math.round((results.filter(r => r.score >= 10).length / results.length) * 100)}%
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200 shadow-sm overflow-hidden bg-white">
        <CardHeader className="bg-white border-b border-slate-100 pb-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle className="text-lg">Détails des passages</CardTitle>
              <CardDescription>Liste de tous les étudiants ayant soumis ce quiz</CardDescription>
            </div>
            <FileSpreadsheet className="h-5 w-5 text-slate-400" />
          </div>
          
          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50 p-3 rounded-lg border border-slate-100">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input placeholder="Rechercher un élève..." className="pl-9 bg-white" />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Select defaultValue="tous">
                <SelectTrigger className="w-[150px] bg-white">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tous">Tous les élèves</SelectItem>
                  <SelectItem value="reussi">Réussi (≥ 10)</SelectItem>
                  <SelectItem value="echoue">À revoir (&lt; 10)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                <TableHead className="font-semibold text-slate-700">Étudiant</TableHead>
                <TableHead className="font-semibold text-slate-700">Date et Heure</TableHead>
                <TableHead className="font-semibold text-slate-700">Statut</TableHead>
                <TableHead className="text-right font-semibold text-slate-700">Score Final</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((result) => (
                <TableRow key={result.id} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell>
                    <div className="font-medium text-slate-900">{result.name}</div>
                    <div className="text-xs text-slate-500">{result.email}</div>
                  </TableCell>
                  <TableCell className="text-slate-600">{result.date}</TableCell>
                  <TableCell>
                    {result.score >= 10 ? (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-none">Réussi</Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-none">À revoir</Badge>
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
