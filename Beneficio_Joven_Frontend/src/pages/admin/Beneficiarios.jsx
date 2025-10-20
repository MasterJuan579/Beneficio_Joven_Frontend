/**
 * @file Beneficiarios.jsx
 * @description Listado, búsqueda, creación, importación CSV y toggle de beneficiarios.
 */
import { useEffect, useMemo, useState } from 'react';
import AdminNavbar from '../../components/common/AdminNavbar';
import ToggleSwitch from '../../components/common/ToggleSwitch';
import Papa from 'papaparse';

import {
  getBeneficiarios,
  toggleBeneficiarioStatus
} from '../../api/services/admin-api-requests/beneficiarios';

import AddBeneficiarioModal from '../../components/admin/beneficiarios/AddBeneficiarioModal';
import ImportBeneficiariosModal from '../../components/admin/beneficiarios/ImportBeneficiariosModal';
import ConfirmToggleBeneficiarioModal from '../../components/admin/beneficiarios/ConfirmToggleBeneficiarioModal';

export default function Beneficiarios() {
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [showInactive, setShowInactive] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [toggling, setToggling] = useState(false);

  const [addOpen, setAddOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);

  // fetch
  const fetchData = async () => {
    setLoading(true);
    setErr('');
    const res = await getBeneficiarios({ query: q, showInactive });
    if (res.success) {
      setRows(Array.isArray(res.data) ? res.data : []);
    } else {
      setErr(res.message || 'No se pudo cargar la lista');
      setRows([]);
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); /* eslint-disable-next-line */ }, [q, showInactive]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter(r =>
      [r.primerNombre, r.segundoNombre, r.apellidoPaterno, r.apellidoMaterno, r.email, r.curp, r.folio]
        .filter(Boolean)
        .some(v => String(v).toLowerCase().includes(s))
    );
  }, [rows, q]);

  const onToggleClick = (b) => {
    setSelected(b);
    setConfirmOpen(true);
  };

  const onConfirmToggle = async () => {
    if (!selected) return;
    setToggling(true);
    const res = await toggleBeneficiarioStatus(selected.idBeneficiario);
    if (!res.success) {
      alert(res.message || 'No se pudo cambiar el estado');
    }
    setToggling(false);
    setConfirmOpen(false);
    setSelected(null);
    fetchData();
  };

  const handleExportCSV = () => {
    const dataToExport = rows.map((b) => ({
      ID: b.idBeneficiario,
      Nombre: [b.primerNombre, b.segundoNombre, b.apellidoPaterno, b.apellidoMaterno].filter(Boolean).join(' '),
      CURP: b.curp,
      Email: b.email,
      Folio: b.folio,
      'Fecha Registro': b.fechaRegistro ? new Date(b.fechaRegistro).toLocaleString('es-MX') : '',
      Activo: b.activo ? 'Sí' : 'No',
    }));
    const csv = Papa.unparse(dataToExport, { quotes: true, header: true });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `beneficiarios_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Beneficiarios</h1>
            <p className="text-gray-600">Consulta, busca, crea, importa y exporta el padrón.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setAddOpen(true)}
              className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg font-medium"
            >
              + Nuevo
            </button>
            <button
              onClick={() => setImportOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium"
            >
              Importar CSV
            </button>
            <button
              onClick={handleExportCSV}
              disabled={rows.length === 0}
              className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Exportar CSV
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <div className="relative flex-1 max-w-md">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar por nombre, CURP, email, folio…"
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 10-14 0 7 7 0 0014 0z" />
              </svg>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setQ('')}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 font-medium"
              >
                Limpiar
              </button>
              <button
                onClick={() => setShowInactive(v => !v)}
                className={`px-4 py-2 rounded-lg font-medium border ${
                  showInactive ? 'bg-violet-600 text-white border-violet-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {showInactive ? 'Ver Solo Activos' : 'Ver Inactivos'}
              </button>
            </div>
          </div>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8">
              <div className="animate-pulse space-y-4">
                {[1,2,3,4].map(i => <div key={i} className="h-16 bg-gray-200 rounded" />)}
              </div>
            </div>
          ) : err ? (
            <div className="p-6 text-red-700 bg-red-50 border border-red-200">{err}</div>
          ) : filtered.length === 0 ? (
            <div className="p-6 text-gray-600">Sin resultados</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-left">
                    <th className="px-6 py-3">Nombre</th>
                    <th className="px-6 py-3">CURP</th>
                    <th className="px-6 py-3">Email</th>
                    <th className="px-6 py-3">Folio</th>
                    <th className="px-6 py-3">Registro</th>
                    <th className="px-6 py-3">Activo</th>
                    <th className="px-6 py-3">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filtered.map(b => (
                    <tr key={b.idBeneficiario} className="hover:bg-gray-50">
                      <td className="px-6 py-3">
                        {[b.primerNombre, b.segundoNombre, b.apellidoPaterno, b.apellidoMaterno].filter(Boolean).join(' ')}
                      </td>
                      <td className="px-6 py-3">{b.curp}</td>
                      <td className="px-6 py-3">{b.email}</td>
                      <td className="px-6 py-3">{b.folio}</td>
                      <td className="px-6 py-3">{b.fechaRegistro ? new Date(b.fechaRegistro).toLocaleString('es-MX') : ''}</td>
                      <td className="px-6 py-3">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          b.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {b.activo ? 'Sí' : 'No'}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <ToggleSwitch isActive={!!b.activo} onToggle={() => onToggleClick(b)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modales */}
      <AddBeneficiarioModal
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        onCreated={fetchData}
      />
      <ImportBeneficiariosModal
        isOpen={importOpen}
        onClose={() => setImportOpen(false)}
        onImported={fetchData}
      />
      <ConfirmToggleBeneficiarioModal
        isOpen={confirmOpen}
        onClose={() => { setConfirmOpen(false); setSelected(null); }}
        onConfirm={onConfirmToggle}
        beneficiario={selected}
        isLoading={toggling}
      />
    </div>
  );
}
