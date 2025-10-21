/**
 * @file Moderacion.jsx
 * @description Bandeja de moderación (cola + reglas básicas).
 */

import { useEffect, useState } from "react";
import axiosInstance from "../../api/interceptors/authInterceptor";

const safeDateTime = (v) => {
  const d = new Date(v);
  return isNaN(d.getTime()) ? "—" : d.toLocaleString("es-MX");
};

const StatusBadge = ({ value }) => {
  const map = {
    PENDING: "bg-amber-100 text-amber-800 border-amber-200",
    APPROVED: "bg-green-100 text-green-800 border-green-200",
    REJECTED: "bg-red-100 text-red-800 border-red-200",
    PAUSED: "bg-purple-100 text-purple-800 border-purple-200",
  };
  const cls = map[value] || "bg-gray-100 text-gray-800 border-gray-200";
  return (
    <span className={`inline-block text-xs px-2 py-0.5 rounded-full border ${cls}`}>
      {value || "—"}
    </span>
  );
};

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
        // GET /admin/moderacion/queue  |  GET /admin/moderacion/rules
        const [qRes, rRes] = await Promise.allSettled([
          axiosInstance.get("/admin/moderacion/queue"),
          axiosInstance.get("/admin/moderacion/rules"),
        ]);
        if (!alive) return;

        if (qRes.status === "fulfilled") {
          const q = qRes.value?.data;
          const list = Array.isArray(q?.data) ? q.data : (Array.isArray(q) ? q : []);
          setQueue(list);
        } else {
          setQueue([]);
        }

        if (rRes.status === "fulfilled") {
          const r = rRes.value?.data;
          const list = Array.isArray(r?.data) ? r.data : (Array.isArray(r) ? r : []);
          setRules(list);
        } else {
          setRules([]);
        }

        if (qRes.status === "rejected" && rRes.status === "rejected") {
          setErr("No se pudo cargar moderación");
        }
      } catch (e) {
        if (!alive) return;
        setErr(e?.response?.data?.message || "No se pudo cargar moderación");
        setQueue([]);
        setRules([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-2">Moderación</h1>
        <p className="text-gray-600 mb-6">Revisa solicitudes pendientes y reglas por establecimiento.</p>

        {loading && (
          <div className="py-8">
            <div className="animate-pulse space-y-3">
              <div className="h-6 bg-gray-200 rounded w-1/3" />
              <div className="h-32 bg-gray-200 rounded" />
            </div>
          </div>
        )}

        {!loading && err && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
            {err}
          </div>
        )}

        {!loading && !err && (
          <>
            {/* Cola */}
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
                  <tbody className="divide-y">
                    {queue.map((q) => (
                      <tr key={q.id ?? `${q.entityType}-${q.entityId}-${q.created_at}`}>
                        <td className="px-4 py-3">{q.id ?? "—"}</td>
                        <td className="px-4 py-3">{q.entityType} {q.entityId ? `#${q.entityId}` : "—"}</td>
                        <td className="px-4 py-3">{q.action || "—"}</td>
                        <td className="px-4 py-3"><StatusBadge value={q.status} /></td>
                        <td className="px-4 py-3">{q.submittedBy || "—"}</td>
                        <td className="px-4 py-3">{safeDateTime(q.created_at || q.createdAt)}</td>
                      </tr>
                    ))}
                    {queue.length === 0 && (
                      <tr>
                        <td className="px-4 py-6 text-gray-500" colSpan={6}>No hay pendientes</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Reglas */}
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
                  <tbody className="divide-y">
                    {rules.map((r) => (
                      <tr key={r.idEstablecimiento ?? `${r.idEstablecimiento}-${r.created_at}`}>
                        <td className="px-4 py-3">{r.nombreEstablecimiento || r.idEstablecimiento || "—"}</td>
                        <td className="px-4 py-3">{r.requireCouponApproval ? "Sí" : "No"}</td>
                        <td className="px-4 py-3">{r.requireProfileApproval ? "Sí" : "No"}</td>
                        <td className="px-4 py-3">{safeDateTime(r.created_at || r.createdAt)}</td>
                      </tr>
                    ))}
                    {rules.length === 0 && (
                      <tr>
                        <td className="px-4 py-6 text-gray-500" colSpan={4}>Sin reglas configuradas</td>
                      </tr>
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
