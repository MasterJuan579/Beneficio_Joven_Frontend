/**
 * @file ConfirmToggleModal.jsx
 * @description Componente modal para confirmar la activación o desactivación de un dueño en el panel de administración.
 * Muestra la información del dueño y confirma la acción de cambio de estado (activo/inactivo).
 *
 * @module components/admin/duenos/ConfirmToggleModal
 * @version 1.0.0
 */

/**
 * Modal de confirmación para activar o desactivar un dueño.
 *
 * @component
 * @param {Object} props - Propiedades del componente.
 * @param {boolean} props.isOpen - Indica si el modal está visible.
 * @param {Function} props.onClose - Función que cierra el modal sin aplicar cambios.
 * @param {Function} props.onConfirm - Función que ejecuta la acción de activación o desactivación del dueño.
 * @param {Object} props.dueno - Objeto con los datos del dueño seleccionado.
 * @param {boolean} props.isLoading - Indica si la acción está siendo procesada.
 *
 * @example
 * <ConfirmToggleModal
 *   isOpen={modalOpen}
 *   onClose={() => setModalOpen(false)}
 *   onConfirm={handleToggleStatus}
 *   dueno={selectedDueno}
 *   isLoading={isProcessing}
 * />
 */
function ConfirmToggleModal({ isOpen, onClose, onConfirm, dueno, isLoading }) {
  if (!isOpen || !dueno) return null;

  const action = dueno.activo ? 'desactivar' : 'activar';
  const actionCapitalized = dueno.activo ? 'Desactivar' : 'Activar';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                dueno.activo ? 'bg-red-100' : 'bg-green-100'
              }`}
            >
              <svg
                className={`w-6 h-6 ${dueno.activo ? 'text-red-600' : 'text-green-600'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {dueno.activo ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                )}
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                ¿{actionCapitalized} Dueño?
              </h2>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-gray-600 mb-4">
            ¿Estás seguro de {action} a:
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="font-semibold text-gray-900">{dueno.nombreUsuario}</p>
            <p className="text-sm text-gray-600">{dueno.email}</p>
          </div>

          {dueno.activo ? (
            <p className="text-sm text-amber-700">
              Importante: el dueño no podrá iniciar sesión hasta que sea reactivado.
            </p>
          ) : (
            <p className="text-sm text-green-700">
              Al reactivarlo, el dueño podrá iniciar sesión nuevamente.
            </p>
          )}
        </div>

        {/* Footer */}
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
            className={`flex-1 px-4 py-2 rounded-lg text-white transition disabled:opacity-50 ${
              dueno.activo
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isLoading ? 'Procesando...' : `Sí, ${actionCapitalized}`}
          </button>
        </div>

      </div>
    </div>
  );
}

export default ConfirmToggleModal;
