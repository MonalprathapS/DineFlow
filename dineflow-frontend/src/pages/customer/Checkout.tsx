import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  CreditCard, MapPin, CheckCircle2, Shield, Clock, UtensilsCrossed,
  Banknote, Smartphone, Building2, ArrowRight, ChevronLeft, Calendar,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { useCart } from "@/context/CartContext"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/components/ui/toast"
import { formatCurrency } from "@/lib/utils"
import type { CartItem } from "@/types"

type PaymentMethod = "card" | "cash" | "upi" | "apple"

export default function Checkout() {
  const navigate = useNavigate()
  const { cart, totalItems, totalPrice, items, clearCart } = useCart()
  const { user } = useAuth()
  const { toast } = useToast()
  const [method, setMethod] = useState<PaymentMethod>("card")
  const [step, setStep] = useState(1)
  const [processing, setProcessing] = useState(false)
  const [address, setAddress] = useState({ name: user?.name || "", phone: user?.phone || "", special: "" })
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvc: "" })

  const discount = 0
  const tax = (totalPrice - discount) * 0.08
  const serviceFee = Math.min(5, totalPrice * 0.05)
  const grandTotal = totalPrice - discount + tax + serviceFee

  const paymentMethods: { id: PaymentMethod; label: string; icon: any; desc: string; bg: string }[] = [
    { id: "card", label: "Credit / Debit Card", icon: CreditCard, desc: "Visa, Mastercard, Amex", bg: "from-blue-500 to-indigo-600" },
    { id: "apple", label: "Apple Pay", icon: Smartphone, desc: "Quick and secure", bg: "from-slate-700 to-slate-900" },
    { id: "upi", label: "UPI / Mobile Pay", icon: Building2, desc: "PayPal, Google Pay, etc", bg: "from-purple-500 to-violet-600" },
    { id: "cash", label: "Pay at Table", icon: Banknote, desc: "Cash or Card on delivery", bg: "from-green-500 to-emerald-600" },
  ]

  const handlePlaceOrder = () => {
    setProcessing(true)
    setTimeout(() => {
      setProcessing(false)
      clearCart()
      toast({ title: "Order placed!", description: `Order #DF-${Math.floor(Math.random() * 90000 + 10000)} confirmed`, variant: "success" })
      navigate(`/customer/orders/DF${Math.floor(Math.random() * 90000 + 10000)}/tracking`)
    }, 2500)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-black tracking-tight">Checkout</h1>
          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
            <Badge variant="muted">Step {step}/3</Badge>
            <span className="font-medium">{step === 1 ? "Review order details" : step === 2 ? "Choose payment method" : "Complete payment"}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {[1, 2, 3].map((s, i) => (
          <div key={s} className="flex-1 flex items-center gap-2">
            <div className={`h-9 w-9 rounded-xl flex items-center justify-center font-bold text-sm transition-all ${
              s <= step ? "bg-gradient-primary text-white shadow-lg shadow-brand-500/20" : "bg-muted text-muted-foreground"
            }`}>
              {s < step ? <CheckCircle2 className="h-5 w-5" /> : s}
            </div>
            {i < 2 && <div className={`flex-1 h-1 rounded-full transition-all ${s < step ? "bg-gradient-primary" : "bg-muted"}`} />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
              <Card>
                <div className="p-5 space-y-4">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <UtensilsCrossed className="h-5 w-5 text-brand-500" /> Contact Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm mb-1.5 block">Full Name</Label>
                      <Input value={address.name} onChange={(e) => setAddress({ ...address, name: e.target.value })} />
                    </div>
                    <div>
                      <Label className="text-sm mb-1.5 block">Phone Number</Label>
                      <Input value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} placeholder="+1 (555) 000-0000" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm mb-1.5 block">Special Instructions for Kitchen</Label>
                    <Input value={address.special} onChange={(e) => setAddress({ ...address, special: e.target.value })} placeholder="e.g., No onions, extra sauce..." />
                  </div>
                </div>
              </Card>

              <Card>
                <div className="p-5 space-y-4">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-brand-500" /> Table & Delivery
                  </h3>
                  <div className="flex items-start gap-4 rounded-2xl bg-gradient-to-br from-brand-50 to-orange-50 p-4 border border-brand-100">
                    <div className="h-12 w-12 shrink-0 rounded-xl bg-gradient-primary flex items-center justify-center shadow-lg shadow-brand-500/20">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-bold">Table A7 - Main Dining</p>
                        <Badge variant="default" className="text-[9px] px-1.5 py-0">Verified</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">Served to your table by staff • Wait time: ~15 min</p>
                    </div>
                    <CheckCircle2 className="h-5 w-5 text-success-500 shrink-0" />
                  </div>
                </div>
              </Card>

              <Card>
                <div className="p-5 space-y-4">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <Clock className="h-5 w-5 text-brand-500" /> Order Preview ({items.length} items)
                  </h3>
                  <div className="space-y-2">
                    {items.map((ci: CartItem, i: number) => (
                      <div key={i} className="flex items-center gap-3 rounded-xl bg-muted/30 p-3">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-brand-100 to-orange-50 flex items-center justify-center text-xl">
                          🥘
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm truncate">{ci.menuItemName}</p>
                          <p className="text-xs text-muted-foreground">Qty {ci.quantity}</p>
                        </div>
                        <p className="font-bold text-sm">{formatCurrency(ci.subtotal)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-brand-500" /> Choose Payment Method
              </h3>
              <div className="grid gap-3">
                {paymentMethods.map((m, i) => {
                  const Icon = m.icon
                  const selected = method === m.id
                  return (
                    <motion.button
                      key={m.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => setMethod(m.id)}
                      className={`w-full text-left`}
                    >
                      <Card className={`card-hover p-4 transition-all ${selected ? "ring-2 ring-brand-500 border-brand-200" : ""}`}>
                        <div className="flex items-center gap-4">
                          <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${m.bg} flex items-center justify-center shadow-md shrink-0`}>
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="font-bold">{m.label}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{m.desc}</p>
                          </div>
                          <div className={`h-6 w-6 rounded-full border-2 transition-all flex items-center justify-center ${
                            selected ? "border-brand-500 bg-brand-500" : "border-muted-foreground/30"
                          }`}>
                            {selected && <div className="h-2.5 w-2.5 rounded-full bg-white" />}
                          </div>
                        </div>
                      </Card>
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>
          )}

          {step === 3 && method === "card" && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <Card>
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
                      onChange={(e) => setCard({ ...card, number: e.target.value.replace(/\D/g, "").slice(0, 16) })}
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

          {step === 3 && method !== "card" && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <Card>
                <div className="p-8 text-center">
                  <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-success-100 to-green-100 flex items-center justify-center mx-auto mb-5">
                    <Shield className="h-10 w-10 text-success-600" />
                  </div>
                  <h3 className="text-xl font-black">
                    {method === "cash" ? "Pay when served" : method === "upi" ? "Complete Mobile Payment" : "Apple Pay Ready"}
                  </h3>
                  <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
                    {method === "cash"
                      ? "You'll be prompted to pay when your order is delivered to the table. Cash and card accepted."
                      : method === "upi"
                      ? "You'll be redirected to your preferred payment provider after confirming your order."
                      : "Use Touch ID or Face ID at confirmation to complete your payment instantly."}
                  </p>
                  <Badge variant="success" className="mt-5 px-4 py-1.5 gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Method verified & ready
                  </Badge>
                </div>
              </Card>
            </motion.div>
          )}

          <div className="flex items-center gap-3 justify-between">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" /> Back
            </Button>
            {step < 3 ? (
              <Button size="lg" className="gap-2" onClick={() => setStep(step + 1)}>
                Continue <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button size="lg" className="gap-2 shadow-xl shadow-brand-500/25" onClick={handlePlaceOrder} disabled={processing}>
                {processing ? (
                  <>
                    <div className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4" />
                    Place Order • {formatCurrency(grandTotal)}
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="shadow-elevated border-0 overflow-hidden">
              <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
                <p className="text-xs uppercase tracking-wider text-white/60 font-semibold mb-1">Order Total</p>
                <p className="font-black text-4xl">{formatCurrency(grandTotal)}</p>
              </div>
              <div className="p-5 space-y-3 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal ({totalItems} items)</span>
                  <span className="text-foreground font-semibold">{formatCurrency(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Service Fee</span>
                  <span className="text-foreground font-semibold">{serviceFee === 0 ? "FREE" : formatCurrency(serviceFee)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax</span>
                  <span className="text-foreground font-semibold">{formatCurrency(tax)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Discount</span>
                  <span className="text-success-600 font-semibold">${discount.toFixed(2)}</span>
                </div>
                <div className="border-t border-border/60 pt-3 flex justify-between">
                  <span className="font-bold">You Pay</span>
                  <span className="font-black text-2xl gradient-text">{formatCurrency(grandTotal)}</span>
                </div>
                <div className="rounded-xl bg-brand-50 border border-brand-200 p-3 flex items-center gap-2 text-xs text-brand-700 font-medium">
                  <Shield className="h-4 w-4 shrink-0" />
                  256-bit SSL encryption. Your data is safe.
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
