import { api } from "./axios"
import type { ApiResponse, Order, Cart, CartResponse, DashboardStats, KitchenDashboardStats, StaffDashboardStats } from "@/types"

export const cartApi = {
  getCart: () => api.get<ApiResponse<Cart>>("/cart"),

  getCartById: (cartId: number) => api.get<ApiResponse<Cart>>(`/cart/${cartId}`),

  addItem: (data: { menuItemId: number; restaurantId: number; tableId?: number; quantity: number; specialInstructions?: string }) =>
    api.post<ApiResponse<Cart>>("/cart/add", data),

  updateItem: (cartItemId: number, data: { quantity?: number; specialInstructions?: string }) =>
    api.put<ApiResponse<Cart>>(`/cart/items/${cartItemId}`, data),

  removeItem: (cartItemId: number) =>
    api.delete<ApiResponse<Cart>>(`/cart/items/${cartItemId}`),

  clearCart: () => api.delete<ApiResponse<string>>("/cart"),

  getTotal: () => api.get<ApiResponse<number>>("/cart/total"),
}

export const orderApi = {
  create: (data: unknown) =>
    api.post<ApiResponse<Order>>("/orders", data),

  getById: (id: number) =>
    api.get<ApiResponse<Order>>(`/orders/${id}`),

  getByNumber: (orderNumber: string) =>
    api.get<ApiResponse<Order>>(`/orders/number/${orderNumber}`),

  getByCustomer: (customerId: number) =>
    api.get<ApiResponse<Order[]>>(`/orders?customerId=${customerId}`),

  getByRestaurant: (restaurantId: number, params?: { status?: string; today?: boolean; paginated?: boolean; page?: number; size?: number }) => {
    const query = new URLSearchParams()
    query.set("restaurantId", String(restaurantId))
    if (params?.status) query.set("status", params.status)
    if (params?.today) query.set("today", "true")
    if (params?.paginated) {
      query.set("paginated", "true")
      query.set("page", String(params.page || 0))
      query.set("size", String(params.size || 10))
    }
    return api.get<ApiResponse<Order[]>>(`/orders?${query.toString()}`)
  },

  getByWaiter: (waiterId: number) =>
    api.get<ApiResponse<Order[]>>(`/orders?waiterId=${waiterId}`),

  getByTable: (tableId: number) =>
    api.get<ApiResponse<Order[]>>(`/orders?tableId=${tableId}`),

  updateStatus: (orderId: number, status: string, data?: unknown) =>
    api.patch<ApiResponse<Order>>(`/orders/${orderId}/status?status=${status}`, data || {}),

  assignWaiter: (orderId: number, waiterId: number) =>
    api.patch<ApiResponse<Order>>(`/orders/${orderId}/assign-waiter/${waiterId}`),

  updatePayment: (orderId: number, paymentStatus: string, transactionId?: string, paymentMethod?: string) => {
    const params = new URLSearchParams()
    params.set("paymentStatus", paymentStatus)
    if (transactionId) params.set("transactionId", transactionId)
    if (paymentMethod) params.set("paymentMethod", paymentMethod)
    return api.patch<ApiResponse<Order>>(`/orders/${orderId}/payment?${params.toString()}`)
  },

  generateBill: (orderId: number) =>
    api.get<ApiResponse<number>>(`/orders/${orderId}/bill`),
}

export const kitchenApi = {
  getDashboard: (restaurantId: number) =>
    api.get<ApiResponse<KitchenDashboardStats>>(`/kitchen/dashboard/${restaurantId}`),

  getNewOrders: (restaurantId: number) =>
    api.get<ApiResponse<Order[]>>(`/kitchen/orders/${restaurantId}/new`),

  getPreparingOrders: (restaurantId: number) =>
    api.get<ApiResponse<Order[]>>(`/kitchen/orders/${restaurantId}/preparing`),

  getReadyOrders: (restaurantId: number) =>
    api.get<ApiResponse<Order[]>>(`/kitchen/orders/${restaurantId}/ready`),

  getTodayOrders: (restaurantId: number) =>
    api.get<ApiResponse<Order[]>>(`/kitchen/orders/${restaurantId}/today`),

  getHistory: (restaurantId: number) =>
    api.get<ApiResponse<Order[]>>(`/kitchen/orders/${restaurantId}/history`),

  startPreparing: (orderId: number) =>
    api.patch<ApiResponse<Order>>(`/kitchen/orders/${orderId}/start`),

  markReady: (orderId: number) =>
    api.patch<ApiResponse<Order>>(`/kitchen/orders/${orderId}/ready`),

  cancelOrder: (orderId: number, reason?: string) =>
    api.patch<ApiResponse<Order>>(`/kitchen/orders/${orderId}/cancel${reason ? `?reason=${encodeURIComponent(reason)}` : ""}`),
}

