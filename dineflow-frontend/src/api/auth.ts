import { api } from "./axios"
import type {
  ApiResponse,
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  User,
  UserResponse,
} from "@/types"

export const authApi = {
  login: (data: LoginRequest) =>
    api.post<ApiResponse<LoginResponse>>("/auth/login", data),

  register: (data: RegisterRequest) =>
    api.post<ApiResponse<string>>("/auth/register", data),

  refreshToken: (refreshToken: string) =>
    api.post<ApiResponse<LoginResponse>>("/auth/refresh", { refreshToken }),

  logout: () => api.post<ApiResponse<string>>("/auth/logout"),

  getCurrentUser: (id: number) =>
    api.get<ApiResponse<UserResponse>>(`/users/${id}`),
}
