"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/Button"
import { useToast } from "@/hooks/use-toast"

declare const PaystackPop: any

interface ReserveButtonProps {
  dogId: string
  dogName: string
}

export function ReserveButton({ dogId, dogName }: ReserveButtonProps) {
  const [loading, setLoading] = React.useState(false)
  const router = useRouter()
  const supabase = createClient()

  // Load Paystack script
  React.useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://js.paystack.co/v1/inline.js"
    script.async = true
    document.body.appendChild(script)
    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const handleReserve = async () => {
    try {
      setLoading(true)

      // 1. Check Auth
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        // Use custom confirm/alert or just redirect
        if (confirm("You need to be logged in to reserve a dog. Log in now?")) {
           router.push(`/auth/login?redirectTo=/dogs/${dogId}`)
        }
        setLoading(false)
        return
      }

      // 2. Initialize checkout via our API
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dogId }),
      })

      const checkoutData = await response.json()

      if (!response.ok) {
        throw new Error(checkoutData.error || "Failed to initialize checkout")
      }

      // 3. Trigger Paystack Pop
      const handler = PaystackPop.setup({
        key: checkoutData.publicKey,
        email: checkoutData.email,
        amount: checkoutData.amount,
        currency: checkoutData.currency,
        ref: checkoutData.reference,
        callback: function(response: any) {
          // Webhook handles the heavy lifting, but we redirect for UX
          router.push(`/account/orders?success=true&ref=${response.reference}`)
        },
        onClose: function() {
          setLoading(false)
        }
      })
      handler.openIframe()

    } catch (error: any) {
      console.error("Payment error:", error)
      alert(error.message || "An error occurred during checkout")
      setLoading(false)
    }
  }

  return (
    <Button 
      size="lg" 
      className="h-16 flex-1 text-lg font-bold shadow-[0_0_20px_rgba(217,119,6,0.3)] border-none"
      onClick={handleReserve}
      disabled={loading}
    >
      {loading ? "Processing..." : `Reserve ${dogName}`}
    </Button>
  )
}
