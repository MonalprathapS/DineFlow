import { ReactNode, useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import {
  LayoutDashboard,
  Table2,
  ClipboardList,
  Receipt,
  Bell,
  Settings,
  User,
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
  { path: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "tables", label: "Tables", icon: Table2 },
  { path: "orders", label: "Orders", icon: ClipboardList },
  { path: "billing", label: "Billing", icon: Receipt },
  { path: "notifications", label: "Notifications", icon: Bell },
  { path: "profile", label: "Profile", icon: User },
  { path: "settings", label: "Settings", icon: Settings },
]

export default function StaffLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50">
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-border/60 shadow-soft transition-transform duration-300",
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex h-16 items-center gap-2 px-6 border-b border-border/60">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Utensils className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold leading-tight">DineFlow</h1>
            <p className="text-xs text-muted-foreground leading-none">Staff Portal</p>
          </div>
        </div>
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = location.pathname.endsWith(item.path)
            return (
              <Link
                key={item.path}
                to={`/staff/${item.path}`}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                  active
                    ? "bg-gradient-primary text-white shadow-lg shadow-brand-500/20"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {item.label}
                {item.label === "Notifications" && (
                  <Badge variant="destructive" className="ml-auto text-[10px] h-5 px-1.5">3</Badge>
                )}
              </Link>
            )
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-border/60">
          <div className="flex items-center gap-3 mb-3 px-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback name={user?.name || "Staff"} />
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold truncate">{user?.name || "Staff User"}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
          <Button variant="outline" className="w-full justify-start gap-2" onClick={() => { logout(); navigate("/staff/login") }}>
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
          <h2 className="text-xl font-bold">Staff Dashboard</h2>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Avatar className="h-9 w-9">
              <AvatarFallback name={user?.name || "S"} />
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
