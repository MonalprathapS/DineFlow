import { Routes, Route, Navigate } from "react-router-dom"
import CustomerLayout from "@/layouts/CustomerLayout"
import Splash from "@/pages/customer/Splash"
import QrScan from "@/pages/customer/QrScan"
import Welcome from "@/pages/customer/Welcome"
import Menu from "@/pages/customer/Menu"
import FoodDetails from "@/pages/customer/FoodDetails"
import Cart from "@/pages/customer/Cart"
import Checkout from "@/pages/customer/Checkout"
import OrderTracking from "@/pages/customer/OrderTracking"
import Payment from "@/pages/customer/Payment"
import Rating from "@/pages/customer/Rating"
import Login from "@/pages/customer/Login"
import { useAuth } from "@/context/AuthContext"

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to="/customer/login" replace />
  return children
}

export default function CustomerRoutes() {
  return (
    <Routes>
      <Route index element={<Splash />} />
      <Route path="splash" element={<Splash />} />
      <Route path="qr-scan" element={<QrScan />} />
      <Route path="login" element={<Login />} />
      <Route path="welcome/:tableId" element={<Welcome />} />
      <Route path="menu" element={<CustomerLayout><Menu /></CustomerLayout>} />
      <Route path="menu/:itemId" element={<CustomerLayout><FoodDetails /></CustomerLayout>} />
      <Route path="cart" element={<CustomerLayout><Cart /></CustomerLayout>} />
      <Route path="checkout" element={<ProtectedRoute><CustomerLayout><Checkout /></CustomerLayout></ProtectedRoute>} />
      <Route path="orders/:orderId/tracking" element={<CustomerLayout><OrderTracking /></CustomerLayout>} />
      <Route path="orders/:orderId/payment" element={<ProtectedRoute><CustomerLayout><Payment /></CustomerLayout></ProtectedRoute>} />
      <Route path="orders/:orderId/rating" element={<ProtectedRoute><CustomerLayout><Rating /></CustomerLayout></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/customer/splash" replace />} />
    </Routes>
  )
}
