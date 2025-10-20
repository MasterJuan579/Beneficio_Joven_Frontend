/**
 * @file comercios.js
 * @description Módulo de servicios para la gestión de sucursales y establecimientos
 * dentro del panel de administración del sistema Beneficio Joven.
 * Incluye funciones para obtener, crear y actualizar sucursales usando Axios con interceptores de autenticación.
 *
 * @module api/services/admin-api-requests/comercios
 * @version 1.0.0
 */

import axiosInstance from '../../interceptors/authInterceptor';

/**
 * Obtiene la lista de sucursales (comercios) registradas en el sistema.
 *
 * @async
 * @function getSucursales
 * @returns {Promise<{success: boolean, data?: Object[], total?: number, message?: string}>}
 * Devuelve un objeto con el estado de la operación y los datos obtenidos.
 *
 * @example
 * const { success, data } = await getSucursales();
 * if (success) console.log(data);
 */
export const getSucursales = async () => {
  try {
    const response = await axiosInstance.get('/common/get/sucursales');
    return {
      success: true,
      data: response.data.data,
      total: response.data.total,
    };
  } catch (error) {
    console.error('Error al obtener sucursales:', error.message);
    console.error('Stack:', error.stack);

    return {
      success: false,
      message: error.response?.data?.message || 'Error al obtener sucursales',
    };
  }
};

/**
 * Cambia el estado de una sucursal (activar o desactivar).
 *
 * @async
 * @function toggleSucursalStatus
 * @param {string|number} idSucursal - ID único de la sucursal a modificar.
 * @returns {Promise<{success: boolean, data?: Object, message: string}>}
 * Devuelve la respuesta del servidor con el nuevo estado.
 *
 * @example
 * await toggleSucursalStatus(12);
 */
export const toggleSucursalStatus = async (idSucursal) => {
  try {
    const response = await axiosInstance.patch(
      `/admin/sucursales/${idSucursal}/toggle-status`
    );

    return {
      success: true,
      data: response.data,
      message: 'Estado actualizado exitosamente',
    };
  } catch (error) {
    console.error('Error al cambiar estado de sucursal:', error);

    return {
      success: false,
      message: error.response?.data?.message || 'Error al cambiar estado',
    };
  }
};

/**
 * Obtiene la lista de establecimientos registrados en la base de datos.
 *
 * @async
 * @function getEstablecimientos
 * @returns {Promise<{success: boolean, data?: Object[], total?: number, message?: string}>}
 * Devuelve los establecimientos disponibles.
 *
 * @example
 * const { data } = await getEstablecimientos();
 * console.log(data);
 */
export const getEstablecimientos = async () => {
  try {
    const response = await axiosInstance.get('/admin/establecimiento');
    return {
      success: true,
      data: response.data.data,
      total: response.data.total,
    };
  } catch (error) {
    console.error('Error al obtener establecimientos:', error);
    return {
      success: false,
      message:
        error.response?.data?.message || 'Error al obtener establecimientos',
    };
  }
};

/**
 * Crea una nueva sucursal en el sistema.
 *
 * @async
 * @function createSucursal
 * @param {Object} sucursalData - Datos de la nueva sucursal a registrar.
 * @param {string} sucursalData.nombre - Nombre de la sucursal.
 * @param {string} sucursalData.direccion - Dirección física de la sucursal.
 * @param {string[]} [sucursalData.imagenes] - Lista opcional de URLs o archivos de imágenes.
 * @throws {Error} Si se excede el límite de imágenes permitido (máximo 5).
 * @returns {Promise<{success: boolean, data?: Object, message: string, errors?: Array}>}
 * Respuesta del servidor con estado de creación.
 *
 * @example
 * await createSucursal({ nombre: "Sucursal Centro", direccion: "Av. Principal 123" });
 */
export const createSucursal = async (sucursalData) => {
  try {
    if (sucursalData.imagenes && sucursalData.imagenes.length > 5) {
      throw new Error('Solo se permiten máximo 5 imágenes por sucursal.');
    }

    const response = await axiosInstance.post(
      '/admin/post/sucursales',
      sucursalData
    );

    return {
      success: true,
      data: response.data.data,
      message: response.data.message || 'Sucursal creada exitosamente',
    };
  } catch (error) {
    console.error('Error al crear sucursal:', error);

    return {
      success: false,
      message: error.response?.data?.message || 'Error al crear sucursal',
      errors: error.response?.data?.errors || [],
    };
  }
};

/**
 * Obtiene los datos completos de una sucursal específica por ID.
 *
 * @async
 * @function getSucursalById
 * @param {string|number} idSucursal - ID único de la sucursal.
 * @returns {Promise<{success: boolean, data?: Object, message?: string}>}
 * Devuelve los datos completos de la sucursal incluyendo imágenes.
 *
 * @example
 * const { success, data } = await getSucursalById(12);
 * if (success) console.log(data);
 */
export const getSucursalById = async (idSucursal) => {
  try {
    const response = await axiosInstance.get(`/common/sucursales/${idSucursal}`);
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    console.error('Error al obtener sucursal:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al obtener sucursal',
    };
  }
};

/**
 * Actualiza los datos de una sucursal existente.
 *
 * @async
 * @function updateSucursal
 * @param {string|number} idSucursal - ID único de la sucursal a actualizar.
 * @param {Object} sucursalData - Datos actualizados de la sucursal.
 * @param {string} [sucursalData.nombre] - Nombre de la sucursal.
 * @param {string} [sucursalData.direccion] - Dirección física de la sucursal.
 * @param {number} [sucursalData.latitud] - Latitud de la ubicación.
 * @param {number} [sucursalData.longitud] - Longitud de la ubicación.
 * @param {string} [sucursalData.horaApertura] - Hora de apertura (formato HH:mm).
 * @param {string} [sucursalData.horaCierre] - Hora de cierre (formato HH:mm).
 * @param {Array<{url: string, publicId: string}>} [sucursalData.imagenes] - Array de imágenes.
 * @returns {Promise<{success: boolean, data?: Object, message: string, errors?: Array}>}
 * Respuesta del servidor con estado de actualización.
 *
 * @example
 * await updateSucursal(12, { 
 *   nombre: "Sucursal Centro Actualizada", 
 *   horaApertura: "09:00",
 *   imagenes: [
 *     { url: "https://...", publicId: "sucursales/abc123" }
 *   ]
 * });
 */
export const updateSucursal = async (idSucursal, sucursalData) => {
  try {
    // Validación de horarios si ambos están presentes
    if (sucursalData.horaApertura && sucursalData.horaCierre) {
      if (sucursalData.horaApertura >= sucursalData.horaCierre) {
        throw new Error('La hora de apertura debe ser antes que la hora de cierre');
      }
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
      message: error.message || error.response?.data?.message || 'Error al actualizar sucursal',
      errors: error.response?.data?.errors || [],
    };
  }
};