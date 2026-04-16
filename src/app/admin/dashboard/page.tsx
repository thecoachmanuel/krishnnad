"use client"

import * as React from "react"
import Link from "next/link"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { ArrowUpRight, TrendingUp, Users, ShoppingBag, DollarSign } from "lucide-react"
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

  React.useEffect(() => {
    async function fetchDashboardData() {
      try {
        const supabase = createClient()
        
        // 1. Fetch Stats
        const { data: revenueData } = await supabase.from('orders').select('amount_paid').eq('status', 'successful')
        const totalRev = revenueData?.reduce((acc, curr) => acc + Number(curr.amount_paid), 0) || 0

        const { count: dogsCount } = await supabase.from('dogs').select('*', { count: 'exact', head: true }).eq('status', 'Available')
        const { count: customersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'customer')
        const { count: enquiriesCount } = await supabase.from('enquiries').select('*', { count: 'exact', head: true }).eq('is_read', false)

        setStats({
          totalRevenue: totalRev,
          dogsAvailable: dogsCount || 0,
          totalCustomers: customersCount || 0,
          unreadEnquiries: enquiriesCount || 0
        })

        // 2. Fetch Recent Orders
        const { data: orders } = await supabase
          .from('orders')
          .select(`
            id,
            amount_paid,
            status,
            created_at,
            dog:dogs(name, breed:breeds(name)),
            customer:profiles(full_name)
          `)
          .order('created_at', { ascending: false })
          .limit(5)
        
        setRecentOrders(orders || [])

        // 3. Fetch Recent Enquiries
        const { data: enquiries } = await supabase
          .from('enquiries')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5)
        
        setRecentEnquiries(enquiries || [])

        // 4. Dummy Chart Data for now (In real app, we'd aggregate by month in SQL)
        setRevenueData([
          { name: "Jan", total: 400000 },
          { name: "Feb", total: 1100000 },
          { name: "Mar", total: 850000 },
          { name: "Apr", total: totalRev > 0 ? totalRev : 1400000 },
        ])

        setBreedSalesData([
          { name: "G-Shepherd", sales: 12 },
          { name: "Golden R.", sales: 8 },
          { name: "Frenchie", sales: 18 },
          { name: "Rottweiler", sales: 5 },
        ])

      } catch (err) {
        console.error("Dashboard fetch error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(val)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl font-bold text-[var(--foreground)]">Dashboard Overview</h1>
        <p className="text-[var(--muted)] mt-1">Track key metrics, sales, and enquiries performance.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-[var(--surface-2)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-[var(--muted)]">Total Revenue</p>
              <DollarSign className="h-4 w-4 text-[var(--accent)]" />
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <h2 className="text-3xl font-bold text-[var(--foreground)]">
                {formatCurrency(stats.totalRevenue).replace('NGN', '₦')}
              </h2>
              <span className="text-xs font-semibold text-[var(--success)] flex items-center">
                <TrendingUp className="mr-1 h-3 w-3" /> +12.5%
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-[var(--surface-2)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-[var(--muted)]">Dogs Available</p>
              <ShoppingBag className="h-4 w-4 text-[var(--accent)]" />
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <h2 className="text-3xl font-bold text-[var(--foreground)]">{stats.dogsAvailable}</h2>
              <span className="text-xs font-semibold text-[var(--muted)]">
                active listings
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[var(--surface-2)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-[var(--muted)]">Total Customers</p>
              <Users className="h-4 w-4 text-[var(--accent)]" />
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <h2 className="text-3xl font-bold text-[var(--foreground)]">{stats.totalCustomers}</h2>
              <span className="text-xs font-semibold text-[var(--success)] flex items-center">
                <TrendingUp className="mr-1 h-3 w-3" /> Growth
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className={cn("bg-[var(--surface-2)]", stats.unreadEnquiries > 0 && "border-[var(--danger)]/30")}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <p className={cn("text-sm font-medium", stats.unreadEnquiries > 0 ? "text-[var(--danger)]" : "text-[var(--muted)]")}>
                Unread Enquiries
              </p>
              {stats.unreadEnquiries > 0 && <div className="h-2 w-2 rounded-full bg-[var(--danger)] animate-pulse" />}
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <h2 className="text-3xl font-bold text-[var(--foreground)]">{stats.unreadEnquiries}</h2>
              <span className="text-xs font-semibold text-[var(--muted)]">
                Require action
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-7">
        {/* Main Chart */}
        <Card className="col-span-1 lg:col-span-4 bg-[var(--surface-2)]">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="var(--muted)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis 
                    stroke="var(--muted)" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(value) => `₦${value / 1000}k`} 
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', borderRadius: '8px' }}
                    itemStyle={{ color: 'var(--accent)' }}
                  />
                  <Area type="monotone" dataKey="total" stroke="var(--accent)" fillOpacity={1} fill="url(#colorTotal)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Sales by Breed Chart */}
        <Card className="col-span-1 lg:col-span-3 bg-[var(--surface-2)]">
          <CardHeader>
            <CardTitle>Sales by Breed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={breedSalesData}>
                  <XAxis dataKey="name" stroke="var(--muted)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{ fill: 'var(--surface)' }}
                    contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', borderRadius: '8px' }}
                  />
                  <Bar dataKey="sales" fill="var(--accent-2)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Recent Transactions List */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Transactions</CardTitle>
            <Link href="/admin/orders">
              <Button variant="ghost" size="sm" className="hidden sm:flex">
                View All <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.length > 0 ? recentOrders.map((tx, i) => (
                <div key={i} className="flex items-center justify-between border-b border-[var(--border)] pb-4 last:border-0 last:pb-0">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none text-[var(--foreground)]">{tx.customer?.full_name}</p>
                    <p className="text-sm text-[var(--muted)]">{tx.dog?.name} ({tx.dog?.breed?.name})</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-[var(--foreground)]">{formatCurrency(tx.amount_paid)}</p>
                    <Badge variant={tx.status === "successful" ? "success" : "warning"} className="mt-1 text-[10px]">
                      {tx.status}
                    </Badge>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-[var(--muted)] text-center py-4">No transactions found.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Enquiries */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Latest Enquiries</CardTitle>
            <Link href="/admin/enquiries">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentEnquiries.length > 0 ? recentEnquiries.map((eq, i) => (
                <div key={i} className="flex items-center justify-between border-b border-[var(--border)] pb-4 last:border-0 last:pb-0">
                  <div className="flex items-start gap-4">
                     <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${!eq.is_read ? 'bg-[var(--accent)]' : 'bg-transparent'}`} />
                     <div className="space-y-1">
                       <p className={`text-sm leading-none ${!eq.is_read ? 'font-semibold text-[var(--foreground)]' : 'text-[var(--foreground)]'}`}>{eq.name}</p>
                       <p className="text-xs text-[var(--muted)] truncate max-w-[200px]">{eq.message}</p>
                     </div>
                  </div>
                  <span className="text-xs text-[var(--muted)]">
                    {new Date(eq.created_at).toLocaleDateString()}
                  </span>
                </div>
              )) : (
                <p className="text-sm text-[var(--muted)] text-center py-4">No enquiries found.</p>
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
