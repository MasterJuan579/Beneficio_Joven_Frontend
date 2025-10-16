/**
 * @file authService.js
 * @description Módulo de servicios de autenticación.
 * Contiene funciones para manejar el inicio de sesión, registro y cierre de sesión del usuario,
 * incluyendo almacenamiento y limpieza del token JWT y datos de usuario.
 *
 * @module api/services/authService
 * @version 1.0.0
 */

import axiosInstance from '../interceptors/authInterceptor';
import { saveToken, saveUser, clearAuth } from '../../utils/tokenManager';

/**
 * Realiza el proceso de inicio de sesión del usuario.
 *
 * @async
 * @function login
 * @param {string} email - Correo electrónico del usuario.
 * @param {string} password - Contraseña del usuario.
 * @returns {Promise<{success: boolean, data?: {token: string, user: Object}, message?: string, errors?: Array}>}
 * Devuelve el token de autenticación y los datos del usuario si el inicio de sesión es exitoso.
 *
 * @example
 * const result = await login('usuario@correo.com', '123456');
 * if (result.success) {
 *   console.log('Usuario autenticado:', result.data.user);
 * }
 */
export const login = async (email, password) => {
  try {
    const response = await axiosInstance.post('/auth/login', { email, password });
    const { token, user } = response.data;

    // Guardar token y datos del usuario
    saveToken(token);
    saveUser(user);

    return {
      success: true,
      data: { token, user },
    };
  } catch (error) {
    console.error('Error en login:', error);

    return {
      success: false,
      message: error.response?.data?.message || 'Error al iniciar sesión',
      errors: error.response?.data?.errors || [],
    };
  }
};

/**
 * Registra un nuevo usuario en el sistema.
 *
 * @async
 * @function register
 * @param {Object} userData - Datos del usuario a registrar.
 * @param {string} userData.nombre - Nombre completo del usuario.
 * @param {string} userData.email - Correo electrónico del usuario.
 * @param {string} userData.password - Contraseña elegida por el usuario.
 * @returns {Promise<{success: boolean, data?: Object, message?: string, errors?: Array}>}
 * Devuelve el resultado del proceso de registro.
 *
 * @example
 * await register({
 *   nombre: 'María Pérez',
 *   email: 'maria@correo.com',
 *   password: 'miContraseñaSegura'
 * });
 */
export const register = async (userData) => {
  try {
    const response = await axiosInstance.post('/auth/register', userData);

    return {
      success: true,
      data: response.data,
      message: response.data.message,
    };
  } catch (error) {
    console.error('Error en registro:', error);

    return {
      success: false,
      message: error.response?.data?.message || 'Error al registrarse',
      errors: error.response?.data?.errors || [],
    };
  }
};

/**
 * Cierra la sesión del usuario actual.
 * 
 * Elimina el token de autenticación y los datos del usuario almacenados localmente,
 * y redirige a la pantalla de inicio de sesión.
 *
 * @function logout
 * @returns {void}
 *
 * @example
 * logout(); // Limpia sesión y redirige a /login
 */
export const logout = () => {
  clearAuth();
  window.location.href = '/login';
};
