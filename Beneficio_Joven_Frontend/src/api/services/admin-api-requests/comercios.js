import axiosInstance from '../../interceptors/authInterceptor';

/**
 * 🏢 Obtener lista de sucursales (comercios)
 */
export const getSucursales = async () => {
  try {
    const response = await axiosInstance.get('/admin/get/sucursales');
    return {
      success: true,
      data: response.data.data,
      total: response.data.total,
    };
  } catch (error) {
    console.error('❌ Error al obtener sucursales:', error.message);
    console.error('🔎 Stack:', error.stack);

    return {
      success: false,
      message: error.response?.data?.message || 'Error al obtener sucursales',
    };
  }
};

/**
 * 🔄 Cambiar estado de sucursal (activar/desactivar)
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
    console.error('❌ Error al cambiar estado de sucursal:', error);

    return {
      success: false,
      message: error.response?.data?.message || 'Error al cambiar estado',
    };
  }
};

/**
 * 🏬 Obtener lista de establecimientos
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
    console.error('❌ Error al obtener establecimientos:', error);
    return {
      success: false,
      message:
        error.response?.data?.message || 'Error al obtener establecimientos',
    };
  }
};

/**
 * ➕ Crear nueva sucursal
 */
export const createSucursal = async (sucursalData) => {
  try {
    // Validación rápida en frontend (opcional)
    if (sucursalData.imagenes && sucursalData.imagenes.length > 5) {
      throw new Error('Solo se permiten máximo 5 imágenes por sucursal.');
    }

    // Llamada al nuevo endpoint de creación
    const response = await axiosInstance.post('/admin/post/sucursales', sucursalData);

    return {
      success: true,
      data: response.data.data,
      message:
        response.data.message || 'Sucursal creada exitosamente',
    };
  } catch (error) {
    console.error('❌ Error al crear sucursal:', error);

    return {
      success: false,
      message:
        error.response?.data?.message || 'Error al crear sucursal',
      errors: error.response?.data?.errors || [],
    };
  }
};
