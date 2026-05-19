"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Field,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"

import { Input } from "@/components/ui/input"
import { Logo } from "@/components/shared/Logo"

// ───────────────── schema ─────────────────
const formSchema = z.object({
  email: z.email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
})

// ───────────────── component ─────────────────
const SignupForm = () => {
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),

    defaultValues: {
      email: "",
      password: "",
    },
  })

  function onSubmit(data: z.infer<typeof formSchema>) {
    // GET existing users
    const users = JSON.parse(
      localStorage.getItem("habit-tracker-users") ?? "[]"
    )

    // check if user already exists
    const exists = users.find(
      (u: { email: string }) => u.email === data.email
    )

    // duplicate email
    if (exists) {
      form.setError("email", {
        message: "User already exists",
      })

      return
    }

    // create new user
    const newUser = {
      id: crypto.randomUUID(),
      email: data.email,
      password: data.password,
      createdAt: new Date().toISOString(),
    }

    // save updated users
    localStorage.setItem(
      "habit-tracker-users",
      JSON.stringify([...users, newUser])
    )

    // create session
    const session = {
      userId: newUser.id,
      email: newUser.email,
    }

    localStorage.setItem(
      "habit-tracker-session",
      JSON.stringify(session)
    )

    // redirect
    router.push("/dashboard")
  }

  return (
    <main className="min-h-screen bg-background px-3 sm:px-6">

      <div className="mx-auto flex min-h-screen w-full max-w-md items-center justify-center py-6 sm:py-10">

        <div className="w-full">

          {/* Header */}
          <div className="mb-6 flex flex-col items-center text-center sm:mb-8">
            <Logo size={44} />

            <h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
              Create Account
            </h1>

            <p className="mt-2 text-sm text-text-muted sm:text-base">
              Start tracking your habits today
            </p>
          </div>

          {/* Card */}
          <Card className="w-full rounded-2xl border shadow-sm">

            <CardHeader className="space-y-1 px-5 pt-5 sm:px-6 sm:pt-6">

              <CardTitle className="text-xl">
                Sign Up
              </CardTitle>

              <CardDescription className="text-sm">
                Enter your details to create an account.
              </CardDescription>

            </CardHeader>

            <CardContent className="px-5 pb-5 sm:px-6 sm:pb-6">

              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >

                {/* Email */}
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>

                      <FieldLabel htmlFor="signup-email">
                        Email
                      </FieldLabel>

                      <Input
                        {...field}
                        id="signup-email"
                        type="email"
                        placeholder="you@example.com"
                        autoComplete="email"
                        aria-invalid={fieldState.invalid}
                        data-testid="auth-signup-email"
                        className="mt-2 h-12 text-base"
                      />

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}

                    </Field>
                  )}
                />

                {/* Password */}
                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>

                      <FieldLabel htmlFor="signup-password">
                        Password
                      </FieldLabel>

                      <Input
                        {...field}
                        id="signup-password"
                        type="password"
                        placeholder="••••••••"
                        autoComplete="new-password"
                        aria-invalid={fieldState.invalid}
                        data-testid="auth-signup-password"
                        className="mt-2 h-12 text-base"
                      />

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}

                    </Field>
                  )}
                />

                {/* Submit */}
                <Button
                  type="submit"
                  className="h-12 w-full text-base font-medium"
                  data-testid="auth-signup-submit"
                >
                  Create Account
                </Button>

              </form>

            </CardContent>
          </Card>

          {/* Login Link */}
          <p className="mt-6 text-center text-sm text-text-muted sm:text-base">
            Already have an account?{" "}

            <a
              href="/login"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Sign in here
            </a>
          </p>

        </div>
      </div>
    </main>
  )
}

export default SignupForm