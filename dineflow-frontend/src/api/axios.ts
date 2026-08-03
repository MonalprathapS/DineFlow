import axios, { AxiosInstance, AxiosRequestConfig } from "axios"

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api"

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
})

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("dineflow_token")
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/auth/login"
    ) {
      originalRequest._retry = true
      try {
        const refreshToken = localStorage.getItem("dineflow_refresh_token")
        if (refreshToken) {
          const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken })
          if (data.success && data.data) {
            localStorage.setItem("dineflow_token", data.data.accessToken)
            localStorage.setItem("dineflow_refresh_token", data.data.refreshToken)
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`
            }
            return axiosInstance(originalRequest)
          }
        }
      } catch (refreshError) {
        localStorage.removeItem("dineflow_token")
        localStorage.removeItem("dineflow_refresh_token")
        localStorage.removeItem("dineflow_user")
        window.location.href = "/customer/login"
      }
    }
    return Promise.reject(error)
  }
)

export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    axiosInstance.get<T>(url, config),
  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    axiosInstance.post<T>(url, data, config),
  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    axiosInstance.put<T>(url, data, config),
  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    axiosInstance.patch<T>(url, data, config),
  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    axiosInstance.delete<T>(url, config),
}

export default axiosInstance
