import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Plus, Search, QrCode, Edit3, Trash2, MoreHorizontal, Table2, Users,
  MapPin, UserCheck, Download, Grid3X3, List, Filter
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth, useRole } from "@/context/AuthContext"
import { useToast } from "@/components/ui/toast"
import { adminApi } from "@/api/orders"
import { cn } from "@/lib/utils"
import type { RestaurantTable, TableStatus } from "@/types"

type ViewMode = "grid" | "list"

const statusStyles: Record<TableStatus, { bg: string; text: string; dot: string; card: string }> = {
  AVAILABLE: { bg: "bg-emerald-500/10", text: "text-emerald-700", dot: "bg-emerald-500", card: "border-emerald-200 bg-emerald-50/40" },
  OCCUPIED: { bg: "bg-orange-500/10", text: "text-orange-700", dot: "bg-orange-500 animate-pulse", card: "border-orange-200 bg-orange-50/40" },
  RESERVED: { bg: "bg-violet-500/10", text: "text-violet-700", dot: "bg-violet-500", card: "border-violet-200 bg-violet-50/40" },
  CLEANING: { bg: "bg-sky-500/10", text: "text-sky-700", dot: "bg-sky-500 animate-pulse", card: "border-sky-200 bg-sky-50/40" },
}

const mockTables: RestaurantTable[] = [
  { id: 1, tableNumber: "T-01", capacity: 2, status: "AVAILABLE", restaurantId: 1, assignedWaiterName: "Emma Davis", location: "Window Side", qrCodeUrl: "#" },
  { id: 2, tableNumber: "T-02", capacity: 4, status: "OCCUPIED", restaurantId: 1, assignedWaiterName: "James Wilson", location: "Main Floor", qrCodeUrl: "#" },
  { id: 3, tableNumber: "T-03", capacity: 4, status: "OCCUPIED", restaurantId: 1, assignedWaiterName: "Emma Davis", location: "Main Floor", qrCodeUrl: "#" },
  { id: 4, tableNumber: "T-04", capacity: 6, status: "RESERVED", restaurantId: 1, assignedWaiterName: "Sarah Kim", location: "Corner Booth", qrCodeUrl: "#" },
  { id: 5, tableNumber: "T-05", capacity: 2, status: "CLEANING", restaurantId: 1, assignedWaiterName: "James Wilson", location: "Window Side", qrCodeUrl: "#" },
  { id: 6, tableNumber: "T-06", capacity: 4, status: "AVAILABLE", restaurantId: 1, assignedWaiterName: "Sarah Kim", location: "Main Floor", qrCodeUrl: "#" },
  { id: 7, tableNumber: "T-07", capacity: 8, status: "OCCUPIED", restaurantId: 1, assignedWaiterName: "Emma Davis", location: "Private Room", qrCodeUrl: "#" },
  { id: 8, tableNumber: "T-08", capacity: 2, status: "AVAILABLE", restaurantId: 1, assignedWaiterName: "James Wilson", location: "Bar Area", qrCodeUrl: "#" },
  { id: 9, tableNumber: "T-09", capacity: 4, status: "AVAILABLE", restaurantId: 1, assignedWaiterName: "Sarah Kim", location: "Patio", qrCodeUrl: "#" },
  { id: 10, tableNumber: "T-10", capacity: 10, status: "RESERVED", restaurantId: 1, assignedWaiterName: "Emma Davis", location: "Private Room", qrCodeUrl: "#" },
  { id: 11, tableNumber: "B-01", capacity: 1, status: "OCCUPIED", restaurantId: 1, assignedWaiterName: "Alex Johnson", location: "Bar Counter", qrCodeUrl: "#" },
  { id: 12, tableNumber: "P-01", capacity: 6, status: "AVAILABLE", restaurantId: 1, assignedWaiterName: "Sarah Kim", location: "Patio", qrCodeUrl: "#" },
]

const waiters = ["Emma Davis", "James Wilson", "Sarah Kim", "Alex Johnson", "Lisa Tran"]

