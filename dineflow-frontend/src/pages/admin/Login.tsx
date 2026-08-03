import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mail, Lock, ArrowRight, Building2, ShieldCheck, Sparkles, UtensilsCrossed } from "lucide-react"
import { motion } from "framer-motion"
import { useAuth, useRole } from "@/context/AuthContext"
import { useToast } from "@/components/ui/toast"

export default function AdminLogin() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ email: "", password: "" })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login({ email: form.email, password: form.password })
      toast({ title: "Welcome back!", description: "Signed in to Admin Console", variant: "success" })
      setTimeout(() => navigate("/admin/dashboard"), 500)
    } catch (err: any) {
      toast({ title: "Login failed", description: err?.response?.data?.message || "Invalid admin credentials", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-orange-500/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="hidden lg:flex lg:w-1/2 relative z-10 p-12 flex-col justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-orange-500 via-rose-500 to-violet-600 flex items-center justify-center shadow-2xl shadow-orange-500/30">
            <UtensilsCrossed className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">DineFlow</h1>
            <p className="text-xs text-slate-400">Restaurant Management Platform</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-md"
        >
          <Badge variant="outline" className="border-white/20 text-white/80 bg-white/5 mb-6 px-4 py-1.5 text-xs">
            <ShieldCheck className="h-3.5 w-3.5 mr-1.5" />
            ADMIN CONSOLE v2.0
          </Badge>
          <h2 className="text-5xl font-black text-white leading-[1.05] tracking-tight mb-6">
            Run your restaurant
            <span className="block bg-gradient-to-r from-orange-400 via-rose-400 to-violet-400 bg-clip-text text-transparent">
              like a pro.
            </span>
          </h2>
          <p className="text-lg text-slate-400 mb-10 leading-relaxed">
            Real-time insights, smart operations, and everything you need to delight guests and grow revenue — from a single powerful dashboard.
          </p>

          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Live Orders", value: "127", icon: Building2 },
              { label: "Today's Rev", value: "$8.2K", icon: Sparkles },
              { label: "Tables Free", value: "14/20", icon: ShieldCheck },
            ].map((s, i) => {
              const Icon = s.icon
              return (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="rounded-2xl bg-white/5 border border-white/10 p-4 backdrop-blur-xl"
                >
                  <Icon className="h-5 w-5 text-orange-400 mb-3" />
                  <p className="text-2xl font-bold text-white">{s.value}</p>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">{s.label}</p>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-sm text-slate-500"
        >
          © 2026 DineFlow Inc. Trusted by 4,200+ restaurants worldwide.
        </motion.p>
      </div>

      <div className="flex-1 relative z-10 flex items-center justify-center p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full max-w-md"
        >
          <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-2xl">
            <CardContent className="p-8">
              <div className="lg:hidden mb-8 flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-orange-500 to-violet-600 flex items-center justify-center">
                  <UtensilsCrossed className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-black tracking-tight">DineFlow</h1>
                  <p className="text-xs text-muted-foreground">Admin Console</p>
                </div>
              </div>

              <div className="mb-8">
                <Badge variant="default" className="mb-4 bg-orange-500/10 text-orange-600 border-0">
                  <ShieldCheck className="h-3 w-3 mr-1" />
                  Restricted Access
                </Badge>
                <h2 className="text-2xl font-bold tracking-tight mb-2">Sign in to Admin</h2>
                <p className="text-sm text-muted-foreground">Welcome back! Enter your credentials to continue.</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <Label className="text-slate-700">Work Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
                    <Input
                      type="email"
                      placeholder="admin@restaurant.com"
                      className="pl-11 h-12"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-slate-700">Password</Label>
                    <Link to="/forgot-password" className="text-xs font-semibold text-orange-600 hover:text-orange-700 hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
                    <Input
                      type="password"
                      placeholder="••••••••••"
                      className="pl-11 h-12"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500" />
                    <span className="text-sm text-slate-600 font-medium">Remember this device</span>
                  </label>
                </div>

                <Button type="submit" className="w-full gap-2 h-12 text-base" size="lg" disabled={loading}>
                  {loading ? (
                    <div className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  ) : (
                    <>
                      Sign In to Dashboard
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-white px-4 text-slate-500 font-medium uppercase tracking-wider">Quick Demo Access</span>
                  </div>
                </div>
                <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Email</span>
                    <code className="bg-white px-2 py-0.5 rounded border border-slate-200 font-mono text-slate-700">admin@dineflow.com</code>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Password</span>
                    <code className="bg-white px-2 py-0.5 rounded border border-slate-200 font-mono text-slate-700">admin123</code>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <p className="mt-6 text-center text-xs text-slate-500">
            Protected by enterprise-grade encryption. · Need help?{" "}
            <a href="#" className="text-orange-500 font-semibold hover:underline">Contact IT</a>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
