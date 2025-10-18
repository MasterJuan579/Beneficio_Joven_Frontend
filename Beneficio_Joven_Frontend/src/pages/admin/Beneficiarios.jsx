/**
 * @file Beneficiarios.jsx
 * @description Listado y búsqueda de beneficiarios.
 */
import { useEffect, useState, useMemo } from "react";
import AdminNavbar from "../../components/common/AdminNavbar";
import axiosInstance from "../../api/interceptors/authInterceptor";

export default function Beneficiarios() {
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setErr("");
      try {
        // Endpoint sugerido del backend (ajústalo si difiere):
        // GET /admin/beneficiarios?query=...
        const { data } = await axiosInstance.get("/admin/beneficiarios", {
          params: q ? { query: q } : {},
        });
        if (!alive) return;
        setRows(Array.isArray(data?.data) ? data.data : []);
      } catch (e) {
        console.warn("Beneficiarios fetch error:", e?.response?.data || e?.message);
        if (!alive) return;
        setErr(e?.response?.data?.message || "No se pudo cargar la lista");
        setRows([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [q]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter(r =>
      [r.primerNombre, r.apellidoPaterno, r.apellidoMaterno, r.email, r.curp, r.folio]
        .filter(Boolean).some(v => String(v).toLowerCase().includes(s))
    );
  }, [rows, q]);

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">Beneficiarios</h1>
        <p className="text-gray-600 mb-4">Consulta, busca y exporta el padrón.</p>

        <div className="flex items-center gap-2 mb-4">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por nombre, CURP, email, folio…"
            className="w-full md:w-96 px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
          <button
            onClick={() => setQ("")}
            className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 font-semibold"
          >
            Limpiar
          </button>
        </div>

        {loading && <div className="py-12">Cargando…</div>}
        {!loading && err && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">{err}</div>
        )}

        {!loading && !err && (
          <div className="overflow-auto rounded-xl border border-gray-200 bg-white">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left">
                  <th className="px-4 py-3">Nombre</th>
                  <th className="px-4 py-3">CURP</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Folio</th>
                  <th className="px-4 py-3">Registro</th>
                  <th className="px-4 py-3">Activo</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b) => (
                  <tr key={b.idBeneficiario} className="border-t">
                    <td className="px-4 py-3">
                      {b.primerNombre} {b.segundoNombre || ""} {b.apellidoPaterno} {b.apellidoMaterno}
                    </td>
                    <td className="px-4 py-3">{b.curp}</td>
                    <td className="px-4 py-3">{b.email}</td>
                    <td className="px-4 py-3">{b.folio}</td>
                    <td className="px-4 py-3">{new Date(b.fechaRegistro).toLocaleString()}</td>
                    <td className="px-4 py-3">{String(b.activo ? "Sí" : "No")}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td className="px-4 py-6 text-gray-500" colSpan={6}>Sin resultados</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
