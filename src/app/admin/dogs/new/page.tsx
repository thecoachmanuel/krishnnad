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

export default function NewDogWizard() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = React.useState(false)
  const [breeds, setBreeds] = React.useState<any[]>([])
  
  const [formData, setFormData] = React.useState({
    name: "",
    breed_id: "",
    age_months: "",
    gender: "Male",
    price: "",
    description: "",
    health_certified: true,
    vaccinated: true,
    dewormed: true,
    microchipped: false,
    pedigree_certified: false,
  })

  const [images, setImages] = React.useState<string[]>([])
  const [uploading, setUploading] = React.useState(false)

  React.useEffect(() => {
    async function fetchBreeds() {
      const { data } = await supabase.from("breeds").select("id, name").order("name")
      if (data) setBreeds(data)
    }
    fetchBreeds()
  }, [])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    try {
      for (const file of Array.from(files)) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `dog-images/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('dog-images')
          .upload(filePath, file)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('dog-images')
          .getPublicUrl(filePath)

        setImages(prev => [...prev, publicUrl])
      }
      toast({ title: "Success", description: "Images uploaded successfully." })
    } catch (err) {
      console.error("Upload error:", err)
      toast({ title: "Error", description: "Failed to upload images.", variant: "destructive" })
    } finally {
      setUploading(false)
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

      // 2. Insert Images
      if (images.length > 0) {
        const imageRecords = images.map((url, index) => ({
          dog_id: dog.id,
          url,
          is_primary: index === 0,
          display_order: index
        }))

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

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Basic Information */}
        <Card>
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
                   className="flex h-10 w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] text-[var(--foreground)]"
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
                   className="flex h-10 w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] text-[var(--foreground)]"
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
        <Card>
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

        {/* Description */}
        <Card>
           <CardHeader>
             <CardTitle>Biography & Health Notes</CardTitle>
           </CardHeader>
           <CardContent className="space-y-6">
              <div className="space-y-2">
                 <label className="text-sm font-medium">Detailed Description</label>
                 <textarea 
                   rows={4}
                   required
                   placeholder="Describe the dog's temperament, pedigree line, etc."
                   className="flex w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm placeholder:text-[var(--muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] resize-none"
                   value={formData.description}
                   onChange={(e) => setFormData({...formData, description: e.target.value})}
                 />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border border-[var(--border)] bg-[var(--surface-2)] p-4 rounded-lg">
                {[
                  { key: 'health_certified', label: 'Health Certified' },
                  { key: 'vaccinated', label: 'Vaccinated' },
                  { key: 'dewormed', label: 'Dewormed' },
                  { key: 'microchipped', label: 'Microchipped' },
                  { key: 'pedigree_certified', label: 'Pedigree Certified' }
                ].map((item) => (
                  <label key={item.key} className="flex items-center gap-3 cursor-pointer">
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

        {/* Media */}
        <Card>
           <CardHeader>
             <CardTitle>Media Upload</CardTitle>
             <CardDescription>Upload images. The first image will be the primary one.</CardDescription>
           </CardHeader>
           <CardContent className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                 {images.map((url, i) => (
                   <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-[var(--border)] group">
                      <img src={url} alt="" className="object-cover w-full h-full" />
                      <button 
                        type="button"
                        onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                        className="absolute top-1 right-1 h-6 w-6 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                         <X className="h-3 w-3" />
                      </button>
                   </div>
                 ))}
                 
                 <label className="aspect-square flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[var(--border)] bg-[var(--background)] hover:border-[var(--accent)]/50 hover:bg-[var(--accent)]/5 cursor-pointer transition-colors">
                    <UploadCloud className="h-6 w-6 text-[var(--muted)]" />
                    <span className="text-xs font-medium text-[var(--muted)]">{uploading ? "Uploading..." : "Upload Image"}</span>
                    <input type="file" className="hidden" accept="image/*" multiple onChange={handleImageUpload} disabled={uploading} />
                 </label>
              </div>
           </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex items-center justify-end gap-4">
           <Link href="/admin/dogs">
              <Button type="button" variant="ghost">Cancel</Button>
           </Link>
           <Button type="submit" size="lg" className="w-40 gap-2" disabled={loading || uploading}>
              {loading ? "Publishing..." : <><Save className="h-4 w-4" /> Publish Dog</>}
           </Button>
        </div>
      </form>
    </div>
  )
}
