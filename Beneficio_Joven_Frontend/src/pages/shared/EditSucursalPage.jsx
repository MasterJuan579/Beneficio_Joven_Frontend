/**
 * @file EditSucursalPage.jsx
 * @description Página completa para editar una sucursal existente.
 * Accesible tanto para administradores como para dueños de establecimientos.
 * Incluye gestión de imágenes, validación de horarios y confirmación de cambios.
 *
 * @module pages/shared/EditSucursalPage
 * @version 1.0.0
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Autocomplete from 'react-google-autocomplete';
import AdminNavbar from '../../components/common/AdminNavbar';
import ImageUploader from '../../components/common/ImageUploader';
import ImageCarousel from '../../components/common/ImageCarousel';
import { 
  getSucursalById, 
  updateSucursal 
} from '../../api/services/admin-api-requests/comercios';

/**
 * Modal de confirmación de cambios.
 */
function ConfirmSaveModal({ isOpen, onClose, onConfirm, isLoading, hasChanges }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            ¿Guardar cambios?
          </h2>
        </div>

        <div className="p-6">
          <p className="text-gray-600 mb-4">
            Estás a punto de actualizar la información de esta sucursal.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>Nota:</strong> Los cambios se aplicarán inmediatamente y serán visibles para todos los usuarios.
            </p>
          </div>
        </div>

        <div className="p-6 border-t flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition disabled:bg-purple-300 disabled:cursor-not-allowed font-medium"
          >
            {isLoading ? 'Guardando...' : 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Página principal de edición de sucursal.
 */
function EditSucursalPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Estados de datos
  const [sucursal, setSucursal] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    latitud: null,
    longitud: null,
    horaApertura: '',
    horaCierre: '',
    imagenes: []
  });

  // Estados de UI
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  /**
   * Cargar datos de la sucursal al montar el componente.
   */
  useEffect(() => {
    fetchSucursal();
  }, [id]);

  /**
   * Detectar cambios en el formulario.
   */
  useEffect(() => {
    if (!sucursal) return;

    // Comparar solo las propiedades relevantes de las imágenes (url y publicId)
    const originalImageIds = (sucursal.imagenes || [])
      .map(img => img.publicId)
      .sort()
      .join(',');
    
    const currentImageIds = (formData.imagenes || [])
      .map(img => img.publicId)
      .sort()
      .join(',');

    const changed = 
      formData.nombre !== sucursal.nombreSucursal ||
      formData.direccion !== sucursal.direccion ||
      formData.horaApertura !== sucursal.horaApertura ||
      formData.horaCierre !== sucursal.horaCierre ||
      originalImageIds !== currentImageIds; // Solo compara publicIds, no el orden

    setHasChanges(changed);
  }, [formData, sucursal]);

  /**
   * Obtener datos de la sucursal desde el backend.
   */
  const fetchSucursal = async () => {
    setIsLoading(true);
    setError('');

    const result = await getSucursalById(id);

    if (result.success) {
      const data = result.data;
      setSucursal(data);
      
      // Inicializar formulario con datos existentes
      setFormData({
        nombre: data.nombreSucursal || '',
        direccion: data.direccion || '',
        latitud: data.latitud,
        longitud: data.longitud,
        horaApertura: formData.horaApertura ? formData.horaApertura.substring(0, 5) : null,
        horaCierre: formData.horaCierre ? formData.horaCierre.substring(0, 5) : null,
        imagenes: data.imagenes || []
      });
    } else {
      setError(result.message || 'Error al cargar la sucursal');
    }

    setIsLoading(false);
  };

  /**
   * Manejar cambios en los campos del formulario.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  /**
   * Manejar selección de lugar de Google Autocomplete.
   */
  const handlePlaceSelected = (place) => {
    if (place.geometry) {
      setFormData(prev => ({
        ...prev,
        direccion: place.formatted_address,
        latitud: place.geometry.location.lat(),
        longitud: place.geometry.location.lng()
      }));
    }
  };

    /**
   * Manejar cambios en las imágenes.
   */
  const handleImagesUploaded = (uploadedImages) => {
    setFormData(prev => ({
      ...prev,
      imagenes: uploadedImages
    }));
  };

  /**
   * Eliminar una imagen específica del carrusel.
   * @param {number} index - Índice de la imagen a eliminar
   */
  const handleRemoveImage = (index) => {
    const updatedImages = formData.imagenes.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      imagenes: updatedImages
    }));
  };

  /**
   * Validar formulario antes de enviar.
   */
  const validateForm = () => {
    if (!formData.nombre.trim()) {
      setError('El nombre de la sucursal es requerido');
      return false;
    }

    if (!formData.direccion.trim()) {
      setError('La dirección es requerida');
      return false;
    }

    if (!formData.horaApertura || !formData.horaCierre) {
      setError('Los horarios de apertura y cierre son requeridos');
      return false;
    }

    if (formData.horaApertura >= formData.horaCierre) {
      setError('La hora de apertura debe ser antes que la hora de cierre');
      return false;
    }

    if (formData.imagenes.length > 5) {
      setError('Solo se permiten máximo 5 imágenes');
      return false;
    }

    return true;
  };

  /**
   * Abrir modal de confirmación.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsConfirmModalOpen(true);
  };

  /**
   * Confirmar y guardar cambios.
   */
  const handleConfirmSave = async () => {
    setIsSaving(true);
    setError('');

    // 🔧 Limpiar y formatear datos para el backend
    const dataToSend = {
      nombre: formData.nombre,
      direccion: formData.direccion,
      latitud: Number(formData.latitud),  // ✅ Convertir a número
      longitud: Number(formData.longitud), // ✅ Convertir a número
      // ✅ Quitar segundos de los horarios (HH:mm:ss -> HH:mm)
      horaApertura: formData.horaApertura ? formData.horaApertura.substring(0, 5) : null,
      horaCierre: formData.horaCierre ? formData.horaCierre.substring(0, 5) : null,
      // ✅ Enviar solo {url, publicId} sin campos extra
      imagenes: formData.imagenes.map(img => ({
        url: img.url,
        publicId: img.publicId
      }))
    };

    console.log('📤 Datos limpios a enviar:', JSON.stringify(dataToSend, null, 2));

    const result = await updateSucursal(id, dataToSend);

    if (result.success) {
      setIsConfirmModalOpen(false);
      
      // Mostrar mensaje de éxito y redirigir
      navigate('/admin/comercios');
    } else {
      setError(result.message || 'Error al actualizar la sucursal');
      setIsConfirmModalOpen(false);
    }

    setIsSaving(false);
  };

  /**
   * Cancelar edición y volver atrás.
   */
  const handleCancel = () => {
    if (hasChanges) {
      const confirmCancel = window.confirm(
        '¿Estás seguro de cancelar? Los cambios no guardados se perderán.'
      );
      if (!confirmCancel) return;
    }
    navigate(-1);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <AdminNavbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !sucursal) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <AdminNavbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-700 font-medium">{error}</p>
            <button
              onClick={() => navigate(-1)}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Volver
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <AdminNavbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver
          </button>

          <h1 className="text-3xl font-bold text-gray-900">
            Editar Sucursal
          </h1>
          <p className="text-gray-600 mt-2">
            Modifica la información de la sucursal y guarda los cambios
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* 🆕 CARRUSEL DE IMÁGENES AL INICIO */}
          {sucursal && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Imágenes de la Sucursal
                </h2>
                <span className="text-sm text-gray-500">
                  {formData.imagenes.length} / 5 imágenes
                </span>
              </div>

              <ImageCarousel
                images={formData.imagenes}
                onRemove={handleRemoveImage}
                maxImages={5}
              />

              {/* Agregar más imágenes si hay espacio */}
              {formData.imagenes.length < 5 && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Agregar más imágenes
                  </h3>
                  <ImageUploader
                    key={`uploader-${formData.imagenes.length}`}
                    folder="sucursales"
                    maxImages={5 - formData.imagenes.length}
                    onImagesUploaded={(newImages) => {
                      // Solo agregar si realmente hay nuevas imágenes
                      if (newImages && newImages.length > 0) {
                        setFormData(prev => ({
                          ...prev,
                          imagenes: [...prev.imagenes, ...newImages]
                        }));
                      }
                    }}
                    initialImages={[]}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Puedes agregar {5 - formData.imagenes.length} imagen(es) más
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Información de la Sucursal */}
          <div className="bg-white rounded-lg shadow-md p-6">
            
            {/* Mensaje de Error */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Información General */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Información General
              </h2>

              {/* Establecimiento (solo lectura) */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Establecimiento
                </label>
                <input
                  type="text"
                  value={sucursal?.nombreEstablecimiento || ''}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">
                  El establecimiento no puede ser modificado
                </p>
              </div>

              {/* Nombre de la Sucursal */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de la Sucursal *
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Ej: Sucursal Centro"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  required
                />
              </div>

              {/* Dirección con Autocomplete */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección *
                </label>
                <Autocomplete
                  apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
                  onPlaceSelected={handlePlaceSelected}
                  value={formData.direccion}
                  onChange={(e) => setFormData(prev => ({ ...prev, direccion: e.target.value }))}
                  options={{
                    types: ['establishment', 'geocode'],
                    componentRestrictions: { country: 'mx' }
                  }}
                  placeholder="Buscar dirección..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                />
                {formData.latitud && formData.longitud && (
                  <p className="text-xs text-gray-500 mt-1">
                    📍 Coordenadas: {Number(formData.latitud).toFixed(6)}, {Number(formData.longitud).toFixed(6)}
                  </p>
                )}
              </div>
            </div>

            {/* Horarios */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Horarios de Operación
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hora de Apertura *
                  </label>
                  <input
                    type="time"
                    name="horaApertura"
                    value={formData.horaApertura}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hora de Cierre *
                  </label>
                  <input
                    type="time"
                    name="horaCierre"
                    value={formData.horaCierre}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer con Botones */}
          <div className="bg-white rounded-lg shadow-md px-6 py-4 flex gap-3 justify-end">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSaving}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving || !hasChanges}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition disabled:bg-purple-300 disabled:cursor-not-allowed font-medium"
            >
              {isSaving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>

      {/* Modal de Confirmación */}
      <ConfirmSaveModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmSave}
        isLoading={isSaving}
        hasChanges={hasChanges}
      />
    </div>
  );
}

export default EditSucursalPage;