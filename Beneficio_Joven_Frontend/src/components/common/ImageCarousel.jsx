/**
 * @file ImageCarousel.jsx
 * @description Carrusel de imágenes con controles de navegación y opción de eliminar.
 * Muestra las imágenes existentes y permite agregar/eliminar.
 *
 * @module components/common/ImageCarousel
 * @version 1.0.0
 */

import { useState } from 'react';

/**
 * Carrusel de imágenes con navegación.
 * 
 * @param {Object} props
 * @param {Array<{url: string, publicId: string}>} props.images - Array de imágenes
 * @param {Function} props.onRemove - Función para eliminar imagen (recibe índice)
 * @param {number} props.maxImages - Máximo de imágenes permitidas
 */
function ImageCarousel({ images = [], onRemove, maxImages = 5 }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="bg-gray-100 rounded-lg p-12 text-center">
        <svg
          className="w-16 h-16 text-gray-400 mx-auto mb-4"
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
        <p className="text-gray-500 font-medium">No hay imágenes</p>
        <p className="text-gray-400 text-sm mt-1">
          Agrega imágenes de esta sucursal
        </p>
      </div>
    );
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleRemove = (e, index) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove(index);
      // Ajustar índice si eliminamos la imagen actual
      if (index === currentIndex && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    }
  };

  return (
    <div className="relative bg-gray-900 rounded-lg overflow-hidden">
      {/* Imagen Principal */}
      <div className="relative aspect-video">
        <img
          src={images[currentIndex]?.url}
          alt={`Imagen ${currentIndex + 1}`}
          className="w-full h-full object-cover"
        />

        {/* Botón Eliminar */}
        <button
          type="button"
          onClick={(e) => handleRemove(e, currentIndex)}
          className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white rounded-full p-2 shadow-lg transition z-10"
          title="Eliminar imagen"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Contador de Imágenes */}
        <div className="absolute bottom-3 left-3 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm">
          {currentIndex + 1} / {images.length}
        </div>

        {/* Navegación (si hay más de 1 imagen) */}
        {images.length > 1 && (
          <>
            {/* Botón Anterior */}
            <button
              type="button"
              onClick={goToPrevious}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full p-2 transition"
              aria-label="Imagen anterior"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Botón Siguiente */}
            <button
              type="button"
              onClick={goToNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full p-2 transition"
              aria-label="Imagen siguiente"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Thumbnails (miniaturas) */}
      {images.length > 1 && (
        <div className="flex gap-2 p-3 bg-gray-800 overflow-x-auto">
          {images.map((image, index) => (
            <button
              type="button"
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                index === currentIndex
                  ? 'border-purple-500 scale-105'
                  : 'border-transparent hover:border-gray-500'
              }`}
            >
              <img
                src={image.url}
                alt={`Miniatura ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Indicador de Capacidad */}
      <div className="p-3 bg-gray-800 border-t border-gray-700">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-300">
            {images.length} / {maxImages} imágenes
          </span>
          {images.length >= maxImages && (
            <span className="text-amber-400 font-medium">
              Máximo alcanzado
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default ImageCarousel;