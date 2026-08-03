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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Users, Plus, Search, Edit3, Trash2, MoreHorizontal, Mail, Phone, ShieldCheck,
  UtensilsCrossed, UserCheck, ChefHat, XCircle, CheckCircle2, Ban, Briefcase,
  Calendar, Star, Filter
} from "lucide-react"
import { motion } from "framer-motion"
import { useAuth, useRole } from "@/context/AuthContext"
import { useToast } from "@/components/ui/toast"
import { adminApi } from "@/api/orders"
import { cn, formatDate } from "@/lib/utils"
import type { UserRole, UserResponse } from "@/types"

const roleStyles: Record<UserRole, { bg: string; text: string; label: string; Icon: any }> = {
  ADMIN: { bg: "bg-violet-500/10", text: "text-violet-700", label: "Admin", Icon: ShieldCheck },
  KITCHEN: { bg: "bg-orange-500/10", text: "text-orange-700", label: "Kitchen Staff", Icon: ChefHat },
  STAFF: { bg: "bg-blue-500/10", text: "text-blue-700", label: "Floor Staff", Icon: UserCheck },
  CUSTOMER: { bg: "bg-slate-500/10", text: "text-slate-700", label: "Customer", Icon: Users },
}

interface Employee extends UserResponse {
  assignedTables?: number
  todayOrders?: number
  totalRatings?: number
  avgRating?: number
  joinedAt?: string
  imageUrl?: string
}

const mockEmployees: Employee[] = [
  { id: 1, name: "Emma Davis", email: "emma.davis@azuresky.com", phone: "+1 (619) 555-0101", role: "STAFF", isActive: true, restaurantId: 1, restaurantName: "Azure Sky", assignedTables: 6, todayOrders: 32, avgRating: 4.9, totalRatings: 187, joinedAt: "2024-03-15" },
  { id: 2, name: "James Wilson", email: "james.wilson@azuresky.com", phone: "+1 (619) 555-0102", role: "STAFF", isActive: true, restaurantId: 1, restaurantName: "Azure Sky", assignedTables: 5, todayOrders: 28, avgRating: 4.7, totalRatings: 142, joinedAt: "2024-05-22" },
  { id: 3, name: "Marco Rossi", email: "marco.rossi@azuresky.com", phone: "+1 (619) 555-0103", role: "KITCHEN", isActive: true, restaurantId: 1, restaurantName: "Azure Sky", todayOrders: 114, avgRating: 4.9, totalRatings: 523, joinedAt: "2023-11-04" },
  { id: 4, name: "Sarah Kim", email: "sarah.kim@azuresky.com", phone: "+1 (619) 555-0104", role: "STAFF", isActive: true, restaurantId: 1, restaurantName: "Azure Sky", assignedTables: 4, todayOrders: 24, avgRating: 4.8, totalRatings: 201, joinedAt: "2025-01-10" },
  { id: 5, name: "Alex Johnson", email: "alex.j@azuresky.com", phone: "+1 (619) 555-0105", role: "STAFF", isActive: false, restaurantId: 1, restaurantName: "Azure Sky", assignedTables: 0, todayOrders: 0, avgRating: 4.5, totalRatings: 88, joinedAt: "2025-02-28" },
  { id: 6, name: "Priya Patel", email: "priya.patel@azuresky.com", phone: "+1 (619) 555-0106", role: "KITCHEN", isActive: true, restaurantId: 1, restaurantName: "Azure Sky", todayOrders: 98, avgRating: 4.8, totalRatings: 311, joinedAt: "2024-09-07" },
  { id: 7, name: "Jordan Reyes", email: "jordan.reyes@azuresky.com", phone: "+1 (619) 555-0107", role: "ADMIN", isActive: true, restaurantId: 1, restaurantName: "Azure Sky", todayOrders: 0, avgRating: 5.0, totalRatings: 12, joinedAt: "2023-06-15" },
  { id: 8, name: "Lisa Tran", email: "lisa.tran@azuresky.com", phone: "+1 (619) 555-0108", role: "STAFF", isActive: true, restaurantId: 1, restaurantName: "Azure Sky", assignedTables: 5, todayOrders: 30, avgRating: 4.8, totalRatings: 267, joinedAt: "2024-12-01" },
]

