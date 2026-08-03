export type UserRole = "CUSTOMER" | "STAFF" | "KITCHEN" | "ADMIN"

export interface User {
  id: number
  name: string
  email: string
  phone?: string
  role: UserRole
  isActive: boolean
  createdAt?: string
}

export interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  role?: UserRole
  phone?: string
  restaurantId?: number
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresIn: number
  userId: number
  name: string
  email: string
  role: UserRole
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export type TableStatus = "AVAILABLE" | "OCCUPIED" | "RESERVED" | "CLEANING"

export interface RestaurantTable {
  id: number
  tableNumber: string
  capacity?: number
  status: TableStatus
  qrCode?: string
  qrCodeUrl?: string
  restaurantId: number
  restaurantName?: string
  assignedWaiterId?: number
  assignedWaiterName?: string
  location?: string
  notes?: string
  createdAt?: string
  updatedAt?: string
}

export interface Restaurant {
  id: number
  name: string
  description?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  phone?: string
  email?: string
  website?: string
  logoUrl?: string
  bannerUrl?: string
  avgRating: number
  totalReviews: number
  isActive: boolean
  minOrderAmount: number
  deliveryFee: number
  taxRate?: string
  openingHours?: string
  closingHours?: string
  cuisineType?: string
  createdAt?: string
  updatedAt?: string
}

export interface Category {
  id: number
  name: string
  description?: string
  imageUrl?: string
  restaurantId: number
  restaurantName?: string
  displayOrder: number
  isActive: boolean
  menuItemCount: number
  createdAt?: string
  updatedAt?: string
}

export interface MenuItem {
  id: number
  name: string
  description?: string
  price: number
  imageUrl?: string
  isAvailable: boolean
  isVegetarian: boolean
  isVegan: boolean
  preparationTime?: number
  allergens?: string
  ingredients?: string
  calories?: number
  avgRating: number
  totalRatings: number
  categoryId: number
  categoryName?: string
  restaurantId: number
  restaurantName?: string
  isFeatured: boolean
  displayOrder: number
  createdAt?: string
  updatedAt?: string
}

export interface CartItem {
  id: number
  menuItemId: number
  menuItemName: string
  menuItemImage?: string
  quantity: number
  unitPrice: number
  subtotal: number
  specialInstructions?: string
}

export interface Cart {
  id: number
  customerId?: number
  customerName?: string
  restaurantId: number
  restaurantName?: string
  tableId?: number
  tableNumber?: string
  subtotal: number
  taxAmount: number
  totalAmount: number
  totalItems: number
  items: CartItem[]
}

export type OrderStatus = "PLACED" | "ACCEPTED" | "PREPARING" | "READY" | "SERVED" | "CANCELLED" | "COMPLETED"
export type OrderType = "DINE_IN" | "TAKEAWAY" | "DELIVERY"
export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED"
export type OrderItemStatus = "PENDING" | "PREPARING" | "READY" | "SERVED" | "CANCELLED"

export interface OrderItemResponse {
  id: number
  menuItemId?: number
  menuItemName: string
  menuItemImage?: string
  quantity: number
  unitPrice: number
  subtotal: number
  specialInstructions?: string
  status: OrderItemStatus
}

export interface Order {
  id: number
  orderNumber: string
  customerId?: number
  customerName?: string
  customerPhone?: string
  restaurantId: number
  restaurantName?: string
  tableId?: number
  tableNumber?: string
  assignedWaiterId?: number
  assignedWaiterName?: string
  status: OrderStatus
  orderType: OrderType
  paymentStatus: PaymentStatus
  paymentMethod?: string
  subtotal: number
  discountAmount?: number
  taxAmount: number
  deliveryFee?: number
  totalAmount: number
  specialInstructions?: string
  acceptedAt?: string
  preparingAt?: string
  readyAt?: string
  servedAt?: string
  completedAt?: string
  cancelledAt?: string
  cancellationReason?: string
  items: OrderItemResponse[]
  createdAt?: string
  updatedAt?: string
}

export type NotificationType = "NEW_ORDER" | "FOOD_READY" | "PAYMENT_RECEIVED" | "TABLE_REQUEST" | "ORDER_STATUS_UPDATED" | "STAFF_ALERT" | "GENERAL"

export interface Notification {
  id: number
  restaurantId: number
  userId?: number
  type: NotificationType
  message: string
  relatedUrl?: string
  isRead: boolean
  createdAt: string
}

export interface Feedback {
  id: number
  customerId: number
  customerName?: string
  restaurantId: number
  restaurantName?: string
  orderId?: number
  orderNumber?: string
  rating: number
  review?: string
  foodQualityRating?: number
  serviceRating?: number
  ambienceRating?: number
  valueRating?: number
  wouldRecommend: boolean
  createdAt?: string
}

export interface DashboardStats {
  todayRevenue: number
  todayOrders: number
  totalCustomers: number
  occupiedTables: number
  availableTables: number
  preparingOrders: number
  readyOrders: number
  completedOrders: number
  topSellingItems: TopSellingItem[]
  weeklyRevenue: number
  monthlyRevenue: number
}

export interface TopSellingItem {
  menuItemId: number
  menuItemName: string
  menuItemImage?: string
  totalUnits: number
}

export interface KitchenDashboardStats {
  newOrders: number
  preparingOrders: number
  readyOrders: number
  completedToday: number
}

export interface StaffDashboardStats {
  assignedTables: number
  activeOrders: number
  todaySales: number
  todayCompleted: number
}

export interface UserResponse {
  id: number
  name: string
  email: string
  phone?: string
  role: UserRole
  isActive: boolean
  restaurantId?: number
  restaurantName?: string
  createdAt?: string
}

export interface CartResponse extends Cart {}
