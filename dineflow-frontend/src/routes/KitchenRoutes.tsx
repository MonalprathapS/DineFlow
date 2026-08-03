import { Routes, Route, Navigate } from "react-router-dom"
import KitchenLayout from "@/layouts/KitchenLayout"
import Login from "@/pages/kitchen/Login"
import Dashboard from "@/pages/kitchen/Dashboard"
import NewOrders from "@/pages/kitchen/NewOrders"
import Preparing from "@/pages/kitchen/Preparing"
import Ready from "@/pages/kitchen/Ready"
import History from "@/pages/kitchen/History"
import { useAuth, useRole } from "@/context/AuthContext"

function KitchenRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth()
  const role = useRole()
  if (!isAuthenticated) return <Navigate to="/kitchen/login" replace />
  if (role !== "KITCHEN" && role !== "ADMIN") return <Navigate to="/kitchen/login" replace />
  return children
}

export default function KitchenRoutes() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="dashboard" element={<KitchenRoute><KitchenLayout><Dashboard /></KitchenLayout></KitchenRoute>} />
      <Route path="new" element={<KitchenRoute><KitchenLayout><NewOrders /></KitchenLayout></KitchenRoute>} />
      <Route path="preparing" element={<KitchenRoute><KitchenLayout><Preparing /></KitchenLayout></KitchenRoute>} />
      <Route path="ready" element={<KitchenRoute><KitchenLayout><Ready /></KitchenLayout></KitchenRoute>} />
      <Route path="history" element={<KitchenRoute><KitchenLayout><History /></KitchenLayout></KitchenRoute>} />
      <Route path="*" element={<Navigate to="/kitchen/login" replace />} />
      <Route index element={<Navigate to="/kitchen/login" replace />} />
    </Routes>
  )
}
