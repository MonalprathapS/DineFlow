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
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  ChefHat, Plus, Search, Edit3, Trash2, MoreHorizontal, Filter, ToggleLeft, ToggleRight,
  Image as ImageIcon, Clock, Flame, Leaf, Award, Star, SlidersHorizontal, X,
  UtensilsCrossed, DollarSign, Ban, CheckCircle2
} from "lucide-react"
import { motion } from "framer-motion"
import { useAuth, useRole } from "@/context/AuthContext"
import { useToast } from "@/components/ui/toast"
import { adminApi } from "@/api/orders"
import { cn, formatCurrency } from "@/lib/utils"
import type { MenuItem, Category } from "@/types"

const categories = ["Starters", "Main Course", "Desserts", "Beverages", "Salads", "Sides", "Chef's Specials"]

const mockItems: MenuItem[] = [
  { id: 1, name: "Truffle Mushroom Pizza", description: "Wild mushrooms, fontina cheese, black truffle oil, micro herbs", price: 24.99, imageUrl: "", isAvailable: true, isVegetarian: true, isVegan: false, isFeatured: true, preparationTime: 20, calories: 580, ingredients: "Flour, mushrooms, truffle, cheese", avgRating: 4.8, totalRatings: 247, categoryId: 2, categoryName: "Main Course", restaurantId: 1, displayOrder: 1 },
  { id: 2, name: "Wagyu Beef Burger", description: "150g wagyu patty, aged cheddar, caramelized onions, brioche bun", price: 32.50, imageUrl: "", isAvailable: true, isVegetarian: false, isVegan: false, isFeatured: true, preparationTime: 15, calories: 820, ingredients: "Wagyu beef, cheddar, brioche", avgRating: 4.9, totalRatings: 312, categoryId: 2, categoryName: "Main Course", restaurantId: 1, displayOrder: 2 },
  { id: 3, name: "Sushi Platter Deluxe", description: "Chef's selection of premium nigiri and rolls (18 pieces)", price: 45.00, imageUrl: "", isAvailable: true, isVegetarian: false, isVegan: false, isFeatured: true, preparationTime: 25, calories: 420, ingredients: "Tuna, salmon, eel, avocado, rice", avgRating: 4.9, totalRatings: 189, categoryId: 2, categoryName: "Main Course", restaurantId: 1, displayOrder: 3 },
  { id: 4, name: "Chocolate Lava Cake", description: "Warm molten chocolate cake, vanilla gelato, raspberry coulis", price: 12.99, imageUrl: "", isAvailable: true, isVegetarian: true, isVegan: false, isFeatured: true, preparationTime: 12, calories: 640, ingredients: "Dark chocolate, eggs, flour, gelato", avgRating: 4.7, totalRatings: 402, categoryId: 3, categoryName: "Desserts", restaurantId: 1, displayOrder: 1 },
  { id: 5, name: "Caesar Salad Royal", description: "Hearts of romaine, parmigiano reggiano, house croutons, lemon dressing", price: 14.50, imageUrl: "", isAvailable: true, isVegetarian: true, isVegan: false, isFeatured: false, preparationTime: 8, calories: 320, ingredients: "Romaine, parmesan, croutons", avgRating: 4.5, totalRatings: 167, categoryId: 5, categoryName: "Salads", restaurantId: 1, displayOrder: 1 },
  { id: 6, name: "Heirloom Tomato Soup", description: "Slow-roasted tomatoes, basil oil, crème fraîche", price: 9.50, imageUrl: "", isAvailable: false, isVegetarian: true, isVegan: false, isFeatured: false, preparationTime: 5, calories: 210, ingredients: "Tomatoes, basil, cream", avgRating: 4.4, totalRatings: 98, categoryId: 1, categoryName: "Starters", restaurantId: 1, displayOrder: 1 },
  { id: 7, name: "Agedashi Tofu", description: "Crispy silken tofu, dashi broth, scallions, grated daikon", price: 11.00, imageUrl: "", isAvailable: true, isVegetarian: true, isVegan: true, isFeatured: false, preparationTime: 10, calories: 180, ingredients: "Tofu, dashi, soy, daikon", avgRating: 4.6, totalRatings: 143, categoryId: 1, categoryName: "Starters", restaurantId: 1, displayOrder: 2 },
  { id: 8, name: "Signature Negroni", description: "Gin, Campari, sweet vermouth, orange peel", price: 15.00, imageUrl: "", isAvailable: true, isVegetarian: true, isVegan: true, isFeatured: true, preparationTime: 5, calories: 180, ingredients: "Gin, Campari, vermouth", avgRating: 4.7, totalRatings: 221, categoryId: 4, categoryName: "Beverages", restaurantId: 1, displayOrder: 1 },
  { id: 9, name: "Roasted Cauliflower Steak", description: "Whole cauliflower, harissa glaze, tahini, pomegranate seeds", price: 22.00, imageUrl: "", isAvailable: true, isVegetarian: true, isVegan: true, isFeatured: false, preparationTime: 30, calories: 380, ingredients: "Cauliflower, harissa, tahini", avgRating: 4.5, totalRatings: 87, categoryId: 2, categoryName: "Main Course", restaurantId: 1, displayOrder: 4 },
  { id: 10, name: "Cappuccino", description: "Double espresso, steamed milk, microfoam", price: 5.50, imageUrl: "", isAvailable: true, isVegetarian: true, isVegan: false, isFeatured: false, preparationTime: 3, calories: 80, ingredients: "Espresso, milk", avgRating: 4.6, totalRatings: 512, categoryId: 4, categoryName: "Beverages", restaurantId: 1, displayOrder: 2 },
  { id: 11, name: "Lobster Linguine", description: "Fresh Maine lobster, hand-cut pasta, saffron cream", price: 42.00, imageUrl: "", isAvailable: true, isVegetarian: false, isVegan: false, isFeatured: true, preparationTime: 22, calories: 720, ingredients: "Lobster, pasta, saffron, cream", avgRating: 4.9, totalRatings: 156, categoryId: 2, categoryName: "Main Course", restaurantId: 1, displayOrder: 5 },
  { id: 12, name: "Vegan Buddha Bowl", description: "Quinoa, avocado, roasted chickpeas, tahini dressing", price: 16.50, imageUrl: "", isAvailable: true, isVegetarian: true, isVegan: true, isFeatured: false, preparationTime: 12, calories: 480, ingredients: "Quinoa, avocado, chickpeas, tahini", avgRating: 4.4, totalRatings: 78, categoryId: 5, categoryName: "Salads", restaurantId: 1, displayOrder: 2 },
]

