"use client"

import * as React from "react"
import { Search, Image as ImageIcon, Trash2, Download, ExternalLink, Filter } from "lucide-react"

import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { createClient } from "@/lib/supabase/client"
import { toast } from "@/hooks/use-toast"

export default function AdminMediaLibrary() {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [media, setMedia] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const supabase = createClient()

  const fetchMedia = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("dog_images")
        .select(`
          *,
          dog:dogs(name)
        `)
        .order("created_at", { ascending: false })
      
      if (error) throw error
      setMedia(data || [])
    } catch (err) {
      console.error("Error fetching media:", err)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchMedia()
  }, [])

  const handleDelete = async (id: string, url: string) => {
    if (!confirm("Delete this image? This will remove it from the associated dog listing.")) return

    try {
      // 1. Delete from DB
      const { error: dbError } = await supabase.from("dog_images").delete().eq("id", id)
      if (dbError) throw dbError

      // 2. Delete from Storage (extract path from URL)
      const path = url.split('/').pop()
      if (path) {
        await supabase.storage.from('dog-images').remove([path])
      }

      setMedia(media.filter(m => m.id !== id))
      toast({ title: "Deleted", description: "Media item removed." })
    } catch (err) {
      console.error("Delete error:", err)
    }
  }

  const filteredMedia = media.filter(m => 
    m.dog?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.url.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-[var(--foreground)]">Media Library</h1>
          <p className="text-[var(--muted)] text-sm mt-1">Manage all uploaded dog assets and certificates.</p>
        </div>
        <Button variant="outline" className="gap-2" onClick={fetchMedia}>
           Refresh Library
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
         <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
            <Input 
              placeholder="Search by dog name..." 
              className="pl-9 bg-[var(--background)]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
         <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="gap-2 text-[var(--muted)]">
               <Filter className="h-4 w-4" /> All Assets
            </Button>
         </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="aspect-square rounded-xl bg-[var(--surface-2)] animate-pulse" />
          ))}
        </div>
      ) : filteredMedia.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {filteredMedia.map((item) => (
            <div key={item.id} className="group relative aspect-square rounded-xl border border-[var(--border)] bg-[var(--surface-2)] overflow-hidden transition-all hover:border-[var(--accent)]/50">
               <img src={item.url} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
               
               {/* Overlay */}
               <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 p-4">
                  <div className="text-center">
                     <p className="text-xs font-bold text-white uppercase tracking-wider">{item.dog?.name || 'Unassigned'}</p>
                     <p className="text-[10px] text-white/70 mt-1">{item.is_primary ? "Primary Image" : "Gallery Item"}</p>
                  </div>
                  <div className="flex items-center gap-2">
                     <a href={item.url} target="_blank" rel="noreferrer">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20">
                           <ExternalLink className="h-4 w-4" />
                        </Button>
                     </a>
                     <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-[var(--danger)] hover:bg-[var(--danger)]/20"
                        onClick={() => handleDelete(item.id, item.url)}
                     >
                        <Trash2 className="h-4 w-4" />
                     </Button>
                  </div>
               </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface-2)] text-[var(--muted)]">
           <ImageIcon className="h-10 w-10 mb-4 opacity-20" />
           <p>No media items found.</p>
        </div>
      )}
    </div>
  )
}
