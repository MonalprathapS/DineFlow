import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  CheckCircle2,
  ChefHat,
  Printer,
  BellRing,
  Zap,
  AlertCircle,
  Clock,
  Timer,
  UtensilsCrossed,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/components/ui/toast"
import { cn, formatTime } from "@/lib/utils"
import type { Order } from "@/types"

interface ReadyOrder extends Order {
  readyAt: string
  hasModifications: boolean
}

const mockReadyOrders: ReadyOrder[] = [
  {
    id: 501,
    orderNumber: "DF-0803-K02",
    customerName: "Business Lunch",
    tableNumber: "T-02",
    status: "READY",
    orderType: "DINE_IN",
    paymentStatus: "PAID",
    subtotal: 89.0,
    taxAmount: 7.12,
    totalAmount: 96.12,
    restaurantId: 1,
    readyAt: new Date(Date.now() - 1 * 60000).toISOString(),
    hasModifications: true,
    items: [
      {
        id: 1,
        menuItemName: "Atlantic Salmon",
        quantity: 2,
        unitPrice: 28.0,
        subtotal: 56.0,
        status: "READY",
        specialInstructions: "Extra lemon sauce on the side, remove dill",
      },
      {
        id: 2,
        menuItemName: "Butter Garlic Prawns",
        quantity: 1,
        unitPrice: 18.0,
        subtotal: 18.0,
        status: "READY",
      },
      {
        id: 3,
        menuItemName: "Sautéed Mushrooms",
        quantity: 2,
        unitPrice: 7.5,
        subtotal: 15.0,
        status: "READY",
        specialInstructions: "NO GARLIC — diet restriction",
      },
    ],
    createdAt: new Date(Date.now() - 22 * 60000).toISOString(),
  },
  {
    id: 502,
    orderNumber: "DF-0803-K04",
    customerName: "Date Night",
    tableNumber: "T-08",
    status: "READY",
    orderType: "DINE_IN",
    paymentStatus: "PAID",
    subtotal: 142.0,
    taxAmount: 11.36,
    totalAmount: 153.36,
    restaurantId: 1,
    readyAt: new Date(Date.now() - 4 * 60000).toISOString(),
    hasModifications: true,
    items: [
      {
        id: 1,
        menuItemName: "Ribeye Steak",
        quantity: 1,
        unitPrice: 48.0,
        subtotal: 48.0,
        status: "READY",
        specialInstructions: "Blue rare, extra peppercorn sauce",
      },
      {
        id: 2,
        menuItemName: "Lobster Tail",
        quantity: 1,
        unitPrice: 42.0,
        subtotal: 42.0,
        status: "READY",
        specialInstructions: "Drawn butter on the side — LOBSTER ALLERGY at table, separate plate",
      },
      {
        id: 3,
        menuItemName: "Duck Fat Potatoes",
        quantity: 2,
        unitPrice: 9.0,
        subtotal: 18.0,
        status: "READY",
      },
      {
        id: 4,
        menuItemName: "Roasted Root Veg",
        quantity: 2,
        unitPrice: 8.0,
        subtotal: 16.0,
        status: "READY",
      },
      {
        id: 5,
        menuItemName: "Chocolate Lava Cake",
        quantity: 2,
        unitPrice: 9.0,
        subtotal: 18.0,
        status: "READY",
        specialInstructions: "One with vanilla ice cream, one without",
      },
    ],
    createdAt: new Date(Date.now() - 28 * 60000).toISOString(),
  },
  {
    id: 503,
    orderNumber: "DF-0803-K08",
    customerName: "Family Brunch",
    tableNumber: "T-06",
    status: "READY",
    orderType: "DINE_IN",
    paymentStatus: "PAID",
    subtotal: 76.0,
    taxAmount: 6.08,
    totalAmount: 82.08,
    restaurantId: 1,
    readyAt: new Date(Date.now() - 7 * 60000).toISOString(),
    hasModifications: false,
    items: [
      {
        id: 1,
        menuItemName: "Eggs Benedict",
        quantity: 2,
        unitPrice: 16.0,
        subtotal: 32.0,
        status: "READY",
      },
      {
        id: 2,
        menuItemName: "Blueberry Pancakes",
        quantity: 1,
        unitPrice: 14.0,
        subtotal: 14.0,
        status: "READY",
      },
      {
        id: 3,
        menuItemName: "Avocado Toast",
        quantity: 2,
        unitPrice: 12.0,
        subtotal: 24.0,
        status: "READY",
      },
      {
        id: 4,
        menuItemName: "Fresh Orange Juice",
        quantity: 3,
        unitPrice: 2.0,
        subtotal: 6.0,
        status: "READY",
      },
    ],
    createdAt: new Date(Date.now() - 24 * 60000).toISOString(),
  },
  {
    id: 504,
    orderNumber: "DF-0803-K09",
    customerName: "Takeaway Pickup",
    tableNumber: "TK-02",
    status: "READY",
    orderType: "TAKEAWAY",
    paymentStatus: "PAID",
    subtotal: 54.0,
    taxAmount: 4.32,
    totalAmount: 58.32,
    restaurantId: 1,
    readyAt: new Date(Date.now() - 10 * 60000).toISOString(),
    hasModifications: true,
    items: [
      {
        id: 1,
        menuItemName: "Spicy Thai Noodles",
        quantity: 2,
        unitPrice: 16.0,
        subtotal: 32.0,
        status: "READY",
        specialInstructions: "MILD spice — kids eating, no chili flakes",
      },
      {
        id: 2,
        menuItemName: "Chicken Satay",
        quantity: 2,
        unitPrice: 8.0,
        subtotal: 16.0,
        status: "READY",
      },
      {
        id: 3,
        menuItemName: "Spring Rolls",
        quantity: 2,
        unitPrice: 3.0,
        subtotal: 6.0,
        status: "READY",
        specialInstructions: "Gluten-free wrapper for one order",
      },
    ],
    createdAt: new Date(Date.now() - 26 * 60000).toISOString(),
  },
]

