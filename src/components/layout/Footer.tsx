import Link from "next/link"
import { Instagram, Twitter, Mail, MapPin, Phone, ShieldCheck } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

export async function Footer() {
  const supabase = await createClient()
  
  // Fetch dynamic branding and contact info
  const { data: settingsData } = await supabase
    .from('site_settings')
    .select('*')
    .in('key', ['branding', 'page_contact'])

  const branding = settingsData?.find(s => s.key === 'branding')?.value || {}
  const contact = settingsData?.find(s => s.key === 'page_contact')?.value || {}

  const siteName = branding.siteName || "Krishnnad Syndicate"
  const tagline = branding.tagline || "Curating Canine Legacies"

  return (
    <footer className="bg-[var(--surface-2)] border-t border-[var(--border)] pt-24 pb-12 overflow-hidden relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="space-y-6">
            <Link href="/" className="inline-block">
              <span className="font-display text-2xl font-black text-[var(--foreground)] tracking-tighter uppercase whitespace-nowrap">
                {siteName}
              </span>
            </Link>
            <p className="text-sm text-[var(--muted)] leading-relaxed max-w-xs">
              {tagline}. Dedicated to breeding the finest, healthiest, and most structurally sound pedigrees in Nigeria.
            </p>
            <div className="flex items-center gap-4">
               <Link href="#" className="h-10 w-10 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-all">
                  <Instagram className="h-4 w-4" />
               </Link>
               <Link href="#" className="h-10 w-10 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-all">
                  <Twitter className="h-4 w-4" />
               </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-sm font-black uppercase text-[var(--foreground)] tracking-widest">Syndicate</h3>
            <ul className="space-y-4">
              {['Collection', 'Available Puppies', 'About Us', 'Contact'].map((link) => (
                <li key={link}>
                  <Link 
                    href={link === 'Collection' ? '/dogs' : link === 'About Us' ? '/about' : link === 'Contact' ? '/contact' : '/dogs'} 
                    className="text-sm text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal / Policy */}
          <div className="space-y-6">
            <h3 className="text-sm font-black uppercase text-[var(--foreground)] tracking-widest">Assurance</h3>
            <ul className="space-y-4">
              {['Terms of Service', 'Privacy Policy', 'Health Guarantee', 'Refund Policy'].map((link) => (
                <li key={link}>
                  <Link href="#" className="text-sm text-[var(--muted)] hover:text-[var(--accent)] transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-6">
            <h3 className="text-sm font-black uppercase text-[var(--foreground)] tracking-widest">Connect</h3>
            <div className="space-y-4">
               <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-[var(--accent)] shrink-0" />
                  <span className="text-sm text-[var(--muted)]">{contact.address || "Lagos, Nigeria"}</span>
               </div>
               <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-[var(--accent)] shrink-0" />
                  <span className="text-sm text-[var(--muted)]">{contact.whatsapp || "+234 800 000 0000"}</span>
               </div>
               <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-[var(--accent)] shrink-0" />
                  <span className="text-sm text-[var(--muted)]">{contact.email || "hello@krishnnad.com"}</span>
               </div>
            </div>
          </div>

        </div>

        <div className="pt-12 border-t border-[var(--border)] flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs font-medium text-[var(--muted)]">
            © {new Date().getFullYear()} {siteName}. All rights reserved. Registered with national canine associations.
          </p>
          <div className="flex items-center gap-2 text-xs font-black uppercase text-[var(--success)]">
             <ShieldCheck className="h-4 w-4" /> Secure Pedigree Verified
          </div>
        </div>
      </div>
    </footer>
  )
}
