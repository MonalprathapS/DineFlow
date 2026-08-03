import { ReactNode, useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import {
  LayoutDashboard,
  Building2,
  Table2,
  Tags,
  ChefHat,
  Users,
  UserCircle,
  TicketPercent,
  FileBarChart,
  LineChart,
  Settings,
  UserCog,
  LogOut,
  Menu,
  X,
  Bell,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/context/AuthContext"
import { cn } from "@/lib/utils"

const navItems = [
  { section: "Overview", items: [
    { path: "dashboard", label: "Dashboard", icon: LayoutDashboard, color: "from-indigo-500 to-violet-600" },
    { path: "analytics", label: "Analytics", icon: LineChart, color: "from-pink-500 to-rose-600" },
    { path: "reports", label: "Reports", icon: FileBarChart, color: "from-blue-500 to-cyan-600" },
  ]},
  { section: "Management", items: [
    { path: "restaurant", label: "Restaurant", icon: Building2, color: "from-amber-500 to-orange-600" },
    { path: "tables", label: "Tables", icon: Table2, color: "from-emerald-500 to-green-600" },
    { path: "categories", label: "Categories", icon: Tags, color: "from-purple-500 to-fuchsia-600" },
    { path: "menu", label: "Menu Items", icon: ChefHat, color: "from-red-500 to-orange-600" },
  ]},
  { section: "People", items: [
    { path: "employees", label: "Employees", icon: Users, color: "from-teal-500 to-cyan-600" },
    { path: "customers", label: "Customers", icon: UserCircle, color: "from-sky-500 to-blue-600" },
    { path: "coupons", label: "Coupons", icon: TicketPercent, color: "from-yellow-500 to-amber-600" },
  ]},
  { section: "System", items: [
    { path: "settings", label: "Settings", icon: Settings, color: "from-slate-500 to-gray-700" },
    { path: "profile", label: "Profile", icon: UserCog, color: "from-violet-500 to-purple-600" },
  ]},
]

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-100">
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-slate-200 shadow-sm transition-transform duration-300 overflow-y-auto",
        sidebarOpen ? "translate-x-0" : "-translate-x-full xl:translate-x-0"
      )}>
        <div className="flex h-16 items-center gap-3 px-6 border-b border-slate-200 sticky top-0 bg-white z-10">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">DineFlow</h1>
            <p className="text-xs text-muted-foreground leading-none">Admin Console</p>
          </div>
        </div>

        <nav className="p-3 space-y-6">
          {navItems.map((section) => (
            <div key={section.section}>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-3 mb-2">
                {section.section}
              </p>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon
                  const active = location.pathname.endsWith(item.path)
                  return (
                    <Link
                      key={item.path}
                      to={`/admin/${item.path}`}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all group",
                        active
                          ? "bg-slate-900 text-white shadow-lg"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      )}
                    >
                      <div className={cn(
                        "h-8 w-8 rounded-lg flex items-center justify-center bg-gradient-to-br transition-all",
                        active ? item.color + " shadow-md" : "bg-slate-100 text-slate-500 group-hover:bg-white group-hover:shadow"
                      )}>
                        <Icon className={cn("h-4 w-4", active ? "text-white" : "")} />
                      </div>
                      {item.label}
                      {item.label === "Dashboard" && (
                        <Badge variant="default" className="ml-auto text-[10px] h-5">Live</Badge>
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="sticky bottom-0 p-3 mt-6 border-t border-slate-200 bg-gradient-to-t from-white via-white to-transparent">
          <div className="flex items-center gap-3 mb-3 px-2">
            <Avatar className="h-11 w-11 ring-2 ring-indigo-100">
              <AvatarFallback name={user?.name || "Admin"} />
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold truncate">{user?.name || "Admin User"}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email || "admin@dineflow.com"}</p>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full justify-start gap-2 text-slate-600 hover:text-destructive hover:border-red-200 hover:bg-red-50"
            onClick={() => { logout(); navigate("/admin/login") }}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      <div className="xl:pl-72">
        <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-xl border-b border-slate-200 flex items-center justify-between px-6">
          <Button variant="ghost" size="icon" className="xl:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <div>
            <h2 className="text-xl font-bold tracking-tight">Welcome back, {user?.name?.split(" ")[0] || "Admin"} 👋</h2>
            <p className="text-sm text-muted-foreground">Here's what's happening with your restaurant today.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
            </Button>
            <Avatar className="h-9 w-9 ring-2 ring-indigo-100">
              <AvatarFallback name={user?.name || "A"} />
            </Avatar>
          </div>
        </header>
        <main className="p-6 animate-slide-up">{children}</main>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 xl:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
