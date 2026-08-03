import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Settings2,
  Building2,
  MapPin,
  Phone,
  Mail,
  Clock,
  Globe,
  Bell,
  BellRing,
  Volume2,
  Smartphone,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  Save,
  ChevronRight,
  AlertTriangle,
  Trash2,
  UserCheck,
  KeyRound,
  LogOut,
  Info,
  UtensilsCrossed,
} from "lucide-react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/components/ui/toast"
import { cn } from "@/lib/utils"

export default function Settings() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { toast } = useToast()
  const [saving, setSaving] = useState<string | null>(null)

  const [notifs, setNotifs] = useState({
    newOrders: true,
    foodReady: true,
    paymentReceived: true,
    tableRequests: true,
    staffAlerts: true,
    marketingEmails: false,
    soundEnabled: true,
    vibrate: true,
  })

  const [passwordForm, setPasswordForm] = useState({
    current: "",
    new: "",
    confirm: "",
    showCurrent: false,
    showNew: false,
    showConfirm: false,
  })

  const restaurant = {
    name: "The Bistro Grand",
    address: "123 Main Street, Downtown",
    city: "New York",
    zip: "10001",
    phone: "+1 (555) 987-6543",
    email: "info@bistrogrand.com",
    website: "www.bistrogrand.com",
    cuisine: "Modern European",
    openHour: "11:00 AM",
    closeHour: "11:00 PM",
  }

  const handleSave = async (section: string, successMsg: string) => {
    setSaving(section)
    await new Promise(r => setTimeout(r, 500))
    setSaving(null)
    toast({ title: "Saved", description: successMsg, variant: "success" })
  }

  const handleLogout = async () => {
    await logout()
    navigate("/staff/login")
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
          <Settings2 className="h-7 w-7 text-blue-500" />
          Settings
        </h1>
        <p className="text-muted-foreground mt-1">Manage your preferences, notifications, and account.</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="p-1.5 bg-white rounded-2xl border border-border/60 shadow-soft w-full sm:w-auto">
          <TabsTrigger value="general" className="rounded-xl data-[state=active]:shadow-md">General</TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-xl data-[state=active]:shadow-md">Notifications</TabsTrigger>
          <TabsTrigger value="privacy" className="rounded-xl data-[state=active]:shadow-md">Privacy</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6 mt-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
            <Card className="overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
              <CardHeader className="pb-3 flex flex-row items-start justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-blue-500" />
                    Restaurant Information
                  </CardTitle>
                  <CardDescription>Details of the restaurant you are assigned to.</CardDescription>
                </div>
                <Badge variant="muted" className="gap-1.5">
                  <Info className="h-3 w-3" />
                  View Only
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50/60 to-indigo-50/40 border border-blue-200/40">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <UtensilsCrossed className="h-5 w-5 text-white" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground font-medium">Restaurant</p>
                        <p className="font-bold truncate">{restaurant.name}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50/60 to-orange-50/40 border border-amber-200/40">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
                        <Globe className="h-5 w-5 text-white" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground font-medium">Cuisine Type</p>
                        <p className="font-bold truncate">{restaurant.cuisine}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {[
                    { icon: MapPin, label: "Address", value: `${restaurant.address}, ${restaurant.city}, ${restaurant.zip}` },
                    { icon: Phone, label: "Phone", value: restaurant.phone },
                    { icon: Mail, label: "Email", value: restaurant.email },
                    { icon: Globe, label: "Website", value: restaurant.website },
                    { icon: Clock, label: "Opening Hours", value: `${restaurant.openHour} – ${restaurant.closeHour}` },
                  ].map((item, i) => {
                    const Icon = item.icon
                    return (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-border/50 hover:bg-slate-50/60 transition-colors">
                        <div className="h-9 w-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                          <Icon className="h-4.5 w-4.5 text-muted-foreground" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">{item.label}</p>
                          <p className="font-semibold text-sm truncate">{item.value}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-emerald-500" />
                  Display Preferences
                </CardTitle>
                <CardDescription>Customize how the dashboard looks for you.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Language</Label>
                    <select className="h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                      <option>English (US)</option>
                      <option>Español</option>
                      <option>Français</option>
                      <option>中文</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Time Zone</Label>
                    <select className="h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                      <option>Eastern Time (ET) -05:00</option>
                      <option>Pacific Time (PT) -08:00</option>
                      <option>Central Europe (CET) +01:00</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end pt-1">
                  <Button onClick={() => handleSave("display", "Display preferences updated")} disabled={saving === "display"}>
                    {saving === "display" ? (
                      <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin mr-2" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Save Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6 mt-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bell className="h-5 w-5 text-amber-500" />
                  Push Notifications
                </CardTitle>
                <CardDescription>Choose which updates you want to receive in real-time.</CardDescription>
              </CardHeader>
              <CardContent className="divide-y divide-border/60">
                {[
                  { key: "newOrders", icon: UtensilsCrossed, title: "New Orders", desc: "Get notified when a new order is placed at your tables", gradient: "from-blue-500 to-indigo-600" },
                  { key: "foodReady", icon: BellRing, title: "Food Ready Alerts", desc: "When kitchen marks an order ready for pickup", gradient: "from-purple-500 to-violet-600" },
                  { key: "paymentReceived", icon: Mail, title: "Payment Updates", desc: "Confirmations when bills are paid successfully", gradient: "from-emerald-500 to-green-600" },
                  { key: "tableRequests", icon: MapPin, title: "Table Requests", desc: "Customers requesting assistance or the bill", gradient: "from-amber-500 to-orange-600" },
                  { key: "staffAlerts", icon: AlertTriangle, title: "Staff Priority Alerts", desc: "Urgent notifications, allergy warnings, rush orders", gradient: "from-red-500 to-rose-600" },
                ].map(item => {
                  const Icon = item.icon
                  const enabled = notifs[item.key as keyof typeof notifs]
                  return (
                    <div key={item.key} className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0">
                      <div className="flex items-center gap-3.5 min-w-0 flex-1">
                        <div className={cn("h-10 w-10 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-md shrink-0", item.gradient)}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-sm">{item.title}</p>
                          <p className="text-xs text-muted-foreground">{item.desc}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setNotifs(prev => ({ ...prev, [item.key]: !enabled }))}
                        className={cn(
                          "relative h-6 w-11 rounded-full transition-all shrink-0",
                          enabled ? "bg-blue-500 shadow-lg shadow-blue-500/25" : "bg-slate-200"
                        )}
                      >
                        <span className={cn(
                          "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-all",
                          enabled ? "left-[22px]" : "left-0.5"
                        )} />
                      </button>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Volume2 className="h-5 w-5 text-purple-500" />
                  Sound & Vibration
                </CardTitle>
                <CardDescription>Audible and tactile feedback preferences.</CardDescription>
              </CardHeader>
              <CardContent className="divide-y divide-border/60">
                {[
                  { key: "soundEnabled", icon: Volume2, title: "Sound Effects", desc: "Play a short sound when a new notification arrives" },
                  { key: "vibrate", icon: Smartphone, title: "Vibration (Mobile)", desc: "Vibrate device on priority alerts" },
                  { key: "marketingEmails", icon: Mail, title: "Weekly Digest", desc: "Receive weekly performance summary emails" },
                ].map(item => {
                  const Icon = item.icon
                  const enabled = notifs[item.key as keyof typeof notifs]
                  return (
                    <div key={item.key} className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0">
                      <div className="flex items-center gap-3.5 min-w-0 flex-1">
                        <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                          <Icon className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-sm">{item.title}</p>
                          <p className="text-xs text-muted-foreground">{item.desc}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setNotifs(prev => ({ ...prev, [item.key]: !enabled }))}
                        className={cn(
                          "relative h-6 w-11 rounded-full transition-all shrink-0",
                          enabled ? "bg-blue-500 shadow-lg shadow-blue-500/25" : "bg-slate-200"
                        )}
                      >
                        <span className={cn(
                          "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-all",
                          enabled ? "left-[22px]" : "left-0.5"
                        )} />
                      </button>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
            <div className="flex justify-end mt-5">
              <Button onClick={() => handleSave("notifs", "Notification preferences saved")} disabled={saving === "notifs"}>
                {saving === "notifs" ? (
                  <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Notification Settings
              </Button>
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6 mt-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
            <Card className="border-amber-200/50 bg-gradient-to-br from-amber-50/30 via-white to-orange-50/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <KeyRound className="h-5 w-5 text-amber-500" />
                  Change Password
                </CardTitle>
                <CardDescription>Strong passwords protect your account and customer data.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { key: "current", label: "Current Password", placeholder: "••••••••", showKey: "showCurrent", value: passwordForm.current },
                    { key: "new", label: "New Password", placeholder: "Min. 8 characters", showKey: "showNew", value: passwordForm.new },
                    { key: "confirm", label: "Confirm New", placeholder: "Re-type password", showKey: "showConfirm", value: passwordForm.confirm },
                  ].map(f => {
                    const show = passwordForm[f.showKey as keyof typeof passwordForm] as boolean
                    return (
                      <div key={f.key} className="space-y-1.5">
                        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{f.label}</Label>
                        <div className="relative">
                          <Lock className="absolute left-3.5 top-3 h-4.5 w-4.5 text-muted-foreground" />
                          <Input
                            type={show ? "text" : "password"}
                            placeholder={f.placeholder}
                            className="pl-10 pr-11 h-11"
                            value={f.value}
                            onChange={(e) => setPasswordForm({ ...passwordForm, [f.key]: e.target.value })}
                          />
                          <button
                            type="button"
                            onClick={() => setPasswordForm({ ...passwordForm, [f.showKey]: !show })}
                            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                          >
                            {show ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="flex items-start gap-2 p-3 rounded-xl bg-blue-50/50 border border-blue-200/40">
                  <Info className="h-4.5 w-4.5 text-blue-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-blue-800 space-y-0.5">
                    <p className="font-semibold">Password requirements</p>
                    <p>Minimum 8 characters, at least 1 uppercase letter and 1 number.</p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={() => handleSave("pwd", "Password changed successfully")} disabled={saving === "pwd" || !passwordForm.current || !passwordForm.new}>
                    {saving === "pwd" ? (
                      <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin mr-2" />
                    ) : (
                      <Lock className="h-4 w-4 mr-2" />
                    )}
                    Update Password
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-blue-500" />
                  Account Security
                </CardTitle>
                <CardDescription>Account and session management.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center gap-3.5">
                    <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                      <ShieldCheck className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">Account Status</p>
                      <p className="text-xs text-muted-foreground">Your account is verified and active</p>
                    </div>
                  </div>
                  <Badge variant="success" className="gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Active
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center gap-3.5">
                    <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                      <LogOut className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">End Current Session</p>
                      <p className="text-xs text-muted-foreground">Sign out on this device</p>
                    </div>
                  </div>
                  <Button variant="outline" onClick={handleLogout} className="gap-1.5">
                    <ChevronRight className="h-4 w-4" />
                    Sign Out
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl border border-red-200/40 hover:bg-red-50/30 transition-colors">
                  <div className="flex items-center gap-3.5">
                    <div className="h-10 w-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                      <Trash2 className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-red-700">Delete Account</p>
                      <p className="text-xs text-red-600/80">Permanently remove your staff account</p>
                    </div>
                  </div>
                  <Button variant="outline" className="gap-1.5 border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800">
                    Request Deletion
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
