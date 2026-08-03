import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Building2, Upload, MapPin, Phone, Mail, Globe, Clock, DollarSign,
  UtensilsCrossed, Save, Image as ImageIcon, ToggleLeft, ToggleRight,
  Star, CheckCircle2, ShieldCheck
} from "lucide-react"
import { motion } from "framer-motion"
import { useAuth, useRole } from "@/context/AuthContext"
import { useToast } from "@/components/ui/toast"
import { adminApi } from "@/api/orders"
import { cn, formatCurrency } from "@/lib/utils"
import type { Restaurant } from "@/types"

const mockRestaurant: Restaurant = {
  id: 1,
  name: "Azure Sky Bistro",
  description: "Contemporary fine dining experience featuring seasonal ingredients and craft cocktails. Rated among the top 10 restaurants in the city for three consecutive years.",
  address: "1423 Harbor Boulevard, Suite 200",
  city: "San Diego",
  state: "California",
  zipCode: "92101",
  phone: "+1 (619) 555-0142",
  email: "reservations@azuresky.com",
  website: "https://azureskybistro.com",
  logoUrl: "",
  bannerUrl: "",
  avgRating: 4.8,
  totalReviews: 1247,
  isActive: true,
  minOrderAmount: 25.00,
  deliveryFee: 4.99,
  taxRate: "8.25",
  openingHours: "11:00",
  closingHours: "23:00",
  cuisineType: "Modern American",
}

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

