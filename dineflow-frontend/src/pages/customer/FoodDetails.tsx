import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Star, Clock, Leaf, Minus, Plus, Heart, Share2, ShoppingCart, Flame, Award, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { useCart } from "@/context/CartContext"
import { formatCurrency } from "@/lib/utils"
import { useToast } from "@/components/ui/toast"
import type { MenuItem } from "@/types"

type FoodDetailItem = Omit<MenuItem, "allergens"> & {
  images?: string[]
  allergens?: string[]
  tags?: string[]
}

const mock: Record<string, FoodDetailItem> = {
  "1": { id: 1, name: "Caesar Salad", price: 12.99, description: "Crisp romaine lettuce tossed in house-made Caesar dressing, topped with aged parmesan shavings, golden garlic croutons, and a squeeze of fresh lemon.", categoryId: 1, restaurantId: 1, isVegetarian: true, isVegan: false, isAvailable: true, preparationTime: 10, isFeatured: false, avgRating: 4.6, totalRatings: 128, displayOrder: 1, tags: ["Fresh", "Healthy"], allergens: ["Dairy", "Gluten"], calories: 350 },
  "2": { id: 2, name: "Honey Glazed Chicken Wings", price: 14.99, description: "Crispy wings tossed in our signature honey-garlic glaze, served with cool blue cheese dip and fresh celery sticks.", categoryId: 1, restaurantId: 1, isVegetarian: false, isVegan: false, isFeatured: true, isAvailable: true, preparationTime: 15, avgRating: 4.8, totalRatings: 342, displayOrder: 2, tags: ["Spicy", "Signature"], allergens: ["Dairy"], calories: 680 },
  "3": { id: 3, name: "Signature Ribeye Steak", price: 38.99, description: "12oz USDA Prime ribeye, dry-aged 28 days, grilled to perfection with house steak butter. Served with creamy truffle mash and charred asparagus.", categoryId: 2, restaurantId: 1, isVegetarian: false, isVegan: false, isFeatured: true, isAvailable: true, preparationTime: 25, avgRating: 4.9, totalRatings: 521, displayOrder: 3, tags: ["Chef's Pick", "Premium"], allergens: ["Dairy"], calories: 920 },
  "4": { id: 4, name: "Atlantic Salmon", price: 29.99, description: "Wild-caught Atlantic salmon, pan-seared with lemon beurre blanc, served with roasted herb potatoes and seasonal vegetables.", categoryId: 2, restaurantId: 1, isVegetarian: false, isVegan: false, isFeatured: false, isAvailable: true, preparationTime: 20, avgRating: 4.7, totalRatings: 210, displayOrder: 4, tags: ["Healthy"], allergens: ["Fish", "Dairy"], calories: 540 },
  "5": { id: 5, name: "Classic Margherita Pizza", price: 16.99, description: "Thin crust pizza with San Marzano tomato sauce, fresh buffalo mozzarella, torn basil, and extra virgin olive oil drizzle.", categoryId: 3, restaurantId: 1, isVegetarian: true, isVegan: false, isFeatured: false, isAvailable: true, preparationTime: 18, avgRating: 4.5, totalRatings: 410, displayOrder: 5, tags: ["Classic"], allergens: ["Dairy", "Gluten"], calories: 720 },
  "6": { id: 6, name: "Quattro Formaggi Pizza", price: 19.99, description: "Four Italian cheeses (mozzarella, gorgonzola, parmesan, fontina) with white truffle oil finish. A cheese lover's dream.", categoryId: 3, restaurantId: 1, isVegetarian: true, isVegan: false, isFeatured: true, isAvailable: true, preparationTime: 20, avgRating: 4.8, totalRatings: 295, displayOrder: 6, tags: ["Popular"], allergens: ["Dairy", "Gluten"], calories: 890 },
  "7": { id: 7, name: "DineFlow Double Smash Burger", price: 17.99, description: "Two smashed beef patties, aged cheddar, crispy bacon, caramelized onions, pickles, and our secret sauce on a toasted brioche bun.", categoryId: 4, restaurantId: 1, isVegetarian: false, isVegan: false, isFeatured: true, isAvailable: true, preparationTime: 15, avgRating: 4.9, totalRatings: 876, displayOrder: 7, tags: ["Best Seller"], allergens: ["Dairy", "Gluten", "Egg"], calories: 1120 },
  "8": { id: 8, name: "Plant-Based Deluxe Burger", price: 15.99, description: "Beyond Meat patty, smashed avocado, pickled onions, fresh arugula, house vegan mayo on a pretzel bun.", categoryId: 4, restaurantId: 1, isVegetarian: true, isVegan: true, isFeatured: false, isAvailable: true, preparationTime: 12, avgRating: 4.4, totalRatings: 154, displayOrder: 8, tags: ["Vegan"], allergens: ["Gluten"], calories: 640 },
  "9": { id: 9, name: "House Lemonade", price: 5.99, description: "Fresh squeezed lemonade with muddled mint, served over ice with a mint sprig garnish.", categoryId: 5, restaurantId: 1, isVegetarian: true, isVegan: true, isFeatured: false, isAvailable: true, preparationTime: 5, avgRating: 4.3, totalRatings: 98, displayOrder: 9, tags: ["Fresh"], allergens: [], calories: 140 },
  "10": { id: 10, name: "Craft Beer Flight", price: 12.99, description: "Curated selection of 4 house-brewed beers (5oz each): IPA, Lager, Stout, Saison.", categoryId: 5, restaurantId: 1, isVegetarian: true, isVegan: false, isFeatured: true, isAvailable: true, preparationTime: 3, avgRating: 4.7, totalRatings: 201, displayOrder: 10, tags: ["21+"], allergens: ["Gluten"], calories: 420 },
  "11": { id: 11, name: "Classic Tiramisu", price: 10.99, description: "Layers of espresso-soaked ladyfingers, whipped mascarpone cream, dusted with Dutch cocoa.", categoryId: 6, restaurantId: 1, isVegetarian: true, isVegan: false, isFeatured: false, isAvailable: true, preparationTime: 5, avgRating: 4.8, totalRatings: 367, displayOrder: 11, tags: ["Classic"], allergens: ["Dairy", "Gluten", "Egg"], calories: 480 },
  "12": { id: 12, name: "Molten Chocolate Lava Cake", price: 11.99, description: "Warm fudgy chocolate cake with a flowing center, served with premium vanilla bean ice cream.", categoryId: 6, restaurantId: 1, isVegetarian: true, isVegan: false, isFeatured: true, isAvailable: true, preparationTime: 12, avgRating: 4.9, totalRatings: 512, displayOrder: 12, tags: ["Popular"], allergens: ["Dairy", "Gluten", "Egg"], calories: 650 },
}

