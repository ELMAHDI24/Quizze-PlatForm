"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Mail, Lock, ArrowRight } from "lucide-react"
import { loginSchema, type LoginFormValues } from "@/lib/schemas"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"

export default function AuthPage() {
  const router = useRouter()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      isStudent: false,
      rememberSession: false,
    },
  })

  const isStudent = form.watch("isStudent")

  const onSubmit = (data: LoginFormValues) => {
    const destination = data.isStudent ? "/student" : "/teacher"
    router.push(destination)
  }

  return (
    <div className="relative min-h-screen bg-[#F9F7F2] overflow-hidden">
      <div
        className="pointer-events-none absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(circle, #F5C4A8 0%, transparent 70%)" }}
      />
      <div
        className="pointer-events-none absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(circle, #A8D5CC 0%, transparent 70%)" }}
      />

      <div className="relative z-10 flex min-h-screen flex-col lg:flex-row">
        <div className="flex flex-1 flex-col justify-between px-8 py-10 lg:px-16 lg:py-14">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#D98466] to-[#4DA091] shadow-sm">
            <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-white" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
              <line x1="10" y1="6.5" x2="14" y2="6.5" />
              <line x1="10" y1="17.5" x2="14" y2="17.5" />
              <line x1="6.5" y1="10" x2="6.5" y2="14" />
              <line x1="17.5" y1="10" x2="17.5" y2="14" />
            </svg>
          </div>

          <div className="my-12 lg:my-0 lg:max-w-md">
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-[#2D2D2D] lg:text-5xl">
              Gérez vos quiz
              <br />
              <span className="bg-gradient-to-r from-[#4DA091] to-[#D98466] bg-clip-text text-transparent">
                avec précision.
              </span>
            </h1>
            <p className="mt-5 text-base leading-relaxed text-[#707070] lg:text-lg">
              Rejoignez des milliers d&apos;équipes qui utilisent QuizMaster pour
              simplifier leurs évaluations et booster la productivité.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {["A", "B", "C", "D"].map((letter) => (
                <div
                  key={letter}
                  className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#F9F7F2] bg-[#A8D5CC] text-sm font-semibold text-white"
                >
                  {letter}
                </div>
              ))}
            </div>
            <div>
              <p className="text-sm font-bold text-[#2D2D2D]">10k+ Utilisateurs</p>
              <p className="text-xs text-[#707070]">Nous font confiance</p>
            </div>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center px-8 py-10 lg:px-16">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-[#2D2D2D]">Bienvenu</h2>
              <p className="mt-2 text-[#707070]">
                Veuillez entrer vos identifiants pour vous connecter.
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Role toggle — Radix Switch (Enseignant / Étudiant) */}
                <div className="mb-2 flex items-center justify-center gap-3 rounded-2xl bg-white/60 px-4 py-3 shadow-sm">
                  <Label
                    htmlFor="role-switch"
                    className={`text-sm font-medium transition-colors ${!isStudent ? "text-[#2D2D2D]" : "text-[#707070]"}`}
                  >
                    Enseignant
                  </Label>
                  <Switch
                    id="role-switch"
                    checked={isStudent}
                    onCheckedChange={(checked) =>
                      form.setValue("isStudent", checked)
                    }
                    className="data-[state=checked]:bg-[#4DA091]"
                  />
                  <Label
                    htmlFor="role-switch"
                    className={`text-sm font-medium transition-colors ${isStudent ? "text-[#2D2D2D]" : "text-[#707070]"}`}
                  >
                    Étudiant
                  </Label>
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#707070]" />
                          <input
                            {...field}
                            type="email"
                            placeholder="Adresse email"
                            className="w-full rounded-2xl border border-transparent bg-white py-3.5 pl-12 pr-4 text-[#2D2D2D] placeholder:text-[#707070]/60 shadow-sm outline-none transition-shadow focus:shadow-md focus:ring-2 focus:ring-[#4DA091]/20"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#707070]" />
                          <input
                            {...field}
                            type="password"
                            placeholder="Mot de passe"
                            className="w-full rounded-2xl border border-transparent bg-white py-3.5 pl-12 pr-4 text-[#2D2D2D] placeholder:text-[#707070]/60 shadow-sm outline-none transition-shadow focus:shadow-md focus:ring-2 focus:ring-[#4DA091]/20"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-between pt-1">
                  <FormField
                    control={form.control}
                    name="rememberSession"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            id="remember-session"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="border-[#707070]/40 data-[state=checked]:bg-[#4DA091] data-[state=checked]:border-[#4DA091]"
                          />
                        </FormControl>
                        <FormLabel htmlFor="remember-session" className="cursor-pointer text-sm font-normal text-[#707070]">
                          Se souvenir de moi
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                  <Link href="/auth/forgot-password" className="text-sm font-medium text-[#4DA091] hover:underline">
                    Mot de passe oublié ?
                  </Link>
                </div>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#D98466] to-[#4DA091] py-3.5 text-base font-semibold text-white shadow-md transition-opacity hover:opacity-90"
                >
                  Se connecter
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            </Form>

            <p className="mt-8 text-center text-sm text-[#707070]">
              Vous n&apos;avez pas de compte ?{" "}
              <Link href="/auth/register" className="font-semibold text-[#4DA091] hover:underline">
                Créer un compte gratuit
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
