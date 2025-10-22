import { useEffect, useState } from 'react';
import AdminNavbar from '../../components/common/AdminNavbar';
import { ownerGetMyBranches } from '../../api/services/owner-api';

export default function OwnerDashboard() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const r = await ownerGetMyBranches();
      if (r.success) setBranches(r.data);
      setLoading(false);
    })();
  }, []);

  const totalPromos = branches.reduce((acc, b) => acc + (b.promosActivas || 0), 0);
  const totalRedemptions = branches.reduce((acc, b) => acc + (b.redemptions || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <AdminNavbar />
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <h1 className="text-2xl font-bold">Panel de comercio</h1>

        {loading ? <div>Cargando...</div> :
        <>
          <div className="grid md:grid-cols-3 gap-4">
            <Stat title="Sucursales" value={branches.length} />
            <Stat title="Promos activas" value={totalPromos} />
            <Stat title="Canjes totales" value={totalRedemptions} />
          </div>

          <div className="bg-white p-6 rounded shadow">
            <h2 className="font-semibold mb-3">Sucursales</h2>
            <ul className="divide-y">
              {branches.map(b => (
                <li key={b.idSucursal} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-medium">{b.nombre}</div>
                    <div className="text-xs text-gray-500">{b.direccion}</div>
                  </div>
                  <div className="text-xs text-gray-600">
                    Promos: {b.promosActivas || 0} · Canjes: {b.redemptions || 0}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </>}
      </div>
    </div>
  );
}

function Stat({ title, value }) {
  return (
    <div className="bg-white rounded shadow p-5">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-3xl font-bold">{value}</div>
    </div>
  );
}
