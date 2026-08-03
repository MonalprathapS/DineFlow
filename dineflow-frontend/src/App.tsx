import { Routes, Route, Navigate } from "react-router-dom"
import CustomerRoutes from "./routes/CustomerRoutes"
import StaffRoutes from "./routes/StaffRoutes"
import KitchenRoutes from "./routes/KitchenRoutes"
import AdminRoutes from "./routes/AdminRoutes"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/customer/splash" replace />} />
      <Route path="/customer/*" element={<CustomerRoutes />} />
      <Route path="/staff/*" element={<StaffRoutes />} />
      <Route path="/kitchen/*" element={<KitchenRoutes />} />
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route path="/*" element={<CustomerRoutes />} />
    </Routes>
  )
}
