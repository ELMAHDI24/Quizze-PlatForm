import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Home } from "lucide-react"

export default function QuizResultPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-lg border-none shadow-xl bg-white text-center overflow-hidden">
        <div className="bg-primary/5 py-12 flex flex-col items-center border-b border-slate-100">
          <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Vous avez terminé !</h1>
          <p className="text-slate-500">Vos réponses ont bien été enregistrées.</p>
        </div>
        
        <CardContent className="pt-10 pb-12 space-y-8">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-widest text-slate-400">Votre Note Finale</p>
            <div className="flex items-baseline justify-center">
              <span className="text-6xl font-black text-slate-900 tracking-tighter">14</span>
              <span className="text-3xl font-medium text-slate-400">/20</span>
            </div>
          </div>
          
          <div className="inline-block px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium">
            Félicitations, vous avez réussi cette évaluation !
          </div>
          
          <div className="pt-4">
            <Link href="/student">
              <Button size="lg" className="w-full h-14 text-lg shadow-md gap-2 bg-slate-800 hover:bg-slate-900 text-white">
                <Home className="h-5 w-5" />
                Retour à l'accueil
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