export default function Employees() {
  const { toast } = useToast()
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees)
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Employee | null>(null)
  const [form, setForm] = useState({ name: "", email: "", phone: "", role: "STAFF" as UserRole, isActive: true })

  const filtered = employees.filter((e) => {
    const s = search.toLowerCase()
    const match = e.name.toLowerCase().includes(s) || e.email.toLowerCase().includes(s) || (e.phone || "").toLowerCase().includes(s)
    const roleMatch = roleFilter === "all" || e.role === roleFilter
    return match && roleMatch
  })

  const openAdd = () => {
    setEditing(null)
    setForm({ name: "", email: "", phone: "", role: "STAFF", isActive: true })
    setDialogOpen(true)
  }

  const openEdit = (e: Employee) => {
    setEditing(e)
    setForm({ name: e.name, email: e.email, phone: e.phone || "", role: e.role, isActive: e.isActive })
    setDialogOpen(true)
  }

  const handleSave = () => {
    if (!form.name.trim() || !form.email.trim()) return
    if (editing) {
      setEmployees((prev) => prev.map((e) => e.id === editing.id ? { ...e, ...form } : e))
      toast({ title: "Employee updated", description: `${form.name} changes saved`, variant: "success" })
    } else {
      const newEmp: Employee = {
        id: Date.now(), ...form, restaurantId: 1, restaurantName: "Azure Sky",
        assignedTables: 0, todayOrders: 0, avgRating: 0, totalRatings: 0, joinedAt: new Date().toISOString().slice(0, 10),
      }
      setEmployees((prev) => [...prev, newEmp])
      toast({ title: "Employee added", description: `${form.name} invited via email`, variant: "success" })
    }
    setDialogOpen(false)
  }

  const handleDelete = (e: Employee) => {
    setEmployees((prev) => prev.filter((x) => x.id !== e.id))
    toast({ title: "Employee removed", description: `${e.name} deleted`, variant: "destructive" })
  }

  const toggleActive = (e: Employee) => {
    setEmployees((prev) => prev.map((x) => x.id === e.id ? { ...x, isActive: !x.isActive } : x))
    toast({ title: e.isActive ? "Employee deactivated" : "Employee activated", variant: "info" })
  }

  const stats = [
    { label: "Total Staff", value: employees.length, Icon: Users, color: "from-violet-500 to-indigo-600" },
    { label: "Active", value: employees.filter((e) => e.isActive).length, Icon: CheckCircle2, color: "from-emerald-500 to-teal-600" },
    { label: "Kitchen", value: employees.filter((e) => e.role === "KITCHEN").length, Icon: ChefHat, color: "from-orange-500 to-rose-500" },
    { label: "Floor Staff", value: employees.filter((e) => e.role === "STAFF").length, Icon: UtensilsCrossed, color: "from-blue-500 to-cyan-600" },
  ]

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Employees</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your restaurant staff, roles, and access</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2"><Calendar className="h-4 w-4" /> Schedule</Button>
          <Button onClick={openAdd} className="gap-2"><Plus className="h-4 w-4" /> Add Employee</Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => {
          const Icon = s.Icon
          return (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="border-0 text-white overflow-hidden relative h-full">
                <div className={cn("absolute inset-0 bg-gradient-to-br", s.color)} />
                <div className="absolute -right-8 -bottom-8 h-28 w-28 rounded-full bg-white/10 blur-2xl" />
                <CardContent className="relative p-5">
                  <div className="h-11 w-11 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center mb-3">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <p className="text-3xl font-black">{s.value}</p>
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
            <CardTitle className="text-lg">All Staff</CardTitle>
            <CardDescription>{filtered.length} team members</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input placeholder="Search name, email..." className="pl-10 h-10 w-64" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-44 h-10"><SelectValue placeholder="All Roles" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="STAFF">Floor Staff</SelectItem>
                <SelectItem value="KITCHEN">Kitchen</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50">
                  <th className="text-left py-3.5 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Employee</th>
                  <th className="text-left py-3.5 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                  <th className="text-center py-3.5 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tables</th>
                  <th className="text-center py-3.5 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Today Orders</th>
                  <th className="text-center py-3.5 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Rating</th>
                  <th className="text-left py-3.5 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Joined</th>
                  <th className="text-center py-3.5 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="text-right py-3.5 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((e, i) => {
                  const rs = roleStyles[e.role]
                  const RIcon = rs.Icon
                  return (
                    <motion.tr key={e.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors group">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-11 w-11 ring-2 ring-white shadow-md">
                            {e.imageUrl ? <AvatarImage src={e.imageUrl} /> : null}
                            <AvatarFallback name={e.name} />
                          </Avatar>
                          <div className="min-w-0">
                            <p className="font-bold text-sm text-slate-900">{e.name}</p>
                            <div className="flex items-center gap-3 mt-0.5">
                              <div className="flex items-center gap-1 text-xs text-slate-500">
                                <Mail className="h-3 w-3" />
                                <span className="truncate max-w-[160px]">{e.email}</span>
                              </div>
                              {e.phone && (
                                <div className="flex items-center gap-1 text-xs text-slate-500">
                                  <Phone className="h-3 w-3" />
                                  <span>{e.phone}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-3">
                        <Badge variant="outline" className={cn(rs.bg, rs.text, "border-0 gap-1.5 font-semibold")}>
                          <RIcon className="h-3.5 w-3.5" />
                          {rs.label}
                        </Badge>
                      </td>
                      <td className="py-4 px-3 text-center">
                        <p className="text-sm font-bold text-slate-900">{e.assignedTables ?? "—"}</p>
                      </td>
                      <td className="py-4 px-3 text-center">
                        <p className="text-sm font-bold text-slate-900">{e.todayOrders ?? 0}</p>
                      </td>
                      <td className="py-4 px-3">
                        <div className="flex items-center justify-center gap-1.5">
                          <Star className="h-4 w-4 text-amber-500 fill-amber-400" />
                          <span className="text-sm font-bold">{(e.avgRating || 0).toFixed(1)}</span>
                          <span className="text-xs text-slate-400">({e.totalRatings})</span>
                        </div>
                      </td>
                      <td className="py-4 px-3">
                        <p className="text-sm text-slate-600">{e.joinedAt ? formatDate(e.joinedAt) : "—"}</p>
                      </td>
                      <td className="py-4 px-3">
                        <div className="flex items-center justify-center">
                          <Badge variant={e.isActive ? "success" : "muted"} className="gap-1.5">
                            <span className={cn("h-1.5 w-1.5 rounded-full", e.isActive ? "bg-success-500" : "bg-slate-400")} />
                            {e.isActive ? "Active" : "On Leave"}
                          </Badge>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => openEdit(e)} title="Edit"><Edit3 className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" className={cn("h-9 w-9", e.isActive ? "text-orange-600 hover:bg-orange-50" : "text-emerald-600 hover:bg-emerald-50")} onClick={() => toggleActive(e)} title="Toggle status">
                            {e.isActive ? <Ban className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-9 w-9"><MoreHorizontal className="h-4 w-4" /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuLabel>Manage</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => openEdit(e)}><Edit3 className="h-4 w-4 mr-2" /> Edit Profile</DropdownMenuItem>
                              <DropdownMenuItem><Briefcase className="h-4 w-4 mr-2" /> Assign Tables</DropdownMenuItem>
                              <DropdownMenuItem><Calendar className="h-4 w-4 mr-2" /> View Schedule</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => toggleActive(e)}>
                                {e.isActive ? <XCircle className="h-4 w-4 mr-2" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
                                {e.isActive ? "Suspend" : "Reactivate"}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleDelete(e)} className="text-red-600"><Trash2 className="h-4 w-4 mr-2" /> Remove</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </motion.tr>
                  )
                })}
                {filtered.length === 0 && (
                  <tr><td colSpan={8}>
                    <div className="py-20 text-center">
                      <Filter className="h-12 w-12 mx-auto text-slate-300 mb-4" />
                      <p className="text-sm font-semibold text-slate-900">No employees match</p>
                      <p className="text-xs text-slate-500 mt-1">Try another search or filter</p>
                    </div>
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Employee" : "Add New Employee"}</DialogTitle>
            <DialogDescription>{editing ? "Update employee details" : "Send invitation and set role"}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Full Name *</Label>
              <Input placeholder="Jane Doe" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-1"><Mail className="h-3.5 w-3.5 text-slate-400" /> Work Email *</Label>
                <Input type="email" placeholder="jane@restaurant.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1"><Phone className="h-3.5 w-3.5 text-slate-400" /> Phone</Label>
                <Input placeholder="+1 (555) 000-0000" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Role *</Label>
                <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v as UserRole })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STAFF">Floor Staff / Server</SelectItem>
                    <SelectItem value="KITCHEN">Kitchen / Cook</SelectItem>
                    <SelectItem value="ADMIN">Restaurant Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <div className="h-11 px-4 rounded-xl border border-input bg-background/80 flex items-center justify-between cursor-pointer" onClick={() => setForm({ ...form, isActive: !form.isActive })}>
                  <span className="text-sm font-medium">{form.isActive ? "Active" : "On Leave"}</span>
                  {form.isActive ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> : <XCircle className="h-5 w-5 text-slate-400" />}
                </div>
              </div>
            </div>
            {!editing && (
              <div className="rounded-xl bg-orange-50 border border-orange-100 p-4">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-orange-900">Email invitation will be sent</p>
                    <p className="text-xs text-orange-700 mt-1">Employee will receive login credentials and setup instructions at {form.email || "their email"}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={!form.name.trim() || !form.email.trim()}>
              {editing ? "Save Changes" : "Add & Invite"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
