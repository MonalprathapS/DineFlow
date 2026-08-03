import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Ticket, Plus, Search, MoreHorizontal, Percent, DollarSign, Edit3, Trash2,
  ToggleLeft, ToggleRight, Copy, CheckCircle2, XCircle, Calendar, Gauge, Users,
  Tag, TrendingUp, Download, Filter
} from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/components/ui/toast"
import { cn, formatCurrency, formatDate } from "@/lib/utils"

type DiscountType = "PERCENTAGE" | "FIXED"

interface Coupon {
  id: number
  code: string
  discountType: DiscountType
  discountValue: number
  minOrderAmount: number
  validFrom: string
  validUntil: string
  maxUses: number
  currentUses: number
  isActive: boolean
  description?: string
}

const mockCoupons: Coupon[] = [
  {
    id: 1, code: "WELCOME10", discountType: "PERCENTAGE", discountValue: 10, minOrderAmount: 20,
    validFrom: "2026-07-01", validUntil: "2026-09-30", maxUses: 500, currentUses: 187, isActive: true,
    description: "New customer welcome discount",
  },
  {
    id: 2, code: "SUMMER25", discountType: "FIXED", discountValue: 25, minOrderAmount: 80,
    validFrom: "2026-06-15", validUntil: "2026-08-31", maxUses: 200, currentUses: 142, isActive: true,
    description: "Summer special flat discount",
  },
  {
    id: 3, code: "VIP50", discountType: "PERCENTAGE", discountValue: 15, minOrderAmount: 0,
    validFrom: "2026-01-01", validUntil: "2026-12-31", maxUses: 100, currentUses: 38, isActive: true,
    description: "Exclusive VIP member discount",
  },
  {
    id: 4, code: "FREEDEL", discountType: "FIXED", discountValue: 5.99, minOrderAmount: 30,
    validFrom: "2026-08-01", validUntil: "2026-08-31", maxUses: 1000, currentUses: 56, isActive: true,
    description: "Free delivery for August",
  },
  {
    id: 5, code: "HOLIDAY30", discountType: "PERCENTAGE", discountValue: 30, minOrderAmount: 100,
    validFrom: "2026-12-01", validUntil: "2026-12-25", maxUses: 300, currentUses: 0, isActive: false,
    description: "Holiday season big discount",
  },
]

