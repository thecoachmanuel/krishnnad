"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/Button"
import { BreedForm } from "@/components/admin/BreedForm"

export default function NewBreedPage() {
  return (
    <div className="max-w-4xl space-y-6 pb-20">
      <div className="flex items-center gap-4">
        <Link href="/admin/breeds">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="font-display text-3xl font-bold text-[var(--foreground)]">New Breed Standard</h1>
          <p className="text-[var(--muted)] text-sm">Add a new breed to the syndicate's library.</p>
        </div>
      </div>

      <BreedForm />
    </div>
  )
}
