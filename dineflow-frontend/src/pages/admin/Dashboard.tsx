import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DollarSign, ShoppingBag, Users, UtensilsCrossed, Clock, CheckCircle2, ChefHat,
  TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, MoreHorizontal, Eye,
  Search, Bell
} from "lucide-react"
import { motion } from "framer-motion"
import { useAuth, useRole } from "@/context/AuthContext"
import { useToast } from "@/components/ui/toast"
import { adminApi } from "@/api/orders"
import { cn, formatCurrency, formatDate, formatTime } from "@/lib/utils"
import type { DashboardStats, Order, TopSellingItem } from "@/types"
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell
} from "recharts"

const mockStats: DashboardStats = {
  todayRevenue: 8427.50,
  todayOrders: 127,
  totalCustomers: 342,
  occupiedTables: 12,
  availableTables: 8,
  preparingOrders: 18,
  readyOrders: 7,
  completedOrders: 102,
  weeklyRevenue: 52847.90,
  monthlyRevenue: 218492.30,
  topSellingItems: [
    { menuItemId: 1, menuItemName: "Truffle Mushroom Pizza", totalUnits: 47, menuItemImage: "" },
    { menuItemId: 2, menuItemName: "Wagyu Beef Burger", totalUnits: 39, menuItemImage: "" },
    { menuItemId: 3, menuItemName: "Sushi Platter Deluxe", totalUnits: 32, menuItemImage: "" },
    { menuItemId: 4, menuItemName: "Chocolate Lava Cake", totalUnits: 28, menuItemImage: "" },
    { menuItemId: 5, menuItemName: "Caesar Salad Royal", totalUnits: 24, menuItemImage: "" },
  ],
}

const mockRevenueData = [
  { name: "Mon", revenue: 6200, orders: 98 },
  { name: "Tue", revenue: 7100, orders: 112 },
  { name: "Wed", revenue: 5800, orders: 89 },
  { name: "Thu", revenue: 8300, orders: 124 },
  { name: "Fri", revenue: 9800, orders: 156 },
  { name: "Sat", revenue: 12400, orders: 198 },
  { name: "Sun", revenue: 8427, orders: 127 },
]

const mockHourlyData = [
  { hour: "11AM", orders: 8 }, { hour: "12PM", orders: 24 },
  { hour: "1PM", orders: 32 }, { hour: "2PM", orders: 18 },
  { hour: "5PM", orders: 22 }, { hour: "6PM", orders: 38 },
  { hour: "7PM", orders: 42 }, { hour: "8PM", orders: 35 },
  { hour: "9PM", orders: 19 },
]

const recentOrders: Order[] = [
  {
    id: 1001, orderNumber: "DF-20260803-001", customerName: "Sarah Mitchell",
    customerPhone: "+1 555-0123", tableNumber: "T-07", status: "PREPARING",
    orderType: "DINE_IN", paymentStatus: "PAID", subtotal: 68.50, taxAmount: 5.48,
    totalAmount: 73.98, items: [], createdAt: new Date().toISOString(),
    restaurantId: 1, assignedWaiterName: "James Wilson",
  },
  {
    id: 1002, orderNumber: "DF-20260803-002", customerName: "Michael Chen",
    customerPhone: "+1 555-0456", tableNumber: "T-12", status: "READY",
    orderType: "DINE_IN", paymentStatus: "PAID", subtotal: 124.00, taxAmount: 9.92,
    totalAmount: 133.92, items: [], createdAt: new Date().toISOString(),
    restaurantId: 1, assignedWaiterName: "Emma Davis",
  },
  {
    id: 1003, orderNumber: "DF-20260803-003", customerName: "Jennifer Park",
    customerPhone: "+1 555-0789", status: "COMPLETED",
    orderType: "TAKEAWAY", paymentStatus: "PAID", subtotal: 42.75, taxAmount: 3.42,
    totalAmount: 46.17, items: [], createdAt: new Date().toISOString(),
    restaurantId: 1,
  },
  {
    id: 1004, orderNumber: "DF-20260803-004", customerName: "Robert Johnson",
    customerPhone: "+1 555-0987", tableNumber: "T-03", status: "SERVED",
    orderType: "DINE_IN", paymentStatus: "PENDING", subtotal: 89.20, taxAmount: 7.14,
    deliveryFee: 0, totalAmount: 96.34, items: [], createdAt: new Date().toISOString(),
    restaurantId: 1, assignedWaiterName: "James Wilson",
  },
  {
    id: 1005, orderNumber: "DF-20260803-005", customerName: "Lisa Anderson",
    customerPhone: "+1 555-0654", status: "COMPLETED",
    orderType: "DELIVERY", paymentStatus: "PAID", subtotal: 55.40, taxAmount: 4.43,
    deliveryFee: 5.99, totalAmount: 65.82, items: [], createdAt: new Date().toISOString(),
    restaurantId: 1,
  },
]

