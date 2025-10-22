import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ownerGetBranch, ownerListPromosByBranch } from '../../api/services/owner-api';
import AdminNavbar from '../../components/common/AdminNavbar';

export default function SucursalDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const [sucursal, setSucursal] = useState(null);
  const [promos, setPromos] = useState([]);
  const [err, setErr] = useState('');

  useEffect(() => {
    (async () => {
      const a = await ownerGetBranch(id);
      if (!a.success) return setErr(a.message);
      setSucursal(a.data);
      const p = await ownerListPromosByBranch(id);
      if (p.success) setPromos(p.data);
    })();
  }, [id]);

  if (err) return <div className="p-4 text-red-600">{err}</div>;
  if (!sucursal) return <div className="p-4">Cargando...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <AdminNavbar />
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <button onClick={() => nav(-1)} className="text-sm text-gray-600">&larr; Volver</button>

        <div className="bg-white rounded shadow p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">{sucursal.nombre}</h1>
            <Link to={`/editar-sucursal/${id}`} className="px-3 py-1 rounded bg-gray-100 text-sm">Editar datos</Link>
          </div>
          <div className="text-gray-700 mt-2">{sucursal.direccion}</div>
          {sucursal.latitud && sucursal.longitud && (
            <div className="text-xs text-gray-500 mt-1">
              {Number(sucursal.latitud).toFixed(6)}, {Number(sucursal.longitud).toFixed(6)}
            </div>
          )}
        </div>

        <div className="bg-white rounded shadow p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Promociones</h2>
            <Link to={`/owner/sucursales/${id}/promos/nueva`} className="px-3 py-1 rounded bg-purple-600 text-white">Nueva promo</Link>
          </div>

          {promos.length === 0 ? (
            <div className="text-gray-500 text-sm">No hay promociones todavía.</div>
          ) : (
            <ul className="divide-y">
              {promos.map(p => (
                <li key={p.idPromocion} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-medium">{p.titulo}</div>
                    <div className="text-xs text-gray-500">
                      Estado: {p.status} · Canjes: {p.redeemedCount}
                      {p.validFrom && ` · Desde ${p.validFrom}`}
                      {p.validTo && ` · Hasta ${p.validTo}`}
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${p.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {p.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
