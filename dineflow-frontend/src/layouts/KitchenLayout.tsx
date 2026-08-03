import { ReactNode, useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import {
  LayoutDashboard,
  Bell,
  ChefHat,
  Clock,
  CheckCircle,
  History,
  Utensils,
  LogOut,
  Menu,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/context/AuthContext"
import { cn } from "@/lib/utils"

const navItems = [
  { path: "dashboard", label: "Dashboard", icon: LayoutDashboard, color: "from-green-500 to-emerald-600" },
  { path: "new", label: "New Orders", icon: Bell, badge: true, color: "from-orange-500 to-amber-600" },
  { path: "preparing", label: "Preparing", icon: Clock, color: "from-blue-500 to-indigo-600" },
  { path: "ready", label: "Ready", icon: CheckCircle, color: "from-purple-500 to-violet-600" },
  { path: "history", label: "History", icon: History, color: "from-slate-500 to-slate-700" },
]

export default function KitchenLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-green-50/40">
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-green-600 to-emerald-700 text-white shadow-xl transition-transform duration-300",
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex h-16 items-center gap-2 px-6 border-b border-white/20">
          <div className="h-9 w-9 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <ChefHat className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-bold leading-tight">DineFlow</h1>
            <p className="text-xs text-white/70 leading-none">Kitchen Display</p>
          </div>
        </div>
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = location.pathname.endsWith(item.path)
            return (
              <Link
                key={item.path}
                to={`/kitchen/${item.path}`}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-all group",
                  active
                    ? "bg-white/20 backdrop-blur-sm shadow-lg"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                )}
              >
                <div className={cn(
                  "h-9 w-9 rounded-lg flex items-center justify-center bg-gradient-to-br transition-all group-hover:scale-105",
                  active ? item.color + " shadow-lg" : "bg-white/10"
                )}>
                  <Icon className="h-5 w-5" />
                </div>
                {item.label}
                {item.badge && (
                  <Badge className="ml-auto bg-red-500 hover:bg-red-500 text-white text-[10px] h-5 px-1.5 animate-pulse-slow">NEW</Badge>
                )}
              </Link>
            )
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-white/20">
          <div className="flex items-center gap-3 mb-3 px-3">
            <Avatar className="h-10 w-10 ring-2 ring-white/30">
              <AvatarFallback name={user?.name || "Kitchen"} />
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold truncate">{user?.name || "Kitchen Staff"}</p>
              <p className="text-xs text-white/70 truncate">Chef</p>
            </div>
          </div>
          <Button
            variant="white"
            className="w-full justify-start gap-2 bg-white/10 text-white hover:bg-white/20 border-0"
            onClick={() => { logout(); navigate("/kitchen/login") }}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur-xl border-b border-border/60 flex items-center justify-between px-6">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <Utensils className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold leading-tight">Kitchen Display</h2>
              <p className="text-xs text-muted-foreground leading-none">Order Management System</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 animate-pulse-slow" />
            </Button>
            <Avatar className="h-9 w-9">
              <AvatarFallback name={user?.name || "K"} />
            </Avatar>
          </div>
        </header>
        <main className="p-6 animate-slide-up">{children}</main>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
