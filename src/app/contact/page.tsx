import * as React from "react"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { MapPin, Phone, Mail } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { ContactFormClient } from "@/components/contact/ContactFormClient"

export default async function ContactPage() {
  const supabase = await createClient()
  const { data: settingsData } = await supabase
    .from('site_settings')
    .select('*')
    .eq('key', 'page_contact')
    .single()

  const content = settingsData?.value || {
    title: "Contact Us",
    subtitle: "Have questions about a listing or want to join the waitlist? Let's talk.",
    address: "Lagos, Nigeria",
    whatsapp: "+234 800 000 0000",
    email: "hello@krishnnad.com",
    supportText: "We prioritize our customer's experience. If you are enquiring about a specific litter, please reference the dog's name in your message."
  }

  return (
    <main className="flex min-h-screen flex-col bg-[var(--background)]">
      <Navbar />

      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8 flex-1">
        
        <div className="mb-16 text-center">
          <h1 className="font-display text-5xl font-bold text-[var(--foreground)]">{content.title}</h1>
          <p className="mt-4 text-lg text-[var(--muted)]">
            {content.subtitle}
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
           
           {/* Info Panel */}
           <div className="space-y-8 rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-8 sm:p-12">
              <div>
                 <h2 className="font-display text-2xl font-bold text-[var(--foreground)] mb-6">Get in Touch</h2>
                 <p className="text-[var(--muted)] leading-relaxed mb-8">
                   {content.supportText}
                 </p>
              </div>

              <div className="space-y-6">
                 <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--accent)]">
                       <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                       <h3 className="font-semibold text-[var(--foreground)]">{content.address}</h3>
                       <p className="text-sm text-[var(--muted)] mt-1">Visit by appointment only.</p>
                    </div>
                 </div>

                 <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--accent)]">
                       <Phone className="h-5 w-5" />
                    </div>
                    <div>
                       <h3 className="font-semibold text-[var(--foreground)]">WhatsApp</h3>
                       <p className="text-sm text-[var(--accent)] hover:underline cursor-pointer mt-1">{content.whatsapp}</p>
                    </div>
                 </div>

                 <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--accent)]">
                       <Mail className="h-5 w-5" />
                    </div>
                    <div>
                       <h3 className="font-semibold text-[var(--foreground)]">Email</h3>
                       <p className="text-sm text-[var(--accent)] hover:underline cursor-pointer mt-1">{content.email}</p>
                    </div>
                 </div>
              </div>
           </div>

           {/* Contact Form - Extracted to Client Component */}
           <ContactFormClient />
        </div>
      </div>
      <Footer />
    </main>
  )
}
