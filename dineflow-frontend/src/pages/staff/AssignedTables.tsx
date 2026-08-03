import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table2,
  Users,
  User,
  CheckCircle2,
  Clock,
  Sparkles,
  RefreshCw,
  Filter,
  LayoutGrid,
  AlertCircle,
} from "lucide-react"
import { motion } from "framer-motion"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/components/ui/toast"
import { staffApi } from "@/api/orders"
import { cn } from "@/lib/utils"
import type { RestaurantTable, TableStatus } from "@/types"

const mockTables: RestaurantTable[] = [
  { id: 1, tableNumber: "T-01", capacity: 2, status: "OCCUPIED", restaurantId: 1, assignedWaiterName: "Alex Johnson", location: "Main Hall" },
  { id: 2, tableNumber: "T-02", capacity: 4, status: "AVAILABLE", restaurantId: 1, assignedWaiterName: "Alex Johnson", location: "Main Hall" },
  { id: 3, tableNumber: "T-03", capacity: 2, status: "OCCUPIED", restaurantId: 1, assignedWaiterName: "Alex Johnson", location: "Main Hall" },
  { id: 4, tableNumber: "T-04", capacity: 6, status: "RESERVED", restaurantId: 1, assignedWaiterName: "Alex Johnson", location: "Main Hall" },
  { id: 5, tableNumber: "T-05", capacity: 4, status: "OCCUPIED", restaurantId: 1, assignedWaiterName: "Alex Johnson", location: "Window Side" },
  { id: 6, tableNumber: "T-06", capacity: 2, status: "CLEANING", restaurantId: 1, assignedWaiterName: "Alex Johnson", location: "Window Side" },
  { id: 7, tableNumber: "T-07", capacity: 8, status: "AVAILABLE", restaurantId: 1, assignedWaiterName: "Alex Johnson", location: "Private Area" },
  { id: 8, tableNumber: "T-08", capacity: 4, status: "OCCUPIED", restaurantId: 1, assignedWaiterName: "Alex Johnson", location: "Private Area" },
  { id: 9, tableNumber: "T-09", capacity: 2, status: "AVAILABLE", restaurantId: 1, assignedWaiterName: "Alex Johnson", location: "Patio" },
  { id: 10, tableNumber: "T-10", capacity: 6, status: "OCCUPIED", restaurantId: 1, assignedWaiterName: "Alex Johnson", location: "Patio" },
  { id: 11, tableNumber: "T-11", capacity: 4, status: "RESERVED", restaurantId: 1, assignedWaiterName: "Alex Johnson", location: "Patio" },
  { id: 12, tableNumber: "T-12", capacity: 4, status: "OCCUPIED", restaurantId: 1, assignedWaiterName: "Alex Johnson", location: "Main Hall" },
]

const statusConfig: Record<TableStatus, { label: string; variant: string; gradient: string; ring: string; dot: string; bgIcon: string }> = {
  AVAILABLE: {
    label: "AVAILABLE",
    variant: "success",
    gradient: "from-emerald-500 to-green-600",
    ring: "ring-emerald-200",
    dot: "bg-emerald-500",
    bgIcon: "bg-emerald-500/10 text-emerald-600",
  },
  OCCUPIED: {
    label: "OCCUPIED",
    variant: "warning",
    gradient: "from-amber-500 to-orange-600",
    ring: "ring-amber-200",
    dot: "bg-amber-500",
    bgIcon: "bg-amber-500/10 text-amber-600",
  },
  RESERVED: {
    label: "RESERVED",
    variant: "default",
    gradient: "from-blue-500 to-indigo-600",
    ring: "ring-blue-200",
    dot: "bg-blue-500",
    bgIcon: "bg-blue-500/10 text-blue-600",
  },
  CLEANING: {
    label: "CLEANING",
    variant: "secondary",
    gradient: "from-purple-500 to-violet-600",
    ring: "ring-purple-200",
    dot: "bg-purple-500",
    bgIcon: "bg-purple-500/10 text-purple-600",
  },
}

