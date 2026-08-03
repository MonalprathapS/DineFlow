import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ClipboardList,
  CheckCircle2,
  Clock,
  UserPlus,
  Receipt,
  DollarSign,
  ChefHat,
  MoreHorizontal,
  Table2,
  User,
  UtensilsCrossed,
  AlertTriangle,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/components/ui/toast"
import { staffApi } from "@/api/orders"
import { cn, formatCurrency, formatTime } from "@/lib/utils"
import type { Order, OrderStatus } from "@/types"

const mockOrders: Order[] = [
  {
    id: 101, orderNumber: "DF-0803-001", customerName: "John Smith", tableNumber: "T-12",
    status: "ACCEPTED", orderType: "DINE_IN", paymentStatus: "PENDING",
    subtotal: 68.50, taxAmount: 5.48, totalAmount: 73.98, restaurantId: 1,
    assignedWaiterName: "Alex Johnson",
    items: [
      { id: 1, menuItemName: "Grilled Atlantic Salmon", quantity: 1, unitPrice: 28.00, subtotal: 28.00, status: "PENDING", specialInstructions: "Well done, no lemon" },
      { id: 2, menuItemName: "Classic Caesar Salad", quantity: 1, unitPrice: 12.50, subtotal: 12.50, status: "READY" },
      { id: 3, menuItemName: "Sparkling Water", quantity: 2, unitPrice: 4.00, subtotal: 8.00, status: "SERVED" },
    ],
    createdAt: new Date(Date.now() - 8 * 60000).toISOString(),
  },
  {
    id: 102, orderNumber: "DF-0803-002", customerName: "Emily Davis & Family", tableNumber: "T-05",
    status: "PREPARING", orderType: "DINE_IN", paymentStatus: "PENDING",
    subtotal: 124.00, taxAmount: 9.92, totalAmount: 133.92, restaurantId: 1,
    assignedWaiterName: "Alex Johnson",
    items: [
      { id: 1, menuItemName: "Margherita Pizza (Large)", quantity: 2, unitPrice: 22.00, subtotal: 44.00, status: "PREPARING" },
      { id: 2, menuItemName: "Spaghetti Bolognese", quantity: 1, unitPrice: 18.00, subtotal: 18.00, status: "PREPARING", specialInstructions: "Extra cheese on side" },
      { id: 3, menuItemName: "Tiramisu", quantity: 3, unitPrice: 9.00, subtotal: 27.00, status: "PENDING" },
      { id: 4, menuItemName: "Fresh Orange Juice", quantity: 2, unitPrice: 5.00, subtotal: 10.00, status: "READY" },
    ],
    createdAt: new Date(Date.now() - 22 * 60000).toISOString(),
  },
  {
    id: 103, orderNumber: "DF-0803-003", customerName: "Michael Brown", tableNumber: "T-08",
    status: "READY", orderType: "DINE_IN", paymentStatus: "PENDING",
    subtotal: 125.80, taxAmount: 10.06, totalAmount: 135.86, restaurantId: 1,
    assignedWaiterName: "Alex Johnson",
    items: [
      { id: 1, menuItemName: "Ribeye Steak 16oz", quantity: 2, unitPrice: 42.00, subtotal: 84.00, status: "READY", specialInstructions: "Medium rare, peppercorn sauce" },
      { id: 2, menuItemName: "Cabernet Sauvignon", quantity: 1, unitPrice: 28.00, subtotal: 28.00, status: "READY" },
    ],
    createdAt: new Date(Date.now() - 40 * 60000).toISOString(),
  },
  {
    id: 104, orderNumber: "DF-0803-004", customerName: "Sarah Wilson", tableNumber: "T-03",
    status: "SERVED", orderType: "DINE_IN", paymentStatus: "PENDING",
    subtotal: 32.50, taxAmount: 2.60, totalAmount: 35.10, restaurantId: 1,
    assignedWaiterName: "Alex Johnson",
    items: [
      { id: 1, menuItemName: "Grilled Chicken Pasta", quantity: 1, unitPrice: 16.50, subtotal: 16.50, status: "SERVED" },
      { id: 2, menuItemName: "Iced Lemon Tea", quantity: 2, unitPrice: 3.50, subtotal: 7.00, status: "SERVED" },
    ],
    createdAt: new Date(Date.now() - 65 * 60000).toISOString(),
  },
  {
    id: 105, orderNumber: "DF-0803-005", customerName: "David Lee Partners", tableNumber: "T-15",
    status: "COMPLETED", orderType: "DINE_IN", paymentStatus: "PAID",
    subtotal: 289.20, taxAmount: 23.14, totalAmount: 312.34, restaurantId: 1,
    assignedWaiterName: "Alex Johnson", paymentMethod: "Credit Card",
    items: [
      { id: 1, menuItemName: "Premium Sushi Platter", quantity: 2, unitPrice: 78.00, subtotal: 156.00, status: "SERVED" },
      { id: 2, menuItemName: "Miso Soup", quantity: 4, unitPrice: 5.50, subtotal: 22.00, status: "SERVED" },
      { id: 3, menuItemName: "Sake 720ml", quantity: 1, unitPrice: 45.00, subtotal: 45.00, status: "SERVED" },
    ],
    createdAt: new Date(Date.now() - 130 * 60000).toISOString(),
    completedAt: new Date(Date.now() - 80 * 60000).toISOString(),
  },
  {
    id: 106, orderNumber: "DF-0803-006", customerName: "Amanda Foster", tableNumber: "T-02",
    status: "READY", orderType: "DINE_IN", paymentStatus: "PENDING",
    subtotal: 24.00, taxAmount: 1.92, totalAmount: 25.92, restaurantId: 1,
    assignedWaiterName: "Not Assigned",
    items: [
      { id: 1, menuItemName: "Club Sandwich", quantity: 1, unitPrice: 14.00, subtotal: 14.00, status: "READY" },
      { id: 2, menuItemName: "French Fries", quantity: 1, unitPrice: 5.00, subtotal: 5.00, status: "READY" },
    ],
    createdAt: new Date(Date.now() - 35 * 60000).toISOString(),
  },
  {
    id: 107, orderNumber: "DF-0803-007", customerName: "Robert Kim", tableNumber: "T-10",
    status: "PREPARING", orderType: "DINE_IN", paymentStatus: "PAID",
    subtotal: 56.75, taxAmount: 4.54, totalAmount: 61.29, restaurantId: 1,
    assignedWaiterName: "Alex Johnson", paymentMethod: "Mobile Pay",
    items: [
      { id: 1, menuItemName: "Pad Thai", quantity: 2, unitPrice: 16.50, subtotal: 33.00, status: "PREPARING", specialInstructions: "Spicy level 3, no peanuts" },
      { id: 2, menuItemName: "Thai Iced Tea", quantity: 2, unitPrice: 4.50, subtotal: 9.00, status: "READY" },
    ],
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
  },
  {
    id: 108, orderNumber: "DF-0803-008", customerName: "Lisa Chen", tableNumber: "T-01",
    status: "COMPLETED", orderType: "DINE_IN", paymentStatus: "PAID",
    subtotal: 44.00, taxAmount: 3.52, totalAmount: 47.52, restaurantId: 1,
    assignedWaiterName: "Alex Johnson", paymentMethod: "Cash",
    items: [
      { id: 1, menuItemName: "Dim Sum Basket", quantity: 2, unitPrice: 18.00, subtotal: 36.00, status: "SERVED" },
    ],
    createdAt: new Date(Date.now() - 150 * 60000).toISOString(),
    completedAt: new Date(Date.now() - 95 * 60000).toISOString(),
  },
]

