import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Users, Search, MoreHorizontal, Mail, Phone, Calendar, ShoppingBag,
  Eye, MessageSquare, Ban, UserPlus, TrendingUp, Crown, Star, Filter
} from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/components/ui/toast"
import { cn, formatCurrency, formatDate } from "@/lib/utils"

type CustomerStatus = "Active" | "VIP" | "Banned" | "New"

interface Customer {
  id: number
  name: string
  email: string
  phone: string
  avatar?: string
  joinDate: string
  totalOrders: number
  totalSpent: number
  status: CustomerStatus
  role: "Customer" | "VIP"
}

const mockCustomers: Customer[] = [
  { id: 1, name: "Sarah Mitchell", email: "sarah.m@example.com", phone: "+1 (555) 0123", joinDate: "2024-01-15", totalOrders: 47, totalSpent: 2847.50, status: "VIP", role: "VIP" },
  { id: 2, name: "Michael Chen", email: "michael.c@example.com", phone: "+1 (555) 0456", joinDate: "2024-03-22", totalOrders: 28, totalSpent: 1523.80, status: "Active", role: "Customer" },
  { id: 3, name: "Jennifer Park", email: "jenn.park@example.com", phone: "+1 (555) 0789", joinDate: "2024-06-10", totalOrders: 19, totalSpent: 985.25, status: "Active", role: "Customer" },
  { id: 4, name: "Robert Johnson", email: "rob.j@example.com", phone: "+1 (555) 0987", joinDate: "2024-02-08", totalOrders: 62, totalSpent: 4127.90, status: "VIP", role: "VIP" },
  { id: 5, name: "Lisa Anderson", email: "lisa.a@example.com", phone: "+1 (555) 0654", joinDate: "2026-07-28", totalOrders: 3, totalSpent: 128.40, status: "New", role: "Customer" },
  { id: 6, name: "David Thompson", email: "david.t@example.com", phone: "+1 (555) 0321", joinDate: "2024-08-14", totalOrders: 0, totalSpent: 0, status: "Banned", role: "Customer" },
  { id: 7, name: "Amanda Foster", email: "amanda.f@example.com", phone: "+1 (555) 0678", joinDate: "2026-08-01", totalOrders: 1, totalSpent: 56.99, status: "New", role: "Customer" },
  { id: 8, name: "Carlos Rivera", email: "carlos.r@example.com", phone: "+1 (555) 0901", joinDate: "2024-11-03", totalOrders: 35, totalSpent: 2210.60, status: "Active", role: "Customer" },
]

const statusStyles: Record<CustomerStatus, { variant: any; dot: string }> = {
  Active: { variant: "success", dot: "bg-emerald-500" },
  VIP: { variant: "warning", dot: "bg-amber-500" },
  Banned: { variant: "destructive", dot: "bg-red-500" },
  New: { variant: "info", dot: "bg-blue-500" },
}