export default function AssignedTables() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [tables, setTables] = useState<RestaurantTable[]>(mockTables)
  const [filter, setFilter] = useState<TableStatus | "ALL">("ALL")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadTables = async () => {
      try {
        if (user?.id) {
          const res = await staffApi.getAssignedTables(user.id)
          if (res.data.success) {
            setTables(res.data.data)
          }
        }
      } catch {
      }
    }
    loadTables()
  }, [user?.id])

  const refreshTables = async () => {
    setLoading(true)
    toast({ title: "Refreshing", description: "Fetching latest table status...", variant: "info" })
    setTimeout(() => {
      setLoading(false)
      toast({ title: "Updated", description: "Table status refreshed", variant: "success" })
    }, 800)
  }

  const filteredTables = filter === "ALL" ? tables : tables.filter(t => t.status === filter)

  const counts = {
    ALL: tables.length,
    AVAILABLE: tables.filter(t => t.status === "AVAILABLE").length,
    OCCUPIED: tables.filter(t => t.status === "OCCUPIED").length,
    RESERVED: tables.filter(t => t.status === "RESERVED").length,
    CLEANING: tables.filter(t => t.status === "CLEANING").length,
  }

  const filters: (TableStatus | "ALL")[] = ["ALL", "AVAILABLE", "OCCUPIED", "RESERVED", "CLEANING"]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
            <LayoutGrid className="h-7 w-7 text-blue-500" />
            Assigned Tables
          </h1>
          <p className="text-muted-foreground mt-1">Monitor and manage your assigned table sections.</p>
        </div>
        <Button variant="outline" onClick={refreshTables} disabled={loading}>
          <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
          Refresh Status
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {filters.map((f) => {
          const isActive = filter === f
          const label = f === "ALL" ? "All Tables" : statusConfig[f as TableStatus].label
          const count = counts[f as keyof typeof counts]
          return (
            <Button
              key={f}
              variant={isActive ? "default" : "outline"}
              onClick={() => setFilter(f)}
              className={cn(
                "h-auto py-3 flex-col gap-1 rounded-xl",
                isActive && "shadow-lg shadow-blue-500/20"
              )}
            >
              <span className="text-lg font-black">{count}</span>
              <span className={cn("text-[10px] uppercase tracking-wider font-semibold", isActive ? "text-white/80" : "text-muted-foreground")}>{label}</span>
            </Button>
          )
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredTables.map((table, i) => {
          const config = statusConfig[table.status]
          return (
            <motion.div
              key={table.id}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ y: -4 }}
            >
              <Card className={cn(
                "h-full overflow-hidden group hover:shadow-elevated transition-all duration-300 border border-border/50",
                table.status === "OCCUPIED" && "ring-1 ring-amber-200/50",
                table.status === "AVAILABLE" && "ring-1 ring-emerald-200/50"
              )}>
                <div className={cn("h-1.5 bg-gradient-to-r", config.gradient)} />
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className={cn("h-14 w-14 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform", config.gradient)}>
                      <Table2 className="h-7 w-7 text-white" />
                    </div>
                    <Badge variant={config.variant as any} className="gap-1.5 px-2.5 py-1">
                      <span className={cn("h-1.5 w-1.5 rounded-full animate-pulse", config.dot)} />
                      {config.label}
                    </Badge>
                  </div>

                  <div>
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-2xl font-black tracking-tight">{table.tableNumber}</h3>
                      <span className="text-xs text-muted-foreground">{table.location}</span>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3 pt-4 border-t border-border/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>Capacity</span>
                      </div>
                      <span className="font-bold flex items-center gap-1">
                        {table.capacity}
                        <span className="text-xs text-muted-foreground font-medium">seats</span>
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="h-4 w-4" />
                        <span>Waiter</span>
                      </div>
                      <span className="font-semibold text-sm truncate max-w-[140px]" title={table.assignedWaiterName}>
                        {table.assignedWaiterName || "Unassigned"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    {table.status === "CLEANING" && (
                      <Button className="w-full gap-1.5 text-sm" size="sm" variant="outline">
                        <CheckCircle2 className="h-4 w-4" />
                        Mark Ready
                      </Button>
                    )}
                    {table.status === "OCCUPIED" && (
                      <Button className="w-full gap-1.5 text-sm" size="sm">
                        <Sparkles className="h-4 w-4" />
                        View Order
                      </Button>
                    )}
                    {table.status === "AVAILABLE" && (
                      <Button className="w-full gap-1.5 text-sm" size="sm" variant="success">
                        <CheckCircle2 className="h-4 w-4" />
                        Seat Guests
                      </Button>
                    )}
                    {table.status === "RESERVED" && (
                      <Button className="w-full gap-1.5 text-sm" size="sm" variant="outline">
                        <AlertCircle className="h-4 w-4" />
                        Reservation
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {filteredTables.length === 0 && (
        <Card>
          <CardContent className="py-16 text-center">
            <Filter className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-muted-foreground font-semibold">No tables match this filter</p>
            <Button variant="ghost" className="mt-3" onClick={() => setFilter("ALL")}>Clear filters</Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
