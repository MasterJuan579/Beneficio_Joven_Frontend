/**
 * @file AddDuenoModal.jsx
 * @description Componente modal que permite registrar un nuevo dueño en el panel de administración.
 * Incluye validaciones básicas, manejo de errores y comunicación con el backend mediante el servicio createDueno.
 *
 * @module components/admin/duenos/AddDuenoModal
 * @version 1.0.0
 */

import { useState } from 'react';
import { createDueno } from '../../../api/services/admin-api-requests/duenos';

/**
 * Modal para agregar un nuevo dueño.
 *
 * @component
 * @param {Object} props - Propiedades del componente.
 * @param {boolean} props.isOpen - Indica si el modal está visible.
 * @param {Function} props.onClose - Función para cerrar el modal.
 * @param {Function} props.onDuenoCreated - Callback que se ejecuta tras crear exitosamente un nuevo dueño.
 *
 * @example
 * <AddDuenoModal
 *   isOpen={isModalOpen}
 *   onClose={() => setModalOpen(false)}
 *   onDuenoCreated={loadDuenos}
 * />
 */
function AddDuenoModal({ isOpen, onClose, onDuenoCreated }) {
  const [formData, setFormData] = useState({
    email: '',
    nombreUsuario: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Maneja los cambios en los campos del formulario.
   * @param {React.ChangeEvent<HTMLInputElement>} e - Evento de cambio en los campos del formulario.
   */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  /**
   * Envía los datos del formulario para crear un nuevo dueño.
   * @async
   * @param {React.FormEvent} e - Evento de envío del formulario.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const result = await createDueno(formData);

    if (result.success) {
      setFormData({
        email: '',
        nombreUsuario: '',
        password: ''
      });
      onDuenoCreated();
      onClose();
    } else {
      setError(result.message);
    }

    setIsLoading(false);
  };

  /**
   * Limpia los campos del formulario y cierra el modal.
   * @function
   */
  const handleClose = () => {
    setFormData({
      email: '',
      nombreUsuario: '',
      password: ''
    });
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            Agregar Nuevo Dueño
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

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="ejemplo@comercio.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              required
              disabled={isLoading}
            />
          </div>

          {/* Nombre de Usuario */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de Usuario *
            </label>
            <input
              type="text"
              name="nombreUsuario"
              value={formData.nombreUsuario}
              onChange={handleChange}
              placeholder="nombreusuario"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              required
              disabled={isLoading}
            />
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña *
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Mínimo 8 caracteres"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              required
              minLength={8}
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500 mt-1">
              La contraseña debe tener al menos 8 caracteres.
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
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition disabled:bg-purple-300 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Guardando...' : 'Crear Dueño'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

export default AddDuenoModal;
