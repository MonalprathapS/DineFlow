import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import {
  User,
  Mail,
  Phone,
  Camera,
  Lock,
  KeyRound,
  ShieldCheck,
  Save,
  CalendarDays,
  MapPin,
  Briefcase,
  Award,
  Star,
  ChevronRight,
  Edit3,
  CheckCircle2,
} from "lucide-react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/components/ui/toast"
import { cn, formatDate } from "@/lib/utils"

export default function Profile() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { toast } = useToast()
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: user?.name || "Alex Johnson",
    email: user?.email || "alex.johnson@dineflow.com",
    phone: user?.phone || "+1 (555) 123-4567",
    bio: "Senior staff member with 5+ years in restaurant management. Passionate about great service and customer satisfaction.",
    restaurant: "The Bistro Grand",
    location: "Downtown, Main St.",
  })

  const stats = [
    { label: "Tables Assigned", value: "156", icon: MapPin, color: "from-blue-500 to-indigo-600" },
    { label: "Orders Served", value: "3,248", icon: Briefcase, color: "from-emerald-500 to-green-600" },
    { label: "Customer Rating", value: "4.9", icon: Star, color: "from-amber-500 to-orange-600", suffix: "/5" },
    { label: "Months Active", value: "32", icon: Award, color: "from-purple-500 to-violet-600" },
  ]

  const handleSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 500))
    setSaving(false)
    setEditing(false)
    toast({ title: "Profile updated", description: "Your changes have been saved successfully", variant: "success" })
  }

  const roleGradient = user?.role === "ADMIN" ? "from-purple-500 to-violet-600" : "from-blue-500 to-indigo-600"

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
            <User className="h-7 w-7 text-blue-500" />
            My Profile
          </h1>
          <p className="text-muted-foreground mt-1">Manage your personal information and account settings.</p>
        </div>
        <div className="flex gap-2">
          {!editing ? (
            <Button onClick={() => setEditing(true)}>
              <Edit3 className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={() => setEditing(false)} disabled={saving}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Changes
              </Button>
            </>
          )}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <div className="lg:col-span-1 space-y-6">
          <Card className="overflow-hidden">
            <div className="h-32 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 relative">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_50%,white_1px,transparent_1px)] bg-[length:20px_20px]" />
            </div>
            <CardContent className="pt-0 -mt-12 relative">
              <div className="flex justify-center">
                <div className="relative group">
                  <Avatar className="h-24 w-24 ring-4 ring-white shadow-elevated">
                    <AvatarFallback name={form.name} className="text-2xl font-black bg-gradient-to-br from-blue-500 to-indigo-600 text-white" />
                  </Avatar>
                  <button className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-white border-2 border-border shadow-lg flex items-center justify-center text-muted-foreground hover:text-blue-600 hover:scale-105 transition-all">
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="text-center mt-4 space-y-1.5">
                <h2 className="text-xl font-black tracking-tight">{form.name}</h2>
                <Badge className={cn("gap-1.5 text-xs px-3 py-1 border-0 text-white bg-gradient-to-r", roleGradient)}>
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {user?.role || "STAFF"}
                </Badge>
                <p className="text-sm text-muted-foreground">{form.email}</p>
              </div>

              <div className="mt-5 pt-5 border-t border-border/60 space-y-2.5">
                <div className="flex items-center gap-3 text-sm">
                  <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                    <Briefcase className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Restaurant</p>
                    <p className="font-semibold truncate">{form.restaurant}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <MapPin className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Work Location</p>
                    <p className="font-semibold truncate">{form.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                    <CalendarDays className="h-4 w-4 text-amber-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Joined</p>
                    <p className="font-semibold">{formatDate(new Date(Date.now() - 32 * 30 * 24 * 60 * 60 * 1000))}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-11 w-11 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <Lock className="h-5 w-5" />
                </div>
                <Badge variant="muted" className="bg-white/20 text-white border-0 backdrop-blur-sm">Security</Badge>
              </div>
              <h3 className="font-bold text-lg">Change Password</h3>
              <p className="text-white/70 text-sm mt-1 mb-4">Update your password to keep your account secure.</p>
              <Button
                variant="white"
                className="w-full bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm justify-start gap-2"
                onClick={() => navigate("/staff/settings")}
              >
                <KeyRound className="h-4 w-4" />
                Go to Security Settings
                <ChevronRight className="h-4 w-4 ml-auto" />
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-500" />
                  Personal Information
                </CardTitle>
                <CardDescription>Basic account details. Click edit to make changes.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Full Name</Label>
                    <div className="relative">
                      <User className={cn("absolute left-3.5 top-3 h-4.5 w-4.5", editing ? "text-blue-500" : "text-muted-foreground")} />
                      {editing ? (
                        <Input
                          className="pl-10 h-11"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                        />
                      ) : (
                        <div className="h-11 pl-10 pr-4 rounded-xl bg-slate-50/70 border border-border/60 flex items-center font-semibold">
                          {form.name}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Role</Label>
                    <div className="h-11 pl-4 pr-4 rounded-xl bg-gradient-to-r from-blue-50/60 to-indigo-50/60 border border-blue-200/50 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4.5 w-4.5 text-blue-600" />
                        <span className="font-bold text-blue-700">{user?.role || "STAFF"}</span>
                      </div>
                      <Badge variant="muted" className="text-[10px] bg-blue-100/50 text-blue-700 border-0">
                        Active
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Email Address</Label>
                    <div className="relative">
                      <Mail className={cn("absolute left-3.5 top-3 h-4.5 w-4.5", editing ? "text-blue-500" : "text-muted-foreground")} />
                      {editing ? (
                        <Input
                          type="email"
                          className="pl-10 h-11"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                        />
                      ) : (
                        <div className="h-11 pl-10 pr-4 rounded-xl bg-slate-50/70 border border-border/60 flex items-center font-medium">
                          {form.email}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Phone Number</Label>
                    <div className="relative">
                      <Phone className={cn("absolute left-3.5 top-3 h-4.5 w-4.5", editing ? "text-blue-500" : "text-muted-foreground")} />
                      {editing ? (
                        <Input
                          type="tel"
                          className="pl-10 h-11"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        />
                      ) : (
                        <div className="h-11 pl-10 pr-4 rounded-xl bg-slate-50/70 border border-border/60 flex items-center font-medium">
                          {form.phone}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Short Bio</Label>
                  {editing ? (
                    <Textarea
                      rows={4}
                      value={form.bio}
                      onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    />
                  ) : (
                    <div className="p-4 rounded-xl bg-slate-50/70 border border-border/60 text-muted-foreground text-sm leading-relaxed">
                      {form.bio}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="h-5 w-5 text-amber-500" />
                  Performance Overview
                </CardTitle>
                <CardDescription>Your key metrics and achievements.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {stats.map((s, i) => {
                    const Icon = s.icon
                    return (
                      <motion.div
                        key={s.label}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 + i * 0.05 }}
                        whileHover={{ y: -3 }}
                      >
                        <Card className="h-full overflow-hidden hover:shadow-elevated transition-all">
                          <div className={cn("h-1 bg-gradient-to-r", s.color)} />
                          <CardContent className="p-4">
                            <div className={cn("h-10 w-10 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg", s.color)}>
                              <Icon className="h-5 w-5 text-white" />
                            </div>
                            <p className="text-2xl font-black mt-3 tracking-tight">
                              {s.value}
                              {s.suffix && <span className="text-sm font-bold text-muted-foreground">{s.suffix}</span>}
                            </p>
                            <p className="text-xs font-medium text-muted-foreground mt-0.5">{s.label}</p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="overflow-hidden border-0 bg-gradient-to-br from-emerald-50 via-teal-50/40 to-cyan-50/40">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
                    <CheckCircle2 className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">Account Verified</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Your identity and staff credentials have been verified. All features are fully enabled.
                      For any permission changes, please contact your restaurant administrator.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
