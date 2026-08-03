import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Clock,
  ChefHat,
  CheckCircle2,
  Zap,
  AlertCircle,
  UtensilsCrossed,
  Timer,
  PauseCircle,
  Flame,
  Star,
  Plus,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/components/ui/toast"
import { cn, formatTime } from "@/lib/utils"
import type { Order, OrderItemStatus } from "@/types"

interface PreparingOrder extends Order {
  startedAt: string
  estimatedMinutes: number
  priority: boolean
}

const mockPreparingOrders: PreparingOrder[] = [
  {
    id: 401,
    orderNumber: "DF-0803-K01",
    customerName: "VIP Table 7",
    tableNumber: "T-07",
    status: "PREPARING",
    orderType: "DINE_IN",
    paymentStatus: "PAID",
    subtotal: 156.0,
    taxAmount: 12.48,
    totalAmount: 168.48,
    restaurantId: 1,
    startedAt: new Date(Date.now() - 3 * 60000).toISOString(),
    estimatedMinutes: 18,
    priority: true,
    items: [
      {
        id: 1,
        menuItemName: "Lobster Thermidor",
        quantity: 2,
        unitPrice: 48.0,
        subtotal: 96.0,
        status: "PREPARING",
        specialInstructions: "RUSH — VIP guests, 20 min ETA",
      },
      {
        id: 2,
        menuItemName: "Truffle Risotto",
        quantity: 2,
        unitPrice: 22.0,
        subtotal: 44.0,
        status: "READY",
      },
      {
        id: 3,
        menuItemName: "Caviar Blini",
        quantity: 2,
        unitPrice: 8.0,
        subtotal: 16.0,
        status: "READY",
      },
    ],
    createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
  },
  {
    id: 402,
    orderNumber: "DF-0803-K05",
    customerName: "Anniversary Table",
    tableNumber: "T-09",
    status: "PREPARING",
    orderType: "DINE_IN",
    paymentStatus: "PAID",
    subtotal: 124.0,
    taxAmount: 9.92,
    totalAmount: 133.92,
    restaurantId: 1,
    startedAt: new Date(Date.now() - 7 * 60000).toISOString(),
    estimatedMinutes: 15,
    priority: false,
    items: [
      {
        id: 1,
        menuItemName: "Filet Mignon",
        quantity: 2,
        unitPrice: 42.0,
        subtotal: 84.0,
        status: "PREPARING",
        specialInstructions: "Both medium-rare, anniversary — plate nicely",
      },
      {
        id: 2,
        menuItemName: "Grilled Asparagus",
        quantity: 2,
        unitPrice: 8.0,
        subtotal: 16.0,
        status: "READY",
      },
      {
        id: 3,
        menuItemName: "Creamed Spinach",
        quantity: 2,
        unitPrice: 7.0,
        subtotal: 14.0,
        status: "PREPARING",
      },
      {
        id: 4,
        menuItemName: "Glass of Rosé",
        quantity: 2,
        unitPrice: 5.0,
        subtotal: 10.0,
        status: "READY",
      },
    ],
    createdAt: new Date(Date.now() - 10 * 60000).toISOString(),
  },
  {
    id: 403,
    orderNumber: "DF-0803-K06",
    customerName: "Allergy Alert",
    tableNumber: "T-12",
    status: "PREPARING",
    orderType: "DINE_IN",
    paymentStatus: "PAID",
    subtotal: 62.5,
    taxAmount: 5.0,
    totalAmount: 67.5,
    restaurantId: 1,
    startedAt: new Date(Date.now() - 2 * 60000).toISOString(),
    estimatedMinutes: 12,
    priority: true,
    items: [
      {
        id: 1,
        menuItemName: "Grilled Chicken (NO NUTS)",
        quantity: 2,
        unitPrice: 22.0,
        subtotal: 44.0,
        status: "PREPARING",
        specialInstructions: "SEVERE PEANUT ALLERGY — separate utensils, no cross-contam",
      },
      {
        id: 2,
        menuItemName: "Steamed Vegetables",
        quantity: 2,
        unitPrice: 9.25,
        subtotal: 18.5,
        status: "READY",
      },
    ],
    createdAt: new Date(Date.now() - 12 * 60000).toISOString(),
  },
  {
    id: 404,
    orderNumber: "DF-0803-K07",
    customerName: "Lunch Rush",
    tableNumber: "T-04",
    status: "PREPARING",
    orderType: "DINE_IN",
    paymentStatus: "PAID",
    subtotal: 58.0,
    taxAmount: 4.64,
    totalAmount: 62.64,
    restaurantId: 1,
    startedAt: new Date(Date.now() - 9 * 60000).toISOString(),
    estimatedMinutes: 10,
    priority: false,
    items: [
      {
        id: 1,
        menuItemName: "Classic Burger",
        quantity: 2,
        unitPrice: 16.0,
        subtotal: 32.0,
        status: "READY",
        specialInstructions: "Extra bacon, no pickles",
      },
      {
        id: 2,
        menuItemName: "Club Sandwich",
        quantity: 1,
        unitPrice: 14.0,
        subtotal: 14.0,
        status: "PREPARING",
      },
      {
        id: 3,
        menuItemName: "Caesar Salad",
        quantity: 1,
        unitPrice: 12.0,
        subtotal: 12.0,
        status: "PREPARING",
      },
    ],
    createdAt: new Date(Date.now() - 14 * 60000).toISOString(),
  },
]

