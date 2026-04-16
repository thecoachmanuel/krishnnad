"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowRight, ShieldCheck, Heart, Award, Star, MessageSquare } from "lucide-react"

import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Button } from "@/components/ui/Button"
import { DogCard } from "@/components/DogCard"
import { TestimonialCard } from "@/components/ui/TestimonialCard"

const FEATURED_DOGS = [
   { id: "1", name: "Caesar", breed: "German Shepherd", price: 350000, imageUrl: "/images/german-shepherd.png", status: "Available" as const, age: "8 Weeks", gender: "Male" as const },
   { id: "2", name: "Bella", breed: "Golden Retriever", price: 450000, imageUrl: "/images/golden-retriever.png", status: "Reserved" as const, age: "10 Weeks", gender: "Female" as const },
   { id: "3", name: "Thor", breed: "Rottweiler", price: 400000, imageUrl: "/images/rottweiler.png", status: "Available" as const, age: "9 Weeks", gender: "Male" as const },
]

export default function HomePage() {
   return (
      <div className="flex min-h-screen flex-col bg-[var(--background)]">
         <Navbar />

         {/* Hero Section */}
         <section className="relative overflow-hidden pt-20 pb-16 lg:pt-32 lg:pb-32">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
               <div className="grid gap-12 lg:grid-cols-2 lg:items-center">

                  <motion.div
                     initial={{ opacity: 0, x: -30 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ duration: 0.8, ease: "easeOut" }}
                     className="relative z-10 space-y-8"
                  >
                     <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)]/50 px-4 py-1.5 text-sm font-medium backdrop-blur">
                        <span className="flex h-2 w-2 rounded-full bg-[var(--accent)]" />
                        <span className="text-[var(--accent)] font-bold">#1 Premium Breeder in Nigeria</span>
                     </div>

                     <h1 className="font-display text-6xl font-bold leading-[1.1] tracking-tight text-[var(--foreground)] sm:text-7xl">
                        Bred for <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-amber-200">Excellence.</span>
                     </h1>

                     <p className="max-w-xl text-lg text-[var(--muted)] leading-relaxed">
                        Discover your perfect companion from our selection of world-class pedigrees.
                        Raised with uncompromising standards, health-certified, and ready for their forever homes.
                     </p>

                     <div className="flex flex-col sm:flex-row gap-4">
                        <Link href="/dogs">
                           <Button size="lg" className="h-14 px-8 text-base shadow-[0_0_20px_rgba(217,119,6,0.3)] border-none">
                              View Collection <ArrowRight className="ml-2 h-4 w-4" />
                           </Button>
                        </Link>
                        <Link href="/about">
                           <Button variant="outline" size="lg" className="h-14 px-8 text-base">
                              Our Story
                           </Button>
                        </Link>
                     </div>

                     <div className="flex items-center gap-8 pt-4 border-t border-[var(--border)] max-w-sm">
                        <div>
                           <span className="block text-2xl font-bold text-[var(--foreground)]">150+</span>
                           <span className="text-xs text-[var(--muted)] uppercase tracking-wider">Happy Homes</span>
                        </div>
                        <div className="h-10 w-px bg-[var(--border)]" />
                        <div>
                           <span className="block text-2xl font-bold text-[var(--foreground)]">100%</span>
                           <span className="text-xs text-[var(--muted)] uppercase tracking-wider">Health Guarantee</span>
                        </div>
                     </div>
                  </motion.div>

                  <motion.div
                     initial={{ opacity: 0, scale: 0.95 }}
                     animate={{ opacity: 1, scale: 1 }}
                     transition={{ duration: 1, ease: "easeOut" }}
                     className="relative w-full max-w-[500px] lg:ml-auto"
                  >
                     <div className="relative aspect-[3/4] w-full rounded-3xl overflow-hidden shadow-2xl border border-[var(--border)] group">
                        <Image
                           src="/images/hero-dog.png"
                           alt="Meet Bella - Golden Retriever"
                           fill
                           priority
                           sizes="(max-width: 768px) 100vw, 500px"
                           className="object-cover -scale-x-100 transition-transform duration-700 group-hover:scale-x-[-1.05] group-hover:scale-y-[1.05]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                        <div className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10">
                           <h3 className="font-display text-xl font-bold text-white mb-1">Meet Bella</h3>
                           <p className="text-sm text-white/70">World Class Golden Retriever Puppy</p>
                        </div>
                     </div>

                     {/* Decorative Elements */}
                     <div className="absolute -top-12 -right-12 h-64 w-64 bg-[var(--accent)]/10 blur-[100px] -z-10" />
                     <div className="absolute -bottom-12 -left-12 h-64 w-64 bg-amber-500/10 blur-[100px] -z-10" />
                  </motion.div>

               </div>
            </div>
         </section>

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
                  {FEATURED_DOGS.map((dog, i) => (
                     <motion.div
                        key={dog.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                     >
                        <DogCard {...dog} />
                     </motion.div>
                  ))}
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
                  {[
                     { icon: ShieldCheck, title: "Health Guaranteed", desc: "Every puppy undergoes a rigorous veterinary check before leaving our facility." },
                     { icon: Award, title: "Elite Pedigree", desc: "Our bloodlines are imported and carefully selected from world-class sires and dams." },
                     { icon: Heart, title: "Lifetime Support", desc: "We are available 24/7 for guidance throughout your dog's training and life journey." }
                  ].map((item, i) => (
                     <div key={i} className="text-center space-y-4 group">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--accent)]/10 text-[var(--accent)] transition-transform group-hover:scale-110">
                           <item.icon className="h-8 w-8" />
                        </div>
                        <h3 className="text-xl font-bold text-[var(--foreground)]">{item.title}</h3>
                        <p className="text-sm text-[var(--muted)] leading-relaxed">{item.desc}</p>
                     </div>
                  ))}
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
                  <TestimonialCard
                     quote="Caesar has been a dream. His temperament is rock solid and the health package was so thorough."
                     author="Adekunle M."
                     role="Lagos, Nigeria"
                  />
                  <TestimonialCard
                     quote="The team at Krishnnad made the process so easy. Our Golden Retriever is the heart of our home now."
                     author="Chibuzor O."
                     role="Abuja, Nigeria"
                  />
                  <TestimonialCard
                     quote="Buying from a trusted breeder matters. The lifetime support has been invaluable for us."
                     author="Sarah J."
                     role="Lagos, Nigeria"
                  />
               </div>
            </div>
         </section>

         {/* CTA Section */}
         <section className="py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
               <div className="bg-[var(--accent)] rounded-[3rem] p-12 lg:p-24 text-center space-y-8 relative overflow-hidden">
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10 pointer-events-none">
                     <div className="absolute top-10 left-10 h-64 w-64 rounded-full border-[40px] border-white" />
                     <div className="absolute bottom-10 right-10 h-32 w-32 rounded-full border-[20px] border-white" />
                  </div>

                  <h2 className="font-display text-5xl sm:text-6xl font-black text-black tracking-tight">
                     Start Your <br /> Journey Today.
                  </h2>
                  <p className="text-black/80 max-w-xl mx-auto text-lg font-medium">
                     We are ready to match you with your perfect lifetime companion. Contact our concierge team today.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                     <Link href="/contact">
                        <Button size="lg" className="h-16 px-12 text-lg bg-black text-white hover:bg-black/90 border-none">
                           Contact Krishnnad
                        </Button>
                     </Link>
                     <Link href="/dogs">
                        <Button size="lg" variant="outline" className="h-16 px-12 text-lg border-black/20 text-black hover:bg-black/5">
                           Browse Dogs
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
