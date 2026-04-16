"use client"

import * as React from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Mail, ArrowRight, ShieldCheck } from "lucide-react"

export default function ResetPasswordPage() {
  const [email, setEmail] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState(false)

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/update-password`,
    })

    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
    }

    setLoading(false)
  }

  if (success) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center shadow-2xl">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--success)]/10 text-[var(--success)]">
          <ShieldCheck className="h-8 w-8" />
        </div>
        <h2 className="font-display text-3xl font-bold text-[var(--foreground)]">Email Sent</h2>
        <p className="mt-4 text-[var(--muted)]">
          If an account exists for <span className="font-semibold text-[var(--foreground)]">{email}</span>, you will receive a password reset link shortly.
        </p>
        <div className="mt-8">
          <Link href="/auth/login">
            <Button className="w-full">Return to login</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-2xl">
      <div className="mb-8 flex flex-col items-center justify-center text-center">
        <h2 className="font-display text-3xl font-bold text-[var(--foreground)]">Reset Password</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">Enter your email address to receive a secure reset link.</p>
      </div>

      <form onSubmit={handleReset} className="space-y-6">
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">Registered Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
            <Input 
              type="email" 
              required 
              className="pl-10" 
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div className="rounded-md bg-[var(--danger)]/10 p-3 text-sm text-[var(--danger)]">
            {error}
          </div>
        )}

        <Button type="submit" className="w-full text-base font-semibold" disabled={loading}>
           {loading ? "Sending link..." : (
             <>Send Reset Link <ArrowRight className="ml-2 h-4 w-4" /></>
           )}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-[var(--muted)]">
        Remembered your password?{" "}
        <Link href="/auth/login" className="font-semibold text-[var(--foreground)] hover:text-[var(--accent)]">
          Back to login
        </Link>
      </div>
    </div>
  )
}
