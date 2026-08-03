import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mail, Lock, ArrowRight, Sparkles, UtensilsCrossed, ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/components/ui/toast"
import { authApi } from "@/api/auth"

export default function StaffLogin() {
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
        const { accessToken, refreshToken, userId, name, email, role } = response.data.data
        if (role !== "STAFF" && role !== "ADMIN") {
          toast({ title: "Access denied", description: "Staff credentials required", variant: "destructive" })
          setLoading(false)
          return
        }
        await login({ email: form.email, password: form.password })
        setTimeout(() => navigate("/staff/dashboard"), 500)
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-700 shadow-xl shadow-blue-500/25 mb-4">
            <UtensilsCrossed className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-black tracking-tight">Staff Portal</h1>
          <p className="mt-2 text-muted-foreground">Sign in to manage restaurant operations</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="shadow-elevated border-0 overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
            <CardContent className="p-7">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 h-5 w-5 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="staff@restaurant.com"
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
                    <Label className="text-sm font-semibold">Password</Label>
                    <button type="button" className="text-xs text-blue-600 font-semibold hover:underline">
                      Forgot password?
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

                <Button type="submit" className="w-full gap-2 h-12 text-base" size="lg" disabled={loading}>
                  {loading ? (
                    <div className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  ) : (
                    <>Sign In to Dashboard <ArrowRight className="h-5 w-5" /></>
                  )}
                </Button>
              </form>

              <div className="mt-7 pt-6 border-t border-border/60 space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="muted" className="gap-1.5 font-medium">
                    <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    Secured with SSL
                  </Badge>
                  <span className="text-xs text-muted-foreground">End-to-end encrypted</span>
                </div>

                <Link
                  to="/customer/menu"
                  className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-blue-600 transition-colors font-medium"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Customer Portal
                </Link>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5" />
            Powered by DineFlow Restaurant Management
          </div>
        </motion.div>
      </div>
    </div>
  )
}
