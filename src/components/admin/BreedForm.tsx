"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Save, X, ImageIcon, Plus } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { createClient } from "@/lib/supabase/client"
import { toast } from "@/hooks/use-toast"
import { MediaSelectorModal } from "./MediaSelectorModal"

interface BreedFormProps {
  initialData?: any
  isEditing?: boolean
}

export function BreedForm({ initialData, isEditing = false }: BreedFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = React.useState(false)
  const [isMediaModalOpen, setIsMediaModalOpen] = React.useState(false)
  
  const [formData, setFormData] = React.useState({
    name: initialData?.name || "",
    origin: initialData?.origin || "",
    temperament: initialData?.temperament || "",
    size_category: initialData?.size_category || "medium",
    life_expectancy: initialData?.life_expectancy || "",
    description: initialData?.description || "",
    cover_image_url: initialData?.cover_image_url || ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isEditing && initialData?.id) {
        const { error } = await supabase
          .from("breeds")
          .update(formData)
          .eq("id", initialData.id)
        if (error) throw error
        toast({ title: "Updated", description: "Breed standards updated." })
      } else {
        const { error } = await supabase
          .from("breeds")
          .insert([formData])
        if (error) throw error
        toast({ title: "Success", description: "Breed added to library." })
      }
      
      router.push("/admin/breeds")
      router.refresh()
    } catch (err: any) {
      console.error("Breed form error:", err)
      toast({ title: "Error", description: err.message || "Operation failed.", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <Card className="rounded-[2.5rem] border-[var(--border)] bg-[var(--surface)] shadow-sm">
         <CardHeader>
           <CardTitle>Core Standard</CardTitle>
           <CardDescription>Essential details that define this breed.</CardDescription>
         </CardHeader>
         <CardContent className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
               <label className="text-sm font-bold text-[var(--muted)] uppercase tracking-wider">Breed Name</label>
               <Input 
                 required 
                 placeholder="Ex: Golden Retriever" 
                 value={formData.name}
                 onChange={(e) => setFormData({...formData, name: e.target.value})}
                 className="rounded-2xl h-12"
               />
            </div>
            <div className="space-y-2">
               <label className="text-sm font-bold text-[var(--muted)] uppercase tracking-wider">Origin</label>
               <Input 
                 placeholder="Ex: Scotland" 
                 value={formData.origin}
                 onChange={(e) => setFormData({...formData, origin: e.target.value})}
                 className="rounded-2xl h-12"
               />
            </div>
            <div className="space-y-2">
               <label className="text-sm font-bold text-[var(--muted)] uppercase tracking-wider">Size Category</label>
               <select 
                 className="flex h-12 w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] text-[var(--foreground)]"
                 value={formData.size_category}
                 onChange={(e) => setFormData({...formData, size_category: e.target.value})}
               >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
               </select>
            </div>
            <div className="space-y-2">
               <label className="text-sm font-bold text-[var(--muted)] uppercase tracking-wider">Life Expectancy</label>
               <Input 
                 placeholder="Ex: 10-12 years" 
                 value={formData.life_expectancy}
                 onChange={(e) => setFormData({...formData, life_expectancy: e.target.value})}
                 className="rounded-2xl h-12"
               />
            </div>
         </CardContent>
      </Card>

      {/* Characteristics */}
      <Card className="rounded-[2.5rem] border-[var(--border)] bg-[var(--surface)] shadow-sm">
         <CardHeader>
           <CardTitle>Characteristics & Pedigree</CardTitle>
         </CardHeader>
         <CardContent className="space-y-6">
            <div className="space-y-2">
               <label className="text-sm font-bold text-[var(--muted)] uppercase tracking-wider">Temperament</label>
               <Input 
                 placeholder="Ex: Friendly, Intelligent, Devoted" 
                 value={formData.temperament}
                 onChange={(e) => setFormData({...formData, temperament: e.target.value})}
                 className="rounded-2xl h-12"
               />
            </div>
            <div className="space-y-2">
               <label className="text-sm font-bold text-[var(--muted)] uppercase tracking-wider">Standard Description</label>
               <textarea 
                 rows={5}
                 className="flex w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] resize-none"
                 placeholder="Historical background and official breed standards..."
                 value={formData.description}
                 onChange={(e) => setFormData({...formData, description: e.target.value})}
               />
            </div>
         </CardContent>
      </Card>

      {/* Cover Image */}
      <Card className="rounded-[2.5rem] border-[var(--border)] bg-[var(--surface)] shadow-sm">
         <CardHeader>
           <CardTitle>Identity Image</CardTitle>
           <CardDescription>Select the primary image representing this breed.</CardDescription>
         </CardHeader>
         <CardContent>
            {formData.cover_image_url ? (
              <div className="relative w-full aspect-video rounded-[1.5rem] overflow-hidden border border-[var(--border)] group">
                 <img src={formData.cover_image_url} alt="" className="object-cover w-full h-full" />
                 <button 
                   type="button"
                   onClick={() => setFormData({...formData, cover_image_url: ""})}
                   className="absolute top-4 right-4 h-10 w-10 bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-md"
                 >
                    <X className="h-5 w-5" />
                 </button>
              </div>
            ) : (
              <button 
                type="button"
                onClick={() => setIsMediaModalOpen(true)}
                className="h-48 w-full flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-[var(--border)] bg-[var(--surface-2)]/50 hover:border-[var(--accent)]/50 hover:bg-[var(--accent)]/5 cursor-pointer transition-all group"
              >
                 <div className="h-12 w-12 rounded-full bg-[var(--background)] flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <Plus className="h-6 w-6 text-[var(--accent)]" />
                 </div>
                 <span className="text-xs font-bold text-[var(--muted)] tracking-widest uppercase">Select from Library</span>
              </button>
            )}
         </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex items-center justify-end gap-4 fixed bottom-8 right-8 z-40 bg-[var(--surface)]/80 backdrop-blur-md p-2 rounded-full border border-[var(--border)] shadow-2xl">
         <Button type="button" variant="ghost" className="rounded-full px-8" onClick={() => router.push("/admin/breeds")}>Cancel</Button>
         <Button type="submit" size="lg" className="px-10 gap-2 rounded-full h-14 font-bold" disabled={loading}>
            {loading ? "Saving..." : <><Save className="h-4 w-4" /> {isEditing ? "Update Breed" : "Save Breed"}</>}
         </Button>
      </div>

      <MediaSelectorModal 
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        onSelect={(url) => setFormData({...formData, cover_image_url: url})}
      />
    </form>
  )
}
