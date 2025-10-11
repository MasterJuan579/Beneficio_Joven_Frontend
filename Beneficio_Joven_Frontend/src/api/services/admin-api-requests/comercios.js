import axiosInstance from '../../interceptors/authInterceptor';

/**
 * Obtener lista de sucursales (comercios)
 */
export const getSucursales = async () => {
  try {
    const response = await axiosInstance.get('/admin/sucursales');

    return {
      success: true,
      data: response.data.data,
      total: response.data.total,
    };
  } catch (error) {
    console.error('❌ Error al obtener sucursales:', error);
    
    return {
      success: false,
      message: error.response?.data?.message || 'Error al obtener sucursales',
    };
  }
};