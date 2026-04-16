"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  BarChart3, 
  Dog, 
  ShoppingCart, 
  MessageSquare, 
  Image as ImageIcon, 
  Tags, 
  Settings, 
  LogOut,
  Menu,
  X
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import { logoutAction } from "@/app/auth/actions"

const adminLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/admin/dogs", label: "Dog Listings", icon: Dog },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/enquiries", label: "Enquiries", icon: MessageSquare },
  { href: "/admin/breeds", label: "Breeds Library", icon: Tags },
  { href: "/admin/media", label: "Media Library", icon: ImageIcon },
  { href: "/admin/settings", label: "Site Settings", icon: Settings },
]

export function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false)

  const handleLogout = () => {
    // In real app, we'd log out via Supabase
    window.location.href = "/auth/login?logout=true"
  }

  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/80 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 flex-col border-r border-[var(--border)] bg-[var(--surface)] transition-transform duration-300 lg:static lg:flex lg:translate-x-0",
        isSidebarOpen ? "translate-x-0 flex" : "-translate-x-full hidden"
      )}>
        <div className="flex h-20 shrink-0 items-center border-b border-[var(--border)] px-6">
          <Link href="/admin/dashboard" className="flex flex-col">
            <span className="font-display text-2xl font-bold tracking-tight text-[var(--accent)]">
              Krishnnad
            </span>
            <span className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">
              Admin Console
            </span>
          </Link>
          <button 
            className="ml-auto lg:hidden text-[var(--muted)]"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {adminLinks.map((link) => {
            const isActive = pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-[var(--accent)]/10 text-[var(--accent)] font-semibold" 
                    : "text-[var(--foreground)] hover:bg-[var(--surface-2)] hover:text-[var(--accent)]"
                )}
                onClick={() => setIsSidebarOpen(false)}
              >
                <link.icon className={cn("h-5 w-5", isActive ? "text-[var(--accent)]" : "text-[var(--muted)] group-hover:text-[var(--accent)]")} />
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-[var(--border)] p-4">
          <form action={logoutAction}>
            <Button 
              type="submit"
              variant="ghost" 
              className="w-full justify-start gap-3 text-[var(--muted)] hover:text-[var(--danger)] hover:bg-[var(--danger)]/10"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </Button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex w-full flex-1 flex-col overflow-hidden">
        
        {/* Top Navbar */}
        <header className="flex h-20 shrink-0 items-center gap-4 border-b border-[var(--border)] bg-[var(--surface)] px-4 sm:px-6 lg:px-8">
          <button
            className="lg:hidden text-[var(--foreground)]"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="ml-auto flex items-center gap-4">
             <div className="text-right hidden sm:block">
               <p className="text-sm font-semibold text-[var(--foreground)]">Admin User</p>
               <p className="text-xs text-[var(--success)] flex items-center justify-end gap-1">
                 <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)]"></span> Online
               </p>
             </div>
             <div className="h-10 w-10 rounded-full bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center font-bold text-[var(--accent)]">
               A
             </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
