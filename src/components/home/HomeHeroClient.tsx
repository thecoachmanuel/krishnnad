"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/Button"

interface HomeHeroClientProps {
  headline: string
  subheadline: string
}

export function HomeHeroClient({ headline, subheadline }: HomeHeroClientProps) {
  return (
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

            <h1 className="font-display text-5xl font-bold leading-[1.1] tracking-tight text-[var(--foreground)] sm:text-7xl">
              {headline.includes(".") ? (
                <>
                  {headline.split(".")[0]}.<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-amber-200">
                    {headline.split(".")[1]}
                  </span>
                </>
              ) : (
                headline
              )}
            </h1>

            <p className="max-w-xl text-lg text-[var(--muted)] leading-relaxed">
              {subheadline}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/dogs">
                <Button size="lg" className="h-14 px-8 text-base shadow-[0_0_20px_rgba(217,119,6,0.3)] border-none">
                  View Collection <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg" className="h-14 px-8 text-base">
                  Contact Us
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
                <h3 className="font-display text-xl font-bold text-white mb-1">Meet Shadow</h3>
                <p className="text-sm text-white/70">Premium Quality Selections</p>
              </div>
            </div>

            <div className="absolute -top-12 -right-12 h-64 w-64 bg-[var(--accent)]/10 blur-[100px] -z-10" />
            <div className="absolute -bottom-12 -left-12 h-64 w-64 bg-amber-500/10 blur-[100px] -z-10" />
          </motion.div>

        </div>
      </div>
    </section>
  )
}
