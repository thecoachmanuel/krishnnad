"use client"

import * as React from "react"
import Link from "next/link"
import { Eye, Edit, Trash2, Plus, Filter } from "lucide-react"

import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { createClient } from "@/lib/supabase/client"
import { toast } from "@/components/ui/Toast"

export default function AdminBreedsManager() {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [breeds, setBreeds] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const supabase = createClient()

  const fetchBreeds = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("breeds")
        .select("*")
        .order("name")
      
      if (error) throw error
      setBreeds(data || [])
    } catch (err) {
      console.error("Error fetching breeds:", err)
      toast({
        title: "Error",
        description: "Failed to fetch breed library.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchBreeds()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this breed? This will affect dogs linked to it.")) return

    try {
      const { error } = await supabase
        .from("breeds")
        .delete()
        .eq("id", id)
      
      if (error) throw error
      
      setBreeds(breeds.filter(b => b.id !== id))
      toast({
        title: "Success",
        description: "Breed deleted successfully.",
      })
    } catch (err) {
      console.error("Delete error:", err)
      toast({
        title: "Error",
        description: "Failed to delete breed.",
        variant: "destructive"
      })
    }
  }

  const filteredBreeds = breeds.filter(breed => 
    breed.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    breed.origin?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-[var(--foreground)]">Breeds Library</h1>
          <p className="text-[var(--muted)] text-sm mt-1">Manage dog breeds and their standard characteristics.</p>
        </div>
        <Link href="/admin/breeds/new">
          <Button className="gap-2 shrink-0 shadow-lg shadow-[var(--accent)]/20">
            <Plus className="h-4 w-4" /> Add New Breed
          </Button>
        </Link>
      </div>

      {/* Table Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
         <div className="relative w-full sm:max-w-md">
            <Input 
              placeholder="Search by name or origin..." 
              className="bg-[var(--background)]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
         <p className="text-sm text-[var(--muted)] whitespace-nowrap">Showing {filteredBreeds.length} breeds</p>
      </div>

      {/* Data Table */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-[var(--surface)] text-[var(--muted)] border-b border-[var(--border)]">
                <tr>
                  <th className="px-6 py-4 font-semibold">Breed Name</th>
                  <th className="px-6 py-4 font-semibold">Origin</th>
                  <th className="px-6 py-4 font-semibold">Size Category</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {loading ? (
                  [1, 2, 3].map(i => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={4} className="px-6 py-8 bg-[var(--surface)]/20" />
                    </tr>
                  ))
                ) : filteredBreeds.length > 0 ? filteredBreeds.map((breed) => (
                  <tr key={breed.id} className="hover:bg-[var(--surface)]/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 shrink-0 rounded-md bg-[var(--surface)] border border-[var(--border)] overflow-hidden relative">
                           {breed.cover_image_url ? (
                             <img src={breed.cover_image_url} alt="" className="object-cover w-full h-full" />
                           ) : (
                             <div className="w-full h-full bg-[var(--surface-2)]" />
                           )}
                        </div>
                        <div className="font-semibold text-[var(--foreground)]">{breed.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[var(--muted)]">
                      {breed.origin || "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      <span className="capitalize px-2 py-1 rounded bg-[var(--surface)] text-[var(--foreground)] text-xs border border-[var(--border)]">
                        {breed.size_category || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/breeds/${breed.id}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-[var(--muted)] hover:text-[var(--foreground)]">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/breeds/edit/${breed.id}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-[var(--muted)] hover:text-[var(--accent)]">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-[var(--muted)] hover:text-[var(--danger)] hover:bg-[var(--danger)]/10" 
                          onClick={() => handleDelete(breed.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-[var(--muted)]">
                      No breeds found. Add your first breed to the library.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
         </div>
      </div>
    </div>
  )
}