function calculateProgress(order: PreparingOrder): number {
  const elapsed = (Date.now() - new Date(order.startedAt).getTime()) / 60000
  const progress = (elapsed / order.estimatedMinutes) * 100
  return Math.min(100, Math.max(0, progress))
}

function getItemProgress(status: OrderItemStatus): { dots: number; filled: number } {
  if (status === "READY") return { dots: 3, filled: 3 }
  if (status === "PREPARING") return { dots: 3, filled: 2 }
  if (status === "SERVED") return { dots: 3, filled: 3 }
  return { dots: 3, filled: 0 }
}

export default function Preparing() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [orders, setOrders] = useState<PreparingOrder[]>(mockPreparingOrders)
  const [, setTick] = useState(0)
  const [delayOrder, setDelayOrder] = useState<PreparingOrder | null>(null)
  const [markingReady, setMarkingReady] = useState<number | null>(null)

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 1000)
    return () => clearInterval(interval)
  }, [])

  const togglePriority = (orderId: number) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, priority: !o.priority } : o))
    )
    const order = orders.find((o) => o.id === orderId)
    toast({
      title: order?.priority ? "Priority Disabled" : "Priority Enabled",
      description: `Order ${order?.orderNumber} updated`,
      variant: "default",
    })
  }

  const addDelay = (orderId: number, minutes: number) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, estimatedMinutes: o.estimatedMinutes + minutes }
          : o
      )
    )
    toast({
      title: `${minutes} min added`,
      description: "Estimated time updated",
      variant: "default",
    })
    setDelayOrder(null)
  }

  const markReady = (orderId: number) => {
    setMarkingReady(orderId)
    const order = orders.find((o) => o.id === orderId)
    setTimeout(() => {
      setOrders((prev) => prev.filter((o) => o.id !== orderId))
      toast({
        title: "Order Marked Ready",
        description: `${order?.orderNumber} moved to pickup`,
        variant: "success",
      })
      setMarkingReady(null)
    }, 400)
  }

  const toggleItemStatus = (orderId: number, itemId: number) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              items: o.items.map((it) =>
                it.id === itemId
                  ? {
                      ...it,
                      status: it.status === "READY" ? ("PREPARING" as const) : ("READY" as const),
                    }
                  : it
              ),
            }
          : o
      )
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
            <Clock className="h-7 w-7 text-indigo-600" />
            Preparing
          </h1>
          <p className="text-muted-foreground mt-1">
            {orders.length} orders currently being cooked
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge
            variant="success"
            className="gap-1.5 px-3 py-1.5 text-sm font-bold border-0 bg-gradient-to-r from-blue-500/15 to-indigo-500/15 text-indigo-700"
          >
            <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
            {orders.length} Cooking Now
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        <AnimatePresence mode="popLayout">
          {orders.map((order, i) => {
            const progress = calculateProgress(order)
            const elapsed = (Date.now() - new Date(order.startedAt).getTime()) / 60000
            const remaining = Math.max(0, order.estimatedMinutes - elapsed)
            const isLate = remaining <= 0 || progress >= 95
            const hasAllergy = order.items.some((it) =>
              it.specialInstructions?.toLowerCase().includes("allergy")
            )
            const allItemsReady = order.items.every((it) => it.status === "READY")
            const readyItems = order.items.filter((it) => it.status === "READY").length
            const isMarking = markingReady === order.id

            return (
              <motion.div
                key={order.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{
                  opacity: isMarking ? 0 : 1,
                  y: isMarking ? -30 : 0,
                  scale: isMarking ? 0.92 : 1,
                }}
                exit={{ opacity: 0, scale: 0.92, x: 100 }}
                transition={{ delay: 0.04 * i }}
                whileHover={{ y: -3 }}
              >
                <Card
                  className={cn(
                    "h-full overflow-hidden group relative hover:shadow-elevated transition-all",
                    isLate && "ring-2 ring-red-200"
                  )}
                >
                  <div className="h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500" />
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "h-12 w-12 rounded-2xl flex items-center justify-center shadow-lg shrink-0 relative",
                            hasAllergy
                              ? "bg-gradient-to-br from-red-500 to-rose-600"
                              : "bg-gradient-to-br from-blue-500 via-indigo-500 to-violet-600"
                          )}
                        >
                          <Flame className="h-6 w-6 text-white animate-pulse-slow" />
                          {order.priority && (
                            <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-orange-500 ring-2 ring-white flex items-center justify-center shadow-lg">
                              <Zap className="h-2.5 w-2.5 text-white" />
                            </span>
                          )}
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
                      <div
                        className={cn(
                          "text-right shrink-0",
                          isLate ? "text-red-600" : "text-indigo-600"
                        )}
                      >
                        <div className="flex items-center gap-1 justify-end">
                          <Timer className={cn("h-4 w-4", isLate && "animate-pulse")} />
                          <span className="font-black text-lg leading-none tabular-nums">
                            {isLate
                              ? `+${Math.floor(elapsed - order.estimatedMinutes)}m`
                              : `${Math.ceil(remaining)}m`}
                          </span>
                        </div>
                        <p
                          className={cn(
                            "text-[10px] font-bold uppercase tracking-wider mt-0.5",
                            isLate ? "text-red-500" : "text-muted-foreground"
                          )}
                        >
                          {isLate ? "OVERDUE" : "remaining"}
                        </p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-1.5 text-xs">
                        <span className="font-semibold text-muted-foreground">
                          Cooking Progress
                        </span>
                        <span className="font-black tabular-nums">
                          {readyItems}/{order.items.length} items
                        </span>
                      </div>
                      <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden relative">
                        <motion.div
                          className={cn(
                            "h-full rounded-full relative overflow-hidden",
                            isLate
                              ? "bg-gradient-to-r from-red-500 via-rose-500 to-orange-500"
                              : allItemsReady
                              ? "bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500"
                              : "bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500"
                          )}
                          initial={{ width: 0 }}
                          animate={{ width: `${allItemsReady ? 100 : progress}%` }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                        >
                          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] [animation:_shimmer_1.5s_infinite]" />
                        </motion.div>
                      </div>
                    </div>

                    <div className="space-y-1.5 mb-4 max-h-52 overflow-y-auto pr-1">
                      {order.items.map((item) => {
                        const { dots, filled } = getItemProgress(item.status)
                        const isReady = item.status === "READY"
                        const hasSpecial = !!item.specialInstructions
                        return (
                          <div
                            key={item.id}
                            onClick={() => toggleItemStatus(order.id, item.id)}
                            className={cn(
                              "p-2.5 rounded-xl transition-all cursor-pointer group/item",
                              isReady
                                ? "bg-emerald-50/60 border border-emerald-100"
                                : "bg-muted/30 border border-transparent hover:border-indigo-200 hover:bg-indigo-50/30"
                            )}
                          >
                            <div className="flex items-center gap-2.5">
                              <Badge
                                variant={isReady ? "success" : "outline"}
                                className={cn(
                                  "h-5 w-5 p-0 shrink-0 rounded-md font-bold text-xs",
                                  isReady && "bg-emerald-600 border-0 text-white"
                                )}
                              >
                                {item.quantity}
                              </Badge>
                              <div className="flex-1 min-w-0">
                                <p
                                  className={cn(
                                    "text-sm font-semibold truncate",
                                    isReady && "text-emerald-700 line-through/0"
                                  )}
                                >
                                  {item.menuItemName}
                                </p>
                                {hasSpecial && (
                                  <p
                                    className={cn(
                                      "text-[10px] mt-0.5 leading-tight",
                                      item.specialInstructions?.toLowerCase().includes("allergy")
                                        ? "text-red-600 font-bold"
                                        : "text-muted-foreground"
                                    )}
                                  >
                                    ⓘ {item.specialInstructions}
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center gap-0.5 shrink-0">
                                {Array.from({ length: dots }).map((_, d) => (
                                  <span
                                    key={d}
                                    className={cn(
                                      "h-1.5 w-1.5 rounded-full transition-colors",
                                      d < filled
                                        ? isReady
                                          ? "bg-emerald-500"
                                          : "bg-indigo-500"
                                        : "bg-slate-300"
                                    )}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    <div className="pt-3 border-t border-border/50 flex items-center gap-2">
                      <Button
                        size="sm"
                        className={cn(
                          "flex-1 gap-1.5 h-10 font-bold transition-all",
                          allItemsReady
                            ? "bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500 hover:from-emerald-600 hover:via-teal-600 hover:to-green-600 shadow-md shadow-emerald-500/20"
                            : "bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 shadow-md shadow-slate-500/20"
                        )}
                        onClick={() => markReady(order.id)}
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Mark Ready
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className={cn(
                          "h-10 w-10 p-0 rounded-xl shrink-0",
                          order.priority && "bg-orange-50 border-orange-200 text-orange-600"
                        )}
                        onClick={() => togglePriority(order.id)}
                      >
                        <Star
                          className={cn("h-4 w-4", order.priority && "fill-orange-500 text-orange-500")}
                        />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-10 w-10 p-0 rounded-xl shrink-0"
                        onClick={() => setDelayOrder(order)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {orders.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20"
        >
          <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-indigo-100 to-violet-100 mx-auto flex items-center justify-center mb-4">
            <UtensilsCrossed className="h-10 w-10 text-indigo-600" />
          </div>
          <h3 className="text-xl font-black mb-2">Nothing Cooking</h3>
          <p className="text-muted-foreground">Accept orders from New Orders to start preparing</p>
          <Button
            className="mt-5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
            onClick={() => navigate("/kitchen/new")}
          >
            Go to New Orders
          </Button>
        </motion.div>
      )}

      <Dialog open={!!delayOrder} onOpenChange={() => setDelayOrder(null)}>
        <DialogContent className="max-w-sm">
          {delayOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <PauseCircle className="h-5 w-5 text-amber-600" />
                  Add Delay
                </DialogTitle>
                <DialogDescription>
                  Order {delayOrder.orderNumber} · Table {delayOrder.tableNumber}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 py-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  How many minutes to add?
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  {[2, 5, 10].map((min) => (
                    <Button
                      key={min}
                      variant="outline"
                      className="h-14 flex-col gap-0.5 rounded-xl hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 transition-all"
                      onClick={() => addDelay(delayOrder.id, min)}
                    >
                      <span className="font-black text-xl">{min}</span>
                      <span className="text-[10px] uppercase font-bold opacity-70">min</span>
                    </Button>
                  ))}
                </div>
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setDelayOrder(null)} className="w-full sm:w-auto">
                  Cancel
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
