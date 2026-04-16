import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import { FileHeart, FileBadge, ArrowLeft, ShieldCheck, AlertCircle } from "lucide-react"

import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { CheckoutButton } from "./CheckoutButton"
import { WhatsAppButton } from "@/components/WhatsAppButton"

interface DogDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function DogDetailPage({ params }: DogDetailPageProps) {
  const { id } = await params
  const supabase = await createClient()

  // 1. Fetch Dog Details
  const { data: dog, error } = await supabase
    .from("dogs")
    .select(`
      *,
      breed:breeds(name),
      images:dog_images(url)
    `)
    .eq("id", id)
    .single()

  if (error || !dog) {
    return notFound()
  }

  // 2. Fetch Contact Info from settings
  const { data: contactSetting } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "contactWhatsApp")
    .single()
  
  const whatsappNumber = contactSetting?.value || "+2348000000000"

  const formattedPrice = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(dog.price)

  const isSold = dog.status === "Sold"
  const breedName = (dog.breed as any)?.name || "Unknown Breed"
  const images = dog.images?.map((img: any) => img.url) || []
  const ageDisplay = dog.age_months ? `${dog.age_months} Months` : "Unknown Age"
  const weightDisplay = dog.weight_kg ? `${dog.weight_kg}kg` : "Unknown Weight"

  return (
    <main className="flex min-h-screen flex-col bg-[var(--background)]">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 flex-1">
        
        {/* Back Button */}
        <Link 
          href="/dogs" 
          className="inline-flex items-center gap-2 mb-8 text-sm font-medium text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Collection
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
           
           {/* Left Column: Media */}
           <div className="space-y-6">
              <div className="relative aspect-square md:aspect-[4/5] w-full overflow-hidden rounded-3xl bg-[var(--surface-2)] shadow-2xl border border-[var(--border)]">
                 <div 
                   className="absolute inset-0 bg-cover bg-center"
                   style={{ backgroundImage: `url(${images[0] || '/images/placeholder-dog.png'})` }}
                 />
                 {isSold && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                       <span className="rotate-[-12deg] rounded-md border-4 border-red-500 px-8 py-2 text-5xl font-black uppercase tracking-widest text-red-500 shadow-2xl">
                          Sold
                       </span>
                    </div>
                 )}
              </div>

              {/* Documents Overlay Card */}
              <div className="p-6 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)]">
                 <h3 className="text-sm uppercase tracking-wider font-semibold text-[var(--muted)] mb-4">Verification & Documents</h3>
                 <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-3">
                       <FileHeart className="h-5 w-5 text-[var(--danger)]" />
                       <div className="text-left">
                          <span className="block text-xs font-bold text-[var(--foreground)]">Health Certificate</span>
                          <span className="block text-[10px] text-[var(--muted)]">Verified Veterinary Report</span>
                       </div>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-3">
                       <FileBadge className="h-5 w-5 text-[var(--accent)]" />
                       <div className="text-left">
                          <span className="block text-xs font-bold text-[var(--foreground)]">Pedigree Papers</span>
                          <span className="block text-[10px] text-[var(--muted)]">Certified Bloodline Status</span>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Right Column: Information */}
           <div className="flex flex-col">
              <div className="mb-4 flex flex-wrap gap-2">
                 <Badge variant="default" className="text-sm shadow-md bg-[var(--surface-2)] border-[var(--border)] text-[var(--foreground)]">{breedName}</Badge>
                 {dog.status === "Reserved" && <Badge variant="warning" className="text-sm shadow-md">Reserved</Badge>}
              </div>

              <h1 className="font-display text-5xl font-bold text-[var(--foreground)] tracking-tight mb-2">
                 {dog.name}
              </h1>
              <p className="font-mono text-4xl font-bold text-[var(--accent)] mb-8">
                 {formattedPrice}
              </p>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                 {[
                   { label: "Age", value: ageDisplay },
                   { label: "Gender", value: dog.gender },
                   { label: "Color", value: dog.color },
                   { label: "Weight", value: weightDisplay }
                 ].map((item) => (
                   <div key={item.label} className="p-4 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] transition-colors hover:border-[var(--accent)]/30">
                      <span className="block text-xs uppercase tracking-wider text-[var(--muted)] mb-1 font-bold">{item.label}</span>
                      <span className="text-lg font-semibold text-[var(--foreground)]">{item.value}</span>
                   </div>
                 ))}
              </div>

              {/* Description */}
              <div className="mb-8 space-y-4">
                 <h3 className="font-display text-2xl font-bold text-[var(--foreground)]">The Pedigree Story</h3>
                 <p className="text-[var(--muted)] leading-relaxed text-lg">{dog.description}</p>
                 <div className="bg-[var(--accent)]/5 border border-[var(--accent)]/20 rounded-2xl p-6 flex gap-4">
                    <AlertCircle className="h-6 w-6 text-[var(--accent)] shrink-0" />
                    <div>
                       <h4 className="text-sm font-bold text-[var(--foreground)] mb-1">Breeder's Care Note</h4>
                       <p className="text-sm text-[var(--muted)] leading-relaxed">{dog.care_notes}</p>
                    </div>
                 </div>
              </div>

              {/* Health Checklist */}
              <div className="mb-10 p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
                 <h3 className="font-display text-xl font-bold text-[var(--foreground)] mb-6 flex items-center gap-2">
                    <ShieldCheck className="h-6 w-6 text-[var(--success)]" /> Certified Health Checklist
                 </h3>
                 <div className="grid sm:grid-cols-2 gap-y-4 gap-x-8">
                    {(dog.vaccinated || dog.dewormed || dog.microchipped || dog.pedigree_certified) ? (
                       <>
                         {dog.vaccinated && (
                            <div className="flex items-center gap-3">
                              <div className="h-6 w-6 rounded-full bg-[var(--success)]/20 text-[var(--success)] flex items-center justify-center shrink-0">
                                 <ShieldCheck className="h-4 w-4" />
                              </div>
                              <span className="text-sm font-medium text-[var(--foreground)]">Fully Vaccinated</span>
                            </div>
                         )}
                         {dog.dewormed && (
                            <div className="flex items-center gap-3">
                              <div className="h-6 w-6 rounded-full bg-[var(--success)]/20 text-[var(--success)] flex items-center justify-center shrink-0">
                                 <ShieldCheck className="h-4 w-4" />
                              </div>
                              <span className="text-sm font-medium text-[var(--foreground)]">Dewormed</span>
                            </div>
                         )}
                         {dog.microchipped && (
                            <div className="flex items-center gap-3">
                              <div className="h-6 w-6 rounded-full bg-[var(--success)]/20 text-[var(--success)] flex items-center justify-center shrink-0">
                                 <ShieldCheck className="h-4 w-4" />
                              </div>
                              <span className="text-sm font-medium text-[var(--foreground)]">Microchipped</span>
                            </div>
                         )}
                         {dog.pedigree_certified && (
                            <div className="flex items-center gap-3">
                              <div className="h-6 w-6 rounded-full bg-[var(--success)]/20 text-[var(--success)] flex items-center justify-center shrink-0">
                                 <ShieldCheck className="h-4 w-4" />
                              </div>
                              <span className="text-sm font-medium text-[var(--foreground)]">Pedigree Certified</span>
                            </div>
                         )}
                       </>
                    ) : (
                       <p className="text-sm text-[var(--muted)]">Health information not provided.</p>
                    )}
                 </div>
              </div>

              {/* Call to Actions */}
              <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                 {!isSold ? (
                   <>
                     <CheckoutButton dogId={dog.id} dogName={dog.name} />
                     <WhatsAppButton dogId={dog.id} dogName={dog.name} phone={whatsappNumber} />
                   </>
                 ) : (
                   <Button size="lg" variant="secondary" className="h-16 w-full cursor-not-allowed opacity-70" disabled>
                     Listing Concluded
                   </Button>
                 )}
              </div>
           </div>

        </div>
      </div>
      
      <Footer />
    </main>
  )
}
