import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ChefHat,
  Bell,
  Clock,
  CheckCircle2,
  History,
  PlayCircle,
  Zap,
  TrendingUp,
  Flame,
  AlertCircle,
  ArrowRight,
  UtensilsCrossed,
  Timer,
} from "lucide-react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/components/ui/toast"
import { kitchenApi } from "@/api/orders"
import { cn, formatTime } from "@/lib/utils"
import type { KitchenDashboardStats, Order } from "@/types"

const mockStats: KitchenDashboardStats = {
  newOrders: 5,
  preparingOrders: 7,
  readyOrders: 3,
  completedToday: 42,
}

const mockUrgentOrders: Order[] = [
  {
    id: 201, orderNumber: "DF-0803-K01", customerName: "VIP Table 7", tableNumber: "T-07",
    status: "PLACED", orderType: "DINE_IN", paymentStatus: "PAID",
    subtotal: 156.00, taxAmount: 12.48, totalAmount: 168.48, restaurantId: 1,
    items: [
      { id: 1, menuItemName: "Lobster Thermidor", quantity: 2, unitPrice: 48.00, subtotal: 96.00, status: "PENDING", specialInstructions: "RUSH — VIP guests, 20 min ETA" },
      { id: 2, menuItemName: "Truffle Risotto", quantity: 2, unitPrice: 22.00, subtotal: 44.00, status: "PENDING" },
      { id: 3, menuItemName: "Caviar Blini", quantity: 2, unitPrice: 8.00, subtotal: 16.00, status: "PENDING" },
    ],
    createdAt: new Date(Date.now() - 3 * 60000).toISOString(),
  },
  {
    id: 202, orderNumber: "DF-0803-K02", customerName: "Allergy Alert", tableNumber: "T-12",
    status: "PREPARING", orderType: "DINE_IN", paymentStatus: "PAID",
    subtotal: 62.50, taxAmount: 5.00, totalAmount: 67.50, restaurantId: 1,
    items: [
      { id: 1, menuItemName: "Grilled Chicken (NO NUTS)", quantity: 2, unitPrice: 22.00, subtotal: 44.00, status: "PREPARING", specialInstructions: "SEVERE PEANUT ALLERGY — separate utensils, no cross-contam" },
      { id: 2, menuItemName: "Steamed Vegetables", quantity: 2, unitPrice: 9.25, subtotal: 18.50, status: "READY" },
    ],
    createdAt: new Date(Date.now() - 14 * 60000).toISOString(),
  },
  {
    id: 203, orderNumber: "DF-0803-K03", customerName: "Large Party", tableNumber: "T-15",
    status: "PLACED", orderType: "DINE_IN", paymentStatus: "PENDING",
    subtotal: 312.00, taxAmount: 24.96, totalAmount: 336.96, restaurantId: 1,
    items: [
      { id: 1, menuItemName: "Family Paella", quantity: 2, unitPrice: 68.00, subtotal: 136.00, status: "PENDING" },
      { id: 2, menuItemName: "Chateaubriand", quantity: 2, unitPrice: 52.00, subtotal: 104.00, status: "PENDING", specialInstructions: "One medium-rare, one medium" },
      { id: 3, menuItemName: "Seasonal Sides", quantity: 6, unitPrice: 6.00, subtotal: 36.00, status: "PENDING" },
    ],
    createdAt: new Date(Date.now() - 8 * 60000).toISOString(),
  },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { toast } = useToast()
  const [stats, setStats] = useState<KitchenDashboardStats>(mockStats)
  const [urgent, setUrgent] = useState<Order[]>(mockUrgentOrders)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await kitchenApi.getDashboard(1)
        if (res.data.success) setStats(res.data.data)
      } catch {}
    }
    load()
  }, [])

  const statCards = [
    {
      title: "New Orders",
      value: stats.newOrders,
      icon: Bell,
      gradient: "from-orange-500 via-amber-500 to-yellow-500",
      glow: "shadow-orange-500/20",
      badge: "Incoming",
      badgeColor: "bg-orange-500/15 text-orange-700",
      pulse: stats.newOrders > 0,
      navigateTo: "/kitchen/new",
    },
    {
      title: "Preparing",
      value: stats.preparingOrders,
      icon: Clock,
      gradient: "from-blue-500 via-indigo-500 to-violet-500",
      glow: "shadow-blue-500/20",
      badge: "In Progress",
      badgeColor: "bg-blue-500/15 text-blue-700",
      navigateTo: "/kitchen/preparing",
    },
    {
      title: "Ready",
      value: stats.readyOrders,
      icon: CheckCircle2,
      gradient: "from-emerald-500 via-teal-500 to-green-500",
      glow: "shadow-emerald-500/20",
      badge: "Pickup",
      badgeColor: "bg-emerald-500/15 text-emerald-700",
      pulse: stats.readyOrders > 0,
      navigateTo: "/kitchen/ready",
    },
    {
      title: "Completed Today",
      value: stats.completedToday,
      icon: History,
      gradient: "from-slate-500 via-slate-600 to-slate-700",
      glow: "shadow-slate-500/15",
      badge: "Total",
      badgeColor: "bg-slate-500/15 text-slate-700",
      navigateTo: "/kitchen/history",
    },
  ]

  const quickActions = [
    { label: "New Orders", icon: Bell, path: "/kitchen/new", color: "from-orange-500 to-amber-500", count: stats.newOrders },
    { label: "Start Preparing", icon: PlayCircle, path: "/kitchen/new", color: "from-blue-500 to-indigo-500" },
    { label: "Mark Ready", icon: CheckCircle2, path: "/kitchen/preparing", color: "from-emerald-500 to-teal-500" },
    { label: "Order History", icon: History, path: "/kitchen/history", color: "from-purple-500 to-violet-500" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
            <ChefHat className="h-7 w-7 text-emerald-600" />
            Kitchen Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Good day, <span className="font-bold text-foreground">{user?.name?.split(" ")[0] || "Chef"}</span> — {urgent.length} orders need your attention.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success" className="gap-1.5 px-3 py-1.5 text-sm font-bold border-0 bg-gradient-to-r from-emerald-500/15 to-green-500/15 text-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            LIVE — Orders Syncing
          </Badge>
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
              whileHover={{ y: -4 }}
              onClick={() => navigate(card.navigateTo)}
              className="cursor-pointer"
            >
              <Card className={cn(
                "h-full overflow-hidden group relative hover:shadow-elevated transition-all border-0",
                card.pulse && "ring-2 ring-offset-2 ring-offset-green-50/0"
              )}>
                <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-[0.03] transition-opacity", card.gradient)} />
                <div className={cn("h-1.5 bg-gradient-to-r", card.gradient)} />
                <CardContent className="p-5 relative">
                  <div className="flex items-start justify-between">
                    <div className={cn(
                      "h-13 w-13 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-xl relative",
                      card.gradient,
                      card.glow
                    )}>
                      <Icon className={cn("h-6 w-6 text-white", card.pulse && "animate-pulse-slow")} />
                      {card.pulse && (
                        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 ring-2 ring-white animate-ping" />
                      )}
                    </div>
                    <Badge className={cn("text-[10px] h-5 px-2 border-0", card.badgeColor)}>
                      {card.badge}
                    </Badge>
                  </div>
                  <div className="mt-5 flex items-end justify-between">
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground">{card.title}</p>
                      <p className="text-4xl font-black mt-0.5 tracking-tight leading-none">{card.value}</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground/40 group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {quickActions.map((action, i) => {
          const Icon = action.icon
          return (
            <motion.button
              key={action.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.04 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(action.path)}
              className="relative overflow-hidden p-4 rounded-2xl bg-white border border-border/50 hover:border-emerald-200 shadow-soft hover:shadow-elevated transition-all text-left group"
            >
              <div className={cn("absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br opacity-10 group-hover:opacity-20 transition-opacity", action.color)} />
              <div className={cn("h-10 w-10 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-md relative", action.color)}>
                <Icon className="h-5 w-5 text-white" />
              </div>
              <div className="mt-3 flex items-center justify-between gap-2">
                <span className="font-bold text-sm">{action.label}</span>
                {action.count !== undefined && (
                  <Badge variant="destructive" className="text-[10px] h-4 px-1.5">{action.count}</Badge>
                )}
              </div>
            </motion.button>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card className="overflow-hidden">
            <CardHeader className="pb-3 flex flex-row items-center justify-between bg-gradient-to-r from-red-50/40 via-orange-50/20 to-transparent border-b border-border/50">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Flame className="h-5 w-5 text-orange-500" />
                  Priority Queue
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-0.5">Orders that need your immediate attention</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate("/kitchen/new")}>
                View All <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/50">
                {urgent.map((order, i) => {
                  const hasAllergy = order.items.some(item => item.specialInstructions?.toLowerCase().includes("allergy"))
                  const isRush = order.items.some(item => item.specialInstructions?.toLowerCase().includes("rush"))
                  const mins = Math.floor((Date.now() - new Date(order.createdAt!).getTime()) / 60000)
                  return (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.45 + i * 0.05 }}
                      className="p-4 hover:bg-orange-50/30 cursor-pointer transition-colors"
                      onClick={() => navigate(order.status === "PLACED" ? "/kitchen/new" : order.status === "PREPARING" ? "/kitchen/preparing" : "/kitchen/ready")}
                    >
                      <div className="flex items-start gap-4">
                        <div className="relative shrink-0">
                          <div className={cn(
                            "h-12 w-12 rounded-2xl flex items-center justify-center shadow-lg",
                            hasAllergy
                              ? "bg-gradient-to-br from-red-500 to-rose-600"
                              : isRush
                              ? "bg-gradient-to-br from-orange-500 to-amber-500"
                              : "bg-gradient-to-br from-blue-500 to-indigo-600"
                          )}>
                            {hasAllergy ? <AlertCircle className="h-6 w-6 text-white" /> : <UtensilsCrossed className="h-6 w-6 text-white" />}
                          </div>
                          {(hasAllergy || isRush) && (
                            <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-red-500 ring-2 ring-white flex items-center justify-center shadow-lg">
                              <Zap className="h-2.5 w-2.5 text-white" />
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-black truncate">{order.customerName}</p>
                            {hasAllergy && (
                              <Badge className="bg-red-500/15 text-red-700 border-0 gap-1 text-[10px] px-2 h-4">
                                <AlertCircle className="h-3 w-3" /> ALLERGY
                              </Badge>
                            )}
                            {isRush && (
                              <Badge className="bg-orange-500/15 text-orange-700 border-0 gap-1 text-[10px] px-2 h-4">
                                <Zap className="h-3 w-3" /> RUSH
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2.5 mt-1 text-xs text-muted-foreground flex-wrap">
                            <span className="font-mono">{order.orderNumber.split("-").slice(-2).join("-")}</span>
                            <span>•</span>
                            <span>Table {order.tableNumber}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Timer className="h-3 w-3" /> {mins}m ago
                            </span>
                            <span>•</span>
                            <span>{order.items.length} items</span>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {order.items.slice(0, 3).map(item => (
                              <Badge key={item.id} variant="muted" className="text-[10px] h-4 font-medium">
                                {item.quantity}x {item.menuItemName.split(" ")[0]}
                              </Badge>
                            ))}
                            {order.items.length > 3 && (
                              <Badge variant="muted" className="text-[10px] h-4 font-medium">+{order.items.length - 3}</Badge>
                            )}
                          </div>
                        </div>
                        <div className="shrink-0 text-right">
                          {order.status === "PLACED" && (
                            <Button size="sm" className="gap-1 bg-gradient-to-r from-orange-500 to-amber-500 shadow-md shadow-orange-500/20">
                              <PlayCircle className="h-4 w-4" />
                              Start
                            </Button>
                          )}
                          {order.status === "PREPARING" && (
                            <Button size="sm" variant="outline" className="gap-1 border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                              <CheckCircle2 className="h-4 w-4" />
                              Ready
                            </Button>
                          )}
                          {order.status === "READY" && (
                            <Badge variant="success" className="gap-1 px-2 py-1">
                              <CheckCircle2 className="h-3 w-3" /> READY
                            </Badge>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="space-y-5"
        >
          <Card className="overflow-hidden border-0 bg-gradient-to-br from-emerald-600 via-green-600 to-teal-600 text-white relative">
            <div className="absolute -top-16 -right-12 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-16 -left-12 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
            <CardContent className="p-6 relative">
              <div className="h-12 w-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6" />
              </div>
              <p className="text-white/80 text-sm font-medium">Kitchen Efficiency</p>
              <p className="text-4xl font-black mt-1 leading-none">94<span className="text-2xl">%</span></p>
              <div className="mt-4 space-y-1.5">
                {[
                  { label: "Avg. Prep Time", value: "12.4 min" },
                  { label: "On-Time Rate", value: "96.8%" },
                ].map(item => (
                  <div key={item.label} className="flex justify-between text-sm">
                    <span className="text-white/70">{item.label}</span>
                    <span className="font-bold">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Timer className="h-5 w-5 text-blue-500" />
                Current Shift
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: "Shift Started", value: formatTime(new Date(Date.now() - 6 * 60 * 60 * 1000)), icon: Clock },
                { label: "Station", value: "Main Hot Line", icon: Flame },
                { label: "Orders/Hour", value: "7.0 avg", icon: TrendingUp },
              ].map((item, i) => {
                const Icon = item.icon
                return (
                  <div key={item.label} className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center">
                        <Icon className="h-4 w-4 text-slate-600" />
                      </div>
                      <span className="text-sm text-muted-foreground font-medium">{item.label}</span>
                    </div>
                    <span className="font-bold text-sm">{item.value}</span>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
