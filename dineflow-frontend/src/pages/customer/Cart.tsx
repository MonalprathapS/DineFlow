import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ShoppingCart, Plus, Minus, Trash2, ArrowRight, Sparkles, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"
import { useCart } from "@/context/CartContext"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/components/ui/toast"
import { formatCurrency } from "@/lib/utils"
import type { CartItem } from "@/types"

export default function Cart() {
  const navigate = useNavigate()
  const { cart, items, totalItems, totalPrice, updateItem, removeItem, clearCart } = useCart()
  const { isAuthenticated } = useAuth()
  const { toast } = useToast()
  const [note, setNote] = useState("")
  const [promoCode, setPromoCode] = useState("")
  const [promoApplied, setPromoApplied] = useState(false)

  const foodEmoji = (cid: number) =>
    cid === 1 ? "🥗" : cid === 2 ? "🍖" : cid === 3 ? "🍕" : cid === 4 ? "🍔" : cid === 5 ? "🥤" : "🍰"

  const discount = promoApplied ? totalPrice * 0.2 : 0
  const tax = (totalPrice - discount) * 0.08
  const deliveryFee = 0
  const grandTotal = totalPrice - discount + tax + deliveryFee

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="relative"
        >
          <div className="h-32 w-32 rounded-[2.5rem] bg-gradient-to-br from-brand-100 to-orange-100 flex items-center justify-center">
            <ShoppingBag className="h-16 w-16 text-brand-500" strokeWidth={1.5} />
          </div>
          <div className="absolute -top-2 -right-2 h-11 w-11 rounded-2xl bg-white shadow-lg shadow-brand-500/10 flex items-center justify-center border border-border/40">
            <Sparkles className="h-5 w-5 text-brand-500" />
          </div>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 text-2xl font-black"
        >
          Your cart is empty
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-2 text-muted-foreground max-w-xs"
        >
          Browse the menu and add delicious items to get started on your meal!
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button size="lg" className="mt-8 gap-2 shadow-lg shadow-brand-500/25" onClick={() => navigate("/customer/menu")}>
            <ShoppingCart className="h-5 w-5" />
            Browse Menu
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Your Cart</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{totalItems} item{totalItems !== 1 ? "s" : ""} ready for checkout</p>
        </div>
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive gap-1.5" onClick={() => { clearCart(); toast({ title: "Cart cleared" }) }}>
          <Trash2 className="h-4 w-4" />
          Clear All
        </Button>
      </div>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {items.map((ci: CartItem, idx: number) => (
              <motion.div
                key={`${ci.menuItemId}-${idx}`}
                layout
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50, height: 0 }}
              >
                <Card className="card-hover overflow-hidden border-border/40">
                  <div className="flex gap-4 p-4">
                    <div className="w-20 h-20 shrink-0 rounded-xl bg-gradient-to-br from-brand-100 to-orange-50 flex items-center justify-center text-4xl">
                      🥘
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold truncate">{ci.menuItemName}</h3>
                        <button
                          onClick={() => { removeItem(ci.id); toast({ title: "Removed", description: ci.menuItemName + " removed", variant: "info" }) }}
                          className="shrink-0 p-1.5 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge variant="muted" className="text-[9px] px-1.5 py-0">Qty {ci.quantity}</Badge>
                      </div>
                      <div className="mt-auto pt-2 flex items-center justify-between">
                        <span className="font-bold text-lg">{formatCurrency(ci.unitPrice)}</span>
                        <div className="flex items-center gap-0.5 bg-muted rounded-lg p-1">
                          <button
                            onClick={() => ci.quantity <= 1 ? removeItem(ci.id) : updateItem(ci.id, { quantity: ci.quantity - 1 })}
                            className="h-7 w-7 rounded-md hover:bg-white transition-colors flex items-center justify-center"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm font-bold">{ci.quantity}</span>
                          <button
                            onClick={() => updateItem(ci.id, { quantity: ci.quantity + 1 })}
                            className="h-7 w-7 rounded-md hover:bg-white transition-colors flex items-center justify-center"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <Card>
        <div className="p-5 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs mb-1.5 block">Promo Code</Label>
              <div className="flex gap-2">
                <Input
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  placeholder="WELCOME20"
                  className="h-10 font-mono uppercase tracking-widest text-sm"
                />
                <Button
                  variant="outline"
                  onClick={() => {
                    if (promoCode === "WELCOME20") {
                      setPromoApplied(true)
                      toast({ title: "Promo applied!", description: "20% off - Enjoy!", variant: "success" })
                    } else if (promoCode) {
                      toast({ title: "Invalid code", description: "Try WELCOME20", variant: "warning" })
                    }
                  }}
                >
                  Apply
                </Button>
              </div>
            </div>
            <div>
              <Label className="text-xs mb-1.5 block">Special Instructions</Label>
              <Input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Allergies, spice level..."
                className="h-10"
              />
            </div>
          </div>
        </div>
      </Card>

      <Card className="shadow-elevated border-0 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-400" /> Order Summary
          </h3>
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between text-white/80">
              <span>Subtotal</span>
              <span className="font-semibold">{formatCurrency(totalPrice)}</span>
            </div>
            {promoApplied && (
              <div className="flex justify-between text-success-400">
                <span className="flex items-center gap-1">
                  <Badge variant="success" className="text-[9px] bg-success-500/20 text-success-300 border-0">WELCOME20</Badge>
                  Promo Discount (20%)
                </span>
                <span className="font-bold">-{formatCurrency(discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-white/80">
              <span>Tax (8%)</span>
              <span className="font-semibold">{formatCurrency(tax)}</span>
            </div>
            <div className="flex justify-between text-white/80">
              <span>Service Fee</span>
              <span className="font-semibold">{deliveryFee === 0 ? "FREE" : formatCurrency(deliveryFee)}</span>
            </div>
            <div className="border-t border-white/10 my-3" />
            <div className="flex justify-between items-center">
              <span className="font-bold text-base">Grand Total</span>
              <span className="font-black text-3xl gradient-text bg-gradient-to-r from-white to-amber-200 bg-clip-text text-transparent">
                {formatCurrency(grandTotal)}
              </span>
            </div>
          </div>
        </div>
        <div className="p-5">
          <Button
            size="xl"
            className="w-full gap-2 shadow-xl shadow-brand-500/25"
            onClick={() => {
              if (!isAuthenticated) {
                toast({ title: "Login required", description: "Sign in to checkout your order", variant: "warning" })
                setTimeout(() => navigate("/customer/login"), 800)
              } else {
                navigate("/customer/checkout")
              }
            }}
          >
            Proceed to Checkout
            <ArrowRight className="h-5 w-5" />
          </Button>
          <p className="text-center text-xs text-muted-foreground mt-3">
            🔒 Secure checkout • Your payment info is encrypted
          </p>
        </div>
      </Card>
    </div>
  )
}
