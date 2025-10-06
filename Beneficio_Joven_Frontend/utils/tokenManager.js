// src/utils/tokenManager.js

/**
 * Guardar token en localStorage
 */
export const saveToken = (token) => {
  localStorage.setItem('auth_token', token);
};

/**
 * Obtener token de localStorage
 */
export const getToken = () => {
  return localStorage.getItem('auth_token');
};

/**
 * Eliminar token de localStorage
 */
export const removeToken = () => {
  localStorage.removeItem('auth_token');
};

/**
 * Verificar si hay un token guardado
 */
export const hasToken = () => {
  return !!localStorage.getItem('auth_token');
};

/**
 * Guardar datos del usuario
 */
export const saveUser = (user) => {
  localStorage.setItem('user_data', JSON.stringify(user));
};

/**
 * Obtener datos del usuario
 */
export const getUser = () => {
  const userData = localStorage.getItem('user_data');
  return userData ? JSON.parse(userData) : null;
};

/**
 * Eliminar datos del usuario
 */
export const removeUser = () => {
  localStorage.removeItem('user_data');
};

/**
 * Limpiar todo (logout completo)
 */
export const clearAuth = () => {
  removeToken();
  removeUser();
};