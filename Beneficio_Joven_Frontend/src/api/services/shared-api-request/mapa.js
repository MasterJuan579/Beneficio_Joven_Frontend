// Ajusta la ruta si tu axios instance está en otro path
import axios from '../../config/axiosConfig';

// GET /common/mapa/sucursales?categoria=&search=
export const getSucursalesMapa = async ({ categoria, search } = {}) => {
  const params = {};
  if (categoria) params.categoria = categoria;
  if (search) params.search = search;

  const { data } = await axios.get('/common/mapa/sucursales', { params });
  return data; // { success, count, data: [...] }
};

// Si no tienes ya getCategorias():
export const getCategorias = async () => {
  const { data } = await axios.get('/common/categorias');
  return data; // { success, data: [...] }
};
