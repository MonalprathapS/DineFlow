import { ReactNode, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Utensils, ShoppingCart, User, Search, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/context/CartContext"
import { useAuth } from "@/context/AuthContext"

export default function CustomerLayout({ children }: { children: ReactNode }) {
  const { totalItems } = useCart()
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const [showSearch, setShowSearch] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50/30 to-white">
      <header className="sticky top-0 z-40 glass border-b border-white/50">
        <div className="mx-auto max-w-5xl px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-muted/50 transition-colors">
                <ArrowLeft className="h-5 w-5" />
              </button>
              <Link to="/customer/menu" className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-lg shadow-brand-500/20">
                  <Utensils className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="font-bold text-lg leading-tight">DineFlow</h1>
                  <p className="text-xs text-muted-foreground leading-none">Smart Restaurant Ordering</p>
                </div>
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="p-2 rounded-xl hover:bg-muted/50 transition-colors"
              >
                <Search className="h-5 w-5" />
              </button>
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => navigate("/customer/cart")}
              >
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge variant="default" className="absolute -top-1 -right-1 h-5 min-w-5 justify-center px-1 text-[10px]">
                    {totalItems}
                  </Badge>
                )}
              </Button>
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium leading-none">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.role}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => logout()}>
                    <User className="h-4 w-4 mr-1" />
                    Logout
                  </Button>
                </div>
              ) : (
                <Button variant="outline" size="sm" onClick={() => navigate("/customer/login")}>
                  Login
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 animate-fade-in">
        {children}
      </main>

      <footer className="mt-auto py-8 text-center text-sm text-muted-foreground border-t border-border/50">
        <p>© 2024 DineFlow. All rights reserved.</p>
      </footer>
    </div>
  )
}
