// src/api/services/admin-api-requests/reports.js
import axiosInstance from '../../interceptors/authInterceptor';

export const getAdminReports = async () => {
  try {
    const { data } = await axiosInstance.get('/admin/reports'); // baseURL sale del interceptor
    // Backend responde { success, data, message }
    if (!data?.success) {
      return { success: false, message: data?.message || 'Error en reports' };
    }
    return { success: true, data: data.data };
  } catch (err) {
    console.error('❌ Error getAdminReports:', err);
    const msg =
      err?.response?.data?.message ||
      err?.message ||
      'Error al obtener reportes';
    return { success: false, message: msg };
  }
};