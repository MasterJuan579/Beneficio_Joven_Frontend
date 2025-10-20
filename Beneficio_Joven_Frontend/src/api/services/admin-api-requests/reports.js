/**
 * @file reports.js
 * @description Servicio del panel de administración para obtener reportes del backend.
 * Endpoint: GET /admin/reports?from=YYYY-MM-DD&to=YYYY-MM-DD
 * @version 1.1.2 (debug + manejo de errores)
 */

import axiosInstance from '../../interceptors/authInterceptor';

const cleanParams = (obj = {}) => {
  const out = {};
  Object.entries(obj).forEach(([k, v]) => {
    if (v !== undefined && v !== null && String(v) !== '') out[k] = v;
  });
  return out;
};

export const getAdminReports = async (opts = {}) => {
  const { from, to, signal } = opts;

  try {
    // Debug útil
    console.log('[Reports] axios baseURL =', axiosInstance.defaults?.baseURL);
    console.log('[Reports] GET /admin/reports params =', cleanParams({ from, to }));

    const res = await axiosInstance.get('/admin/reports', {
      params: cleanParams({ from, to }),
      signal,
    });

    const { data, config } = res;
    console.log('[Reports] Request URL =', config?.baseURL ? config.baseURL + (config.url || '') : config?.url);
    console.log('[Reports] RAW response =', data);

    if (!data?.success) {
      return { success: false, message: data?.message || 'Error en reports' };
    }

    // Debug tamaños por serie
    console.log('[Reports] payload keys:', Object.keys(data.data || {}));
    console.log('[Reports] series keys:', Object.keys(data.data?.series || {}));
    for (const [k, v] of Object.entries(data.data?.series || {})) {
      console.log(`[Reports] len ${k} =`, Array.isArray(v) ? v.length : '(no array)');
    }

    if (typeof window !== 'undefined') {
      window._lastReports = data.data;
    }

    return { success: true, data: data.data };
  } catch (err) {
    let message = 'Error al obtener reportes';

    if (err?.name === 'CanceledError' || err?.message === 'canceled') {
      message = 'Solicitud cancelada';
    } else if (err?.response) {
      const status = err.response.status;
      const backendMsg = err.response.data?.message;
      message = backendMsg || (status === 401 || status === 403
        ? 'No autorizado o sesión expirada'
        : `Error del servidor (${status})`);
    } else if (err?.request) {
      message = 'Sin respuesta del servidor';
    } else if (err?.message) {
      message = err.message;
    }

    console.error('Error getAdminReports:', {
      msg: err?.message,
      status: err?.response?.status,
      data: err?.response?.data,
    });

    return { success: false, message };
  }
};

export default getAdminReports;
