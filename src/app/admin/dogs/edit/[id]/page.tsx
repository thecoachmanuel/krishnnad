import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/Button"
import { DogForm } from "@/components/admin/DogForm"

interface EditDogPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditDogPage({ params }: EditDogPageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch dog with images to pre-populate the form
  const { data: dog, error } = await supabase
    .from("dogs")
    .select(`
      *,
      images:dog_images(url)
    `)
    .eq("id", id)
    .single()

  if (error || !dog) {
    return notFound()
  }

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/dogs">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="font-display text-3xl font-bold text-[var(--foreground)]">Edit Listing</h1>
          <p className="text-[var(--muted)] text-sm">Update profile and availability for {dog.name}.</p>
        </div>
      </div>

      <DogForm initialData={dog} isEditing />
    </div>
  )
}
