"use client"

import * as React from "react"
import { DogCard } from "@/components/DogCard"
import { Input } from "@/components/ui/Input"
import { Search, Filter, SlidersHorizontal } from "lucide-react"

interface DogsClientContentProps {
  initialDogs: any[]
  initialBreeds: string[]
}

export function DogsClientContent({ initialDogs, initialBreeds }: DogsClientContentProps) {
  const [search, setSearch] = React.useState("")
  const [selectedBreed, setSelectedBreed] = React.useState("All")

  const filteredDogs = initialDogs.filter((dog) => {
    const breedName = typeof dog.breed === 'string' ? dog.breed : (dog.breed as any)?.name || "Unknown Breed"
    const matchesSearch = dog.name.toLowerCase().includes(search.toLowerCase()) || 
                         breedName.toLowerCase().includes(search.toLowerCase())
    
    const matchesBreed = selectedBreed === "All" || breedName === selectedBreed

    return matchesSearch && matchesBreed
  })

  return (
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
              {initialBreeds.map((breed) => (
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

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
           {filteredDogs.map((dog) => (
              <DogCard key={dog.id} {...dog} />
           ))}
        </div>

        {filteredDogs.length === 0 && (
          <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface-2)]">
             <p className="text-[var(--foreground)] font-medium">No dogs found matching your criteria.</p>
             <button onClick={() => {setSearch(""); setSelectedBreed("All")}} className="mt-2 text-sm text-[var(--accent)] hover:underline">Clear all filters</button>
          </div>
        )}
      </div>
    </div>
  )
}
