/**
 * @file Mapa.jsx
 * @description Heatmap básico usando ECharts con la serie `geoCobertura` de /admin/reports.
 */
import { useEffect, useState, useMemo } from "react";
import AdminNavbar from "../../components/common/AdminNavbar";
import axiosInstance from "../../api/interceptors/authInterceptor";
import ReactECharts from "echarts-for-react";

export default function Mapa() {
  const [geo, setGeo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setErr("");
      try {
        // Reutilizamos /admin/reports para no bloquear por falta de endpoint dedicado
        const { data } = await axiosInstance.get("/admin/reports");
        if (!alive) return;
        const serie = data?.data?.series?.geoCobertura;
        setGeo(Array.isArray(serie) ? serie : []);
      } catch (e) {
        if (!alive) return;
        setErr(e?.response?.data?.message || "No se pudo cargar el mapa");
        setGeo([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const heat = useMemo(() => {
    // Esperamos objetos: { cell_lat, cell_lng, branches, coupons, redemptions }
    return geo.map(g => ([
      Number(g.cell_lng) || 0,
      Number(g.cell_lat) || 0,
      Number(g.redemptions) || 0
    ]));
  }, [geo]);

  const option = useMemo(() => ({
    tooltip: { trigger: "item", formatter: (p) => `Redenciones: ${p.value?.[2] ?? 0}` },
    xAxis: { type: "value", name: "lng", min: -100, max: -98 },
    yAxis: { type: "value", name: "lat", min: 18, max: 21 },
    series: [{
      name: "Heat",
      type: "heatmap",
      data: heat,
      progressive: 5000,
    }],
    visualMap: { min: 0, max: Math.max(1, ...heat.map(v=>v[2])), calculable: true, orient: "vertical", right: 0, top: "middle" }
  }), [heat]);

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-2">Mapa / Cobertura</h1>
        <p className="text-gray-600 mb-6">Heatmap de canjes por celdas (vista `v_geo_grid`).</p>

        {loading && <div className="py-10">Cargando…</div>}
        {!loading && err && <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">{err}</div>}
        {!loading && !err && (
          <div className="bg-white rounded-xl border p-2">
            <ReactECharts style={{ height: 520 }} option={option} notMerge lazyUpdate />
          </div>
        )}
      </div>
    </div>
  );
}
