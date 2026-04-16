"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Package, Heart, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"

const accountLinks = [
  { href: "/account/orders", label: "My Orders", icon: Package },
  { href: "/account/wishlist", label: "Wishlist", icon: Heart },
  { href: "/account/settings", label: "Account Settings", icon: Settings },
]

export function AccountLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const handleLogout = () => {
    // In real app, logout via Supabase
    window.location.href = "/auth/login?logout=true"
  }

  return (
    <main className="container mx-auto flex-1 px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row gap-12">
          
          {/* Sidebar */}
          <aside className="w-full shrink-0 md:w-64 space-y-6">
            <div>
                <h2 className="text-xl font-display font-bold text-[var(--foreground)]">My Account</h2>
                <p className="text-sm text-[var(--muted)]">Manage your preferences.</p>
            </div>

            <nav className="flex flex-col space-y-2">
                {accountLinks.map((link) => {
                  const isActive = pathname.startsWith(link.href)
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "group flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition-colors",
                        isActive 
                          ? "bg-[var(--surface-2)] text-[var(--foreground)] font-semibold border border-[var(--border)]" 
                          : "text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--foreground)]"
                      )}
                    >
                      <link.icon className={cn("h-4 w-4", isActive ? "text-[var(--accent)]" : "group-hover:text-[var(--accent)]")} />
                      {link.label}
                    </Link>
                  )
                })}
            </nav>

            <div className="pt-6 border-t border-[var(--border)]">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start gap-3 text-[var(--muted)] hover:text-[var(--danger)] hover:bg-[var(--danger)]/10"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
            </div>
          </aside>

          {/* Content */}
          <div className="flex-1">
            {children}
          </div>
      </div>
    </main>
  )
}
