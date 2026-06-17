"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Playfair_Display } from "next/font/google"
import { Mail, Lock, User, Users, GraduationCap, Eye, EyeOff, ArrowLeft } from "lucide-react"
import { registerSchema, type RegisterFormValues } from "@/lib/schemas"
import { Switch } from "@/components/ui/switch"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700"],
})

function AppLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
      <line x1="10" y1="6.5" x2="14" y2="6.5" />
      <line x1="10" y1="17.5" x2="14" y2="17.5" />
      <line x1="6.5" y1="10" x2="6.5" y2="14" />
      <line x1="17.5" y1="10" x2="17.5" y2="14" />
    </svg>
  )
}

function PasswordInput({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (value: string) => void
  placeholder: string
}) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="relative">
      <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#707070]" />
      <input
        type={visible ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-[#707070]/25 bg-white py-3.5 pl-12 pr-12 text-[#2D2D2D] placeholder:text-[#707070]/50 outline-none transition-shadow focus:ring-2 focus:ring-[#4DA091]/20"
      />
      <button
        type="button"
        onClick={() => setVisible(!visible)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#707070] transition-colors hover:text-[#2D2D2D]"
        aria-label={visible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
      >
        {visible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
      </button>
    </div>
  )
}

export default function RegisterPage() {
  const router = useRouter()

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      isTeacher: true,
    },
  })

  const isTeacher = form.watch("isTeacher")

  const onSubmit = (data: RegisterFormValues) => {
    const destination = data.isTeacher ? "/teacher" : "/student"
    router.push(destination)
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-[#F9F7F2] lg:flex-row">
      <div
        className={`flex flex-1 flex-col justify-between px-8 py-10 text-white transition-colors lg:px-12 lg:py-14 ${
          isTeacher ? "bg-[#C46A42]" : "bg-[#4DA091]"
        }`}
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/30">
          <AppLogo className="h-5 w-5 text-white" />
        </div>

        <div className="my-12 lg:my-0 lg:max-w-sm">
          {isTeacher ? (
            <GraduationCap className="mb-6 h-10 w-10 text-white" strokeWidth={1.5} />
          ) : (
            <Users className="mb-6 h-10 w-10 text-white" strokeWidth={1.5} />
          )}
          <h1 className={`${playfair.className} text-3xl font-bold leading-tight lg:text-4xl`}>
            Rejoignez QuizMaster.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-white/85">
            {isTeacher
              ? "Quelques informations pour créer votre compte enseignant."
              : "Quelques informations pour créer votre compte étudiant."}
          </p>
        </div>

        <div className="hidden lg:block" />
      </div>

      <div className="relative flex flex-1 flex-col justify-center px-8 py-10 lg:px-14">
        <div className="absolute right-6 top-6 lg:right-10 lg:top-8">
          <Link
            href="/auth"
            className="flex items-center gap-2 text-sm font-medium text-[#2D2D2D] transition-colors hover:text-[#4DA091]"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à la connexion
          </Link>
        </div>

        <div className="mx-auto w-full max-w-md pt-10 lg:pt-0">
          <div className="mb-8">
            <h2 className={`${playfair.className} text-3xl font-bold text-[#2D2D2D]`}>
              Créer un compte
            </h2>
            <p className="mt-2 text-sm text-[#707070]">
              Renseignez vos informations pour commencer.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <div className="flex w-full items-center justify-between rounded-full bg-[#EDE8DF] px-5 py-3">
                <button
                  type="button"
                  onClick={() => form.setValue("isTeacher", false)}
                  className={`text-sm transition-colors ${
                    !isTeacher ? "font-bold text-[#2D2D2D]" : "font-medium text-[#707070]"
                  }`}
                >
                  Étudiant
                </button>
                <Switch
                  id="role-switch"
                  checked={isTeacher}
                  onCheckedChange={(checked) => form.setValue("isTeacher", checked)}
                  className="h-6 w-11 shrink-0 border-0 bg-[#4DA091] data-[state=checked]:bg-[#4DA091] data-[state=unchecked]:bg-[#4DA091] [&>span]:size-5 [&>span]:bg-white [&>span]:data-[state=checked]:translate-x-5 [&>span]:data-[state=unchecked]:translate-x-0.5"
                />
                <button
                  type="button"
                  onClick={() => form.setValue("isTeacher", true)}
                  className={`text-sm transition-colors ${
                    isTeacher ? "font-bold text-[#2D2D2D]" : "font-medium text-[#707070]"
                  }`}
                >
                  Enseignant
                </button>
              </div>

              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-[#2D2D2D]">
                      Nom complet
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#707070]" />
                        <input
                          {...field}
                          type="text"
                          placeholder="Votre nom et prénom"
                          className="w-full rounded-xl border border-[#707070]/25 bg-white py-3.5 pl-12 pr-4 text-[#2D2D2D] placeholder:text-[#707070]/50 outline-none transition-shadow focus:ring-2 focus:ring-[#4DA091]/20"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-[#2D2D2D]">
                      Adresse e-mail
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#707070]" />
                        <input
                          {...field}
                          type="email"
                          placeholder="vous@etablissement.ma"
                          className="w-full rounded-xl border border-[#707070]/25 bg-white py-3.5 pl-12 pr-4 text-[#2D2D2D] placeholder:text-[#707070]/50 outline-none transition-shadow focus:ring-2 focus:ring-[#4DA091]/20"
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
                    <FormLabel className="text-sm font-semibold text-[#2D2D2D]">
                      Mot de passe
                    </FormLabel>
                    <FormControl>
                      <PasswordInput
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="8 caractères minimum"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-[#2D2D2D]">
                      Confirmation du mot de passe
                    </FormLabel>
                    <FormControl>
                      <PasswordInput
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Ressaisissez le mot de passe"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <button
                type="submit"
                className={`w-full rounded-xl py-3.5 text-base font-semibold text-white shadow-md transition-opacity hover:opacity-90 ${
                  isTeacher ? "bg-[#C46A42]" : "bg-[#4DA091]"
                }`}
              >
                Créer mon compte
              </button>
            </form>
          </Form>

          <p className="mt-8 text-center text-sm text-[#707070]">
            Vous avez déjà un compte ?{" "}
            <Link href="/auth" className="font-semibold text-[#4DA091] hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
