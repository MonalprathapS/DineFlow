import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mail, ArrowRight, ChefHat, ArrowLeft, CheckCircle2, ShieldCheck, UtensilsCrossed, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/components/ui/toast"
import { useAuth } from "@/context/AuthContext"

export default function ForgotPassword() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [email, setEmail] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1200))
    setLoading(false)
    setSubmitted(true)
    toast({
      title: "Reset link sent",
      description: `If ${email} has an account, check your inbox`,
      variant: "success",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50/30 to-teal-50/40 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <Link to="/" className="inline-flex items-center justify-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 shadow-xl shadow-emerald-500/30 mb-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.3),transparent_50%)]" />
              <ChefHat className="h-8 w-8 text-white relative z-10" />
            </div>
          </Link>
          <h1 className="text-3xl font-black tracking-tight text-slate-800">DineFlow</h1>
          <p className="mt-2 text-muted-foreground">Restaurant Management Platform</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98, x: -20 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="shadow-elevated border-0 overflow-hidden">
                <div className="h-1.5 bg-gradient-to-r from-orange-500 via-rose-500 to-violet-500" />
                <CardContent className="p-8">
                  <div className="mb-7">
                    <Badge
                      variant="muted"
                      className="mb-4 bg-orange-500/10 text-orange-600 border-0 font-semibold"
                    >
                      <ShieldCheck className="h-3 w-3 mr-1" />
                      Account Recovery
                    </Badge>
                    <h2 className="text-2xl font-bold tracking-tight mb-2">Forgot password?</h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      No worries. Enter your email below and we'll send you a secure link to reset your password.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Registered Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-3.5 h-5 w-5 text-muted-foreground" />
                        <Input
                          type="email"
                          placeholder="you@restaurant.com"
                          className="pl-11 h-12 rounded-xl"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          autoComplete="email"
                          autoFocus
                        />
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50/60 border border-amber-200/60">
                      <ShieldCheck className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-800 font-medium leading-relaxed">
                        For security, we won't confirm whether an account exists. Check your spam folder if you don't see the email within 5 minutes.
                      </p>
                    </div>

                    <Button
                      type="submit"
                      className="w-full gap-2 h-12 text-base bg-gradient-to-r from-orange-600 via-rose-600 to-violet-600 hover:from-orange-700 hover:via-rose-700 hover:to-violet-700 shadow-lg shadow-rose-500/25"
                      size="lg"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Sending link...
                        </>
                      ) : (
                        <>
                          Send Reset Link
                          <ArrowRight className="h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </form>

                  <div className="mt-7 pt-6 border-t border-border/60">
                    <Link
                      to={user ? "/kitchen/dashboard" : "/admin/login"}
                      className="flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground hover:text-orange-600 transition-colors group"
                    >
                      <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
                      Back to sign in
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
            >
              <Card className="shadow-elevated border-0 overflow-hidden">
                <div className="h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500" />
                <CardContent className="p-8">
                  <div className="flex flex-col items-center text-center">
                    <motion.div
                      initial={{ scale: 0, rotate: -30 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.1 }}
                      className="h-20 w-20 rounded-3xl bg-gradient-to-br from-emerald-500 via-teal-500 to-green-500 shadow-2xl shadow-emerald-500/30 mb-5 flex items-center justify-center relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.4),transparent_60%)]" />
                      <CheckCircle2 className="h-10 w-10 text-white relative z-10" />
                    </motion.div>

                    <Badge
                      variant="success"
                      className="mb-3 bg-emerald-500/15 text-emerald-700 border-0 px-3 py-1 font-bold"
                    >
                      Email Sent
                    </Badge>

                    <h2 className="text-2xl font-black tracking-tight mb-2 text-slate-800">
                      Check your inbox
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                      We've sent a password reset link to
                    </p>
                    <p className="text-base font-bold text-slate-800 mb-6 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 font-mono break-all w-full">
                      {email}
                    </p>

                    <div className="w-full space-y-2 text-left text-xs text-muted-foreground mb-7 p-4 rounded-xl bg-slate-50/60 border border-slate-100">
                      <div className="flex items-start gap-2">
                        <span className="text-emerald-500 font-black">1.</span>
                        <span>Open the email from <span className="font-semibold text-foreground">no-reply@dineflow.com</span></span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-emerald-500 font-black">2.</span>
                        <span>Click the <span className="font-semibold text-foreground">"Reset Password"</span> button</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-emerald-500 font-black">3.</span>
                        <span>Create a new password — the link expires in <span className="font-semibold text-foreground">30 minutes</span></span>
                      </div>
                    </div>

                    <div className="w-full space-y-3">
                      <Button
                        onClick={() => navigate(user ? "/kitchen/dashboard" : "/admin/login")}
                        variant="outline"
                        className="w-full gap-2 h-12 rounded-xl font-semibold"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Back to sign in
                      </Button>
                      <button
                        onClick={() => {
                          setSubmitted(false)
                          setEmail("")
                        }}
                        className="text-sm font-semibold text-orange-600 hover:text-orange-700 hover:underline transition-colors"
                      >
                        Didn't get the email? Try again
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <UtensilsCrossed className="h-3.5 w-3.5 text-emerald-500" />
          DineFlow · Trusted by 4,200+ restaurants
        </div>
      </div>
    </div>
  )
}
