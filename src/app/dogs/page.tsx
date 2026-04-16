"use client"

import * as React from "react"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { DogCard } from "@/components/DogCard"
import { Input } from "@/components/ui/Input"
import { Badge } from "@/components/ui/Badge"
import { Search, Filter, SlidersHorizontal } from "lucide-react"

// Dummy data for initial display before Supabase is connected
import { createClient } from "@/lib/supabase/client"

export default function DogsPage() {
  const [search, setSearch] = React.useState("")
  const [selectedBreed, setSelectedBreed] = React.useState("All")
  const [dogs, setDogs] = React.useState<any[]>([])
  const [breeds, setBreeds] = React.useState<string[]>(["All"])
  const [loading, setLoading] = React.useState(true)
  const supabase = createClient()

  React.useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        
        // Fetch Breeds
        const { data: breedsData } = await supabase.from("breeds").select("name")
        if (breedsData) {
          setBreeds(["All", ...breedsData.map(b => b.name)])
        }

        // Fetch Dogs
        let query = supabase
          .from("dogs")
          .select(`
            *,
            breed:breeds(name),
            images:dog_images(url)
          `)
        
        if (selectedBreed !== "All") {
          query = query.filter("breed.name", "eq", selectedBreed)
        }

        const { data, error } = await query
        if (error) throw error
        
        const transformed = data.map(dog => ({
          ...dog,
          breed: (dog.breed as any)?.name || "Unknown Breed",
          imageUrl: dog.images?.[0]?.url || "/images/placeholder-dog.png"
        }))

        setDogs(transformed)
      } catch (err) {
        console.error("Error fetching data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [selectedBreed])

  const filteredDogs = dogs.filter((dog) => {
    const matchesSearch = dog.name.toLowerCase().includes(search.toLowerCase()) || 
                         dog.breed.toLowerCase().includes(search.toLowerCase())
    return matchesSearch
  })

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

      <div className="container mx-auto flex flex-col gap-8 px-4 py-8 sm:px-6 lg:flex-row lg:px-8">
        
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 shrink-0 space-y-8">
          {/* Search */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
              <Input 
                placeholder="Search by name..." 
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Breed Filter */}
          <div>
             <div className="mb-3 flex items-center gap-2">
                <Filter className="h-4 w-4 text-[var(--accent)]" />
                <h3 className="font-semibold text-[var(--foreground)]">Breeds</h3>
             </div>
             <div className="flex flex-wrap gap-2 lg:flex-col">
                {breeds.map((breed) => (
                  <button
                    key={breed}
                    onClick={() => setSelectedBreed(breed)}
                    className={`flex items-center rounded-md px-3 py-2 text-sm transition-colors text-left ${selectedBreed === breed ? 'bg-[var(--accent)]/10 text-[var(--accent)] font-medium' : 'text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)]'}`}
                  >
                    {breed}
                  </button>
                ))}
             </div>
          </div>

          <div className="rounded-lg border border-[var(--border)] p-4 bg-[var(--surface-2)]">
            <div className="flex items-center gap-2 mb-2">
               <SlidersHorizontal className="h-4 w-4 text-[var(--accent)]" />
               <h3 className="text-sm font-semibold text-[var(--foreground)]">More Filters</h3>
            </div>
            <p className="text-xs text-[var(--muted)]">Advanced filtering (Age, Price, Gender) will be available soon.</p>
          </div>
        </aside>

        {/* Listings Grid */}
        <div className="flex-1">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-[var(--muted)]">Showing <span className="font-semibold text-[var(--foreground)]">{filteredDogs.length}</span> dogs</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="aspect-[4/3] w-full animate-pulse rounded-xl bg-[var(--surface-2)]" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
               {filteredDogs.map((dog) => (
                  <DogCard key={dog.id} {...dog} />
               ))}
            </div>
          )}

          {filteredDogs.length === 0 && (
            <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface-2)]">
               <p className="text-[var(--foreground)] font-medium">No dogs found matching your criteria.</p>
               <button onClick={() => {setSearch(""); setSelectedBreed("All")}} className="mt-2 text-sm text-[var(--accent)] hover:underline">Clear all filters</button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  )
}
