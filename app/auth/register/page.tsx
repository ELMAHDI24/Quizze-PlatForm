import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function RegisterPage() {
  return (
    <div className="flex-1 flex items-center justify-center p-4 bg-slate-50/50">
      <Card className="w-full max-w-md shadow-xl border-slate-100">
        <CardHeader className="space-y-2 text-center pb-6">
          <CardTitle className="text-2xl font-bold text-slate-800">Créer un compte</CardTitle>
          <CardDescription className="text-slate-500">
            Rejoignez-nous en tant qu'enseignant ou étudiant
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="teacher" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 p-1 bg-slate-100/80 rounded-xl">
              <TabsTrigger value="teacher" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">Enseignant</TabsTrigger>
              <TabsTrigger value="student" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">Étudiant</TabsTrigger>
            </TabsList>
            
            <TabsContent value="teacher" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name-t" className="text-slate-600">Nom complet</Label>
                  <Input id="name-t" type="text" placeholder="Jean Dupont" className="bg-slate-50/50 border-slate-200 focus-visible:ring-primary/20" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-t" className="text-slate-600">Adresse email</Label>
                  <Input id="email-t" type="email" placeholder="prof@ecole.fr" className="bg-slate-50/50 border-slate-200 focus-visible:ring-primary/20" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-t" className="text-slate-600">Mot de passe</Label>
                  <Input id="password-t" type="password" className="bg-slate-50/50 border-slate-200 focus-visible:ring-primary/20" />
                </div>
                <Link href="/teacher" className="block pt-2">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white shadow-md">S'inscrire comme enseignant</Button>
                </Link>
              </div>
            </TabsContent>
            
            <TabsContent value="student" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name-s" className="text-slate-600">Nom complet</Label>
                  <Input id="name-s" type="text" placeholder="Sophie Martin" className="bg-slate-50/50 border-slate-200 focus-visible:ring-primary/20" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-s" className="text-slate-600">Adresse email</Label>
                  <Input id="email-s" type="email" placeholder="etudiant@ecole.fr" className="bg-slate-50/50 border-slate-200 focus-visible:ring-primary/20" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-s" className="text-slate-600">Mot de passe</Label>
                  <Input id="password-s" type="password" className="bg-slate-50/50 border-slate-200 focus-visible:ring-primary/20" />
                </div>
                <Link href="/student" className="block pt-2">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white shadow-md">S'inscrire comme étudiant</Button>
                </Link>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 border-t border-slate-100 pt-6">
          <div className="text-sm text-center text-slate-500">
            Vous avez déjà un compte ? <Link href="/auth" className="text-primary hover:underline font-medium">Se connecter</Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