export const staffApi = {
  getDashboard: (staffId: number, restaurantId: number) =>
    api.get<ApiResponse<StaffDashboardStats>>(`/staff/dashboard/${staffId}/${restaurantId}`),

  getAssignedTables: (staffId: number) =>
    api.get<ApiResponse<any[]>>(`/staff/tables/${staffId}/assigned`),

  getTodayOrders: (staffId: number, restaurantId: number) =>
    api.get<ApiResponse<Order[]>>(`/staff/orders/${staffId}/today?restaurantId=${restaurantId}`),

  getActiveOrders: (restaurantId: number) =>
    api.get<ApiResponse<Order[]>>(`/staff/orders/${restaurantId}/active`),

  generateBill: (orderId: number) =>
    api.get<ApiResponse<number>>(`/staff/orders/${orderId}/bill`),

  markServed: (orderId: number) =>
    api.patch<ApiResponse<Order>>(`/staff/orders/${orderId}/serve`),

  completeOrder: (orderId: number) =>
    api.patch<ApiResponse<Order>>(`/staff/orders/${orderId}/complete`),

  acceptOrder: (orderId: number) =>
    api.patch<ApiResponse<Order>>(`/staff/orders/${orderId}/accept`),

  cancelOrder: (orderId: number, reason?: string) =>
    api.patch<ApiResponse<Order>>(`/staff/orders/${orderId}/cancel${reason ? `?reason=${encodeURIComponent(reason)}` : ""}`),

  assignStaff: (orderId: number, staffId: number) =>
    api.patch<ApiResponse<Order>>(`/staff/orders/${orderId}/assign/${staffId}`),

  markAsPaid: (orderId: number, paymentMethod?: string, transactionId?: string) => {
    const params = new URLSearchParams()
    if (paymentMethod) params.set("paymentMethod", paymentMethod)
    if (transactionId) params.set("transactionId", transactionId)
    return api.patch<ApiResponse<Order>>(`/staff/orders/${orderId}/mark-paid?${params.toString()}`)
  },
}

export const adminApi = {
  getDashboard: (restaurantId: number) =>
    api.get<ApiResponse<DashboardStats>>(`/admin/dashboard/${restaurantId}`),

  getCustomers: () =>
    api.get<ApiResponse<any[]>>("/admin/customers"),

  getEmployees: (restaurantId: number) =>
    api.get<ApiResponse<any[]>>(`/admin/employees/${restaurantId}`),

  getRevenueReport: (restaurantId: number, days: number = 7) =>
    api.get<ApiResponse<Record<string, number>>>(`/admin/reports/${restaurantId}/revenue?days=${days}`),

  getOrdersReport: (restaurantId: number, days: number = 7) =>
    api.get<ApiResponse<Record<string, number>>>(`/admin/reports/${restaurantId}/orders?days=${days}`),

  getAnalyticsSummary: (restaurantId: number) =>
    api.get<ApiResponse<Record<string, any>>>(`/admin/analytics/${restaurantId}/summary`),
}

export const notificationApi = {
  getByRestaurant: (restaurantId: number, unreadOnly = false) =>
    api.get<ApiResponse<any[]>>(`/notifications?restaurantId=${restaurantId}${unreadOnly ? "&unreadOnly=true" : ""}`),

  getByUser: (unreadOnly = false) =>
    api.get<ApiResponse<any[]>>(`/notifications${unreadOnly ? "?unreadOnly=true" : ""}`),

  countUnread: (restaurantId?: number) =>
    api.get<ApiResponse<number>>(restaurantId ? `/notifications/count-unread?restaurantId=${restaurantId}` : "/notifications/count-unread"),

  markAsRead: (id: number) =>
    api.patch<ApiResponse<any>>(`/notifications/${id}/read`),

  markAllAsRead: (restaurantId?: number) =>
    api.patch<ApiResponse<string>>(restaurantId ? `/notifications/mark-all-read?restaurantId=${restaurantId}` : "/notifications/mark-all-read"),

  delete: (id: number) =>
    api.delete<ApiResponse<string>>(`/notifications/${id}`),
}

export const feedbackApi = {
  create: (data: unknown) =>
    api.post<ApiResponse<any>>("/feedback", data),

  getByRestaurant: (restaurantId: number) =>
    api.get<ApiResponse<any[]>>(`/feedback?restaurantId=${restaurantId}`),

  getByCustomer: (customerId: number) =>
    api.get<ApiResponse<any[]>>(`/feedback?customerId=${customerId}`),

  getById: (id: number) =>
    api.get<ApiResponse<any>>(`/feedback/${id}`),

  getRatingSummary: (restaurantId: number) =>
    api.get<ApiResponse<any>>(`/feedback/restaurant/${restaurantId}/summary`),
}
