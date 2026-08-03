import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Search, Plus, Star, Flame, Clock, Leaf, Filter, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { useCart } from "@/context/CartContext"
import { formatCurrency } from "@/lib/utils"
import type { MenuItem } from "@/types"

const categories = [
  { id: "all", name: "All", icon: "🍽️" },
  { id: "starters", name: "Starters", icon: "🥗" },
  { id: "mains", name: "Mains", icon: "🍖" },
  { id: "pizza", name: "Pizza", icon: "🍕" },
  { id: "burgers", name: "Burgers", icon: "🍔" },
  { id: "drinks", name: "Drinks", icon: "🥤" },
  { id: "desserts", name: "Desserts", icon: "🍰" },
]

const demoMenu: Record<string, MenuItem[]> = {
  starters: [
    { id: 1, name: "Caesar Salad", price: 12.99, description: "Crisp romaine, parmesan, garlic croutons", imageUrl: "", categoryId: 1, restaurantId: 1, isVegetarian: true, isVegan: false, isAvailable: true, preparationTime: 10, isFeatured: false, avgRating: 4.6, totalRatings: 128, displayOrder: 1 },
    { id: 2, name: "Chicken Wings", price: 14.99, description: "Honey glazed wings with blue cheese dip", imageUrl: "", categoryId: 1, restaurantId: 1, isVegetarian: false, isVegan: false, isFeatured: true, isAvailable: true, preparationTime: 15, avgRating: 4.8, totalRatings: 342, displayOrder: 2 },
  ],
  mains: [
    { id: 3, name: "Signature Ribeye", price: 38.99, description: "12oz USDA Prime, truffle mash, asparagus", imageUrl: "", categoryId: 2, restaurantId: 1, isVegetarian: false, isVegan: false, isFeatured: true, isAvailable: true, preparationTime: 25, avgRating: 4.9, totalRatings: 521, displayOrder: 3 },
    { id: 4, name: "Atlantic Salmon", price: 29.99, description: "Pan-seared, lemon butter, roasted vegetables", imageUrl: "", categoryId: 2, restaurantId: 1, isVegetarian: false, isVegan: false, isFeatured: false, isAvailable: true, preparationTime: 20, avgRating: 4.7, totalRatings: 210, displayOrder: 4 },
  ],
  pizza: [
    { id: 5, name: "Margherita", price: 16.99, description: "San Marzano tomato, fresh mozzarella, basil", imageUrl: "", categoryId: 3, restaurantId: 1, isVegetarian: true, isVegan: false, isAvailable: true, preparationTime: 18, isFeatured: false, avgRating: 4.5, totalRatings: 410, displayOrder: 5 },
    { id: 6, name: "Quattro Formaggi", price: 19.99, description: "Four cheese blend, truffle oil", imageUrl: "", categoryId: 3, restaurantId: 1, isVegetarian: true, isVegan: false, isFeatured: true, isAvailable: true, preparationTime: 20, avgRating: 4.8, totalRatings: 295, displayOrder: 6 },
  ],
  burgers: [
    { id: 7, name: "DineFlow Burger", price: 17.99, description: "Double patty, cheddar, bacon, secret sauce", imageUrl: "", categoryId: 4, restaurantId: 1, isVegetarian: false, isVegan: false, isFeatured: true, isAvailable: true, preparationTime: 15, avgRating: 4.9, totalRatings: 876, displayOrder: 7 },
    { id: 8, name: "Plant-Based Deluxe", price: 15.99, description: "Beyond patty, avocado, caramelized onion", imageUrl: "", categoryId: 4, restaurantId: 1, isVegetarian: true, isVegan: true, isFeatured: false, isAvailable: true, preparationTime: 12, avgRating: 4.4, totalRatings: 154, displayOrder: 8 },
  ],
  drinks: [
    { id: 9, name: "Fresh Lemonade", price: 5.99, description: "Homemade, fresh mint, chilled", imageUrl: "", categoryId: 5, restaurantId: 1, isVegetarian: true, isVegan: true, isFeatured: false, isAvailable: true, preparationTime: 5, avgRating: 4.3, totalRatings: 98, displayOrder: 9 },
    { id: 10, name: "Craft Beer Flight", price: 12.99, description: "4 house selections, 5oz pours", imageUrl: "", categoryId: 5, restaurantId: 1, isVegetarian: true, isVegan: false, isFeatured: true, isAvailable: true, preparationTime: 3, avgRating: 4.7, totalRatings: 201, displayOrder: 10 },
  ],
  desserts: [
    { id: 11, name: "Tiramisu", price: 10.99, description: "Classic Italian, espresso-soaked, mascarpone", imageUrl: "", categoryId: 6, restaurantId: 1, isVegetarian: true, isVegan: false, isFeatured: false, isAvailable: true, preparationTime: 5, avgRating: 4.8, totalRatings: 367, displayOrder: 11 },
    { id: 12, name: "Molten Lava Cake", price: 11.99, description: "Warm chocolate, vanilla ice cream", imageUrl: "", categoryId: 6, restaurantId: 1, isVegetarian: true, isVegan: false, isFeatured: true, isAvailable: true, preparationTime: 12, avgRating: 4.9, totalRatings: 512, displayOrder: 12 },
  ],
}

