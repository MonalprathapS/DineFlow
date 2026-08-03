import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  DollarSign, ShoppingBag, Users, UtensilsCrossed, TrendingUp, TrendingDown,
  Calendar, Download, FileText, ArrowUpRight, ArrowDownRight, MoreHorizontal,
  Filter, FileSpreadsheet, FileJson, Printer, BarChart3, PieChart, LineChart
} from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/components/ui/toast"
import { cn, formatCurrency, formatDate } from "@/lib/utils"
import {
  LineChart as ReLineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from "recharts"

const weeklyRevenueData = [
  { date: "Jul 28", revenue: 6240, orders: 96, customers: 78 },
  { date: "Jul 29", revenue: 7120, orders: 115, customers: 92 },
  { date: "Jul 30", revenue: 5890, orders: 88, customers: 71 },
  { date: "Jul 31", revenue: 8450, orders: 132, customers: 104 },
  { date: "Aug 01", revenue: 9870, orders: 158, customers: 126 },
  { date: "Aug 02", revenue: 12420, orders: 196, customers: 158 },
  { date: "Aug 03", revenue: 8427, orders: 127, customers: 98 },
]

const monthlyOrdersData = [
  { day: "Week 1", orders: 742, revenue: 48200 },
  { day: "Week 2", orders: 815, revenue: 52800 },
  { day: "Week 3", orders: 698, revenue: 45900 },
  { day: "Week 4", orders: 924, revenue: 61500 },
]

const topItems = [
  { name: "Truffle Mushroom Pizza", qty: 147, revenue: 2940 },
  { name: "Wagyu Beef Burger", qty: 123, revenue: 2214 },
  { name: "Sushi Platter Deluxe", qty: 98, revenue: 2450 },
  { name: "Chocolate Lava Cake", qty: 86, revenue: 774 },
  { name: "Caesar Salad Royal", qty: 72, revenue: 648 },
]

const customerGrowth = [
  { month: "Mar", new: 87, returning: 142 },
  { month: "Apr", new: 102, returning: 168 },
  { month: "May", new: 94, returning: 185 },
  { month: "Jun", new: 118, returning: 214 },
  { month: "Jul", new: 136, returning: 242 },
  { month: "Aug", new: 89, returning: 178 },
]

const barColors = ["#f97316", "#ea580c", "#c2410c", "#9a3412", "#7c2d12"]

export default function Reports() {
  const { toast } = useToast()
  const [period, setPeriod] = useState("7d")
  const [tab, setTab] = useState("revenue")

  const totalRevenue = weeklyRevenueData.reduce((a, b) => a + b.revenue, 0)
  const totalOrders = weeklyRevenueData.reduce((a, b) => a + b.orders, 0)
  const totalCustomers = weeklyRevenueData.reduce((a, b) => a + b.customers, 0)
  const aov = totalOrders > 0 ? totalRevenue / totalOrders : 0

  const handleExport = (type: string) => {
    toast({ title: `Exporting ${tab} report`, description: `Downloading ${type} file...`, variant: "success" })
  }

  const summaryCards = [
    {
      label: "Total Revenue", value: formatCurrency(totalRevenue),
      change: "+12.4%", positive: true, sub: "vs last period",
      Icon: DollarSign, gradient: "from-orange-500 to-rose-500",
    },
    {
      label: "Total Orders", value: totalOrders.toString(),
      change: "+8.2%", positive: true, sub: `${Math.round(totalOrders / 7)} avg/day`,
      Icon: ShoppingBag, gradient: "from-violet-500 to-indigo-600",
    },
    {
      label: "Unique Customers", value: totalCustomers.toString(),
      change: "+5.8%", positive: true, sub: `${Math.round(totalCustomers / 7)} avg/day`,
      Icon: Users, gradient: "from-emerald-500 to-teal-600",
    },
    {
      label: "AOV", value: formatCurrency(aov),
      change: "+3.9%", positive: true, sub: "Avg order value",
      Icon: TrendingUp, gradient: "from-blue-500 to-cyan-600",
    },
  ]

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Deep dive into sales, orders, customers, and menu performance
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-36 h-10 gap-2">
              <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last quarter</SelectItem>
              <SelectItem value="ytd">Year to date</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2 h-10">
            <Calendar className="h-4 w-4" />
            Custom Range
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="gap-2 h-10">
                <Download className="h-4 w-4" />
                Export Report
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => handleExport("PDF")}>
                <FileText className="h-4 w-4 mr-2 text-red-500" /> PDF Report
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("Excel")}>
                <FileSpreadsheet className="h-4 w-4 mr-2 text-emerald-600" /> Excel (.xlsx)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("CSV")}>
                <FileSpreadsheet className="h-4 w-4 mr-2 text-blue-600" /> CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("JSON")}>
                <FileJson className="h-4 w-4 mr-2 text-amber-600" /> JSON
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("Print")}>
                <Printer className="h-4 w-4 mr-2 text-slate-600" /> Print
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((c, i) => {
          const Icon = c.Icon
          return (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="border-0 text-white overflow-hidden relative h-full group">
                <div className={cn("absolute inset-0 bg-gradient-to-br", c.gradient)} />
                <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-white/10 blur-2xl group-hover:bg-white/20 transition-all duration-500" />
                <CardContent className="relative p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-11 w-11 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div className={cn(
                      "flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold backdrop-blur-sm",
                      c.positive ? "bg-white/20 text-white" : "bg-red-500/30 text-white"
                    )}>
                      {c.positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                      {c.change}
                    </div>
                  </div>
                  <p className="text-2xl font-black tracking-tight mb-1">{c.value}</p>
                  <p className="text-xs font-medium text-white/70">{c.label}</p>
                  <p className="text-[11px] text-white/60 mt-1">{c.sub}</p>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader className="pb-2">
            <Tabs defaultValue="revenue" value={tab} onValueChange={setTab}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <TabsList className="h-11 p-1">
                  <TabsTrigger value="revenue" className="h-8 text-xs gap-1.5">
                    <DollarSign className="h-3.5 w-3.5" /> Revenue
                  </TabsTrigger>
                  <TabsTrigger value="orders" className="h-8 text-xs gap-1.5">
                    <ShoppingBag className="h-3.5 w-3.5" /> Orders
                  </TabsTrigger>
                  <TabsTrigger value="customers" className="h-8 text-xs gap-1.5">
                    <Users className="h-3.5 w-3.5" /> Customers
                  </TabsTrigger>
                  <TabsTrigger value="items" className="h-8 text-xs gap-1.5">
                    <UtensilsCrossed className="h-3.5 w-3.5" /> Items
                  </TabsTrigger>
                </TabsList>
                <div className="flex items-center gap-2">
                  <Badge variant="muted" className="gap-1.5 text-xs">
                    <span className="h-2 w-2 rounded-full bg-orange-500" />
                    {formatDate(weeklyRevenueData[0].date)} — {formatDate(weeklyRevenueData[6].date)}
                  </Badge>
                </div>
              </div>
            </Tabs>
          </CardHeader>

          <CardContent>
            <TabsContent value="revenue" className="mt-0 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="lg:col-span-2"
                >
                  <Card className="border-slate-100 shadow-none">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <div>
                        <CardTitle className="text-base flex items-center gap-2">
                          <LineChart className="h-4 w-4 text-orange-500" />
                          Revenue Trend
                        </CardTitle>
                        <CardDescription className="text-xs">Daily revenue with rolling average</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="muted"><span className="h-2 w-2 rounded-full bg-orange-500 mr-1.5" /> Revenue</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={weeklyRevenueData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                            <defs>
                              <linearGradient id="revAreaGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f97316" stopOpacity={0.35} />
                                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                            <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                            <Tooltip
                              contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 10px 40px rgba(0,0,0,0.08)" }}
                              formatter={(v: number) => [formatCurrency(v), "Revenue"]}
                            />
                            <Area
                              type="monotone"
                              dataKey="revenue"
                              stroke="#f97316"
                              strokeWidth={3}
                              fill="url(#revAreaGrad)"
                              dot={{ fill: "#f97316", r: 4, strokeWidth: 2, stroke: "#fff" }}
                              activeDot={{ r: 6 }}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                  <Card className="border-slate-100 shadow-none h-full">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-violet-500" />
                        Orders per Day
                      </CardTitle>
                      <CardDescription className="text-xs">Order volume distribution</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={weeklyRevenueData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                            <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                            <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                            <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: 12 }} formatter={(v: number) => [`${v} orders`, "Orders"]} />
                            <Bar dataKey="orders" radius={[6, 6, 0, 0]} barSize={28}>
                              <defs>
                                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#8b5cf6" />
                                  <stop offset="100%" stopColor="#6366f1" />
                                </linearGradient>
                              </defs>
                              <Bar dataKey="orders" fill="url(#barGrad)" radius={[6, 6, 0, 0]} barSize={28} />
                              {weeklyRevenueData.map((_, i) => (
                                <Cell key={i} fill={i % 2 === 0 ? "#8b5cf6" : "#a78bfa"} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </TabsContent>

            <TabsContent value="orders" className="mt-0 space-y-6">
              <Card className="border-slate-100 shadow-none">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-orange-500" />
                      Weekly Order Volume
                    </CardTitle>
                    <CardDescription className="text-xs">Orders and revenue by week</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyOrdersData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                        <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis yAxisId="left" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                        <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: 12 }} />
                        <Legend iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                        <Bar yAxisId="left" dataKey="orders" fill="#8b5cf6" radius={[6, 6, 0, 0]} barSize={30} name="Orders" />
                        <Bar yAxisId="right" dataKey="revenue" fill="#f97316" radius={[6, 6, 0, 0]} barSize={30} name="Revenue" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="customers" className="mt-0 space-y-6">
              <Card className="border-slate-100 shadow-none">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      <LineChart className="h-4 w-4 text-emerald-500" />
                      Customer Growth
                    </CardTitle>
                    <CardDescription className="text-xs">New vs returning customers</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="gap-1.5 border-emerald-200 bg-emerald-50 text-emerald-700">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" /> Returning
                    </Badge>
                    <Badge variant="outline" className="gap-1.5 border-blue-200 bg-blue-50 text-blue-700">
                      <span className="h-2 w-2 rounded-full bg-blue-500" /> New
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <ReLineChart data={customerGrowth} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                        <defs>
                          <linearGradient id="newGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.25} />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="retGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" stopOpacity={0.25} />
                            <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                        <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: 12 }} />
                        <Legend iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                        <Line type="monotone" dataKey="new" stroke="#3b82f6" strokeWidth={3} dot={{ fill: "#3b82f6", r: 4, strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 6 }} fill="url(#newGrad)" name="New Customers" />
                        <Line type="monotone" dataKey="returning" stroke="#10b981" strokeWidth={3} dot={{ fill: "#10b981", r: 4, strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 6 }} fill="url(#retGrad)" name="Returning Customers" />
                      </ReLineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="items" className="mt-0 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <Card className="border-slate-100 shadow-none lg:col-span-3">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <PieChart className="h-4 w-4 text-orange-500" />
                      Top Selling Items
                    </CardTitle>
                    <CardDescription className="text-xs">By revenue and quantity sold</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={topItems} layout="vertical" margin={{ top: 5, right: 20, left: 5, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                          <XAxis type="number" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                          <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} width={160} tick={{ fontWeight: 500 }} />
                          <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: 12 }} formatter={(v: number, n: string) => [n === "revenue" ? formatCurrency(v) : `${v} units`, n === "revenue" ? "Revenue" : "Qty Sold"]} />
                          <Legend iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: 5 }} />
                          <Bar dataKey="revenue" radius={[0, 8, 8, 0]} barSize={14} name="Revenue ($)">
                            {topItems.map((_, idx) => (
                              <Cell key={idx} fill={barColors[idx % barColors.length]} />
                            ))}
                          </Bar>
                          <Bar dataKey="qty" radius={[0, 8, 8, 0]} barSize={14} fill="#8b5cf6" name="Units Sold" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-100 shadow-none lg:col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Filter className="h-4 w-4 text-violet-500" />
                      Items Rank
                    </CardTitle>
                    <CardDescription className="text-xs">All time best sellers</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-3">
                    {topItems.map((it, i) => {
                      const max = topItems[0].revenue
                      const pct = (it.revenue / max) * 100
                      return (
                        <motion.div
                          key={it.name}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <span className="h-7 w-7 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">#{i + 1}</span>
                              <p className="text-sm font-semibold text-slate-900 truncate max-w-[150px]">{it.name}</p>
                            </div>
                            <p className="text-sm font-bold text-orange-600">{formatCurrency(it.revenue)}</p>
                          </div>
                          <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${barColors[i % barColors.length]}, ${barColors[(i + 1) % barColors.length]})` }}
                            />
                          </div>
                          <p className="text-[11px] text-slate-500 flex justify-between">
                            <span>{it.qty} units sold</span>
                            <span>Avg {formatCurrency(it.revenue / it.qty)}</span>
                          </p>
                        </motion.div>
                      )
                    })}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
