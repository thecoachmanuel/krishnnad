"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Heart, User, LayoutDashboard, LogOut, ArrowRight, Package, Settings, ShieldCheck, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/Button"
import { logoutAction } from "@/app/auth/actions"

interface MobileMenuProps {
  user: any
  isAdmin: boolean
  siteName: string
  logoUrl?: string
  links: { label: string; href: string }[]
}

export function MobileMenu({ 
  user, 
  isAdmin, 
  siteName, 
  logoUrl, 
  links 
}: MobileMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Prevent scroll when menu is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  return (
    <>
      <Button 
        variant="ghost" 
        size="icon" 
        className="md:hidden h-12 w-12 text-[var(--foreground)]"
        onClick={() => setIsOpen(true)}
      >
        <Menu className="h-7 w-7" />
      </Button>

      {mounted && createPortal(
        <AnimatePresence mode="wait">
          {isOpen && (
            <div className="fixed inset-0 z-[99999] md:hidden">
            {/* Backdrop - 100% Opaque & Heavy Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black backdrop-blur-2xl"
            />

            {/* Menu Content - 100% Solid & Full Width */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.8 }}
              className="absolute inset-y-0 right-0 w-full bg-[#0E0E12] border-l-2 border-[var(--accent)]/30 flex flex-col shadow-[0_0_100px_rgba(0,0,0,1)] overflow-y-auto"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-8 border-b border-white/5">
                <div className="flex items-center gap-4">
                  {logoUrl && (
                    <img src={logoUrl} alt="" className="h-10 w-auto object-contain" />
                  )}
                  <span className="font-display text-lg font-black uppercase tracking-tight text-[var(--foreground)]">
                    {siteName}
                  </span>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-12 w-12 rounded-full border border-white/10 text-[var(--muted)] hover:text-white"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>

              {/* Main Navigation */}
              <nav className="flex flex-col p-8 gap-1">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted)] mb-4">Discover Syndicate</p>
                {links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="group flex items-center justify-between py-4 border-b border-white/5 last:border-none"
                  >
                    <span className="text-2xl font-black uppercase tracking-widest text-[var(--foreground)] group-hover:text-[var(--accent)] transition-all">
                      {link.label}
                    </span>
                    <ChevronRight className="h-5 w-5 text-[var(--muted)] opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0" />
                  </Link>
                ))}
              </nav>

              <div className="mt-auto p-8 space-y-8 bg-white/5 border-t border-white/5">
                 {/* Authentication & Account Context */}
                 <div className="space-y-4">
                    {user ? (
                       <div className="space-y-4">
                          <div className="flex items-center gap-3 px-2">
                             <div className="h-10 w-10 rounded-full bg-[var(--accent)] flex items-center justify-center text-black font-black uppercase">
                                {user.email?.charAt(0)}
                             </div>
                             <div>
                                <p className="text-[10px] font-black uppercase text-[var(--muted)]">Active Session</p>
                                <p className="text-sm font-bold text-[var(--foreground)] truncate max-w-[180px]">{user.email}</p>
                             </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                             {isAdmin && (
                               <Link href="/admin/dashboard" onClick={() => setIsOpen(false)} className="col-span-2">
                                  <Button variant="outline" className="w-full justify-start gap-3 h-14 rounded-2xl border-[var(--accent)]/30 bg-[var(--accent)]/5 text-[var(--accent)] font-black uppercase text-[10px] tracking-widest">
                                     <LayoutDashboard className="h-5 w-5" /> Admin Dashboard
                                  </Button>
                               </Link>
                             )}
                             
                             <Link href="/account/orders" onClick={() => setIsOpen(false)}>
                               <Button variant="ghost" className="w-full flex-col h-20 rounded-2xl bg-white/5 text-[var(--foreground)] hover:bg-white/10 font-bold gap-1">
                                  <Package className="h-5 w-5 text-[var(--accent)]" /> 
                                  <span className="text-[10px] uppercase tracking-tighter">Orders</span>
                               </Button>
                             </Link>

                             <Link href="/account/wishlist" onClick={() => setIsOpen(false)}>
                               <Button variant="ghost" className="w-full flex-col h-20 rounded-2xl bg-white/5 text-[var(--foreground)] hover:bg-white/10 font-bold gap-1">
                                  <Heart className="h-5 w-5 text-[var(--danger)]" /> 
                                  <span className="text-[10px] uppercase tracking-tighter">Wishlist</span>
                               </Button>
                             </Link>

                              <Link href="/account/settings" onClick={() => setIsOpen(false)} className="col-span-2">
                                <Button variant="ghost" className="w-full justify-start gap-3 h-12 rounded-xl text-[var(--foreground)] hover:text-[var(--accent)] font-bold">
                                   <User className="h-4 w-4" /> My Account
                                </Button>
                              </Link>

                              <form action={logoutAction} className="w-full col-span-2">
                                <Button type="submit" variant="ghost" className="w-full justify-start gap-3 h-12 rounded-xl text-[var(--danger)]/70 hover:text-[var(--danger)] hover:bg-[var(--danger)]/10 font-bold">
                                   <LogOut className="h-4 w-4" /> Sign Out
                                </Button>
                              </form>
                          </div>
                       </div>
                    ) : (
                       <div className="flex flex-col gap-3">
                         <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                            <Button className="w-full h-14 text-sm font-black uppercase tracking-widest bg-[var(--accent)] text-black rounded-2xl hover:scale-[1.02] transition-transform">
                               Log In
                            </Button>
                         </Link>
                         <Link href="/auth/signup" onClick={() => setIsOpen(false)}>
                            <Button variant="outline" className="w-full h-14 text-sm font-black uppercase tracking-widest border-[var(--border)] text-white rounded-2xl hover:bg-white/5 transition-colors">
                               Sign Up
                            </Button>
                         </Link>
                       </div>
                    )}
                 </div>

                 {/* Primary CTA */}
                 {!isAdmin && (
                   <Link href="/dogs" onClick={() => setIsOpen(false)}>
                      <Button className="w-full h-18 rounded-[2rem] bg-[var(--accent)] text-black font-black uppercase tracking-widest text-base shadow-2xl shadow-[var(--accent)]/30 hover:scale-[1.02] transition-transform">
                         Adopt a Puppy <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                   </Link>
                 )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>,
      document.body
    )}
  </>
  )
}
