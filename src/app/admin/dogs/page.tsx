"use client"

import * as React from "react"
import Link from "next/link"
import { Eye, Edit, Trash2, Plus, Star, Dog as DogIcon, CheckCircle2, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Badge } from "@/components/ui/Badge"
import { createClient } from "@/lib/supabase/client"
import { toast } from "@/hooks/use-toast"

export default function AdminDogsManager() {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [dogs, setDogs] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const supabase = createClient()

  const fetchDogs = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("dogs")
        .select(`
          *,
          breed:breeds(name),
          images:dog_images(url)
        `)
        .order("created_at", { ascending: false })
      
      if (error) throw error
      setDogs(data || [])
    } catch (err) {
      console.error("Error fetching dogs:", err)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchDogs()
  }, [])

  const toggleFeatured = async (id: string, current: boolean) => {
    // Optimistic Update
    const previous = [...dogs]
    setDogs(dogs.map(d => d.id === id ? { ...d, is_featured: !current } : d))

    try {
      const { error } = await supabase
        .from("dogs")
        .update({ is_featured: !current })
        .eq("id", id)

      if (error) throw error
      toast({ title: "Updated", description: `Featured status ${!current ? 'enabled' : 'disabled'}.` })
    } catch (err) {
      setDogs(previous) // Rollback
      toast({ title: "Error", description: "Failed to update featured status.", variant: "destructive" })
    }
  }

  const updateStatus = async (id: string, newStatus: string) => {
    const previous = [...dogs]
    setDogs(dogs.map(d => d.id === id ? { ...d, status: newStatus } : d))

    try {
      const { error } = await supabase
        .from("dogs")
        .update({ status: newStatus })
        .eq("id", id)

      if (error) throw error
      toast({ title: "Updated", description: `Dog marked as ${newStatus}.` })
    } catch (err) {
      setDogs(previous)
      toast({ title: "Error", description: "Failed to update status.", variant: "destructive" })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this listing? This action cannot be undone.")) return

    try {
      const { error } = await supabase.from("dogs").delete().eq("id", id)
      if (error) throw error
      
      setDogs(dogs.filter(d => d.id !== id))
      toast({ title: "Deleted", description: "Dog listing removed." })
    } catch (err) {
      toast({ title: "Error", description: "Delete failed.", variant: "destructive" })
    }
  }

  const filteredDogs = dogs.filter(dog => 
    dog.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dog.breed?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(val)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
           <div className="h-14 w-14 rounded-3xl bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center shadow-inner">
              <DogIcon className="h-7 w-7" />
           </div>
           <div>
              <h1 className="font-display text-4xl font-black text-[var(--foreground)] tracking-tight">Collection Hub</h1>
              <p className="text-[var(--muted)] font-medium">Streamline your high-pedigree inventory.</p>
           </div>
        </div>
        <Link href="/admin/dogs/new">
          <Button size="lg" className="rounded-full gap-2 px-8 h-14 font-black shadow-xl shadow-[var(--accent)]/20 border-none bg-[var(--accent)] text-black hover:scale-105 transition-transform">
            <Plus className="h-5 w-5" /> Add New Listing
          </Button>
        </Link>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-[2.5rem] border border-[var(--border)] bg-[var(--surface)] p-3 pl-8 shadow-sm">
         <div className="flex flex-1 items-center gap-4 w-full">
            <Input 
              placeholder="Search by name, breed, or ID..." 
              className="max-w-md bg-transparent border-none focus-visible:ring-0 text-lg font-medium p-0"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
         <div className="hidden sm:flex items-center gap-3 pr-4">
            <Badge variant="outline" className="rounded-full bg-[var(--surface-2)] border-[var(--border)] px-4 py-1 text-[var(--muted)]">
               {filteredDogs.length} Listings Total
            </Badge>
         </div>
      </div>

      {/* Data Table */}
      <div className="rounded-[3rem] border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-2xl">
         <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-[10px] uppercase bg-[var(--surface-2)]/50 text-[var(--muted)] font-black tracking-widest border-b border-[var(--border)]">
                <tr>
                  <th className="px-8 py-5">High-Pedigree Listing</th>
                  <th className="px-8 py-5">Valuation</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5">Highlight</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {loading ? (
                  [1, 2, 3, 4].map(i => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={5} className="px-8 py-10 bg-[var(--surface)]/20" />
                    </tr>
                  ))
                ) : filteredDogs.length > 0 ? filteredDogs.map((dog) => (
                  <tr key={dog.id} className="group hover:bg-[var(--surface-2)]/30 transition-all">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-5">
                        <div className="h-16 w-16 shrink-0 rounded-[1.25rem] bg-[var(--background)] border border-[var(--border)] overflow-hidden relative shadow-md">
                           {dog.images?.[0]?.url ? (
                             <img src={dog.images[0].url} alt="" className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-500" />
                           ) : (
                             <div className="w-full h-full bg-[var(--surface-2)] flex items-center justify-center">
                                <DogIcon className="h-6 w-6 opacity-10" />
                             </div>
                           )}
                           {dog.is_featured && (
                              <div className="absolute top-1 right-1 bg-[var(--accent)] p-0.5 rounded-full">
                                 <Star className="h-2 w-2 text-black fill-black" />
                              </div>
                           )}
                        </div>
                        <div>
                          <div className="font-black text-lg text-[var(--foreground)] tracking-tight">{dog.name}</div>
                          <div className="text-xs font-bold text-[var(--muted)] uppercase tracking-tighter">{(dog.breed as any)?.name || "Pedigree Standard"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="font-black text-xl text-[var(--foreground)]">{formatCurrency(dog.price)}</div>
                      <div className="text-[10px] text-[var(--muted)] uppercase font-bold mt-0.5">Market Listed</div>
                    </td>
                    <td className="px-8 py-6">
                       <select 
                        value={dog.status}
                        onChange={(e) => updateStatus(dog.id, e.target.value)}
                        className={`text-[10px] font-black uppercase px-4 py-2 rounded-full border-none cursor-pointer focus:outline-none shadow-sm ${
                          dog.status === "Available" ? "bg-[var(--success)]/10 text-[var(--success)]" : 
                          dog.status === "Reserved" ? "bg-[var(--warning)]/10 text-[var(--warning)]" : 
                          "bg-[var(--danger)]/10 text-[var(--danger)]"
                        }`}
                       >
                          <option value="Available">Available</option>
                          <option value="Reserved">Reserved</option>
                          <option value="Sold">Sold</option>
                       </select>
                    </td>
                    <td className="px-8 py-6 text-center">
                       <button 
                        onClick={() => toggleFeatured(dog.id, dog.is_featured)}
                        className={`p-3 rounded-2xl border transition-all ${dog.is_featured ? 'bg-[var(--accent)]/10 border-[var(--accent)] text-[var(--accent)]' : 'bg-transparent border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)]/50'}`}
                       >
                          <Star className={`h-5 w-5 ${dog.is_featured ? 'fill-current' : ''}`} />
                       </button>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-end gap-3">
                        <Link href={`/admin/dogs/edit/${dog.id}`}>
                          <Button variant="outline" size="icon" className="h-12 w-12 rounded-2xl border-[var(--border)] hover:border-[var(--accent)] hover:bg-[var(--accent)]/10 text-[var(--muted)] hover:text-[var(--accent)] transition-all">
                            <Edit className="h-5 w-5" />
                          </Button>
                        </Link>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-12 w-12 rounded-2xl text-[var(--muted)] hover:text-[var(--danger)] hover:bg-[var(--danger)]/10" 
                          onClick={() => handleDelete(dog.id)}
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center text-[var(--muted)]">
                       <div className="flex flex-col items-center gap-3">
                          <AlertCircle className="h-10 w-10 opacity-10" />
                          <p className="font-bold">No active collection records found.</p>
                       </div>
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
