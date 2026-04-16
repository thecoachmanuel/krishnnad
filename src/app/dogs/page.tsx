import * as React from "react"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { createClient } from "@/lib/supabase/server"
import { DogsClientContent } from "@/components/dogs/DogsClientContent"

export const dynamic = 'force-dynamic'

export default async function DogsPage() {
  const supabase = await createClient()

  // 1. Fetch Breeds
  const { data: breedsData } = await supabase.from("breeds").select("name")
  const initialBreeds = ["All", ...(breedsData?.map(b => b.name) || [])]

  // 2. Fetch Dogs
  const { data: dogsData, error } = await supabase
    .from("dogs")
    .select(`
      *,
      breed:breeds(name),
      images:dog_images(url)
    `)
  
  if (error) {
    console.error("Error fetching dogs:", error)
  }

  const initialDogs = dogsData?.map(dog => ({
    ...dog,
    breed: (dog.breed as any)?.name || "Unknown Breed",
    imageUrl: dog.images?.[0]?.url || "/images/placeholder-dog.png"
  })) || []

  return (
    <main className="flex min-h-screen flex-col bg-[var(--background)]">
      <Navbar />

      {/* Page Header */}
      <div className="border-b border-[var(--border)] bg-[var(--surface)] py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-4xl font-bold text-[var(--foreground)]">Our Collection</h1>
          <p className="mt-2 text-[var(--muted)]">Find your perfect companion matching your lifestyle.</p>
        </div>
      </div>

      <DogsClientContent initialDogs={initialDogs} initialBreeds={initialBreeds} />

      <Footer />
    </main>
  )
}
