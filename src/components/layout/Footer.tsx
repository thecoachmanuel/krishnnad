"use client"

import * as React from "react"
import Link from "next/link"
import { MessageCircle, Mail, MapPin } from "lucide-react"

const SOCIAL_LINKS = [
  { 
    name: "Instagram", 
    href: "#", 
    icon: (props: any) => (
      <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
      </svg>
    )
  },
  { 
    name: "Facebook", 
    href: "#", 
    icon: (props: any) => (
      <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
      </svg>
    )
  },
  { 
    name: "Twitter", 
    href: "#", 
    icon: (props: any) => (
      <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 4s-1 1-2 1 2-2 2-2-1 1-2 1-1-1-1.1-1c-1-1-2.9-1.2-4-1-1.4.2-2.5 1.1-2.9 2.4-.1.4-.1.8.1 1.2-2.3-.1-4.4-.9-5.9-2.2-.4-.3-.7-.7-.9-1.2-1.3 2.1-.8 4.7 1.1 6.1-.5 0-1-.1-1.4-.4v.1c0 2.1 1.5 4 3.5 4.5-.4.1-.8.1-1.2.1-.3 0-.6 0-.8-.1.6 1.8 2.2 3.1 4.1 3.1-1.8 1.4-4.1 2-6.5 1.7 1.9 1.2 4.1 1.9 6.4 1.9 7.7 0 11.9-6.4 11.9-11.9v-.5c.8-.6 1.5-1.3 2-2.1z"/>
      </svg>
    )
  }
]

export function Footer() {
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <footer className="group/footer bg-[var(--surface)] border-t border-[var(--border)] pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12 text-left">
          
          {/* Brand Info */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-display text-2xl font-bold tracking-tight text-[var(--accent)]">
                Krishnnad
              </span>
              <span className="font-display flex h-6 items-center rounded-sm bg-[var(--surface-2)] px-2 text-sm font-semibold tracking-widest text-[var(--foreground)] uppercase">
                Syndicate
              </span>
            </Link>
            <p className="text-[var(--muted)] text-sm leading-relaxed max-w-xs">
              Nigeria's #1 destination for elite, health-certified pedigree dogs. We breed for excellence, temperament, and lifelong companionship.
            </p>
            <div className="flex items-center gap-4">
               {SOCIAL_LINKS.map((item) => (
                 <a 
                   key={item.name} 
                   href={item.href} 
                   className="h-10 w-10 flex items-center justify-center rounded-full border border-[var(--border)] text-[var(--muted)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-all bg-[var(--surface-2)]"
                   aria-label={item.name}
                 >
                   <item.icon className="h-4 w-4" />
                 </a>
               ))}
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-[var(--foreground)] font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4">
              {[
                { label: "Available Dogs", href: "/dogs" },
                { label: "Our Story", href: "/about" },
                { label: "Testimonials", href: "/#testimonials" },
                { label: "Contact Us", href: "/contact" },
                { label: "Admin Portal", href: "/admin" },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-[var(--muted)] hover:text-[var(--accent)] text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Breeds */}
          <div>
            <h4 className="text-[var(--foreground)] font-bold mb-6">Popular Breeds</h4>
            <ul className="space-y-4">
               {["German Shepherd", "Golden Retriever", "Rottweiler", "French Bulldog", "Boerboel"].map((breed) => (
                 <li key={breed}>
                    <Link href={`/dogs?breed=${breed}`} className="text-[var(--muted)] hover:text-[var(--accent)] text-sm transition-colors">
                      {breed}
                    </Link>
                 </li>
               ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-[var(--foreground)] font-bold mb-6">Get in Touch</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-[var(--accent)] shrink-0" />
                <span className="text-sm text-[var(--muted)]">Lekki Phase 1, Lagos, Nigeria</span>
              </div>
              <div className="flex items-center gap-3">
                <MessageCircle className="h-5 w-5 text-[var(--accent)] shrink-0" />
                <span className="text-sm text-[var(--muted)]">+234 800 000 0000</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-[var(--accent)] shrink-0" />
                <span className="text-sm text-[var(--muted)]">hello@krishnnad.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4">
           <p className="text-xs text-[var(--muted)]">
             © {isMounted ? new Date().getFullYear() : "2026"} Krishnnad Syndicate. All rights reserved.
           </p>
           <div className="flex items-center gap-6 text-xs text-[var(--muted)]">
              <a href="#" className="hover:text-[var(--accent)]">Privacy Policy</a>
              <a href="#" className="hover:text-[var(--accent)]">Terms of Service</a>
           </div>
        </div>
      </div>
    </footer>
  )
}
