import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Bell,
  CheckCheck,
  Trash2,
  CheckCircle2,
  UtensilsCrossed,
  DollarSign,
  Table2,
  AlertCircle,
  Info,
  Clock,
  Search,
  ChefHat,
  Sparkles,
  Filter,
  X,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/components/ui/toast"
import { notificationApi } from "@/api/orders"
import { cn, formatDateTime, formatTime } from "@/lib/utils"
import type { Notification, NotificationType } from "@/types"

type MockNotification = Notification & { title?: string }

const mockNotifications: MockNotification[] = [
  {
    id: 1, restaurantId: 1, userId: 2, type: "NEW_ORDER", isRead: false,
    title: "New Order Received",
    message: "New order #DF-0803-008 from Table T-01 (Lisa Chen) with 4 items. Total $47.52.",
    relatedUrl: "/staff/orders",
    createdAt: new Date(Date.now() - 2 * 60000).toISOString(),
  },
  {
    id: 2, restaurantId: 1, userId: 2, type: "FOOD_READY", isRead: false,
    title: "Order Ready for Pickup",
    message: "Order #DF-0803-003 for Michael Brown at Table T-08 is ready. 2 items — Ribeye Steak & Wine.",
    relatedUrl: "/staff/orders",
    createdAt: new Date(Date.now() - 8 * 60000).toISOString(),
  },
  {
    id: 3, restaurantId: 1, userId: 2, type: "NEW_ORDER", isRead: false,
    title: "Rush Order Alert",
    message: "URGENT: New order #DF-0803-009 Table T-07. Customer noted 'in a hurry, please prioritize'.",
    relatedUrl: "/staff/orders",
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
  },
  {
    id: 4, restaurantId: 1, userId: 2, type: "TABLE_REQUEST", isRead: true,
    title: "Table T-05 Needs Attention",
    message: "Table T-05 (Davis Party) — Customer requesting bill. 3 orders, total $133.92 pending.",
    relatedUrl: "/staff/billing",
    createdAt: new Date(Date.now() - 35 * 60000).toISOString(),
  },
  {
    id: 5, restaurantId: 1, userId: 2, type: "ORDER_STATUS_UPDATED", isRead: true,
    title: "Kitchen Accepted Order",
    message: "Order #DF-0803-002 has been accepted by the kitchen. ETA 15–20 minutes.",
    relatedUrl: "/staff/orders",
    createdAt: new Date(Date.now() - 50 * 60000).toISOString(),
  },
  {
    id: 6, restaurantId: 1, userId: 2, type: "PAYMENT_RECEIVED", isRead: true,
    title: "Payment Received",
    message: "Order #DF-0803-008 paid successfully via Credit Card. Amount: $47.52.",
    relatedUrl: "/staff/billing",
    createdAt: new Date(Date.now() - 80 * 60000).toISOString(),
  },
  {
    id: 7, restaurantId: 1, userId: 2, type: "STAFF_ALERT", isRead: true,
    title: "Allergen Notice",
    message: "Order #DF-0803-010 contains peanut allergy alert. Grilled Salmon: no peanuts, confirm with chef.",
    relatedUrl: "/staff/orders",
    createdAt: new Date(Date.now() - 110 * 60000).toISOString(),
  },
  {
    id: 8, restaurantId: 1, userId: 2, type: "GENERAL", isRead: true,
    title: "Shift Reminder",
    message: "Reminder: Your shift ends at 5:00 PM. Please handover tables to evening staff.",
    relatedUrl: undefined,
    createdAt: new Date(Date.now() - 180 * 60000).toISOString(),
  },
]

