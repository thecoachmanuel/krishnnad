"use client"

import * as React from "react"
import { Star, Quote } from "lucide-react"

interface TestimonialCardProps {
  quote: string
  author: string
  role: string
  avatar?: string
}

export function TestimonialCard({ quote, author, role, avatar }: TestimonialCardProps) {
  return (
    <div className="group relative rounded-2xl border border-[var(--border)] bg-[var(--surface-2)]/50 p-8 backdrop-blur-sm transition-all hover:bg-[var(--surface-2)]">
      <div className="absolute top-4 right-4 text-[var(--accent)]/10 group-hover:text-[var(--accent)]/20 transition-colors">
        <Quote className="h-12 w-12" />
      </div>

      <div className="flex gap-1 mb-6">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-[var(--accent)] text-[var(--accent)]" />
        ))}
      </div>

      <p className="text-lg text-[var(--foreground)] italic leading-relaxed mb-8 relative z-10">
        "{quote}"
      </p>

      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-full bg-[var(--accent)]/20 border border-[var(--accent)]/30 flex items-center justify-center font-display font-bold text-[var(--accent)]">
          {author[0]}
        </div>
        <div>
          <h4 className="font-bold text-[var(--foreground)] text-sm">{author}</h4>
          <p className="text-[var(--muted)] text-xs">{role}</p>
        </div>
      </div>
    </div>
  )
}
