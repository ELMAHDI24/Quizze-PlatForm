import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, KeyRound } from "lucide-react"

export default function ForgotPasswordPage() {
  return (
    <div className="flex-1 flex items-center justify-center p-4 bg-slate-50/50">
      <Card className="w-full max-w-md shadow-xl border-slate-100 text-center">
        <CardHeader className="space-y-4 pb-6">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <KeyRound className="h-6 w-6 text-primary" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold text-slate-800">Mot de passe oublié</CardTitle>
            <CardDescription className="text-slate-500 max-w-[90%] mx-auto">
              Entrez votre adresse email, nous vous enverrons un lien pour réinitialiser votre mot de passe.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-left">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-600">Adresse email</Label>
              <Input id="email" type="email" placeholder="votre@email.fr" className="bg-slate-50/50 border-slate-200 focus-visible:ring-primary/20" />
            </div>
            <Link href="/auth" className="block pt-2">
              <Button className="w-full bg-primary hover:bg-primary/90 text-white shadow-md">
                Envoyer le lien
              </Button>
            </Link>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 border-t border-slate-100 pt-6">
          <Link href="/auth" className="flex items-center gap-2 text-sm text-slate-500 hover:text-primary transition-colors font-medium">
            <ArrowLeft className="h-4 w-4" />
            Retour à la connexion
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
