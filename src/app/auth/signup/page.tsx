"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { UserPlus, Mail, Lock, User, Phone } from "lucide-react"

export default function SignupPage() {
  const [fullName, setFullName] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState(false)
  
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const supabase = createClient()
    
    // 1. Register with Auth
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    // 2. Insert into profiles (will ideally fire via Supabase triggers but we do it manually or assume RLS doesn't block if public)
    // Actually, it's a best practice to have a Supabase Postgres trigger "on auth.users insert -> profiles insert".
    // For simplicity here, we assume the trigger is implemented or handled by a backend hook. 
    // However, if we do it here:
    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: data.user.id,
        full_name: fullName,
        email,
        phone,
        role: 'customer'
      })
      if (profileError) {
          // just log
          console.error(profileError)
      }
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center shadow-2xl">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--success)]/10 text-[var(--success)]">
          <Mail className="h-8 w-8" />
        </div>
        <h2 className="font-display text-3xl font-bold text-[var(--foreground)]">Check your inbox</h2>
        <p className="mt-4 text-[var(--muted)]">
          We've sent a verification link to <span className="font-semibold text-[var(--foreground)]">{email}</span>.
          Please verify your email to activate your account.
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
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent)]/10 text-[var(--accent)]">
          <UserPlus className="h-6 w-6" />
        </div>
        <h2 className="font-display text-3xl font-bold text-[var(--foreground)]">Create an Account</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">Join Krishnnad Syndicate exclusive client portal.</p>
      </div>

      <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
            <Input 
              required 
              className="pl-10" 
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
        </div>

        <div>
           <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">Phone Number</label>
           <div className="relative">
             <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
             <Input 
               required 
               type="tel"
               className="pl-10" 
               placeholder="+234 ..."
               value={phone}
               onChange={(e) => setPhone(e.target.value)}
             />
           </div>
        </div>

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
          <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
            <Input 
              type="password" 
              required 
              minLength={8}
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

        <Button type="submit" className="w-full mt-2 text-base font-semibold" disabled={loading}>
          {loading ? "Creating Account..." : "Create Account"}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-[var(--muted)]">
        Already have an account?{" "}
        <Link href="/auth/login" className="font-semibold text-[var(--foreground)] hover:text-[var(--accent)]">
          Sign In
        </Link>
      </div>
    </div>
  )
}
