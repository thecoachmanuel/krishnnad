"use client"

import * as React from "react"
import { Search, Mail, Phone, Trash2, CheckCircle, Clock } from "lucide-react"

import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Badge } from "@/components/ui/Badge"
import { createClient } from "@/lib/supabase/client"
import { toast } from "@/hooks/use-toast"

export default function AdminEnquiriesPage() {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [enquiries, setEnquiries] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const supabase = createClient()

  const fetchEnquiries = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("enquiries")
        .select("*")
        .order("created_at", { ascending: false })
      
      if (error) throw error
      setEnquiries(data || [])
    } catch (err) {
      console.error("Error fetching enquiries:", err)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchEnquiries()
  }, [])

  const markAsRead = async (id: string, isRead: boolean) => {
    try {
      const { error } = await supabase
        .from("enquiries")
        .update({ is_read: isRead })
        .eq("id", id)
      
      if (error) throw error
      
      setEnquiries(enquiries.map(e => e.id === id ? { ...e, is_read: isRead } : e))
    } catch (err) {
      console.error("Update error:", err)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this enquiry?")) return

    try {
      const { error } = await supabase
        .from("enquiries")
        .delete()
        .eq("id", id)
      
      if (error) throw error
      
      setEnquiries(enquiries.filter(e => e.id !== id))
      toast({ title: "Success", description: "Enquiry deleted." })
    } catch (err) {
      console.error("Delete error:", err)
    }
  }

  const filteredEnquiries = enquiries.filter(e => 
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.message?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-[var(--foreground)]">Customer Enquiries</h1>
        <p className="text-[var(--muted)] text-sm mt-1">Manage and respond to customer questions and interests.</p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
         <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
            <Input 
              placeholder="Search enquiries..." 
              className="pl-9 bg-[var(--background)]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
      </div>

      <div className="grid gap-6">
        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="h-32 w-full animate-pulse rounded-xl bg-[var(--surface-2)]" />
          ))
        ) : filteredEnquiries.length > 0 ? filteredEnquiries.map((enquiry) => (
          <div 
            key={enquiry.id} 
            className={`group relative rounded-xl border p-6 transition-all ${
              !enquiry.is_read 
                ? "border-[var(--accent)]/30 bg-[var(--accent)]/5 shadow-sm" 
                : "border-[var(--border)] bg-[var(--surface-2)] opacity-80"
            }`}
          >
             <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-4 flex-1">
                   <div className="flex items-center gap-3">
                      <h3 className="font-bold text-[var(--foreground)] text-lg">{enquiry.name}</h3>
                      {!enquiry.is_read && <Badge variant="warning">New</Badge>}
                      <span className="text-xs text-[var(--muted)] flex items-center gap-1">
                         <Clock className="h-3 w-3" /> {new Date(enquiry.created_at).toLocaleString()}
                      </span>
                   </div>

                   <div className="flex flex-wrap gap-4 text-sm">
                      <a href={`mailto:${enquiry.email}`} className="flex items-center gap-2 text-[var(--accent)] hover:underline">
                         <Mail className="h-4 w-4" /> {enquiry.email}
                      </a>
                      {enquiry.phone && (
                        <a href={`tel:${enquiry.phone}`} className="flex items-center gap-2 text-[var(--muted)] hover:text-[var(--foreground)]">
                           <Phone className="h-4 w-4" /> {enquiry.phone}
                        </a>
                      )}
                   </div>

                   <p className="text-[var(--foreground)] leading-relaxed bg-[var(--surface)]/50 p-4 rounded-lg border border-[var(--border)] whitespace-pre-wrap">
                      {enquiry.message}
                   </p>
                </div>

                <div className="flex flex-row md:flex-col items-center gap-2 shrink-0">
                   <Button 
                    variant={enquiry.is_read ? "ghost" : "outline"}
                    size="sm"
                    className="gap-2"
                    onClick={() => markAsRead(enquiry.id, !enquiry.is_read)}
                   >
                      {enquiry.is_read ? (
                        <>Mark Unread</>
                      ) : (
                        <><CheckCircle className="h-4 w-4" /> Mark Read</>
                      )}
                   </Button>
                   <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-[var(--muted)] hover:text-[var(--danger)] hover:bg-[var(--danger)]/10 gap-2"
                    onClick={() => handleDelete(enquiry.id)}
                   >
                      <Trash2 className="h-4 w-4" /> Delete
                   </Button>
                </div>
             </div>
          </div>
        )) : (
          <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface-2)]">
             <p className="text-[var(--muted)]">No enquiries found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  )
}
