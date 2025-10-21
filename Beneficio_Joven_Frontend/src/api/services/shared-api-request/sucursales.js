/**
 * @file sucursales.js
 * @description Servicios compartidos para gestión de sucursales.
 * Accesible tanto por Admin como por Dueño.
 *
 * @module api/services/shared-api-requests/sucursales
 * @version 1.0.0
 */

import axiosInstance from '../../interceptors/authInterceptor';

/**
 * Obtiene los detalles completos de una sucursal por ID.
 *
 * @async
 * @function getSucursalById
 * @param {string|number} idSucursal - ID de la sucursal a obtener.
 * @returns {Promise<{success: boolean, data?: Object, message?: string}>}
 *
 * @example
 * const { success, data } = await getSucursalById(123);
 * if (success) console.log('Sucursal:', data);
 */
export const getSucursalById = async (idSucursal) => {
  try {
    const response = await axiosInstance.get(`/admin/sucursales/${idSucursal}`);

    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    console.error('Error al obtener sucursal:', error);

    return {
      success: false,
      message: error.response?.data?.message || 'Error al obtener la sucursal',
    };
  }
};