import axiosInstance from '../../interceptors/authInterceptor';

/**
 * Obtener lista de dueños
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
    console.error('❌ Error al obtener dueños:', error);
    
    return {
      success: false,
      message: error.response?.data?.message || 'Error al obtener dueños',
    };
  }
};

/**
 * Crear nuevo dueño
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
    console.error('❌ Error al crear dueño:', error);
    
    return {
      success: false,
      message: error.response?.data?.message || 'Error al crear dueño',
      errors: error.response?.data?.errors || [],
    };
  }
};

/**
 * Actualizar dueño
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
    console.error('❌ Error al actualizar dueño:', error);
    
    return {
      success: false,
      message: error.response?.data?.message || 'Error al actualizar dueño',
    };
  }
};

/**
 * Cambiar estado del dueño (activar/desactivar)
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
    console.error('❌ Error al cambiar estado:', error);
    
    return {
      success: false,
      message: error.response?.data?.message || 'Error al cambiar estado',
    };
  }
};

