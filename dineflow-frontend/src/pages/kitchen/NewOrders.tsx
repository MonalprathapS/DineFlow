import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Bell,
  ChefHat,
  Clock,
  Eye,
  Printer,
  PlayCircle,
  Zap,
  AlertCircle,
  UtensilsCrossed,
  Timer,
  Search,
  Filter,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/components/ui/toast"
import { cn, formatTime } from "@/lib/utils"
import type { Order } from "@/types"

const mockNewOrders: Order[] = [
  {
    id: 301,
    orderNumber: "DF-0803-K11",
    customerName: "VIP Table 7",
    tableNumber: "T-07",
    status: "PLACED",
    orderType: "DINE_IN",
    paymentStatus: "PAID",
    subtotal: 156.0,
    taxAmount: 12.48,
    totalAmount: 168.48,
    restaurantId: 1,
    items: [
      {
        id: 1,
        menuItemName: "Lobster Thermidor",
        quantity: 2,
        unitPrice: 48.0,
        subtotal: 96.0,
        status: "PENDING",
        specialInstructions: "RUSH — VIP guests, 20 min ETA",
      },
      {
        id: 2,
        menuItemName: "Truffle Risotto",
        quantity: 2,
        unitPrice: 22.0,
        subtotal: 44.0,
        status: "PENDING",
      },
      {
        id: 3,
        menuItemName: "Caviar Blini",
        quantity: 2,
        unitPrice: 8.0,
        subtotal: 16.0,
        status: "PENDING",
      },
    ],
    createdAt: new Date(Date.now() - 2 * 60000).toISOString(),
  },
  {
    id: 302,
    orderNumber: "DF-0803-K12",
    customerName: "Large Party",
    tableNumber: "T-15",
    status: "PLACED",
    orderType: "DINE_IN",
    paymentStatus: "PENDING",
    subtotal: 312.0,
    taxAmount: 24.96,
    totalAmount: 336.96,
    restaurantId: 1,
    items: [
      {
        id: 1,
        menuItemName: "Family Paella",
        quantity: 2,
        unitPrice: 68.0,
        subtotal: 136.0,
        status: "PENDING",
      },
      {
        id: 2,
        menuItemName: "Chateaubriand",
        quantity: 2,
        unitPrice: 52.0,
        subtotal: 104.0,
        status: "PENDING",
        specialInstructions: "One medium-rare, one medium",
      },
      {
        id: 3,
        menuItemName: "Seasonal Sides",
        quantity: 6,
        unitPrice: 6.0,
        subtotal: 36.0,
        status: "PENDING",
      },
    ],
    createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
  },
  {
    id: 303,
    orderNumber: "DF-0803-K13",
    customerName: "Allergy Alert",
    tableNumber: "T-12",
    status: "ACCEPTED",
    orderType: "DINE_IN",
    paymentStatus: "PAID",
    subtotal: 62.5,
    taxAmount: 5.0,
    totalAmount: 67.5,
    restaurantId: 1,
    items: [
      {
        id: 1,
        menuItemName: "Grilled Chicken (NO NUTS)",
        quantity: 2,
        unitPrice: 22.0,
        subtotal: 44.0,
        status: "PENDING",
        specialInstructions: "SEVERE PEANUT ALLERGY — separate utensils, no cross-contam",
      },
      {
        id: 2,
        menuItemName: "Steamed Vegetables",
        quantity: 2,
        unitPrice: 9.25,
        subtotal: 18.5,
        status: "PENDING",
      },
    ],
    createdAt: new Date(Date.now() - 8 * 60000).toISOString(),
  },
  {
    id: 304,
    orderNumber: "DF-0803-K14",
    customerName: "Regular Guest",
    tableNumber: "T-03",
    status: "PLACED",
    orderType: "DINE_IN",
    paymentStatus: "PAID",
    subtotal: 48.0,
    taxAmount: 3.84,
    totalAmount: 51.84,
    restaurantId: 1,
    items: [
      {
        id: 1,
        menuItemName: "Classic Burger",
        quantity: 2,
        unitPrice: 16.0,
        subtotal: 32.0,
        status: "PENDING",
        specialInstructions: "Extra bacon, no pickles",
      },
      {
        id: 2,
        menuItemName: "Caesar Salad",
        quantity: 1,
        unitPrice: 12.0,
        subtotal: 12.0,
        status: "PENDING",
        specialInstructions: "No croutons",
      },
      {
        id: 3,
        menuItemName: "French Fries",
        quantity: 1,
        unitPrice: 4.0,
        subtotal: 4.0,
        status: "PENDING",
      },
    ],
    createdAt: new Date(Date.now() - 11 * 60000).toISOString(),
  },
  {
    id: 305,
    orderNumber: "DF-0803-K15",
    customerName: "Takeaway Order",
    tableNumber: "TK-01",
    status: "ACCEPTED",
    orderType: "TAKEAWAY",
    paymentStatus: "PAID",
    subtotal: 72.0,
    taxAmount: 5.76,
    totalAmount: 77.76,
    restaurantId: 1,
    items: [
      {
        id: 1,
        menuItemName: "Margherita Pizza",
        quantity: 2,
        unitPrice: 22.0,
        subtotal: 44.0,
        status: "PENDING",
        specialInstructions: "Well-done crust",
      },
      {
        id: 2,
        menuItemName: "Spaghetti Carbonara",
        quantity: 1,
        unitPrice: 18.0,
        subtotal: 18.0,
        status: "PENDING",
      },
      {
        id: 3,
        menuItemName: "Tiramisu",
        quantity: 2,
        unitPrice: 5.0,
        subtotal: 10.0,
        status: "PENDING",
      },
    ],
    createdAt: new Date(Date.now() - 14 * 60000).toISOString(),
  },
]

