import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { Table, MapPin, Clock, Star, ArrowRight, Sparkles, Loader2, WifiIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

export default function Welcome() {
  const { tableId } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(t)
  }, [])

  const tableNum = (tableId || "A1").split("-")[1] || "1"
  const section = (tableId || "A1").split("-")[0]?.replace("TABLE", "Zone ") || "Zone A"

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-brand-50 to-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-brand-500" />
          <p className="text-muted-foreground font-medium">Connecting to your table...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 via-white to-white">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-br from-brand-200/40 to-transparent rounded-full blur-3xl -top-40 pointer-events-none" />

      <div className="relative mx-auto max-w-md px-6 pt-12 pb-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="h-28 w-28 rounded-3xl bg-gradient-primary flex items-center justify-center shadow-2xl shadow-brand-500/30 rotate-3">
                <Table className="h-14 w-14 text-white" strokeWidth={2} />
              </div>
              <div className="absolute -top-3 -right-3 h-11 w-11 rounded-2xl bg-white shadow-xl shadow-brand-500/10 flex items-center justify-center -rotate-6 border border-border/40">
                <Sparkles className="h-5 w-5 text-brand-500" />
              </div>
            </div>
          </div>

          <div className="text-center mb-8">
            <Badge variant="muted" className="mb-3 px-4 py-1">
              <WifiIcon className="h-3 w-3 mr-1.5" />
              Table Connected
            </Badge>
            <h1 className="text-4xl font-black tracking-tight mb-2">Welcome!</h1>
            <p className="text-lg text-muted-foreground">Thanks for dining with us today</p>
          </div>

          <Card className="shadow-elevated border-0 overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-brand-500 via-brand-500 to-orange-500 p-6 text-white">
              <p className="text-white/80 text-sm font-medium">You are at</p>
              <p className="text-3xl font-black mt-1">Table {tableNum}</p>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-1.5 text-white/80">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm font-medium">{section}</span>
                </div>
                <div className="flex items-center gap-1.5 text-white/80">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="text-sm font-medium">4.9 (2.1k reviews)</span>
                </div>
              </div>
            </div>
            <div className="p-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-muted/40 p-3">
                <p className="text-xs text-muted-foreground font-medium">Seats</p>
                <p className="text-xl font-bold mt-0.5">4 Persons</p>
              </div>
              <div className="rounded-xl bg-muted/40 p-3">
                <p className="text-xs text-muted-foreground font-medium">Wait Time</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Clock className="h-4 w-4 text-brand-500" />
                  <p className="text-xl font-bold">10 min</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="border border-brand-100 bg-brand-50/50 shadow-soft mb-8 overflow-hidden">
            <div className="p-5">
              <h3 className="font-bold text-base mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-brand-500" />
                Today's Specials
              </h3>
              <ul className="space-y-2 text-sm">
                {[
                  "🔥 20% off Signature Dishes",
                  "🥤 Free drink with main course",
                  "🍰 Complimentary dessert for orders over $30",
                ].map((s, i) => (
                  <motion.li
                    key={s}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex items-start gap-2 text-foreground/80"
                  >
                    <span>{s}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </Card>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Button
              size="xl"
              className="w-full gap-2 shadow-2xl shadow-brand-500/30"
              onClick={() => navigate("/customer/menu")}
            >
              Browse Menu & Start Ordering
              <ArrowRight className="h-5 w-5" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
