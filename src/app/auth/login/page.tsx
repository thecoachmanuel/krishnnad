"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { loginAction } from "@/app/auth/actions"

import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { ShieldCheck, Mail, Lock } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  
  const router = useRouter()
  // React 19 / Next.js way to handle searchParams in client components requires fetching them, but we can't await searchParams here without suspense at the root. Next 15 requires searchParams to be Promise in Server Components. We use hook here.
  // We will assume `useSearchParams` works sequentially in Client Components for Next 14/15.
  const searchParams = useSearchParams()
  const redirectTo = searchParams?.get('redirectTo') || '/account/orders'

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const formData = new FormData()
    formData.append("email", email)
    formData.append("password", password)
    
    const result = await loginAction(formData)

    if (result.error) {
      setError(result.error)
      setLoading(false)
      return
    }

    // Role-based routing
    if (result.success) {
      if (result.role === 'admin') {
        router.push('/admin/dashboard')
      } else {
        router.push(redirectTo)
      }
      router.refresh()
    }
  }

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-2xl">
      <div className="mb-8 flex flex-col items-center justify-center text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent)]/10 text-[var(--accent)]">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <h2 className="font-display text-3xl font-bold text-[var(--foreground)]">Welcome Back</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">Please sign in to your Krishnnad Syndicate account.</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">Email address</label>
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

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="block text-sm font-medium text-[var(--foreground)]">Password</label>
            <Link href="/auth/reset-password" className="text-xs font-medium text-[var(--accent)] hover:text-[var(--accent-2)]">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
            <Input 
              type="password" 
              required 
              className="pl-10" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div className="rounded-md bg-[var(--danger)]/10 p-3 text-sm text-[var(--danger)]">
            {error}
          </div>
        )}

        <Button type="submit" className="w-full text-base font-semibold" disabled={loading}>
          {loading ? "Verifying..." : "Sign In"}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-[var(--muted)]">
        Don't have an account?{" "}
        <Link href="/auth/signup" className="font-semibold text-[var(--foreground)] hover:text-[var(--accent)]">
          Create an account
        </Link>
      </div>
    </div>
  )
}