function getMinutesReady(readyAt: string): number {
  return Math.floor((Date.now() - new Date(readyAt).getTime()) / 60000)
}

function getWaitingColor(minutes: number): string {
  if (minutes >= 10) return "from-red-500 to-rose-500"
  if (minutes >= 5) return "from-amber-500 to-orange-500"
  return "from-emerald-500 to-teal-500"
}

export default function Ready() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [orders, setOrders] = useState<ReadyOrder[]>(mockReadyOrders)
  const [, setTick] = useState(0)
  const [markingServed, setMarkingServed] = useState<number | null>(null)
  const [notifying, setNotifying] = useState<number | null>(null)

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 15000)
    return () => clearInterval(interval)
  }, [])

  const handleMarkServed = (orderId: number) => {
    setMarkingServed(orderId)
    const order = orders.find((o) => o.id === orderId)
    setTimeout(() => {
      setOrders((prev) => prev.filter((o) => o.id !== orderId))
      toast({
        title: "Order Marked Served",
        description: `${order?.orderNumber} has been delivered to table`,
        variant: "success",
      })
      setMarkingServed(null)
    }, 400)
  }

  const handleReprint = (order: ReadyOrder) => {
    toast({
      title: "Reprinting Ticket",
      description: `${order.orderNumber} sent to printer`,
      variant: "default",
    })
  }

  const handleNotify = (orderId: number) => {
    setNotifying(orderId)
    const order = orders.find((o) => o.id === orderId)
    setTimeout(() => {
      toast({
        title: "Waiter Notified",
        description: `Pickup alert sent for ${order?.tableNumber}`,
        variant: "success",
      })
      setNotifying(null)
    }, 600)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
            <CheckCircle2 className="h-7 w-7 text-emerald-600" />
            Ready for Pickup
          </h1>
          <p className="text-muted-foreground mt-1">
            {orders.length} completed orders awaiting service
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge
            variant="success"
            className="gap-1.5 px-3 py-1.5 text-sm font-bold border-0 bg-gradient-to-r from-emerald-500/15 to-teal-500/15 text-emerald-700"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            {orders.length} Ready Now
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
        <AnimatePresence mode="popLayout">
          {orders.map((order, i) => {
            const mins = getMinutesReady(order.readyAt)
            const waitingColor = getWaitingColor(mins)
            const isTakeaway = order.orderType === "TAKEAWAY"
            const hasAllergy = order.items.some((it) =>
              it.specialInstructions?.toLowerCase().includes("allergy")
            )
            const isMarking = markingServed === order.id
            const isNotifying = notifying === order.id

            return (
              <motion.div
                key={order.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{
                  opacity: isMarking ? 0 : 1,
                  y: 0,
                  scale: isMarking ? 0.9 : 1,
                  x: isMarking ? -100 : 0,
                }}
                exit={{ opacity: 0, scale: 0.9, x: -100 }}
                transition={{ delay: 0.04 * i }}
                whileHover={{ y: -3 }}
              >
                <Card
                  className={cn(
                    "h-full overflow-hidden group relative hover:shadow-elevated transition-all",
                    mins >= 10 && "ring-2 ring-red-200 animate-pulse-slow"
                  )}
                >
                  <div className={cn("h-2 bg-gradient-to-r", waitingColor)} />

                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "h-16 w-16 rounded-2xl flex items-center justify-center shadow-xl shrink-0 relative overflow-hidden",
                            `bg-gradient-to-br ${waitingColor}`
                          )}
                        >
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_60%)]" />
                          <span className="relative text-white font-black text-2xl tabular-nums leading-none">
                            {order.tableNumber?.replace(/^T-|^TK-/, "")}
                          </span>
                          {mins >= 10 && (
                            <span className="absolute inset-0 ring-2 ring-inset ring-white/40 rounded-2xl" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-mono font-black text-sm">
                              {order.orderNumber.split("-").slice(-2).join("-")}
                            </p>
                            {isTakeaway ? (
                              <Badge
                                variant="outline"
                                className="text-[10px] h-4 px-2 font-bold border-purple-200 text-purple-700 bg-purple-50"
                              >
                                TAKEAWAY
                              </Badge>
                            ) : (
                              <Badge
                                variant="muted"
                                className="text-[10px] h-4 px-2 font-semibold"
                              >
                                DINE-IN
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm font-bold truncate mt-1">
                            {order.customerName}
                          </p>
                          <div className="flex items-center gap-1 mt-0.5 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>Ready at {formatTime(order.readyAt)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <Badge
                          variant={mins >= 10 ? "destructive" : "default"}
                          className={cn(
                            "text-xs font-bold px-2.5 h-6 rounded-lg",
                            mins < 10 &&
                              mins >= 5 &&
                              "bg-amber-500/15 text-amber-700 border-0",
                            mins < 5 && "bg-emerald-500/15 text-emerald-700 border-0"
                          )}
                        >
                          <Timer className="h-3 w-3 mr-1" />
                          {mins}m
                        </Badge>
                      </div>
                    </div>

                    <div className="mb-4 p-3 rounded-xl bg-gradient-to-br from-emerald-50/60 to-teal-50/40 border border-emerald-100/80 max-h-56 overflow-y-auto space-y-1.5">
                      {order.items.map((item) => {
                        const modified = !!item.specialInstructions
                        const isAllergyNote = item.specialInstructions?.toLowerCase().includes("allergy")
                        return (
                          <div
                            key={item.id}
                            className="flex items-start gap-2.5 py-1.5 px-2 rounded-lg bg-white/60"
                          >
                            <div className="flex shrink-0 items-center gap-1">
                              <span className="h-6 w-6 rounded-md bg-emerald-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                                {item.quantity}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <p className="text-sm font-semibold truncate">
                                  {item.menuItemName}
                                </p>
                                {modified && (
                                  <Badge
                                    variant={isAllergyNote ? "destructive" : "default"}
                                    className={cn(
                                      "text-[9px] h-3.5 px-1.5 font-black uppercase tracking-wider",
                                      !isAllergyNote &&
                                        "bg-amber-500/15 text-amber-700 border-0"
                                    )}
                                  >
                                    {isAllergyNote ? (
                                      <AlertCircle className="h-2.5 w-2.5 mr-0.5" />
                                    ) : (
                                      <Zap className="h-2.5 w-2.5 mr-0.5" />
                                    )}
                                    MODIFIED
                                  </Badge>
                                )}
                              </div>
                              {modified && (
                                <p
                                  className={cn(
                                    "text-[11px] mt-0.5 leading-tight pr-2",
                                    isAllergyNote
                                      ? "text-red-600 font-bold"
                                      : "text-amber-700 font-semibold"
                                  )}
                                >
                                  ⓘ {item.specialInstructions}
                                </p>
                              )}
                            </div>
                            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                          </div>
                        )
                      })}
                    </div>

                    <div className="pt-3 border-t border-border/50 flex items-center gap-2">
                      <Button
                        size="sm"
                        className="flex-1 gap-1.5 h-10 font-bold bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500 hover:from-emerald-600 hover:via-teal-600 hover:to-green-600 shadow-md shadow-emerald-500/20"
                        onClick={() => handleMarkServed(order.id)}
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Mark Served
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className={cn(
                          "h-10 w-10 p-0 rounded-xl shrink-0 transition-all",
                          isNotifying && "bg-blue-50 border-blue-300 text-blue-600 scale-95"
                        )}
                        onClick={() => handleNotify(order.id)}
                      >
                        <BellRing
                          className={cn("h-4 w-4", isNotifying && "animate-bounce")}
                        />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-10 w-10 p-0 rounded-xl shrink-0"
                        onClick={() => handleReprint(order)}
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

      {orders.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20"
        >
          <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-emerald-100 to-teal-100 mx-auto flex items-center justify-center mb-4">
            <ChefHat className="h-10 w-10 text-emerald-600" />
          </div>
          <h3 className="text-xl font-black mb-2">Pickup Area Clear</h3>
          <p className="text-muted-foreground">All ready orders have been served</p>
          <Button
            className="mt-5 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600"
            onClick={() => navigate("/kitchen/preparing")}
          >
            Check Preparing Station
          </Button>
        </motion.div>
      )}
    </div>
  )
}
