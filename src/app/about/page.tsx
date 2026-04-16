import { ShieldCheck, Crosshair, Award } from "lucide-react"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col bg-[var(--background)]">
      <Navbar />

      <div className="border-b border-[var(--border)] bg-[var(--surface)] py-16">
        <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
          <h1 className="font-display text-5xl font-bold text-[var(--foreground)]">Our Story</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[var(--muted)]">
            Dedicated to breeding the finest, healthiest, and most structurally sound companion and working dogs in Nigeria.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
           <div>
              <h2 className="font-display text-3xl font-bold text-[var(--foreground)] mb-6">Uncompromising Quality</h2>
              <div className="space-y-4 text-[var(--muted)] leading-relaxed">
                 <p>
                   Founded on the principles of ethical breeding, Krishnnad Syndicate ensures that every puppy raised under our banner meets world-class standards. 
                 </p>
                 <p>
                   Our breeding program focuses intensely on genetic health, robust temperament, and breed-standard conformation. Whether you are looking for a loyal family guardian or a high-drive working companion, our bloodlines are curated to deliver unparalleled excellence.
                 </p>
              </div>

              <div className="mt-10 grid gap-6 sm:grid-cols-2">
                 <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-6">
                    <ShieldCheck className="h-8 w-8 text-[var(--accent)] mb-4" />
                    <h3 className="font-bold text-[var(--foreground)] mb-2">Health First</h3>
                    <p className="text-sm text-[var(--muted)]">Every liter is born into a pristine environment, fully vetted, vaccinated, and microchipped.</p>
                 </div>
                 <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-6">
                    <Award className="h-8 w-8 text-[var(--accent)] mb-4" />
                    <h3 className="font-bold text-[var(--foreground)] mb-2">Pedigree Lines</h3>
                    <p className="text-sm text-[var(--muted)]">We import and rigorously select our sires and dams to ensure elite offspring.</p>
                 </div>
              </div>
           </div>

           <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[var(--surface-2)] shadow-2xl">
              <div 
                 className="absolute inset-0 bg-cover bg-center"
                 style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=1200&auto=format&fit=crop)' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-6 left-6 font-display text-3xl font-bold italic text-white/90">
                "Not just dogs.<br/>A legacy."
              </div>
           </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