const categoryColors: Record<string, string> = {
  Starters: "from-sky-500 to-cyan-600",
  "Main Course": "from-orange-500 to-rose-500",
  Desserts: "from-pink-500 to-fuchsia-600",
  Beverages: "from-violet-500 to-indigo-600",
  Salads: "from-emerald-500 to-teal-600",
  Sides: "from-amber-500 to-yellow-600",
  "Chef's Specials": "from-red-500 to-orange-600",
}

export default function Menu() {
  const { toast } = useToast()
  const [items, setItems] = useState<MenuItem[]>(mockItems)
  const [search, setSearch] = useState("")
  const [catFilter, setCatFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<MenuItem | null>(null)
  const [form, setForm] = useState({
    name: "", description: "", price: 0, imageUrl: "", categoryId: 2, categoryName: "Main Course",
    isAvailable: true, isVegetarian: false, isVegan: false, isFeatured: false,
    preparationTime: 15, calories: 0, ingredients: "", displayOrder: 1,
  })

  const filtered = items.filter((it) => {
    const s = search.toLowerCase()
    const match = it.name.toLowerCase().includes(s) || it.description?.toLowerCase().includes(s) || (it.ingredients || "").toLowerCase().includes(s)
    const catMatch = catFilter === "all" || it.categoryName === catFilter
    const statusMatch = statusFilter === "all" || (statusFilter === "active" ? it.isAvailable : !it.isAvailable)
    return match && catMatch && statusMatch
  })

  const openAdd = () => {
    setEditing(null)
    setForm({
      name: "", description: "", price: 0, imageUrl: "", categoryId: 2, categoryName: "Main Course",
      isAvailable: true, isVegetarian: false, isVegan: false, isFeatured: false,
      preparationTime: 15, calories: 0, ingredients: "", displayOrder: items.length + 1,
    })
    setDialogOpen(true)
  }

  const openEdit = (it: MenuItem) => {
    setEditing(it)
    setForm({
      name: it.name, description: it.description || "", price: it.price, imageUrl: it.imageUrl || "",
      categoryId: it.categoryId, categoryName: it.categoryName || "Main Course",
      isAvailable: it.isAvailable, isVegetarian: it.isVegetarian, isVegan: it.isVegan, isFeatured: it.isFeatured,
      preparationTime: it.preparationTime || 15, calories: it.calories || 0, ingredients: it.ingredients || "",
      displayOrder: it.displayOrder,
    })
    setDialogOpen(true)
  }

  const handleSave = () => {
    if (!form.name.trim()) return
    if (editing) {
      setItems((prev) => prev.map((x) => x.id === editing.id ? { ...x, ...form } : x))
      toast({ title: "Menu item updated", description: form.name, variant: "success" })
    } else {
      const newItem: MenuItem = {
        id: Date.now(), ...form, restaurantId: 1, avgRating: 0, totalRatings: 0,
      }
      setItems((prev) => [newItem, ...prev])
      toast({ title: "Menu item added", description: form.name, variant: "success" })
    }
    setDialogOpen(false)
  }

  const handleDelete = (it: MenuItem) => {
    setItems((prev) => prev.filter((x) => x.id !== it.id))
    toast({ title: "Item deleted", description: it.name, variant: "destructive" })
  }

  const toggleAvailable = (it: MenuItem) => {
    setItems((prev) => prev.map((x) => x.id === it.id ? { ...x, isAvailable: !x.isAvailable } : x))
    toast({ title: it.isAvailable ? "Item marked unavailable" : "Item now available", variant: "info" })
  }

  const stats = [
    { label: "Total Items", value: items.length, color: "text-orange-600", bg: "bg-orange-100" },
    { label: "Available", value: items.filter((i) => i.isAvailable).length, color: "text-emerald-600", bg: "bg-emerald-100" },
    { label: "Featured", value: items.filter((i) => i.isFeatured).length, color: "text-violet-600", bg: "bg-violet-100" },
    { label: "Vegan Options", value: items.filter((i) => i.isVegan).length, color: "text-green-600", bg: "bg-green-100" },
  ]

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Menu Items</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your restaurant's dishes, prices, and availability</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2"><SlidersHorizontal className="h-4 w-4" /> Bulk Edit</Button>
          <Button onClick={openAdd} className="gap-2"><Plus className="h-4 w-4" /> Add Item</Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="border-0">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{s.label}</p>
                  <p className={cn("text-3xl font-black mt-1", s.color)}>{s.value}</p>
                </div>
                <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center", s.bg)}>
                  <UtensilsCrossed className="h-6 w-6 text-slate-700" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-col lg:flex-row lg:items-center gap-4 justify-between">
          <div>
            <CardTitle className="text-lg">Your Menu</CardTitle>
            <CardDescription>{filtered.length} of {items.length} items</CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input placeholder="Search dishes, ingredients..." className="pl-10 h-10 w-64" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={catFilter} onValueChange={setCatFilter}>
              <SelectTrigger className="w-44 h-10">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            <Tabs defaultValue={statusFilter} onValueChange={setStatusFilter} className="w-auto">
              <TabsList className="h-10">
                <TabsTrigger value="all" className="h-8 text-xs">All</TabsTrigger>
                <TabsTrigger value="active" className="h-8 text-xs">Active</TabsTrigger>
                <TabsTrigger value="inactive" className="h-8 text-xs">Inactive</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Item</th>
                  <th className="text-left py-3 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
                  <th className="text-right py-3 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Price</th>
                  <th className="text-center py-3 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Prep</th>
                  <th className="text-left py-3 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tags</th>
                  <th className="text-center py-3 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Rating</th>
                  <th className="text-center py-3 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="text-right py-3 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((it, i) => {
                  const catColor = categoryColors[it.categoryName || ""] || "from-slate-500 to-slate-700"
                  return (
                    <motion.tr key={it.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors group">
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-3">
                          <div className={cn("h-11 w-11 rounded-xl bg-gradient-to-br flex items-center justify-center text-white shrink-0", catColor)}>
                            <Avatar className="h-11 w-11">
                              <AvatarFallback name={it.name} />
                            </Avatar>
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <p className="font-bold text-sm text-slate-900 truncate max-w-[220px]">{it.name}</p>
                              {it.isFeatured && <Award className="h-3.5 w-3.5 text-amber-500 fill-amber-200" />}
                            </div>
                            <p className="text-xs text-slate-500 truncate max-w-[280px]">{it.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <Badge variant="muted" className="font-medium">{it.categoryName}</Badge>
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <p className="font-bold text-slate-900">{formatCurrency(it.price)}</p>
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="flex items-center justify-center gap-1 text-xs text-slate-600 font-medium">
                          <Clock className="h-3.5 w-3.5 text-slate-400" />
                          {it.preparationTime}m
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="flex flex-wrap items-center gap-1">
                          {it.isVegetarian && <Badge variant="success" className="text-[10px] px-2 py-0.5 h-5 gap-1"><Leaf className="h-3 w-3" /> Veg</Badge>}
                          {it.isVegan && <Badge variant="success" className="text-[10px] px-2 py-0.5 h-5 gap-1"><Flame className="h-3 w-3" /> Vegan</Badge>}
                          {!it.isVegetarian && !it.isVegan && <Badge variant="destructive" className="text-[10px] px-2 py-0.5 h-5">Non-veg</Badge>}
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="flex items-center justify-center gap-1 text-xs">
                          <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-400" />
                          <span className="font-bold text-slate-900">{it.avgRating}</span>
                          <span className="text-slate-400">({it.totalRatings})</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="flex items-center justify-center">
                          <Badge variant={it.isAvailable ? "success" : "muted"} className="gap-1.5">
                            <span className={cn("h-1.5 w-1.5 rounded-full", it.isAvailable ? "bg-success-500 animate-pulse" : "bg-slate-400")} />
                            {it.isAvailable ? "Available" : "Unavailable"}
                          </Badge>
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(it)} title="Edit"><Edit3 className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" className={cn("h-8 w-8", it.isAvailable ? "text-orange-600 hover:bg-orange-50" : "text-emerald-600 hover:bg-emerald-50")} onClick={() => toggleAvailable(it)} title="Toggle">
                            {it.isAvailable ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => openEdit(it)}><Edit3 className="h-4 w-4 mr-2" /> Edit</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => toggleAvailable(it)}>{it.isAvailable ? <Ban className="h-4 w-4 mr-2" /> : <CheckCircle2 className="h-4 w-4 mr-2" />} {it.isAvailable ? "Mark Unavailable" : "Mark Available"}</DropdownMenuItem>
                              <DropdownMenuItem><Award className="h-4 w-4 mr-2" /> {it.isFeatured ? "Remove Featured" : "Mark Featured"}</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleDelete(it)} className="text-red-600"><Trash2 className="h-4 w-4 mr-2" /> Delete</DropdownMenuItem>
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
                      <p className="text-sm font-semibold text-slate-900">No items found</p>
                      <p className="text-xs text-slate-500 mt-1">Try adjusting your search or filters</p>
                    </div>
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Menu Item" : "Add Menu Item"}</DialogTitle>
            <DialogDescription>Configure all the details for this dish</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-2">
                <Label>Item Name *</Label>
                <Input placeholder="e.g. Truffle Pasta" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Price (USD) *</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input type="number" step="0.01" className="pl-9 font-bold text-lg" value={form.price} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })} />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea rows={2} placeholder="Describe the dish with enticing details..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select value={form.categoryName} onValueChange={(v) => setForm({ ...form, categoryName: v, categoryId: categories.indexOf(v) + 1 })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-slate-400" /> Prep Time (min)</Label>
                  <Input type="number" value={form.preparationTime} onChange={(e) => setForm({ ...form, preparationTime: parseInt(e.target.value) || 0 })} />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-1"><Flame className="h-3.5 w-3.5 text-slate-400" /> Calories</Label>
                  <Input type="number" value={form.calories} onChange={(e) => setForm({ ...form, calories: parseInt(e.target.value) || 0 })} />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Ingredients</Label>
              <Input placeholder="Listed allergens and key ingredients" value={form.ingredients} onChange={(e) => setForm({ ...form, ingredients: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Image URL</Label>
              <div className="flex gap-2">
                <Input placeholder="https://..." className="flex-1" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
                <Button variant="outline" className="gap-1.5"><ImageIcon className="h-4 w-4" /> Upload</Button>
              </div>
            </div>
            <div>
              <Label>Dish Settings</Label>
              <div className="mt-2 grid grid-cols-2 gap-3">
                {[
                  { key: "isAvailable", label: "Available on menu", desc: "Customers can order this" },
                  { key: "isFeatured", label: "Featured Item", desc: "Show in highlights & hero" },
                  { key: "isVegetarian", label: "Vegetarian", desc: "No meat or fish" },
                  { key: "isVegan", label: "Vegan", desc: "No animal products" },
                ].map((opt) => {
                  const on = (form as any)[opt.key]
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => setForm({ ...form, [opt.key]: !on } as any)}
                      className={cn(
                        "p-3.5 rounded-xl border-2 text-left transition-all",
                        on ? "border-orange-400 bg-orange-50/60" : "border-slate-200 hover:border-slate-300 bg-white"
                      )}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <p className={cn("text-sm font-bold", on ? "text-orange-700" : "text-slate-900")}>{opt.label}</p>
                        {on ? <ToggleRight className="h-5 w-5 text-orange-600" /> : <ToggleLeft className="h-5 w-5 text-slate-400" />}
                      </div>
                      <p className="text-[11px] text-slate-500">{opt.desc}</p>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={!form.name.trim()}>{editing ? "Save Changes" : "Add to Menu"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
