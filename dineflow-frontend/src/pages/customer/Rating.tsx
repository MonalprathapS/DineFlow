import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  ChevronLeft, Star, ChefHat, UtensilsCrossed, Music,
  ThumbsUp, ThumbsDown, Send, CheckCircle2, Loader2,
  Sparkles, PartyPopper, AlertCircle, Heart, MessageSquare,
  Home, DollarSign
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/components/ui/toast"
import { orderApi, feedbackApi } from "@/api/orders"
import { formatCurrency, cn } from "@/lib/utils"
import type { Order } from "@/types"

type SubRatingKey = "foodQualityRating" | "serviceRating" | "ambienceRating" | "valueRating"

const subRatingMeta: { key: SubRatingKey; label: string; icon: any; color: string; tip: string }[] = [
  { key: "foodQualityRating", label: "Food Quality", icon: ChefHat, color: "from-orange-500 to-amber-500", tip: "Taste, freshness, presentation" },
  { key: "serviceRating", label: "Service", icon: UtensilsCrossed, color: "from-blue-500 to-cyan-500", tip: "Staff, speed, attentiveness" },
  { key: "ambienceRating", label: "Ambience", icon: Music, color: "from-purple-500 to-violet-500", tip: "Vibe, decor, music, comfort" },
  { key: "valueRating", label: "Value", icon: DollarSign, color: "from-emerald-500 to-teal-500", tip: "Portions, pricing, worth it" },
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
  status: "COMPLETED",
  orderType: "DINE_IN",
  paymentStatus: "PAID",
  subtotal: 72.95,
  taxAmount: 5.84,
  totalAmount: 78.79,
  items: [
    { id: 1, menuItemId: 3, menuItemName: "Signature Ribeye", quantity: 1, unitPrice: 38.99, subtotal: 38.99, status: "SERVED" },
    { id: 2, menuItemId: 6, menuItemName: "Quattro Formaggi", quantity: 1, unitPrice: 19.99, subtotal: 19.99, status: "SERVED" },
    { id: 3, menuItemId: 9, menuItemName: "Fresh Lemonade", quantity: 2, unitPrice: 5.99, subtotal: 11.98, status: "SERVED" },
    { id: 4, menuItemId: 11, menuItemName: "Tiramisu", quantity: 1, unitPrice: 10.99, subtotal: 10.99, status: "SERVED" },
  ],
  createdAt: new Date().toISOString(),
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

const ratingCopy: Record<number, { label: string; emoji: string; color: string }> = {
  1: { label: "Terrible", emoji: "😞", color: "text-red-500" },
  2: { label: "Poor", emoji: "😕", color: "text-orange-500" },
  3: { label: "Okay", emoji: "🙂", color: "text-amber-500" },
  4: { label: "Great", emoji: "😄", color: "text-emerald-500" },
  5: { label: "Amazing!", emoji: "🤩", color: "text-brand-500" },
}

export default function Rating() {
  const navigate = useNavigate()
  const { orderNumber } = useParams<{ orderNumber: string }>()
  const { user } = useAuth()
  const { toast } = useToast()

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [subRatings, setSubRatings] = useState<Record<SubRatingKey, number>>({
    foodQualityRating: 0,
    serviceRating: 0,
    ambienceRating: 0,
    valueRating: 0,
  })
  const [review, setReview] = useState("")
  const [wouldRecommend, setWouldRecommend] = useState<boolean | null>(null)
  const [tags, setTags] = useState<string[]>([])

  const availableTags = [
    { id: "quick", label: "⚡ Quick Service" },
    { id: "fresh", label: "🌿 Fresh" },
    { id: "generous", label: "🍽️ Generous Portions" },
    { id: "vibe", label: "🎶 Great Vibe" },
    { id: "friendly", label: "😊 Friendly Staff" },
    { id: "clean", label: "✨ Clean" },
    { id: "value", label: "💰 Great Value" },
    { id: "flavor", label: "🔥 Full of Flavor" },
  ]

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const demo = { ...mockOrder, orderNumber: orderNumber || mockOrder.orderNumber }
        setOrder(demo)
      } catch (e: any) {
        setError(e?.message || "Failed to load order")
      } finally {
        setTimeout(() => setLoading(false), 400)
      }
    }
    load()
  }, [orderNumber])

  const overallAvg = rating > 0 ? rating : (
    Object.values(subRatings).every((v) => v === 0)
      ? 0
      : Math.round(
          Object.values(subRatings).reduce((a, b) => a + b, 0) /
            Math.max(1, Object.values(subRatings).filter((v) => v > 0).length)
        )
  )

  const canSubmit = rating > 0 && !submitting

  const handleSubmit = async () => {
    if (!canSubmit || !order) return
    try {
      setSubmitting(true)
      await new Promise((r) => setTimeout(r, 1500))
      setSubmitted(true)
      toast({ title: "Thanks for your review!", description: "Your feedback helps us improve 💙", variant: "success" })
    } catch (e: any) {
      toast({ title: "Submission failed", description: e?.message || "Try again", variant: "warning" })
    } finally {
      setSubmitting(false)
    }
  }

  const toggleTag = (id: string) => {
    setTags((t) => (t.includes(id) ? t.filter((x) => x !== id) : [...t, id]))
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="h-16 w-16 rounded-3xl bg-gradient-primary flex items-center justify-center shadow-xl shadow-brand-500/20">
          <Loader2 className="h-8 w-8 text-white animate-spin" />
        </div>
        <p className="mt-5 text-muted-foreground font-medium">Loading order…</p>
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
          <Button onClick={() => navigate("/customer/menu")}>Back to Menu</Button>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", duration: 0.7 }}
          className="w-full max-w-lg text-center"
        >
          <Card className="border-0 shadow-elevated overflow-hidden">
            <div className="bg-gradient-to-r from-brand-500 via-orange-400 to-pink-500 p-10 text-white relative overflow-hidden">
              <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-white/10" />
              <div className="absolute -bottom-16 -right-10 w-56 h-56 rounded-full bg-white/10" />
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", delay: 0.2, stiffness: 200 }}
                className="relative z-10 mx-auto h-24 w-24 rounded-[2rem] bg-white/20 backdrop-blur-xl flex items-center justify-center border border-white/30 shadow-2xl"
              >
                <motion.div
                  animate={{ scale: [1, 1.15, 1] }}
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
                Thank you, {user?.name?.split(" ")[0] || "Friend"}!
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="relative z-10 mt-2 text-white/90"
              >
                Your feedback makes every meal better.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="relative z-10 mt-6 inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/25 px-5 py-2.5 rounded-2xl"
              >
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={cn("h-5 w-5 transition-all", i <= rating ? "text-amber-300 fill-current" : "text-white/30")}
                  />
                ))}
                <span className="font-black ml-1">{rating}.0</span>
              </motion.div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-muted/40 p-4">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Order</p>
                  <p className="mt-1 font-mono font-bold">{order.orderNumber}</p>
                </div>
                <div className="rounded-2xl bg-muted/40 p-4">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Items Reviewed</p>
                  <p className="mt-1 font-black text-xl">{order.items.length}</p>
                </div>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-brand-50 to-orange-50 border border-brand-100 p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-primary flex items-center justify-center shrink-0">
                  <Heart className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 text-sm text-left">
                  <p className="font-bold">Earned 50 loyalty points!</p>
                  <p className="text-muted-foreground text-xs mt-0.5">Use them on your next visit.</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Button variant="outline" size="lg" className="gap-2" onClick={() => navigate("/customer/menu")}>
                  <Home className="h-4 w-4" /> Home
                </Button>
                <Button
                  size="lg"
                  className="gap-2 shadow-xl shadow-brand-500/25"
                  onClick={() => toast({ title: "Review shared!", variant: "success" })}
                >
                  <Sparkles className="h-4 w-4" /> Share Review
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="space-y-5 pb-32">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-black tracking-tight">Rate Your Experience</h1>
          <div className="flex items-center gap-2 mt-0.5">
            <Badge variant="muted" className="font-mono text-[10px]">#{order.orderNumber}</Badge>
            <span className="text-xs text-muted-foreground">{order.restaurantName} • Table {order.tableNumber}</span>
          </div>
        </div>
      </div>

      <Card className="shadow-elevated border-0 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-8 text-white text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full text-xs font-semibold mb-6"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            Your Feedback Matters
          </motion.div>
          <h2 className="text-3xl font-black">How was your meal?</h2>
          <p className="text-white/70 mt-2 max-w-md mx-auto">
            Tap a star to rate your overall experience. This helps us serve you better.
          </p>

          <div className="mt-7">
            <div className="inline-flex items-center gap-1.5 p-3 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10">
              {[1, 2, 3, 4, 5].map((i) => {
                const active = (hoverRating || rating) >= i
                return (
                  <button
                    key={i}
                    onClick={() => setRating(i)}
                    onMouseEnter={() => setHoverRating(i)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="group focus:outline-none"
                  >
                    <motion.div
                      whileTap={{ scale: 0.85 }}
                      whileHover={{ scale: 1.15 }}
                      transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    >
                      <Star
                        className={cn(
                          "h-12 w-12 transition-all duration-200",
                          active
                            ? "text-amber-400 fill-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.55)]"
                            : "text-white/25 group-hover:text-white/40"
                        )}
                        strokeWidth={active ? 0 : 2}
                      />
                    </motion.div>
                  </button>
                )
              })}
            </div>

            <AnimatePresence mode="wait">
              {(hoverRating || rating) > 0 && (
                <motion.div
                  key={hoverRating || rating}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-4 flex items-center justify-center gap-2"
                >
                  <span className="text-3xl">{ratingCopy[hoverRating || rating].emoji}</span>
                  <span className={cn("font-black text-xl", ratingCopy[hoverRating || rating].color)}>
                    {ratingCopy[hoverRating || rating].label}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Card>

      <Card className="border-border/40">
        <div className="p-5">
          <h3 className="font-bold text-lg flex items-center gap-2 mb-5">
            <Sparkles className="h-5 w-5 text-brand-500" /> Breakdown Ratings
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AnimatePresence>
              {subRatingMeta.map((m, idx) => {
                const Icon = m.icon
                const val = subRatings[m.key]
                return (
                  <motion.div
                    key={m.key}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.06 }}
                  >
                    <div className="rounded-2xl border border-border/60 p-4 bg-gradient-to-br from-white to-muted/20 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={cn("h-10 w-10 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-md shrink-0", m.color)}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-sm">{m.label}</p>
                          <p className="text-[10px] text-muted-foreground">{m.tip}</p>
                        </div>
                        <span className={cn("font-black text-lg", val > 0 ? ratingCopy[val]?.color || "text-brand-500" : "text-muted-foreground/50")}>
                          {val || "—"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <button
                            key={i}
                            onClick={() =>
                              setSubRatings((s) => ({ ...s, [m.key]: s[m.key] === i ? 0 : i }))
                            }
                            className="flex-1 py-2 rounded-lg transition-all hover:scale-105 focus:outline-none"
                          >
                            <Star
                              className={cn(
                                "h-5 w-5 mx-auto transition-colors",
                                i <= val ? "text-amber-400 fill-amber-400" : "text-muted-foreground/25 hover:text-amber-300/60"
                              )}
                              strokeWidth={i <= val ? 0 : 2}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </div>
      </Card>

      <Card className="border-border/40">
        <div className="p-5">
          <h3 className="font-bold text-lg flex items-center gap-2 mb-4">
            <MessageSquare className="h-5 w-5 text-brand-500" /> Your Review
          </h3>
          <div>
            <Label className="text-sm mb-1.5 block">Tell us more (optional)</Label>
            <Textarea
              value={review}
              onChange={(e) => setReview(e.target.value.slice(0, 500))}
              placeholder="What stood out? Any suggestions? Your server's name? Favorite dish?"
              className="min-h-[120px] resize-none rounded-2xl text-base"
            />
            <div className="flex justify-between mt-1.5 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> Specifics help us improve
              </span>
              <span className="font-mono">{review.length}/500</span>
            </div>
          </div>

          <div className="mt-5">
            <Label className="text-sm mb-2 block font-semibold">Quick Tags</Label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((t) => {
                const sel = tags.includes(t.id)
                return (
                  <motion.button
                    key={t.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleTag(t.id)}
                    className={cn(
                      "px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border",
                      sel
                        ? "bg-gradient-primary text-white border-transparent shadow-md shadow-brand-500/20"
                        : "bg-muted/40 text-foreground border-border/60 hover:bg-muted"
                    )}
                  >
                    {t.label}
                  </motion.button>
                )
              })}
            </div>
          </div>
        </div>
      </Card>

      <Card className="border-border/40">
        <div className="p-5">
          <h3 className="font-bold text-lg flex items-center gap-2 mb-4">
            <ThumbsUp className="h-5 w-5 text-brand-500" /> Would you recommend us?
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => setWouldRecommend(true)}
              className={cn(
                "p-5 rounded-2xl border-2 transition-all text-left",
                wouldRecommend === true
                  ? "bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-300 ring-4 ring-emerald-100"
                  : "bg-white border-border/60 hover:border-emerald-200 hover:bg-emerald-50/40"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "h-12 w-12 rounded-xl flex items-center justify-center shrink-0 transition-all",
                  wouldRecommend === true ? "bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/25" : "bg-muted"
                )}>
                  <ThumbsUp className={cn("h-6 w-6", wouldRecommend === true ? "text-white" : "text-muted-foreground")} />
                </div>
                <div>
                  <p className={cn("font-black", wouldRecommend === true ? "text-emerald-700" : "text-foreground")}>Yes, definitely</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">To friends & family</p>
                </div>
              </div>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => setWouldRecommend(false)}
              className={cn(
                "p-5 rounded-2xl border-2 transition-all text-left",
                wouldRecommend === false
                  ? "bg-gradient-to-br from-rose-50 to-red-50 border-rose-300 ring-4 ring-rose-100"
                  : "bg-white border-border/60 hover:border-rose-200 hover:bg-rose-50/40"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "h-12 w-12 rounded-xl flex items-center justify-center shrink-0 transition-all",
                  wouldRecommend === false ? "bg-gradient-to-br from-rose-500 to-red-500 shadow-lg shadow-rose-500/25" : "bg-muted"
                )}>
                  <ThumbsDown className={cn("h-6 w-6", wouldRecommend === false ? "text-white" : "text-muted-foreground")} />
                </div>
                <div>
                  <p className={cn("font-black", wouldRecommend === false ? "text-rose-700" : "text-foreground")}>Not yet</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Room to improve</p>
                </div>
              </div>
            </motion.button>
          </div>
        </div>
      </Card>

      <Card className="border-border/40">
        <div className="p-5">
          <h3 className="font-bold text-lg flex items-center justify-between mb-4">
            <span className="flex items-center gap-2">
              <UtensilsCrossed className="h-5 w-5 text-brand-500" /> Items You Ordered
            </span>
            <Badge variant="muted" className="text-[10px]">{order.items.length} items</Badge>
          </h3>
          <div className="space-y-2">
            {order.items.map((it) => (
              <div key={it.id} className="flex items-center gap-3 rounded-xl bg-muted/30 p-3">
                <div className="w-11 h-11 shrink-0 rounded-xl bg-gradient-to-br from-brand-100 to-orange-50 flex items-center justify-center text-2xl">
                  {foodEmoji(it.menuItemName)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{it.menuItemName}</p>
                  <p className="text-[11px] text-muted-foreground">Qty {it.quantity} • {formatCurrency(it.subtotal)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="fixed bottom-4 left-4 right-4 mx-auto max-w-3xl z-30">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-0 shadow-elevated overflow-hidden">
            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
              <div className="h-14 w-14 shrink-0 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center">
                <div className="flex -space-x-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className={cn("h-4 w-4", i <= overallAvg ? "text-amber-400 fill-amber-400" : "text-white/20")}
                      strokeWidth={i <= overallAvg ? 0 : 1.5}
                    />
                  ))}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-white font-bold">Overall Score</p>
                  {overallAvg > 0 && (
                    <Badge variant="success" className="text-[9px] bg-emerald-500/20 text-emerald-300 border-0 gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Ready
                    </Badge>
                  )}
                </div>
                <p className="text-white/60 text-xs mt-0.5">
                  {rating === 0 ? "Select at least 1 star to submit" : `You rated ${rating}/5 • ${tags.length} tag${tags.length !== 1 ? "s" : ""}${review.length ? ` • ${review.length} chars` : ""}`}
                </p>
              </div>
              <Button
                size="lg"
                className="gap-2 shrink-0 shadow-xl shadow-brand-500/25"
                disabled={!canSubmit || submitting}
                onClick={handleSubmit}
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting…
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Submit Review
                  </>
                )}
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
