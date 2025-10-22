import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ownerGetMyBranches } from '../../api/services/owner-api';
import AdminNavbar from '../../components/common/AdminNavbar'; // reutilizamos barra

export default function SucursalesList() {
  const nav = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    (async () => {
      const res = await ownerGetMyBranches();
      if (res.success) setRows(res.data);
      else setErr(res.message);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <AdminNavbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Mis sucursales</h1>
        {loading ? <div>Cargando...</div> :
        err ? <div className="text-red-600">{err}</div> :
        <div className="grid md:grid-cols-2 gap-4">
          {rows.map(s => (
            <div key={s.idSucursal} className="bg-white rounded-lg shadow p-4">
              <div className="font-semibold">{s.nombre}</div>
              <div className="text-sm text-gray-600">{s.direccion}</div>
              <div className="mt-3 flex gap-2">
                <button className="px-3 py-1 text-sm rounded bg-gray-100" onClick={() => nav(`/owner/sucursales/${s.idSucursal}`)}>Ver</button>
                <button className="px-3 py-1 text-sm rounded bg-purple-600 text-white" onClick={() => nav(`/owner/sucursales/${s.idSucursal}/promos/nueva`)}>Nueva promo</button>
              </div>
            </div>
          ))}
        </div>}
      </div>
    </div>
  );
}