const statusBadge: Record<string, string> = {
  ACCEPTED: "bg-blue-500/10 text-blue-600",
  PREPARING: "bg-amber-500/10 text-amber-600",
  READY: "bg-purple-500/10 text-purple-600",
  SERVED: "bg-green-500/10 text-green-600",
  COMPLETED: "bg-emerald-500/10 text-emerald-600",
  CANCELLED: "bg-red-500/10 text-red-600",
  PLACED: "bg-slate-500/10 text-slate-600",
}

const orderItemStatusColor: Record<string, string> = {
  PENDING: "bg-slate-100 text-slate-600 border-slate-200",
  PREPARING: "bg-amber-50 text-amber-700 border-amber-200",
  READY: "bg-purple-50 text-purple-700 border-purple-200",
  SERVED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  CANCELLED: "bg-red-50 text-red-700 border-red-200",
}

export default function Orders() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [activeTab, setActiveTab] = useState("all")
  const [loadingIds, setLoadingIds] = useState<Set<number>>(new Set())

  useEffect(() => {
    const load = async () => {
      try {
        if (user?.id) {
          const res = await staffApi.getTodayOrders(user.id, 1)
          if (res.data.success) setOrders(res.data.data)
        }
      } catch {}
    }
    load()
  }, [user?.id])

  const isLoading = (id: number) => loadingIds.has(id)
  const startLoading = (id: number) => setLoadingIds(prev => new Set(prev).add(id))
  const stopLoading = (id: number) => setLoadingIds(prev => { const s = new Set(prev); s.delete(id); return s })

  const handleAction = async (id: number, action: string, successMsg: string) => {
    startLoading(id)
    await new Promise(r => setTimeout(r, 500))
    stopLoading(id)
    toast({ title: "Success", description: successMsg, variant: "success" })
  }

  const activeOrders = orders.filter(o => o.status !== "COMPLETED" && o.status !== "CANCELLED")
  const completedOrders = orders.filter(o => o.status === "COMPLETED")

  const filterByTab = (list: Order[]) => {
    if (activeTab === "all") return list
    if (activeTab === "active") return list.filter(o => o.status !== "COMPLETED" && o.status !== "CANCELLED")
    if (activeTab === "completed") return list.filter(o => o.status === "COMPLETED")
    return list.filter(o => o.status === activeTab.toUpperCase())
  }

  const displayOrders = activeTab === "completed" ? completedOrders : filterByTab(orders)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
            <ClipboardList className="h-7 w-7 text-blue-500" />
            Order Management
          </h1>
          <p className="text-muted-foreground mt-1">Track and manage all orders in real-time.</p>
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 md:grid-cols-8 lg:inline-flex w-full lg:w-auto gap-1 p-1">
          <TabsTrigger value="all" className="text-xs md:text-sm">All ({orders.length})</TabsTrigger>
          <TabsTrigger value="active" className="text-xs md:text-sm">Active ({activeOrders.length})</TabsTrigger>
          <TabsTrigger value="accepted" className="text-xs md:text-sm">Accepted ({orders.filter(o => o.status === "ACCEPTED").length})</TabsTrigger>
          <TabsTrigger value="preparing" className="text-xs md:text-sm">Preparing ({orders.filter(o => o.status === "PREPARING").length})</TabsTrigger>
          <TabsTrigger value="ready" className="text-xs md:text-sm">Ready ({orders.filter(o => o.status === "READY").length})</TabsTrigger>
          <TabsTrigger value="served" className="text-xs md:text-sm">Served ({orders.filter(o => o.status === "SERVED").length})</TabsTrigger>
          <TabsTrigger value="completed" className="text-xs md:text-sm">Completed ({completedOrders.length})</TabsTrigger>
        </TabsList>
      </Tabs>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-5"
        >
          {displayOrders.map((order, i) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03 }}
            >
              <Card className="h-full overflow-hidden hover:shadow-elevated transition-all">
                <div className={cn(
                  "h-1.5",
                  order.status === "ACCEPTED" && "bg-blue-500",
                  order.status === "PREPARING" && "bg-gradient-to-r from-amber-400 to-orange-500",
                  order.status === "READY" && "bg-gradient-to-r from-purple-500 to-violet-500 animate-pulse-slow",
                  order.status === "SERVED" && "bg-green-500",
                  order.status === "COMPLETED" && "bg-emerald-500",
                  order.status === "CANCELLED" && "bg-red-500",
                )} />
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-black truncate">{order.customerName}</h3>
                        <Badge variant={order.paymentStatus === "PAID" ? "success" : "warning"} className="text-[10px] h-4 px-2">
                          {order.paymentStatus}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1"><Table2 className="h-3 w-3" /> {order.tableNumber}</span>
                        <span className="font-mono">{order.orderNumber.split("-").slice(-2).join("-")}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {formatTime(order.createdAt!)}</span>
                      </div>
                    </div>
                    <Badge className={cn("gap-1.5 px-3 py-1", statusBadge[order.status])}>
                      <span className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        order.status === "READY" && "bg-purple-500 animate-pulse",
                        order.status === "PREPARING" && "bg-amber-500 animate-pulse",
                        order.status === "ACCEPTED" && "bg-blue-500",
                        order.status === "SERVED" && "bg-green-500",
                        order.status === "COMPLETED" && "bg-emerald-500",
                      )} />
                      {order.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-xl border border-border/50 overflow-hidden">
                    <div className="max-h-44 overflow-y-auto divide-y divide-border/40">
                      {order.items.map(item => (
                        <div key={item.id} className="flex items-start justify-between gap-3 px-3.5 py-2.5">
                          <div className="flex items-start gap-2.5 min-w-0 flex-1">
                            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-orange-500/10 to-amber-500/10 flex items-center justify-center shrink-0">
                              <UtensilsCrossed className="h-4 w-4 text-orange-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <p className="font-semibold text-sm truncate">{item.menuItemName}</p>
                                <span className="text-xs text-muted-foreground">x{item.quantity}</span>
                              </div>
                              {item.specialInstructions && (
                                <p className="text-[11px] text-amber-600 mt-0.5 flex items-center gap-1">
                                  <AlertTriangle className="h-3 w-3 shrink-0" />
                                  {item.specialInstructions}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1 shrink-0">
                            <span className="font-bold text-sm whitespace-nowrap">{formatCurrency(item.subtotal)}</span>
                            <span className={cn("text-[9px] px-1.5 py-0.5 rounded border font-semibold uppercase tracking-wide", orderItemStatusColor[item.status])}>
                              {item.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <User className="h-3.5 w-3.5" />
                      <span>Assigned: <span className="font-semibold text-foreground">{order.assignedWaiterName || "Unassigned"}</span></span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Total</p>
                      <p className="text-xl font-black tracking-tight text-blue-600">{formatCurrency(order.totalAmount)}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {order.status === "ACCEPTED" && (
                      <>
                        <Button size="sm" className="gap-1.5 text-xs flex-1" onClick={() => handleAction(order.id, "start", "Order sent to kitchen")}>
                          <ChefHat className="h-3.5 w-3.5" />
                          Send to Kitchen
                        </Button>
                      </>
                    )}
                    {order.status === "PREPARING" && (
                      <Button size="sm" variant="secondary" className="gap-1.5 text-xs flex-1" disabled>
                        <Clock className="h-3.5 w-3.5" />
                        Kitchen Preparing...
                      </Button>
                    )}
                    {order.status === "READY" && (
                      <Button size="sm" className="gap-1.5 text-xs flex-1 bg-gradient-to-r from-purple-500 to-violet-600" onClick={() => handleAction(order.id, "serve", `Order ${order.orderNumber} marked as served`)} disabled={isLoading(order.id)}>
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {isLoading(order.id) ? "Marking..." : "Mark Served"}
                      </Button>
                    )}
                    {order.status === "SERVED" && order.paymentStatus === "PENDING" && (
                      <Button size="sm" variant="success" className="gap-1.5 text-xs flex-1" onClick={() => handleAction(order.id, "paid", "Payment marked as received")} disabled={isLoading(order.id)}>
                        <DollarSign className="h-3.5 w-3.5" />
                        {isLoading(order.id) ? "Processing..." : "Mark Paid"}
                      </Button>
                    )}
                    {order.status === "SERVED" && order.paymentStatus === "PAID" && (
                      <Button size="sm" className="gap-1.5 text-xs flex-1" onClick={() => handleAction(order.id, "complete", "Order completed successfully")} disabled={isLoading(order.id)}>
                        <Receipt className="h-3.5 w-3.5" />
                        {isLoading(order.id) ? "Closing..." : "Complete Order"}
                      </Button>
                    )}
                    {!order.assignedWaiterName || order.assignedWaiterName === "Not Assigned" ? (
                      <Button size="sm" variant="outline" className="gap-1.5 text-xs" onClick={() => handleAction(order.id, "assign", "Staff assigned successfully")}>
                        <UserPlus className="h-3.5 w-3.5" />
                        Assign Me
                      </Button>
                    ) : null}
                    <Button size="sm" variant="ghost" size-icon className="h-9 w-9 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {displayOrders.length === 0 && (
        <Card>
          <CardContent className="py-16 text-center">
            <ClipboardList className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-muted-foreground font-semibold">No orders found</p>
            <p className="text-sm text-muted-foreground mt-1">Orders will appear here as they come in</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
