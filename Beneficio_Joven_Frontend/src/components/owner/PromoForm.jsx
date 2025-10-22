import { useState, useEffect } from 'react';

const empty = {
  titulo: '',
  descripcion: '',
  discountType: 'PORCENTAJE',
  discountValue: 0,
  unlimited: 1,
  limitQuantity: null,
  validFrom: '',
  validTo: '',
  idCategoriaCupon: null,
};

export default function PromoForm({ onSubmit, initial = empty, moderationRule }) {
  const [form, setForm] = useState({ ...empty, ...initial });
  const [error, setError] = useState('');

  useEffect(() => setForm({ ...empty, ...initial }), [initial]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((s) => ({
      ...s,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
    }));
    if (error) setError('');
  };

  const validate = () => {
    if (!form.titulo.trim()) return 'Título requerido';
    if (!form.descripcion.trim()) return 'Descripción requerida';
    if (form.discountType === 'PORCENTAJE' && (form.discountValue < 0 || form.discountValue > 100))
      return 'Porcentaje entre 0 y 100';
    if (form.discountType === 'MONTO' && Number(form.discountValue) <= 0)
      return 'El monto debe ser mayor a 0';
    if (form.unlimited === 0 && (!form.limitQuantity || Number(form.limitQuantity) <= 0))
      return 'Especifica un límite válido';
    if (form.validFrom && form.validTo && form.validFrom > form.validTo)
      return 'Rango de fechas inválido';
    return '';
  };

  const submit = (e) => {
    e.preventDefault();
    const msg = validate();
    if (msg) return setError(msg);

    const payload = {
      ...form,
      // normaliza valores
      discountValue: Number(form.discountValue),
      limitQuantity: form.unlimited ? null : Number(form.limitQuantity),
      validFrom: form.validFrom || null,
      validTo: form.validTo || null,
    };
    onSubmit(payload);
  };

  const showCouponApprovalBanner = moderationRule?.requireCouponApproval === 1;

  return (
    <form onSubmit={submit} className="space-y-6">
      {showCouponApprovalBanner && (
        <div className="p-3 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-sm">
          Esta operación requiere **aprobación del administrador**. La promo quedará en estado <b>PENDING</b> hasta que se autorice.
        </div>
      )}

      {error && (
        <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">Título *</label>
        <input
          name="titulo"
          value={form.titulo}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2"
          placeholder="Ej. 20% en snacks"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Descripción *</label>
        <textarea
          name="descripcion"
          value={form.descripcion}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2"
          rows={4}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Tipo de descuento</label>
          <select name="discountType" value={form.discountType} onChange={handleChange} className="w-full border rounded-lg px-3 py-2">
            <option value="PORCENTAJE">Porcentaje</option>
            <option value="MONTO">Monto</option>
            <option value="OTRO">Otro</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Valor</label>
          <input
            type="number"
            step="0.01"
            name="discountValue"
            value={form.discountValue}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>
        <div className="flex items-end gap-2">
          <input id="unlimited" type="checkbox" name="unlimited" checked={form.unlimited === 1} onChange={handleChange} />
          <label htmlFor="unlimited" className="text-sm">Ilimitada</label>
        </div>
      </div>

      {form.unlimited === 0 && (
        <div>
          <label className="block text-sm font-medium mb-1">Límite total</label>
          <input
            type="number"
            name="limitQuantity"
            value={form.limitQuantity ?? ''}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Ej. 100"
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Vigencia desde</label>
          <input type="datetime-local" name="validFrom" value={form.validFrom} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Vigencia hasta</label>
          <input type="datetime-local" name="validTo" value={form.validTo} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button type="submit" className="px-5 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700">Guardar</button>
      </div>
    </form>
  );
}
