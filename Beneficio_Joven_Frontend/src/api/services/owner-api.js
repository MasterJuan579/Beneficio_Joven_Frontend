import apiClient from '../config/axiosConfig';
// Sucursales del dueño autenticado
export const ownerGetMyBranches = async () => {
  try {
    const { data } = await apiClient.get('/owner/sucursales/mias');
    return { success: true, data };
  } catch (e) {
    return { success: false, message: e?.response?.data?.message || 'Error al cargar sucursales' };
  }
};

export const ownerGetBranch = async (id) => {
  try {
    const { data } = await apiClient.get(`/owner/sucursales/${id}`);
    return { success: true, data };
  } catch (e) {
    return { success: false, message: e?.response?.data?.message || 'Error al cargar sucursal' };
  }
};

export const ownerListPromosByBranch = async (idSucursal) => {
  try {
    const { data } = await apiClient.get(`/owner/sucursales/${idSucursal}/promos`);
    return { success: true, data };
  } catch (e) {
    return { success: false, message: e?.response?.data?.message || 'Error al cargar promociones' };
  }
};

export const ownerCreatePromoForBranch = async (idSucursal, payload) => {
  try {
    const { data } = await apiClient.post(`/owner/sucursales/${idSucursal}/promos`, payload);
    return { success: true, data };
  } catch (e) {
    return { success: false, message: e?.response?.data?.message || 'No se pudo crear la promoción' };
  }
};

// Reglas de moderación por establecimiento
export const ownerGetModerationRule = async (idEstablecimiento) => {
  try {
    const { data } = await apiClient.get(`/owner/establecimientos/${idEstablecimiento}/moderacion-rule`);
    return { success: true, data };
  } catch (e) {
    return { success: false, message: e?.response?.data?.message || 'Error al leer reglas' };
  }
};

export const ownerUpdateModerationRule = async (idEstablecimiento, payload) => {
  try {
    const { data } = await apiClient.put(`/owner/establecimientos/${idEstablecimiento}/moderacion-rule`, payload);
    return { success: true, data };
  } catch (e) {
    return { success: false, message: e?.response?.data?.message || 'Error al actualizar reglas' };
  }
};