function getMinutesAgo(dateStr: string): number {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000)
}

function getPriorityBadge(minutes: number, hasRush: boolean, hasAllergy: boolean) {
  if (hasAllergy) {
    return {
      label: "ALLERGY",
      icon: AlertCircle,
      className: "bg-red-500/15 text-red-700 border-0",
      iconColor: "text-red-600",
    }
  }
  if (hasRush) {
    return {
      label: "RUSH",
      icon: Zap,
      className: "bg-orange-500/15 text-orange-700 border-0",
      iconColor: "text-orange-600",
    }
  }
  if (minutes >= 10) {
    return {
      label: "OVERDUE",
      icon: Clock,
      className: "bg-red-500/15 text-red-700 border-0 animate-pulse",
      iconColor: "text-red-600",
    }
  }
  if (minutes >= 6) {
    return {
      label: "PRIORITY",
      icon: Zap,
      className: "bg-amber-500/15 text-amber-700 border-0",
      iconColor: "text-amber-600",
    }
  }
  return null
}

function groupByTimeReceived(orders: Order[]): { label: string; orders: Order[] }[] {
  const groups: { label: string; orders: Order[] }[] = []
  const recent = orders.filter((o) => getMinutesAgo(o.createdAt!) <= 5)
  const standard = orders.filter(
    (o) => getMinutesAgo(o.createdAt!) > 5 && getMinutesAgo(o.createdAt!) <= 10
  )
  const waiting = orders.filter((o) => getMinutesAgo(o.createdAt!) > 10)

  if (recent.length > 0) groups.push({ label: "Just Received (0-5 min)", orders: recent })
  if (standard.length > 0) groups.push({ label: "Standard Queue (5-10 min)", orders: standard })
  if (waiting.length > 0) groups.push({ label: "Waiting (>10 min)", orders: waiting })
  return groups
}

