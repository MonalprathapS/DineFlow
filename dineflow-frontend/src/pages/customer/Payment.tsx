import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  CreditCard, ChevronLeft, Shield, Banknote, CheckCircle2,
  Smartphone, Copy, QrCode, ArrowRight, Calendar, Loader2,
  Sparkles, Receipt, AlertCircle, PartyPopper
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/components/ui/toast"
import { orderApi } from "@/api/orders"
import { formatCurrency, cn } from "@/lib/utils"
import type { Order } from "@/types"

type PaymentMethod = "upi" | "card" | "cash"

const mockOrder: Order = {
  id: 1,
  orderNumber: "DF-58214",
  customerId: 1,
  customerName: "Alex Johnson",
  restaurantId: 1,
  restaurantName: "The Garden Bistro",
  tableId: 7,
  tableNumber: "A7",
  status: "SERVED",
  orderType: "DINE_IN",
  paymentStatus: "PENDING",
  subtotal: 72.95,
  taxAmount: 5.84,
  totalAmount: 78.79,
  createdAt: new Date().toISOString(),
  items: [
    { id: 1, menuItemId: 3, menuItemName: "Signature Ribeye", quantity: 1, unitPrice: 38.99, subtotal: 38.99, status: "SERVED" },
    { id: 2, menuItemId: 6, menuItemName: "Quattro Formaggi", quantity: 1, unitPrice: 19.99, subtotal: 19.99, status: "SERVED" },
    { id: 3, menuItemId: 9, menuItemName: "Fresh Lemonade", quantity: 2, unitPrice: 5.99, subtotal: 11.98, status: "SERVED" },
    { id: 4, menuItemId: 11, menuItemName: "Tiramisu", quantity: 1, unitPrice: 10.99, subtotal: 10.99, status: "SERVED" },
  ],
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

export default function Payment() {
  const navigate = useNavigate()
  const { orderNumber } = useParams<{ orderNumber: string }>()
  const { user } = useAuth()
  const { toast } = useToast()

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [method, setMethod] = useState<PaymentMethod>("card")
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(false)
  const [txnId, setTxnId] = useState("")
  const [error, setError] = useState<string | null>(null)

  const [card, setCard] = useState({ number: "", name: user?.name?.toUpperCase() || "", expiry: "", cvc: "" })
  const [upi, setUpi] = useState({ id: "", pin: "" })
  const [tip, setTip] = useState<number | "custom">("custom")
  const [customTip, setCustomTip] = useState("")

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const demo = { ...mockOrder, orderNumber: orderNumber || mockOrder.orderNumber }
        setOrder(demo)
      } catch (e: any) {
        setError(e?.message || "Failed to load order")
      } finally {
        setTimeout(() => setLoading(false), 500)
      }
    }
    load()
  }, [orderNumber])

  const tipAmount = tip === "custom" ? Number(customTip) || 0 : tip
  const grandTotal = (order?.totalAmount || 0) + tipAmount

  const paymentOptions: { id: PaymentMethod; label: string; icon: any; desc: string; bg: string }[] = [
    { id: "upi", label: "UPI / Mobile Pay", icon: Smartphone, desc: "GPay, PhonePe, Paytm, PayPal", bg: "from-purple-500 via-violet-500 to-indigo-600" },
    { id: "card", label: "Credit / Debit Card", icon: CreditCard, desc: "Visa, Mastercard, Amex, RuPay", bg: "from-blue-500 via-cyan-500 to-teal-600" },
    { id: "cash", label: "Pay with Cash", icon: Banknote, desc: "Settle with server at table", bg: "from-emerald-500 via-green-500 to-teal-600" },
  ]

  const validateCard = () => {
    if (!/^\d{13,19}$/.test(card.number)) { toast({ title: "Invalid card", description: "Enter a valid card number", variant: "warning" }); return false }
    if (card.name.length < 2) { toast({ title: "Cardholder required", description: "Enter the name on the card", variant: "warning" }); return false }
    if (!/^\d{2}\/\d{2}$/.test(card.expiry)) { toast({ title: "Invalid expiry", description: "Use MM/YY format", variant: "warning" }); return false }
    if (!/^\d{3,4}$/.test(card.cvc)) { toast({ title: "Invalid CVC", description: "Enter 3-4 digit code", variant: "warning" }); return false }
    return true
  }

  const validateUpi = () => {
    if (!upi.id.includes("@") || upi.id.length < 5) { toast({ title: "Invalid UPI ID", description: "e.g. name@upi", variant: "warning" }); return false }
    if (!/^\d{4,6}$/.test(upi.pin)) { toast({ title: "Invalid PIN", description: "Enter 4-6 digit UPI PIN", variant: "warning" }); return false }
    return true
  }

  const handlePay = async () => {
    if (method === "card" && !validateCard()) return
    if (method === "upi" && !validateUpi()) return
    try {
      setProcessing(true)
      await new Promise((r) => setTimeout(r, method === "cash" ? 1200 : 2200))
      const id = `TXN${Date.now().toString().slice(-10)}`
      setTxnId(id)
      setSuccess(true)
      toast({ title: method === "cash" ? "Bill request sent" : "Payment successful!", description: method === "cash" ? "Server will come for payment" : `Transaction ${id}`, variant: "success" })
    } catch (e: any) {
      toast({ title: "Payment failed", description: e?.message || "Try again", variant: "warning" })
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="h-16 w-16 rounded-3xl bg-gradient-primary flex items-center justify-center shadow-xl shadow-brand-500/20">
          <Loader2 className="h-8 w-8 text-white animate-spin" />
        </div>
        <p className="mt-5 text-muted-foreground font-medium">Loading bill…</p>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="h-24 w-24 rounded-3xl bg-red-50 flex items-center justify-center">
          <AlertCircle className="h-12 w-12 text-red-500" strokeWidth={1.5} />
        </div>
        <h2 className="mt-6 text-2xl font-black">Couldn't load bill</h2>
        <p className="mt-2 text-muted-foreground max-w-xs">{error || "Order not found."}</p>
        <div className="mt-6 flex gap-3">
          <Button variant="outline" onClick={() => navigate(-1)}>Go Back</Button>
          <Button onClick={() => navigate("/customer/menu")}>Back to Menu</Button>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", duration: 0.7 }}
          className="w-full max-w-lg"
        >
          <Card className="border-0 shadow-elevated overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 p-10 text-white text-center relative overflow-hidden">
              <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-white/10" />
              <div className="absolute -bottom-16 -right-10 w-56 h-56 rounded-full bg-white/10" />
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", delay: 0.2, stiffness: 200 }}
                className="relative z-10 mx-auto h-24 w-24 rounded-[2rem] bg-white/20 backdrop-blur-xl flex items-center justify-center border border-white/30 shadow-2xl"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.15, 1],
                  }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1.2 }}
                >
                  <PartyPopper className="h-12 w-12 text-white" strokeWidth={2} />
                </motion.div>
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="relative z-10 mt-6 text-3xl font-black"
              >
                {method === "cash" ? "Bill Notified!" : "Payment Successful!"}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="relative z-10 mt-2 text-white/90"
              >
                {method === "cash"
                  ? "Our server will arrive shortly to collect the payment."
                  : "Thank you! Your transaction has been completed securely."}
              </motion.p>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-muted/40 p-4">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Order</p>
                  <p className="mt-1 font-mono font-bold">{order.orderNumber}</p>
                </div>
                <div className="rounded-2xl bg-muted/40 p-4">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Amount</p>
                  <p className="mt-1 font-black text-xl gradient-text">{formatCurrency(grandTotal)}</p>
                </div>
              </div>
              {method !== "cash" && (
                <div className="rounded-2xl border border-border/60 p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Transaction ID</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="font-mono font-bold text-sm truncate">{txnId}</p>
                      <button
                        onClick={() => { navigator.clipboard?.writeText(txnId); toast({ title: "Copied!", variant: "info" }) }}
                        className="shrink-0 p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
              <div className="rounded-2xl bg-gradient-to-br from-brand-50 to-orange-50 border border-brand-100 p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-primary flex items-center justify-center shrink-0">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 text-sm">
                  <p className="font-bold">How was your experience?</p>
                  <p className="text-muted-foreground text-xs mt-0.5">Leave a quick review to help us improve!</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Button variant="outline" size="lg" onClick={() => navigate("/customer/menu")}>Back to Menu</Button>
                <Button
                  size="lg"
                  className="gap-2 shadow-xl shadow-brand-500/25"
                  onClick={() => navigate(`/customer/orders/${order.orderNumber}/rating`)}
                >
                  Rate Order
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-black tracking-tight">Complete Payment</h1>
          <div className="flex items-center gap-2 mt-0.5">
            <Badge variant="muted" className="font-mono text-[10px]">#{order.orderNumber}</Badge>
            <span className="text-xs text-muted-foreground">Table {order.tableNumber} • {order.restaurantName}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-5">
          <Card className="border-border/40">
            <div className="p-5">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-brand-500" /> Choose Payment Method
              </h3>
              <div className="grid gap-3">
                <AnimatePresence mode="popLayout">
                  {paymentOptions.map((m, i) => {
                    const Icon = m.icon
                    const selected = method === m.id
                    return (
                      <motion.button
                        key={m.id}
                        layout
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                        onClick={() => setMethod(m.id)}
                        className="w-full text-left"
                      >
                        <div
                          className={cn(
                            "relative p-4 rounded-2xl transition-all duration-300 border",
                            selected
                              ? "border-brand-200 bg-white shadow-lg shadow-brand-500/10 ring-2 ring-brand-500/20"
                              : "border-border/60 bg-white hover:border-border hover:bg-muted/20"
                          )}
                        >
                          <div className="flex items-center gap-4">
                            <div className={cn("h-12 w-12 rounded-xl bg-gradient-to-br shrink-0 flex items-center justify-center shadow-md", m.bg)}>
                              <Icon className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold">{m.label}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">{m.desc}</p>
                            </div>
                            <div className={cn(
                              "h-6 w-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                              selected ? "border-brand-500 bg-brand-500" : "border-muted-foreground/30"
                            )}>
                              {selected && <CheckCircle2 className="h-4 w-4 text-white" strokeWidth={3} />}
                            </div>
                          </div>
                        </div>
                      </motion.button>
                    )
                  })}
                </AnimatePresence>
              </div>
            </div>
          </Card>

          <AnimatePresence mode="wait">
            {method === "card" && (
              <motion.div
                key="card"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card className="border-border/40">
                  <div className="p-6 space-y-5">
                    <div className="aspect-[1.6/1] rounded-3xl bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 p-6 text-white relative overflow-hidden shadow-2xl">
                      <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-white/10" />
                      <div className="absolute -right-20 bottom-0 w-64 h-64 rounded-full bg-white/5" />
                      <div className="relative z-10 h-full flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-[11px] uppercase tracking-[0.2em] text-white/60 font-semibold">DineFlow Card</p>
                            <CreditCard className="h-7 w-7 mt-1 text-white/80" />
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-black tracking-wider">VISA</p>
                            <p className="text-[10px] text-white/60">Credit Card</p>
                          </div>
                        </div>
                        <p className="font-mono text-xl tracking-widest">
                          {card.number ? card.number.match(/.{1,4}/g)?.join(" ") || "•••• •••• •••• ••••" : "•••• •••• •••• ••••"}
                        </p>
                        <div className="flex justify-between items-end">
                          <div>
                            <p className="text-[10px] uppercase tracking-wider text-white/60">Cardholder</p>
                            <p className="font-semibold text-sm">{card.name || "YOUR NAME"}</p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase tracking-wider text-white/60">Expires</p>
                            <p className="font-semibold text-sm font-mono">{card.expiry || "MM/YY"}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm mb-1.5 block">Card Number</Label>
                      <Input
                        value={card.number}
                        onChange={(e) => setCard({ ...card, number: e.target.value.replace(/\D/g, "").slice(0, 19) })}
                        placeholder="1234 5678 9012 3456"
                        className="font-mono tracking-widest text-base h-12"
                      />
                    </div>
                    <div>
                      <Label className="text-sm mb-1.5 block">Name on Card</Label>
                      <Input value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value.toUpperCase() })} placeholder="JOHN SMITH" className="h-12" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm mb-1.5 block flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" /> Expiry Date
                        </Label>
                        <Input
                          value={card.expiry}
                          onChange={(e) => {
                            let v = e.target.value.replace(/\D/g, "").slice(0, 4)
                            if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2)
                            setCard({ ...card, expiry: v })
                          }}
                          placeholder="MM/YY"
                          className="font-mono text-base h-12"
                        />
                      </div>
                      <div>
                        <Label className="text-sm mb-1.5 block">CVC</Label>
                        <Input
                          value={card.cvc}
                          onChange={(e) => setCard({ ...card, cvc: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                          placeholder="•••"
                          className="font-mono text-base h-12"
                          type="password"
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {method === "upi" && (
              <motion.div
                key="upi"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card className="border-border/40">
                  <div className="p-6 space-y-5">
                    <div className="rounded-3xl bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50 border border-violet-100 p-6 flex items-center gap-5">
                      <div className="h-20 w-20 shrink-0 rounded-3xl bg-white shadow-xl shadow-violet-500/10 flex items-center justify-center">
                        <QrCode className="h-10 w-10 text-violet-600" strokeWidth={1.5} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-black text-lg">Scan & Pay</p>
                        <p className="text-sm text-muted-foreground mt-0.5">Scan QR with any UPI app. Or enter your UPI ID below.</p>
                        <Badge variant="default" className="mt-3 text-[10px] bg-gradient-primary text-white border-0 gap-1">
                          <Sparkles className="h-3 w-3" /> Instant • Secure
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm mb-1.5 block">UPI ID</Label>
                      <Input
                        value={upi.id}
                        onChange={(e) => setUpi({ ...upi, id: e.target.value.toLowerCase() })}
                        placeholder="yourname@upi / yourname@paytm"
                        className="h-12 font-mono"
                      />
                    </div>
                    <div>
                      <Label className="text-sm mb-1.5 block">UPI PIN</Label>
                      <Input
                        value={upi.pin}
                        onChange={(e) => setUpi({ ...upi, pin: e.target.value.replace(/\D/g, "").slice(0, 6) })}
                        placeholder="••••••"
                        type="password"
                        className="h-12 font-mono tracking-widest text-base"
                      />
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {["okicici@upi", "ybl@upi", "paytm@paytm", "axisbank@axis"].map((s) => (
                        <button
                          key={s}
                          onClick={() => setUpi({ ...upi, id: s })}
                          className="text-[11px] font-mono px-3 py-1.5 rounded-xl bg-muted hover:bg-brand-50 hover:text-brand-700 transition-colors border border-border/60"
                        >
                          @{s.split("@")[1]}
                        </button>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {method === "cash" && (
              <motion.div
                key="cash"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
              >
                <Card className="border-border/40">
                  <div className="p-8 text-center space-y-4">
                    <div className="h-24 w-24 rounded-[2rem] bg-gradient-to-br from-emerald-100 via-green-100 to-teal-100 flex items-center justify-center mx-auto">
                      <Banknote className="h-12 w-12 text-emerald-600" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black">Pay with Cash</h3>
                      <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
                        Clicking "Request Bill" will notify your server. They'll bring a card reader or accept cash at your table.
                      </p>
                    </div>
                    <div className="grid grid-cols-3 gap-3 max-w-md mx-auto pt-2">
                      <div className="rounded-2xl bg-muted/50 p-3">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Items</p>
                        <p className="font-black text-lg mt-0.5">{order.items.length}</p>
                      </div>
                      <div className="rounded-2xl bg-muted/50 p-3">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Table</p>
                        <p className="font-black text-lg mt-0.5">{order.tableNumber}</p>
                      </div>
                      <div className="rounded-2xl bg-muted/50 p-3">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">ETA</p>
                        <p className="font-black text-lg mt-0.5">2 min</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="lg:col-span-2 lg:sticky lg:top-24 lg:self-start space-y-5">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="shadow-elevated border-0 overflow-hidden">
              <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/60 font-bold">Order Summary</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Receipt className="h-4 w-4 text-white/60" />
                      <span className="text-white/70 text-xs font-mono">#{order.orderNumber}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-white/60 uppercase tracking-wider font-bold">Total Due</p>
                    <p className="font-black text-3xl mt-0.5">{formatCurrency(grandTotal)}</p>
                  </div>
                </div>
              </div>
              <div className="p-5 space-y-3">
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {order.items.map((it, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-xl bg-muted/30 p-2.5">
                      <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-brand-100 to-orange-50 flex items-center justify-center text-lg shrink-0">
                        {foodEmoji(it.menuItemName)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-xs truncate">{it.menuItemName}</p>
                        <p className="text-[10px] text-muted-foreground">Qty {it.quantity}</p>
                      </div>
                      <p className="font-bold text-xs shrink-0">{formatCurrency(it.subtotal)}</p>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border/60 pt-3 space-y-2 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="text-foreground font-semibold">{formatCurrency(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Tax (8%)</span>
                    <span className="text-foreground font-semibold">{formatCurrency(order.taxAmount)}</span>
                  </div>
                  <div className="pt-2">
                    <Label className="text-xs mb-2 block font-bold">Add a Tip</Label>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { id: 0 as const, label: "None" },
                        { id: Math.round(order.totalAmount * 0.1), label: "10%" },
                        { id: Math.round(order.totalAmount * 0.15), label: "15%" },
                        { id: "custom" as const, label: "Custom" },
                      ].map((opt) => (
                        <button
                          key={String(opt.id)}
                          onClick={() => setTip(opt.id)}
                          className={cn(
                            "py-2 rounded-xl text-xs font-bold transition-all",
                            tip === opt.id
                              ? "bg-gradient-primary text-white shadow-md shadow-brand-500/20"
                              : "bg-muted hover:bg-muted/70 text-foreground"
                          )}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                    {tip === "custom" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2"
                      >
                        <Input
                          value={customTip}
                          onChange={(e) => setCustomTip(e.target.value.replace(/[^0-9.]/g, "").slice(0, 6))}
                          placeholder="Enter tip amount"
                          className="h-10 font-mono text-sm"
                        />
                      </motion.div>
                    )}
                    {tipAmount > 0 && (
                      <div className="flex justify-between text-muted-foreground mt-2">
                        <span>Tip</span>
                        <span className="text-emerald-600 font-semibold">+{formatCurrency(tipAmount)}</span>
                      </div>
                    )}
                  </div>
                  <div className="border-t border-border/60 pt-3 flex justify-between items-center">
                    <span className="font-bold">Grand Total</span>
                    <span className="font-black text-2xl gradient-text">{formatCurrency(grandTotal)}</span>
                  </div>
                </div>
              </div>
              <div className="px-5 pb-5">
                <Button
                  size="xl"
                  className="w-full gap-2 shadow-xl shadow-brand-500/25"
                  onClick={handlePay}
                  disabled={processing}
                >
                  {processing ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      {method === "cash" ? "Notifying server..." : "Processing payment..."}
                    </>
                  ) : (
                    <>
                      <Shield className="h-4 w-4" />
                      {method === "cash" ? "Request Bill • " : `Pay ${formatCurrency(grandTotal)} • `}
                      {method === "cash" ? "Call Server" : method === "upi" ? "Pay via UPI" : "Pay with Card"}
                    </>
                  )}
                </Button>
                <div className="mt-3 rounded-xl bg-muted/40 p-3 flex items-center gap-2 text-[11px] text-muted-foreground">
                  <Shield className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                  <span>Secure payments encrypted with 256-bit SSL. DineFlow never stores card details.</span>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
