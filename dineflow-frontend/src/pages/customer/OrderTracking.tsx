import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  ChevronLeft, CheckCircle2, Clock, ChefHat, Bell, UtensilsCrossed,
  MapPin, Phone, Star, Sparkles, Receipt, Timer, AlertCircle,
  Loader2, ArrowRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/components/ui/toast"
import { orderApi } from "@/api/orders"
import { formatCurrency, cn, formatTime } from "@/lib/utils"
import type { Order, OrderStatus } from "@/types"

type StepKey = "PLACED" | "ACCEPTED" | "PREPARING" | "READY" | "SERVED"

const statusSteps: { key: StepKey; label: string; icon: any; desc: string }[] = [
  { key: "PLACED", label: "Order Placed", icon: Receipt, desc: "Your order has been received" },
  { key: "ACCEPTED", label: "Accepted", icon: CheckCircle2, desc: "Restaurant confirmed your order" },
  { key: "PREPARING", label: "Preparing", icon: ChefHat, desc: "Chefs are cooking your meal" },
  { key: "READY", label: "Ready", icon: Bell, desc: "Your order is ready for service" },
  { key: "SERVED", label: "Served", icon: UtensilsCrossed, desc: "Enjoy your meal!" },
]

const mockOrder: Order = {
  id: 1,
  orderNumber: "DF-58214",
  customerId: 1,
  customerName: "Alex Johnson",
  restaurantId: 1,
  restaurantName: "The Garden Bistro",
  tableId: 7,
  tableNumber: "A7",
  assignedWaiterName: "Sarah",
  status: "PREPARING",
  orderType: "DINE_IN",
  paymentStatus: "PAID",
  paymentMethod: "card",
  subtotal: 72.95,
  taxAmount: 5.84,
  totalAmount: 78.79,
  createdAt: new Date().toISOString(),
  acceptedAt: new Date(Date.now() - 8 * 60000).toISOString(),
  preparingAt: new Date(Date.now() - 5 * 60000).toISOString(),
  items: [
    { id: 1, menuItemId: 3, menuItemName: "Signature Ribeye", quantity: 1, unitPrice: 38.99, subtotal: 38.99, status: "PREPARING" },
    { id: 2, menuItemId: 6, menuItemName: "Quattro Formaggi", quantity: 1, unitPrice: 19.99, subtotal: 19.99, status: "PREPARING" },
    { id: 3, menuItemId: 9, menuItemName: "Fresh Lemonade", quantity: 2, unitPrice: 5.99, subtotal: 11.98, status: "READY" },
    { id: 4, menuItemId: 11, menuItemName: "Tiramisu", quantity: 1, unitPrice: 10.99, subtotal: 10.99, status: "PENDING" },
  ],
}

