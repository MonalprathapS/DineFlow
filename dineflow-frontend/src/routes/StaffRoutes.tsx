import { Routes, Route, Navigate } from "react-router-dom"
import StaffLayout from "@/layouts/StaffLayout"
import Login from "@/pages/staff/Login"
import Dashboard from "@/pages/staff/Dashboard"
import AssignedTables from "@/pages/staff/AssignedTables"
import Orders from "@/pages/staff/Orders"
import Billing from "@/pages/staff/Billing"
import Notifications from "@/pages/staff/Notifications"
import Profile from "@/pages/staff/Profile"
import Settings from "@/pages/staff/Settings"
import { useAuth, useRole } from "@/context/AuthContext"

function StaffRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth()
  const role = useRole()
  if (!isAuthenticated) return <Navigate to="/staff/login" replace />
  if (role !== "STAFF" && role !== "ADMIN") return <Navigate to="/staff/login" replace />
  return children
}

export default function StaffRoutes() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="dashboard" element={<StaffRoute><StaffLayout><Dashboard /></StaffLayout></StaffRoute>} />
      <Route path="tables" element={<StaffRoute><StaffLayout><AssignedTables /></StaffLayout></StaffRoute>} />
      <Route path="orders" element={<StaffRoute><StaffLayout><Orders /></StaffLayout></StaffRoute>} />
      <Route path="billing" element={<StaffRoute><StaffLayout><Billing /></StaffLayout></StaffRoute>} />
      <Route path="notifications" element={<StaffRoute><StaffLayout><Notifications /></StaffLayout></StaffRoute>} />
      <Route path="profile" element={<StaffRoute><StaffLayout><Profile /></StaffLayout></StaffRoute>} />
      <Route path="settings" element={<StaffRoute><StaffLayout><Settings /></StaffLayout></StaffRoute>} />
      <Route path="*" element={<Navigate to="/staff/login" replace />} />
      <Route index element={<Navigate to="/staff/login" replace />} />
    </Routes>
  )
}
