"use client"

import * as React from "react"
import { MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/Button"

interface WhatsAppButtonProps {
  dogName: string
  dogId: string
  phone: string
}

export function WhatsAppButton({ dogName, dogId, phone }: WhatsAppButtonProps) {
  const handleEnquiry = () => {
    const message = `Hi Krishnnad Syndicate, I am interested in buying ${dogName} (ID: ${dogId}). Is it still available?`
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${phone.replace(/[^0-9]/g, "")}?text=${encodedMessage}`
    
    window.open(whatsappUrl, "_blank")
  }

  return (
    <Button 
      size="lg" 
      variant="outline" 
      className="h-16 px-8 font-semibold gap-2 border-[var(--border)] hover:bg-[var(--surface-2)] transition-all"
      onClick={handleEnquiry}
    >
      <MessageSquare className="h-5 w-5 text-[#25D366]" />
      WhatsApp Enquiries
    </Button>
  )
}
