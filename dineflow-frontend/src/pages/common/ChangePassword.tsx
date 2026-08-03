import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Lock,
  ArrowRight,
  ChefHat,
  ArrowLeft,
  ShieldCheck,
  UtensilsCrossed,
  Loader2,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  KeyRound,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/components/ui/toast"
import { cn } from "@/lib/utils"

interface PasswordStrength {
  score: 0 | 1 | 2 | 3 | 4
  label: string
  color: string
  bgColor: string
  textColor: string
}

function calcStrength(pwd: string): PasswordStrength {
  let score = 0
  if (!pwd) return { score: 0, label: "Enter a password", color: "bg-slate-200", bgColor: "bg-slate-50", textColor: "text-slate-500" }
  if (pwd.length >= 8) score++
  if (pwd.length >= 12) score++
  if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++
  if (/\d/.test(pwd)) score++
  if (/[^A-Za-z0-9]/.test(pwd)) score++
  if (score <= 1) return { score: 1, label: "Weak", color: "bg-red-500", bgColor: "bg-red-50", textColor: "text-red-600" }
  if (score === 2) return { score: 2, label: "Fair", color: "bg-orange-500", bgColor: "bg-orange-50", textColor: "text-orange-600" }
  if (score === 3) return { score: 3, label: "Good", color: "bg-amber-500", bgColor: "bg-amber-50", textColor: "text-amber-600" }
  return { score: 4, label: "Strong", color: "bg-emerald-500", bgColor: "bg-emerald-50", textColor: "text-emerald-600" }
}

