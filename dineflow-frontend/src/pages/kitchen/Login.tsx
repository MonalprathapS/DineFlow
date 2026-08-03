import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mail, Lock, ArrowRight, ChefHat, ArrowLeft, Flame } from "lucide-react"
import { motion } from "framer-motion"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/components/ui/toast"
import { authApi } from "@/api/auth"

export default function KitchenLogin() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ email: "", password: "" })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await authApi.login({ email: form.email, password: form.password })
      if (response.data.success && response.data.data) {
        const { role } = response.data.data
        if (role !== "KITCHEN" && role !== "ADMIN") {
          toast({ title: "Access denied", description: "Kitchen staff credentials required", variant: "destructive" })
          setLoading(false)
          return
        }
        await login({ email: form.email, password: form.password })
        setTimeout(() => navigate("/kitchen/dashboard"), 500)
      } else {
        throw new Error(response.data.message || "Login failed")
      }
    } catch (err: any) {
      toast({ title: "Login failed", description: err?.response?.data?.message || "Invalid credentials", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50/30 to-teal-50/40 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 shadow-xl shadow-green-500/30 mb-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.3),transparent_50%)]" />
            <ChefHat className="h-8 w-8 text-white relative z-10" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-800">Kitchen Display</h1>
          <p className="mt-2 text-muted-foreground">Sign in to manage kitchen orders</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="shadow-elevated border-0 overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500" />
            <CardContent className="p-7">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Kitchen Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 h-5 w-5 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="kitchen@restaurant.com"
                      className="pl-11 h-12 rounded-xl"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm font-semibold">Access Code</Label>
                    <button type="button" className="text-xs text-emerald-600 font-semibold hover:underline">
                      Need help?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 h-5 w-5 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="pl-11 h-12 rounded-xl"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      required
                      autoComplete="current-password"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/50">
                  <Flame className="h-5 w-5 text-emerald-600 shrink-0" />
                  <p className="text-xs text-emerald-800 font-medium">
                    For security, kitchen sessions auto-lock after 10 minutes of inactivity.
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full gap-2 h-12 text-base bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-500/25"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  ) : (
                    <>Enter Kitchen <ArrowRight className="h-5 w-5" /></>
                  )}
                </Button>
              </form>

              <div className="mt-7 pt-6 border-t border-border/60 space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="muted" className="gap-1.5 font-medium bg-emerald-50 text-emerald-700 border-0">
                    <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    Kitchen Encrypted
                  </Badge>
                  <span className="text-xs text-muted-foreground">Real-time order sync</span>
                </div>

                <Link
                  to="/customer/menu"
                  className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-emerald-600 transition-colors font-medium"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Customer Portal
                </Link>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Flame className="h-3.5 w-3.5 text-emerald-500" />
            DineFlow Kitchen Management System
          </div>
        </motion.div>
      </div>
    </div>
  )
}
