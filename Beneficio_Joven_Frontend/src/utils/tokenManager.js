/**
 * @file tokenManager.js
 * @description Utilidades para gestionar la autenticación en el almacenamiento local (localStorage).
 * Maneja token JWT y datos del usuario autenticado.
 *
 * Todas las funciones son sincrónicas y operan sobre `localStorage`.
 *
 * @module utils/tokenManager
 * @version 1.0.0
 */

/**
 * Guarda el token de autenticación en localStorage.
 * @param {string} token - Token JWT o cadena de sesión.
 * @returns {void}
 */
export const saveToken = (token) => {
  localStorage.setItem('auth_token', token);
};

/**
 * Obtiene el token de autenticación desde localStorage.
 * @returns {string|null} El token almacenado o `null` si no existe.
 */
export const getToken = () => {
  return localStorage.getItem('auth_token');
};

/**
 * Elimina el token de autenticación del almacenamiento local.
 * @returns {void}
 */
export const removeToken = () => {
  localStorage.removeItem('auth_token');
};

/**
 * Verifica si existe un token guardado en localStorage.
 * @returns {boolean} `true` si hay token, `false` en caso contrario.
 */
export const hasToken = () => {
  return !!localStorage.getItem('auth_token');
};

/**
 * Guarda los datos del usuario autenticado.
 * @param {Object} user - Objeto con la información del usuario (e.g. id, nombre, rol).
 * @returns {void}
 */
export const saveUser = (user) => {
  localStorage.setItem('user_data', JSON.stringify(user));
};

/**
 * Obtiene los datos del usuario desde localStorage.
 * @returns {Object|null} Objeto del usuario o `null` si no existen datos.
 */
export const getUser = () => {
  const userData = localStorage.getItem('user_data');
  return userData ? JSON.parse(userData) : null;
};

/**
 * Elimina los datos del usuario del almacenamiento local.
 * @returns {void}
 */
export const removeUser = () => {
  localStorage.removeItem('user_data');
};

/**
 * Limpia completamente los datos de autenticación.
 * Elimina tanto el token como la información del usuario.
 * @returns {void}
 */
export const clearAuth = () => {
  removeToken();
  removeUser();
};
