"use client"

import * as React from "react"
import { X, User, Dog, DollarSign, Calendar, Truck, ShieldCheck, Mail, Phone, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { createClient } from "@/lib/supabase/client"
import { toast } from "@/hooks/use-toast"

interface OrderDetailModalProps {
  order: any
  isOpen: boolean
  onClose: () => void
  onUpdate: () => void
}

export function OrderDetailModal({ order, isOpen, onClose, onUpdate }: OrderDetailModalProps) {
  const [updating, setUpdating] = React.useState(false)
  const supabase = createClient()

  if (!isOpen || !order) return null

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(val)
  }

  const updateStatus = async (field: string, value: string) => {
    try {
      setUpdating(true)
      const { error } = await supabase
        .from("orders")
        .update({ [field]: value })
        .eq("id", order.id)

      if (error) throw error
      
      toast({ title: "Updated", description: `Order ${field} set to ${value}.` })
      onUpdate()
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" })
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      {/* Content */}
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-[2.5rem] bg-[var(--background)] border border-[var(--border)] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-[var(--border)] bg-[var(--surface-2)]/50">
           <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center">
                 <DollarSign className="h-6 w-6" />
              </div>
              <div>
                 <h2 className="text-xl font-black text-[var(--foreground)] uppercase tracking-tight">Order Details</h2>
                 <p className="text-xs font-mono text-[var(--muted)]">{order.paystack_reference || order.id}</p>
              </div>
           </div>
           <button onClick={onClose} className="h-10 w-10 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
              <X className="h-5 w-5" />
           </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
           
           {/* Grid Layout for Info */}
           <div className="grid md:grid-cols-2 gap-8">
              
              {/* Customer Column */}
              <div className="space-y-6">
                 <div className="flex items-center gap-2 text-[var(--muted)] font-black text-xs uppercase tracking-widest">
                    <User className="h-3 w-3" /> Customer Information
                 </div>
                 <div className="p-6 rounded-3xl bg-[var(--surface-2)] border border-[var(--border)] space-y-4">
                    <div>
                        <span className="block text-[10px] uppercase font-bold text-[var(--muted)] mb-1">Full Name</span>
                        <p className="text-lg font-bold text-[var(--foreground)]">{order.customer?.full_name || order.customer_snapshot?.full_name || 'Guest Customer'}</p>
                    </div>
                    <div className="flex items-center gap-6">
                       <div className="flex-1">
                          <span className="block text-[10px] uppercase font-bold text-[var(--muted)] mb-1 underline decoration-[var(--accent)] decoration-2 underline-offset-4">Email</span>
                          <div className="flex items-center gap-2 mt-1">
                             <Mail className="h-4 w-4 text-[var(--muted)]" />
                             <span className="text-sm font-medium">{order.customer?.email || order.customer_snapshot?.email}</span>
                          </div>
                       </div>
                    </div>
                    <div className="pt-2">
                       <span className="block text-[10px] uppercase font-bold text-[var(--muted)] mb-1">Contact Phone</span>
                       <div className="flex items-center gap-2 mt-1">
                          <Phone className="h-4 w-4 text-[var(--muted)]" />
                          <span className="text-sm font-medium">{order.customer?.phone || order.customer_snapshot?.phone || 'Not provided'}</span>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Dog Column */}
              <div className="space-y-6">
                 <div className="flex items-center gap-2 text-[var(--muted)] font-black text-xs uppercase tracking-widest">
                    <Dog className="h-3 w-3" /> Purchased Item
                 </div>
                 <div className="p-6 rounded-3xl bg-[var(--surface-2)] border border-[var(--border)] flex items-start gap-4">
                    <div className="h-20 w-20 rounded-2xl bg-[var(--background)] border border-[var(--border)] overflow-hidden shrink-0">
                       {order.dog?.images?.[0]?.url && (
                          <img src={order.dog.images[0].url} alt="" className="w-full h-full object-cover" />
                       )}
                    </div>
                    <div className="flex-1">
                       <h3 className="text-lg font-black text-[var(--foreground)] mb-1">{order.dog?.name || 'Deleted Dog Reference'}</h3>
                       <p className="text-xs text-[var(--muted)] mb-3">{order.dog?.breed?.name}</p>
                       <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[10px] font-black uppercase bg-[var(--background)]">Status: {order.dog?.status}</Badge>
                       </div>
                    </div>
                 </div>
              </div>

           </div>

           {/* Financials & Timeline */}
           <div className="grid md:grid-cols-2 gap-8 pt-4">
              <div className="space-y-4">
                 <div className="flex items-center gap-2 text-[var(--muted)] font-black text-xs uppercase tracking-widest">
                    <DollarSign className="h-3 w-3" /> Financial Status
                 </div>
                 <div className="p-6 rounded-3xl bg-[var(--surface)] border-2 border-[var(--border)] space-y-6">
                    <div className="flex justify-between items-center">
                       <span className="text-sm font-medium text-[var(--muted)]">Paid Amount</span>
                       <span className="text-2xl font-black text-[var(--foreground)]">{formatCurrency(order.amount_paid)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-sm font-medium text-[var(--muted)]">Payment Status</span>
                       <select 
                         disabled={updating}
                         value={order.status}
                         onChange={(e) => updateStatus('status', e.target.value)}
                         className="bg-[var(--background)] border border-[var(--border)] rounded-full px-4 py-2 text-xs font-black uppercase tracking-wider"
                       >
                          <option value="pending">Pending</option>
                          <option value="successful">Successful</option>
                          <option value="failed">Failed</option>
                          <option value="refunded">Refunded</option>
                       </select>
                    </div>
                 </div>
              </div>

              <div className="space-y-4">
                 <div className="flex items-center gap-2 text-[var(--muted)] font-black text-xs uppercase tracking-widest">
                    <Truck className="h-3 w-3" /> Delivery Roadmap
                 </div>
                 <div className="p-6 rounded-3xl bg-[var(--surface)] border-2 border-[var(--border)] space-y-6">
                    <div className="flex justify-between items-center">
                       <span className="text-sm font-medium text-[var(--muted)]">Logistics Stage</span>
                       <select 
                         disabled={updating}
                         value={order.delivery_status || 'processing'}
                         onChange={(e) => updateStatus('delivery_status', e.target.value)}
                         className="bg-[var(--accent)] text-black border-none rounded-full px-4 py-2 text-xs font-black uppercase tracking-wider shadow-lg shadow-[var(--accent)]/20 cursor-pointer"
                       >
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="out_for_delivery">In Transit</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                       </select>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-[var(--surface-2)] rounded-2xl">
                       <Calendar className="h-4 w-4 text-[var(--muted)]" />
                       <span className="text-xs font-medium text-[var(--muted)]">Ordered on {new Date(order.created_at).toLocaleString()}</span>
                    </div>
                 </div>
              </div>
           </div>

        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-[var(--border)] bg-[var(--background)] flex items-center justify-between">
           <div className="flex items-center gap-2 text-[var(--success)] font-bold text-xs">
              <ShieldCheck className="h-4 w-4" /> Secure Transaction Verified
           </div>
           <Button className="rounded-full px-10 h-12 font-black" onClick={onClose}>Done</Button>
        </div>
      </div>
    </div>
  )
}