export default function FoodDetails() {
  const { itemId } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const { toast } = useToast()
  const [qty, setQty] = useState(1)
  const [liked, setLiked] = useState(false)
  const [customizations, setCustomizations] = useState<Record<string, string>>({})

  const item = mock[itemId || "3"] || mock["3"]
  const foodEmoji = item.categoryId === 1 ? "🥗" : item.categoryId === 2 ? "🍖" : item.categoryId === 3 ? "🍕" : item.categoryId === 4 ? "🍔" : item.categoryId === 5 ? "🥤" : "🍰"

  const customizationOptions: Record<string, string[]> = {
    "Temperature": ["Rare", "Medium Rare", "Medium", "Medium Well", "Well Done"],
    "Side": ["Fries", "Salad", "Mashed Potatoes", "Vegetables"],
    "Spice": ["Mild", "Medium", "Spicy", "Extra Spicy"],
    "Extra": ["Extra Cheese +$2", "Extra Meat +$3", "Extra Avocado +$2", "None"],
  }

  const relevantCustomizations =
    item.categoryId === 2 ? ["Temperature", "Side"] :
    item.categoryId === 4 ? ["Temperature", "Side", "Extra"] :
    item.categoryId === 3 ? ["Extra"] :
    item.categoryId === 1 ? ["Extra", "Spice"] : []

  const extrasCost = Object.values(customizations).reduce((sum, val) => {
    const match = val.match(/\+\$(\d+(\.\d{1,2})?)/)
    return sum + (match ? parseFloat(match[1]) : 0)
  }, 0)

  const subtotal = (item.price + extrasCost) * qty

  const handleAddToCart = () => {
    addItem({ menuItemId: item.id, restaurantId: item.restaurantId, quantity: qty })
    toast({
      title: "Added to Cart",
      description: `${qty}x ${item.name}`,
      variant: "success",
    })
    setTimeout(() => navigate("/customer/cart"), 400)
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="overflow-hidden border-0 shadow-elevated">
          <div className="relative aspect-[4/3] bg-gradient-to-br from-brand-50 via-orange-50 to-amber-50 flex items-center justify-center">
            <motion.span
              className="text-[160px] drop-shadow-2xl"
              animate={{ y: [0, -20, 0], rotate: [-2, 2, -2] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              {foodEmoji}
            </motion.span>
            <div className="absolute top-4 left-4 flex gap-2">
              {item.isFeatured && (
                <Badge className="gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 px-3 py-1.5 text-xs shadow-lg">
                  <Flame className="h-3.5 w-3.5" /> Popular
                </Badge>
              )}
              {item.isVegetarian && (
                <Badge variant="success" className="px-3 py-1.5 text-xs"><Leaf className="h-3.5 w-3.5 mr-1" /> Veg</Badge>
              )}
              {item.isVegan && (
                <Badge variant="success" className="px-3 py-1.5 text-xs"><Award className="h-3.5 w-3.5 mr-1" /> Vegan</Badge>
              )}
            </div>
            <div className="absolute top-4 right-4 flex gap-2">
              <Button variant="white" size="icon" className="h-10 w-10 rounded-xl shadow-md" onClick={() => setLiked(!liked)}>
                <Heart className={`h-5 w-5 ${liked ? "fill-red-500 text-red-500" : ""}`} />
              </Button>
              <Button variant="white" size="icon" className="h-10 w-10 rounded-xl shadow-md">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="p-6 space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-black tracking-tight">{item.name}</h1>
                <div className="flex items-center gap-4 mt-2 text-sm">
                  <span className="flex items-center gap-1.5">
                    <Star className="h-4 w-4 text-amber-500 fill-current" />
                    <span className="font-bold">4.8</span>
                    <span className="text-muted-foreground">(2.1k reviews)</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="h-4 w-4" /> {item.preparationTime} min prep
                  </span>
                  {item.calories && (
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4" /> {item.calories} cal
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="font-black text-3xl gradient-text">{formatCurrency(item.price)}</p>
                <p className="text-xs text-muted-foreground">per serving</p>
              </div>
            </div>

            {item.tags && (
              <div className="flex flex-wrap gap-2">
                {item.tags.map((t) => (
                  <Badge key={t} variant="outline" className="rounded-xl px-3 py-1">{t}</Badge>
                ))}
              </div>
            )}

            <div>
              <h3 className="font-bold text-base mb-2">About this dish</h3>
              <p className="text-muted-foreground leading-relaxed">{item.description}</p>
            </div>

            {item.allergens && item.allergens.length > 0 && (
              <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4">
                <p className="text-sm font-semibold text-amber-800">⚠️ Allergen information</p>
                <p className="text-sm text-amber-700 mt-1">Contains: {item.allergens.join(", ")}</p>
              </div>
            )}
          </div>
        </Card>
      </motion.div>

      {relevantCustomizations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <div className="p-5 space-y-5">
              <h3 className="font-bold text-lg">Customize Your Order</h3>
              {relevantCustomizations.map((key) => (
                <div key={key}>
                  <p className="text-sm font-semibold mb-3">{key} <span className="text-muted-foreground font-normal">(required)</span></p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {customizationOptions[key].map((opt, i) => {
                      const selected = customizations[key] === opt
                      return (
                        <button
                          key={opt}
                          onClick={() => setCustomizations({ ...customizations, [key]: opt })}
                          className={`text-left p-3.5 rounded-xl border-2 text-sm font-medium transition-all ${
                            selected
                              ? "border-brand-500 bg-brand-50 text-brand-700 shadow-sm"
                              : "border-border/60 hover:border-brand-300 hover:bg-muted/30"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{opt}</span>
                            {selected && (
                              <CheckCircle2 className="h-5 w-5 text-brand-500 shrink-0 ml-2" />
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="sticky bottom-0 -mx-4 px-4 py-4 bg-gradient-to-t from-white via-white to-transparent pt-8"
      >
        <Card className="shadow-elevated border-0 p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 bg-muted rounded-xl p-1.5">
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg" onClick={() => setQty(Math.max(1, qty - 1))}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-10 text-center font-black text-lg">{qty}</span>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg" onClick={() => setQty(qty + 1)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Button
              size="xl"
              className="flex-1 gap-2 shadow-xl shadow-brand-500/25"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-5 w-5" />
              Add {qty} to Cart • {formatCurrency(subtotal)}
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
