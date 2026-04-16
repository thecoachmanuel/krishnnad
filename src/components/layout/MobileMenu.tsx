"use client"

import * as React from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Heart, User, LayoutDashboard, LogOut, ArrowRight, Package, Settings } from "lucide-react"

import { Button } from "@/components/ui/Button"

interface MobileMenuProps {
  user: any
  isAdmin: boolean
  siteName: string
  logoUrl?: string
  links: { label: string; href: string }[]
}

export function MobileMenu({ user, isAdmin, siteName, logoUrl, links }: MobileMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false)

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

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm md:hidden"
            />

            {/* Menu Content */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.8 }}
              className="fixed inset-y-0 right-0 z-[101] w-full max-w-[340px] bg-[#0A0A0B] border-l border-white/5 p-8 flex flex-col md:hidden shadow-2xl shadow-black/100"
            >
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-3">
                  {logoUrl && (
                    <img src={logoUrl} alt="" className="h-8 w-auto object-contain" />
                  )}
                  <span className="font-display text-xl font-black uppercase tracking-tight text-[var(--foreground)]">
                    {siteName}
                  </span>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full border border-white/10 text-[var(--muted)] hover:text-white"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Main Links */}
              <nav className="flex flex-col gap-6 mb-12">
                {links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-3xl font-black uppercase tracking-widest text-[var(--foreground)] hover:text-[var(--accent)] transition-all active:scale-95 origin-left"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-auto space-y-8">
                 {/* Authentication Context (My Account Section) */}
                 <div className="pt-8 border-t border-white/5 space-y-4">
                    {user ? (
                       <div className="space-y-4">
                          <p className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)] px-1">My Account</p>
                          <div className="grid gap-2">
                             {isAdmin && (
                               <Link href="/admin/dashboard" onClick={() => setIsOpen(false)}>
                                  <Button variant="outline" className="w-full justify-start gap-3 h-14 rounded-2xl border-[var(--accent)]/30 bg-[var(--accent)]/5 text-[var(--accent)] font-bold">
                                     <LayoutDashboard className="h-5 w-5" /> Admin Console
                                  </Button>
                               </Link>
                             )}
                             
                             <Link href="/account/orders" onClick={() => setIsOpen(false)}>
                               <Button variant="ghost" className="w-full justify-start gap-3 h-12 rounded-xl text-[var(--foreground)] hover:bg-white/5 font-bold">
                                  <Package className="h-4 w-4 text-[var(--muted)]" /> My Orders
                               </Button>
                             </Link>

                             <Link href="/account/wishlist" onClick={() => setIsOpen(false)}>
                               <Button variant="ghost" className="w-full justify-start gap-3 h-12 rounded-xl text-[var(--foreground)] hover:bg-white/5 font-bold">
                                  <Heart className="h-4 w-4 text-[var(--muted)]" /> Wishlist
                               </Button>
                             </Link>

                             <Link href="/account/settings" onClick={() => setIsOpen(false)}>
                               <Button variant="ghost" className="w-full justify-start gap-3 h-12 rounded-xl text-[var(--foreground)] hover:bg-white/5 font-bold">
                                  <Settings className="h-4 w-4 text-[var(--muted)]" /> Settings
                               </Button>
                             </Link>

                             <form action="/auth/signout" method="post" className="w-full pt-2">
                               <Button type="submit" variant="ghost" className="w-full justify-start gap-3 h-12 rounded-xl text-[var(--danger)]/70 hover:text-[var(--danger)] hover:bg-[var(--danger)]/10 font-bold">
                                  <LogOut className="h-4 w-4" /> Sign Out from Syndicate
                               </Button>
                             </form>
                          </div>
                       </div>
                    ) : (
                       <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                          <Button className="w-full h-16 text-lg font-black uppercase tracking-widest bg-[var(--foreground)] text-black rounded-3xl">
                             Authentication Hub
                          </Button>
                       </Link>
                    )}
                 </div>

                 {/* Primary CTA */}
                 {!isAdmin && (
                   <Link href="/dogs" onClick={() => setIsOpen(false)}>
                      <Button className="w-full h-16 rounded-3xl bg-[var(--accent)] text-black font-black uppercase tracking-widest text-base shadow-xl shadow-[var(--accent)]/20">
                         Reserve Dog <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                   </Link>
                 )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