export default function OrderTracking() {
  const navigate = useNavigate()
  const { orderNumber } = useParams<{ orderNumber: string }>()
  const { user } = useAuth()
  const { toast } = useToast()
  const [order, setOrder] = useState<Order | null>(mockOrder)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentStepIndex, setCurrentStepIndex] = useState(2)
  const [estimatedMin, setEstimatedMin] = useState(18)
  const [pulseRealtime, setPulseRealtime] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const demo = { ...mockOrder, orderNumber: orderNumber || mockOrder.orderNumber }
        const idx = statusSteps.findIndex((s) => s.key === demo.status)
        setCurrentStepIndex(idx >= 0 ? idx : 0)
        setOrder(demo)
      } catch (e: any) {
        setError(e?.message || "Failed to load order")
      } finally {
        setTimeout(() => setLoading(false), 600)
      }
    }
    load()
  }, [orderNumber])

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseRealtime(true)
      setTimeout(() => setPulseRealtime(false), 600)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!order) return
    const auto = setInterval(() => {
      setOrder((prev) => {
        if (!prev) return prev
        const idx = statusSteps.findIndex((s) => s.key === prev.status)
        if (idx < statusSteps.length - 1) {
          const nextKey = statusSteps[idx + 1].key
          const updated = { ...prev, status: nextKey as OrderStatus }
          const timeFields: Partial<Record<StepKey, keyof Order>> = {
            ACCEPTED: "acceptedAt",
            PREPARING: "preparingAt",
            READY: "readyAt",
            SERVED: "servedAt",
          }
          const field = timeFields[nextKey]
          if (field) (updated as any)[field] = new Date().toISOString()
          setCurrentStepIndex(idx + 1)
          if (nextKey === "PREPARING") setEstimatedMin(12)
          if (nextKey === "READY") setEstimatedMin(3)
          if (nextKey === "SERVED") setEstimatedMin(0)
          toast({
            title: "Order updated!",
            description: `Status: ${statusSteps[idx + 1].label}`,
            variant: "success",
          })
          return updated
        }
        return prev
      })
    }, 25000)
    return () => clearInterval(auto)
  }, [toast])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="h-16 w-16 rounded-3xl bg-gradient-primary flex items-center justify-center shadow-xl shadow-brand-500/20">
          <Loader2 className="h-8 w-8 text-white animate-spin" />
        </div>
        <p className="mt-5 text-muted-foreground font-medium">Loading your order…</p>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="h-24 w-24 rounded-3xl bg-red-50 flex items-center justify-center">
          <AlertCircle className="h-12 w-12 text-red-500" strokeWidth={1.5} />
        </div>
        <h2 className="mt-6 text-2xl font-black">Couldn't load order</h2>
        <p className="mt-2 text-muted-foreground max-w-xs">{error || "Order not found."}</p>
        <div className="mt-6 flex gap-3">
          <Button variant="outline" onClick={() => navigate(-1)}>Go Back</Button>
          <Button onClick={() => navigate("/customer/menu")}>Browse Menu</Button>
        </div>
      </div>
    )
  }

  const foodEmoji = (name: string) => {
    const n = name.toLowerCase()
    if (n.includes("salad") || n.includes("caesar")) return "🥗"
    if (n.includes("wings") || n.includes("chicken")) return "🍗"
    if (n.includes("ribeye") || n.includes("steak") || n.includes("salmon")) return "🍖"
    if (n.includes("pizza") || n.includes("formaggi") || n.includes("margherita")) return "🍕"
    if (n.includes("burger") || n.includes("plant")) return "🍔"
    if (n.includes("lemonade") || n.includes("drink") || n.includes("beer") || n.includes("craft")) return "🥤"
    if (n.includes("tiramisu") || n.includes("cake") || n.includes("lava") || n.includes("dessert")) return "🍰"
    return "🍽️"
  }

  const statusColor: Record<string, string> = {
    PLACED: "from-blue-500 to-cyan-500",
    ACCEPTED: "from-violet-500 to-purple-600",
    PREPARING: "from-amber-500 to-orange-500",
    READY: "from-emerald-500 to-teal-600",
    SERVED: "from-pink-500 to-rose-600",
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-black tracking-tight">Order Tracking</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge variant="muted" className="text-[10px] font-mono">#{order.orderNumber}</Badge>
              <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${pulseRealtime ? "scale-105" : ""} transition-transform`}>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                Live
              </span>
            </div>
          </div>
        </div>
        {estimatedMin > 0 && (
          <Card className="border-border/40 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <Timer className="h-4 w-4 text-brand-500" />
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">ETA</p>
                <p className="text-sm font-black leading-none mt-0.5">~{estimatedMin} min</p>
              </div>
            </div>
          </Card>
        )}
      </div>

      <Card className="shadow-elevated border-0 overflow-hidden">
        <div className={cn("p-6 text-white bg-gradient-to-r", statusColor[order.status] || statusSteps[currentStepIndex] && statusColor[statusSteps[currentStepIndex].key] || "from-brand-500 to-orange-500")}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/70 font-bold">Current Status</p>
              <h2 className="text-3xl font-black mt-1">{statusSteps[currentStepIndex].label}</h2>
              <p className="text-white/85 text-sm mt-1">{statusSteps[currentStepIndex].desc}</p>
            </div>
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, -5, 5, 0],
              }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              className="h-20 w-20 shrink-0 rounded-3xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center shadow-2xl"
            >
              {(() => {
                const Icon = statusSteps[currentStepIndex].icon
                return <Icon className="h-10 w-10 text-white" strokeWidth={2} />
              })()}
            </motion.div>
          </div>
        </div>

        <div className="p-6">
          <div className="relative">
            {statusSteps.map((step, i) => {
              const isDone = i < currentStepIndex
              const isActive = i === currentStepIndex
              const StepIcon = step.icon
              return (
                <div key={step.key} className="relative pb-6 last:pb-0">
                  {i < statusSteps.length - 1 && (
                    <div className="absolute left-[22px] top-[44px] h-[calc(100%-28px)] w-0.5">
                      <div className={cn("h-full transition-all duration-1000", isDone ? "bg-gradient-to-b from-brand-400 to-brand-500" : "bg-muted")} />
                    </div>
                  )}
                  <div className="flex gap-4">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: i * 0.08, type: "spring" }}
                      className={cn(
                        "h-11 w-11 rounded-2xl flex items-center justify-center shrink-0 relative z-10 transition-all duration-500",
                        isDone && "bg-gradient-primary text-white shadow-lg shadow-brand-500/30",
                        isActive && "bg-gradient-primary text-white shadow-lg shadow-brand-500/30 ring-4 ring-brand-100",
                        !isDone && !isActive && "bg-muted text-muted-foreground"
                      )}
                    >
                      {isDone ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <StepIcon className={cn("h-5 w-5", isActive && "animate-pulse")} />
                      )}
                    </motion.div>
                    <div className="flex-1 pt-1.5">
                      <div className="flex items-center gap-2">
                        <p className={cn("font-bold", isActive || isDone ? "text-foreground" : "text-muted-foreground")}>
                          {step.label}
                        </p>
                        {isActive && (
                          <Badge className="text-[9px] bg-gradient-primary text-white border-0">Now</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{step.desc}</p>
                      {order.createdAt && i === 0 && (
                        <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {formatTime(order.createdAt)}
                        </p>
                      )}
                      {order.acceptedAt && i === 1 && (
                        <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {formatTime(order.acceptedAt)}
                        </p>
                      )}
                      {order.preparingAt && i === 2 && (
                        <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {formatTime(order.preparingAt)}
                        </p>
                      )}
                      {order.readyAt && i === 3 && (
                        <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {formatTime(order.readyAt)}
                        </p>
                      )}
                      {order.servedAt && i === 4 && (
                        <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {formatTime(order.servedAt)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card className="card-hover border-border/40">
          <div className="p-5">
            <h3 className="font-bold text-lg flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-brand-500" /> Restaurant & Table
            </h3>
            <div className="flex items-start gap-4 rounded-2xl bg-gradient-to-br from-brand-50 to-orange-50 p-4 border border-brand-100">
              <div className="h-14 w-14 shrink-0 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-lg shadow-brand-500/20 text-2xl">
                🍽️
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-bold truncate">{order.restaurantName}</p>
                </div>
                <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                  <Star className="h-3.5 w-3.5 text-amber-500 fill-current" /> 4.8 • 2.1k reviews
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge variant="default" className="gap-1 text-[10px]">
                    <MapPin className="h-3 w-3" /> Table {order.tableNumber}
                  </Badge>
                  {order.assignedWaiterName && (
                    <Badge variant="muted" className="gap-1 text-[10px]">
                      <Sparkles className="h-3 w-3" /> Server: {order.assignedWaiterName}
                    </Badge>
                  )}
                  <Badge variant="success" className="gap-1 text-[10px]">
                    <Phone className="h-3 w-3" /> Call Staff
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="card-hover border-border/40">
          <div className="p-5">
            <h3 className="font-bold text-lg flex items-center gap-2 mb-4">
              <Receipt className="h-5 w-5 text-brand-500" /> Payment
            </h3>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="text-foreground font-semibold">{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Tax (8%)</span>
                <span className="text-foreground font-semibold">{formatCurrency(order.taxAmount)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Service Fee</span>
                <span className="text-foreground font-semibold">FREE</span>
              </div>
              <div className="border-t border-border/60 pt-2.5 flex justify-between items-center">
                <span className="font-bold">Total Paid</span>
                <span className="font-black text-2xl gradient-text">{formatCurrency(order.totalAmount)}</span>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <Badge variant="success" className="gap-1.5 text-[10px]">
                  <CheckCircle2 className="h-3.5 w-3.5" /> {order.paymentStatus}
                </Badge>
                <Badge variant="muted" className="text-[10px] uppercase">{order.paymentMethod}</Badge>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card className="border-border/40">
        <div className="p-5">
          <h3 className="font-bold text-lg flex items-center justify-between mb-4">
            <span className="flex items-center gap-2">
              <UtensilsCrossed className="h-5 w-5 text-brand-500" /> Your Items
            </span>
            <Badge variant="muted" className="text-[10px]">{order.items.length} items</Badge>
          </h3>
          <div className="space-y-2.5">
            <AnimatePresence mode="popLayout">
              {order.items.map((item, idx) => {
                const statusBadge = item.status === "READY"
                  ? <Badge variant="success" className="text-[9px]">Ready</Badge>
                  : item.status === "PREPARING"
                  ? <Badge variant="default" className="text-[9px]">Preparing</Badge>
                  : item.status === "SERVED"
                  ? <Badge variant="default" className="text-[9px] bg-gradient-primary text-white border-0">Served</Badge>
                  : <Badge variant="muted" className="text-[9px]">Pending</Badge>
                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <div className="flex items-center gap-4 rounded-2xl bg-muted/30 p-3.5 border border-transparent hover:border-border/60 transition-colors">
                      <div className="w-14 h-14 shrink-0 rounded-xl bg-gradient-to-br from-brand-100 to-orange-50 flex items-center justify-center text-3xl">
                        {foodEmoji(item.menuItemName)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold truncate">{item.menuItemName}</p>
                          {statusBadge}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Qty {item.quantity} × {formatCurrency(item.unitPrice)}
                        </p>
                      </div>
                      <p className="font-bold shrink-0">{formatCurrency(item.subtotal)}</p>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Button
          variant="outline"
          size="lg"
          className="gap-2"
          onClick={() => toast({ title: "Staff alerted", description: "A server will be with you shortly", variant: "info" })}
        >
          <Bell className="h-4 w-4" /> Call Server
        </Button>
        {currentStepIndex >= statusSteps.length - 1 ? (
          <Button
            size="lg"
            className="gap-2 shadow-xl shadow-brand-500/25"
            onClick={() => navigate(`/customer/orders/${order.orderNumber}/rating`)}
          >
            Rate Experience
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            variant="outline"
            size="lg"
            className="gap-2"
            onClick={() => navigate("/customer/menu")}
          >
            <Sparkles className="h-4 w-4" /> Add More Items
          </Button>
        )}
      </div>
    </div>
  )
}
