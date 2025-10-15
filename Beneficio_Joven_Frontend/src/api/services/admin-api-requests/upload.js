import axiosInstance from '../../interceptors/authInterceptor';

/**
 * Subir imagen a Cloudinary
 * @param {File} file - Archivo de imagen
 * @param {string} folder - Carpeta destino ('logos', 'productos', etc.)
 */
export const uploadImage = async (file, folder = 'logos') => {
  try {
    // Convertir archivo a base64
    const base64 = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    console.log(`Subiendo imagen a carpeta: ${folder}`);

    // Enviar al backend
    const response = await axiosInstance.post('/upload-image', {
      image: base64,
      folder: folder
    });

    console.log('Imagen subida:', response.data.logoURL);

    return {
      success: true,
      logoURL: response.data.logoURL,
      publicId: response.data.publicId
    };

  } catch (error) {
    console.error('❌ Error subiendo imagen:', error);
    
    return {
      success: false,
      message: error.response?.data?.message || 'Error al subir imagen',
      errors: error.response?.data?.errors || []
    };
  }
};