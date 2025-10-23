/**
 * @file authService.js
 * @description Servicios de autenticación: login, register, logout.
 * Mantiene token y user en localStorage. Se normaliza el rol del backend.
 *
 * @module api/services/authService
 * @version 1.1.0
 */

import axiosInstance from '../interceptors/authInterceptor';
import { saveToken, saveUser, clearAuth } from '../../utils/tokenManager';

/** Mapea el rol del backend a las llaves usadas por el front */
const normalizeRole = (apiRole) => {
  const v = (apiRole || '').toString().trim().toUpperCase();
  if (v === 'ADMIN' || v === 'ADMINISTRADOR') return { key: 'administrador', raw: v };
  if (v === 'DUENO' || v === 'DUEÑO' || v === 'OWNER') return { key: 'dueno', raw: v };
  if (v === 'BENEFICIARIO' || v === 'USER' || v === 'USUARIO') return { key: 'beneficiario', raw: v };
  return { key: 'desconocido', raw: v };
};

/**
 * Login
 * @param {string} email
 * @param {string} password
 */
export const login = async (email, password) => {
  try {
    const response = await axiosInstance.post('/auth/login', { email, password });
    const { token, user } = response.data || {};

    // Normaliza rol antes de guardar
    const { key: role, raw } = normalizeRole(user?.role);
    const userNormalized = { ...user, role, roleRaw: raw };

    // Persistencia
    saveToken(token);
    saveUser(userNormalized);

    return {
      success: true,
      data: { token, user: userNormalized },
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
 * Registro
 */
export const register = async (userData) => {
  try {
    const response = await axiosInstance.post('/auth/register', userData);
    return {
      success: true,
      data: response.data,
      message: response.data?.message,
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
 * Logout
 */
export const logout = () => {
  clearAuth();
  window.location.href = '/login';
};