export default function RestaurantSettings() {
  const { toast } = useToast()
  const [restaurant, setRestaurant] = useState<Restaurant>(mockRestaurant)
  const [saving, setSaving] = useState(false)
  const [hours, setHours] = useState(
    daysOfWeek.reduce((acc, day, i) => {
      const open = i < 5 ? "11:00" : "10:00"
      const close = i === 5 ? "00:30" : (i === 6 ? "22:00" : "23:00")
      const closed = false
      acc[day] = { open, close, closed }
      return acc
    }, {} as Record<string, { open: string; close: string; closed: boolean }>)
  )

  const update = (key: keyof Restaurant, value: any) => {
    setRestaurant((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      toast({ title: "Restaurant saved!", description: "All changes have been applied successfully", variant: "success" })
    }, 900)
  }

  const toggleStatus = () => {
    const newState = !restaurant.isActive
    setRestaurant((prev) => ({ ...prev, isActive: newState }))
    toast({ title: newState ? "Restaurant is online" : "Restaurant marked offline", description: newState ? "Customers can now place orders" : "No new orders will be accepted", variant: newState ? "success" : "warning" })
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div className="flex items-start gap-4">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-orange-500 via-rose-500 to-violet-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
            <Building2 className="h-7 w-7 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">Restaurant Profile</h1>
              <Badge variant={restaurant.isActive ? "success" : "muted"} className="gap-1.5">
                <span className={cn("h-1.5 w-1.5 rounded-full animate-pulse", restaurant.isActive ? "bg-success-500" : "bg-slate-400")} />
                {restaurant.isActive ? "Live & Online" : "Offline"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">Manage your restaurant branding, info, and operational settings</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={toggleStatus} className="gap-2">
            {restaurant.isActive ? <ToggleRight className="h-4 w-4 text-success-500" /> : <ToggleLeft className="h-4 w-4 text-slate-400" />}
            {restaurant.isActive ? "Pause Orders" : "Resume Orders"}
          </Button>
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </motion.div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="hours">Hours</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6 mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2 space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Basic Information</CardTitle>
                  <CardDescription>What customers see when they discover your restaurant</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <Label>Restaurant Name *</Label>
                    <Input value={restaurant.name} onChange={(e) => update("name", e.target.value)} className="h-12 text-base font-medium" />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea rows={4} value={restaurant.description} onChange={(e) => update("description", e.target.value)} placeholder="Tell customers about your cuisine, atmosphere, and specialties..." />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2"><UtensilsCrossed className="h-4 w-4 text-muted-foreground" /> Cuisine Type</Label>
                      <Input value={restaurant.cuisineType} onChange={(e) => update("cuisineType", e.target.value)} placeholder="e.g. Italian, Sushi, American" />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2"><Globe className="h-4 w-4 text-muted-foreground" /> Website</Label>
                      <Input value={restaurant.website} onChange={(e) => update("website", e.target.value)} placeholder="https://..." />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contact & Location</CardTitle>
                  <CardDescription>Where customers can find and reach you</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground" /> Street Address</Label>
                    <Input value={restaurant.address} onChange={(e) => update("address", e.target.value)} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>City</Label>
                      <Input value={restaurant.city} onChange={(e) => update("city", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>State</Label>
                      <Input value={restaurant.state} onChange={(e) => update("state", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>ZIP Code</Label>
                      <Input value={restaurant.zipCode} onChange={(e) => update("zipCode", e.target.value)} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" /> Phone</Label>
                      <Input value={restaurant.phone} onChange={(e) => update("phone", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" /> Email</Label>
                      <Input value={restaurant.email} onChange={(e) => update("email", e.target.value)} type="email" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Live Preview</CardTitle>
                  <CardDescription>How customers see you</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-xl overflow-hidden border border-slate-200 bg-gradient-to-br from-orange-100 via-amber-50 to-rose-100 aspect-[4/2] relative">
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute bottom-4 left-4 right-4 flex items-end gap-3">
                      <Avatar className="h-14 w-14 ring-4 ring-white shadow-xl border-0 bg-gradient-to-br from-orange-500 to-rose-500">
                        <AvatarFallback name={restaurant.name} />
                      </Avatar>
                      <div className="text-white">
                        <p className="font-black text-lg drop-shadow-lg">{restaurant.name}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <Star className="h-3.5 w-3.5 fill-amber-300 text-amber-300" />
                          <span className="text-sm font-bold">{restaurant.avgRating}</span>
                          <span className="text-xs opacity-80">({restaurant.totalReviews} reviews)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 space-y-3 text-sm">
                    <div className="flex items-center gap-2 text-slate-600">
                      <MapPin className="h-4 w-4 text-slate-400" />
                      <span className="truncate">{restaurant.city}, {restaurant.state}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <UtensilsCrossed className="h-4 w-4 text-slate-400" />
                      <span>{restaurant.cuisineType}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <DollarSign className="h-4 w-4 text-slate-400" />
                      <span>Min. order {formatCurrency(restaurant.minOrderAmount)} · Delivery {formatCurrency(restaurant.deliveryFee)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-emerald-500" />
                    Verification Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                    <div className="h-10 w-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-emerald-900">All details verified</p>
                      <p className="text-xs text-emerald-700 mt-0.5">Profile is complete and public</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <Badge variant="success" className="justify-center py-1.5">Address ✓</Badge>
                    <Badge variant="success" className="justify-center py-1.5">Phone ✓</Badge>
                    <Badge variant="success" className="justify-center py-1.5">Tax ID ✓</Badge>
                    <Badge variant="success" className="justify-center py-1.5">License ✓</Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="branding" className="space-y-6 mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Restaurant Logo</CardTitle>
                  <CardDescription>Appears in menus, orders, and receipts. SVG or square PNG recommended.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-square max-w-[260px] mx-auto rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-colors group">
                    <div className="h-20 w-20 rounded-full bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center shadow-xl">
                      <Building2 className="h-10 w-10 text-white" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-slate-900 group-hover:text-orange-700">{restaurant.name}</p>
                      <p className="text-xs text-slate-500 mt-1">Current logo · 512×512</p>
                    </div>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-white/80 rounded-2xl flex items-center justify-center transition-opacity">
                      <Button className="gap-2"><Upload className="h-4 w-4" /> Upload New</Button>
                    </div>
                  </div>
                  <div className="mt-5 flex gap-2">
                    <Button variant="outline" className="flex-1 gap-2"><ImageIcon className="h-4 w-4" /> Choose File</Button>
                    <Button variant="ghost" className="text-slate-500">Remove</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Banner / Hero Image</CardTitle>
                  <CardDescription>Shown at the top of your menu page. 1200×600 recommended.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-[2/1] rounded-2xl border-2 border-dashed border-slate-300 bg-gradient-to-br from-orange-100 via-amber-50 to-rose-100 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-orange-400 transition-colors group relative overflow-hidden">
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-black/40 transition-opacity flex items-center justify-center">
                      <Button className="gap-2"><Upload className="h-4 w-4" /> Change Banner</Button>
                    </div>
                    <ImageIcon className="h-12 w-12 text-orange-400" />
                    <div className="text-center">
                      <p className="text-sm font-bold text-slate-700">Upload your hero banner</p>
                      <p className="text-xs text-slate-500 mt-1">JPG, PNG up to 8MB</p>
                    </div>
                  </div>
                  <div className="mt-5 grid grid-cols-3 gap-2">
                    {["from-orange-500 to-rose-500", "from-violet-500 to-indigo-600", "from-emerald-500 to-teal-600"].map((g, i) => (
                      <div key={i} className={`h-14 rounded-xl bg-gradient-to-br ${g} cursor-pointer hover:ring-2 ring-offset-2 ring-orange-400 transition-all`} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="hours" className="space-y-6 mt-0">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5 text-orange-500" />
                  Weekly Operating Hours
                </CardTitle>
                <CardDescription>Set your opening hours. Closed days won't accept online orders.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {daysOfWeek.map((day, i) => {
                  const h = hours[day]
                  const isToday = new Date().getDay() === (i + 1 === 7 ? 0 : i + 1)
                  return (
                    <div key={day} className={cn(
                      "flex items-center gap-4 p-4 rounded-xl border transition-all",
                      h.closed ? "bg-slate-50 border-slate-200" : (isToday ? "bg-orange-50 border-orange-200" : "bg-white border-slate-200 hover:border-slate-300")
                    )}>
                      <div className="w-32 shrink-0">
                        <p className="text-sm font-bold text-slate-900 flex items-center gap-2">
                          {day}
                          {isToday && <Badge variant="default" className="text-[10px] h-5">Today</Badge>}
                        </p>
                      </div>
                      <div className={cn("flex items-center gap-3 flex-1", h.closed && "opacity-40 pointer-events-none")}>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input type="time" className="pl-9 w-36" value={h.open} onChange={(e) => setHours({ ...hours, [day]: { ...h, open: e.target.value } })} />
                        </div>
                        <span className="text-slate-400 font-semibold">to</span>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input type="time" className="pl-9 w-36" value={h.close} onChange={(e) => setHours({ ...hours, [day]: { ...h, close: e.target.value } })} />
                        </div>
                      </div>
                      <Button
                        variant={h.closed ? "outline" : "ghost"}
                        size="sm"
                        className={cn("gap-1.5 text-xs shrink-0", h.closed && "text-slate-500")}
                        onClick={() => setHours({ ...hours, [day]: { ...h, closed: !h.closed } })}
                      >
                        {h.closed ? "Mark Open" : "Mark Closed"}
                      </Button>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="operations" className="space-y-6 mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Pricing & Orders</CardTitle>
                  <CardDescription>Financial settings for customer orders</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2"><DollarSign className="h-4 w-4 text-muted-foreground" /> Minimum Order Amount</Label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-semibold">$</span>
                      <Input type="number" step="0.01" className="pl-8 h-12 text-lg font-bold" value={restaurant.minOrderAmount} onChange={(e) => update("minOrderAmount", parseFloat(e.target.value) || 0)} />
                    </div>
                    <p className="text-xs text-muted-foreground">Delivery and takeaway minimum</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2"><DollarSign className="h-4 w-4 text-muted-foreground" /> Delivery Fee</Label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-semibold">$</span>
                      <Input type="number" step="0.01" className="pl-8 h-12 text-lg font-bold" value={restaurant.deliveryFee} onChange={(e) => update("deliveryFee", parseFloat(e.target.value) || 0)} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Tax Rate (%)</Label>
                    <div className="relative">
                      <Input type="number" step="0.01" className="pr-9 h-12 text-lg font-bold" value={restaurant.taxRate} onChange={(e) => update("taxRate", e.target.value)} />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-semibold">%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Order Settings</CardTitle>
                  <CardDescription>Operational behavior for incoming orders</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { label: "Auto-accept orders", desc: "Skip manual confirmation for new orders", on: true },
                    { label: "Enable delivery", desc: "Accept orders from delivery partners", on: true },
                    { label: "Accept takeaway", desc: "Allow customers to pick up orders", on: true },
                    { label: "Notify on new orders", desc: "Send SMS/email alerts to staff", on: true },
                    { label: "Require phone number", desc: "Mandatory contact for all orders", on: false },
                  ].map((opt, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{opt.label}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{opt.desc}</p>
                      </div>
                      <button
                        onClick={() => {}}
                        className={cn(
                          "h-6 w-11 rounded-full transition-all relative shrink-0",
                          opt.on ? "bg-orange-500" : "bg-slate-300"
                        )}
                      >
                        <span className={cn(
                          "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all",
                          opt.on ? "left-5" : "left-0.5"
                        )} />
                      </button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
