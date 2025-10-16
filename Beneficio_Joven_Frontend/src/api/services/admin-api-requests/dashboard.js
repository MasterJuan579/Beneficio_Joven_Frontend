/**
 * @file dashboard.js
 * @description Módulo de servicios del panel de administración.
 * Contiene funciones para obtener estadísticas generales del sistema desde el backend.
 *
 * @module api/services/admin-api-requests/dashboard
 * @version 1.0.0
 */

import axiosInstance from '../../interceptors/authInterceptor';

/**
 * Obtiene las estadísticas generales del dashboard del administrador.
 *
 * @async
 * @function getDashboardStats
 * @returns {Promise<{success: boolean, data?: Object, message?: string}>}
 * Devuelve un objeto con los datos estadísticos o un mensaje de error.
 *
 * @example
 * const { success, data } = await getDashboardStats();
 * if (success) {
 *   console.log('Estadísticas:', data);
 * } else {
 *   console.error('Error al cargar estadísticas');
 * }
 */
export const getDashboardStats = async () => {
  try {
    const response = await axiosInstance.get('/admin/dashboard/stats');

    return {
      success: true,
      data: response.data.data, // El backend envuelve la respuesta en { success, data }
    };
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);

    return {
      success: false,
      message: error.response?.data?.message || 'Error al obtener estadísticas',
    };
  }
};
