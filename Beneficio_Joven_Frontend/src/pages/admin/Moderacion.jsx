/**
 * @file Moderacion.jsx
 * @description Bandeja de moderación (cola + reglas básicas).
 */

import { useEffect, useState } from "react";
import AdminNavbar from "../../components/common/AdminNavbar";
import axiosInstance from "../../api/interceptors/authInterceptor";


export default function Moderacion() {
  const [queue, setQueue] = useState([]);
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setErr("");
      try {
        // Sugeridos:
        // GET /admin/moderacion/queue  |  GET /admin/moderacion/rules
        const [qRes, rRes] = await Promise.allSettled([
          axiosInstance.get("/admin/moderacion/queue"),
          axiosInstance.get("/admin/moderacion/rules"),
        ]);
        if (!alive) return;
        if (qRes.status === "fulfilled") setQueue(Array.isArray(qRes.value?.data?.data) ? qRes.value.data.data : []);
        if (rRes.status === "fulfilled") setRules(Array.isArray(rRes.value?.data?.data) ? rRes.value.data.data : []);
      } catch (e) {
        if (!alive) return;
        setErr(e?.response?.data?.message || "No se pudo cargar moderación");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-2">Moderación</h1>
        <p className="text-gray-600 mb-6">Revisa solicitudes pendientes y reglas por establecimiento.</p>

        {loading && <div className="py-10">Cargando…</div>}
        {!loading && err && <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">{err}</div>}

        {!loading && !err && (
          <>
            <section className="mb-8">
              <h2 className="font-semibold mb-3">Cola de revisión</h2>
              <div className="overflow-auto rounded-xl border bg-white">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr className="text-left">
                      <th className="px-4 py-3">ID</th>
                      <th className="px-4 py-3">Entidad</th>
                      <th className="px-4 py-3">Acción</th>
                      <th className="px-4 py-3">Estado</th>
                      <th className="px-4 py-3">Enviado por</th>
                      <th className="px-4 py-3">Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {queue.map((q) => (
                      <tr key={q.id} className="border-t">
                        <td className="px-4 py-3">{q.id}</td>
                        <td className="px-4 py-3">{q.entityType} #{q.entityId ?? "—"}</td>
                        <td className="px-4 py-3">{q.action}</td>
                        <td className="px-4 py-3">{q.status}</td>
                        <td className="px-4 py-3">{q.submittedBy}</td>
                        <td className="px-4 py-3">{new Date(q.created_at).toLocaleString()}</td>
                      </tr>
                    ))}
                    {queue.length === 0 && (
                      <tr><td className="px-4 py-6 text-gray-500" colSpan={6}>No hay pendientes</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="font-semibold mb-3">Reglas por Establecimiento</h2>
              <div className="overflow-auto rounded-xl border bg-white">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr className="text-left">
                      <th className="px-4 py-3">Establecimiento</th>
                      <th className="px-4 py-3">Aprueba Cupón</th>
                      <th className="px-4 py-3">Aprueba Perfil</th>
                      <th className="px-4 py-3">Creado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rules.map((r) => (
                      <tr key={r.idEstablecimiento} className="border-t">
                        <td className="px-4 py-3">{r.idEstablecimiento}</td>
                        <td className="px-4 py-3">{r.requireCouponApproval ? "Sí" : "No"}</td>
                        <td className="px-4 py-3">{r.requireProfileApproval ? "Sí" : "No"}</td>
                        <td className="px-4 py-3">{new Date(r.created_at).toLocaleString()}</td>
                      </tr>
                    ))}
                    {rules.length === 0 && (
                      <tr><td className="px-4 py-6 text-gray-500" colSpan={4}>Sin reglas configuradas</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
