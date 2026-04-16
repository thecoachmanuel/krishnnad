"use client"

import * as React from "react"
import Link from "next/link"
import { Eye, Edit, Trash2, Plus, Filter } from "lucide-react"

import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Badge } from "@/components/ui/Badge"
import { createClient } from "@/lib/supabase/client"
import { toast } from "@/components/ui/Toast"

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
      toast({
        title: "Error",
        description: "Failed to fetch dog listings.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchDogs()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this dog listing? This action cannot be undone.")) return

    try {
      const { error } = await supabase
        .from("dogs")
        .delete()
        .eq("id", id)
      
      if (error) throw error
      
      setDogs(dogs.filter(d => d.id !== id))
      toast({
        title: "Success",
        description: "Dog listing deleted successfully.",
      })
    } catch (err) {
      console.error("Delete error:", err)
      toast({
        title: "Error",
        description: "Failed to delete listing.",
        variant: "destructive"
      })
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
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-[var(--foreground)]">Dog Manager</h1>
          <p className="text-[var(--muted)] text-sm mt-1">Manage listings, statuses, and pricing.</p>
        </div>
        <Link href="/admin/dogs/new">
          <Button className="gap-2 shrink-0 shadow-lg shadow-[var(--accent)]/20">
            <Plus className="h-4 w-4" /> Add New Dog
          </Button>
        </Link>
      </div>

      {/* Table Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
         <div className="flex w-full sm:w-auto items-center gap-2">
            <Input 
              placeholder="Search by name or breed..." 
              className="max-w-xs bg-[var(--background)]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="outline" className="gap-2 shrink-0 bg-[var(--background)]">
              <Filter className="h-4 w-4" /> Filter
            </Button>
         </div>
         <p className="text-sm text-[var(--muted)] whitespace-nowrap">Showing {filteredDogs.length} listings</p>
      </div>

      {/* Data Table */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-[var(--surface)] text-[var(--muted)] border-b border-[var(--border)]">
                <tr>
                  <th className="px-6 py-4 font-semibold">Dog</th>
                  <th className="px-6 py-4 font-semibold">Price</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold hidden sm:table-cell">Listed On</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {loading ? (
                  [1, 2, 3].map(i => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={5} className="px-6 py-8 bg-[var(--surface)]/20" />
                    </tr>
                  ))
                ) : filteredDogs.length > 0 ? filteredDogs.map((dog) => (
                  <tr key={dog.id} className="hover:bg-[var(--surface)]/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 shrink-0 rounded-md bg-[var(--surface)] border border-[var(--border)] overflow-hidden relative">
                           {dog.images?.[0]?.url ? (
                             <img src={dog.images[0].url} alt="" className="object-cover w-full h-full" />
                           ) : (
                             <div className="w-full h-full bg-[var(--surface-2)]" />
                           )}
                        </div>
                        <div>
                          <div className="font-semibold text-[var(--foreground)]">{dog.name}</div>
                          <div className="text-xs text-[var(--muted)]">{dog.breed?.name || "Unknown Breed"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono font-medium text-[var(--foreground)]">
                      {formatCurrency(dog.price)}
                    </td>
                    <td className="px-6 py-4">
                      <Badge 
                        variant={
                          dog.status === "Available" ? "success" : 
                          dog.status === "Reserved" ? "warning" : "destructive"
                        }
                      >
                        {dog.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-[var(--muted)] hidden sm:table-cell">
                      {new Date(dog.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/dogs/${dog.id}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-[var(--muted)] hover:text-[var(--foreground)]" title="View Public Page">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/dogs/edit/${dog.id}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-[var(--muted)] hover:text-[var(--accent)]" title="Edit">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-[var(--muted)] hover:text-[var(--danger)] hover:bg-[var(--danger)]/10" 
                          title="Delete"
                          onClick={() => handleDelete(dog.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-[var(--muted)]">
                      No dogs found. Click "Add New Dog" to create your first listing.
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
