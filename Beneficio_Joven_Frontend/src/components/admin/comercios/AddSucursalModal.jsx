import { useState, useEffect } from 'react';
import Autocomplete from 'react-google-autocomplete';
import { getEstablecimientos, createSucursal } from '../../../api/services/admin-api-requests/comercios';
import ImageUploader from '../../common/ImageUploader';

function AddSucursalModal({ isOpen, onClose, onSucursalCreated }) {
  const [establecimientos, setEstablecimientos] = useState([]);
  const [isLoadingEstablecimientos, setIsLoadingEstablecimientos] = useState(false);
  const [formData, setFormData] = useState({
    idEstablecimiento: '',
    nombre: '',
    direccion: '',
    latitud: null,
    longitud: null,
    horaApertura: '',
    horaCierre: '',
    imagenes: []
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Cargar establecimientos al abrir el modal
  useEffect(() => {
    if (isOpen) {
      fetchEstablecimientos();
    }
  }, [isOpen]);

  const fetchEstablecimientos = async () => {
    setIsLoadingEstablecimientos(true);
    const result = await getEstablecimientos();

    if (result.success) {
      setEstablecimientos(result.data);
    } else {
      setError('Error al cargar establecimientos');
    }

    setIsLoadingEstablecimientos(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handlePlaceSelected = (place) => {
    if (place.geometry) {
      setFormData({
        ...formData,
        direccion: place.formatted_address,
        latitud: place.geometry.location.lat(),
        longitud: place.geometry.location.lng()
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (formData.horaApertura >= formData.horaCierre) {
      setError('La hora de apertura debe ser antes que la hora de cierre');
      setIsLoading(false);
      return;
    }

    if (formData.imagenes.length > 5) {
      setError('Solo se permiten máximo 5 imágenes por sucursal');
      setIsLoading(false);
      return;
    }

    const result = await createSucursal(formData);

    if (result.success) {
      onSucursalCreated();
      handleClose();
    } else {
      setError(result.message);
    }

    setIsLoading(false);
  };

  const handleClose = () => {
    setFormData({
      idEstablecimiento: '',
      nombre: '',
      direccion: '',
      latitud: null,
      longitud: null,
      horaApertura: '',
      horaCierre: '',
      imagenes: []
    });
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full mx-6 my-12 overflow-y-auto max-h-[92vh] border border-gray-200">
          <div className="flex-1 overflow-y-auto px-6 py-4">

          
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">
              Agregar Nueva Sucursal
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            
            {/* Mensaje de Error */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Establecimiento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Establecimiento *
              </label>
              <select
                name="idEstablecimiento"
                value={formData.idEstablecimiento}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                required
                disabled={isLoading || isLoadingEstablecimientos}
              >
                <option value="">Selecciona un establecimiento</option>
                {establecimientos.map((est) => (
                  <option key={est.idEstablecimiento} value={est.idEstablecimiento}>
                    {est.nombreEstablecimiento} - {est.categoria}
                  </option>
                ))}
              </select>
            </div>

            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de la Sucursal *
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Sucursal Centro"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                required
                disabled={isLoading}
              />
            </div>

            {/* Dirección con Autocomplete */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dirección *
              </label>
              <Autocomplete
                apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
                onPlaceSelected={handlePlaceSelected}
                options={{
                  types: ['establishment', 'geocode'],
                  componentRestrictions: { country: 'mx' }
                }}
                placeholder="Buscar dirección..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                disabled={isLoading}
              />
              {formData.latitud && formData.longitud && (
                <p className="text-xs text-gray-500 mt-1">
                  📍 Coordenadas: {formData.latitud.toFixed(6)}, {formData.longitud.toFixed(6)}
                </p>
              )}
            </div>

            {/* Horarios */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hora de Apertura *
                </label>
                <input
                  type="time"
                  name="horaApertura"
                  value={formData.horaApertura}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hora de Cierre *
                </label>
                <input
                  type="time"
                  name="horaCierre"
                  value={formData.horaCierre}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Imágenes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Imágenes de la sucursal (máx. 5)
              </label>
              <ImageUploader
                folder="sucursales"
                maxImages={5}
                onImagesUploaded={(uploadedImages) => {
                  setFormData({
                    ...formData,
                    imagenes: uploadedImages // [{ url, publicId }]
                  });
                }}
                initialImages={formData.imagenes}
              />
              <p className="text-xs text-gray-500 mt-1">
                Puedes subir hasta 5 imágenes por sucursal.
              </p>
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading || !formData.direccion}
                className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition disabled:bg-purple-300 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creando...' : 'Crear Sucursal'}
              </button>
            </div>

          </form>
        </div>        
      </div>
    </div>
  );
}

export default AddSucursalModal;
