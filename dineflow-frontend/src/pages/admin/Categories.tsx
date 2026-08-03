import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tags, Plus, Search, Edit3, Trash2, MoreHorizontal, Image as ImageIcon,
  GripVertical, ToggleLeft, ToggleRight, Eye, EyeOff, ChefHat, UtensilsCrossed,
  Salad, Cake, Coffee, Wine, Sandwich, Flame, Soup, IceCream, Filter
} from "lucide-react"
import { motion } from "framer-motion"
import { useAuth, useRole } from "@/context/AuthContext"
import { useToast } from "@/components/ui/toast"
import { adminApi } from "@/api/orders"
import { cn } from "@/lib/utils"
import type { Category } from "@/types"

const iconMap: Record<string, any> = {
  Starters: Soup,
  "Main Course": UtensilsCrossed,
  Desserts: Cake,
  Beverages: Wine,
  Salads: Salad,
  Sides: Sandwich,
  "Chef's Specials": Flame,
  Coffee: Coffee,
  IceCream: IceCream,
}

const gradients = [
  "from-orange-400 to-rose-500",
  "from-violet-500 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-pink-500 to-rose-600",
  "from-sky-500 to-cyan-600",
  "from-fuchsia-500 to-purple-600",
  "from-red-500 to-orange-600",
]

const mockCategories: Category[] = [
  { id: 1, name: "Starters", description: "Light bites to begin your meal", restaurantId: 1, displayOrder: 1, isActive: true, menuItemCount: 12, imageUrl: "", createdAt: "" },
  { id: 2, name: "Main Course", description: "Signature dishes and hearty plates", restaurantId: 1, displayOrder: 2, isActive: true, menuItemCount: 28, imageUrl: "", createdAt: "" },
  { id: 3, name: "Desserts", description: "Sweet endings and indulgent treats", restaurantId: 1, displayOrder: 3, isActive: true, menuItemCount: 15, imageUrl: "", createdAt: "" },
  { id: 4, name: "Beverages", description: "Wine, cocktails, soft drinks", restaurantId: 1, displayOrder: 4, isActive: true, menuItemCount: 42, imageUrl: "", createdAt: "" },
  { id: 5, name: "Salads", description: "Fresh, crisp, and healthy options", restaurantId: 1, displayOrder: 5, isActive: true, menuItemCount: 9, imageUrl: "", createdAt: "" },
  { id: 6, name: "Sides", description: "Perfect complements to your main", restaurantId: 1, displayOrder: 6, isActive: true, menuItemCount: 11, imageUrl: "", createdAt: "" },
  { id: 7, name: "Chef's Specials", description: "Limited-time chef creations", restaurantId: 1, displayOrder: 7, isActive: false, menuItemCount: 6, imageUrl: "", createdAt: "" },
  { id: 8, name: "Kid's Menu", description: "Favorites for our younger guests", restaurantId: 1, displayOrder: 8, isActive: true, menuItemCount: 7, imageUrl: "", createdAt: "" },
]

const totalItems = mockCategories.reduce((a, b) => a + b.menuItemCount, 0)

