import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Mail, Lock, User, ArrowRight, Phone, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/components/ui/toast"

export default function Login() {
  const navigate = useNavigate()
  const { login, register } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [loginForm, setLoginForm] = useState({ email: "", password: "" })
  const [regForm, setRegForm] = useState({ name: "", email: "", phone: "", password: "" })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login({ email: loginForm.email, password: loginForm.password })
      toast({ title: "Welcome back!", description: "Successfully signed in", variant: "success" })
      setTimeout(() => navigate("/customer/menu"), 500)
    } catch (err: any) {
      toast({ title: "Login failed", description: err?.response?.data?.message || "Invalid credentials", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await register({ ...regForm, role: "CUSTOMER" })
      toast({ title: "Account created!", description: "Welcome to DineFlow", variant: "success" })
      setTimeout(() => navigate("/customer/menu"), 500)
    } catch (err: any) {
      toast({ title: "Registration failed", description: err?.response?.data?.message || "Try again", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-orange-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-primary shadow-xl shadow-brand-500/25 mb-4">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-black tracking-tight">DineFlow Account</h1>
          <p className="mt-2 text-muted-foreground">Sign in for a personalized experience</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="shadow-elevated border-0">
            <Tabs defaultValue="login">
              <TabsList className="grid grid-cols-2 mx-5 mt-5">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="register">Create Account</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="p-6 pt-5">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3.5 h-5 w-5 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        className="pl-11"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Password</Label>
                      <button type="button" className="text-xs text-brand-600 font-semibold hover:underline">
                        Forgot?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3.5 h-5 w-5 text-muted-foreground" />
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="pl-11"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full gap-2" size="lg" disabled={loading}>
                    {loading ? (
                      <div className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    ) : (
                      <>Sign In <ArrowRight className="h-4 w-4" /></>
                    )}
                  </Button>
                </form>
                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground mb-2">Or continue as guest</p>
                  <Button variant="outline" className="w-full" onClick={() => navigate("/customer/menu")}>
                    Browse Without Account
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="register" className="p-6 pt-5">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3.5 h-5 w-5 text-muted-foreground" />
                      <Input
                        placeholder="John Smith"
                        className="pl-11"
                        value={regForm.name}
                        onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3.5 h-5 w-5 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        className="pl-11"
                        value={regForm.email}
                        onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-3.5 h-5 w-5 text-muted-foreground" />
                      <Input
                        placeholder="+1 555 123 4567"
                        className="pl-11"
                        value={regForm.phone}
                        onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3.5 h-5 w-5 text-muted-foreground" />
                      <Input
                        type="password"
                        placeholder="Min. 8 characters"
                        className="pl-11"
                        value={regForm.password}
                        onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full gap-2" size="lg" disabled={loading}>
                    {loading ? (
                      <div className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    ) : (
                      <>Create Account <ArrowRight className="h-4 w-4" /></>
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </Card>

          <div className="mt-6 flex items-center justify-center gap-2">
            <Badge variant="muted" className="gap-1.5">
              <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              Secured with SSL
            </Badge>
            <span className="text-xs text-muted-foreground">End-to-end encryption</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
