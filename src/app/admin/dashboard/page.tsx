"use client"

import * as React from "react"
import Link from "next/link"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, Cell } from "recharts"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { ArrowUpRight, TrendingUp, Users, ShoppingBag, DollarSign, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function AdminDashboardPage() {
  const [stats, setStats] = React.useState({
    totalRevenue: 0,
    dogsAvailable: 0,
    totalCustomers: 0,
    unreadEnquiries: 0
  })
  const [recentOrders, setRecentOrders] = React.useState<any[]>([])
  const [recentEnquiries, setRecentEnquiries] = React.useState<any[]>([])
  const [revenueData, setRevenueData] = React.useState<any[]>([])
  const [breedSalesData, setBreedSalesData] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const supabase = createClient()
      
      // 1. Fetch Parallel Data
      const [
        { data: allOrders },
        { count: dogsCount },
        { count: customersCount },
        { count: enquiriesCount },
        { data: recentEnqs }
      ] = await Promise.all([
        supabase.from('orders').select('amount_paid, created_at, dog:dogs(name, breed:breeds(name)), customer:profiles(full_name), status').eq('status', 'successful'),
        supabase.from('dogs').select('*', { count: 'exact', head: true }).eq('status', 'Available'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'customer'),
        supabase.from('enquiries').select('*', { count: 'exact', head: true }).eq('is_read', false),
        supabase.from('enquiries').select('*').order('created_at', { ascending: false }).limit(5)
      ])

      // 2. Process Revenue Stats & Chart Data
      const totalRev = allOrders?.reduce((acc, curr) => acc + Number(curr.amount_paid), 0) || 0
      
      // Group Revenue by Month (Last 6 months)
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      const monthlyData: Record<string, number> = {}
      
      // Initialize last 6 months
      for (let i = 5; i >= 0; i--) {
        const d = new Date()
        d.setMonth(d.getMonth() - i)
        monthlyData[months[d.getMonth()]] = 0
      }

      allOrders?.forEach(order => {
        const date = new Date(order.created_at)
        const monthName = months[date.getMonth()]
        if (monthlyData[monthName] !== undefined) {
          monthlyData[monthName] += Number(order.amount_paid)
        }
      })

      const chartData = Object.entries(monthlyData).map(([name, total]) => ({ name, total }))
      setRevenueData(chartData)

      // 3. Process Breed Sales Stats
      const breedCounts: Record<string, number> = {}
      allOrders?.forEach(order => {
        const breedName = (order.dog as any)?.breed?.name || "Unknown"
        breedCounts[breedName] = (breedCounts[breedName] || 0) + 1
      })

      const breedChartData = Object.entries(breedCounts)
        .map(([name, sales]) => ({ name, sales }))
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 5) // Top 5 breeds
      
      setBreedSalesData(breedChartData)

      // 4. Update State
      setStats({
        totalRevenue: totalRev,
        dogsAvailable: dogsCount || 0,
        totalCustomers: customersCount || 0,
        unreadEnquiries: enquiriesCount || 0
      })
      setRecentOrders(allOrders?.slice(0, 5) || []) // Just take first 5 successful as recent
      setRecentEnquiries(recentEnqs || [])

    } catch (err) {
      console.error("Dashboard fetch error:", err)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchDashboardData()
  }, [])

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(val)
  }

  if (loading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-[var(--accent)]" />
        <p className="text-[var(--muted)] font-medium">Crunching real-time numbers...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
           <h1 className="font-display text-4xl font-bold text-[var(--foreground)]">Dashboard Overview</h1>
           <p className="text-[var(--muted)] mt-1">Real-time performance metrics and sales analytics.</p>
        </div>
        <Button variant="outline" onClick={fetchDashboardData} className="gap-2">
           Refresh Data
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Revenue", value: formatCurrency(stats.totalRevenue).replace('NGN', '₦'), icon: DollarSign, trend: "+100%", color: "text-[var(--accent)]" },
          { label: "Dogs Available", value: stats.dogsAvailable, icon: ShoppingBag, color: "text-blue-500" },
          { label: "Total Customers", value: stats.totalCustomers, icon: Users, color: "text-purple-500" },
          { label: "Unread Enquiries", value: stats.unreadEnquiries, icon: TrendingUp, color: stats.unreadEnquiries > 0 ? "text-[var(--danger)]" : "text-[var(--success)]" },
        ].map((kpi, i) => (
          <Card key={i} className={`bg-[var(--surface)] border-[var(--border)] rounded-3xl overflow-hidden ${kpi.label === "Unread Enquiries" && stats.unreadEnquiries > 0 ? 'border-[var(--danger)]/50 shadow-lg shadow-[var(--danger)]/5' : ''}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-bold text-[var(--muted)] uppercase tracking-wider">{kpi.label}</p>
                <div className={`p-2 rounded-xl bg-[var(--surface-2)] shadow-inner ${kpi.color}`}>
                  <kpi.icon className="h-5 w-5" />
                </div>
              </div>
              <h2 className="text-3xl font-black text-[var(--foreground)] tracking-tight">
                {kpi.value}
              </h2>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-7">
        {/* Main Chart */}
        <Card className="col-span-1 lg:col-span-4 bg-[var(--surface)] border-[var(--border)] rounded-[2.5rem] shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
               <TrendingUp className="h-5 w-5 text-[var(--accent)]" /> Revenue Trend (Last 6 Months)
            </CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              {stats.totalRevenue > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="var(--muted)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis 
                      stroke="var(--muted)" 
                      fontSize={11} 
                      tickLine={false} 
                      axisLine={false} 
                      tickFormatter={(value) => `₦${(value / 1000).toLocaleString()}k`} 
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                      itemStyle={{ color: 'var(--accent)', fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey="total" stroke="var(--accent)" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-[var(--muted)] space-y-2">
                   <p className="text-sm font-medium">No sales data available to visualize.</p>
                   <p className="text-xs">Once you process orders, your revenue chart will appear here.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Sales by Breed Chart */}
        <Card className="col-span-1 lg:col-span-3 bg-[var(--surface)] border-[var(--border)] rounded-[2.5rem] shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Breed Popularity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              {breedSalesData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={breedSalesData} layout="vertical" margin={{ left: 20 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" stroke="var(--muted)" fontSize={12} tickLine={false} axisLine={false} width={80} />
                    <Tooltip 
                      cursor={{ fill: 'var(--surface-2)', opacity: 0.5 }}
                      contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', borderRadius: '12px' }}
                    />
                    <Bar dataKey="sales" fill="var(--accent)" radius={[0, 4, 4, 0]} barSize={20}>
                      {breedSalesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fillOpacity={1 - index * 0.15} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-[var(--muted)] text-center px-6">
                   <p className="text-sm font-medium mb-1">No breed sales yet.</p>
                   <p className="text-xs">Your top-selling breeds will be ranked here automatically.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Recent Transactions List */}
        <Card className="rounded-[2.5rem] border-[var(--border)] shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Successful Sales</CardTitle>
            <Link href="/admin/orders">
              <Button variant="ghost" size="sm" className="hidden sm:flex rounded-full">
                View History <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.length > 0 ? recentOrders.map((tx, i) => (
                <div key={i} className="flex items-center justify-between border-b border-[var(--border)] pb-4 last:border-0 last:pb-0">
                  <div className="space-y-1">
                    <p className="text-sm font-bold leading-none text-[var(--foreground)]">{tx.customer?.full_name || 'Guest Customer'}</p>
                    <p className="text-xs text-[var(--muted)]">{tx.dog?.name} • {(tx.dog?.breed as any)?.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-[var(--accent)]">{formatCurrency(tx.amount_paid)}</p>
                    <p className="text-[10px] text-[var(--muted)] font-mono uppercase mt-1">
                      {new Date(tx.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-[var(--muted)] text-center py-10">No transactions recorded yet.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Enquiries */}
        <Card className="rounded-[2.5rem] border-[var(--border)] shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Latest Enquiries</CardTitle>
            <Link href="/admin/enquiries">
              <Button variant="ghost" size="sm" className="rounded-full">Manage All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentEnquiries.length > 0 ? recentEnquiries.map((eq, i) => (
                <div key={i} className="flex items-center justify-between border-b border-[var(--border)] pb-4 last:border-0 last:pb-0">
                  <div className="flex items-start gap-4 overflow-hidden">
                     <div className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${!eq.is_read ? 'bg-[var(--accent)] animate-pulse' : 'bg-transparent border border-[var(--border)]'}`} />
                     <div className="space-y-1 overflow-hidden">
                       <p className={`text-sm leading-none truncate ${!eq.is_read ? 'font-bold text-[var(--foreground)]' : 'text-[var(--foreground)]'}`}>{eq.name}</p>
                       <p className="text-xs text-[var(--muted)] truncate max-w-[250px] italic">"{eq.message}"</p>
                     </div>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-[var(--muted)] shrink-0">
                    {new Date(eq.created_at).toLocaleDateString()}
                  </span>
                </div>
              )) : (
                <p className="text-sm text-[var(--muted)] text-center py-10">Inbox is empty.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
    </div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}
