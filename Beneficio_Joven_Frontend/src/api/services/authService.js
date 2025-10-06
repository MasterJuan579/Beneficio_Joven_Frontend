// src/api/services/authService.js
import axiosInstance from '../interceptors/authInterceptor';
import { saveToken, saveUser, clearAuth } from '../../utils/tokenManager';

/**
 * Servicio de Login
 */
export const login = async (email, password) => {
  try {
    const response = await axiosInstance.post('/auth/login', {
      email,
      password,
    });

    const { token, user } = response.data;

    // Guardar token y datos del usuario
    saveToken(token);
    saveUser(user);

    return {
      success: true,
      data: { token, user },
    };
  } catch (error) {
    console.error('❌ Error en login:', error);
    
    return {
      success: false,
      message: error.response?.data?.message || 'Error al iniciar sesión',
      errors: error.response?.data?.errors || [],
    };
  }
};

/**
 * Servicio de Registro
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
    console.error('❌ Error en registro:', error);
    
    return {
      success: false,
      message: error.response?.data?.message || 'Error al registrarse',
      errors: error.response?.data?.errors || [],
    };
  }
};

/**
 * Servicio de Logout
 */
export const logout = () => {
  clearAuth();
  window.location.href = '/login';
};