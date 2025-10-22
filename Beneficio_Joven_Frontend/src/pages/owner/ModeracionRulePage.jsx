import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AdminNavbar from '../../components/common/AdminNavbar';
import { ownerGetModerationRule, ownerUpdateModerationRule } from '../../api/services/owner-api';

export default function ModeracionRulePage() {
  const { idEstablecimiento } = useParams();
  const [rule, setRule] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    (async () => {
      const r = await ownerGetModerationRule(idEstablecimiento);
      if (r.success) setRule(r.data);
    })();
  }, [idEstablecimiento]);

  const toggle = (name) => setRule((s) => ({ ...s, [name]: s[name] ? 0 : 1 }));

  const save = async () => {
    setSaving(true);
    const r = await ownerUpdateModerationRule(idEstablecimiento, rule);
    setSaving(false);
    setMsg(r.success ? 'Guardado' : (r.message || 'Error'));
    setTimeout(() => setMsg(''), 2500);
  };

  if (!rule) return <div className="p-6">Cargando...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <AdminNavbar />
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <h1 className="text-2xl font-bold">Moderación del establecimiento #{idEstablecimiento}</h1>

        <div className="bg-white p-6 rounded shadow space-y-4">
          <label className="flex items-center gap-3">
            <input type="checkbox" checked={!!rule.requireCouponApproval} onChange={() => toggle('requireCouponApproval')} />
            <span>Requerir aprobación para <b>promociones</b></span>
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" checked={!!rule.requireProfileApproval} onChange={() => toggle('requireProfileApproval')} />
            <span>Requerir aprobación para <b>perfil</b> (logo, textos, imágenes)</span>
          </label>

          <div className="flex justify-end">
            <button onClick={save} disabled={saving} className="px-4 py-2 rounded bg-purple-600 text-white">
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
          {msg && <div className="text-sm text-gray-600">{msg}</div>}
        </div>
      </div>
    </div>
  );
}