const typeConfig: Record<NotificationType, { icon: any; gradient: string; bg: string; accent: string; label: string }> = {
  NEW_ORDER: {
    icon: UtensilsCrossed,
    gradient: "from-blue-500 to-indigo-600",
    bg: "bg-blue-500/10",
    accent: "border-l-blue-500",
    label: "New Order",
  },
  FOOD_READY: {
    icon: ChefHat,
    gradient: "from-purple-500 to-violet-600",
    bg: "bg-purple-500/10",
    accent: "border-l-purple-500",
    label: "Food Ready",
  },
  PAYMENT_RECEIVED: {
    icon: DollarSign,
    gradient: "from-emerald-500 to-green-600",
    bg: "bg-emerald-500/10",
    accent: "border-l-emerald-500",
    label: "Payment",
  },
  TABLE_REQUEST: {
    icon: Table2,
    gradient: "from-amber-500 to-orange-600",
    bg: "bg-amber-500/10",
    accent: "border-l-amber-500",
    label: "Table Request",
  },
  ORDER_STATUS_UPDATED: {
    icon: Info,
    gradient: "from-cyan-500 to-sky-600",
    bg: "bg-cyan-500/10",
    accent: "border-l-cyan-500",
    label: "Status Update",
  },
  STAFF_ALERT: {
    icon: AlertCircle,
    gradient: "from-red-500 to-rose-600",
    bg: "bg-red-500/10",
    accent: "border-l-red-500",
    label: "Staff Alert",
  },
  GENERAL: {
    icon: Sparkles,
    gradient: "from-slate-500 to-slate-700",
    bg: "bg-slate-500/10",
    accent: "border-l-slate-500",
    label: "General",
  },
}

function groupByDate(notifications: MockNotification[]): Record<string, MockNotification[]> {
  const groups: Record<string, MockNotification[]> = {}
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  notifications.forEach(n => {
    const d = new Date(n.createdAt)
    const todayDate = today.toDateString()
    const yDate = yesterday.toDateString()
    const nDate = d.toDateString()
    let key: string
    if (nDate === todayDate) key = "Today"
    else if (nDate === yDate) key = "Yesterday"
    else key = d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    if (!groups[key]) groups[key] = []
    groups[key].push(n)
  })
  return groups
}

