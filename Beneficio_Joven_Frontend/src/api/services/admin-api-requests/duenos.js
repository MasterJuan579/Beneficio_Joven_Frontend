/**
 * @file duenos.js
 * @description Módulo de servicios del panel de administración para la gestión de dueños de establecimientos.
 * Contiene funciones para listar, crear, actualizar y cambiar el estado de dueños utilizando Axios con interceptores de autenticación.
 *
 * @module api/services/admin-api-requests/duenos
 * @version 1.0.0
 */

import axiosInstance from '../../interceptors/authInterceptor';

/**
 * Obtiene la lista completa de dueños registrados en el sistema.
 *
 * @async
 * @function getDuenos
 * @returns {Promise<{success: boolean, data?: Object[], total?: number, message?: string}>}
 * Devuelve un objeto con los dueños obtenidos o un mensaje de error.
 *
 * @example
 * const { success, data } = await getDuenos();
 * if (success) console.log('Dueños:', data);
 */
export const getDuenos = async () => {
  try {
    const response = await axiosInstance.get('/admin/duenos');

    return {
      success: true,
      data: response.data.data,
      total: response.data.total,
    };
  } catch (error) {
    console.error('Error al obtener dueños:', error);

    return {
      success: false,
      message: error.response?.data?.message || 'Error al obtener dueños',
    };
  }
};

/**
 * Crea un nuevo dueño en el sistema.
 *
 * @async
 * @function createDueno
 * @param {Object} duenoData - Datos del nuevo dueño a registrar.
 * @param {string} duenoData.nombre - Nombre del dueño.
 * @param {string} duenoData.email - Correo electrónico del dueño.
 * @param {string} duenoData.password - Contraseña temporal o generada.
 * @returns {Promise<{success: boolean, data?: Object, message: string, errors?: Array}>}
 * Devuelve el resultado del proceso de creación.
 *
 * @example
 * await createDueno({ nombre: 'Juan Pérez', email: 'juan@correo.com', password: '123456' });
 */
export const createDueno = async (duenoData) => {
  try {
    const response = await axiosInstance.post('/auth/register/dueno', duenoData);

    return {
      success: true,
      data: response.data,
      message: 'Dueño creado exitosamente',
    };
  } catch (error) {
    console.error('Error al crear dueño:', error);

    return {
      success: false,
      message: error.response?.data?.message || 'Error al crear dueño',
      errors: error.response?.data?.errors || [],
    };
  }
};

/**
 * Actualiza la información de un dueño existente.
 *
 * @async
 * @function updateDueno
 * @param {string|number} idDueno - ID único del dueño a actualizar.
 * @param {Object} duenoData - Datos actualizados del dueño.
 * @returns {Promise<{success: boolean, data?: Object, message: string}>}
 * Devuelve la respuesta del servidor con el estado de actualización.
 *
 * @example
 * await updateDueno(5, { nombre: 'María López', email: 'maria@correo.com' });
 */
export const updateDueno = async (idDueno, duenoData) => {
  try {
    const response = await axiosInstance.put(`/admin/duenos/${idDueno}`, duenoData);

    return {
      success: true,
      data: response.data,
      message: 'Dueño actualizado exitosamente',
    };
  } catch (error) {
    console.error('Error al actualizar dueño:', error);

    return {
      success: false,
      message: error.response?.data?.message || 'Error al actualizar dueño',
    };
  }
};

/**
 * Cambia el estado de un dueño (activar o desactivar).
 *
 * @async
 * @function toggleDuenoStatus
 * @param {string|number} idDueno - ID único del dueño.
 * @returns {Promise<{success: boolean, data?: Object, message: string}>}
 * Devuelve la respuesta del servidor con el estado actualizado.
 *
 * @example
 * await toggleDuenoStatus(8);
 */
export const toggleDuenoStatus = async (idDueno) => {
  try {
    const response = await axiosInstance.patch(`/admin/duenos/${idDueno}/toggle-status`);

    return {
      success: true,
      data: response.data,
      message: 'Estado actualizado exitosamente',
    };
  } catch (error) {
    console.error('Error al cambiar estado:', error);

    return {
      success: false,
      message: error.response?.data?.message || 'Error al cambiar estado',
    };
  }
};
