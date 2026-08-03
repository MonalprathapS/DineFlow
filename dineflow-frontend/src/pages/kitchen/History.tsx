import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  History,
  ChefHat,
  Search,
  Download,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpDown,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/components/ui/toast"
import { cn, formatCurrency, formatDate, formatTime } from "@/lib/utils"
import type { OrderStatus } from "@/types"

interface HistoryOrder {
  id: number
  orderNumber: string
  tableNumber: string
  customerName: string
  itemsCount: number
  totalAmount: number
  servedBy: string
  servedAt: string
  status: Exclude<OrderStatus, "PLACED" | "ACCEPTED" | "PREPARING" | "READY">
  period: "today" | "week" | "month"
}

const waiters = ["Marcus Chen", "Sofia Reyes", "James Wilson", "Priya Patel", "Alex Thompson"]
const tables = ["T-01", "T-02", "T-03", "T-04", "T-05", "T-06", "T-07", "T-08", "T-09", "T-10", "T-12", "T-15", "TK-01", "TK-02"]
const customers = [
  "Smith Family", "Johnson Party", "Williams Group", "Brown Table", "Jones Couple",
  "Garcia Dinner", "Miller Lunch", "Davis Brunch", "Rodriguez Group", "Martinez Date",
  "Hernandez Family", "Lopez Party", "Gonzalez Table", "Wilson Couple", "Anderson Group",
  "Thomas Dinner", "Taylor Lunch", "Moore Brunch", "Jackson Couple", "Martin Family",
]
const itemsCounts = [2, 3, 4, 5, 6, 7, 8, 9, 10, 12]
const totals = [32.5, 48.0, 67.5, 89.25, 112.0, 134.8, 156.4, 178.0, 198.6, 224.0, 248.5, 289.0, 312.5, 336.96]
const statuses: HistoryOrder["status"][] = ["SERVED", "COMPLETED", "CANCELLED", "SERVED", "SERVED", "COMPLETED", "SERVED"]

function generateMockOrders(): HistoryOrder[] {
  const orders: HistoryOrder[] = []
  const now = Date.now()

  const periods: ("today" | "week" | "month")[] = [
    ...Array(8).fill("today"),
    ...Array(7).fill("week"),
    ...Array(5).fill("month"),
  ]

  for (let i = 0; i < 20; i++) {
    const period = periods[i]
    let offsetMs = 0
    if (period === "today") offsetMs = (i + 1) * 30 * 60000
    else if (period === "week") offsetMs = (i + 1) * 6 * 60 * 60000 + 24 * 60 * 60000
    else offsetMs = (i + 1) * 2 * 24 * 60 * 60000 + 7 * 24 * 60 * 60000

    orders.push({
      id: 600 + i,
      orderNumber: `DF-08${period === "today" ? "03" : period === "week" ? `0${2 + (i % 6)}` : `0${10 + (i % 20)}`}-K${String(40 + i).padStart(2, "0")}`,
      tableNumber: tables[i % tables.length],
      customerName: customers[i % customers.length],
      itemsCount: itemsCounts[i % itemsCounts.length],
      totalAmount: totals[i % totals.length],
      servedBy: waiters[i % waiters.length],
      servedAt: new Date(now - offsetMs).toISOString(),
      status: statuses[i % statuses.length],
      period,
    })
  }
  return orders
}

const mockAllOrders = generateMockOrders()

const PAGE_SIZE = 8

function getStatusStyle(status: HistoryOrder["status"]) {
  switch (status) {
    case "SERVED":
      return {
        label: "SERVED",
        icon: CheckCircle2,
        className: "bg-emerald-500/15 text-emerald-700 border-0",
        iconClass: "text-emerald-600",
      }
    case "COMPLETED":
      return {
        label: "COMPLETED",
        icon: CheckCircle2,
        className: "bg-blue-500/15 text-blue-700 border-0",
        iconClass: "text-blue-600",
      }
    case "CANCELLED":
      return {
        label: "CANCELLED",
        icon: XCircle,
        className: "bg-red-500/15 text-red-700 border-0",
        iconClass: "text-red-600",
      }
  }
}

