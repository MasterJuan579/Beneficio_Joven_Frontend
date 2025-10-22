/**
 * @file Beneficiarios.jsx
 * @description Página de administración para gestionar beneficiarios.
 * Permite buscar, crear, importar, exportar CSV y activar/desactivar beneficiarios
 * con un diseño unificado al de Gestión de Dueños.
 *
 * @module pages/admin/Beneficiarios
 * @version 2.0.0
 */

import { useEffect, useMemo, useState } from "react";
import Papa from "papaparse";

import {
  getBeneficiarios,
  toggleBeneficiarioStatus,
} from "../../api/services/admin-api-requests/beneficiarios";

import AddBeneficiarioModal from "../../components/admin/beneficiarios/AddBeneficiarioModal";
import ImportBeneficiariosModal from "../../components/admin/beneficiarios/ImportBeneficiariosModal";
import ConfirmToggleBeneficiarioModal from "../../components/admin/beneficiarios/ConfirmToggleBeneficiarioModal";
import ToggleSwitch from "../../components/common/ToggleSwitch";

function Beneficiarios() {
  // Estados principales
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [showInactive, setShowInactive] = useState(false);

  // Estados de modales
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [toggling, setToggling] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);

  /**
   * Carga inicial de beneficiarios
   */
  const fetchData = async () => {
    setLoading(true);
    setErr("");
    const res = await getBeneficiarios({ query: q, showInactive });

    if (res.success) {
      setRows(Array.isArray(res.data) ? res.data : []);
    } else {
      setErr(res.message || "No se pudo cargar la lista");
      setRows([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, showInactive]);

  /**
   * Filtrado local de beneficiarios
   */
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter((r) =>
      [
        r.primerNombre,
        r.segundoNombre,
        r.apellidoPaterno,
        r.apellidoMaterno,
        r.email,
        r.curp,
        r.folio,
      ]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(s))
    );
  }, [rows, q]);

  /**
   * Exportar beneficiarios a CSV
   */
  const handleExportCSV = () => {
    const dataToExport = rows.map((b) => ({
      ID: b.idBeneficiario,
      Nombre: [
        b.primerNombre,
        b.segundoNombre,
        b.apellidoPaterno,
        b.apellidoMaterno,
      ]
        .filter(Boolean)
        .join(" "),
      CURP: b.curp,
      Email: b.email,
      Folio: b.folio,
      "Fecha Registro": b.fechaRegistro
        ? new Date(b.fechaRegistro).toLocaleString("es-MX")
        : "",
      Activo: b.activo ? "Sí" : "No",
    }));

    const csv = Papa.unparse(dataToExport, { quotes: true, header: true });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `beneficiarios_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /**
   * Abre el modal de confirmación
   */
  const onToggleClick = (b) => {
    setSelected(b);
    setConfirmOpen(true);
  };

  /**
   * Confirma el cambio de estado
   */
  const onConfirmToggle = async () => {
    if (!selected) return;
    setToggling(true);
    const res = await toggleBeneficiarioStatus(selected.idBeneficiario);
    if (!res.success) alert(res.message || "No se pudo cambiar el estado");
    setToggling(false);
    setConfirmOpen(false);
    setSelected(null);
    fetchData();
  };

  // ==============================
  // UI Principal
  // ==============================
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Título */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Gestión de Beneficiarios
        </h1>

        {/* Barra de acciones */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Búsqueda */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Buscar por nombre, CURP, email, folio..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              />
              <svg
                className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 10-14 0 7 7 0 0014 0z"
                />
              </svg>
            </div>

            {/* Botones */}
            <div className="flex gap-3">
              <button
                onClick={() => setAddOpen(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Nuevo Beneficiario
              </button>

              <button
                onClick={() => setImportOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v16h16M4 8h16"
                  />
                </svg>
                Importar CSV
              </button>

              <button
                onClick={handleExportCSV}
                disabled={rows.length === 0}
                className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Exportar CSV
              </button>

              <button
                onClick={() => setShowInactive(!showInactive)}
                className={`border px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
                  showInactive
                    ? "bg-purple-600 text-white border-purple-600"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                {showInactive ? "Ver Solo Activos" : "Ver Inactivos"}
              </button>
            </div>
          </div>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="p-8">
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          ) : err ? (
            <div className="p-6 text-red-700 bg-red-50 border border-red-200">
              {err}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No se encontraron beneficiarios</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      CURP
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Folio
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Registro
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                  {filtered.map((b) => (
                    <tr key={b.idBeneficiario} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {[b.primerNombre, b.segundoNombre, b.apellidoPaterno, b.apellidoMaterno]
                          .filter(Boolean)
                          .join(" ")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {b.curp}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {b.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {b.folio}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {b.fechaRegistro
                          ? new Date(b.fechaRegistro).toLocaleString("es-MX")
                          : ""}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            b.activo
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {b.activo ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-3">
                          <ToggleSwitch
                            isActive={!!b.activo}
                            onToggle={() => onToggleClick(b)}
                          />
                        </div>
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
        onClose={() => {
          setConfirmOpen(false);
          setSelected(null);
        }}
        onConfirm={onConfirmToggle}
        beneficiario={selected}
        isLoading={toggling}
      />
    </div>
  );
}

export default Beneficiarios;
