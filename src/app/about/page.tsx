import { ShieldCheck, Crosshair, Award } from "lucide-react"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { createClient } from "@/lib/supabase/server"

export default async function AboutPage() {
  const supabase = await createClient()
  const { data: settingsData } = await supabase
    .from('site_settings')
    .select('*')
    .eq('key', 'page_about')
    .single()

  const content = settingsData?.value || {
    title: "Our Story",
    subtitle: "Dedicated to breeding the finest, healthiest, and most structurally sound companion and working dogs in Nigeria.",
    storyTitle: "Uncompromising Quality",
    storyText: "Founded on the principles of ethical breeding, Krishnnad Syndicate ensures that every puppy raised under our banner meets world-class standards. Our breeding program focuses intensely on genetic health, robust temperament, and breed-standard conformation.",
    missionItems: [
      { title: "Health First", desc: "Every liter is born into a pristine environment, fully vetted, vaccinated, and microchipped." },
      { title: "Pedigree Lines", desc: "We import and rigorously select our sires and dams to ensure elite offspring." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=1200&auto=format&fit=crop",
    quote: "Not just dogs.\nA legacy."
  }

  return (
    <main className="flex min-h-screen flex-col bg-[var(--background)]">
      <Navbar />

      <div className="border-b border-[var(--border)] bg-[var(--surface)] py-16">
        <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
          <h1 className="font-display text-5xl font-bold text-[var(--foreground)]">{content.title}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[var(--muted)]">
            {content.subtitle}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
           <div>
              <h2 className="font-display text-3xl font-bold text-[var(--foreground)] mb-6">{content.storyTitle}</h2>
              <div className="space-y-4 text-[var(--muted)] leading-relaxed">
                 <p className="whitespace-pre-line">
                   {content.storyText}
                 </p>
              </div>

              <div className="mt-10 grid gap-6 sm:grid-cols-2">
                 {content.missionItems.map((item: any, i: number) => (
                    <div key={i} className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-6">
                       {i === 0 ? <ShieldCheck className="h-8 w-8 text-[var(--accent)] mb-4" /> : <Award className="h-8 w-8 text-[var(--accent)] mb-4" />}
                       <h3 className="font-bold text-[var(--foreground)] mb-2">{item.title}</h3>
                       <p className="text-sm text-[var(--muted)]">{item.desc}</p>
                    </div>
                 ))}
              </div>
           </div>

           <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[var(--surface-2)] shadow-2xl">
              <div 
                 className="absolute inset-0 bg-cover bg-center"
                 style={{ backgroundImage: `url(${content.imageUrl})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-6 left-6 font-display text-3xl font-bold italic text-white/90">
                {content.quote}
              </div>
           </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
