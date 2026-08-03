import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Table2,
  ClipboardList,
  DollarSign,
  CheckCircle2,
  TrendingUp,
  Clock,
  User,
  ChevronRight,
  UtensilsCrossed,
  Receipt,
  Bell,
} from "lucide-react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/components/ui/toast"
import { staffApi } from "@/api/orders"
import { cn, formatCurrency, formatTime } from "@/lib/utils"
import type { Order, StaffDashboardStats } from "@/types"

const mockStats: StaffDashboardStats = {
  assignedTables: 8,
  activeOrders: 12,
  todaySales: 2450.75,
  todayCompleted: 34,
}

const mockRecentOrders: Order[] = [
  {
    id: 101,
    orderNumber: "DF-20240803-001",
    customerName: "John Smith",
    tableNumber: "T-12",
    status: "PREPARING",
    orderType: "DINE_IN",
    paymentStatus: "PENDING",
    subtotal: 68.50,
    taxAmount: 5.48,
    totalAmount: 73.98,
    restaurantId: 1,
    items: [
      { id: 1, menuItemName: "Grilled Salmon", quantity: 1, unitPrice: 28.00, subtotal: 28.00, status: "PREPARING" },
      { id: 2, menuItemName: "Caesar Salad", quantity: 1, unitPrice: 12.50, subtotal: 12.50, status: "READY" },
      { id: 3, menuItemName: "Sparkling Water", quantity: 2, unitPrice: 4.00, subtotal: 8.00, status: "SERVED" },
    ],
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
  },
  {
    id: 102,
    orderNumber: "DF-20240803-002",
    customerName: "Emily Davis",
    tableNumber: "T-05",
    status: "READY",
    orderType: "DINE_IN",
    paymentStatus: "PENDING",
    subtotal: 45.00,
    taxAmount: 3.60,
    totalAmount: 48.60,
    restaurantId: 1,
    items: [
      { id: 1, menuItemName: "Margherita Pizza", quantity: 1, unitPrice: 18.00, subtotal: 18.00, status: "READY" },
      { id: 2, menuItemName: "Tiramisu", quantity: 1, unitPrice: 9.00, subtotal: 9.00, status: "READY" },
    ],
    createdAt: new Date(Date.now() - 32 * 60000).toISOString(),
  },
  {
    id: 103,
    orderNumber: "DF-20240803-003",
    customerName: "Michael Brown",
    tableNumber: "T-08",
    status: "SERVED",
    orderType: "DINE_IN",
    paymentStatus: "PENDING",
    subtotal: 125.80,
    taxAmount: 10.06,
    totalAmount: 135.86,
    restaurantId: 1,
    items: [
      { id: 1, menuItemName: "Ribeye Steak", quantity: 2, unitPrice: 42.00, subtotal: 84.00, status: "SERVED" },
      { id: 2, menuItemName: "Red Wine", quantity: 1, unitPrice: 28.00, subtotal: 28.00, status: "SERVED" },
    ],
    createdAt: new Date(Date.now() - 55 * 60000).toISOString(),
  },
  {
    id: 104,
    orderNumber: "DF-20240803-004",
    customerName: "Sarah Wilson",
    tableNumber: "T-03",
    status: "ACCEPTED",
    orderType: "DINE_IN",
    paymentStatus: "PAID",
    subtotal: 32.50,
    taxAmount: 2.60,
    totalAmount: 35.10,
    restaurantId: 1,
    items: [
      { id: 1, menuItemName: "Chicken Pasta", quantity: 1, unitPrice: 16.50, subtotal: 16.50, status: "PENDING" },
      { id: 2, menuItemName: "Iced Tea", quantity: 2, unitPrice: 3.50, subtotal: 7.00, status: "PENDING" },
    ],
    createdAt: new Date(Date.now() - 8 * 60000).toISOString(),
  },
  {
    id: 105,
    orderNumber: "DF-20240803-005",
    customerName: "David Lee",
    tableNumber: "T-15",
    status: "COMPLETED",
    orderType: "DINE_IN",
    paymentStatus: "PAID",
    subtotal: 89.20,
    taxAmount: 7.14,
    totalAmount: 96.34,
    restaurantId: 1,
    items: [
      { id: 1, menuItemName: "Sushi Platter", quantity: 1, unitPrice: 52.00, subtotal: 52.00, status: "SERVED" },
      { id: 2, menuItemName: "Miso Soup", quantity: 2, unitPrice: 5.50, subtotal: 11.00, status: "SERVED" },
    ],
    createdAt: new Date(Date.now() - 90 * 60000).toISOString(),
  },
]

