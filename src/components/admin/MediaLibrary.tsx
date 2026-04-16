"use client"

import * as React from "react"
import { Search, Image as ImageIcon, Trash2, ExternalLink, UploadCloud, CheckCircle2, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { toast } from "@/hooks/use-toast"

interface MediaLibraryProps {
  onSelect?: (url: string) => void
  selectedUrl?: string
  multiSelect?: boolean
  onMultiSelect?: (urls: string[]) => void
}

export function MediaLibrary({ onSelect, selectedUrl, multiSelect, onMultiSelect }: MediaLibraryProps) {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [media, setMedia] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [uploading, setUploading] = React.useState(false)
  const supabase = createClient()

  const fetchMedia = async () => {
    try {
      setLoading(true)
      // We fetch all images from dog_images. 
      // Note: We might want a dedicated table for media if images aren't always tied to dogs,
      // but for now, we use dog_images as the registry.
      const { data, error } = await supabase
        .from("dog_images")
        .select(`
          id,
          url,
          created_at,
          dog:dogs(name)
        `)
        .order("created_at", { ascending: false })
      
      if (error) throw error
      
      // Deduplicate by URL to avoid showing the same image multiple times if it's attached to multiple dogs
      const uniqueMedia = Array.from(new Map(data?.map(item => [item.url, item])).values())
      setMedia(uniqueMedia)
    } catch (err) {
      console.error("Error fetching media:", err)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchMedia()
  }, [])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    try {
      for (const file of Array.from(files)) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
        const filePath = `library/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('dog-images')
          .upload(filePath, file)

        if (uploadError) {
          console.error("Supabase Storage Upload Error:", uploadError)
          throw new Error(`Upload failed: ${uploadError.message}`)
        }

        const { data: { publicUrl } } = supabase.storage
          .from('dog-images')
          .getPublicUrl(filePath)

        // Register the image in the DB with no dog_id initially
        await supabase.from("dog_images").insert({
          url: publicUrl,
          is_primary: false,
        })
      }
      toast({ title: "Success", description: "Images uploaded to library." })
      fetchMedia()
    } catch (err) {
      console.error("Upload error:", err)
      toast({ title: "Error", description: "Upload failed.", variant: "destructive" })
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string, url: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm("Delete this image from the entire library?")) return

    try {
      const { error: dbError } = await supabase.from("dog_images").delete().eq("url", url)
      if (dbError) throw dbError

      const path = url.split('/').pop()
      if (path) {
        // We use the library/ prefix since that's how we store them now
        const { error: storageError } = await supabase.storage.from('dog-images').remove([`library/${path}`])
        if (storageError) {
          console.warn("Storage deletion warning (file might not exist in bucket):", storageError)
        }
      }

      setMedia(media.filter(m => m.url !== url))
      toast({ title: "Deleted", description: "Media removed from library." })
    } catch (err) {
      console.error("Delete error:", err)
    }
  }

  const filteredMedia = media.filter(m => 
    m.dog?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.url.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-0 bg-[var(--background)] py-2 z-10">
         <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
            <Input 
              placeholder="Search library..." 
              className="pl-9 bg-[var(--surface)]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
         <label className="flex items-center gap-2 cursor-pointer bg-[var(--accent)] text-black px-4 py-2 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity">
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
            {uploading ? "Uploading..." : "Upload New"}
            <input type="file" className="hidden" accept="image/*" multiple onChange={handleUpload} disabled={uploading} />
         </label>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="aspect-square rounded-xl bg-[var(--surface-2)] animate-pulse" />
          ))}
        </div>
      ) : filteredMedia.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredMedia.map((item) => {
            const isSelected = selectedUrl === item.url
            return (
              <div 
                key={item.id} 
                onClick={() => onSelect?.(item.url)}
                className={`group relative aspect-square rounded-xl border-2 overflow-hidden transition-all cursor-pointer ${isSelected ? 'border-[var(--accent)]' : 'border-[var(--border)] hover:border-[var(--accent)]/50'}`}
              >
                <img src={item.url} alt="" className="w-full h-full object-cover" />
                
                {isSelected && (
                  <div className="absolute top-2 right-2 z-20">
                    <CheckCircle2 className="h-6 w-6 text-[var(--accent)] fill-black" />
                  </div>
                )}

                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                   <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-[var(--danger)] hover:bg-[var(--danger)]/20"
                      onClick={(e) => handleDelete(item.id, item.url, e)}
                   >
                      <Trash2 className="h-4 w-4" />
                   </Button>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface-2)] text-[var(--muted)]">
           <ImageIcon className="h-10 w-10 mb-4 opacity-20" />
           <p>Your library is empty.</p>
        </div>
      )}
    </div>
  )
}
