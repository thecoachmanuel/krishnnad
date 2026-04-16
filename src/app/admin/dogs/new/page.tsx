"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Plus, X, Image as ImageIcon } from "lucide-react"

import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { createClient } from "@/lib/supabase/client"
import { toast } from "@/hooks/use-toast"
import { MediaSelectorModal } from "@/components/admin/MediaSelectorModal"

export default function NewDogWizard() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = React.useState(false)
  const [breeds, setBreeds] = React.useState<any[]>([])
  const [isMediaModalOpen, setIsMediaModalOpen] = React.useState(false)
  
  const [formData, setFormData] = React.useState({
    name: "",
    breed_id: "",
    age_months: "",
    gender: "Male",
    price: "",
    description: "",
    care_notes: "",
    health_certified: true,
    vaccinated: true,
    dewormed: true,
    microchipped: false,
    pedigree_certified: false,
  })

  const [images, setImages] = React.useState<string[]>([])

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
      toast({ title: "Error", description: "Please select a breed.", variant: "destructive" })
      return
    }

    setLoading(true)
    try {
      // 1. Insert Dog
      const { data: dog, error: dogError } = await supabase
        .from("dogs")
        .insert([{
          name: formData.name,
          breed_id: formData.breed_id,
          age_months: parseInt(formData.age_months) || 0,
          gender: formData.gender,
          price: parseFloat(formData.price),
          description: formData.description,
          care_notes: formData.care_notes,
          health_certified: formData.health_certified,
          vaccinated: formData.vaccinated,
          dewormed: formData.dewormed,
          microchipped: formData.microchipped,
          pedigree_certified: formData.pedigree_certified,
          status: "Available"
        }])
        .select()
        .single()

      if (dogError) throw dogError

      // 2. Insert Images (Attach URLs from Library to this dog)
      if (images.length > 0) {
        const imageRecords = images.map((url, index) => ({
          dog_id: dog.id,
          url,
          is_primary: index === 0,
          display_order: index
        }))

        // We use insert here. If these URLs already exist in dog_images (without dog_id),
        // we might want to update them, but it's simpler to just create new association records
        // for this specific dog.
        const { error: imgError } = await supabase.from("dog_images").insert(imageRecords)
        if (imgError) throw imgError
      }

      toast({ title: "Success", description: "Dog listing published successfully." })
      router.push("/admin/dogs")
    } catch (err: any) {
      console.error("Save error:", err)
      toast({ title: "Error", description: err.message || "Failed to save dog listing.", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/dogs">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="font-display text-3xl font-bold text-[var(--foreground)]">Add New Listing</h1>
          <p className="text-[var(--muted)] text-sm">Create a new dog profile for the public collection.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 pb-20">
        
        {/* Basic Information */}
        <Card className="rounded-[2rem] border-[var(--border)] bg-[var(--surface)] shadow-sm">
           <CardHeader>
             <CardTitle>Basic Information</CardTitle>
             <CardDescription>Core details about the dog.</CardDescription>
           </CardHeader>
           <CardContent className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                 <label className="text-sm font-medium">Dog Name</label>
                 <Input 
                   required 
                   placeholder="Ex: Caesar" 
                   value={formData.name}
                   onChange={(e) => setFormData({...formData, name: e.target.value})}
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-sm font-medium">Breed</label>
                 <select 
                   required
                   className="flex h-10 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] text-[var(--foreground)]"
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
                 <label className="text-sm font-medium">Age (Months)</label>
                 <Input 
                   required 
                   type="number"
                   placeholder="Ex: 2" 
                   value={formData.age_months}
                   onChange={(e) => setFormData({...formData, age_months: e.target.value})}
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-sm font-medium">Gender</label>
                 <select 
                   className="flex h-10 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] text-[var(--foreground)]"
                   value={formData.gender}
                   onChange={(e) => setFormData({...formData, gender: e.target.value})}
                 >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                 </select>
              </div>
           </CardContent>
        </Card>

        {/* Pricing */}
        <Card className="rounded-[2rem] border-[var(--border)] bg-[var(--surface)] shadow-sm">
           <CardHeader>
             <CardTitle>Pricing</CardTitle>
           </CardHeader>
           <CardContent>
              <div className="space-y-2 max-w-sm">
                 <label className="text-sm font-medium">Price (₦)</label>
                 <Input 
                   required 
                   type="number" 
                   placeholder="450000" 
                   value={formData.price}
                   onChange={(e) => setFormData({...formData, price: e.target.value})}
                 />
              </div>
           </CardContent>
        </Card>

        {/* Biography & Care */}
        <Card className="rounded-[2rem] border-[var(--border)] bg-[var(--surface)] shadow-sm">
           <CardHeader>
             <CardTitle>Biography & Care Notes</CardTitle>
           </CardHeader>
           <CardContent className="space-y-6">
              <div className="space-y-2">
                 <label className="text-sm font-medium">Detailed Description</label>
                 <textarea 
                   rows={4}
                   required
                   placeholder="Describe the dog's temperament, pedigree line, etc."
                   className="flex w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm placeholder:text-[var(--muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] resize-none"
                   value={formData.description}
                   onChange={(e) => setFormData({...formData, description: e.target.value})}
                 />
              </div>

              <div className="space-y-2">
                 <label className="text-sm font-medium">Breeder's Care Notes</label>
                 <Input 
                   placeholder="Ex: Requires an active household with a fenced yard." 
                   value={formData.care_notes}
                   onChange={(e) => setFormData({...formData, care_notes: e.target.value})}
                 />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border border-[var(--border)] bg-[var(--surface-2)] p-4 rounded-3xl">
                {[
                  { key: 'health_certified', label: 'Health Certified' },
                  { key: 'vaccinated', label: 'Vaccinated' },
                  { key: 'dewormed', label: 'Dewormed' },
                  { key: 'microchipped', label: 'Microchipped' },
                  { key: 'pedigree_certified', label: 'Pedigree Certified' }
                ].map((item) => (
                  <label key={item.key} className="flex items-center gap-3 cursor-pointer p-2 rounded-xl hover:bg-[var(--background)] transition-colors">
                     <input 
                       type="checkbox" 
                       className="h-4 w-4 accent-[var(--accent)]" 
                       checked={(formData as any)[item.key]} 
                       onChange={(e) => setFormData({...formData, [item.key]: e.target.checked})}
                     />
                     <span className="text-sm font-medium">{item.label}</span>
                  </label>
                ))}
              </div>
           </CardContent>
        </Card>

        {/* Media Selection - Using Library */}
        <Card className="rounded-[2rem] border-[var(--border)] bg-[var(--surface)] shadow-sm">
           <CardHeader>
             <CardTitle>Display Media</CardTitle>
             <CardDescription>Select images from your library. The first image will be the primary one.</CardDescription>
           </CardHeader>
           <CardContent className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                 {images.map((url, i) => (
                   <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border border-[var(--border)] group">
                      <img src={url} alt="" className="object-cover w-full h-full" />
                      <button 
                        type="button"
                        onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                        className="absolute top-2 right-2 h-8 w-8 bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                      >
                         <X className="h-4 w-4" />
                      </button>
                      {i === 0 && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] font-bold text-center py-1 uppercase tracking-widest">
                          Primary
                        </div>
                      )}
                   </div>
                 ))}
                 
                 <button 
                    type="button"
                    onClick={() => setIsMediaModalOpen(true)}
                    className="aspect-square flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[var(--border)] bg-[var(--surface-2)]/50 hover:border-[var(--accent)]/50 hover:bg-[var(--accent)]/5 cursor-pointer transition-all group"
                 >
                    <div className="h-10 w-10 rounded-full bg-[var(--background)] flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                       <Plus className="h-5 w-5 text-[var(--accent)]" />
                    </div>
                    <span className="text-xs font-bold text-[var(--muted)]">Add from Library</span>
                 </button>
              </div>

              {images.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 text-[var(--muted)]">
                   <ImageIcon className="h-12 w-12 opacity-10 mb-2" />
                   <p className="text-sm">No images selected for this listing.</p>
                </div>
              )}
           </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex items-center justify-end gap-4">
           <Link href="/admin/dogs">
              <Button type="button" variant="ghost">Cancel</Button>
           </Link>
           <Button type="submit" size="lg" className="w-40 gap-2 rounded-full h-14" disabled={loading}>
              {loading ? "Publishing..." : <><Save className="h-4 w-4" /> Publish Dog</>}
           </Button>
        </div>
      </form>

      <MediaSelectorModal 
        isOpen={isMediaModalOpen} 
        onClose={() => setIsMediaModalOpen(false)}
        onSelect={handleAddImage}
      />
    </div>
  )
}
