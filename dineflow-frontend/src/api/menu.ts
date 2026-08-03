import { api } from "./axios"
import type { ApiResponse, MenuItem, Category, Restaurant, RestaurantTable } from "@/types"

export const menuApi = {
  getByRestaurant: (restaurantId: number, params?: { paginated?: boolean; page?: number; size?: number }) =>
    api.get<ApiResponse<MenuItem[] | { content: MenuItem[] }>>(
      `/menu?restaurantId=${restaurantId}${params?.paginated ? `&paginated=true&page=${params.page || 0}&size=${params.size || 10}` : ""}`
    ),

  getByCategory: (categoryId: number) =>
    api.get<ApiResponse<MenuItem[]>>(`/menu?categoryId=${categoryId}`),

  getFeatured: (restaurantId: number) =>
    api.get<ApiResponse<MenuItem[]>>(`/menu?restaurantId=${restaurantId}&featured=true`),

  getById: (id: number) =>
    api.get<ApiResponse<MenuItem>>(`/menu/${id}`),

  search: (keyword: string, restaurantId?: number) =>
    api.get<ApiResponse<MenuItem[] | { content: MenuItem[] }>>(
      `/menu?search=${keyword}${restaurantId ? `&restaurantId=${restaurantId}` : ""}&paginated=true`
    ),

  create: (data: unknown) =>
    api.post<ApiResponse<MenuItem>>("/menu", data),

  update: (id: number, data: unknown) =>
    api.put<ApiResponse<MenuItem>>(`/menu/${id}`, data),

  delete: (id: number) =>
    api.delete<ApiResponse<string>>(`/menu/${id}`),

  toggleAvailability: (id: number) =>
    api.patch<ApiResponse<MenuItem>>(`/menu/${id}/toggle-availability`),

  toggleFeatured: (id: number) =>
    api.patch<ApiResponse<MenuItem>>(`/menu/${id}/toggle-featured`),
}

export const categoryApi = {
  getByRestaurant: (restaurantId: number) =>
    api.get<ApiResponse<Category[]>>(`/categories?restaurantId=${restaurantId}`),

  getById: (id: number) =>
    api.get<ApiResponse<Category>>(`/categories/${id}`),

  search: (keyword: string) =>
    api.get<ApiResponse<Category[]>>(`/categories?search=${keyword}`),

  create: (data: unknown) =>
    api.post<ApiResponse<Category>>("/categories", data),

  update: (id: number, data: unknown) =>
    api.put<ApiResponse<Category>>(`/categories/${id}`, data),

  delete: (id: number) =>
    api.delete<ApiResponse<string>>(`/categories/${id}`),
}

export const restaurantApi = {
  getAll: () => api.get<ApiResponse<Restaurant[]>>("/restaurants"),

  getActive: () => api.get<ApiResponse<Restaurant[]>>("/restaurants"),

  getById: (id: number) =>
    api.get<ApiResponse<Restaurant>>(`/restaurants/${id}`),

  search: (params: { name?: string; city?: string; cuisine?: string }) => {
    const query = new URLSearchParams()
    if (params.name) query.set("name", params.name)
    if (params.city) query.set("city", params.city)
    if (params.cuisine) query.set("cuisine", params.cuisine)
    return api.get<ApiResponse<Restaurant[]>>(`/restaurants?${query.toString()}`)
  },

  create: (data: unknown) =>
    api.post<ApiResponse<Restaurant>>("/restaurants", data),

  update: (id: number, data: unknown) =>
    api.put<ApiResponse<Restaurant>>(`/restaurants/${id}`, data),

  delete: (id: number) =>
    api.delete<ApiResponse<string>>(`/restaurants/${id}`),
}

export const tableApi = {
  getByRestaurant: (restaurantId: number, status?: string) =>
    api.get<ApiResponse<RestaurantTable[]>>(
      `/tables?restaurantId=${restaurantId}${status ? `&status=${status}` : ""}`
    ),

  getByWaiter: (waiterId: number) =>
    api.get<ApiResponse<RestaurantTable[]>>(`/tables?waiterId=${waiterId}`),

  getById: (id: number) =>
    api.get<ApiResponse<RestaurantTable>>(`/tables/${id}`),

  getByQrCode: (qrCode: string) =>
    api.get<ApiResponse<RestaurantTable>>(`/tables/qr/${qrCode}`),

  getCounts: (restaurantId: number) =>
    api.get<ApiResponse<Record<string, number>>>(`/tables/restaurant/${restaurantId}/counts`),

  create: (data: unknown) =>
    api.post<ApiResponse<RestaurantTable>>("/tables", data),

  update: (id: number, data: unknown) =>
    api.put<ApiResponse<RestaurantTable>>(`/tables/${id}`, data),

  delete: (id: number) =>
    api.delete<ApiResponse<string>>(`/tables/${id}`),

  assignWaiter: (tableId: number, waiterId: number) =>
    api.patch<ApiResponse<RestaurantTable>>(`/tables/${tableId}/assign-waiter/${waiterId}`),

  updateStatus: (tableId: number, status: string) =>
    api.patch<ApiResponse<RestaurantTable>>(`/tables/${tableId}/status?status=${status}`),
}
