"use client"

import * as React from "react"
import { MediaLibrary } from "@/components/admin/MediaLibrary"

export default function AdminMediaLibrary() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-[var(--foreground)]">Media Library</h1>
          <p className="text-[var(--muted)] text-sm mt-1">Manage and upload all your collection assets and certificates.</p>
        </div>
      </div>

      <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
        <MediaLibrary />
      </div>
    </div>
  )
}