export default function Categories() {
  const { toast } = useToast()
  const [categories, setCategories] = useState<Category[]>(mockCategories)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<string>("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [form, setForm] = useState({ name: "", description: "", imageUrl: "", displayOrder: 1, isActive: true })

  const filtered = categories.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.description || "").toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === "all" ? true : (filter === "active" ? c.isActive : !c.isActive)
    return matchesSearch && matchesFilter
  })

  const openAdd = () => {
    setEditing(null)
    setForm({ name: "", description: "", imageUrl: "", displayOrder: categories.length + 1, isActive: true })
    setDialogOpen(true)
  }

  const openEdit = (c: Category) => {
    setEditing(c)
    setForm({ name: c.name, description: c.description || "", imageUrl: c.imageUrl || "", displayOrder: c.displayOrder, isActive: c.isActive })
    setDialogOpen(true)
  }

  const handleSave = () => {
    if (!form.name.trim()) return
    if (editing) {
      setCategories((prev) => prev.map((c) => c.id === editing.id ? { ...c, ...form } : c))
      toast({ title: "Category updated", description: `${form.name} saved successfully`, variant: "success" })
    } else {
      const newCat: Category = {
        id: Date.now(), ...form, restaurantId: 1, menuItemCount: 0, createdAt: new Date().toISOString(),
      }
      setCategories((prev) => [...prev, newCat])
      toast({ title: "Category created", description: `${form.name} added to menu`, variant: "success" })
    }
    setDialogOpen(false)
  }

  const handleDelete = (c: Category) => {
    setCategories((prev) => prev.filter((x) => x.id !== c.id))
    toast({ title: "Category deleted", description: `${c.name} removed from menu`, variant: "destructive" })
  }

  const toggleActive = (c: Category) => {
    setCategories((prev) => prev.map((x) => x.id === c.id ? { ...x, isActive: !x.isActive } : x))
    toast({ title: c.isActive ? "Category hidden" : "Category published", variant: c.isActive ? "warning" : "success" })
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
          <p className="text-sm text-muted-foreground mt-1">Organize your menu into sections for easy browsing</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <GripVertical className="h-4 w-4" />
            Reorder
          </Button>
          <Button onClick={openAdd} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Category
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card className="border-0 bg-gradient-to-br from-orange-500 to-rose-500 text-white overflow-hidden relative">
            <div className="absolute -right-8 -bottom-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
            <CardContent className="relative p-5">
              <Tags className="h-8 w-8 text-white/80 mb-3" />
              <p className="text-3xl font-black">{categories.length}</p>
              <p className="text-sm font-medium text-white/80">Total Categories</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border-0">
            <CardContent className="p-5">
              <UtensilsCrossed className="h-8 w-8 text-violet-500 mb-3" />
              <p className="text-3xl font-black">{totalItems}</p>
              <p className="text-sm font-medium text-slate-500">Menu Items Total</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card className="border-0">
            <CardContent className="p-5">
              <ChefHat className="h-8 w-8 text-emerald-500 mb-3" />
              <p className="text-3xl font-black">{categories.filter((c) => c.isActive).length}<span className="text-lg text-slate-400 font-bold">/{categories.length}</span></p>
              <p className="text-sm font-medium text-slate-500">Active / Inactive</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="text-lg">All Categories</CardTitle>
            <CardDescription>{filtered.length} categories showing</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input placeholder="Search categories..." className="pl-10 h-10 w-64" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Tabs defaultValue="all" onValueChange={setFilter} className="w-auto">
              <TabsList className="h-10">
                <TabsTrigger value="all" className="h-8 text-xs">All</TabsTrigger>
                <TabsTrigger value="active" className="h-8 text-xs">Active</TabsTrigger>
                <TabsTrigger value="inactive" className="h-8 text-xs">Draft</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <div className="py-20 text-center">
              <div className="h-16 w-16 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                <Filter className="h-8 w-8 text-slate-400" />
              </div>
              <p className="text-sm font-semibold text-slate-900">No categories found</p>
              <p className="text-xs text-slate-500 mt-1">Try a different search or filter</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((c, i) => {
                const Icon = iconMap[c.name] || Tags
                const grad = gradients[i % gradients.length]
                return (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    whileHover={{ y: -3 }}
                  >
                    <Card className={cn("h-full card-hover overflow-hidden group", !c.isActive && "opacity-70")}>
                      <div className={cn("h-28 relative bg-gradient-to-br", grad)}>
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                        <div className="absolute top-3 right-3 flex gap-1">
                          <Badge variant="outline" className="bg-white/90 backdrop-blur text-slate-800 border-0 text-xs font-bold">
                            {c.menuItemCount} items
                          </Badge>
                        </div>
                        <div className="absolute -bottom-10 left-5">
                          <div className="h-20 w-20 rounded-2xl bg-white shadow-xl border-4 border-white flex items-center justify-center">
                            <div className={cn("h-14 w-14 rounded-xl bg-gradient-to-br flex items-center justify-center text-white", grad)}>
                              <Icon className="h-7 w-7" />
                            </div>
                          </div>
                        </div>
                        <div className="absolute bottom-3 right-4">
                          <Badge variant="muted" className="bg-white/90 backdrop-blur gap-1.5">
                            <span className={cn("h-1.5 w-1.5 rounded-full", c.isActive ? "bg-emerald-500" : "bg-slate-400")} />
                            {c.isActive ? "Live" : "Draft"}
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="pt-12 pb-5">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-bold text-lg text-slate-900 leading-tight">{c.name}</h3>
                            <p className="text-xs text-slate-400 mt-0.5">Order: #{c.displayOrder}</p>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 -mt-1">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => openEdit(c)}>
                                <Edit3 className="h-4 w-4 mr-2" /> Edit Category
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => toggleActive(c)}>
                                {c.isActive ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                                {c.isActive ? "Make Draft" : "Publish"}
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <ChefHat className="h-4 w-4 mr-2" /> View Items
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleDelete(c)} className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <p className="text-sm text-slate-600 min-h-[40px] line-clamp-2">{c.description || "No description set"}</p>
                        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2">
                          <Button variant="outline" size="sm" className="gap-1.5 text-xs flex-1" onClick={() => openEdit(c)}>
                            <Edit3 className="h-3.5 w-3.5" /> Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className={cn("h-9 w-9", c.isActive ? "text-orange-600 hover:bg-orange-50" : "text-emerald-600 hover:bg-emerald-50")}
                            onClick={() => toggleActive(c)}
                          >
                            {c.isActive ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}
                          </Button>
                          <Button variant="ghost" size="icon" className="h-9 w-9 text-red-500 hover:bg-red-50 hover:text-red-600" onClick={() => handleDelete(c)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? `Edit Category` : "Create New Category"}</DialogTitle>
            <DialogDescription>Categories organize your menu for customers</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Category Name *</Label>
              <Input placeholder="e.g. Appetizers" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea rows={3} placeholder="Describe what customers can find in this category..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Display Image URL</Label>
              <div className="flex gap-2">
                <Input placeholder="https://..." value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
              </div>
              <div className="flex gap-2 mt-2">
                {gradients.slice(0, 5).map((g, i) => (
                  <div key={i} className={cn("h-12 w-12 rounded-xl bg-gradient-to-br cursor-pointer hover:ring-2 ring-offset-2 ring-orange-400 transition-all", g)}>
                    <div className="h-full w-full rounded-xl flex items-center justify-center text-white/90">
                      <ImageIcon className="h-5 w-5" />
                    </div>
                  </div>
                ))}
                <div className="h-12 w-12 rounded-xl bg-slate-100 border-2 border-dashed border-slate-300 cursor-pointer hover:border-orange-400 flex items-center justify-center text-slate-500">
                  <Plus className="h-5 w-5" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Display Order</Label>
                <Input type="number" min={1} value={form.displayOrder} onChange={(e) => setForm({ ...form, displayOrder: parseInt(e.target.value) || 1 })} />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <div className="h-11 px-4 rounded-xl border border-input bg-background/80 flex items-center justify-between cursor-pointer" onClick={() => setForm({ ...form, isActive: !form.isActive })}>
                  <span className="text-sm font-medium">{form.isActive ? "Active (Visible)" : "Draft (Hidden)"}</span>
                  {form.isActive ? <ToggleRight className="h-5 w-5 text-orange-600" /> : <ToggleLeft className="h-5 w-5 text-slate-400" />}
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={!form.name.trim()}>
              {editing ? "Save Changes" : "Create Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
