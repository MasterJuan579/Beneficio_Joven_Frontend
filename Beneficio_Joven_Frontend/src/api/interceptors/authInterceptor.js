// src/api/interceptors/authInterceptor.js
import axiosInstance from '../config/axiosConfig';
import { getToken, clearAuth } from '../../utils/tokenManager';

/**
 * Interceptor de Request - Añade el token automáticamente
 */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Interceptor de Response - Maneja errores de autenticación
 */
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Si el token expiró o es inválido
    if (error.response?.status === 401) {
      console.log('Token inválido o expirado');
      clearAuth();
      
      // Redirigir al login (opcional)
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;