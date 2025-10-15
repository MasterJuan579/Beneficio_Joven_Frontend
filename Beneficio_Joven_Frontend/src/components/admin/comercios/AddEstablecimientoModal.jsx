import { useState, useEffect } from 'react';
import { createEstablecimiento, getCategorias } from '../../../api/services/admin-api-requests/establecimientos';
import ImageUploader from '../../common/ImageUploader';

function AddEstablecimientoModal({ isOpen, onClose, onEstablecimientoCreated }) {
  const [formData, setFormData] = useState({
    nombre: '',
    idCategoria: '', // ← Cambio: ahora es idCategoria
    logoURL: ''
  });
  const [categorias, setCategorias] = useState([]); // ← NUEVO
  const [isLoadingCategorias, setIsLoadingCategorias] = useState(false); // ← NUEVO
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Cargar categorías al abrir el modal
  useEffect(() => {
    if (isOpen) {
      fetchCategorias();
    }
  }, [isOpen]);

  const fetchCategorias = async () => {
    setIsLoadingCategorias(true);
    const result = await getCategorias();
    
    if (result.success) {
      setCategorias(result.data);
    } else {
      setError('Error al cargar categorías: ' + result.message);
    }
    
    setIsLoadingCategorias(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleImageUploaded = (url) => {
    setFormData({ ...formData, logoURL: url });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validación básica
    if (!formData.nombre.trim()) {
      setError('El nombre es requerido');
      setIsLoading(false);
      return;
    }

    if (!formData.idCategoria) {
      setError('La categoría es requerida');
      setIsLoading(false);
      return;
    }

    const result = await createEstablecimiento(formData);

    if (result.success) {
      onEstablecimientoCreated();
      handleClose();
    } else {
      setError(result.message);
      if (result.errors && result.errors.length > 0) {
        setError(result.errors.join(', '));
      }
    }

    setIsLoading(false);
  };

  const handleClose = () => {
    setFormData({
      nombre: '',
      idCategoria: '',
      logoURL: ''
    });
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            Agregar Nuevo Establecimiento
          </h2>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Mensaje de Error */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              ❌ {error}
            </div>
          )}

          {/* Nombre del Establecimiento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Establecimiento *
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ej: Starbucks Coffee"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              required
              disabled={isLoading}
            />
          </div>

          {/* Categoría - ACTUALIZADO */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoría *
            </label>
            {isLoadingCategorias ? (
              <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
                <span className="text-gray-500">Cargando categorías...</span>
              </div>
            ) : (
              <select
                name="idCategoria"
                value={formData.idCategoria}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                required
                disabled={isLoading || categorias.length === 0}
              >
                <option value="">Selecciona una categoría</option>
                {categorias.map((cat) => (
                  <option key={cat.idCategoria} value={cat.idCategoria}>
                    {cat.nombreCategoria}
                  </option>
                ))}
              </select>
            )}
            {!isLoadingCategorias && categorias.length === 0 && (
              <p className="text-xs text-red-500 mt-1">
                No se pudieron cargar las categorías. Intenta recargar el modal.
              </p>
            )}
          </div>

          {/* Logo */}
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo del Establecimiento
            </label>
            <ImageUploader
                onImagesUploaded={(images) => {
                // El componente devuelve un arreglo [{url, publicId}]
                setFormData({ ...formData, logoURL: images[0]?.url || '' });
                }}
                folder="logos"
                maxImages={1}
                initialImages={formData.logoURL ? [{ url: formData.logoURL }] : []}
            />
            <p className="text-xs text-gray-500 mt-2">
                Opcional. El logo se mostrará en la aplicación móvil y en el panel web.
            </p>
        </div>


          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading || categorias.length === 0}
              className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition disabled:bg-purple-300 disabled:cursor-not-allowed font-medium"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creando...
                </span>
              ) : (
                'Crear Establecimiento'
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

export default AddEstablecimientoModal;
