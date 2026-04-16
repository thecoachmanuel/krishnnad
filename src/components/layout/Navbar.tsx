"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, User, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import { createClient } from "@/lib/supabase/client"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/dogs", label: "Dogs Collection" },
  { href: "/about", label: "Our Story" },
  { href: "/contact", label: "Contact" },
]

export function Navbar() {
  const [user, setUser] = React.useState<any>(null)
  const [role, setRole] = React.useState<string | null>(null)
  const [isOpen, setIsOpen] = React.useState(false)
  const pathname = usePathname()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    setRole(null)
    window.location.href = "/"
  }

  React.useEffect(() => {
    const supabase = createClient()
    
    const fetchProfile = async (userId: string) => {
      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single()
      setRole(data?.role || 'customer')
    }

    // Initial fetch
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      if (user) fetchProfile(user.id)
    })

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setRole(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const isAuthenticated = !!user
  const isAdmin = role === 'admin'

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="font-display text-2xl font-bold tracking-tight text-[var(--accent)]">
              Krishnnad
            </span>
            <span className="font-display flex h-6 items-center rounded-sm bg-[var(--surface-2)] px-2 text-sm font-semibold tracking-widest text-[var(--foreground)] uppercase">
              Syndicate
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex flex-1 items-center justify-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-[var(--accent)]",
                  pathname === link.href ? "text-[var(--accent)]" : "text-[var(--foreground)]"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link href={isAdmin ? "/admin/dashboard" : "/account/orders"}>
                  <Button variant="ghost" size="sm" className="gap-2 text-sm font-medium">
                    <User className="h-4 w-4" /> {isAdmin ? "Admin Dashboard" : "My Account"}
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full text-[var(--muted)] hover:text-[var(--danger)] hover:bg-[var(--danger)]/10"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" className="text-sm">Log in</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button className="text-sm">Sign Up</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden flex items-center p-2 text-[var(--foreground)]"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t border-[var(--border)] bg-[var(--surface)] px-4 py-6 shadow-2xl">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "block px-2 text-base font-medium hover:text-[var(--accent)] transition-colors",
                  pathname === link.href ? "text-[var(--accent)]" : "text-[var(--foreground)]"
                )}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-4 flex flex-col gap-2 pt-4 border-t border-[var(--border)]">
              {isAuthenticated ? (
                <>
                  <Link href={isAdmin ? "/admin/dashboard" : "/account/orders"} onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <User className="h-4 w-4" /> {isAdmin ? "Admin Dashboard" : "My Account"}
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start gap-2 text-[var(--muted)] hover:text-[var(--danger)]"
                    onClick={() => {
                      setIsOpen(false)
                      handleLogout()
                    }}
                  >
                    <LogOut className="h-4 w-4" /> Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full">Log In</Button>
                  </Link>
                  <Link href="/auth/signup" onClick={() => setIsOpen(false)}>
                    <Button className="w-full">Sign Up</Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
