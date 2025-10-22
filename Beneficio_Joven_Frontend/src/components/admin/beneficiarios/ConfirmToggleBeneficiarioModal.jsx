/**
 * @file ConfirmToggleBeneficiarioModal.jsx
 * @description Modal de confirmación para activar o desactivar beneficiarios en el panel de administración.
 * Replica el estilo visual del modal de dueños para mantener consistencia.
 */

export default function ConfirmToggleBeneficiarioModal({
  isOpen,
  onClose,
  onConfirm,
  beneficiario,
  isLoading,
}) {
  if (!isOpen || !beneficiario) return null;

  const isActive = beneficiario.activo;
  const action = isActive ? "desactivar" : "activar";
  const actionCapitalized = isActive ? "Desactivar" : "Activar";

  const nombreCompleto = [
    beneficiario.primerNombre,
    beneficiario.segundoNombre,
    beneficiario.apellidoPaterno,
    beneficiario.apellidoMaterno,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                isActive ? "bg-red-100" : "bg-green-100"
              }`}
            >
              <svg
                className={`w-6 h-6 ${
                  isActive ? "text-red-600" : "text-green-600"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isActive ? (
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
                ¿{actionCapitalized} Beneficiario?
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
            <p className="font-semibold text-gray-900">
              {nombreCompleto || `#${beneficiario.idBeneficiario}`}
            </p>
            <p className="text-sm text-gray-600">{beneficiario.email}</p>
            {beneficiario.curp && (
              <p className="text-sm text-gray-500 mt-1">{beneficiario.curp}</p>
            )}
          </div>

          {isActive ? (
            <p className="text-sm text-amber-700">
              Importante: el beneficiario no podrá iniciar sesión hasta que sea
              reactivado.
            </p>
          ) : (
            <p className="text-sm text-green-700">
              Al reactivarlo, el beneficiario podrá usar nuevamente su cuenta.
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
              isActive
                ? "bg-red-600 hover:bg-red-700"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {isLoading ? "Procesando..." : `Sí, ${actionCapitalized}`}
          </button>
        </div>
      </div>
    </div>
  );
}

