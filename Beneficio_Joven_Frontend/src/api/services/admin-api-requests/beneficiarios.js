// src/api/services/admin-api-requests/beneficiarios.js
import axiosInstance from '../../interceptors/authInterceptor';

export async function getBeneficiarios({ query = '', showInactive = false, limit = 200, offset = 0 } = {}) {
  try {
    const { data } = await axiosInstance.get('/admin/beneficiarios', {
      params: {
        query: query || undefined,
        showInactive: showInactive ? '1' : undefined,
        limit,
        offset
      }
    });
    return data;
  } catch (e) {
    return { success: false, message: e?.response?.data?.message || e.message };
  }
}

export async function createBeneficiario(payload) {
  try {
    const { data } = await axiosInstance.post('/admin/beneficiarios', payload);
    return data;
  } catch (e) {
    return { success: false, message: e?.response?.data?.message || e.message };
  }
}

export async function importBeneficiarios({ rows, commit = false }) {
  try {
    const { data } = await axiosInstance.post('/admin/beneficiarios/import', { rows, commit });
    return data;
  } catch (e) {
    return { success: false, message: e?.response?.data?.message || e.message };
  }
}

export async function toggleBeneficiarioStatus(id) {
  try {
    const { data } = await axiosInstance.patch(`/admin/beneficiarios/${id}/toggle-status`);
    return data;
  } catch (e) {
    return { success: false, message: e?.response?.data?.message || e.message };
  }
}
