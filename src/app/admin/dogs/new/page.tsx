"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/Button"
import { DogForm } from "@/components/admin/DogForm"

export default function NewDogPage() {
  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/dogs">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="font-display text-3xl font-bold text-[var(--foreground)]">New Collection Listing</h1>
          <p className="text-[var(--muted)] text-sm">Add a high-pedigree listing to the syndicate collection.</p>
        </div>
      </div>

      <DogForm />
    </div>
  )
}
