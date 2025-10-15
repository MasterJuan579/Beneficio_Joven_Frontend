import axiosInstance from '../../interceptors/authInterceptor';

/**
 * Obtener lista de establecimientos
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
    console.error('❌ Error al obtener establecimientos:', error);

    return {
      success: false,
      message: error.response?.data?.message || 'Error al obtener establecimientos',
    };
  }
};

/**
 * Obtener lista de categorías
 */
export const getCategorias = async () => {
  try {
    const response = await axiosInstance.get('/common/categorias');

    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    console.error('❌ Error al obtener categorías:', error);

    return {
      success: false,
      message: error.response?.data?.message || 'Error al obtener categorías',
      data: [] // Array vacío como fallback
    };
  }
};

/**
 * Crear nuevo establecimiento
 * @param {Object} establecimientoData - Datos del establecimiento a crear
 * Ejemplo:
 * {
 *   nombre: "Starbucks",
 *   logoURL: "https://res.cloudinary.com/.../logo.png",
 *   idCategoria: 3
 * }
 */
export const createEstablecimiento = async (establecimientoData) => {
  try {
    // Validación rápida antes del envío (opcional, por UX)
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
    console.error('❌ Error al crear establecimiento:', error);

    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Error al crear establecimiento',
      errors: error.response?.data?.errors || [],
    };
  }
};
