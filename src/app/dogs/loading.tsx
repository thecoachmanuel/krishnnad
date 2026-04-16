import * as React from "react"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Search, Filter, SlidersHorizontal} from "lucide-react"

export default function DogsLoading() {
  return (
    <main className="flex min-h-screen flex-col bg-[var(--background)]">
      <Navbar />

      {/* Page Header */}
      <div className="border-b border-[var(--border)] bg-[var(--surface)] py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-10 w-64 animate-pulse rounded-lg bg-[var(--surface-2)]" />
          <div className="mt-2 h-4 w-96 animate-pulse rounded-lg bg-[var(--surface-2)]" />
        </div>
      </div>

      <div className="container mx-auto flex flex-col gap-8 px-4 py-8 sm:px-6 lg:flex-row lg:px-8">
        
        {/* Sidebar Skeleton */}
        <aside className="w-full lg:w-64 shrink-0 space-y-8">
          <div>
            <div className="mb-2 h-4 w-12 animate-pulse rounded bg-[var(--surface-2)]" />
            <div className="relative h-10 w-full animate-pulse rounded-md bg-[var(--surface-2)]" />
          </div>

          <div>
             <div className="mb-3 flex items-center gap-2">
                <Filter className="h-4 w-4 text-[var(--muted)]" />
                <div className="h-4 w-16 animate-pulse rounded bg-[var(--surface-2)]" />
             </div>
             <div className="flex flex-wrap gap-2 lg:flex-col">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-9 w-full animate-pulse rounded-md bg-[var(--surface-2)]" />
                ))}
             </div>
          </div>

          <div className="rounded-lg border border-[var(--border)] p-4 bg-[var(--surface-2)]">
            <div className="flex items-center gap-2 mb-2">
               <SlidersHorizontal className="h-4 w-4 text-[var(--muted)]" />
               <div className="h-4 w-24 animate-pulse rounded bg-[var(--background)]" />
            </div>
            <div className="h-3 w-full animate-pulse rounded bg-[var(--background)]" />
          </div>
        </aside>

        {/* Listings Grid Skeleton */}
        <div className="flex-1">
          <div className="mb-4 flex items-center justify-between">
            <div className="h-4 w-32 animate-pulse rounded bg-[var(--surface-2)]" />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
             {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="aspect-[4/3] w-full animate-pulse rounded-xl bg-[var(--surface-2)]" />
             ))}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
