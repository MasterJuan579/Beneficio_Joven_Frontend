import axiosInstance from '../../interceptors/authInterceptor';

/**
 * Obtener estadísticas del dashboard de administrador
 */
export const getDashboardStats = async () => {
  try {
    const response = await axiosInstance.get('/admin/dashboard/stats');

    return {
      success: true,
      data: response.data.data, // data.data porque el backend envuelve en { success, data }
    };
  } catch (error) {
    console.error('❌ Error al obtener estadísticas:', error);
    
    return {
      success: false,
      message: error.response?.data?.message || 'Error al obtener estadísticas',
    };
  }
};