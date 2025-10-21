import { useState, useRef } from 'react';
import { uploadImage } from '../../api/services/admin-api-requests/upload';

/**
 * Componente para subir imágenes a Cloudinary
 * 
 * @param {Function} onImagesUploaded - callback con array de imágenes [{url, publicId}]
 * @param {String} folder - carpeta destino (por ejemplo 'logos' o 'sucursales')
 * @param {Number} maxImages - número máximo permitido de imágenes (default 1)
 * @param {Array} initialImages - imágenes ya existentes (opcional)
 */
function ImageUploader({ 
  onImagesUploaded, 
  folder = 'logos', 
  maxImages = 1, 
  initialImages = [] 
}) {
  const [images, setImages] = useState(initialImages);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  
  // 🆕 Ref para trackear si es el primer render
  const isFirstRender = useRef(true);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    processFiles(files);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const processFiles = async (files) => {
    if (uploading) return;

    const remainingSlots = maxImages - images.length;
    if (files.length > remainingSlots) {
      setError(`Solo puedes subir ${maxImages} imágenes en total.`);
      return;
    }

    setError('');
    setUploading(true);

    const newImages = [];

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        setError('Solo se permiten imágenes.');
        continue;
      }

      const maxSize = folder === 'logos' ? 5000000 : 3000000;
      if (file.size > maxSize) {
        setError(`La imagen es demasiado grande. Máximo ${(maxSize / 1e6).toFixed(1)}MB`);
        continue;
      }

      const result = await uploadImage(file, folder);
      if (result.success) {
        newImages.push({ url: result.logoURL, publicId: result.publicId });
      } else {
        setError(result.message);
      }
    }

    const updatedImages = [...images, ...newImages].slice(0, maxImages);
    setImages(updatedImages);
    
    // 🆕 Solo llamar callback si hay imágenes nuevas
    if (newImages.length > 0) {
      onImagesUploaded(updatedImages);
    }
    
    setUploading(false);
  };

  const handleRemove = (index) => {
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
    
    // 🆕 Siempre notificar cuando se elimina (acción explícita del usuario)
    onImagesUploaded(updated);
  };

  // 🆕 Marcar que ya no es el primer render después del mount
  if (isFirstRender.current) {
    isFirstRender.current = false;
  }

  return (
    <div className="space-y-2">
      {/* Área de drag & drop */}
      <label
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
        onDrop={handleDrop}
        className={`block border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${
          uploading
            ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
            : isDragging
            ? 'border-purple-500 bg-purple-50 scale-105'
            : 'border-gray-300 hover:border-purple-500 hover:bg-gray-50'
        }`}
      >
        <input
          type="file"
          multiple={maxImages > 1}
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading || images.length >= maxImages}
        />
        
        {uploading ? (
          <div className="flex flex-col items-center py-6">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
            <p className="mt-3 text-sm text-gray-600">Subiendo imagen...</p>
          </div>
        ) : images.length >= maxImages ? (
          <div className="flex flex-col items-center py-4">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <p className="mt-3 text-base font-medium text-gray-700">
              Máximo de imágenes alcanzado
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Elimina una imagen para agregar otra
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center py-4">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="mt-3 text-base font-medium text-gray-700">
              Arrastra o haz clic para seleccionar {maxImages > 1 ? `hasta ${maxImages} imágenes` : 'una imagen'}
            </p>
          </div>
        )}
      </label>

      {/* Grid de previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
          {images.map((img, index) => (
            <div key={img.publicId || index} className="relative group border rounded-lg overflow-hidden">
              <img src={img.url} alt="Preview" className="w-full h-32 object-cover" />
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                title="Eliminar"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          ❌ {error}
        </div>
      )}
    </div>
  );
}

export default ImageUploader;