const barColors = ["#f97316", "#ea580c", "#c2410c", "#9a3412", "#7c2d12"]

const getStatusBadge = (status: string) => {
  const map: Record<string, { variant: any; label: string; dot: string }> = {
    PLACED: { variant: "warning", label: "Placed", dot: "bg-warning-500" },
    ACCEPTED: { variant: "info", label: "Accepted", dot: "bg-blue-500" },
    PREPARING: { variant: "warning", label: "Preparing", dot: "bg-amber-500" },
    READY: { variant: "success", label: "Ready", dot: "bg-success-500" },
    SERVED: { variant: "default", label: "Served", dot: "bg-violet-500" },
    COMPLETED: { variant: "success", label: "Completed", dot: "bg-emerald-600" },
    CANCELLED: { variant: "destructive", label: "Cancelled", dot: "bg-red-500" },
  }
  const s = map[status] || map.PLACED
  return (
    <Badge variant={s.variant} className="gap-1.5">
      <span className={cn("h-1.5 w-1.5 rounded-full animate-pulse", s.dot)} />
      {s.label}
    </Badge>
  )
}

export default function Dashboard() {
  const { toast } = useToast()
  const [stats, setStats] = useState<DashboardStats>(mockStats)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(timer)
  }, [])

  const statCards = [
    {
      title: "Today's Revenue", value: formatCurrency(stats.todayRevenue),
      change: "+12.4%", changePositive: true, sub: `Week: ${formatCurrency(stats.weeklyRevenue)}`,
      icon: DollarSign, gradient: "from-orange-500 to-rose-500", iconBg: "bg-white/20",
    },
    {
      title: "Today's Orders", value: stats.todayOrders.toString(),
      change: "+8.2%", changePositive: true, sub: `Completed: ${stats.completedOrders}`,
      icon: ShoppingBag, gradient: "from-violet-500 to-indigo-600", iconBg: "bg-white/20",
    },
    {
      title: "Customers Today", value: stats.totalCustomers.toString(),
      change: "+5.8%", changePositive: true, sub: "vs yesterday",
      icon: Users, gradient: "from-emerald-500 to-teal-600", iconBg: "bg-white/20",
    },
    {
      title: "Tables Status", value: `${stats.occupiedTables}/${stats.occupiedTables + stats.availableTables}`,
      change: "-2", changePositive: false, sub: `${stats.availableTables} available now`,
      icon: UtensilsCrossed, gradient: "from-blue-500 to-cyan-600", iconBg: "bg-white/20",
    },
    {
      title: "Preparing", value: stats.preparingOrders.toString(),
      change: "+3", changePositive: false, sub: "In kitchen queue",
      icon: ChefHat, gradient: "from-amber-500 to-orange-600", iconBg: "bg-white/20",
    },
    {
      title: "Ready to Serve", value: stats.readyOrders.toString(),
      change: "-1", changePositive: true, sub: "Pick up from expo",
      icon: CheckCircle2, gradient: "from-green-500 to-emerald-600", iconBg: "bg-white/20",
    },
  ]

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time snapshot of your restaurant performance — {formatDate(new Date())}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input placeholder="Search orders, customers..." className="h-11 w-64 pl-10 pr-4 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all" />
          </div>
          <Button variant="outline" className="gap-2">
            <Clock className="h-4 w-4" />
            Last 24h
          </Button>
          <Button className="gap-2">
            <Bell className="h-4 w-4" />
            Live Updates
            <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <Card className={cn("border-0 text-white overflow-hidden relative group")}>
                <div className={cn("absolute inset-0 bg-gradient-to-br", card.gradient)} />
                <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-white/10 blur-2xl group-hover:bg-white/20 transition-all duration-500" />
                <CardContent className="relative p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className={cn("h-11 w-11 rounded-xl flex items-center justify-center backdrop-blur-sm", card.iconBg)}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div className={cn(
                      "flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold backdrop-blur-sm",
                      card.changePositive ? "bg-white/20 text-white" : "bg-red-500/30 text-white"
                    )}>
                      {card.changePositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                      {card.change}
                    </div>
                  </div>
                  <p className="text-2xl font-black tracking-tight mb-1">{card.value}</p>
                  <p className="text-xs font-medium text-white/70">{card.title}</p>
                  <p className="text-[11px] text-white/60 mt-1.5">{card.sub}</p>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Revenue & Orders Trend</CardTitle>
                <CardDescription>Last 7 days performance overview</CardDescription>
              </div>
              <div className="flex gap-2">
                <Badge variant="muted">
                  <span className="h-2 w-2 rounded-full bg-orange-500 mr-1.5" />
                  Revenue
                </Badge>
                <Badge variant="muted">
                  <span className="h-2 w-2 rounded-full bg-violet-500 mr-1.5" />
                  Orders
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockRevenueData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                    <Tooltip
                      contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 10px 40px rgba(0,0,0,0.08)" }}
                      formatter={(v: number, n: string) => [
                        n === "revenue" ? formatCurrency(v) : `${v} orders`,
                        n === "revenue" ? "Revenue" : "Orders",
                      ]}
                    />
                    <Line type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={3} dot={{ fill: "#f97316", r: 4, strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 6 }} fill="url(#revenueGrad)" />
                    <Line type="monotone" dataKey="orders" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: "#8b5cf6", r: 4, strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 6 }} yAxisId={0} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-orange-500" />
                Top Selling Items
              </CardTitle>
              <CardDescription>Today's most ordered dishes</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.topSellingItems} layout="vertical" margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                    <XAxis type="number" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis dataKey="menuItemName" type="category" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} width={130} tick={{ fontWeight: 500 }} />
                    <Tooltip
                      cursor={{ fill: "#fef7ed" }}
                      contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: 12 }}
                      formatter={(v: number) => [`${v} units`, "Sold"]}
                    />
                    <Bar dataKey="totalUnits" radius={[0, 8, 8, 0]} barSize={18}>
                      {stats.topSellingItems.map((_, idx) => (
                        <Cell key={idx} fill={barColors[idx % barColors.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Recent Orders</CardTitle>
                <CardDescription>Live order activity across the restaurant</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="gap-1.5 text-xs font-semibold">
                View all <ArrowUpRight className="h-3.5 w-3.5" />
              </Button>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="overflow-x-auto -mx-6 px-6">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left py-3 px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Order</th>
                      <th className="text-left py-3 px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
                      <th className="text-left py-3 px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Table</th>
                      <th className="text-left py-3 px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="text-right py-3 px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                      <th className="text-right py-3 px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order, i) => (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 + i * 0.05 }}
                        className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group"
                      >
                        <td className="py-3.5 px-2">
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{order.orderNumber.slice(-8)}</p>
                            <p className="text-[11px] text-slate-500">{formatTime(order.createdAt || new Date())}</p>
                          </div>
                        </td>
                        <td className="py-3.5 px-2">
                          <div className="flex items-center gap-2.5">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback name={order.customerName || "C"} />
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium text-slate-900 truncate max-w-[130px]">{order.customerName || "Walk-in"}</p>
                              <p className="text-[11px] text-slate-500">{order.orderType.toLowerCase()}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-2">
                          <Badge variant={order.tableNumber ? "outline" : "muted"} className="font-mono text-xs">
                            {order.tableNumber || "—"}
                          </Badge>
                        </td>
                        <td className="py-3.5 px-2">{getStatusBadge(order.status)}</td>
                        <td className="py-3.5 px-2 text-right">
                          <p className="text-sm font-bold text-slate-900">{formatCurrency(order.totalAmount)}</p>
                          <p className="text-[11px] text-slate-500">{order.paymentStatus}</p>
                        </td>
                        <td className="py-3.5 px-2 text-right">
                          <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Peak Hours Today</CardTitle>
              <CardDescription>Order volume by hour of day</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockHourlyData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis dataKey="hour" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: 12 }} />
                    <Bar dataKey="orders" fill="url(#peakGrad)" radius={[6, 6, 0, 0]} />
                    <defs>
                      <linearGradient id="peakGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#f97316" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100">
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-lg bg-orange-500 text-white flex items-center justify-center shrink-0">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-orange-900">Peak detected</p>
                    <p className="text-xs text-orange-700 mt-0.5">7 PM hour shows highest volume at 42 orders. Consider scheduling more staff.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
