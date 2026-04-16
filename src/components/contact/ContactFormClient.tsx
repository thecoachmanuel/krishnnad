"use client"

import * as React from "react"
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { createClient } from "@/lib/supabase/client"
import { toast } from "@/hooks/use-toast"

export function ContactFormClient() {
  const [loading, setLoading] = React.useState(false)
  const [submitted, setSubmitted] = React.useState(false)
  const [formData, setFormData] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    message: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("enquiries")
        .insert([{
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          message: formData.message,
          is_read: false
        }])

      if (error) throw error
      
      setSubmitted(true)
      toast({
        title: "Enquiry Sent",
        description: "We've received your message and will get back to you shortly.",
      })
    } catch (err: any) {
      console.error("Enquiry error:", err)
      toast({
        title: "Error",
        description: err.message || "Failed to send enquiry. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-2xl relative overflow-hidden h-fit">
      {submitted ? (
        <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-12">
            <div className="h-20 w-20 rounded-full bg-[var(--success)]/10 text-[var(--success)] flex items-center justify-center animate-in zoom-in duration-500">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-[var(--foreground)]">Message Received!</h3>
              <p className="text-[var(--muted)] mt-2">Thank you for reaching out. We'll be in touch within 24 hours.</p>
            </div>
            <Button variant="outline" onClick={() => setSubmitted(false)}>Send Another Message</Button>
        </div>
      ) : (
        <>
          <h3 className="font-display text-2xl font-bold text-[var(--foreground)] mb-6 text-center">Send a Message</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-[var(--muted)]">First Name</label>
                  <Input 
                    required 
                    placeholder="John" 
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="rounded-xl h-12"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-[var(--muted)]">Last Name</label>
                  <Input 
                    required 
                    placeholder="Doe" 
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="rounded-xl h-12"
                  />
                </div>
            </div>
            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-[var(--muted)]">Email Address</label>
                <Input 
                required 
                type="email" 
                placeholder="you@example.com" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="rounded-xl h-12"
              />
            </div>
            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-[var(--muted)]">Message</label>
                <textarea 
                  rows={5}
                  required
                  className="flex w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-sm placeholder:text-[var(--muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:bg-[var(--background)] resize-none"
                  placeholder="How can we help you?"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                />
            </div>
            <Button type="submit" className="w-full h-14 text-base font-bold rounded-xl shadow-[0_10px_30px_rgba(217,119,6,0.15)]" disabled={loading}>
              {loading ? "Sending..." : "Send Enquiry"}
            </Button>
          </form>
        </>
      )}
    </div>
  )
}
