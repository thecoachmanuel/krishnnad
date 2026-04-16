import * as React from "react"
import Link from "next/link"
import { Heart, User, LayoutDashboard, LogOut } from "lucide-react"

import { Button } from "@/components/ui/Button"
import { createClient } from "@/lib/supabase/server"
import { MobileMenu } from "./MobileMenu"
import { AnnouncementBar } from "./AnnouncementBar"

export async function Navbar() {
  const supabase = await createClient()
  
  // 1. Fetch Dynamic Branding & User
  const { data: { user } } = await supabase.auth.getUser()
  const { data: settingsData } = await supabase
    .from('site_settings')
    .select('*')
    .in('key', ['branding'])

  const branding = settingsData?.find(s => s.key === 'branding')?.value || {}
  const announcement = branding.announcement || "Experience the pinnacle of dog pedigree."
  const siteName = branding.siteName || "Krishnnad Syndicate"

  // 2. Fetch User Profile for Role Check
  let isAdmin = false
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()
    isAdmin = profile?.role === "admin"
  }

  const navLinks = [
    { label: "Collection", href: "/dogs" },
    { label: "Breeds", href: "/dogs?filter=breeds" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" }
  ]

  return (
    <div className="flex flex-col">
       {/* Announcement Bar */}
       <AnnouncementBar text={announcement} />
       
       <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--background)] backdrop-blur-md">
        <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-10">
            <Link href="/" className="flex items-center gap-3">
              {branding.logoUrl && (
                <img 
                  src={branding.logoUrl} 
                  alt="" 
                  className="h-10 w-auto object-contain"
                />
              )}
              <span className="font-display text-lg sm:text-2xl font-black text-[var(--foreground)] uppercase tracking-tighter decoration-[var(--accent)] decoration-4 underline-offset-4 decoration-skip-ink animate-in fade-in slide-in-from-left duration-500">
                {siteName}
              </span>
            </Link>

            <nav className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-xs font-black uppercase tracking-widest text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2">
              {user ? (
                <>
                  {isAdmin && (
                    <Link href="/admin/dashboard">
                      <Button variant="ghost" size="icon" className="h-10 w-10 text-[var(--accent)] hover:bg-[var(--accent)]/10">
                        <LayoutDashboard className="h-5 w-5" />
                      </Button>
                    </Link>
                  )}
                    <Link href="/account">
                      <Button variant="ghost" size="icon" className="h-10 w-10 text-[var(--muted)] hover:text-[var(--foreground)]">
                        <User className="h-5 w-5" />
                      </Button>
                    </Link>
                    <Link href="/account/wishlist">
                      <Button variant="ghost" size="icon" className="h-10 w-10 text-[var(--muted)] hover:text-[var(--foreground)]">
                        <Heart className="h-5 w-5" />
                      </Button>
                    </Link>
                  <form action="/auth/signout" method="post">
                    <Button type="submit" variant="ghost" size="icon" className="h-10 w-10 text-[var(--danger)]/50 hover:text-[var(--danger)] hover:bg-[var(--danger)]/10">
                      <LogOut className="h-5 w-5" />
                    </Button>
                  </form>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/auth/login">
                    <Button variant="ghost" className="text-xs font-black uppercase tracking-widest px-4">
                      Log In
                    </Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button variant="outline" className="text-xs font-black uppercase tracking-widest px-4 border-[var(--border)] hover:bg-[var(--surface-2)]">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            <Link href="/dogs">
              <Button className="hidden sm:flex h-11 px-8 rounded-full border-none bg-black text-white hover:bg-black/90 font-black text-xs uppercase tracking-widest shadow-xl shadow-black/10">
                Adopt a Dog
              </Button>
            </Link>

            {/* Mobile Navigation Trigger */}
            <MobileMenu 
              user={user} 
              isAdmin={isAdmin} 
              siteName={siteName} 
              logoUrl={branding.logoUrl}
              links={navLinks} 
            />
          </div>
        </div>
      </header>
    </div>
  )
}
