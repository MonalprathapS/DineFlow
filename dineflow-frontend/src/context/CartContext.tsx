import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react"
import type { Cart, CartItem } from "@/types"
import { cartApi } from "@/api/orders"
import { useToast } from "@/components/ui/toast"

interface CartContextType {
  cart: Cart | null
  items: CartItem[]
  isLoading: boolean
  addItem: (data: { menuItemId: number; restaurantId: number; tableId?: number; quantity: number; specialInstructions?: string }) => Promise<void>
  updateItem: (cartItemId: number, data: { quantity?: number; specialInstructions?: string }) => Promise<void>
  removeItem: (cartItemId: number) => Promise<void>
  clearCart: () => Promise<void>
  fetchCart: () => Promise<void>
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const fetchCart = useCallback(async () => {
    try {
      setIsLoading(true)
      const { data } = await cartApi.getCart()
      if (data.success) setCart(data.data)
    } catch (err: any) {
      if (err.response?.status === 404) setCart(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const token = localStorage.getItem("dineflow_token")
    if (token) fetchCart()
  }, [fetchCart])

  const addItem = async (data: { menuItemId: number; restaurantId: number; tableId?: number; quantity: number; specialInstructions?: string }) => {
    setIsLoading(true)
    try {
      const res = await cartApi.addItem(data)
      if (res.data.success) {
        setCart(res.data.data)
        toast({ title: "Added to cart", description: "Item added to your cart", variant: "success" })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const updateItem = async (cartItemId: number, data: { quantity?: number; specialInstructions?: string }) => {
    setIsLoading(true)
    try {
      const res = await cartApi.updateItem(cartItemId, data)
      if (res.data.success) setCart(res.data.data)
    } finally {
      setIsLoading(false)
    }
  }

  const removeItem = async (cartItemId: number) => {
    setIsLoading(true)
    try {
      const res = await cartApi.removeItem(cartItemId)
      if (res.data.success) {
        setCart(res.data.data)
        toast({ title: "Item removed", description: "Item removed from cart" })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const clearCart = async () => {
    setIsLoading(true)
    try {
      await cartApi.clearCart()
      setCart(null)
    } finally {
      setIsLoading(false)
    }
  }

  const items = cart?.items || []
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const totalPrice = cart?.totalAmount || 0

  return (
    <CartContext.Provider value={{
      cart,
      items,
      isLoading,
      addItem,
      updateItem,
      removeItem,
      clearCart,
      fetchCart,
      totalItems,
      totalPrice,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}
