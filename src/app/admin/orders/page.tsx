"use client"

import * as React from "react"
import { Search, Package, ShoppingBag, Eye, Filter, ArrowUpRight } from "lucide-react"

import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Badge } from "@/components/ui/Badge"
import { createClient } from "@/lib/supabase/client"
import { OrderDetailModal } from "@/components/admin/OrderDetailModal"

export default function AdminOrdersPage() {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [orders, setOrders] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [selectedOrder, setSelectedOrder] = React.useState<any>(null)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  
  const [activeFilter, setActiveFilter] = React.useState("all")
  
  const supabase = createClient()

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          dog:dogs(name, breed:breeds(name), images:dog_images(url)),
          customer:profiles(full_name, email, phone)
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

  const handleOpenDetail = (order: any) => {
    setSelectedOrder(order)
    setIsModalOpen(true)
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(val)
  }

  const getDeliveryStatusVisuals = (status: string) => {
    switch (status) {
      case 'processing': return { label: 'Processing', color: 'bg-blue-500/10 text-blue-500' }
      case 'shipped': return { label: 'Shipped', color: 'bg-purple-500/10 text-purple-500' }
      case 'out_for_delivery': return { label: 'In Transit', color: 'bg-orange-500/10 text-orange-500' }
      case 'delivered': return { label: 'Delivered', color: 'bg-green-500/10 text-green-500' }
      case 'cancelled': return { label: 'Cancelled', color: 'bg-red-500/10 text-red-500' }
      default: return { label: 'Unknown', color: 'bg-gray-500/10 text-gray-500' }
    }
  }

  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o.customer?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.id.includes(searchTerm) ||
      o.paystack_reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.dog?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = activeFilter === "all" || (o.delivery_status || "processing") === activeFilter

    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
         <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-3xl bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center">
               <ShoppingBag className="h-7 w-7" />
            </div>
            <div>
               <h1 className="font-display text-4xl font-black text-[var(--foreground)] tracking-tight">Post-Purchase Flow</h1>
               <p className="text-[var(--muted)] font-medium">Coordinate logistics and verify payment settlements.</p>
            </div>
         </div>
         <div className="flex items-center gap-3">
            <div className="px-6 py-3 rounded-full border border-[var(--border)] bg-[var(--surface)] flex items-center gap-4">
               <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)]">Active Orders</span>
                  <span className="text-sm font-black">{orders.filter(o => o.status === 'successful').length} Settlements</span>
               </div>
            </div>
         </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-4">
         <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-[2.5rem] border border-[var(--border)] bg-[var(--surface)] p-3 pl-8">
            <div className="flex flex-1 items-center gap-4 w-full">
               <Search className="h-5 w-5 text-[var(--muted)]" />
               <Input 
               placeholder="Search by ID, customer name, or payment reference..." 
               className="bg-transparent border-none focus-visible:ring-0 text-lg font-medium p-0"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>
         </div>

         {/* Filter Bar */}
         <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {[
               { id: 'all', label: 'All Orders' },
               { id: 'processing', label: 'Processing' },
               { id: 'shipped', label: 'Shipped' },
               { id: 'out_for_delivery', label: 'In Transit' },
               { id: 'delivered', label: 'Delivered' },
               { id: 'cancelled', label: 'Cancelled' }
            ].map((tab) => (
               <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
                  className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shrink-0 border ${
                  activeFilter === tab.id 
                  ? 'bg-black text-white border-black shadow-lg' 
                  : 'bg-[var(--surface)] text-[var(--muted)] border-[var(--border)] hover:border-[var(--muted)]'
                  }`}
               >
                  {tab.label}
               </button>
            ))}
         </div>
      </div>

      {/* Order List */}
      <div className="rounded-[3rem] border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-2xl">
         <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-[10px] uppercase bg-[var(--surface-2)]/50 text-[var(--muted)] font-black tracking-widest border-b border-[var(--border)]">
                <tr>
                  <th className="px-8 py-5">Transaction / Customer</th>
                  <th className="px-8 py-5">Managed Item</th>
                  <th className="px-8 py-5">Billing</th>
                  <th className="px-8 py-5">Settlement</th>
                  <th className="px-8 py-5">Logistic Stage</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {loading ? (
                  [1, 2, 3].map(i => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={6} className="px-8 py-12 bg-[var(--surface)]/20" />
                    </tr>
                  ))
                ) : filteredOrders.length > 0 ? filteredOrders.map((order) => {
                  const logistic = getDeliveryStatusVisuals(order.delivery_status || 'processing')
                  return (
                    <tr key={order.id} className="hover:bg-[var(--surface-2)]/30 transition-all cursor-pointer group" onClick={() => handleOpenDetail(order)}>
                      <td className="px-8 py-6">
                        <div className="font-mono text-[10px] text-[var(--muted)] mb-1 uppercase opacity-50">Settlement #{order.id.slice(0, 8)}</div>
                        <div className="font-black text-[var(--foreground)] text-base group-hover:text-[var(--accent)] transition-colors">{order.customer?.full_name || order.customer_snapshot?.full_name}</div>
                        <div className="text-[10px] font-bold text-[var(--muted)] uppercase">{order.customer?.email || order.customer_snapshot?.email}</div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                           <div className="h-10 w-10 rounded-xl border border-[var(--border)] overflow-hidden shrink-0">
                              {order.dog?.images?.[0]?.url && <img src={order.dog.images[0].url} alt="" className="w-full h-full object-cover" />}
                           </div>
                           <div>
                              <div className="text-[var(--foreground)] font-black">{order.dog?.name || 'Item Removed'}</div>
                              <div className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-tight">{order.dog?.breed?.name}</div>
                           </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                         <div className="font-black text-[var(--foreground)]">{formatCurrency(order.amount_paid)}</div>
                         {order.delivery_fee > 0 && <div className="text-[10px] font-bold text-[var(--success)] uppercase">+ {formatCurrency(order.delivery_fee)} Shipping</div>}
                      </td>
                      <td className="px-8 py-6">
                         <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase text-center w-fit tracking-widest ${order.status === 'successful' ? 'bg-[var(--success)]/10 text-[var(--success)]' : 'bg-[var(--warning)]/10 text-[var(--warning)]'}`}>
                            {order.status}
                         </div>
                      </td>
                      <td className="px-8 py-6">
                         <div className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase text-center w-fit border border-current tracking-tighter ${logistic.color}`}>
                            {logistic.label}
                         </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                         <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl bg-[var(--surface-2)] group-hover:bg-[var(--accent)] group-hover:text-black transition-all">
                            <ArrowUpRight className="h-5 w-5" />
                         </Button>
                      </td>
                    </tr>
                  )
                }) : (
                  <tr>
                    <td colSpan={6} className="px-8 py-20 text-center text-[var(--muted)]">
                       <p className="font-black uppercase tracking-widest text-xs opacity-30">No transaction records found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
         </div>
      </div>

      <OrderDetailModal 
        isOpen={isModalOpen}
        order={selectedOrder}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedOrder(null)
        }}
        onUpdate={fetchOrders}
      />
    </div>
  )
}