export default function ChangePassword() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showOld, setShowOld] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [touched, setTouched] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  })

  const strength = calcStrength(form.newPassword)

  const errors = {
    oldPassword: touched.oldPassword && form.oldPassword.length < 4 ? "Current password is required" : "",
    newPassword: touched.newPassword && form.newPassword.length < 8 ? "Password must be at least 8 characters" : "",
    confirmPassword:
      touched.confirmPassword && form.confirmPassword !== form.newPassword
        ? "Passwords do not match"
        : touched.confirmPassword && !form.confirmPassword
        ? "Please confirm your new password"
        : "",
  }

  const isValid =
    !errors.oldPassword &&
    !errors.newPassword &&
    !errors.confirmPassword &&
    form.oldPassword.length >= 4 &&
    form.newPassword.length >= 8 &&
    form.confirmPassword === form.newPassword

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1400))
    setLoading(false)
    setSuccess(true)
    toast({
      title: "Password updated",
      description: "Your password has been changed successfully",
      variant: "success",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-violet-50/30 to-purple-50/40 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <Link to="/" className="inline-flex items-center justify-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 shadow-xl shadow-violet-500/30 mb-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.3),transparent_50%)]" />
              <ChefHat className="h-8 w-8 text-white relative z-10" />
            </div>
          </Link>
          <h1 className="text-3xl font-black tracking-tight text-slate-800">DineFlow</h1>
          <p className="mt-2 text-muted-foreground">Restaurant Management Platform</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!success ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98, y: -10 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="shadow-elevated border-0 overflow-hidden">
                <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500" />
                <CardContent className="p-8">
                  <div className="mb-7">
                    <Badge
                      variant="muted"
                      className="mb-4 bg-indigo-500/10 text-indigo-600 border-0 font-semibold"
                    >
                      <KeyRound className="h-3 w-3 mr-1" />
                      Security
                    </Badge>
                    <h2 className="text-2xl font-bold tracking-tight mb-2">Change Password</h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Choose a strong, unique password to keep your DineFlow account secure.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Current Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-3.5 h-5 w-5 text-muted-foreground" />
                        <Input
                          type={showOld ? "text" : "password"}
                          placeholder="••••••••"
                          className={cn(
                            "pl-11 pr-11 h-12 rounded-xl transition-all",
                            errors.oldPassword && "border-red-300 focus:ring-red-500 focus:border-red-300"
                          )}
                          value={form.oldPassword}
                          onChange={(e) => setForm({ ...form, oldPassword: e.target.value })}
                          onBlur={() => setTouched({ ...touched, oldPassword: true })}
                          required
                          autoComplete="current-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowOld(!showOld)}
                          className="absolute right-3.5 top-3.5 text-muted-foreground hover:text-foreground transition-colors"
                          tabIndex={-1}
                        >
                          {showOld ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                      {errors.oldPassword && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-xs text-red-600 font-medium flex items-center gap-1"
                        >
                          <AlertCircle className="h-3 w-3" />
                          {errors.oldPassword}
                        </motion.p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">New Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-3.5 h-5 w-5 text-muted-foreground" />
                        <Input
                          type={showNew ? "text" : "password"}
                          placeholder="At least 8 characters"
                          className={cn(
                            "pl-11 pr-11 h-12 rounded-xl transition-all",
                            errors.newPassword && "border-red-300 focus:ring-red-500 focus:border-red-300"
                          )}
                          value={form.newPassword}
                          onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                          onBlur={() => setTouched({ ...touched, newPassword: true })}
                          required
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNew(!showNew)}
                          className="absolute right-3.5 top-3.5 text-muted-foreground hover:text-foreground transition-colors"
                          tabIndex={-1}
                        >
                          {showNew ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>

                      {form.newPassword && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className={cn("p-3 rounded-xl border transition-colors", strength.bgColor, "border-transparent")}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex gap-1.5">
                              {[0, 1, 2, 3].map((i) => (
                                <div
                                  key={i}
                                  className={cn(
                                    "h-1.5 w-8 rounded-full transition-all",
                                    i < strength.score ? strength.color : "bg-slate-200"
                                  )}
                                />
                              ))}
                            </div>
                            <span className={cn("text-[11px] font-black uppercase tracking-wider", strength.textColor)}>
                              {strength.label}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-1 text-[11px] text-muted-foreground">
                            {[
                              { label: "8+ characters", ok: form.newPassword.length >= 8 },
                              { label: "12+ recommended", ok: form.newPassword.length >= 12 },
                              { label: "Upper & lower case", ok: /[A-Z]/.test(form.newPassword) && /[a-z]/.test(form.newPassword) },
                              { label: "Numbers", ok: /\d/.test(form.newPassword) },
                              { label: "Symbols", ok: /[^A-Za-z0-9]/.test(form.newPassword) },
                            ].map((r) => (
                              <div key={r.label} className="flex items-center gap-1.5">
                                {r.ok ? (
                                  <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                                ) : (
                                  <span className="h-3 w-3 rounded-full border-2 border-slate-300 shrink-0" />
                                )}
                                <span className={r.ok ? "text-emerald-700 font-semibold" : ""}>{r.label}</span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {errors.newPassword && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-xs text-red-600 font-medium flex items-center gap-1"
                        >
                          <AlertCircle className="h-3 w-3" />
                          {errors.newPassword}
                        </motion.p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Confirm New Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-3.5 h-5 w-5 text-muted-foreground" />
                        <Input
                          type={showConfirm ? "text" : "password"}
                          placeholder="Re-enter new password"
                          className={cn(
                            "pl-11 pr-11 h-12 rounded-xl transition-all",
                            errors.confirmPassword && "border-red-300 focus:ring-red-500 focus:border-red-300",
                            !errors.confirmPassword &&
                              touched.confirmPassword &&
                              form.confirmPassword === form.newPassword &&
                              form.confirmPassword &&
                              "border-emerald-300 focus:ring-emerald-500 focus:border-emerald-300 bg-emerald-50/40"
                          )}
                          value={form.confirmPassword}
                          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                          onBlur={() => setTouched({ ...touched, confirmPassword: true })}
                          required
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm(!showConfirm)}
                          className="absolute right-3.5 top-3.5 text-muted-foreground hover:text-foreground transition-colors"
                          tabIndex={-1}
                        >
                          {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                        {!errors.confirmPassword &&
                          touched.confirmPassword &&
                          form.confirmPassword === form.newPassword &&
                          form.confirmPassword && (
                            <CheckCircle2 className="absolute right-12 top-3.5 h-5 w-5 text-emerald-500 shrink-0" />
                          )}
                      </div>
                      {errors.confirmPassword && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-xs text-red-600 font-medium flex items-center gap-1"
                        >
                          <AlertCircle className="h-3 w-3" />
                          {errors.confirmPassword}
                        </motion.p>
                      )}
                    </div>

                    <div className="flex items-start gap-3 p-4 rounded-xl bg-indigo-50/60 border border-indigo-200/60">
                      <ShieldCheck className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
                      <p className="text-xs text-indigo-800 font-medium leading-relaxed">
                        Your password is encrypted with industry-standard AES-256 and never stored in plain text. Enable 2FA in Settings for extra security.
                      </p>
                    </div>

                    <Button
                      type="submit"
                      className="w-full gap-2 h-12 text-base bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 hover:from-indigo-700 hover:via-violet-700 hover:to-purple-700 shadow-lg shadow-violet-500/25"
                      size="lg"
                      disabled={loading || !isValid}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Updating password...
                        </>
                      ) : (
                        <>
                          Update Password
                          <ArrowRight className="h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </form>

                  <div className="mt-7 pt-6 border-t border-border/60">
                    <Link
                      to="/kitchen/dashboard"
                      className="flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground hover:text-indigo-600 transition-colors group"
                    >
                      <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
                      Back to dashboard
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
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
                      All Set
                    </Badge>

                    <h2 className="text-2xl font-black tracking-tight mb-2 text-slate-800">
                      Password Changed
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                      Your password has been updated successfully. All other sessions have been signed out for your security.
                    </p>

                    <div className="w-full p-4 rounded-xl bg-emerald-50/60 border border-emerald-100 mb-7 text-left">
                      <div className="flex items-start gap-3">
                        <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-bold text-emerald-800">Signed out everywhere</p>
                          <p className="text-xs text-emerald-700/80 mt-0.5 leading-relaxed">
                            For security, we've logged out all other devices using your account. If this wasn't you, contact your admin immediately.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="w-full space-y-3">
                      <Button
                        onClick={() => navigate("/kitchen/dashboard")}
                        className="w-full gap-2 h-12 rounded-xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 hover:from-emerald-700 hover:via-teal-700 hover:to-green-700 shadow-md shadow-emerald-500/20"
                      >
                        Back to Kitchen
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                      <Link
                        to="/admin/login"
                        className="flex items-center justify-center gap-2 text-sm font-semibold text-violet-600 hover:text-violet-700 hover:underline transition-colors"
                      >
                        Go to Admin Console instead
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <UtensilsCrossed className="h-3.5 w-3.5 text-violet-500" />
          DineFlow · Enterprise-grade security
        </div>
      </div>
    </div>
  )
}
