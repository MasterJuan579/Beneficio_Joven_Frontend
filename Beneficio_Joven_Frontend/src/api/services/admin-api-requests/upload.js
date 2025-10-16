/**
 * @file upload.js
 * @description Módulo de servicios para subir imágenes a través del backend (Cloudinary u otro servicio configurado).
 * Convierte el archivo a Base64 y lo envía al servidor con Axios para almacenarlo en la carpeta correspondiente.
 *
 * @module api/services/admin-api-requests/upload
 * @version 1.0.0
 */

import axiosInstance from '../../interceptors/authInterceptor';

/**
 * Sube una imagen al servidor (Cloudinary u otro servicio conectado).
 *
 * @async
 * @function uploadImage
 * @param {File} file - Archivo de imagen a subir.
 * @param {string} [folder='logos'] - Carpeta destino donde se almacenará la imagen (por ejemplo: "logos", "productos").
 * @returns {Promise<{success: boolean, logoURL?: string, publicId?: string, message?: string, errors?: Array}>}
 * Devuelve la URL pública y el ID del archivo subido, o un mensaje de error.
 *
 * @example
 * const fileInput = document.querySelector('#logoInput').files[0];
 * const result = await uploadImage(fileInput, 'productos');
 * if (result.success) {
 *   console.log('Imagen subida:', result.logoURL);
 * }
 */
export const uploadImage = async (file, folder = 'logos') => {
  try {
    // Conversión del archivo a Base64
    const base64 = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    console.log(`Subiendo imagen a carpeta: ${folder}`);

    // Envío al backend
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
    console.error('Error subiendo imagen:', error);

    return {
      success: false,
      message: error.response?.data?.message || 'Error al subir imagen',
      errors: error.response?.data?.errors || []
    };
  }
};
