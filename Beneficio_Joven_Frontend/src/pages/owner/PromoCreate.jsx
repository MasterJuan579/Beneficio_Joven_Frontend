import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminNavbar from '../../components/common/AdminNavbar';
import PromoForm from '../../components/owner/PromoForm';
import { ownerCreatePromoForBranch, ownerGetBranch, ownerGetModerationRule } from '../../api/services/owner-api';

export default function PromoCreate() {
  const { id } = useParams(); // idSucursal
  const nav = useNavigate();
  const [rule, setRule] = useState(null);
  const [branch, setBranch] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const b = await ownerGetBranch(id);
      if (b.success) setBranch(b.data);
      const r = await ownerGetModerationRule(b?.data?.idEstablecimiento || b?.data?.id_establecimiento || b?.data?.idEstablecimiento);
      if (r.success) setRule(r.data);
    })();
  }, [id]);

  const handleCreate = async (payload) => {
    setSaving(true);
    const res = await ownerCreatePromoForBranch(id, payload);
    setSaving(false);
    if (!res.success) return setError(res.message);
    // si hay moderación, backend devolverá status PENDING
    nav(`/owner/sucursales/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <AdminNavbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <button onClick={() => nav(-1)} className="text-sm text-gray-600 mb-4">&larr; Volver</button>
        <h1 className="text-2xl font-bold mb-2">Nueva promoción</h1>
        {branch && <p className="text-gray-600 mb-6">Sucursal: <b>{branch.nombre}</b></p>}

        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}

        <PromoForm onSubmit={handleCreate} moderationRule={rule} />
        {saving && <div className="mt-4 text-sm text-gray-500">Guardando...</div>}
      </div>
    </div>
  );
}
