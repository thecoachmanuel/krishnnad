"use client"

import * as React from "react"
import { X, ImagePlus } from "lucide-react"
import { MediaLibrary } from "./MediaLibrary"
import { Button } from "@/components/ui/Button"

interface MediaSelectorModalProps {
  onSelect: (url: string) => void
  onClose: () => void
  isOpen: boolean
}

export function MediaSelectorModal({ onSelect, onClose, isOpen }: MediaSelectorModalProps) {
  const [selected, setSelected] = React.useState<string | null>(null)

  if (!isOpen) return null

  const handleConfirm = () => {
    if (selected) {
      onSelect(selected)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-5xl max-h-[90vh] flex flex-col rounded-3xl bg-[var(--background)] border border-[var(--border)] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
             <div className="h-10 w-10 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center">
                <ImagePlus className="h-5 w-5" />
             </div>
             <div>
                <h3 className="text-xl font-bold text-[var(--foreground)]">Select from Library</h3>
                <p className="text-xs text-[var(--muted)]">Pick an existing asset or upload a new one.</p>
             </div>
          </div>
          <button 
            onClick={onClose}
            className="h-8 w-8 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Library Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-[var(--surface-2)]/30">
          <MediaLibrary 
            selectedUrl={selected || undefined} 
            onSelect={(url) => setSelected(url)} 
          />
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[var(--border)] bg-[var(--surface)] flex items-center justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button 
            disabled={!selected} 
            onClick={handleConfirm}
            className="px-8"
          >
            Confirm Selection
          </Button>
        </div>
      </div>
    </div>
  )
}