const allItems = Object.values(demoMenu).flat()

export default function Menu() {
  const navigate = useNavigate()
  const { addItem, totalItems, totalPrice } = useCart()
  const [query, setQuery] = useState("")
  const [activeCat, setActiveCat] = useState("all")

  const filtered = (activeCat === "all" ? allItems : demoMenu[activeCat] || [])
    .filter((m) => m.name.toLowerCase().includes(query.toLowerCase()) || (m.description ?? "").toLowerCase().includes(query.toLowerCase()))

  const handleAdd = (item: MenuItem) => {
    addItem({ menuItemId: item.id, restaurantId: item.restaurantId, quantity: 1 })
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search dishes, drinks, ingredients..."
          className="pl-11 pr-12 h-12 rounded-2xl shadow-sm"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button variant="ghost" size="icon" className="absolute right-1.5 top-1.5 h-9 w-9">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <div className="relative">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCat(cat.id)}
              className={`flex items-center gap-2 shrink-0 px-4 py-2.5 rounded-2xl font-semibold text-sm transition-all duration-300 ${
                activeCat === cat.id
                  ? "bg-gradient-primary text-white shadow-lg shadow-brand-500/25 scale-105"
                  : "bg-white text-foreground border border-border/60 hover:bg-muted/40"
              }`}
            >
              <span className="text-base">{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🍽️</div>
          <h3 className="font-bold text-xl">No items found</h3>
          <p className="text-muted-foreground mt-1">Try a different search or category</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card
                className="overflow-hidden cursor-pointer group card-hover border-border/40"
                onClick={() => navigate(`/customer/menu/${item.id}`)}
              >
                <div className="flex gap-4 p-4">
                  <div className="w-28 h-28 shrink-0 rounded-2xl bg-gradient-to-br from-brand-100 via-brand-50 to-orange-50 flex items-center justify-center text-5xl relative overflow-hidden">
                    {item.categoryId === 1 ? "🥗" : item.categoryId === 2 ? "🍖" : item.categoryId === 3 ? "🍕" : item.categoryId === 4 ? "🍔" : item.categoryId === 5 ? "🥤" : "🍰"}
                    {item.isFeatured && (
                      <div className="absolute top-1.5 left-1.5">
                        <Badge className="text-[10px] px-1.5 py-0.5 gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
                          <Flame className="h-3 w-3" /> POPULAR
                        </Badge>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-lg truncate">{item.name}</h3>
                      {item.isVegetarian && <Leaf className="h-4 w-4 text-green-500 shrink-0" />}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{item.description ?? ""}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 text-amber-500 fill-current" /> 4.8
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" /> {item.preparationTime} min
                      </span>
                    </div>
                    <div className="mt-auto pt-3 flex items-center justify-between">
                      <span className="font-black text-2xl gradient-text">{formatCurrency(item.price)}</span>
                      <Button
                        size="icon"
                        className="h-10 w-10 rounded-xl shadow-lg shadow-brand-500/20"
                        onClick={(e) => { e.stopPropagation(); handleAdd(item) }}
                      >
                        <Plus className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {totalItems > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-6 left-4 right-4 mx-auto max-w-5xl z-30"
        >
          <Card className="overflow-hidden shadow-elevated border-0">
            <div
              onClick={() => navigate("/customer/cart")}
              className="flex items-center gap-4 p-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 cursor-pointer"
            >
              <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center relative">
                <ShoppingBag className="h-6 w-6 text-white" />
                <Badge className="absolute -top-1 -right-1 h-5 min-w-5 px-1 justify-center text-[10px] bg-gradient-primary text-white border-0">
                  {totalItems}
                </Badge>
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold">View Cart</p>
                <p className="text-white/60 text-xs">{totalItems} items ready to checkout</p>
              </div>
              <div className="text-right">
                <p className="text-white/70 text-xs">Total</p>
                <p className="text-white font-black text-2xl">{formatCurrency(totalPrice)}</p>
              </div>
              <Button size="lg" className="shrink-0">Checkout</Button>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
