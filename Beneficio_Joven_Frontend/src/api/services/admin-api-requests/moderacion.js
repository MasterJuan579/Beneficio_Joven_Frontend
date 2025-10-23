/**
 * @file moderacion.js
 * @description Módulo de servicios para la gestión de promociones en moderación
 * dentro del panel de administración del sistema Beneficio Joven.
 * Incluye funciones para obtener, aprobar y rechazar promociones usando Axios con interceptores.
 *
 * @module api/services/admin-api-requests/moderacion
 * @version 1.0.0
 */

import axiosInstance from '../../interceptors/authInterceptor';

/**
 * Obtiene la lista de promociones filtradas por estado.
 *
 * @async
 * @function getPromocionesModeracion
 * @param {string} [status='PENDING'] - Estado de las promociones a listar ('PENDING', 'APPROVED', 'REJECTED')
 * @returns {Promise<{success: boolean, data?: Object[], message?: string}>}
 *
 * @example
 * const { success, data } = await getPromocionesModeracion('PENDING');
 * if (success) console.log(data);
 */
export const getPromocionesModeracion = async (status = 'PENDING') => {
  try {
    const response = await axiosInstance.get('/admin/moderacion', {
      params: { status },
    });

    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    console.error('❌ Error al obtener promociones en moderación:', error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        'Error al obtener la lista de promociones',
    };
  }
};

/**
 * Aprueba una promoción pendiente.
 *
 * @async
 * @function approvePromocion
 * @param {string|number} idPromocion - ID de la promoción a aprobar.
 * @returns {Promise<{success: boolean, message: string}>}
 *
 * @example
 * await approvePromocion(15);
 */
export const approvePromocion = async (idPromocion) => {
  try {
    const response = await axiosInstance.post(
      `/admin/moderacion/${idPromocion}/approve`
    );

    return {
      success: true,
      message: response.data.message || 'Promoción aprobada correctamente',
    };
  } catch (error) {
    console.error('❌ Error al aprobar promoción:', error);
    return {
      success: false,
      message:
        error.response?.data?.message || 'Error al aprobar la promoción',
    };
  }
};

/**
 * Rechaza una promoción pendiente.
 *
 * @async
 * @function rejectPromocion
 * @param {string|number} idPromocion - ID de la promoción a rechazar.
 * @returns {Promise<{success: boolean, message: string}>}
 *
 * @example
 * await rejectPromocion(20);
 */
export const rejectPromocion = async (idPromocion, justificacion) => {
  try {
    const response = await axiosInstance.post(
      `/admin/moderacion/${idPromocion}/reject`,
      { justificacion }
    );

    return {
      success: true,
      message: response.data.message || "Promoción rechazada correctamente",
    };
  } catch (error) {
    console.error("❌ Error al rechazar promoción:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Error al rechazar la promoción",
    };
  }
};


/**
 * Obtiene los detalles completos de una promoción específica.
 *
 * @async
 * @function getPromocionById
 * @param {number|string} idPromocion - ID único de la promoción.
 * @returns {Promise<{success: boolean, data?: Object, message?: string}>}
 *
 * @example
 * const { success, data } = await getPromocionById(12);
 * if (success) console.log(data);
 */
export const getPromocionById = async (idPromocion) => {
  try {
    const response = await axiosInstance.get(`/admin/promociones/${idPromocion}`);
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    console.error('❌ Error al obtener promoción:', error);
    return {
      success: false,
      message:
        error.response?.data?.message || 'Error al obtener detalles de la promoción',
    };
  }
};
