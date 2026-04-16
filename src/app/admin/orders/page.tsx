"use client"

import * as React from "react"
import { Search, Package, Truck, CheckCircle2, XCircle, MoreVertical } from "lucide-react"

import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Badge } from "@/components/ui/Badge"
import { createClient } from "@/lib/supabase/client"
import { toast } from "@/hooks/use-toast"

export default function AdminOrdersPage() {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [orders, setOrders] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const supabase = createClient()

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          dog:dogs(name, breed:breeds(name)),
          customer:profiles(full_name, email)
        `)
        .order("created_at", { ascending: false })
      
      if (error) throw error
      setOrders(data || [])
    } catch (err) {
      console.error("Error fetching orders:", err)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchOrders()
  }, [])

  const updateDeliveryStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ delivery_status: status })
        .eq("id", id)
      
      if (error) throw error
      
      setOrders(orders.map(o => o.id === id ? { ...o, delivery_status: status } : o))
      toast({ title: "Updated", description: `Delivery status set to ${status}.` })
    } catch (err) {
      console.error("Update error:", err)
    }
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(val)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing': return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
      case 'shipped': return 'bg-purple-500/10 text-purple-500 border-purple-500/20'
      case 'out_for_delivery': return 'bg-orange-500/10 text-orange-500 border-orange-500/20'
      case 'delivered': return 'bg-green-500/10 text-green-500 border-green-500/20'
      case 'cancelled': return 'bg-red-500/10 text-red-500 border-red-500/20'
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20'
    }
  }

  const filteredOrders = orders.filter(o => 
    o.customer?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.id.includes(searchTerm) ||
    o.dog?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-[var(--foreground)]">Order Management</h1>
        <p className="text-[var(--muted)] text-sm mt-1">Track payments, shipping, and delivery status.</p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
         <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
            <Input 
              placeholder="Search by customer or dog..." 
              className="pl-9 bg-[var(--background)]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-[var(--surface)] text-[var(--muted)] border-b border-[var(--border)]">
                <tr>
                  <th className="px-6 py-4 font-semibold">Order / Customer</th>
                  <th className="px-6 py-4 font-semibold">Item</th>
                  <th className="px-6 py-4 font-semibold">Amount</th>
                  <th className="px-6 py-4 font-semibold">Payment</th>
                  <th className="px-6 py-4 font-semibold">Delivery Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {loading ? (
                  [1, 2, 3].map(i => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={6} className="px-6 py-8 bg-[var(--surface)]/20" />
                    </tr>
                  ))
                ) : filteredOrders.length > 0 ? filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[var(--surface)]/50 transition-colors">
                    <td className="px-6 py-4">
                       <div className="font-mono text-[10px] text-[var(--muted)] mb-1 uppercase">#{order.id.slice(0, 8)}</div>
                       <div className="font-semibold text-[var(--foreground)]">{order.customer?.full_name}</div>
                       <div className="text-[10px] text-[var(--muted)]">{order.customer?.email}</div>
                    </td>
                    <td className="px-6 py-4">
                       <div className="text-[var(--foreground)] font-medium">{order.dog?.name}</div>
                       <div className="text-[10px] text-[var(--muted)]">{order.dog?.breed?.name}</div>
                    </td>
                    <td className="px-6 py-4 font-semibold">
                       {formatCurrency(order.amount_paid)}
                       <div className="text-[10px] text-[var(--muted)] font-normal">Fee: {formatCurrency(order.delivery_fee || 0)}</div>
                    </td>
                    <td className="px-6 py-4">
                       <Badge variant={order.status === "successful" ? "success" : "warning"}>
                          {order.status}
                       </Badge>
                    </td>
                    <td className="px-6 py-4">
                       <select 
                        value={order.delivery_status || 'processing'}
                        onChange={(e) => updateDeliveryStatus(order.id, e.target.value)}
                        className={`text-xs font-semibold px-2 py-1 rounded border capitalize appearance-none cursor-pointer focus:outline-none ${getStatusColor(order.delivery_status || 'processing')}`}
                       >
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="out_for_delivery">Out for Delivery</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                       </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                       </Button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-[var(--muted)]">
                      No orders found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
         </div>
      </div>
    </div>
  )
}
