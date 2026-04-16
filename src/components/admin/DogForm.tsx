"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Save, X, Plus, AlertCircle, ShoppingBag } from "lucide-react"

import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { createClient } from "@/lib/supabase/client"
import { toast } from "@/hooks/use-toast"
import { MediaSelectorModal } from "./MediaSelectorModal"

interface DogFormProps {
  initialData?: any
  isEditing?: boolean
}

export function DogForm({ initialData, isEditing = false }: DogFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = React.useState(false)
  const [isMediaModalOpen, setIsMediaModalOpen] = React.useState(false)
  const [breeds, setBreeds] = React.useState<any[]>([])

  const [formData, setFormData] = React.useState({
    name: initialData?.name || "",
    breed_id: initialData?.breed_id || "",
    age_months: initialData?.age_months || "",
    gender: initialData?.gender || "Male",
    price: initialData?.price || "",
    status: initialData?.status || "Available",
    description: initialData?.description || "",
    care_notes: initialData?.care_notes || "",
    color: initialData?.color || "",
    weight_kg: initialData?.weight_kg || "",
    health_certified: initialData?.health_certified ?? true,
    vaccinated: initialData?.vaccinated ?? true,
    dewormed: initialData?.dewormed ?? true,
    microchipped: initialData?.microchipped ?? false,
    pedigree_certified: initialData?.pedigree_certified ?? false,
    is_featured: initialData?.is_featured ?? false,
  })

  // Normalize images for display
  const [images, setImages] = React.useState<string[]>(
    initialData?.images?.map((img: any) => img.url) || []
  )

  React.useEffect(() => {
    async function fetchBreeds() {
      const { data } = await supabase.from("breeds").select("id, name").order("name")
      if (data) setBreeds(data)
    }
    fetchBreeds()
  }, [])

  const handleAddImage = (url: string) => {
    if (!images.includes(url)) {
      setImages(prev => [...prev, url])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.breed_id) {
      toast({ title: "Validation Error", description: "Please select a breed.", variant: "destructive" })
      return
    }

    setLoading(true)
    try {
      let dogId = initialData?.id

      // 1. Upsert Dog
      if (isEditing) {
        const { error: dogError } = await supabase
          .from("dogs")
          .update({
            ...formData,
            age_months: parseInt(formData.age_months as string) || 0,
            price: parseFloat(formData.price as string) || 0,
            weight_kg: parseFloat(formData.weight_kg as string) || 0,
          })
          .eq("id", dogId)
        if (dogError) throw dogError
      } else {
        const { data: newDog, error: dogError } = await supabase
          .from("dogs")
          .insert([{
            ...formData,
            age_months: parseInt(formData.age_months as string) || 0,
            price: parseFloat(formData.price as string) || 0,
            weight_kg: parseFloat(formData.weight_kg as string) || 0,
          }])
          .select()
          .single()
        if (dogError) throw dogError
        dogId = newDog.id
      }

      // 2. Synchronize Images
      // Delete existing associations for this dog to rebuild them based on current order
      await supabase.from("dog_images").delete().eq("dog_id", dogId)

      if (images.length > 0) {
        const imageRecords = images.map((url, index) => ({
          dog_id: dogId,
          url,
          is_primary: index === 0,
          display_order: index
        }))
        const { error: imgError } = await supabase.from("dog_images").insert(imageRecords)
        if (imgError) throw imgError
      }

      toast({ title: "Success", description: isEditing ? "Listing updated." : "New dog published." })
      router.push("/admin/dogs")
      router.refresh()
    } catch (err: any) {
      console.error("Dog form error:", err)
      toast({ title: "Error", description: err.message || "Failed to save dog.", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-32">
       {/* Identity & Status */}
       <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2 rounded-[2.5rem] border-[var(--border)] bg-[var(--surface)] shadow-sm">
             <CardHeader>
                <CardTitle>Basic Information</CardTitle>
             </CardHeader>
             <CardContent className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                   <label className="text-sm font-bold text-[var(--muted)] uppercase tracking-widest">Dog Name</label>
                   <Input 
                     required 
                     placeholder="Ex: Rex" 
                     value={formData.name}
                     onChange={(e) => setFormData({...formData, name: e.target.value})}
                     className="rounded-2xl h-12"
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-sm font-bold text-[var(--muted)] uppercase tracking-widest">Breed</label>
                   <select 
                     required
                     className="flex h-12 w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] text-[var(--foreground)]"
                     value={formData.breed_id}
                     onChange={(e) => setFormData({...formData, breed_id: e.target.value})}
                   >
                      <option value="">Select a Breed</option>
                      {breeds.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                   </select>
                </div>
                <div className="space-y-2">
                   <label className="text-sm font-bold text-[var(--muted)] uppercase tracking-widest">Price (₦)</label>
                   <Input 
                     required 
                     type="number"
                     placeholder="450000" 
                     value={formData.price}
                     onChange={(e) => setFormData({...formData, price: e.target.value})}
                     className="rounded-2xl h-12"
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-sm font-bold text-[var(--muted)] uppercase tracking-widest">Collection Status</label>
                   <select 
                     className="flex h-12 w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] text-[var(--foreground)] font-bold"
                     value={formData.status}
                     onChange={(e) => setFormData({...formData, status: e.target.value})}
                   >
                      <option value="Available">Available</option>
                      <option value="Reserved">Reserved</option>
                      <option value="Sold">Sold</option>
                   </select>
                </div>
             </CardContent>
          </Card>

          <Card className="rounded-[2.5rem] border-[var(--border)] bg-[var(--surface)] shadow-sm">
             <CardHeader>
                <CardTitle>Highlight</CardTitle>
                <CardDescription>Promotional settings for this listing.</CardDescription>
             </CardHeader>
             <CardContent className="space-y-6">
                <label className="flex items-center justify-between p-4 rounded-3xl border border-[var(--border)] bg-[var(--background)] cursor-pointer hover:border-[var(--accent)]/50 transition-all">
                   <div className="space-y-0.5">
                      <span className="text-sm font-bold">Featured Listing</span>
                      <p className="text-[10px] text-[var(--muted)]">Show on homepage collections</p>
                   </div>
                   <input 
                     type="checkbox" 
                     checked={formData.is_featured} 
                     onChange={(e) => setFormData({...formData, is_featured: e.target.checked})}
                     className="h-6 w-6 accent-[var(--accent)]" 
                   />
                </label>
                <div className="bg-[var(--accent)]/5 border border-[var(--accent)]/20 rounded-3xl p-4 flex gap-3">
                   <ShoppingBag className="h-5 w-5 text-[var(--accent)] shrink-0" />
                   <p className="text-[10px] text-[var(--muted)] leading-relaxed">Featured listings are prioritized in search results and shown in the "Premium Collection" sliders.</p>
                </div>
             </CardContent>
          </Card>
       </div>

       {/* Physical Attributes & Health */}
       <div className="grid gap-6 lg:grid-cols-2">
          <Card className="rounded-[2.5rem] border-[var(--border)] bg-[var(--surface)] shadow-sm">
             <CardHeader>
                <CardTitle>Physical & Health Stats</CardTitle>
             </CardHeader>
             <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <label className="text-sm font-bold text-[var(--muted)] uppercase tracking-widest">Age (Months)</label>
                      <Input 
                        placeholder="Ex: 3" 
                        value={formData.age_months}
                        onChange={(e) => setFormData({...formData, age_months: e.target.value})}
                        className="rounded-2xl h-12"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-sm font-bold text-[var(--muted)] uppercase tracking-widest">Gender</label>
                      <select 
                        className="flex h-12 w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-sm text-[var(--foreground)]"
                        value={formData.gender}
                        onChange={(e) => setFormData({...formData, gender: e.target.value})}
                      >
                         <option value="Male">Male</option>
                         <option value="Female">Female</option>
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className="text-sm font-bold text-[var(--muted)] uppercase tracking-widest">Weight (kg)</label>
                      <Input 
                        placeholder="Ex: 5" 
                        value={formData.weight_kg}
                        onChange={(e) => setFormData({...formData, weight_kg: e.target.value})}
                        className="rounded-2xl h-12"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-sm font-bold text-[var(--muted)] uppercase tracking-widest">Color</label>
                      <Input 
                        placeholder="Ex: Fawn" 
                        value={formData.color}
                        onChange={(e) => setFormData({...formData, color: e.target.value})}
                        className="rounded-2xl h-12"
                      />
                   </div>
                </div>

                <div className="bg-[var(--surface-2)] p-6 rounded-[2rem] border border-[var(--border)]">
                   <h4 className="text-xs font-black uppercase text-[var(--muted)] mb-4 tracking-widest">Health Verifications</h4>
                   <div className="grid grid-cols-2 gap-4">
                      {[
                        { key: 'health_certified', label: 'Health Cert' },
                        { key: 'vaccinated', label: 'Vaccinated' },
                        { key: 'dewormed', label: 'Dewormed' },
                        { key: 'microchipped', label: 'Microchipped' },
                        { key: 'pedigree_certified', label: 'Pedigree' }
                      ].map((item) => (
                        <label key={item.key} className="flex items-center gap-3 cursor-pointer p-2 rounded-xl hover:bg-[var(--surface)] transition-colors">
                           <input 
                             type="checkbox" 
                             checked={(formData as any)[item.key]} 
                             onChange={(e) => setFormData({...formData, [item.key]: e.target.checked})}
                             className="h-4 w-4 accent-[var(--accent)]" 
                           />
                           <span className="text-sm font-bold">{item.label}</span>
                        </label>
                      ))}
                   </div>
                </div>
             </CardContent>
          </Card>

          <Card className="rounded-[2.5rem] border-[var(--border)] bg-[var(--surface)] shadow-sm">
             <CardHeader>
                <CardTitle>Biography & Care</CardTitle>
             </CardHeader>
             <CardContent className="space-y-6">
                <div className="space-y-2">
                   <label className="text-sm font-bold text-[var(--muted)] uppercase tracking-widest">Description</label>
                   <textarea 
                     rows={5}
                     required
                     placeholder="Temperament, behavior, and unique traits..."
                     className="flex w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] resize-none"
                     value={formData.description}
                     onChange={(e) => setFormData({...formData, description: e.target.value})}
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-sm font-bold text-[var(--muted)] uppercase tracking-widest">Breeder's Notes</label>
                   <Input 
                     placeholder="Special care instructions or feed details..." 
                     value={formData.care_notes}
                     onChange={(e) => setFormData({...formData, care_notes: e.target.value})}
                     className="rounded-2xl h-12"
                   />
                </div>
             </CardContent>
          </Card>
       </div>

       {/* Media Section */}
       <Card className="rounded-[2.5rem] border-[var(--border)] bg-[var(--surface)] shadow-sm">
          <CardHeader>
             <CardTitle>Gallery Management</CardTitle>
             <CardDescription>Select images from your library. The first image is primary.</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                {images.map((url, i) => (
                   <div key={i} className="relative aspect-square rounded-3xl overflow-hidden border-2 border-[var(--border)] group">
                      <img src={url} alt="" className="object-cover w-full h-full" />
                      <button 
                        type="button"
                        onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                        className="absolute top-2 right-2 h-8 w-8 bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-md"
                      >
                         <X className="h-4 w-4" />
                      </button>
                      {i === 0 && (
                        <div className="absolute bottom-0 left-0 right-0 bg-[var(--accent)] text-black text-[9px] font-black text-center py-1 uppercase tracking-widest">
                          Primary
                        </div>
                      )}
                   </div>
                ))}
                
                <button 
                   type="button"
                   onClick={() => setIsMediaModalOpen(true)}
                   className="aspect-square flex flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-[var(--border)] bg-[var(--surface-2)] hover:border-[var(--accent)]/50 hover:bg-[var(--accent)]/5 cursor-pointer transition-all group"
                >
                   <div className="h-10 w-10 rounded-full bg-[var(--background)] flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                      <Plus className="h-5 w-5 text-[var(--accent)]" />
                   </div>
                   <span className="text-[10px] font-black text-[var(--muted)] uppercase tracking-tighter">Add from Library</span>
                </button>
             </div>
          </CardContent>
       </Card>

       {/* Fixed Actions Footer */}
       <div className="flex items-center justify-end gap-3 fixed bottom-8 right-8 z-40 bg-[var(--surface)]/80 backdrop-blur-md p-3 rounded-[2rem] border border-[var(--border)] shadow-2xl">
          <Button type="button" variant="ghost" className="rounded-full px-8 font-bold" onClick={() => router.push("/admin/dogs")}>Cancel</Button>
          <Button type="submit" size="lg" className="px-10 gap-2 rounded-full h-14 font-black shadow-lg shadow-[var(--accent)]/30" disabled={loading}>
             {loading ? "Persisting..." : <><Save className="h-5 w-5" /> {isEditing ? "Update Listing" : "Publish Listing"}</>}
          </Button>
       </div>

       <MediaSelectorModal 
         isOpen={isMediaModalOpen}
         onClose={() => setIsMediaModalOpen(false)}
         onSelect={handleAddImage}
       />
    </form>
  )
}