export default function Notifications() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [notifications, setNotifications] = useState<MockNotification[]>(mockNotifications)
  const [filter, setFilter] = useState<NotificationType | "ALL">("ALL")
  const [onlyUnread, setOnlyUnread] = useState(false)
  const [search, setSearch] = useState("")

  useEffect(() => {
    const load = async () => {
      try {
        const res = await notificationApi.getByRestaurant(1)
        if (res.data.success) setNotifications(res.data.data)
      } catch {}
    }
    load()
  }, [])

  const unreadCount = notifications.filter(n => !n.isRead).length

  const filtered = notifications
    .filter(n => filter === "ALL" || n.type === filter)
    .filter(n => !onlyUnread || !n.isRead)
    .filter(n =>
      !search ||
      n.message.toLowerCase().includes(search.toLowerCase()) ||
      (n as any).title?.toLowerCase().includes(search.toLowerCase())
    )

  const grouped = groupByDate(filtered)

  const markAsRead = async (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))
    try { await notificationApi.markAsRead(id) } catch {}
    toast({ title: "Marked as read", variant: "success" })
  }

  const markAllAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
    try { await notificationApi.markAllAsRead(1) } catch {}
    toast({ title: "All notifications marked as read", variant: "success" })
  }

  const removeNotification = async (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
    try { await notificationApi.delete(id) } catch {}
    toast({ title: "Notification deleted", variant: "info" })
  }

  const filterTypes: (NotificationType | "ALL")[] = ["ALL", "NEW_ORDER", "FOOD_READY", "PAYMENT_RECEIVED", "TABLE_REQUEST", "STAFF_ALERT"]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
            <Bell className="h-7 w-7 text-blue-500" />
            Notifications
          </h1>
          <p className="text-muted-foreground mt-1">
            You have <span className="font-bold text-blue-600">{unreadCount}</span> unread notification{unreadCount !== 1 ? "s" : ""}.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={markAllAsRead} disabled={unreadCount === 0}>
            <CheckCheck className="h-4 w-4 mr-2" />
            Mark All Read
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-3 h-4.5 w-4.5 text-muted-foreground" />
          <Input
            placeholder="Search notifications..."
            className="pl-10 h-11"
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 p-1 rounded-xl border border-border/60 bg-white flex-1 overflow-x-auto">
            {filterTypes.map(f => {
              const label = f === "ALL" ? "All" : typeConfig[f].label
              const active = filter === f
              const count = f === "ALL" ? notifications.length : notifications.filter(n => n.type === f).length
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all",
                    active ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20" : "text-muted-foreground hover:bg-slate-100"
                  )}
                >
                  {label} <span className={cn("px-1.5 py-0.5 rounded text-[10px]", active ? "bg-white/20" : "bg-slate-200")}>{count}</span>
                </button>
              )
            })}
          </div>
          <Button variant={onlyUnread ? "default" : "outline"} size="icon" onClick={() => setOnlyUnread(!onlyUnread)} title={onlyUnread ? "Show all" : "Unread only"}>
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-7">
        {Object.keys(grouped).length === 0 ? (
          <Card>
            <CardContent className="py-20 text-center">
              <CheckCircle2 className="h-14 w-14 text-emerald-400 mx-auto mb-3" />
              <p className="text-lg font-bold text-foreground">All caught up!</p>
              <p className="text-sm text-muted-foreground mt-1">No notifications match your filters</p>
              <Button variant="ghost" className="mt-4" onClick={() => { setFilter("ALL"); setOnlyUnread(false); setSearch("") }}>
                Reset filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          Object.entries(grouped).map(([date, items]) => (
            <div key={date} className="space-y-3">
              <div className="flex items-center gap-3 sticky top-[65px] z-10 -mx-1 px-1 py-2 bg-slate-50/90 backdrop-blur-sm">
                <h2 className="text-sm font-black tracking-wide uppercase text-muted-foreground">{date}</h2>
                <div className="h-px flex-1 bg-border/50" />
                <Badge variant="muted" className="text-[10px]">{items.length}</Badge>
              </div>
              <AnimatePresence initial={false}>
                {items.map((n, i) => {
                  const cfg = typeConfig[n.type]
                  const Icon = cfg.icon
                  return (
                    <motion.div
                      key={n.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 40, height: 0 }}
                      transition={{ delay: i * 0.02 }}
                    >
                      <Card className={cn(
                        "relative overflow-hidden border-l-4 transition-all hover:shadow-elevated",
                        cfg.accent,
                        !n.isRead && "bg-gradient-to-r from-blue-50/50 via-white to-white"
                      )}>
                        <CardContent className="p-4 sm:p-5">
                          <div className="flex items-start gap-4">
                            <div className="relative shrink-0">
                              <div className={cn("h-12 w-12 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-lg", cfg.gradient)}>
                                <Icon className="h-5.5 w-5.5 text-white" />
                              </div>
                              {!n.isRead && (
                                <span className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-blue-500 ring-2 ring-white shadow-lg" />
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h3 className={cn("font-bold tracking-tight", !n.isRead ? "text-foreground" : "text-foreground/80")}>
                                      {(n as any).title || cfg.label}
                                    </h3>
                                    {!n.isRead && (
                                      <Badge className="text-[10px] h-4 px-1.5 bg-blue-500/10 text-blue-700 border-0">NEW</Badge>
                                    )}
                                  </div>
                                  <p className={cn("text-sm mt-1", !n.isRead ? "text-muted-foreground" : "text-muted-foreground/80")}>
                                    {n.message}
                                  </p>
                                  <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                                    <Badge variant="muted" className="gap-1 text-[10px] h-5">
                                      <Clock className="h-3 w-3" />
                                      {formatTime(n.createdAt)}
                                    </Badge>
                                    <Badge className={cn("text-[10px] h-5 border-0", cfg.bg, cfg.gradient.replace("from-", "text-").split(" ")[0].replace("bg-gradient-to-br", "").trim())}>
                                      {cfg.label}
                                    </Badge>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1 shrink-0 -mt-1">
                                  {!n.isRead && (
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => markAsRead(n.id)}
                                      className="h-8 w-8 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                                      title="Mark as read"
                                    >
                                      <CheckCircle2 className="h-4 w-4" />
                                    </Button>
                                  )}
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeNotification(n.id)}
                                    className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600"
                                    title="Delete"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
