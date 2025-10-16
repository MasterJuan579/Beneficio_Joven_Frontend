/**
 * @file reports.js
 * @description Módulo de servicios del panel de administración para la obtención de reportes.
 * Contiene funciones para consultar la lista de reportes generados en el backend utilizando Axios.
 *
 * @module api/services/admin-api-requests/reports
 * @version 1.0.0
 */

import axiosInstance from '../../interceptors/authInterceptor';

/**
 * Obtiene la lista de reportes del panel de administración.
 *
 * @async
 * @function getAdminReports
 * @returns {Promise<{success: boolean, data?: Object[], message?: string}>}
 * Devuelve un objeto con el estado de la solicitud y los datos de los reportes.
 *
 * @example
 * const { success, data } = await getAdminReports();
 * if (success) {
 *   console.log('Reportes:', data);
 * } else {
 *   console.error('Error al cargar reportes');
 * }
 */
export const getAdminReports = async () => {
  try {
    const { data } = await axiosInstance.get('/admin/reports');

    // El backend responde con el formato { success, data, message }
    if (!data?.success) {
      return { success: false, message: data?.message || 'Error en reports' };
    }

    return { success: true, data: data.data };
  } catch (err) {
    console.error('Error getAdminReports:', err);

    const msg =
      err?.response?.data?.message ||
      err?.message ||
      'Error al obtener reportes';

    return { success: false, message: msg };
  }
};