export default function Coupons() {
  const { toast } = useToast()
  const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons)
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Coupon | null>(null)
  const [form, setForm] = useState({
    code: "", discountType: "PERCENTAGE" as DiscountType, discountValue: 0, minOrderAmount: 0,
    validFrom: "", validUntil: "", maxUses: 100, isActive: true, description: "",
  })

  const filtered = coupons.filter((c) =>
    c.code.toLowerCase().includes(search.toLowerCase()) ||
    (c.description || "").toLowerCase().includes(search.toLowerCase())
  )

  const openAdd = () => {
    setEditing(null)
    const today = new Date()
    const nextMonth = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
    setForm({
      code: "", discountType: "PERCENTAGE", discountValue: 10, minOrderAmount: 0,
      validFrom: today.toISOString().slice(0, 10),
      validUntil: nextMonth.toISOString().slice(0, 10),
      maxUses: 100, isActive: true, description: "",
    })
    setDialogOpen(true)
  }

  const openEdit = (c: Coupon) => {
    setEditing(c)
    setForm({
      code: c.code, discountType: c.discountType, discountValue: c.discountValue,
      minOrderAmount: c.minOrderAmount, validFrom: c.validFrom, validUntil: c.validUntil,
      maxUses: c.maxUses, isActive: c.isActive, description: c.description || "",
    })
    setDialogOpen(true)
  }

  const handleSave = () => {
    if (!form.code.trim() || form.discountValue <= 0) return
    if (editing) {
      setCoupons((prev) => prev.map((c) => c.id === editing.id ? { ...c, ...form } : c))
      toast({ title: "Coupon updated", description: `${form.code} changes saved`, variant: "success" })
    } else {
      const newCoupon: Coupon = {
        id: Date.now(), ...form, currentUses: 0,
      }
      setCoupons((prev) => [...prev, newCoupon])
      toast({ title: "Coupon created", description: `${form.code} is now live`, variant: "success" })
    }
    setDialogOpen(false)
  }

  const handleDelete = (c: Coupon) => {
    setCoupons((prev) => prev.filter((x) => x.id !== c.id))
    toast({ title: "Coupon deleted", description: `${c.code} removed`, variant: "destructive" })
  }

  const toggleActive = (c: Coupon) => {
    setCoupons((prev) => prev.map((x) => x.id === c.id ? { ...x, isActive: !x.isActive } : x))
    toast({ title: c.isActive ? "Coupon disabled" : "Coupon enabled" })
  }

  const copyCode = (code: string) => {
    navigator.clipboard?.writeText(code)
    toast({ title: "Copied!", description: `Coupon code ${code} copied` })
  }

  const totalRedeemed = coupons.reduce((a, b) => a + b.currentUses, 0)
  const activeCoupons = coupons.filter((c) => c.isActive).length

  const stats = [
    { label: "Total Coupons", value: coupons.length, Icon: Tag, color: "from-violet-500 to-indigo-600" },
    { label: "Active Coupons", value: activeCoupons, Icon: CheckCircle2, color: "from-emerald-500 to-teal-600" },
    { label: "Total Redeemed", value: totalRedeemed, Icon: TrendingUp, color: "from-orange-500 to-rose-500" },
    { label: "Avg Savings/Coupon", value: formatCurrency(8.42), Icon: DollarSign, color: "from-blue-500 to-cyan-600" },
  ]

  const formatDiscount = (c: Coupon) =>
    c.discountType === "PERCENTAGE" ? `${c.discountValue}%` : formatCurrency(c.discountValue)

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Coupons & Promotions</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create and manage discount codes, flash sales, and loyalty rewards
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" /> Export
          </Button>
          <Button onClick={openAdd} className="gap-2">
            <Plus className="h-4 w-4" /> New Coupon
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => {
          const Icon = s.Icon
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="border-0 text-white overflow-hidden relative h-full">
                <div className={cn("absolute inset-0 bg-gradient-to-br", s.color)} />
                <div className="absolute -right-8 -bottom-8 h-28 w-28 rounded-full bg-white/10 blur-2xl" />
                <CardContent className="relative p-5">
                  <div className="h-11 w-11 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center mb-3">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <p className="text-2xl font-black tracking-tight">{s.value}</p>
                  <p className="text-sm font-medium text-white/80 mt-1">{s.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="text-lg">All Coupons</CardTitle>
            <CardDescription>{filtered.length} discount codes</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search coupon code..."
                className="pl-10 h-10 w-64"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50">
                  <th className="text-left py-3.5 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Coupon
                  </th>
                  <th className="text-left py-3.5 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Discount
                  </th>
                  <th className="text-left py-3.5 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Min Order
                  </th>
                  <th className="text-left py-3.5 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Validity
                  </th>
                  <th className="text-center py-3.5 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Usage
                  </th>
                  <th className="text-center py-3.5 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-right py-3.5 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, i) => {
                  const usagePct = c.maxUses > 0 ? Math.min((c.currentUses / c.maxUses) * 100, 100) : 0
                  return (
                    <motion.tr
                      key={c.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shrink-0">
                            <Ticket className="h-5 w-5 text-white" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-mono font-bold text-sm text-slate-900 tracking-wide">{c.code}</p>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => copyCode(c.code)}
                                title="Copy code"
                              >
                                <Copy className="h-3.5 w-3.5 text-slate-500" />
                              </Button>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5 truncate max-w-[200px]">
                              {c.description || "No description"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-3">
                        <Badge variant="outline" className={cn(
                          "gap-1.5 border-0 font-bold",
                          c.discountType === "PERCENTAGE"
                            ? "bg-orange-500/10 text-orange-700"
                            : "bg-emerald-500/10 text-emerald-700"
                        )}>
                          {c.discountType === "PERCENTAGE" ? (
                            <Percent className="h-3.5 w-3.5" />
                          ) : (
                            <DollarSign className="h-3.5 w-3.5" />
                          )}
                          {formatDiscount(c)}
                        </Badge>
                      </td>
                      <td className="py-4 px-3">
                        <p className="text-sm text-slate-700 font-medium">
                          {c.minOrderAmount > 0 ? formatCurrency(c.minOrderAmount) : "No minimum"}
                        </p>
                      </td>
                      <td className="py-4 px-3">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Calendar className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                          <span>
                            {formatDate(c.validFrom)} → {formatDate(c.validUntil)}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-3">
                        <div className="flex flex-col gap-1.5 items-center">
                          <div className="w-24 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className={cn(
                                "h-full rounded-full transition-all",
                                usagePct > 80 ? "bg-red-500" : usagePct > 50 ? "bg-orange-500" : "bg-emerald-500"
                              )}
                              style={{ width: `${usagePct}%` }}
                            />
                          </div>
                          <div className="flex items-center gap-1 text-xs">
                            <Users className="h-3 w-3 text-slate-400" />
                            <span className="font-bold text-slate-700">{c.currentUses}</span>
                            <span className="text-slate-400">/ {c.maxUses}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-3">
                        <div className="flex items-center justify-center">
                          <Badge variant={c.isActive ? "success" : "muted"} className="gap-1.5">
                            <span className={cn(
                              "h-1.5 w-1.5 rounded-full",
                              c.isActive ? "bg-success-500" : "bg-slate-400"
                            )} />
                            {c.isActive ? "Active" : "Disabled"}
                          </Badge>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className={cn(
                              "h-9 w-9",
                              c.isActive ? "text-orange-600 hover:bg-orange-50" : "text-emerald-600 hover:bg-emerald-50"
                            )}
                            onClick={() => toggleActive(c)}
                            title="Toggle active"
                          >
                            {c.isActive ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-9 w-9">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuLabel>Manage</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => openEdit(c)}>
                                <Edit3 className="h-4 w-4 mr-2" /> Edit Coupon
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => copyCode(c.code)}>
                                <Copy className="h-4 w-4 mr-2" /> Copy Code
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => toggleActive(c)}>
                                {c.isActive ? (
                                  <><XCircle className="h-4 w-4 mr-2" /> Disable</>
                                ) : (
                                  <><CheckCircle2 className="h-4 w-4 mr-2" /> Enable</>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleDelete(c)} className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </motion.tr>
                  )
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7}>
                      <div className="py-20 text-center">
                        <Filter className="h-12 w-12 mx-auto text-slate-300 mb-4" />
                        <p className="text-sm font-semibold text-slate-900">No coupons found</p>
                        <p className="text-xs text-slate-500 mt-1">Try another search or create a new coupon</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Coupon" : "Create New Coupon"}</DialogTitle>
            <DialogDescription>
              {editing ? "Update coupon parameters" : "Configure discount code details"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Coupon Code *</Label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="e.g. SUMMER20"
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                    className="pl-10 font-mono tracking-wider uppercase"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Discount Type *</Label>
                <Select value={form.discountType} onValueChange={(v: DiscountType) => setForm({ ...form, discountType: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PERCENTAGE">
                      <div className="flex items-center gap-2">
                        <Percent className="h-4 w-4" /> Percentage (%)
                      </div>
                    </SelectItem>
                    <SelectItem value="FIXED">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" /> Fixed Amount ($)
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  {form.discountType === "PERCENTAGE" ? (
                    <><Percent className="h-3.5 w-3.5 text-slate-400" /> Discount % *</>
                  ) : (
                    <><DollarSign className="h-3.5 w-3.5 text-slate-400" /> Discount $ *</>
                  )}
                </Label>
                <Input
                  type="number"
                  min={0}
                  max={form.discountType === "PERCENTAGE" ? 100 : undefined}
                  step={form.discountType === "PERCENTAGE" ? 1 : 0.01}
                  value={form.discountValue}
                  onChange={(e) => setForm({ ...form, discountValue: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  <DollarSign className="h-3.5 w-3.5 text-slate-400" /> Minimum Order
                </Label>
                <Input
                  type="number"
                  min={0}
                  step={0.01}
                  value={form.minOrderAmount}
                  onChange={(e) => setForm({ ...form, minOrderAmount: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" /> Valid From *
                </Label>
                <Input
                  type="date"
                  value={form.validFrom}
                  onChange={(e) => setForm({ ...form, validFrom: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" /> Valid Until *
                </Label>
                <Input
                  type="date"
                  value={form.validUntil}
                  onChange={(e) => setForm({ ...form, validUntil: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  <Gauge className="h-3.5 w-3.5 text-slate-400" /> Max Uses
                </Label>
                <Input
                  type="number"
                  min={0}
                  value={form.maxUses}
                  onChange={(e) => setForm({ ...form, maxUses: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <div
                  className="h-11 px-4 rounded-xl border border-input bg-background/80 flex items-center justify-between cursor-pointer"
                  onClick={() => setForm({ ...form, isActive: !form.isActive })}
                >
                  <span className="text-sm font-medium">{form.isActive ? "Active" : "Disabled"}</span>
                  {form.isActive ? (
                    <ToggleRight className="h-5 w-5 text-orange-600" />
                  ) : (
                    <ToggleLeft className="h-5 w-5 text-slate-400" />
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                placeholder="Internal description (optional)"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={!form.code.trim() || form.discountValue <= 0}>
              {editing ? "Save Changes" : "Create Coupon"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
