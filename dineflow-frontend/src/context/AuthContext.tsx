import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react"
import type { AuthState, User, UserRole, LoginRequest, RegisterRequest } from "@/types"
import { authApi } from "@/api/auth"
import { useToast } from "@/components/ui/toast"

interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => Promise<void>
  refresh: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [refreshToken, setRefreshToken] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const storedToken = localStorage.getItem("dineflow_token")
    const storedRefresh = localStorage.getItem("dineflow_refresh_token")
    const storedUser = localStorage.getItem("dineflow_user")
    if (storedToken) setAccessToken(storedToken)
    if (storedRefresh) setRefreshToken(storedRefresh)
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch { /* ignore */ }
    }
  }, [])

  const persistAuth = useCallback((token: string, refresh: string, userData: User) => {
    localStorage.setItem("dineflow_token", token)
    localStorage.setItem("dineflow_refresh_token", refresh)
    localStorage.setItem("dineflow_user", JSON.stringify(userData))
    setAccessToken(token)
    setRefreshToken(refresh)
    setUser(userData)
  }, [])

  const login = async (credentials: LoginRequest) => {
    const { data } = await authApi.login(credentials)
    if (data.success && data.data) {
      const userData: User = {
        id: data.data.userId,
        name: data.data.name,
        email: data.data.email,
        role: data.data.role,
        isActive: true,
      }
      persistAuth(data.data.accessToken, data.data.refreshToken, userData)
      toast({ title: "Welcome back!", description: `Hello, ${userData.name}`, variant: "success" })
    } else {
      throw new Error(data.message || "Login failed")
    }
  }

  const register = async (data: RegisterRequest) => {
    const res = await authApi.register(data)
    if (!res.data.success) {
      throw new Error(res.data.message || "Registration failed")
    }
    toast({ title: "Account created!", description: res.data.message, variant: "success" })
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } catch { /* ignore */ }
    localStorage.removeItem("dineflow_token")
    localStorage.removeItem("dineflow_refresh_token")
    localStorage.removeItem("dineflow_user")
    setAccessToken(null)
    setRefreshToken(null)
    setUser(null)
    toast({ title: "Logged out", description: "You have been signed out" })
  }

  const refresh = async () => {
    if (!refreshToken) return
    try {
      const { data } = await authApi.refreshToken(refreshToken)
      if (data.success && data.data) {
        const userData: User = {
          id: data.data.userId,
          name: data.data.name,
          email: data.data.email,
          role: data.data.role,
          isActive: true,
        }
        persistAuth(data.data.accessToken, data.data.refreshToken, userData)
      }
    } catch {
      await logout()
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      accessToken,
      refreshToken,
      isAuthenticated: !!user && !!accessToken,
      login,
      register,
      logout,
      refresh,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}

export const useRole = (): UserRole | null => {
  const { user } = useAuth()
  return user?.role || null
}
