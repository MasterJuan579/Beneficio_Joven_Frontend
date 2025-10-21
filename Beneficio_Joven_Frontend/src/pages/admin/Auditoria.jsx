/**
 * @file Auditoria.jsx
 * @description Vista de eventos de auditoría (tabla simple).
 */

import { useEffect, useState } from "react";
import axiosInstance from "../../api/interceptors/authInterceptor";

export default function Auditoria() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setErr("");
      try {
        // GET /admin/auditoria/events?limit=100
        const { data } = await axiosInstance.get("/admin/auditoria/events", {
          params: { limit: 100 },
        });

        if (!alive) return;
        // soporta payloads como { success, data: [...] } o solo { data: [...] }
        const rows = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
        setEvents(rows);
      } catch (e) {
        if (!alive) return;
        setErr(e?.response?.data?.message || "No se pudo cargar auditoría");
        setEvents([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const safeDate = (v) => {
    const d = new Date(v);
    return isNaN(d.getTime()) ? "—" : d.toLocaleString("es-MX");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-2">Auditoría</h1>
        <p className="text-gray-600 mb-6">
          Eventos del sistema (tabla AuditEvents / AuditLog).
        </p>

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
          <div className="overflow-auto rounded-xl border bg-white">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left">
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Actor</th>
                  <th className="px-4 py-3">Rol</th>
                  <th className="px-4 py-3">Acción</th>
                  <th className="px-4 py-3">Entidad</th>
                  <th className="px-4 py-3">ID Entidad</th>
                  <th className="px-4 py-3">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {events.map((e) => (
                  <tr key={e.id ?? `${e.entityType}-${e.entityId}-${e.created_at}`}>
                    <td className="px-4 py-3">{e.id ?? "—"}</td>
                    <td className="px-4 py-3">{e.actorUser || e.actor || "—"}</td>
                    <td className="px-4 py-3">{e.actorRole || "—"}</td>
                    <td className="px-4 py-3">{e.action || "—"}</td>
                    <td className="px-4 py-3">{e.entityType || "—"}</td>
                    <td className="px-4 py-3">{e.entityId ?? "—"}</td>
                    <td className="px-4 py-3">{safeDate(e.created_at || e.createdAt)}</td>
                  </tr>
                ))}
                {events.length === 0 && (
                  <tr>
                    <td className="px-4 py-6 text-gray-500" colSpan={7}>
                      Sin eventos
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
