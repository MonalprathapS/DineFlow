import { Routes, Route, Navigate } from "react-router-dom"
import AdminLayout from "@/layouts/AdminLayout"
import Login from "@/pages/admin/Login"
import Dashboard from "@/pages/admin/Dashboard"
import Restaurant from "@/pages/admin/Restaurant"
import Tables from "@/pages/admin/Tables"
import Categories from "@/pages/admin/Categories"
import Menu from "@/pages/admin/Menu"
import Employees from "@/pages/admin/Employees"
import Customers from "@/pages/admin/Customers"
import Coupons from "@/pages/admin/Coupons"
import Reports from "@/pages/admin/Reports"
import Analytics from "@/pages/admin/Analytics"
import Settings from "@/pages/admin/Settings"
import Profile from "@/pages/admin/Profile"
import ForgotPassword from "@/pages/common/ForgotPassword"
import ChangePassword from "@/pages/common/ChangePassword"
import { useAuth, useRole } from "@/context/AuthContext"

function AdminRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth()
  const role = useRole()
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />
  if (role !== "ADMIN") return <Navigate to="/admin/login" replace />
  return children
}

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="forgot-password" element={<ForgotPassword />} />
      <Route path="change-password" element={<ChangePassword />} />
      <Route path="dashboard" element={<AdminRoute><AdminLayout><Dashboard /></AdminLayout></AdminRoute>} />
      <Route path="restaurant" element={<AdminRoute><AdminLayout><Restaurant /></AdminLayout></AdminRoute>} />
      <Route path="tables" element={<AdminRoute><AdminLayout><Tables /></AdminLayout></AdminRoute>} />
      <Route path="categories" element={<AdminRoute><AdminLayout><Categories /></AdminLayout></AdminRoute>} />
      <Route path="menu" element={<AdminRoute><AdminLayout><Menu /></AdminLayout></AdminRoute>} />
      <Route path="employees" element={<AdminRoute><AdminLayout><Employees /></AdminLayout></AdminRoute>} />
      <Route path="customers" element={<AdminRoute><AdminLayout><Customers /></AdminLayout></AdminRoute>} />
      <Route path="coupons" element={<AdminRoute><AdminLayout><Coupons /></AdminLayout></AdminRoute>} />
      <Route path="reports" element={<AdminRoute><AdminLayout><Reports /></AdminLayout></AdminRoute>} />
      <Route path="analytics" element={<AdminRoute><AdminLayout><Analytics /></AdminLayout></AdminRoute>} />
      <Route path="settings" element={<AdminRoute><AdminLayout><Settings /></AdminLayout></AdminRoute>} />
      <Route path="profile" element={<AdminRoute><AdminLayout><Profile /></AdminLayout></AdminRoute>} />
      <Route path="*" element={<Navigate to="/admin/login" replace />} />
      <Route index element={<Navigate to="/admin/login" replace />} />
    </Routes>
  )
}
