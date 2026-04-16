"use client"

import * as React from "react"
import Link from "next/link"
import { Package, ArrowRight, ExternalLink } from "lucide-react"

import { Button } from "@/components/ui/Button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"

import { createClient } from "@/lib/supabase/client"
import { format } from "date-fns" // Assuming date-fns is available or I'll use native Date

export default function MyOrdersPage() {
  const [orders, setOrders] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const supabase = createClient()

  React.useEffect(() => {
    async function fetchOrders() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data, error } = await supabase
          .from("orders")
          .select(`
            *,
            dog:dogs(name, id)
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
          <div key={i} className="h-32 w-full animate-pulse rounded-2xl bg-[var(--surface-2)]" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-[var(--foreground)]">Order History</h1>
        <p className="text-[var(--muted)] mt-1">Track your pending requests and successful purchases.</p>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border)] p-12 text-center bg-[var(--surface)]">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--accent)]/10 text-[var(--accent)]">
            <Package className="h-8 w-8" />
          </div>
          <h3 className="font-display text-xl font-bold text-[var(--foreground)]">No orders yet</h3>
          <p className="mt-2 text-[var(--muted)] max-w-sm">When you reserve or purchase a dog, your history will appear here.</p>
          <Link href="/dogs" className="mt-6">
            <Button>Explore Collection <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
             const formattedAmount = new Intl.NumberFormat("en-NG", {
               style: "currency",
               currency: "NGN",
               maximumFractionDigits: 0,
             }).format(order.amount_paid || 0)

             const datePlaced = new Date(order.created_at).toLocaleDateString('en-US', {
               month: 'short',
               day: 'numeric',
               year: 'numeric'
             })

             return (
               <Card key={order.id} className="overflow-hidden hover:border-[var(--accent)]/50 transition-colors">
                 <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-4 border-b border-[var(--border)]/50 bg-[var(--surface-2)]">
                       <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                          <div>
                             <span className="block text-[var(--muted)] uppercase tracking-wider text-xs mb-1">Order Tag</span>
                             <span className="font-mono font-bold text-[var(--foreground)] truncate max-w-[120px] block">{order.id.split('-')[0]}</span>
                          </div>
                          <div>
                             <span className="block text-[var(--muted)] uppercase tracking-wider text-xs mb-1">Date Placed</span>
                             <span className="font-medium text-[var(--foreground)]">{datePlaced}</span>
                          </div>
                          <div>
                             <span className="block text-[var(--muted)] uppercase tracking-wider text-xs mb-1">Total</span>
                             <span className="font-mono font-medium text-[var(--foreground)]">{formattedAmount}</span>
                          </div>
                          <div>
                             <span className="block text-[var(--muted)] uppercase tracking-wider text-xs mb-1">Status</span>
                             <Badge variant={order.status === 'successful' ? 'success' : 'warning'}>{order.status}</Badge>
                          </div>
                       </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-4">
                       <div className="flex items-center gap-4">
                          <div className="h-16 w-16 rounded-md bg-[var(--accent)]/20" />
                          <div>
                             <h4 className="font-bold text-[var(--foreground)]">{order.dog?.name || "Unknown Dog"}</h4>
                             <Link href={`/dogs/${order.dog?.id}`} className="text-sm font-medium text-[var(--accent)] hover:underline flex items-center gap-1 mt-1">
                               View Listing <ExternalLink className="h-3 w-3" />
                             </Link>
                          </div>
                       </div>
                       <div className="flex items-center gap-3">
                          {order.status === 'successful' && (
                            <Button variant="outline">Download Invoice</Button>
                          )}
                          {order.status === 'pending' && (
                            <Link href={`/dogs/${order.dog_id}`}>
                              <Button>Complete Payment</Button>
                            </Link>
                          )}
                       </div>
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
