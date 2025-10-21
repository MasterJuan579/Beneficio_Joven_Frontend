/**
 * @file Descuentos.jsx
 * @description Gestión y listado de promociones (cupones).
 */


import { useEffect, useState, useMemo } from "react";
import AdminNavbar from "../../components/common/AdminNavbar";
import axiosInstance from "../../api/interceptors/authInterceptor";

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
        // Sugerido: GET /admin/promociones?status=APPROVED|PENDING|...
        const { data } = await axiosInstance.get("/admin/promociones", {
          params: status !== "TODOS" ? { status } : {},
        });
        if (!alive) return;
        setRows(Array.isArray(data?.data) ? data.data : []);
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

  const visible = useMemo(() => rows, [rows]);

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Descuentos (Promociones)</h1>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-300"
          >
            <option>TODOS</option>
            <option>APPROVED</option>
            <option>PENDING</option>
            <option>REJECTED</option>
            <option>DRAFT</option>
            <option>PAUSED</option>
          </select>
        </div>

        {loading && <div className="py-12">Cargando…</div>}
        {!loading && err && <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">{err}</div>}

        {!loading && !err && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visible.map((p) => (
              <article key={p.idPromocion} className="p-4 rounded-xl border bg-white">
                <h3 className="font-semibold">{p.titulo}</h3>
                <p className="text-sm text-gray-600 line-clamp-3">{p.descripcion}</p>
                <div className="mt-2 text-xs">
                  <div><b>Establecimiento:</b> {p.establecimiento || p.idEstablecimiento}</div>
                  <div><b>Tipo:</b> {p.discountType} {Number(p.discountValue) ? `(${p.discountValue})` : ""}</div>
                  <div><b>Vigencia:</b> {p.validFrom ? new Date(p.validFrom).toLocaleDateString() : "—"} → {p.validTo ? new Date(p.validTo).toLocaleDateString() : "—"}</div>
                  <div><b>Status:</b> {p.status}</div>
                  <div><b>Canjes:</b> {p.redeemedCount ?? 0}</div>
                </div>
              </article>
            ))}
            {visible.length === 0 && (
              <div className="col-span-full py-8 text-gray-500">Sin promociones</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
