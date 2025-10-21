/**
 * @file Descuentos.jsx
 * @description Gestión y listado de promociones (cupones).
 */

import { useEffect, useState } from "react";
import axiosInstance from "../../api/interceptors/authInterceptor";

const STATUS_OPTS = ["TODOS", "APPROVED", "PENDING", "REJECTED", "DRAFT", "PAUSED"];

const safeDate = (v) => {
  const d = new Date(v);
  return isNaN(d.getTime()) ? "—" : d.toLocaleDateString("es-MX");
};

const StatusBadge = ({ status }) => {
  const map = {
    APPROVED: "bg-green-100 text-green-800 border-green-200",
    PENDING: "bg-amber-100 text-amber-800 border-amber-200",
    REJECTED: "bg-red-100 text-red-800 border-red-200",
    DRAFT: "bg-gray-100 text-gray-800 border-gray-200",
    PAUSED: "bg-purple-100 text-purple-800 border-purple-200",
  };
  const cls = map[status] || "bg-gray-100 text-gray-800 border-gray-200";
  return (
    <span className={`inline-block text-xs px-2 py-0.5 rounded-full border ${cls}`}>
      {status || "—"}
    </span>
  );
};

export default function Descuentos() {
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState("TODOS");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setErr("");
      try {
        // GET /admin/promociones?status=APPROVED|PENDING|REJECTED|DRAFT|PAUSED
        const { data } = await axiosInstance.get("/admin/promociones", {
          params: status !== "TODOS" ? { status } : {},
        });
        if (!alive) return;
        const list = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
        setRows(list);
      } catch (e) {
        if (!alive) return;
        setErr(e?.response?.data?.message || "No se pudo cargar promociones");
        setRows([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [status]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header + filtro */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
          <h1 className="text-2xl font-bold">Descuentos (Promociones)</h1>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600" htmlFor="status">Estatus:</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-3 py-2 rounded-xl border border-gray-300 bg-white"
            >
              {STATUS_OPTS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
        </div>

        {/* Estados de carga / error */}
        {loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="p-4 rounded-xl border bg-white animate-pulse">
                <div className="h-5 w-2/3 bg-gray-200 rounded mb-3"></div>
                <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-5/6 bg-gray-200 rounded mb-4"></div>
                <div className="h-3 w-1/3 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        )}

        {!loading && err && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
            {err}
          </div>
        )}

        {/* Tarjetas */}
        {!loading && !err && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rows.map((p) => (
              <article key={p.idPromocion ?? `${p.establecimiento}-${p.validFrom}-${p.validTo}`} className="p-4 rounded-xl border bg-white">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold text-gray-900">{p.titulo || "Sin título"}</h3>
                  <StatusBadge status={p.status} />
                </div>
                <p className="text-sm text-gray-600 mt-1 line-clamp-3">
                  {p.descripcion || "—"}
                </p>

                <div className="mt-3 text-xs text-gray-700 space-y-1">
                  <div><b>Establecimiento:</b> {p.establecimiento || p.nombreEstablecimiento || p.idEstablecimiento || "—"}</div>
                  <div>
                    <b>Tipo:</b> {p.discountType || "—"}
                    {Number(p.discountValue) ? ` (${p.discountValue})` : ""}
                  </div>
                  <div>
                    <b>Vigencia:</b> {safeDate(p.validFrom)} → {safeDate(p.validTo)}
                  </div>
                  <div><b>Canjes:</b> {Number.isFinite(Number(p.redeemedCount)) ? p.redeemedCount : 0}</div>
                </div>
              </article>
            ))}
            {rows.length === 0 && (
              <div className="col-span-full py-8 text-gray-500">Sin promociones</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
