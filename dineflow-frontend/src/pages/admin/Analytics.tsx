import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  DollarSign, ShoppingBag, TrendingUp, TrendingDown, XCircle, Users,
  ArrowUpRight, ArrowDownRight, UtensilsCrossed, Calendar, PieChart as PieIcon,
  BarChart3, Clock, Activity, Gauge, Repeat, Star
} from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/components/ui/toast"
import { cn, formatCurrency, formatDate } from "@/lib/utils"
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from "recharts"

const orderStatusData = [
  { name: "Completed", value: 412, color: "#10b981" },
  { name: "Preparing", value: 68, color: "#f59e0b" },
  { name: "Cancelled", value: 22, color: "#ef4444" },
  { name: "Served", value: 47, color: "#8b5cf6" },
  { name: "Ready", value: 31, color: "#06b6d4" },
]

const categoryData = [
  { name: "Main Course", revenue: 68400, orders: 1247 },
  { name: "Beverages", revenue: 42800, orders: 2105 },
  { name: "Desserts", revenue: 23900, orders: 876 },
  { name: "Starters", revenue: 18500, orders: 612 },
  { name: "Salads", revenue: 11200, orders: 389 },
]

const catColors = ["#f97316", "#8b5cf6", "#ec4899", "#10b981", "#06b6d4"]

const busyHours = [
  { hour: "Mon", h11: 3, h12: 8, h13: 11, h14: 6, h17: 5, h18: 14, h19: 19, h20: 15, h21: 9 },
  { hour: "Tue", h11: 4, h12: 10, h13: 14, h14: 7, h17: 6, h18: 16, h19: 22, h20: 17, h21: 10 },
  { hour: "Wed", h11: 3, h12: 9, h13: 12, h14: 5, h17: 5, h18: 15, h19: 20, h20: 16, h21: 8 },
  { hour: "Thu", h11: 5, h12: 11, h13: 15, h14: 8, h17: 7, h18: 18, h19: 24, h20: 18, h21: 11 },
  { hour: "Fri", h11: 6, h12: 14, h13: 18, h14: 10, h17: 10, h18: 28, h19: 36, h20: 30, h21: 20 },
  { hour: "Sat", h11: 8, h12: 18, h13: 24, h14: 16, h17: 14, h18: 38, h19: 44, h20: 38, h21: 28 },
  { hour: "Sun", h11: 7, h12: 16, h13: 20, h14: 13, h17: 12, h18: 32, h19: 38, h20: 30, h21: 22 },
]

const heatmapKeys = ["h11", "h12", "h13", "h14", "h17", "h18", "h19", "h20", "h21"] as const
const heatmapLabels = ["11AM", "12PM", "1PM", "2PM", "5PM", "6PM", "7PM", "8PM", "9PM"]

function heatColor(v: number): string {
  if (v === 0) return "bg-slate-50 text-slate-300"
  if (v <= 5) return "bg-orange-100 text-orange-800"
  if (v <= 10) return "bg-orange-200 text-orange-900"
  if (v <= 20) return "bg-orange-400 text-white"
  if (v <= 30) return "bg-orange-500 text-white"
  return "bg-orange-600 text-white"
}

