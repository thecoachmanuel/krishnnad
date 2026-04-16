import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ShieldCheck, Heart, Award, Star } from "lucide-react"

import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Button } from "@/components/ui/Button"
import { DogCard } from "@/components/DogCard"
import { TestimonialCard } from "@/components/ui/TestimonialCard"
import { createClient } from "@/lib/supabase/server"
import { HomeHeroClient } from "@/components/home/HomeHeroClient"

export const dynamic = 'force-dynamic'

export default async function HomePage() {
   const supabase = await createClient()

   // 1. Fetch Dynamic Settings for CMS
   const { data: settingsData } = await supabase
      .from('site_settings')
      .select('*')
      .in('key', ['branding', 'home_content', 'testimonials'])

   const branding = settingsData?.find(s => s.key === 'branding')?.value || {}
   const content = settingsData?.find(s => s.key === 'home_content')?.value || {}
   const testimonials = settingsData?.find(s => s.key === 'testimonials')?.value || []

   // Fallbacks
   const headline = content.heroTitle || "Bred for Excellence."
   const subheadline = content.heroSubtitle || "Discover your perfect companion from our selection of world-class pedigrees. Raised with uncompromising standards, health-certified, and ready for their forever homes."
   const features = content.features || [
      { icon: ShieldCheck, title: "Health Guaranteed", desc: "Every puppy undergoes a rigorous veterinary check before leaving our facility." },
      { icon: Award, title: "Elite Pedigree", desc: "Our bloodlines are imported and carefully selected from world-class sires and dams." },
      { icon: Heart, title: "Lifetime Support", desc: "We are available 24/7 for guidance throughout your dog's training and life journey." }
   ]

   // 2. Fetch Featured Dogs
   const { data: dogsData } = await supabase
      .from('dogs')
      .select(`
         *,
         breed:breeds(name),
         images:dog_images(url)
      `)
      .eq('is_featured', true)
      .limit(3)

   const featuredDogs = dogsData?.map(dog => ({
      ...dog,
      breed: (dog.breed as any)?.name || "Unknown Breed",
      imageUrl: dog.images?.[0]?.url || "/images/placeholder-dog.png"
   })) || []

   return (
      <div className="flex min-h-screen flex-col bg-[var(--background)]">
         <Navbar />

         {/* Hero Section - Using Client Component for Animations but passing Server Data */}
         <HomeHeroClient headline={headline} subheadline={subheadline} />

         {/* Featured Dogs Section */}
         <section className="py-24 bg-[var(--surface)]">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
               <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                  <div className="space-y-4">
                     <h2 className="font-display text-4xl font-bold text-[var(--foreground)]">Featured Collection</h2>
                     <p className="text-[var(--muted)] max-w-md">Our current top available puppies, selected for their elite temperament and structure.</p>
                  </div>
                  <Link href="/dogs">
                     <Button variant="ghost" className="gap-2 group">
                        View All Dogs <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                     </Button>
                  </Link>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {featuredDogs.length > 0 ? (
                     featuredDogs.map((dog) => (
                        <DogCard key={dog.id} {...dog} />
                     ))
                  ) : (
                     <div className="col-span-full py-20 text-center border border-dashed border-[var(--border)] rounded-2xl">
                        <p className="text-[var(--muted)]">No featured dogs available at the moment.</p>
                     </div>
                  )}
               </div>
            </div>
         </section>

         {/* Why Choose Us */}
         <section className="py-24 bg-[var(--background)]">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
               <div className="text-center mb-16 space-y-4">
                  <h2 className="font-display text-4xl font-bold text-[var(--foreground)]">Why Choose Krishnnad?</h2>
                  <p className="text-[var(--muted)] max-w-2xl mx-auto">We don't just sell dogs; we build lifelong partnerships focused on health and excellence.</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  {features.map((item: any, i: number) => {
                     const IconComponent = 
                        item.icon === 'ShieldCheck' ? ShieldCheck : 
                        item.icon === 'Award' ? Award : 
                        item.icon === 'Heart' ? Heart : ShieldCheck
                     
                     return (
                        <div key={i} className="text-center space-y-4 group">
                           <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--accent)]/10 text-[var(--accent)] transition-transform group-hover:scale-110">
                              <IconComponent className="h-8 w-8" />
                           </div>
                           <h3 className="text-xl font-bold text-[var(--foreground)]">{item.title}</h3>
                           <p className="text-sm text-[var(--muted)] leading-relaxed">{item.desc}</p>
                        </div>
                     )
                  })}
               </div>
            </div>
         </section>

         {/* Testimonials */}
         <section id="testimonials" className="py-24 bg-[var(--surface-2)]">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
               <div className="mb-12 flex items-center gap-4">
                  <h2 className="font-display text-4xl font-bold text-[var(--foreground)]">Owner Reviews</h2>
                  <div className="h-px flex-1 bg-[var(--border)]" />
                  <div className="flex items-center gap-1 text-[var(--accent)]">
                     <Star className="h-5 w-5 fill-current" />
                     <span className="font-bold">4.9/5 Rating</span>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {testimonials.map((t: any, i: number) => (
                     <TestimonialCard
                        key={i}
                        quote={t.quote}
                        author={t.author}
                        role={t.role}
                     />
                  ))}
               </div>
            </div>
         </section>

         {/* CTA Section */}
         <section className="py-24 border-t border-[var(--border)]">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
               <div className="bg-[var(--accent)] rounded-[3rem] p-12 lg:p-24 text-center space-y-8 relative overflow-hidden shadow-2xl shadow-[var(--accent)]/20">
                  <div className="absolute inset-0 opacity-10 pointer-events-none">
                     <div className="absolute top-10 left-10 h-64 w-64 rounded-full border-[40px] border-white" />
                     <div className="absolute bottom-10 right-10 h-32 w-32 rounded-full border-[20px] border-white" />
                  </div>

                  <h2 className="font-display text-5xl sm:text-6xl font-black text-black tracking-tight">
                     {content.ctaTitle || "Start Your Journey Today."}
                  </h2>
                  <p className="text-black/80 max-w-xl mx-auto text-lg font-medium">
                     {content.ctaSubtitle || "We are ready to match you with your perfect lifetime companion. Contact our concierge team today."}
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                     <Link href="/contact">
                        <Button size="lg" className="h-16 px-12 text-lg bg-black text-white hover:bg-black/90 border-none">
                           {content.heroCtaSecondary || "Contact Krishnnad"}
                        </Button>
                     </Link>
                     <Link href="/dogs">
                        <Button size="lg" variant="outline" className="h-16 px-12 text-lg border-black/20 text-black hover:bg-black/5">
                           {content.heroCtaMain || "Browse Dogs"}
                        </Button>
                     </Link>
                  </div>
               </div>
            </div>
         </section>

         <Footer />
      </div>
   )
}