export default function OrderHistory() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState<"today" | "week" | "month">("today")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [page, setPage] = useState(1)
  const [sortField, setSortField] = useState<"time" | "total" | "items">("time")
  const [sortAsc, setSortAsc] = useState(false)

  const filteredOrders = useMemo(() => {
    let list = mockAllOrders.filter((o) => o.period === activeTab)
    if (searchTerm) {
      const q = searchTerm.toLowerCase()
      list = list.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.tableNumber.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.servedBy.toLowerCase().includes(q)
      )
    }
    if (statusFilter !== "all") {
      list = list.filter((o) => o.status === statusFilter)
    }
    list = [...list].sort((a, b) => {
      let diff = 0
      if (sortField === "time") diff = new Date(b.servedAt).getTime() - new Date(a.servedAt).getTime()
      else if (sortField === "total") diff = b.totalAmount - a.totalAmount
      else diff = b.itemsCount - a.itemsCount
      return sortAsc ? -diff : diff
    })
    return list
  }, [activeTab, searchTerm, statusFilter, sortField, sortAsc])

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  const stats = useMemo(() => {
    const list = mockAllOrders.filter((o) => o.period === activeTab)
    const revenue = list
      .filter((o) => o.status !== "CANCELLED")
      .reduce((s, o) => s + o.totalAmount, 0)
    const served = list.filter((o) => o.status === "SERVED" || o.status === "COMPLETED").length
    const cancelled = list.filter((o) => o.status === "CANCELLED").length
    return { total: list.length, revenue, served, cancelled }
  }, [activeTab])

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: `Exporting ${filteredOrders.length} orders to CSV`,
      variant: "success",
    })
  }

  const toggleSort = (field: "time" | "total" | "items") => {
    if (sortField === field) setSortAsc(!sortAsc)
    else {
      setSortField(field)
      setSortAsc(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
            <History className="h-7 w-7 text-purple-600" />
            Order History
          </h1>
          <p className="text-muted-foreground mt-1">
            Review past orders, track service performance
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: "Total Orders",
            value: stats.total,
            icon: ChefHat,
            color: "from-purple-500 via-violet-500 to-indigo-500",
          },
          {
            label: "Served",
            value: stats.served,
            icon: CheckCircle2,
            color: "from-emerald-500 via-teal-500 to-green-500",
          },
          {
            label: "Cancelled",
            value: stats.cancelled,
            icon: XCircle,
            color: "from-red-500 via-rose-500 to-pink-500",
          },
          {
            label: activeTab === "today" ? "Today's Revenue" : activeTab === "week" ? "Week Revenue" : "Month Revenue",
            value: formatCurrency(stats.revenue),
            icon: ArrowUpDown,
            color: "from-blue-500 via-cyan-500 to-sky-500",
          },
        ].map((s, i) => {
          const Icon = s.icon
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04 * i }}
            >
              <Card className="overflow-hidden border-0 h-full hover:shadow-elevated transition-all">
                <div className={cn("h-1 bg-gradient-to-r", s.color)} />
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={cn(
                        "h-9 w-9 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-md",
                        s.color
                      )}
                    >
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-muted-foreground">{s.label}</p>
                  <p className="text-2xl font-black mt-0.5 tracking-tight leading-none">
                    {s.value}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      <Card className="overflow-hidden border-0 shadow-soft">
        <CardHeader className="pb-3">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <Tabs
              defaultValue="today"
              value={activeTab}
              onValueChange={(v) => {
                setActiveTab(v as "today" | "week" | "month")
                setPage(1)
              }}
              className="w-full lg:w-auto"
            >
              <TabsList className="h-11 w-full lg:w-auto">
                <TabsTrigger value="today">Today</TabsTrigger>
                <TabsTrigger value="week">This Week</TabsTrigger>
                <TabsTrigger value="month">This Month</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto">
              <div className="relative flex-1 sm:max-w-xs">
                <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-muted-foreground" />
                <Input
                  placeholder="Search orders..."
                  className="pl-10 h-11 rounded-xl"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setPage(1)
                  }}
                />
              </div>
              <Select
                value={statusFilter}
                onValueChange={(v) => {
                  setStatusFilter(v)
                  setPage(1)
                }}
              >
                <SelectTrigger className="h-11 w-full sm:w-40 rounded-xl gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="SERVED">Served</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                className="h-11 rounded-xl gap-2"
                onClick={handleExport}
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-3 border-b border-border/50 bg-muted/20">
            <button
              onClick={() => toggleSort("time")}
              className="col-span-2 text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 hover:text-foreground"
            >
              Time
              <ChevronsUpDown
                className={cn(
                  "h-3.5 w-3.5",
                  sortField === "time" && "text-foreground"
                )}
              />
            </button>
            <div className="col-span-1 text-xs font-black uppercase tracking-wider text-muted-foreground">
              Order
            </div>
            <div className="col-span-1 text-xs font-black uppercase tracking-wider text-muted-foreground">
              Table
            </div>
            <div className="col-span-2 text-xs font-black uppercase tracking-wider text-muted-foreground">
              Customer
            </div>
            <button
              onClick={() => toggleSort("items")}
              className="col-span-1 text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 hover:text-foreground"
            >
              Items
              <ChevronsUpDown
                className={cn(
                  "h-3.5 w-3.5",
                  sortField === "items" && "text-foreground"
                )}
              />
            </button>
            <button
              onClick={() => toggleSort("total")}
              className="col-span-1 text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 hover:text-foreground"
            >
              Total
              <ChevronsUpDown
                className={cn(
                  "h-3.5 w-3.5",
                  sortField === "total" && "text-foreground"
                )}
              />
            </button>
            <div className="col-span-2 text-xs font-black uppercase tracking-wider text-muted-foreground">
              Served By
            </div>
            <div className="col-span-2 text-xs font-black uppercase tracking-wider text-muted-foreground">
              Status
            </div>
          </div>

          <div className="divide-y divide-border/50">
            <AnimatePresence mode="popLayout">
              {paginatedOrders.map((order, i) => {
                const status = getStatusStyle(order.status)
                const StatusIcon = status.icon
                return (
                  <motion.div
                    key={order.id}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ delay: 0.02 * i }}
                    className="lg:grid lg:grid-cols-12 lg:gap-4 lg:px-6 lg:py-4 px-4 py-5 hover:bg-slate-50/60 transition-colors cursor-pointer"
                  >
                    <div className="lg:col-span-2 flex lg:block items-center justify-between mb-3 lg:mb-0">
                      <div className="flex items-center gap-2">
                        <div className="h-9 w-9 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center lg:hidden">
                          <CalendarDays className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-bold text-sm">{formatDate(order.servedAt)}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatTime(order.servedAt)}
                          </p>
                        </div>
                      </div>
                      <Badge
                        className={cn(
                          "text-[10px] px-2 h-5 gap-1 lg:hidden font-bold",
                          status.className
                        )}
                      >
                        <StatusIcon className={cn("h-3 w-3", status.iconClass)} />
                        {status.label}
                      </Badge>
                    </div>

                    <div className="lg:col-span-1 font-mono font-bold text-sm mb-2 lg:mb-0 lg:py-2">
                      <span className="lg:hidden text-xs text-muted-foreground font-normal mr-2">
                        Order:
                      </span>
                      {order.orderNumber.split("-").slice(-2).join("-")}
                    </div>

                    <div className="lg:col-span-1 mb-2 lg:mb-0 lg:py-2">
                      <Badge
                        variant="default"
                        className="text-[10px] px-2.5 h-5 font-black bg-slate-900 text-white border-0"
                      >
                        {order.tableNumber}
                      </Badge>
                    </div>

                    <div className="lg:col-span-2 mb-2 lg:mb-0 lg:py-2 flex lg:block items-center justify-between">
                      <p className="font-semibold text-sm truncate">{order.customerName}</p>
                    </div>

                    <div className="lg:col-span-1 mb-2 lg:mb-0 lg:py-2 flex lg:block items-center justify-between">
                      <span className="lg:hidden text-xs text-muted-foreground font-normal mr-2">
                        Items:
                      </span>
                      <Badge variant="muted" className="text-xs font-bold h-5 px-2">
                        {order.itemsCount}
                      </Badge>
                    </div>

                    <div className="lg:col-span-1 mb-3 lg:mb-0 lg:py-2 flex lg:block items-center justify-between">
                      <span className="lg:hidden text-xs text-muted-foreground font-normal mr-2">
                        Total:
                      </span>
                      <span className="font-black tracking-tight">{formatCurrency(order.totalAmount)}</span>
                    </div>

                    <div className="lg:col-span-2 mb-3 lg:mb-0 lg:py-2 flex lg:block items-center gap-2">
                      <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center font-bold text-xs text-indigo-700 shrink-0">
                        {order.servedBy.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <p className="text-sm font-medium truncate">{order.servedBy}</p>
                    </div>

                    <div className="lg:col-span-2 hidden lg:flex items-center">
                      <Badge className={cn("text-[10px] px-2.5 h-6 gap-1.5 font-bold", status.className)}>
                        <StatusIcon className={cn("h-3.5 w-3.5", status.iconClass)} />
                        {status.label}
                      </Badge>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>

          {paginatedOrders.length === 0 && (
            <div className="py-16 text-center">
              <div className="h-16 w-16 rounded-2xl bg-slate-100 mx-auto flex items-center justify-center mb-4">
                <History className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="font-black mb-1">No orders found</h3>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search or filters
              </p>
            </div>
          )}

          {filteredOrders.length > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-6 py-4 border-t border-border/50 bg-muted/10">
              <p className="text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-bold text-foreground">
                  {(currentPage - 1) * PAGE_SIZE + 1}
                </span>{" "}
                to{" "}
                <span className="font-bold text-foreground">
                  {Math.min(currentPage * PAGE_SIZE, filteredOrders.length)}
                </span>{" "}
                of <span className="font-bold text-foreground">{filteredOrders.length}</span>{" "}
                orders
              </p>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 w-9 p-0 rounded-lg"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-1 px-1">
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const pageNum = i + 1
                    const isActive = pageNum === currentPage
                    return (
                      <Button
                        key={pageNum}
                        variant={isActive ? "default" : "ghost"}
                        size="sm"
                        className={cn(
                          "h-9 min-w-9 px-3 rounded-lg font-bold text-sm",
                          isActive &&
                            "bg-gradient-to-r from-purple-600 to-violet-600 shadow-md shadow-purple-500/20 border-0"
                        )}
                        onClick={() => setPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 w-9 p-0 rounded-lg"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
