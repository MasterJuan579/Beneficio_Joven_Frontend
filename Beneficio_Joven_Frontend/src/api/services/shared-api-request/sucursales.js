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

/**
 * Actualiza los datos de una sucursal existente.
 *
 * @async
 * @function updateSucursal
 * @param {string|number} idSucursal - ID de la sucursal a actualizar.
 * @param {Object} sucursalData - Datos actualizados de la sucursal.
 * @param {string} sucursalData.nombre - Nombre de la sucursal.
 * @param {string} sucursalData.direccion - Dirección física.
 * @param {number} sucursalData.latitud - Coordenada latitud.
 * @param {number} sucursalData.longitud - Coordenada longitud.
 * @param {string} sucursalData.horaApertura - Hora de apertura (HH:MM).
 * @param {string} sucursalData.horaCierre - Hora de cierre (HH:MM).
 * @param {Array} sucursalData.imagenes - Array de imágenes [{url, publicId}].
 * @returns {Promise<{success: boolean, data?: Object, message: string, errors?: Array}>}
 *
 * @example
 * await updateSucursal(123, {
 *   nombre: "OXXO CU",
 *   direccion: "Av. Universidad 3000",
 *   horaApertura: "06:00",
 *   horaCierre: "23:00",
 *   imagenes: [{ url: "...", publicId: "..." }]
 * });
 */
export const updateSucursal = async (idSucursal, sucursalData) => {
  try {
    // Validación de horarios
    if (sucursalData.horaApertura >= sucursalData.horaCierre) {
      throw new Error('La hora de apertura debe ser antes que la hora de cierre');
    }

    // Validación de imágenes
    if (sucursalData.imagenes && sucursalData.imagenes.length > 5) {
      throw new Error('Solo se permiten máximo 5 imágenes por sucursal');
    }

    const response = await axiosInstance.put(
      `/admin/sucursales/${idSucursal}`,
      sucursalData
    );

    return {
      success: true,
      data: response.data.data,
      message: response.data.message || 'Sucursal actualizada exitosamente',
    };
  } catch (error) {
    console.error('Error al actualizar sucursal:', error);

    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Error al actualizar sucursal',
      errors: error.response?.data?.errors || [],
    };
  }
};