export default function Tables() {
  const { toast } = useToast()
  const [tables, setTables] = useState<RestaurantTable[]>(mockTables)
  const [search, setSearch] = useState("")
  const [view, setView] = useState<ViewMode>("grid")
  const [filter, setFilter] = useState<string>("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<RestaurantTable | null>(null)
  const [form, setForm] = useState({ tableNumber: "", capacity: 4, status: "AVAILABLE" as TableStatus, assignedWaiterName: "", location: "", notes: "" })

  const filtered = tables.filter((t) => {
    const matchesSearch =
      t.tableNumber.toLowerCase().includes(search.toLowerCase()) ||
      (t.assignedWaiterName || "").toLowerCase().includes(search.toLowerCase()) ||
      (t.location || "").toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === "all" || t.status === filter
    return matchesSearch && matchesFilter
  })

  const stats = [
    { label: "Total", value: tables.length, color: "text-slate-900", bg: "bg-slate-100" },
    { label: "Available", value: tables.filter((t) => t.status === "AVAILABLE").length, color: "text-emerald-700", bg: "bg-emerald-100" },
    { label: "Occupied", value: tables.filter((t) => t.status === "OCCUPIED").length, color: "text-orange-700", bg: "bg-orange-100" },
    { label: "Cleaning", value: tables.filter((t) => t.status === "CLEANING").length, color: "text-sky-700", bg: "bg-sky-100" },
  ]

  const openAdd = () => {
    setEditing(null)
    setForm({ tableNumber: "", capacity: 4, status: "AVAILABLE", assignedWaiterName: "", location: "", notes: "" })
    setDialogOpen(true)
  }

  const openEdit = (t: RestaurantTable) => {
    setEditing(t)
    setForm({
      tableNumber: t.tableNumber, capacity: t.capacity || 4, status: t.status,
      assignedWaiterName: t.assignedWaiterName || "", location: t.location || "", notes: t.notes || "",
    })
    setDialogOpen(true)
  }

  const handleSave = () => {
    if (editing) {
      setTables((prev) => prev.map((t) => t.id === editing.id ? { ...t, ...form } : t))
      toast({ title: "Table updated", description: `${form.tableNumber} settings saved`, variant: "success" })
    } else {
      const newTable: RestaurantTable = {
        id: Date.now(), ...form, restaurantId: 1,
        qrCodeUrl: `#qr-${Date.now()}`,
      }
      setTables((prev) => [...prev, newTable])
      toast({ title: "Table created", description: `${form.tableNumber} added to floor plan`, variant: "success" })
    }
    setDialogOpen(false)
  }

  const handleDelete = (t: RestaurantTable) => {
    setTables((prev) => prev.filter((x) => x.id !== t.id))
    toast({ title: "Table removed", description: `${t.tableNumber} deleted`, variant: "destructive" })
  }

  const generateQr = (t: RestaurantTable) => {
    toast({ title: "QR Code", description: `Generated for ${t.tableNumber} — downloading...`, variant: "info" })
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Table Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage floor plan, table assignments, and QR codes</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2"><Download className="h-4 w-4" /> Export</Button>
          <Button onClick={openAdd} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Table
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="border-0">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{s.label}</p>
                    <p className={cn("text-3xl font-black mt-1", s.color)}>{s.value}</p>
                  </div>
                  <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center", s.bg)}>
                    <Table2 className="h-6 w-6 text-slate-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row flex-wrap gap-3 items-center justify-between">
          <div>
            <CardTitle className="text-lg">All Tables</CardTitle>
            <CardDescription>{filtered.length} of {tables.length} tables showing</CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input placeholder="Search tables..." className="pl-10 h-10 w-64" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="flex rounded-xl bg-slate-100 p-1">
              <button onClick={() => setFilter("all")} className={cn("px-3 py-1.5 rounded-lg text-xs font-semibold transition-all", filter === "all" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}>All</button>
              <button onClick={() => setFilter("AVAILABLE")} className={cn("px-3 py-1.5 rounded-lg text-xs font-semibold transition-all", filter === "AVAILABLE" ? "bg-white text-emerald-700 shadow-sm" : "text-slate-500 hover:text-emerald-600")}>Free</button>
              <button onClick={() => setFilter("OCCUPIED")} className={cn("px-3 py-1.5 rounded-lg text-xs font-semibold transition-all", filter === "OCCUPIED" ? "bg-white text-orange-700 shadow-sm" : "text-slate-500 hover:text-orange-600")}>Busy</button>
            </div>
            <div className="flex rounded-xl bg-slate-100 p-1">
              <button onClick={() => setView("grid")} className={cn("h-8 w-8 rounded-lg flex items-center justify-center transition-all", view === "grid" ? "bg-white shadow-sm text-slate-900" : "text-slate-500")}>
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button onClick={() => setView("list")} className={cn("h-8 w-8 rounded-lg flex items-center justify-center transition-all", view === "list" ? "bg-white shadow-sm text-slate-900" : "text-slate-500")}>
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            {view === "grid" ? (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"
              >
                {filtered.map((t, i) => {
                  const s = statusStyles[t.status]
                  return (
                    <motion.div
                      key={t.id}
                      initial={{ opacity: 0, y: 20, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: i * 0.02 }}
                      className="group relative"
                    >
                      <Card className={cn("h-full transition-all duration-300 hover:shadow-lg card-hover", s.card)}>
                        <CardContent className="p-5">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <p className="font-black text-2xl tracking-tight text-slate-900">{t.tableNumber}</p>
                              <div className="flex items-center gap-1.5 mt-1">
                                <Users className="h-3.5 w-3.5 text-slate-500" />
                                <span className="text-xs font-semibold text-slate-600">{t.capacity} seats</span>
                              </div>
                            </div>
                            <Badge variant="outline" className={cn(s.bg, s.text, "border-0 gap-1.5")}>
                              <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} />
                              {t.status.charAt(0) + t.status.slice(1).toLowerCase()}
                            </Badge>
                          </div>

                          <div className="space-y-2">
                            {t.location && (
                              <div className="flex items-center gap-2 text-xs">
                                <MapPin className="h-3.5 w-3.5 text-slate-400" />
                                <span className="text-slate-600 font-medium">{t.location}</span>
                              </div>
                            )}
                            {t.assignedWaiterName && (
                              <div className="flex items-center gap-2 text-xs">
                                <Avatar className="h-5 w-5">
                                  <AvatarFallback name={t.assignedWaiterName} />
                                </Avatar>
                                <span className="text-slate-600 font-medium truncate">{t.assignedWaiterName}</span>
                              </div>
                            )}
                          </div>

                          <div className="mt-4 pt-4 border-t border-slate-200/60 flex items-center gap-1.5">
                            <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-500 hover:text-orange-600 hover:bg-orange-50" onClick={() => generateQr(t)} title="QR Code">
                              <QrCode className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-500 hover:text-violet-600 hover:bg-violet-50" onClick={() => openEdit(t)} title="Edit">
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(t)} title="Delete">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-9 w-9 ml-auto text-slate-500 hover:text-slate-900">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-44">
                                <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {(["AVAILABLE", "OCCUPIED", "RESERVED", "CLEANING"] as TableStatus[]).map((st) => (
                                  <DropdownMenuItem key={st} onClick={() => setTables((prev) => prev.map((x) => x.id === t.id ? { ...x, status: st } : x))}>
                                    <span className={cn("h-2 w-2 rounded-full mr-2", statusStyles[st].dot)} />
                                    {st.charAt(0) + st.slice(1).toLowerCase()}
                                  </DropdownMenuItem>
                                ))}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleDelete(t)} className="text-red-600">
                                  <Trash2 className="h-4 w-4 mr-2" /> Remove Table
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
                {filtered.length === 0 && (
                  <div className="col-span-full py-20 text-center">
                    <div className="h-16 w-16 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                      <Filter className="h-8 w-8 text-slate-400" />
                    </div>
                    <p className="text-sm font-semibold text-slate-900">No tables match your search</p>
                    <p className="text-xs text-slate-500 mt-1">Try adjusting filters or clear the search</p>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="overflow-x-auto -mx-6 px-6">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Table</th>
                      <th className="text-left py-3 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Seats</th>
                      <th className="text-left py-3 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Zone</th>
                      <th className="text-left py-3 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Waiter</th>
                      <th className="text-left py-3 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="text-right py-3 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((t, i) => {
                      const s = statusStyles[t.status]
                      return (
                        <motion.tr
                          key={t.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.02 }}
                          className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors"
                        >
                          <td className="py-3.5 px-3">
                            <p className="font-black text-lg text-slate-900">{t.tableNumber}</p>
                          </td>
                          <td className="py-3.5 px-3">
                            <Badge variant="muted" className="font-mono">{t.capacity}p</Badge>
                          </td>
                          <td className="py-3.5 px-3">
                            <span className="text-sm text-slate-700">{t.location || "—"}</span>
                          </td>
                          <td className="py-3.5 px-3">
                            {t.assignedWaiterName ? (
                              <div className="flex items-center gap-2">
                                <Avatar className="h-7 w-7">
                                  <AvatarFallback name={t.assignedWaiterName} />
                                </Avatar>
                                <span className="text-sm font-medium text-slate-700">{t.assignedWaiterName}</span>
                              </div>
                            ) : <span className="text-sm text-slate-400">Unassigned</span>}
                          </td>
                          <td className="py-3.5 px-3">
                            <Badge variant="outline" className={cn(s.bg, s.text, "border-0 gap-1.5")}>
                              <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} />
                              {t.status.charAt(0) + t.status.slice(1).toLowerCase()}
                            </Badge>
                          </td>
                          <td className="py-3.5 px-3 text-right">
                            <div className="inline-flex items-center gap-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => generateQr(t)}><QrCode className="h-4 w-4" /></Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(t)}><Edit3 className="h-4 w-4" /></Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600" onClick={() => handleDelete(t)}><Trash2 className="h-4 w-4" /></Button>
                            </div>
                          </td>
                        </motion.tr>
                      )
                    })}
                  </tbody>
                </table>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? `Edit ${editing.tableNumber}` : "Add New Table"}</DialogTitle>
            <DialogDescription>Configure table details and assignment</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Table Number / Label *</Label>
                <Input placeholder="T-01" value={form.tableNumber} onChange={(e) => setForm({ ...form, tableNumber: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Seating Capacity</Label>
                <Input type="number" min={1} value={form.capacity} onChange={(e) => setForm({ ...form, capacity: parseInt(e.target.value) || 2 })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as TableStatus })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AVAILABLE">Available</SelectItem>
                    <SelectItem value="OCCUPIED">Occupied</SelectItem>
                    <SelectItem value="RESERVED">Reserved</SelectItem>
                    <SelectItem value="CLEANING">Cleaning</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Assigned Waiter</Label>
                <Select value={form.assignedWaiterName || "none"} onValueChange={(v) => setForm({ ...form, assignedWaiterName: v === "none" ? "" : v })}>
                  <SelectTrigger><SelectValue placeholder="Select staff" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Unassigned</SelectItem>
                    {waiters.map((w) => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Location / Zone</Label>
              <Select value={form.location || "none"} onValueChange={(v) => setForm({ ...form, location: v === "none" ? "" : v })}>
                <SelectTrigger><SelectValue placeholder="Choose a zone" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Custom location...</SelectItem>
                  <SelectItem value="Main Floor">Main Floor</SelectItem>
                  <SelectItem value="Window Side">Window Side</SelectItem>
                  <SelectItem value="Bar Area">Bar Area</SelectItem>
                  <SelectItem value="Patio">Patio</SelectItem>
                  <SelectItem value="Corner Booth">Corner Booth</SelectItem>
                  <SelectItem value="Private Room">Private Room</SelectItem>
                  <SelectItem value="Bar Counter">Bar Counter</SelectItem>
                </SelectContent>
              </Select>
              {form.location === "" && (
                <Input placeholder="Or type custom location..." value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
              )}
            </div>
            <div className="space-y-2">
              <Label>Notes (internal)</Label>
              <Input placeholder="e.g. Highchair-friendly, Wheelchair access..." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={!form.tableNumber}>
              {editing ? "Save Changes" : "Create Table"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
