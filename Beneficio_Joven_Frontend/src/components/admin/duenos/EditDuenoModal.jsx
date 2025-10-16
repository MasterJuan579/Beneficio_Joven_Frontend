/**
 * @file EditDuenoModal.jsx
 * @description Componente modal para editar los datos de un dueño existente en el panel de administración.
 * Carga los datos actuales del dueño, valida el formulario y envía la actualización al backend.
 *
 * @module components/admin/duenos/EditDuenoModal
 * @version 1.0.0
 */

import { useState, useEffect } from 'react';
import { updateDueno } from '../../../api/services/admin-api-requests/duenos';

/**
 * Modal para editar un dueño existente.
 *
 * @component
 * @param {Object} props - Propiedades del componente.
 * @param {boolean} props.isOpen - Indica si el modal está visible.
 * @param {Function} props.onClose - Función para cerrar el modal.
 * @param {Function} props.onDuenoUpdated - Callback ejecutado tras actualizar exitosamente al dueño.
 * @param {{ idDueno: number|string, email: string, nombreUsuario: string }} props.dueno - Dueño seleccionado a editar.
 *
 * @example
 * <EditDuenoModal
 *   isOpen={isOpen}
 *   onClose={() => setOpen(false)}
 *   onDuenoUpdated={refetchDuenos}
 *   dueno={selectedDueno}
 * />
 */
function EditDuenoModal({ isOpen, onClose, onDuenoUpdated, dueno }) {
  const [formData, setFormData] = useState({
    email: '',
    nombreUsuario: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Carga los datos del dueño al abrir el modal o cambiar el dueño seleccionado.
   * @function
   * @private
   */
  useEffect(() => {
    if (dueno) {
      setFormData({
        email: dueno.email,
        nombreUsuario: dueno.nombreUsuario
      });
    }
  }, [dueno]);

  /**
   * Maneja los cambios de los campos del formulario.
   * @param {React.ChangeEvent<HTMLInputElement>} e - Evento de cambio.
   */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  /**
   * Envía la actualización de datos del dueño al backend.
   * @async
   * @param {React.FormEvent} e - Evento de envío del formulario.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const result = await updateDueno(dueno.idDueno, formData);

    if (result.success) {
      onDuenoUpdated();
      onClose();
    } else {
      setError(result.message);
    }

    setIsLoading(false);
  };

  /**
   * Limpia el estado de error y cierra el modal.
   * @function
   */
  const handleClose = () => {
    setError('');
    onClose();
  };

  if (!isOpen || !dueno) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            Editar Dueño
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

          {/* Nombre Usuario */}
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

          {/* Nota sobre contraseña */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>Nota:</strong> No es posible cambiar la contraseña desde aquí por seguridad.
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
              {isLoading ? 'Guardando...' : 'Actualizar'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

export default EditDuenoModal;