export default function Customers() {
  const { toast } = useToast()
  const [customers] = useState<Customer[]>(mockCustomers)
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filtered = customers.filter((c) => {
    const s = search.toLowerCase()
    const matchSearch =
      c.name.toLowerCase().includes(s) ||
      c.email.toLowerCase().includes(s) ||
      c.phone.includes(search)
    const matchRole = roleFilter === "all" || c.role === roleFilter
    const matchStatus = statusFilter === "all" || c.status === statusFilter
    return matchSearch && matchRole && matchStatus
  })

  const totalSpentAll = customers.reduce((a, b) => a + b.totalSpent, 0)

  const handleView = (c: Customer) => {
    toast({ title: "View customer", description: `${c.name}'s profile opened` })
  }

  const handleMessage = (c: Customer) => {
    toast({ title: "Message sent", description: `Compose message to ${c.name}` })
  }

  const handleBan = (c: Customer) => {
    toast({
      title: c.status === "Banned" ? "Customer unbanned" : "Customer banned",
      description: `${c.name} ${c.status === "Banned" ? "can now order again" : "has been restricted"}`,
      variant: c.status === "Banned" ? "success" : "destructive",
    })
  }

  const stats = [
    { label: "Total Customers", value: customers.length, Icon: Users, color: "from-violet-500 to-indigo-600" },
    { label: "Active This Month", value: customers.filter((c) => c.status !== "Banned").length, Icon: TrendingUp, color: "from-emerald-500 to-teal-600" },
    { label: "VIP Members", value: customers.filter((c) => c.status === "VIP").length, Icon: Crown, color: "from-amber-500 to-orange-600" },
    { label: "Total Lifetime Spend", value: formatCurrency(totalSpentAll), Icon: Star, color: "from-rose-500 to-pink-600" },
  ]

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage customer accounts, loyalty status, and communication
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Crown className="h-4 w-4" /> Loyalty Tiers
          </Button>
          <Button className="gap-2">
            <UserPlus className="h-4 w-4" /> Invite Customer
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
            <CardTitle className="text-lg">All Customers</CardTitle>
            <CardDescription>{filtered.length} customers showing</CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search name, email, phone..."
                className="pl-10 h-10 w-64"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-36 h-10">
                <SelectValue placeholder="All roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All roles</SelectItem>
                <SelectItem value="Customer">Regular</SelectItem>
                <SelectItem value="VIP">VIP</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36 h-10">
                <SelectValue placeholder="All status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="VIP">VIP</SelectItem>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Banned">Banned</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50">
                  <th className="text-left py-3.5 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="text-left py-3.5 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="text-left py-3.5 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="text-center py-3.5 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Orders
                  </th>
                  <th className="text-right py-3.5 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Lifetime Value
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
                  const st = statusStyles[c.status]
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
                          <Avatar className="h-11 w-11 ring-2 ring-white shadow-md">
                            {c.avatar ? <AvatarImage src={c.avatar} /> : null}
                            <AvatarFallback name={c.name} />
                          </Avatar>
                          <div className="min-w-0">
                            <p className="font-bold text-sm text-slate-900">{c.name}</p>
                            <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                              <Mail className="h-3 w-3 shrink-0" />
                              <span className="truncate max-w-[180px]">{c.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-3">
                        <div className="flex items-center gap-1.5 text-sm text-slate-600">
                          <Phone className="h-3.5 w-3.5 text-slate-400" />
                          <span>{c.phone}</span>
                        </div>
                      </td>
                      <td className="py-4 px-3">
                        <div className="flex items-center gap-1.5 text-sm text-slate-600">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          <span>{formatDate(c.joinDate)}</span>
                        </div>
                      </td>
                      <td className="py-4 px-3 text-center">
                        <div className="inline-flex items-center gap-1.5">
                          <ShoppingBag className="h-3.5 w-3.5 text-violet-500" />
                          <span className="text-sm font-bold text-slate-900">{c.totalOrders}</span>
                        </div>
                      </td>
                      <td className="py-4 px-3 text-right">
                        <p className="text-sm font-bold text-slate-900">{formatCurrency(c.totalSpent)}</p>
                        {c.totalOrders > 0 && (
                          <p className="text-[11px] text-slate-500">
                            Avg {formatCurrency(c.totalSpent / c.totalOrders)}/order
                          </p>
                        )}
                      </td>
                      <td className="py-4 px-3">
                        <div className="flex items-center justify-center">
                          <Badge variant={st.variant} className="gap-1.5">
                            <span className={cn("h-1.5 w-1.5 rounded-full", st.dot)} />
                            {c.status}
                          </Badge>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleView(c)}
                            title="View profile"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleMessage(c)}
                            title="Message"
                          >
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-9 w-9">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleView(c)}>
                                <Eye className="h-4 w-4 mr-2" /> View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleMessage(c)}>
                                <MessageSquare className="h-4 w-4 mr-2" /> Send Message
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Crown className="h-4 w-4 mr-2" /> Upgrade to VIP
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleBan(c)}
                                className={c.status === "Banned" ? "text-emerald-600" : "text-red-600"}
                              >
                                <Ban className="h-4 w-4 mr-2" />
                                {c.status === "Banned" ? "Unban Customer" : "Ban Customer"}
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
                        <p className="text-sm font-semibold text-slate-900">No customers match</p>
                        <p className="text-xs text-slate-500 mt-1">Try another search or filter</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
