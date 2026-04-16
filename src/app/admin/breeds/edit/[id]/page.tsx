import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/Button"
import { BreedForm } from "@/components/admin/BreedForm"

interface EditBreedPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditBreedPage({ params }: EditBreedPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: breed, error } = await supabase
    .from("breeds")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !breed) {
    return notFound()
  }

  return (
    <div className="max-w-4xl space-y-6 pb-20">
      <div className="flex items-center gap-4">
        <Link href="/admin/breeds">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="font-display text-3xl font-bold text-[var(--foreground)]">Edit Breed Standard</h1>
          <p className="text-[var(--muted)] text-sm">Update standards for {breed.name}.</p>
        </div>
      </div>

      <BreedForm initialData={breed} isEditing />
    </div>
  )
}
