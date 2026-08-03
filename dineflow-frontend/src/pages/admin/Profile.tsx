import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ShieldCheck, Upload, Mail, Phone, Key, Eye, EyeOff, Lock, Smartphone,
  LogOut, Plus, Copy, Trash2, CheckCircle2, Clock, User, Settings2,
  Activity, FileEdit, DollarSign, ShoppingBag, Users, ToggleLeft, ToggleRight,
  AlertTriangle, Download, RefreshCw, Save, MapPin, Star, Link2
} from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/components/ui/toast"
import { cn, formatCurrency, formatDate, formatDateTime } from "@/lib/utils"

type Tab = "profile" | "security" | "activity"

interface ApiKey {
  id: number
  name: string
  prefix: string
  createdAt: string
  lastUsed: string
}

interface Session {
  id: number
  device: string
  location: string
  ip: string
  lastActive: string
  current: boolean
}

interface ActivityItem {
  id: number
  icon: any
  color: string
  title: string
  description: string
  time: string
}

export default function Profile() {
  const { toast } = useToast()
  const [tab, setTab] = useState<Tab>("profile")

  const [showOld, setShowOld] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const [profile, setProfile] = useState({
    name: "Jordan Reyes",
    email: "jordan.reyes@azuresky.com",
    phone: "+1 (619) 555-0107",
    address: "742 Seaside Blvd, San Diego, CA 92109",
    role: "ADMIN" as const,
    twoFA: true,
  })

  const [passwords, setPasswords] = useState({ old: "", new: "", confirm: "" })

  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    { id: 1, name: "Production Web App", prefix: "sk_live_abc123", createdAt: "2025-11-02", lastUsed: "2 minutes ago" },
    { id: 2, name: "Mobile POS Client", prefix: "sk_live_xyz789", createdAt: "2026-02-18", lastUsed: "1 hour ago" },
    { id: 3, name: "Test Environment", prefix: "sk_test_dev456", createdAt: "2026-06-24", lastUsed: "3 days ago" },
  ])

  const [sessions] = useState<Session[]>([
    { id: 1, device: "MacBook Pro · Chrome", location: "San Diego, CA", ip: "76.201.12.8", lastActive: "Just now", current: true },
    { id: 2, device: "iPhone 15 Pro · Safari", location: "San Diego, CA", ip: "76.201.12.8", lastActive: "4 hours ago", current: false },
    { id: 3, device: "iPad Air · POS App", location: "San Diego, CA", ip: "192.168.1.42", lastActive: "Yesterday", current: false },
    { id: 4, device: "Windows PC · Edge", location: "Phoenix, AZ", ip: "203.45.101.22", lastActive: "2 days ago", current: false },
  ])

  const activity: ActivityItem[] = [
    { id: 1, icon: ShoppingBag, color: "bg-orange-500", title: "Approved 34 pending orders", description: "Bulk action for today's morning rush", time: "12 minutes ago" },
    { id: 2, icon: DollarSign, color: "bg-emerald-500", title: "Generated weekly payout report", description: "Revenue summary exported as Excel", time: "2 hours ago" },
    { id: 3, icon: Users, color: "bg-violet-500", title: "Added new staff member", description: "Invited Marco Rossi (Kitchen role)", time: "Yesterday" },
    { id: 4, icon: FileEdit, color: "bg-blue-500", title: "Updated 18 menu items", description: "Pricing adjustment on beverage list", time: "Yesterday" },
    { id: 5, icon: ShieldCheck, color: "bg-rose-500", title: "Changed account password", description: "From MacBook Pro · Chrome", time: "3 days ago" },
    { id: 6, icon: Settings2, color: "bg-amber-500", title: "Modified restaurant settings", description: "Enabled waitlist + updated hours", time: "4 days ago" },
    { id: 7, icon: Star, color: "bg-pink-500", title: "Responded to 6 customer reviews", description: "Avg 4.8 star satisfaction", time: "Last week" },
    { id: 8, icon: Activity, color: "bg-cyan-500", title: "Signed in from new device", description: "iPad Air (POS App) - trusted", time: "2 weeks ago" },
  ]

  const saveProfile = () => {
    toast({ title: "Profile updated", description: "Your changes have been saved", variant: "success" })
  }

  const savePassword = () => {
    if (passwords.new !== passwords.confirm) {
      toast({ title: "Passwords don't match", description: "New password and confirmation must match", variant: "destructive" })
      return
    }
    if (passwords.new.length < 8) {
      toast({ title: "Weak password", description: "Use at least 8 characters", variant: "destructive" })
      return
    }
    toast({ title: "Password changed", description: "Use new password on next login", variant: "success" })
    setPasswords({ old: "", new: "", confirm: "" })
  }

  const revokeKey = (k: ApiKey) => {
    setApiKeys((prev) => prev.filter((x) => x.id !== k.id))
    toast({ title: "API key revoked", description: `${k.name} is no longer valid`, variant: "destructive" })
  }

  const copyKey = (key: ApiKey) => {
    navigator.clipboard?.writeText(key.prefix + "...")
    toast({ title: "Copied", description: `${key.name} prefix copied` })
  }

  const createKey = () => {
    const name = prompt("Key name?", "New Integration Key")
    if (!name?.trim()) return
    const prefix = "sk_" + (Math.random() > 0.5 ? "live_" : "test_") + Math.random().toString(36).slice(2, 8)
    const now = new Date().toISOString().slice(0, 10)
    setApiKeys((prev) => [...prev, { id: Date.now(), name, prefix, createdAt: now, lastUsed: "Never" }])
    toast({ title: "Key created", description: "Store this key somewhere safe!", variant: "success" })
  }

  const endSession = (s: Session) => {
    if (s.current) return
    toast({ title: "Session ended", description: `${s.device} logged out` })
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your account, security settings, and review activity
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2"><RefreshCw className="h-4 w-4" /> Reset</Button>
          <Button className="gap-2" onClick={saveProfile}><Save className="h-4 w-4" /> Save</Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <Card className="border-0 overflow-hidden relative text-white">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-rose-500 to-violet-600" />
            <div className="absolute -right-16 -top-16 w-52 h-52 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -left-10 bottom-0 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
            <CardContent className="relative p-6 text-center">
              <div className="relative inline-block">
                <Avatar className="h-24 w-24 ring-4 ring-white/40 shadow-2xl mx-auto">
                  <AvatarFallback name={profile.name} className="text-2xl bg-white/20 backdrop-blur" />
                </Avatar>
                <button className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-white text-orange-600 shadow-lg flex items-center justify-center ring-4 ring-white/60 hover:scale-105 transition-transform">
                  <Upload className="h-3.5 w-3.5" />
                </button>
              </div>
              <h2 className="mt-4 text-xl font-black tracking-tight">{profile.name}</h2>
              <p className="text-sm text-white/80 mt-0.5">{profile.email}</p>
              <Badge variant="outline" className="mt-3 gap-1.5 border-0 bg-white/20 backdrop-blur text-white font-semibold">
                <ShieldCheck className="h-3.5 w-3.5" />
                {profile.role === "ADMIN" ? "Administrator" : profile.role}
              </Badge>
              <div className="mt-5 grid grid-cols-3 gap-2">
                {[
                  { label: "Orders", value: "1.2k" },
                  { label: "Reviews", value: "186" },
                  { label: "Joined", value: "2023" },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl bg-white/10 backdrop-blur py-2.5">
                    <p className="text-lg font-black">{s.value}</p>
                    <p className="text-[10px] font-medium text-white/70 uppercase tracking-wider">{s.label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <User className="h-4 w-4 text-orange-500" />
                Quick Navigation
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-1">
              {[
                { id: "profile" as Tab, label: "Personal Info", Icon: User, desc: "Name, email, contact" },
                { id: "security" as Tab, label: "Security", Icon: Lock, desc: "Password, 2FA, API keys" },
                { id: "activity" as Tab, label: "Activity Log", Icon: Clock, desc: "Account history" },
              ].map((s) => {
                const Icon = s.Icon
                const active = tab === s.id
                return (
                  <button
                    key={s.id}
                    onClick={() => setTab(s.id)}
                    className={cn(
                      "w-full flex items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-all group",
                      active
                        ? "bg-gradient-to-r from-orange-500/10 to-rose-500/10 ring-1 ring-orange-500/20"
                        : "hover:bg-slate-50"
                    )}
                  >
                    <div className={cn(
                      "h-9 w-9 rounded-lg flex items-center justify-center shrink-0",
                      active
                        ? "bg-gradient-to-br from-orange-500 to-rose-500 text-white"
                        : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                    )}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className={cn("text-sm font-semibold", active ? "text-slate-900" : "text-slate-700")}>{s.label}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{s.desc}</p>
                    </div>
                  </button>
                )
              })}
            </CardContent>
          </Card>
        </motion.aside>

        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="space-y-5"
        >
          {tab === "profile" && (
            <>
              <Card>
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white flex items-center justify-center">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>Update your public profile details</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-1"><Mail className="h-3.5 w-3.5 text-slate-400" /> Email Address</Label>
                      <Input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-1"><Phone className="h-3.5 w-3.5 text-slate-400" /> Phone</Label>
                      <Input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Role</Label>
                      <div className="h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center">
                        <Badge variant="outline" className="gap-1.5 border-violet-200 bg-violet-50 text-violet-700">
                          <ShieldCheck className="h-3.5 w-3.5" />
                          Full Administrator
                        </Badge>
                      </div>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <Label className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-slate-400" /> Address</Label>
                      <Input value={profile.address} onChange={(e) => setProfile({ ...profile, address: e.target.value })} />
                    </div>
                  </div>

                  <div className="rounded-2xl border border-dashed border-slate-200 bg-gradient-to-br from-slate-50/80 to-white p-6 text-center">
                    <div className="h-14 w-14 mx-auto rounded-2xl bg-gradient-to-br from-orange-500 to-rose-500 text-white flex items-center justify-center shadow-md mb-3">
                      <Upload className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-semibold text-slate-900">Update Profile Photo</p>
                    <p className="text-[11px] text-slate-500 mt-1">JPG or PNG · Max 4MB · Square recommended</p>
                    <Button variant="outline" className="mt-3 gap-1.5"><ImageIcon className="h-3.5 w-3.5" /> Choose File</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 text-white flex items-center justify-center">
                      <Key className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <CardTitle>Change Password</CardTitle>
                          <CardDescription>Use a strong, unique password</CardDescription>
                        </div>
                        <Badge variant="outline" className="gap-1 border-emerald-200 bg-emerald-50 text-emerald-700 shrink-0">
                          <CheckCircle2 className="h-3 w-3" /> Strong
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Current Password</Label>
                      <div className="relative">
                        <Input type={showOld ? "text" : "password"} value={passwords.old} onChange={(e) => setPasswords({ ...passwords, old: e.target.value })} />
                        <button type="button" onClick={() => setShowOld(!showOld)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                          {showOld ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>New Password</Label>
                      <div className="relative">
                        <Input type={showNew ? "text" : "password"} value={passwords.new} onChange={(e) => setPasswords({ ...passwords, new: e.target.value })} />
                        <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                          {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Confirm Password</Label>
                      <div className="relative">
                        <Input type={showConfirm ? "text" : "password"} value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} />
                        <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                          {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-end justify-between gap-4">
                    <ul className="space-y-1 text-[11px] text-slate-500">
                      <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3 text-emerald-500" /> At least 8 characters</li>
                      <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3 text-emerald-500" /> Mix of letters, numbers & symbols</li>
                      <li className="flex items-center gap-1.5"><AlertTriangle className="h-3 w-3 text-amber-500" /> Don't reuse previous passwords</li>
                    </ul>
                    <Button onClick={savePassword} className="gap-1.5"><Lock className="h-4 w-4" /> Update Password</Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {tab === "security" && (
            <>
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center">
                        <ShieldCheck className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle>Two-Factor Authentication</CardTitle>
                        <CardDescription>Extra layer of security when you sign in</CardDescription>
                      </div>
                    </div>
                    <div
                      className="cursor-pointer"
                      onClick={() => setProfile({ ...profile, twoFA: !profile.twoFA })}
                    >
                      {profile.twoFA ? (
                        <ToggleRight className="h-8 w-8 text-orange-600" />
                      ) : (
                        <ToggleLeft className="h-8 w-8 text-slate-400" />
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className={cn(
                    "rounded-2xl p-5 border transition-all",
                    profile.twoFA
                      ? "bg-emerald-50/50 border-emerald-200"
                      : "bg-slate-50/50 border-slate-200"
                  )}>
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "h-10 w-10 rounded-xl flex items-center justify-center shrink-0",
                        profile.twoFA ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-500"
                      )}>
                        {profile.twoFA ? <CheckCircle2 className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
                      </div>
                      <div className="flex-1">
                        {profile.twoFA ? (
                          <>
                            <p className="text-sm font-bold text-emerald-900">2FA is enabled</p>
                            <p className="text-[11px] text-emerald-700 mt-0.5">Using Authenticator App — last verified today</p>
                            <div className="mt-3 flex flex-wrap gap-2">
                              <Button variant="outline" size="sm" className="gap-1.5"><Smartphone className="h-3.5 w-3.5" /> Show QR Code</Button>
                              <Button variant="outline" size="sm" className="gap-1.5"><Key className="h-3.5 w-3.5" /> Recovery Codes</Button>
                              <Button variant="outline" size="sm" className="gap-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200"><ShieldCheck className="h-3.5 w-3.5" /> Disable 2FA</Button>
                            </div>
                          </>
                        ) : (
                          <>
                            <p className="text-sm font-bold text-slate-900">2FA is not enabled</p>
                            <p className="text-[11px] text-slate-600 mt-0.5">Add an authenticator app (Google Authenticator, Authy, 1Password) for better protection.</p>
                            <Button className="mt-3 gap-1.5"><Smartphone className="h-3.5 w-3.5" /> Set Up Authenticator</Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 text-white flex items-center justify-center">
                      <Smartphone className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle>Active Sessions</CardTitle>
                      <CardDescription>Devices currently signed in to your account</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2.5">
                  {sessions.map((s) => (
                    <motion.div
                      key={s.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-between rounded-2xl border border-slate-100 p-4 hover:border-slate-200 hover:bg-slate-50/40 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "h-11 w-11 rounded-xl flex items-center justify-center shrink-0",
                          s.current
                            ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white"
                            : "bg-slate-100 text-slate-500"
                        )}>
                          <Smartphone className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-bold text-slate-900">{s.device}</p>
                            {s.current && (
                              <Badge variant="success" className="text-[10px] gap-1 h-5">
                                <span className="h-1.5 w-1.5 rounded-full bg-success-500 animate-pulse" />
                                This device
                              </Badge>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-0.5 text-[11px] text-slate-500">
                            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {s.location}</span>
                            <span className="flex items-center gap-1"><Link2 className="h-3 w-3" /> {s.ip}</span>
                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {s.lastActive}</span>
                          </div>
                        </div>
                      </div>
                      {!s.current && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200 shrink-0"
                          onClick={() => endSession(s)}
                        >
                          <LogOut className="h-3.5 w-3.5" />
                          End
                        </Button>
                      )}
                    </motion.div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center">
                      <Key className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle>API Keys</CardTitle>
                      <CardDescription>Programmatic access to the Dineflow API</CardDescription>
                    </div>
                  </div>
                  <Button className="gap-1.5 shrink-0" onClick={createKey}>
                    <Plus className="h-4 w-4" />
                    Create Key
                  </Button>
                </CardHeader>
                <CardContent className="space-y-2.5">
                  {apiKeys.map((k) => (
                    <div
                      key={k.id}
                      className="flex items-center justify-between rounded-2xl border border-slate-100 p-4 hover:border-slate-200 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="h-10 w-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                          <Key className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-slate-900">{k.name}</p>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-0.5 text-[11px] text-slate-500">
                            <code className="font-mono bg-slate-100 px-2 py-0.5 rounded-md text-slate-700 truncate max-w-[240px]">{k.prefix}••••••••</code>
                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Created {formatDate(k.createdAt)}</span>
                            <span className="flex items-center gap-1"><Activity className="h-3 w-3" /> {k.lastUsed}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0 ml-3">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => copyKey(k)} title="Copy">
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-50" onClick={() => revokeKey(k)} title="Revoke">
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {apiKeys.length === 0 && (
                    <div className="py-10 text-center">
                      <Key className="h-10 w-10 mx-auto text-slate-300 mb-3" />
                      <p className="text-sm font-semibold text-slate-900">No API keys</p>
                      <p className="text-xs text-slate-500 mt-1">Create a key to integrate with other systems</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}

          {tab === "activity" && (
            <>
              <Card>
                <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white flex items-center justify-center">
                      <Activity className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle>Activity Log</CardTitle>
                      <CardDescription>A chronological record of your account actions</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" className="gap-1.5 h-9"><Download className="h-4 w-4" /> Export</Button>
                  </div>
                </CardHeader>
                <CardContent className="relative pl-8">
                  <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-orange-300 via-rose-300 to-transparent" />
                  <div className="space-y-5">
                    {activity.map((a, i) => {
                      const Icon = a.icon
                      return (
                        <motion.div
                          key={a.id}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.03 }}
                          className="relative"
                        >
                          <div className={cn(
                            "absolute -left-[26px] top-1 h-5 w-5 rounded-full ring-4 ring-white flex items-center justify-center shadow-md",
                            a.color
                          )}>
                            <Icon className="h-2.5 w-2.5 text-white" />
                          </div>
                          <div className="rounded-2xl border border-slate-100 bg-slate-50/30 p-4 hover:bg-slate-50/70 hover:border-slate-200 transition-all">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-sm font-bold text-slate-900">{a.title}</p>
                                <p className="text-[11px] text-slate-500 mt-0.5">{a.description}</p>
                              </div>
                              <span className="flex items-center gap-1 text-[11px] text-slate-400 shrink-0">
                                <Clock className="h-3 w-3" />
                                {a.time}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                  <div className="mt-6 text-center">
                    <Button variant="outline" className="gap-1.5"><Activity className="h-4 w-4" /> Load Earlier Activity</Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </motion.div>
      </div>
    </div>
  )
}

function ImageIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  )
}
