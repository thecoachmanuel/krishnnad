"use client"

import * as React from "react"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { MapPin, Phone, Mail, CheckCircle2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "@/components/ui/Toast"

export default function ContactPage() {
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
    <main className="flex min-h-screen flex-col bg-[var(--background)]">
      <Navbar />

      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8 flex-1">
        
        <div className="mb-16 text-center">
          <h1 className="font-display text-5xl font-bold text-[var(--foreground)]">Contact Us</h1>
          <p className="mt-4 text-lg text-[var(--muted)]">
            Have questions about a listing or want to join the waitlist? Let's talk.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
           
           {/* Info Panel */}
           <div className="space-y-8 rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-8 sm:p-12">
              <div>
                 <h2 className="font-display text-2xl font-bold text-[var(--foreground)] mb-6">Get in Touch</h2>
                 <p className="text-[var(--muted)] leading-relaxed mb-8">
                   We prioritize our customer's experience. If you are enquiring about a specific litter, please reference the dog's name in your message.
                 </p>
              </div>

              <div className="space-y-6">
                 <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--accent)]">
                       <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                       <h3 className="font-semibold text-[var(--foreground)]">Lagos, Nigeria</h3>
                       <p className="text-sm text-[var(--muted)] mt-1">Visit by appointment only.</p>
                    </div>
                 </div>

                 <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--accent)]">
                       <Phone className="h-5 w-5" />
                    </div>
                    <div>
                       <h3 className="font-semibold text-[var(--foreground)]">WhatsApp</h3>
                       <p className="text-sm text-[var(--accent)] hover:underline cursor-pointer mt-1">+234 800 000 0000</p>
                    </div>
                 </div>

                 <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--accent)]">
                       <Mail className="h-5 w-5" />
                    </div>
                    <div>
                       <h3 className="font-semibold text-[var(--foreground)]">Email</h3>
                       <p className="text-sm text-[var(--accent)] hover:underline cursor-pointer mt-1">hello@krishnnad.com</p>
                    </div>
                 </div>
              </div>
           </div>

           {/* Contact Form */}
           <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-2xl relative overflow-hidden">
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
                  <h3 className="font-display text-2xl font-bold text-[var(--foreground)] mb-6">Send a Message</h3>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                       <div className="space-y-2">
                          <label className="text-sm font-medium text-[var(--foreground)]">First Name</label>
                          <Input 
                            required 
                            placeholder="John" 
                            value={formData.firstName}
                            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-sm font-medium text-[var(--foreground)]">Last Name</label>
                          <Input 
                            required 
                            placeholder="Doe" 
                            value={formData.lastName}
                            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                          />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-sm font-medium text-[var(--foreground)]">Email Address</label>
                       <Input 
                        required 
                        type="email" 
                        placeholder="you@example.com" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                       <label className="text-sm font-medium text-[var(--foreground)]">Message</label>
                       <textarea 
                         rows={5}
                         required
                         className="flex w-full rounded-md border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-sm placeholder:text-[var(--muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:bg-[var(--background)] resize-none"
                         placeholder="How can we help you?"
                         value={formData.message}
                         onChange={(e) => setFormData({...formData, message: e.target.value})}
                       />
                    </div>
                    <Button type="submit" className="w-full h-12 text-base shadow-[0_0_20px_rgba(217,119,6,0.2)]" disabled={loading}>
                      {loading ? "Sending..." : "Send Enquiry"}
                    </Button>
                  </form>
                </>
              )}
           </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