export default function Analytics() {
  const { toast } = useToast()
  const [period, setPeriod] = useState("30d")

  const kpiCards = [
    {
      label: "Total Revenue", value: formatCurrency(164800),
      change: "+12.4%", positive: true, sub: "vs last 30 days",
      Icon: DollarSign, gradient: "from-orange-500 to-rose-500",
    },
    {
      label: "Total Orders", value: "5,264",
      change: "+8.7%", positive: true, sub: "Avg 175/day",
      Icon: ShoppingBag, gradient: "from-violet-500 to-indigo-600",
    },
    {
      label: "AOV", value: formatCurrency(31.31),
      change: "+3.4%", positive: true, sub: "Avg order value",
      Icon: Gauge, gradient: "from-emerald-500 to-teal-600",
    },
    {
      label: "Cancellation Rate", value: "4.18%",
      change: "-0.8%", positive: true, sub: "22 cancelled",
      Icon: XCircle, gradient: "from-red-500 to-rose-600",
    },
    {
      label: "Repeat Customers", value: "62.4%",
      change: "+5.2%", positive: true, sub: "Loyalty rate",
      Icon: Repeat, gradient: "from-blue-500 to-cyan-600",
    },
    {
      label: "Avg Rating", value: "4.8 / 5",
      change: "+0.2", positive: true, sub: "1,847 reviews",
      Icon: Star, gradient: "from-amber-500 to-orange-600",
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
          <h1 className="text-2xl font-bold tracking-tight">Analytics Overview</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Performance KPIs, order status distribution, and customer behavior
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-40 h-10 gap-2">
              <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last quarter</SelectItem>
              <SelectItem value="ytd">Year to date</SelectItem>
            </SelectContent>
          </Select>
          <Badge variant="muted" className="gap-1.5 h-10 px-3">
            <Activity className="h-3.5 w-3.5 text-emerald-500 animate-pulse" />
            Live
          </Badge>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpiCards.map((c, i) => {
          const Icon = c.Icon
          return (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="border-0 text-white overflow-hidden relative group h-full">
                <div className={cn("absolute inset-0 bg-gradient-to-br", c.gradient)} />
                <div className="absolute -right-10 -top-10 w-28 h-28 rounded-full bg-white/10 blur-2xl group-hover:bg-white/20 transition-all duration-500" />
                <CardContent className="relative p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div className={cn(
                      "flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold backdrop-blur-sm",
                      c.positive ? "bg-white/20 text-white" : "bg-red-500/30 text-white"
                    )}>
                      {c.positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                      {c.change}
                    </div>
                  </div>
                  <p className="text-xl font-black tracking-tight mb-1">{c.value}</p>
                  <p className="text-xs font-medium text-white/80">{c.label}</p>
                  <p className="text-[10px] text-white/60 mt-1">{c.sub}</p>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="h-full">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <PieIcon className="h-4 w-4 text-violet-500" />
                    Order Status
                  </CardTitle>
                  <CardDescription className="text-xs mt-0.5">Distribution by status</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={orderStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {orderStatusData.map((entry, idx) => (
                        <Cell key={idx} fill={entry.color} stroke="#fff" strokeWidth={2.5} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: 12 }}
                      formatter={(v: number) => [`${v} orders`, "Count"]}
                    />
                    <Legend
                      iconType="circle"
                      wrapperStyle={{ fontSize: 11, paddingTop: 0 }}
                      formatter={(value: string, entry: any) => (
                        <span className="text-xs text-slate-600 font-medium">
                          {value} <span className="text-slate-400">({entry.payload.value})</span>
                        </span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {orderStatusData.map((s) => (
                  <div key={s.name} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
                      <span className="text-[11px] font-medium text-slate-600">{s.name}</span>
                    </div>
                    <span className="text-xs font-bold text-slate-900">{s.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="lg:col-span-2"
        >
          <Card className="h-full">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-orange-500" />
                    Top 5 Categories
                  </CardTitle>
                  <CardDescription className="text-xs mt-0.5">Revenue and orders by menu category</CardDescription>
                </div>
                <Badge variant="muted" className="text-xs">Period total</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} tick={{ fontWeight: 500 }} />
                    <YAxis yAxisId="left" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                    <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: 12 }}
                      formatter={(v: number, n: string) => [n === "revenue" ? formatCurrency(v) : `${v} orders`, n === "revenue" ? "Revenue" : "Orders"]}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                    <Bar yAxisId="left" dataKey="revenue" radius={[6, 6, 0, 0]} barSize={28} name="Revenue">
                      {categoryData.map((_, idx) => (
                        <Cell key={idx} fill={catColors[idx % catColors.length]} />
                      ))}
                    </Bar>
                    <Bar yAxisId="right" dataKey="orders" fill="#334155" radius={[6, 6, 0, 0]} barSize={20} name="Orders" opacity={0.7} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 pb-2">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4 text-rose-500" />
                Busy Hours Heatmap
              </CardTitle>
              <CardDescription className="text-xs mt-0.5">
                Order density by day and hour — darker means more orders
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-[11px] text-slate-500">
                <span>Quiet</span>
                {[2, 3, 4, 5].map((n) => (
                  <span
                    key={n}
                    className={cn(
                      "h-4 w-4 rounded",
                      n === 2 ? "bg-orange-100" :
                      n === 3 ? "bg-orange-300" :
                      n === 4 ? "bg-orange-500" : "bg-orange-600"
                    )}
                  />
                ))}
                <span>Busy</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="overflow-x-auto -mx-6 px-6">
              <div className="min-w-[760px]">
                <div className="grid grid-cols-[70px_1fr] gap-2">
                  <div />
                  <div className="grid grid-cols-9 gap-1.5">
                    {heatmapLabels.map((l) => (
                      <div key={l} className="text-[11px] font-semibold text-slate-500 text-center py-1">{l}</div>
                    ))}
                  </div>
                </div>
                {busyHours.map((row, ri) => (
                  <div key={row.hour} className="grid grid-cols-[70px_1fr] gap-2 mb-1.5">
                    <div className="flex items-center text-xs font-semibold text-slate-600">
                      {row.hour}
                    </div>
                    <div className="grid grid-cols-9 gap-1.5">
                      {heatmapKeys.map((k, ci) => {
                        const v = row[k]
                        return (
                          <motion.div
                            key={`${ri}-${k}`}
                            initial={{ opacity: 0, scale: 0.85 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.25 + (ri * 9 + ci) * 0.01 }}
                            className={cn(
                              "h-10 rounded-lg flex items-center justify-center text-[11px] font-bold transition-transform hover:scale-105 cursor-default shadow-sm",
                              heatColor(v)
                            )}
                            title={`${row.hour} ${heatmapLabels[ci]}: ${v} orders`}
                          >
                            {v}
                          </motion.div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100 p-4">
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-lg bg-orange-500 text-white flex items-center justify-center shrink-0">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-orange-900">Peak Day</p>
                    <p className="text-xs text-orange-700 mt-0.5">Saturday shows highest total at 223 orders. Schedule extra kitchen and floor staff.</p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-100 p-4">
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-lg bg-violet-500 text-white flex items-center justify-center shrink-0">
                    <Activity className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-violet-900">Peak Hour</p>
                    <p className="text-xs text-violet-700 mt-0.5">Saturday 7 PM averages 44 orders — a full 3.2x the weeknight baseline.</p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 p-4">
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0">
                    <UtensilsCrossed className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-emerald-900">Slowest Period</p>
                    <p className="text-xs text-emerald-700 mt-0.5">Wednesday 11–2 PM is the quietest window — ideal for prep, training, and deep cleans.</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