const statusColors: Record<string, string> = {
  PLACED: "bg-slate-500/10 text-slate-600",
  ACCEPTED: "bg-blue-500/10 text-blue-600",
  PREPARING: "bg-amber-500/10 text-amber-600",
  READY: "bg-purple-500/10 text-purple-600",
  SERVED: "bg-green-500/10 text-green-600",
  COMPLETED: "bg-emerald-500/10 text-emerald-600",
  CANCELLED: "bg-red-500/10 text-red-600",
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { toast } = useToast()
  const [stats, setStats] = useState<StaffDashboardStats>(mockStats)
  const [recentOrders, setRecentOrders] = useState<Order[]>(mockRecentOrders)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        if (user?.id) {
          const [statsRes, ordersRes] = await Promise.allSettled([
            staffApi.getDashboard(user.id, 1),
            staffApi.getTodayOrders(user.id, 1),
          ])
          if (statsRes.status === "fulfilled" && statsRes.value.data.success) {
            setStats(statsRes.value.data.data)
          }
          if (ordersRes.status === "fulfilled" && ordersRes.value.data.success) {
            setRecentOrders(ordersRes.value.data.data.slice(0, 5))
          }
        }
      } catch {
      } finally {
        setLoading(false)
      }
    }
    setTimeout(loadData, 300)
  }, [user?.id])

  const statCards = [
    {
      title: "Assigned Tables",
      value: stats.assignedTables,
      icon: Table2,
      gradient: "from-blue-500 to-indigo-600",
      bgLight: "bg-blue-500/10",
      trend: "+2 today",
      trendUp: true,
      navigateTo: "/staff/tables",
    },
    {
      title: "Active Orders",
      value: stats.activeOrders,
      icon: ClipboardList,
      gradient: "from-amber-500 to-orange-600",
      bgLight: "bg-amber-500/10",
      trend: "3 urgent",
      trendUp: true,
      navigateTo: "/staff/orders",
    },
    {
      title: "Today's Sales",
      value: formatCurrency(stats.todaySales),
      icon: DollarSign,
      gradient: "from-emerald-500 to-green-600",
      bgLight: "bg-emerald-500/10",
      trend: "+18% vs yesterday",
      trendUp: true,
      navigateTo: "/staff/billing",
    },
    {
      title: "Completed Today",
      value: stats.todayCompleted,
      icon: CheckCircle2,
      gradient: "from-purple-500 to-violet-600",
      bgLight: "bg-purple-500/10",
      trend: "On track",
      trendUp: true,
      navigateTo: "/staff/orders",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Welcome back, {user?.name?.split(" ")[0] || "Staff"} 👋</h1>
          <p className="text-muted-foreground mt-1">Here's what's happening on the floor today.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate("/staff/notifications")}>
            <Bell className="h-4 w-4 mr-2" />
            View Alerts
          </Button>
          <Button onClick={() => navigate("/staff/orders")}>
            <ClipboardList className="h-4 w-4 mr-2" />
            Manage Orders
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, i) => {
          const Icon = card.icon
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              whileHover={{ y: -3 }}
              onClick={() => navigate(card.navigateTo)}
              className="cursor-pointer"
            >
              <Card className="h-full overflow-hidden group hover:shadow-elevated transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center", card.bgLight)}>
                      <div className={cn("h-10 w-10 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg", card.gradient)}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground/50 group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <div className="mt-5">
                    <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                    <p className="text-3xl font-black mt-1 tracking-tight">{card.value}</p>
                  </div>
                  <div className="mt-3 flex items-center gap-1.5">
                    <TrendingUp className={cn("h-3.5 w-3.5", card.trendUp ? "text-emerald-500" : "text-red-500")} />
                    <span className={cn("text-xs font-semibold", card.trendUp ? "text-emerald-600" : "text-red-600")}>
                      {card.trend}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Receipt className="h-5 w-5 text-blue-500" />
                  Recent Orders
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-0.5">Latest activity from your tables</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate("/staff/orders")}>
                View All <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentOrders.map((order, i) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    className="flex items-center gap-4 p-4 rounded-xl border border-border/50 hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer"
                    onClick={() => navigate("/staff/orders")}
                  >
                    <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/20 shrink-0">
                      <UtensilsCrossed className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-bold truncate">{order.customerName}</p>
                        <Badge variant="muted" className="text-[10px] h-4 px-1.5">Table {order.tableNumber}</Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground font-mono">{order.orderNumber.split("-").slice(-2).join("-")}</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTime(order.createdAt!)}
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold">{formatCurrency(order.totalAmount)}</p>
                      <Badge className={cn("mt-1 text-[10px] h-4 px-2", statusColors[order.status])}>
                        {order.status}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="space-y-6"
        >
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
                Today's Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {[
                  { label: "Avg. Order Value", value: formatCurrency(stats.todayCompleted > 0 ? stats.todaySales / stats.todayCompleted : 0), color: "from-blue-500 to-indigo-500" },
                  { label: "Orders Per Table", value: stats.assignedTables > 0 ? (stats.todayCompleted / stats.assignedTables).toFixed(1) : "0", suffix: " orders", color: "from-amber-500 to-orange-500" },
                  { label: "Table Turnaround", value: "42", suffix: " min avg", color: "from-emerald-500 to-green-500" },
                ].map((item, i) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn("h-8 w-8 rounded-lg bg-gradient-to-br", item.color)} />
                      <span className="text-sm text-muted-foreground font-medium">{item.label}</span>
                    </div>
                    <span className="font-bold">{item.value}{item.suffix || ""}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white border-0 overflow-hidden relative">
            <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
            <CardContent className="p-6 relative">
              <div className="h-11 w-11 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4">
                <User className="h-5 w-5" />
              </div>
              <p className="text-white/80 text-sm font-medium">Current Shift</p>
              <p className="text-2xl font-black mt-1">{user?.name || "Staff Member"}</p>
              <div className="mt-4 pt-4 border-t border-white/20 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Role</span>
                  <span className="font-semibold">{user?.role || "STAFF"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Tables Covering</span>
                  <span className="font-semibold">{stats.assignedTables} tables</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
