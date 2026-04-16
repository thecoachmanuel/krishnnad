"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, UploadCloud, X } from "lucide-react"

import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { createClient } from "@/lib/supabase/client"
import { toast } from "@/components/ui/Toast"

export default function NewBreedPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = React.useState(false)
  const [uploading, setUploading] = React.useState(false)
  
  const [formData, setFormData] = React.useState({
    name: "",
    origin: "",
    temperament: "",
    size_category: "medium",
    life_expectancy: "",
    description: "",
    cover_image_url: ""
  })

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `breed-covers/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('dog-images')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('dog-images')
        .getPublicUrl(filePath)

      setFormData(prev => ({ ...prev, cover_image_url: publicUrl }))
      toast({ title: "Success", description: "Cover image uploaded." })
    } catch (err) {
      console.error("Upload error:", err)
      toast({ title: "Error", description: "Failed to upload cover image.", variant: "destructive" })
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from("breeds")
        .insert([formData])

      if (error) throw error

      toast({ title: "Success", description: "Breed added to library." })
      router.push("/admin/breeds")
    } catch (err: any) {
      console.error("Save error:", err)
      toast({ title: "Error", description: err.message || "Failed to save breed.", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/breeds">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="font-display text-3xl font-bold text-[var(--foreground)]">New Breed Standard</h1>
          <p className="text-[var(--muted)] text-sm">Add a new breed to the syndicate's library.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Basic Information */}
        <Card>
           <CardHeader>
             <CardTitle>Breed Details</CardTitle>
           </CardHeader>
           <CardContent className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                 <label className="text-sm font-medium">Breed Name</label>
                 <Input 
                   required 
                   placeholder="Ex: Golden Retriever" 
                   value={formData.name}
                   onChange={(e) => setFormData({...formData, name: e.target.value})}
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-sm font-medium">Origin</label>
                 <Input 
                   placeholder="Ex: Scotland" 
                   value={formData.origin}
                   onChange={(e) => setFormData({...formData, origin: e.target.value})}
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-sm font-medium">Size Category</label>
                 <select 
                   className="flex h-10 w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] text-[var(--foreground)]"
                   value={formData.size_category}
                   onChange={(e) => setFormData({...formData, size_category: e.target.value})}
                 >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                 </select>
              </div>
              <div className="space-y-2">
                 <label className="text-sm font-medium">Life Expectancy</label>
                 <Input 
                   placeholder="Ex: 10-12 years" 
                   value={formData.life_expectancy}
                   onChange={(e) => setFormData({...formData, life_expectancy: e.target.value})}
                 />
              </div>
           </CardContent>
        </Card>

        {/* Characteristics */}
        <Card>
           <CardHeader>
             <CardTitle>Characteristics</CardTitle>
           </CardHeader>
           <CardContent className="space-y-6">
              <div className="space-y-2">
                 <label className="text-sm font-medium">Temperament</label>
                 <Input 
                   placeholder="Ex: Friendly, Intelligent, Devoted" 
                   value={formData.temperament}
                   onChange={(e) => setFormData({...formData, temperament: e.target.value})}
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-sm font-medium">Description</label>
                 <textarea 
                   rows={5}
                   className="flex w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] resize-none"
                   placeholder="Historical background and breed standards..."
                   value={formData.description}
                   onChange={(e) => setFormData({...formData, description: e.target.value})}
                 />
              </div>
           </CardContent>
        </Card>

        {/* Cover Image */}
        <Card>
           <CardHeader>
             <CardTitle>Cover Image</CardTitle>
             <CardDescription>Primary image representatng the breed standard.</CardDescription>
           </CardHeader>
           <CardContent>
              {formData.cover_image_url ? (
                <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-[var(--border)] group">
                   <img src={formData.cover_image_url} alt="" className="object-cover w-full h-full" />
                   <button 
                     onClick={() => setFormData({...formData, cover_image_url: ""})}
                     className="absolute top-2 right-2 h-8 w-8 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                   >
                      <X className="h-4 w-4" />
                   </button>
                </div>
              ) : (
                <label className="h-40 w-full flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[var(--border)] bg-[var(--background)] hover:border-[var(--accent)]/50 hover:bg-[var(--accent)]/5 cursor-pointer transition-colors">
                   <UploadCloud className="h-8 w-8 text-[var(--muted)]" />
                   <span className="text-sm font-medium text-[var(--muted)]">{uploading ? "Uploading..." : "Upload Cover Image"}</span>
                   <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                </label>
              )}
           </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex items-center justify-end gap-4">
           <Link href="/admin/breeds">
              <Button type="button" variant="ghost">Cancel</Button>
           </Link>
           <Button type="submit" size="lg" className="w-40 gap-2" disabled={loading || uploading}>
              {loading ? "Adding..." : <><Save className="h-4 w-4" /> Save Breed</>}
           </Button>
        </div>
      </form>
    </div>
  )
}
