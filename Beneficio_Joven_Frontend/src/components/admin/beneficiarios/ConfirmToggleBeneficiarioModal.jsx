export default function ConfirmToggleBeneficiarioModal({ isOpen, onClose, onConfirm, beneficiario, isLoading }) {
  if (!isOpen || !beneficiario) return null;
  const nombre = [beneficiario.primerNombre, beneficiario.segundoNombre, beneficiario.apellidoPaterno, beneficiario.apellidoMaterno].filter(Boolean).join(' ');
  const goingTo = beneficiario.activo ? 'desactivar' : 'activar';

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">Confirmar</h3>
        </div>
        <div className="p-6">
          <p>¿Seguro que deseas <b>{goingTo}</b> a <b>{nombre || `#${beneficiario.idBeneficiario}`}</b>?</p>
        </div>
        <div className="p-4 border-t flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border">Cancelar</button>
          <button onClick={onConfirm} disabled={isLoading} className="px-4 py-2 rounded-lg bg-violet-600 text-white disabled:opacity-50">
            {isLoading ? 'Aplicando…' : 'Sí, confirmar'}
          </button>
        </div>
      </div>
    </div>
  );
}
