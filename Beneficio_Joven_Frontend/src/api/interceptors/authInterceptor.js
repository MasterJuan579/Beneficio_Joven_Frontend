/**
 * @file authInterceptor.js
 * @description Interceptores de solicitud y respuesta de Axios para manejar automáticamente la autenticación.
 * Este módulo agrega el token JWT en cada request y maneja errores de sesión (como expiración o token inválido).
 *
 * @module api/interceptors/authInterceptor
 * @version 1.0.0
 */

import axiosInstance from '../config/axiosConfig';
import { getToken, clearAuth } from '../../utils/tokenManager';

/**
 * Interceptor de **Request**.
 * 
 * Antes de enviar cada solicitud, este interceptor:
 * - Obtiene el token de autenticación desde el almacenamiento local (`tokenManager`).
 * - Agrega el encabezado `Authorization: Bearer <token>` si existe.
 * 
 * @function
 * @param {import('axios').InternalAxiosRequestConfig} config - Configuración de la solicitud HTTP.
 * @returns {import('axios').InternalAxiosRequestConfig} Configuración modificada con encabezado `Authorization`.
 * @example
 * // Ejemplo: toda request enviará el token automáticamente
 * axiosInstance.get('/admin/dashboard');
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
    // Si hay un error antes de enviar la solicitud
    return Promise.reject(error);
  }
);

/**
 * Interceptor de **Response**.
 * 
 * Después de recibir cada respuesta, este interceptor:
 * - Permite pasar las respuestas exitosas directamente.
 * - Intercepta errores HTTP 401 (token inválido o expirado).
 * - Limpia la sesión y redirige al login si la autenticación falla.
 * 
 * @function
 * @param {import('axios').AxiosResponse} response - Respuesta HTTP del servidor.
 * @returns {import('axios').AxiosResponse | Promise<never>} Devuelve la respuesta o rechaza el error.
 * @example
 * // Si el token expiró, se redirige automáticamente al login
 * axiosInstance.get('/perfil');
 */
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Token inválido o expirado');
      clearAuth();

      // Redirige al login para volver a autenticarse
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
