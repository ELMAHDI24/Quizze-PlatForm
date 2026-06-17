"use client"

import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Playfair_Display } from "next/font/google"
import { Mail, ArrowLeft } from "lucide-react"
import { forgotPasswordSchema, type ForgotPasswordFormValues } from "@/lib/schemas"
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

export default function ForgotPasswordPage() {
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  })

  const onSubmit = () => {
    // Simulation — envoi du lien de réinitialisation
  }

  return (
    <div className="relative min-h-screen bg-[#F9F7F2]">
      <div className="absolute right-6 top-6 lg:right-10 lg:top-8">
        <Link
          href="/auth"
          className="flex items-center gap-2 text-sm font-medium text-[#2D2D2D] transition-colors hover:text-[#A65E3E]"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à la connexion
        </Link>
      </div>

      <div className="flex min-h-screen items-center justify-center px-4 py-20">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className={`${playfair.className} text-3xl font-bold text-[#2D2D2D] md:text-4xl`}>
              Mot de passe oublié
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-[#707070] md:text-base">
              Saisissez l&apos;adresse e-mail associée à votre compte. Vous recevrez un lien
              pour créer un nouveau mot de passe.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                          className="w-full rounded-xl border border-[#707070]/25 bg-white py-3.5 pl-12 pr-4 text-[#2D2D2D] placeholder:text-[#707070]/50 outline-none transition-shadow focus:ring-2 focus:ring-[#A65E3E]/20"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <button
                type="submit"
                className="w-full rounded-xl bg-[#D6CDBA] py-3.5 text-base font-semibold text-[#2D2D2D] transition-opacity hover:opacity-90"
              >
                Envoyer le lien de réinitialisation
              </button>
            </form>
          </Form>

          <p className="mt-8 text-center text-sm text-[#707070]">
            Vous vous souvenez de votre mot de passe ?{" "}
            <Link href="/auth" className="font-semibold text-[#A65E3E] hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
