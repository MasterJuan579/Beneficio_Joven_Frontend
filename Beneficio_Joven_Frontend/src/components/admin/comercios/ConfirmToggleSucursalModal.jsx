/**
 * @file ConfirmToggleSucursalModal.jsx
 * @description Componente modal para confirmar la activación o desactivación de una sucursal en el panel de administración.
 * Muestra información de la sucursal seleccionada y advierte sobre las consecuencias de la acción.
 *
 * @module components/admin/comercios/ConfirmToggleSucursalModal
 * @version 1.0.0
 */

/**
 * Modal de confirmación para activar o desactivar una sucursal.
 *
 * @component
 * @param {Object} props - Propiedades del componente.
 * @param {boolean} props.isOpen - Indica si el modal está visible.
 * @param {Function} props.onClose - Función que cierra el modal sin realizar cambios.
 * @param {Function} props.onConfirm - Función que ejecuta la acción de activación/desactivación.
 * @param {Object} props.sucursal - Objeto con los datos de la sucursal seleccionada.
 * @param {boolean} props.isLoading - Indica si se está procesando la acción.
 *
 * @example
 * <ConfirmToggleSucursalModal
 *   isOpen={modalOpen}
 *   onClose={() => setModalOpen(false)}
 *   onConfirm={handleToggleStatus}
 *   sucursal={selectedSucursal}
 *   isLoading={isSubmitting}
 * />
 */
function ConfirmToggleSucursalModal({ isOpen, onClose, onConfirm, sucursal, isLoading }) {
  if (!isOpen || !sucursal) return null;

  const action = sucursal.activo ? 'desactivar' : 'activar';
  const actionCapitalized = sucursal.activo ? 'Desactivar' : 'Activar';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              sucursal.activo ? 'bg-red-100' : 'bg-green-100'
            }`}>
              <svg
                className={`w-6 h-6 ${sucursal.activo ? 'text-red-600' : 'text-green-600'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {sucursal.activo ? (
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
                ¿{actionCapitalized} Sucursal?
              </h2>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-gray-600 mb-4">
            ¿Estás seguro de {action} la sucursal:
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="font-semibold text-gray-900">{sucursal.nombreSucursal}</p>
            <p className="text-sm text-gray-600">{sucursal.direccion}</p>
            {sucursal.categoria && (
              <p className="text-sm text-gray-500 mt-1">
                Categoría: {sucursal.categoria}
              </p>
            )}
          </div>
          
          {sucursal.activo ? (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-sm text-amber-800 font-semibold">Importante:</p>
              <ul className="text-sm text-amber-700 mt-2 space-y-1 list-disc list-inside">
                <li>La sucursal no será visible en el mapa.</li>
                <li>Todas las promociones activas se desactivarán automáticamente.</li>
                <li>Los beneficiarios no podrán canjear descuentos aquí.</li>
              </ul>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm text-green-800 font-semibold">Al reactivar:</p>
              <ul className="text-sm text-green-700 mt-2 space-y-1 list-disc list-inside">
                <li>La sucursal volverá a ser visible en el mapa.</li>
                <li>Las promociones deberán reactivarse manualmente.</li>
              </ul>
            </div>
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
              sucursal.activo 
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

export default ConfirmToggleSucursalModal;
