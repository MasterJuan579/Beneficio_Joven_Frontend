/**
 * @file establecimientos.js
 * @description Módulo de servicios del panel de administración para la gestión de establecimientos y categorías.
 * Contiene funciones para obtener listas de establecimientos, categorías y crear nuevos registros mediante Axios.
 *
 * @module api/services/admin-api-requests/establecimientos
 * @version 1.0.0
 */

import axiosInstance from '../../interceptors/authInterceptor';

/**
 * Obtiene la lista completa de establecimientos registrados en el sistema.
 *
 * @async
 * @function getEstablecimientos
 * @returns {Promise<{success: boolean, data?: Object[], total?: number, message?: string}>}
 * Devuelve un objeto con la lista de establecimientos o un mensaje de error.
 *
 * @example
 * const { success, data } = await getEstablecimientos();
 * if (success) console.log('Establecimientos:', data);
 */
export const getEstablecimientos = async () => {
  try {
    const response = await axiosInstance.get('/common/establecimiento');

    return {
      success: true,
      data: response.data.data,
      total: response.data.total,
    };
  } catch (error) {
    console.error('Error al obtener establecimientos:', error);

    return {
      success: false,
      message: error.response?.data?.message || 'Error al obtener establecimientos',
    };
  }
};

/**
 * Obtiene la lista de categorías de establecimientos.
 *
 * @async
 * @function getCategorias
 * @returns {Promise<{success: boolean, data?: Object[], message?: string}>}
 * Devuelve un objeto con la lista de categorías o un mensaje de error.
 *
 * @example
 * const { success, data } = await getCategorias();
 * if (success) console.log('Categorías:', data);
 */
export const getCategorias = async () => {
  try {
    const response = await axiosInstance.get('/common/categorias');

    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    console.error('Error al obtener categorías:', error);

    return {
      success: false,
      message: error.response?.data?.message || 'Error al obtener categorías',
      data: [], // Retorna array vacío como valor de respaldo
    };
  }
};

/**
 * Crea un nuevo establecimiento en el sistema.
 *
 * @async
 * @function createEstablecimiento
 * @param {Object} establecimientoData - Datos del nuevo establecimiento a registrar.
 * @param {string} establecimientoData.nombre - Nombre del establecimiento.
 * @param {string} establecimientoData.logoURL - URL del logo (por ejemplo, alojado en Cloudinary).
 * @param {number} establecimientoData.idCategoria - ID de la categoría asignada.
 * @throws {Error} Si faltan campos requeridos como nombre o categoría.
 * @returns {Promise<{success: boolean, data?: Object, message: string, errors?: Array}>}
 * Devuelve un objeto con el estado de creación y los datos resultantes.
 *
 * @example
 * await createEstablecimiento({
 *   nombre: "Starbucks",
 *   logoURL: "https://res.cloudinary.com/.../logo.png",
 *   idCategoria: 3
 * });
 */
export const createEstablecimiento = async (establecimientoData) => {
  try {
    // Validación rápida antes del envío
    if (!establecimientoData.nombre?.trim()) {
      throw new Error('El nombre del establecimiento es requerido');
    }

    if (!establecimientoData.idCategoria) {
      throw new Error('La categoría es requerida');
    }

    const response = await axiosInstance.post('/admin/establecimiento', establecimientoData);

    return {
      success: true,
      data: response.data.data,
      message: response.data.message || 'Establecimiento creado exitosamente',
    };
  } catch (error) {
    console.error('Error al crear establecimiento:', error);

    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Error al crear establecimiento',
      errors: error.response?.data?.errors || [],
    };
  }
};
