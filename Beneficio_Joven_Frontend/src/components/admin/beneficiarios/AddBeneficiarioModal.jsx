import { useState } from 'react';
import { createBeneficiario } from '../../../api/services/admin-api-requests/beneficiarios';

export default function AddBeneficiarioModal({ isOpen, onClose, onCreated }) {
  const [form, setForm] = useState({
    primerNombre: '',
    segundoNombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    curp: '',
    email: '',
    celular: '',
    fechaNacimiento: '',
    sexo: '',
    folio: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState('');

  if (!isOpen) return null;

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErr('');
    const res = await createBeneficiario(form);
    setSubmitting(false);
    if (!res.success) {
      setErr(res.message || 'No se pudo crear');
      return;
    }
    onClose();
    onCreated?.();
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold">Nuevo Beneficiario</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        <form onSubmit={onSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="primerNombre" value={form.primerNombre} onChange={onChange} placeholder="Primer nombre *" className="input" required />
          <input name="segundoNombre" value={form.segundoNombre} onChange={onChange} placeholder="Segundo nombre" className="input" />
          <input name="apellidoPaterno" value={form.apellidoPaterno} onChange={onChange} placeholder="Apellido paterno *" className="input" required />
          <input name="apellidoMaterno" value={form.apellidoMaterno} onChange={onChange} placeholder="Apellido materno *" className="input" required />
          <input name="curp" value={form.curp} onChange={onChange} placeholder="CURP *" className="input" required />
          <input type="email" name="email" value={form.email} onChange={onChange} placeholder="Email *" className="input" required />
          <input name="celular" value={form.celular} onChange={onChange} placeholder="Celular *" className="input" required />
          <input type="date" name="fechaNacimiento" value={form.fechaNacimiento} onChange={onChange} className="input" required />
          <select name="sexo" value={form.sexo} onChange={onChange} className="input">
            <option value="">Sexo (opcional)</option>
            <option value="M">M</option>
            <option value="F">F</option>
            <option value="H">H</option>
          </select>
          <input name="folio" value={form.folio} onChange={onChange} placeholder="Folio (opcional)" className="input" />
          {err && <div className="md:col-span-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">{err}</div>}
          <div className="md:col-span-2 flex justify-end gap-2 mt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border">Cancelar</button>
            <button disabled={submitting} className="px-4 py-2 rounded-lg bg-violet-600 text-white disabled:opacity-50">
              {submitting ? 'Guardando…' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
      {/* estilos tailwind helper */}
      <style>{`.input{ @apply w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500; }`}</style>
    </div>
  );
}