export default function NewOrders() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [orders, setOrders] = useState<Order[]>(mockNewOrders)
  const [quickViewOrder, setQuickViewOrder] = useState<Order | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [, setAcceptingId] = useState<number | null>(null)

  const filteredOrders = orders.filter(
    (o) =>
      (o.status === "PLACED" || o.status === "ACCEPTED") &&
      (o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (o.tableNumber && o.tableNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (o.customerName && o.customerName.toLowerCase().includes(searchTerm.toLowerCase())))
  )

  const grouped = groupByTimeReceived(filteredOrders)

  const handleAccept = (orderId: number) => {
    setAcceptingId(orderId)
    setTimeout(() => {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: "PREPARING" as const } : o))
      )
      toast({
        title: "Order Accepted",
        description: "Moved to Preparing station",
        variant: "success",
      })
      setAcceptingId(null)
    }, 300)
  }

  const handlePrint = (order: Order) => {
    toast({
      title: "Printing Ticket",
      description: `${order.orderNumber} sent to kitchen printer`,
      variant: "default",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
            <Bell className="h-7 w-7 text-orange-600" />
            New Orders
          </h1>
          <p className="text-muted-foreground mt-1">
            {filteredOrders.length} orders waiting to be prepared — PLACED & ACCEPTED
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge
            variant="success"
            className="gap-1.5 px-3 py-1.5 text-sm font-bold border-0 bg-gradient-to-r from-orange-500/15 to-amber-500/15 text-orange-700"
          >
            <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
            {filteredOrders.length} In Queue
          </Badge>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3.5 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search order #, table, customer..."
            className="pl-11 h-12 rounded-xl"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="h-12 px-5 rounded-xl gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>

      <div className="space-y-8">
        {grouped.map((group, gi) => (
          <div key={group.label}>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-8 w-1.5 rounded-full bg-gradient-to-b from-orange-500 to-amber-500" />
              <h2 className="text-sm font-black uppercase tracking-wider text-muted-foreground">
                {group.label}
              </h2>
              <Badge variant="muted" className="text-xs font-bold">
                {group.orders.length}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              <AnimatePresence mode="popLayout">
                {group.orders.map((order, i) => {
                  const mins = getMinutesAgo(order.createdAt!)
                  const hasAllergy = order.items.some((it) =>
                    it.specialInstructions?.toLowerCase().includes("allergy")
                  )
                  const hasRush = order.items.some((it) =>
                    it.specialInstructions?.toLowerCase().includes("rush")
                  )
                  const priority = getPriorityBadge(mins, hasRush, hasAllergy)
                  const isAccepting = order.status === "PREPARING"

                  return (
                    <motion.div
                      key={order.id}
                      layout
                      initial={{ opacity: 0, y: 20, scale: 0.98 }}
                      animate={{
                        opacity: isAccepting ? 0 : 1,
                        y: 0,
                        scale: isAccepting ? 0.95 : 1,
                        x: isAccepting ? 100 : 0,
                      }}
                      exit={{ opacity: 0, x: 100, scale: 0.95 }}
                      transition={{ delay: 0.03 * i }}
                      whileHover={{ y: -3 }}
                    >
                      <Card
                        className={cn(
                          "h-full overflow-hidden group relative hover:shadow-elevated transition-all",
                          priority?.className?.includes("red") && "ring-2 ring-red-200",
                          hasRush && "ring-2 ring-orange-200"
                        )}
                      >
                        <div
                          className={cn(
                            "h-1.5",
                            hasAllergy
                              ? "bg-gradient-to-r from-red-500 to-rose-500"
                              : hasRush
                              ? "bg-gradient-to-r from-orange-500 to-amber-500"
                              : mins >= 10
                              ? "bg-gradient-to-r from-red-500 to-rose-500"
                              : mins >= 6
                              ? "bg-gradient-to-r from-amber-500 to-yellow-500"
                              : "bg-gradient-to-r from-blue-500 to-indigo-500"
                          )}
                        />
                        <CardContent className="p-5">
                          <div className="flex items-start justify-between gap-2 mb-4">
                            <div className="flex items-center gap-3">
                              <div
                                className={cn(
                                  "h-12 w-12 rounded-2xl flex items-center justify-center shadow-lg shrink-0",
                                  hasAllergy
                                    ? "bg-gradient-to-br from-red-500 to-rose-600"
                                    : hasRush
                                    ? "bg-gradient-to-br from-orange-500 to-amber-500"
                                    : "bg-gradient-to-br from-blue-500 to-indigo-600"
                                )}
                              >
                                <UtensilsCrossed className="h-6 w-6 text-white" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <p className="font-mono font-black text-sm">
                                    {order.orderNumber.split("-").slice(-2).join("-")}
                                  </p>
                                  <Badge
                                    variant="default"
                                    className="text-[10px] px-2 h-4 font-bold bg-slate-900 text-white border-0"
                                  >
                                    {order.tableNumber}
                                  </Badge>
                                </div>
                                <p className="text-sm font-semibold truncate mt-0.5">
                                  {order.customerName}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2.5 mb-4 flex-wrap">
                            {priority && (
                              <Badge className={cn("text-[10px] h-4 px-2 gap-1", priority.className)}>
                                <priority.icon className={cn("h-3 w-3", priority.iconColor)} />
                                {priority.label}
                              </Badge>
                            )}
                            {order.status === "ACCEPTED" && (
                              <Badge
                                variant="muted"
                                className="text-[10px] h-4 px-2 font-semibold bg-blue-500/15 text-blue-700 border-0"
                              >
                                ACCEPTED
                              </Badge>
                            )}
                            <Badge
                              variant="muted"
                              className="text-[10px] h-4 px-2 gap-1 font-medium ml-auto"
                            >
                              <Timer className="h-3 w-3" /> {mins}m ago
                            </Badge>
                          </div>

                          <div className="space-y-2 mb-4">
                            {order.items.map((item) => (
                              <div
                                key={item.id}
                                className="flex items-start justify-between gap-2 py-1.5 border-b border-border/40 last:border-0 last:pb-0"
                              >
                                <div className="flex items-start gap-2 min-w-0">
                                  <Badge
                                    variant="outline"
                                    className="h-5 w-5 p-0 shrink-0 rounded-md font-bold text-xs border-muted-foreground/30 text-muted-foreground"
                                  >
                                    {item.quantity}
                                  </Badge>
                                  <div className="min-w-0">
                                    <p className="text-sm font-semibold truncate">
                                      {item.menuItemName}
                                    </p>
                                    {item.specialInstructions && (
                                      <p
                                        className={cn(
                                          "text-[11px] mt-0.5 leading-tight",
                                          item.specialInstructions.toLowerCase().includes("allergy")
                                            ? "text-red-600 font-bold"
                                            : item.specialInstructions.toLowerCase().includes("rush")
                                            ? "text-orange-600 font-semibold"
                                            : "text-muted-foreground"
                                        )}
                                      >
                                        ⓘ {item.specialInstructions}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="pt-3 border-t border-border/50 flex items-center gap-2">
                            <Button
                              size="sm"
                              className={cn(
                                "flex-1 gap-1.5 h-10 font-bold",
                                order.status === "ACCEPTED"
                                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/20"
                                  : "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-md shadow-orange-500/20"
                              )}
                              onClick={() => handleAccept(order.id)}
                            >
                              <PlayCircle className="h-4 w-4" />
                              {order.status === "ACCEPTED" ? "Start Preparing" : "Accept Order"}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-10 w-10 p-0 rounded-xl"
                              onClick={() => setQuickViewOrder(order)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-10 w-10 p-0 rounded-xl"
                              onClick={() => handlePrint(order)}
                            >
                              <Printer className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          </div>
        ))}

        {filteredOrders.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-emerald-100 to-green-100 mx-auto flex items-center justify-center mb-4">
              <ChefHat className="h-10 w-10 text-emerald-600" />
            </div>
            <h3 className="text-xl font-black mb-2">All Caught Up!</h3>
            <p className="text-muted-foreground">No new orders in queue</p>
            <Button className="mt-5" onClick={() => navigate("/kitchen/dashboard")}>
              Back to Dashboard
            </Button>
          </motion.div>
        )}
      </div>

      <Dialog open={!!quickViewOrder} onOpenChange={() => setQuickViewOrder(null)}>
        <DialogContent className="max-w-lg">
          {quickViewOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-blue-600" />
                  Order {quickViewOrder.orderNumber}
                </DialogTitle>
                <DialogDescription>
                  Table {quickViewOrder.tableNumber} · {quickViewOrder.customerName} · Received at{" "}
                  {formatTime(quickViewOrder.createdAt!)}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 py-2">
                <div className="p-4 rounded-xl bg-muted/30 space-y-3">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Items
                  </Label>
                  {quickViewOrder.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start justify-between gap-3 py-2 border-b border-border/50 last:border-0 last:pb-0"
                    >
                      <div className="flex items-start gap-3">
                        <span className="h-7 w-7 rounded-lg bg-white shadow-sm flex items-center justify-center font-bold text-sm shrink-0">
                          {item.quantity}x
                        </span>
                        <div>
                          <p className="font-bold text-sm">{item.menuItemName}</p>
                          {item.specialInstructions && (
                            <p className="text-xs text-muted-foreground mt-1">
                              ⓘ {item.specialInstructions}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <DialogFooter className="flex sm:flex-row gap-2">
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => handlePrint(quickViewOrder)}
                >
                  <Printer className="h-4 w-4" />
                  Print Ticket
                </Button>
                <Button
                  className="gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                  onClick={() => {
                    handleAccept(quickViewOrder.id)
                    setQuickViewOrder(null)
                  }}
                >
                  <PlayCircle className="h-4 w-4" />
                  Accept & Prepare
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
