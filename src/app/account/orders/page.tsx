"use client"

import * as React from "react"
import Link from "next/link"
import { Package, ArrowRight, ExternalLink, Truck, CheckCircle2, Clock, Hourglass } from "lucide-react"

import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { createClient } from "@/lib/supabase/client"

export default function MyOrdersPage() {
  const [orders, setOrders] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const supabase = createClient()

  // Logistic helper to map statuses to labels and icons
  const getLogisticsInfo = (status: string) => {
    switch (status) {
      case 'processing': return { label: 'Processing', icon: Hourglass, color: 'text-blue-500', step: 1 }
      case 'shipped': return { label: 'Shipped', icon: Truck, color: 'text-purple-500', step: 2 }
      case 'out_for_delivery': return { label: 'In Transit', icon: Truck, color: 'text-orange-500', step: 3 }
      case 'delivered': return { label: 'Delivered', icon: CheckCircle2, color: 'text-green-500', step: 4 }
      case 'cancelled': return { label: 'Cancelled', icon: Clock, color: 'text-red-500', step: 0 }
      default: return { label: 'Awaiting Update', icon: Clock, color: 'text-gray-400', step: 1 }
    }
  }

  React.useEffect(() => {
    async function fetchOrders() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data, error } = await supabase
          .from("orders")
          .select(`
            *,
            dog:dogs(
              id,
              name,
              breed:breeds(name),
              images:dog_images(url)
            )
          `)
          .eq("customer_id", user.id)
          .order("created_at", { ascending: false })

        if (error) throw error
        setOrders(data || [])
      } catch (err) {
        console.error("Error fetching orders:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="h-48 w-full animate-pulse rounded-3xl bg-[var(--surface-2)]" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-[var(--foreground)]">Order History</h1>
        <p className="text-[var(--muted)] mt-1">Track your puppy's journey in real-time.</p>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-[var(--border)] p-12 text-center bg-[var(--surface)]">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-[var(--accent)]/10 text-[var(--accent)]">
            <Package className="h-10 w-10" />
          </div>
          <h3 className="font-display text-2xl font-bold text-[var(--foreground)]">No active orders</h3>
          <p className="mt-2 text-[var(--muted)] max-w-sm mb-8">Your journey with Krishnnad hasn't started yet. Browse our selection of world-class pedigrees.</p>
          <Link href="/dogs">
            <Button size="lg" className="rounded-full px-8">Explore Dogs <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
             const logistics = getLogisticsInfo(order.delivery_status || 'processing')
             const formattedAmount = new Intl.NumberFormat("en-NG", {
               style: "currency",
               currency: "NGN",
               maximumFractionDigits: 0,
             }).format(order.amount_paid || 0)

             const datePlaced = new Date(order.created_at).toLocaleDateString('en-US', {
               month: 'short', day: 'numeric', year: 'numeric'
             })

             const dogImage = order.dog?.images?.[0]?.url || "/images/placeholder-dog.png"

             return (
               <Card key={order.id} className="overflow-hidden border-[var(--border)] bg-[var(--surface)] rounded-[2.5rem] transition-all hover:border-[var(--accent)]/30">
                 <CardContent className="p-0">
                    {/* Header Info */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between p-8 gap-6 border-b border-[var(--border)]/50 bg-[var(--surface-2)]/50">
                       <div className="flex flex-wrap gap-8">
                          <div>
                             <span className="block text-[10px] font-black uppercase tracking-widest text-[var(--muted)] mb-1">Receipt</span>
                             <span className="font-mono font-bold text-[var(--foreground)]">#{order.id.slice(0, 8).toUpperCase()}</span>
                          </div>
                          <div>
                             <span className="block text-[10px] font-black uppercase tracking-widest text-[var(--muted)] mb-1">Placed</span>
                             <span className="font-bold text-[var(--foreground)]">{datePlaced}</span>
                          </div>
                          <div>
                             <span className="block text-[10px] font-black uppercase tracking-widest text-[var(--muted)] mb-1">Total Paid</span>
                             <span className="font-mono font-bold text-[var(--accent)] text-lg">{formattedAmount}</span>
                          </div>
                       </div>
                       <div className="flex items-center gap-3 self-start md:self-center">
                          <Badge className="bg-[var(--foreground)] text-black font-black uppercase tracking-tighter text-[10px] px-3 py-1">
                             {order.status}
                          </Badge>
                       </div>
                    </div>

                    {/* Order Tracking & Details */}
                    <div className="p-8">
                       <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12">
                          <div className="flex items-center gap-6">
                             <div className="h-24 w-24 rounded-2xl border border-[var(--border)] bg-black overflow-hidden shrink-0 shadow-lg">
                                <img src={dogImage} alt="" className="h-full w-full object-cover" />
                             </div>
                             <div>
                                <h4 className="text-2xl font-black text-[var(--foreground)] tracking-tight">{order.dog?.name || "Unknown Listing"}</h4>
                                <div className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider mb-2">{order.dog?.breed?.name}</div>
                                <Link href={`/dogs/${order.dog?.id}`} className="inline-flex items-center gap-2 text-xs font-black uppercase text-[var(--accent)] transition-opacity hover:opacity-70">
                                   View Original Listing <ExternalLink className="h-3.5 w-3.5" />
                                </Link>
                             </div>
                          </div>

                          {/* Logistics Tracker Overlay */}
                          <div className="flex-1 max-w-md bg-[var(--surface-2)] p-6 rounded-3xl border border-[var(--border)]">
                             <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                   <logistics.icon className={`h-5 w-5 ${logistics.color}`} />
                                   <span className="text-sm font-black uppercase tracking-tighter text-[var(--foreground)]">
                                      {logistics.label}
                                   </span>
                                </div>
                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border border-current uppercase tracking-widest ${logistics.color}`}>
                                   Live Track
                                </span>
                             </div>

                             {/* Step Bar */}
                             <div className="relative h-2 w-full bg-[var(--border)] rounded-full overflow-hidden mb-2">
                                <div 
                                   className={`absolute inset-y-0 left-0 transition-all duration-1000 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)]`}
                                   style={{ width: `${(logistics.step / 4) * 100}%` }}
                                />
                             </div>
                             <div className="flex justify-between text-[8px] font-black uppercase text-[var(--muted)] tracking-widest">
                                <span>Paid</span>
                                <span>Prep</span>
                                <span>Transit</span>
                                <span>Arrival</span>
                             </div>
                          </div>
                       </div>
                    </div>

                    {/* Actions */}
                    <div className="px-8 pb-8 pt-0 flex flex-wrap gap-4">
                       <Button variant="outline" className="h-12 px-6 rounded-2xl border-[var(--border)] text-xs font-black uppercase tracking-widest hover:bg-[var(--foreground)] hover:text-black">
                          Download Certificate
                       </Button>
                       <Link href="/contact">
                          <Button variant="ghost" className="h-12 px-6 rounded-2xl text-xs font-black uppercase tracking-widest text-[var(--muted)] hover:text-[var(--foreground)]">
                             Support Concierge
                          </Button>
                       </Link>
                    </div>
                 </CardContent>
               </Card>
             )
          })}
        </div>
      )}
    </div>
  )
}
