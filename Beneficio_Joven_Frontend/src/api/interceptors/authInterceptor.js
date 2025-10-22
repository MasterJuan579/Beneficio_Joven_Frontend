/**
 * @file authInterceptor.js
 */
import axiosInstance from '../config/axiosConfig'
import { getToken, clearAuth } from '../../utils/tokenManager'

// Request: agrega Authorization si hay token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

// Response: maneja 401 => limpia sesión y manda a login
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      clearAuth()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
