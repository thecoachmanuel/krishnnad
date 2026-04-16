"use client"

import * as React from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Heart, User, LayoutDashboard, LogOut, ArrowRight, Dog } from "lucide-react"

import { Button } from "@/components/ui/Button"

interface MobileMenuProps {
  user: any
  isAdmin: boolean
  siteName: string
  links: { label: string; href: string }[]
}

export function MobileMenu({ user, isAdmin, siteName, links }: MobileMenuProps) {
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
              className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md md:hidden"
            />

            {/* Menu Content */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 z-[101] w-full max-w-[320px] bg-[var(--background)] border-l border-[var(--border)] p-8 flex flex-col md:hidden"
            >
              <div className="flex items-center justify-between mb-12">
                <span className="font-display text-xl font-black uppercase tracking-tight text-[var(--accent)]">
                   {siteName}
                </span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full border border-[var(--border)]"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <nav className="flex flex-col gap-6">
                {links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-2xl font-black uppercase tracking-widest text-[var(--foreground)] hover:text-[var(--accent)] transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-auto space-y-8">
                 {/* Authentication Context */}
                 <div className="pt-8 border-t border-[var(--border)] space-y-4">
                    {user ? (
                       <div className="flex flex-col gap-3">
                          {isAdmin && (
                            <Link href="/admin/dashboard" onClick={() => setIsOpen(false)}>
                               <Button variant="outline" className="w-full justify-start gap-3 h-14 rounded-2xl border-[var(--accent)]/30 text-[var(--accent)] font-bold">
                                  <LayoutDashboard className="h-5 w-5" /> Admin Console
                               </Button>
                            </Link>
                          )}
                          <Link href="/account" onClick={() => setIsOpen(false)}>
                            <Button variant="ghost" className="w-full justify-start gap-3 h-14 rounded-2xl text-[var(--foreground)] font-bold">
                               <User className="h-5 w-5" /> My Account
                            </Button>
                          </Link>
                          <form action="/auth/signout" method="post" className="w-full">
                            <Button type="submit" variant="ghost" className="w-full justify-start gap-3 h-14 rounded-2xl text-[var(--danger)]/60 font-bold hover:bg-[var(--danger)]/10">
                               <LogOut className="h-5 w-5" /> Sign Out
                            </Button>
                          </form>
                       </div>
                    ) : (
                       <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                          <Button className="w-full h-14 text-lg font-black uppercase tracking-widest bg-[var(--foreground)] text-black">
                             Sign In
                          </Button>
                       </Link>
                    )}
                 </div>

                 {/* Primary CTA */}
                 <Link href="/dogs" onClick={() => setIsOpen(false)}>
                    <Button className="w-full h-16 rounded-3xl bg-[var(--accent)] text-black font-black uppercase tracking-widest text-base shadow-xl shadow-[var(--accent)]/20">
                       Reserve Dog <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                 </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
