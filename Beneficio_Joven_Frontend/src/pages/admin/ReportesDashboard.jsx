/**
 * @file ReportesDashboard.jsx
 * @description Dashboard con KPIs, gráficas (ECharts) y Mapa Leaflet de Atizapán (doble tamaño).
 * Requiere:
 *   /public/geo/atizapan.json
 *   npm i react-leaflet leaflet
 */

import { useEffect, useMemo, useState, useRef } from "react";
import { getAdminReports } from "../../api/services/admin-api-requests/reports";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";

// === Leaflet ===
import { MapContainer, TileLayer, GeoJSON, CircleMarker, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Utils
const arr = (v) => (Array.isArray(v) ? v : []);
const num = (v, d = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : d;
};
const str = (v, d = "") => (typeof v === "string" ? v : d);
const notEmpty = (a) => Array.isArray(a) && a.length > 0;

// ====== Leaflet Component (embebido) ======
const gridToLatLng = (cell_lat, cell_lng) => [cell_lat * 0.01 + 0.005, cell_lng * 0.01 + 0.005];

/** Mapa Leaflet: Atizapán de Zaragoza (DOBLE TAMAÑO) */
function MapAtizapanLeaflet({ geoCobertura = [] }) {
  const [munGeo, setMunGeo] = useState(null);
  const mapRef = useRef(null);

  // Carga GeoJSON (filtra polígonos)
  useEffect(() => {
    fetch("/geo/atizapan.json")
      .then((r) => r.json())
      .then((raw) => {
        const onlyPoly = {
          type: "FeatureCollection",
          features: (raw.features || []).filter(
            (f) => f.geometry && ["Polygon", "MultiPolygon"].includes(f.geometry.type)
          ),
        };
        setMunGeo(onlyPoly);
      })
      .catch(console.error);
  }, []);

  // Ajusta vista al límite municipal
  useEffect(() => {
    if (!munGeo || !mapRef.current) return;
    const bounds = L.geoJSON(munGeo).getBounds();
    mapRef.current.fitBounds(bounds, { padding: [10, 10] });
  }, [munGeo]);

  // Puntos
  const puntos = useMemo(() => {
    const src = Array.isArray(geoCobertura) ? geoCobertura : [];
    return src
      .map((g) => {
        const [lat, lng] = gridToLatLng(Number(g.cell_lat), Number(g.cell_lng));
        const actividad = num(g.redemptions) + num(g.coupons) + num(g.branches);
        return { lat, lng, actividad, meta: g };
      })
      .filter((p) => Number.isFinite(p.lat) && Number.isFinite(p.lng));
  }, [geoCobertura]);

  const maxV = useMemo(() => Math.max(1, ...puntos.map((p) => p.actividad || 0)), [puntos]);

  return (
    <div style={{ height: 640, width: "100%" }}>
      <MapContainer
        ref={mapRef}
        center={[19.55, -99.26]}
        zoom={12}
        scrollWheelZoom
        style={{ height: "100%", width: "100%", borderRadius: 8 }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {munGeo && (
          <GeoJSON
            data={munGeo}
            style={{
              color: "#333",
              weight: 1,
              fillColor: "#f5cf29",
              fillOpacity: 0.35,
            }}
          />
        )}

        {puntos.map((p, i) => (
          <CircleMarker
            key={i}
            center={[p.lat, p.lng]} // Leaflet usa [lat,lng]
            radius={Math.max(5, Math.min(22, 6 + (16 * p.actividad) / (maxV || 1)))}
            pathOptions={{
              color: "#1f6f63",
              weight: 1,
              fillColor: "#2b8cbe",
              fillOpacity: 0.85,
            }}
          >
            <Tooltip direction="top" offset={[0, -2]} opacity={1}>
              <div>
                <div>
                  <b>Actividad:</b> {p.actividad}
                </div>
                {"branches" in p.meta && <div>Sucursales: {p.meta.branches}</div>}
                {"coupons" in p.meta && <div>Promos: {p.meta.coupons}</div>}
                {"redemptions" in p.meta && <div>Canjes: {p.meta.redemptions}</div>}
              </div>
            </Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}

// ====== Dashboard ======
export default function ReportesDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [from, setFrom] = useState(""); // YYYY-MM-DD
  const [to, setTo] = useState("");     // YYYY-MM-DD

  // Carga de datos
  const fetchData = async (filters = {}) => {
    setLoading(true);
    try {
      const res = await getAdminReports(filters); // acepta { from, to }
      if (res?.success) {
        setData(res.data);
        setErrorMsg("");
      } else {
        setErrorMsg(res?.message || "No fue posible cargar los datos");
      }
    } catch {
      setErrorMsg("No fue posible cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyFilters = () => {
    const filters = {};
    if (from) filters.from = from;
    if (to) filters.to = to;
    fetchData(filters);
  };

  // ====== payload ======
  const k = data?.kpis || {};
  const s = data?.series || {};

  // Series (sanitizadas)
  const aplicacionesPorMes = useMemo(
    () => arr(s.aplicacionesPorMes).map((x) => ({ ym: str(x.ym), aplicaciones: num(x.aplicaciones) })),
    [s.aplicacionesPorMes]
  );

  const topCategorias = useMemo(
    () => arr(s.topCategorias).map((x) => ({ categoria: str(x.categoria), establecimientos: num(x.establecimientos) })),
    [s.topCategorias]
  );

  const usosPorHora = useMemo(
    () => arr(s.usosPorHora).map((x) => ({ dow: num(x.dow), hora: num(x.hora), usos: num(x.usos) })),
    [s.usosPorHora]
  );

  const mapDias = { Sunday: "Dom", Monday: "Lun", Tuesday: "Mar", Wednesday: "Mié", Thursday: "Jue", Friday: "Vie", Saturday: "Sáb" };
  const usosPorDiaSemana = useMemo(
    () => arr(s.usosPorDiaSemana).map((x) => ({ dia: mapDias[str(x.dia)] ?? str(x.dia), usos: num(x.usos) })),
    [s.usosPorDiaSemana]
  );

  const crecimientoBeneficiarios = useMemo(
    () => arr(s.crecimientoBeneficiarios).map((x) => ({ mes: str(x.mes), nuevos: num(x.nuevos) })),
    [s.crecimientoBeneficiarios]
  );

  const activacionPorMes = useMemo(
    () =>
      arr(s.activacionPorMes).map((x) => ({
        mes: str(x.mes),
        registrados: num(x.registrados),
        activados: num(x.activados),
      })),
    [s.activacionPorMes]
  );

  const promosStatus = useMemo(
    () =>
      arr(s.promosStatus).map((x) => ({
        status: str(x.status),
        total: num(x.total),
        sinLimite: num(x.sinLimite),
        conLimite: num(x.conLimite),
      })),
    [s.promosStatus]
  );

  const catalogoLifecycle = useMemo(
    () =>
      arr(s.catalogoLifecycle).map((x) => ({
        mes: str(x.mes),
        aprobadas: num(x.aprobadas),
        pendientes: num(x.pendientes),
        pausadas: num(x.pausadas),
        total: num(x.total),
      })),
    [s.catalogoLifecycle]
  );

  // ====== Opciones ECharts (no mapas) ======
  const oAplicaciones = useMemo(
    () => ({
      tooltip: { trigger: "axis" },
      grid: { left: 24, right: 16, top: 24, bottom: 32, containLabel: true },
      xAxis: { type: "category", data: aplicacionesPorMes.map((d) => d.ym) },
      yAxis: { type: "value" },
      series: [{ name: "Canjes", type: "bar", barWidth: "55%", data: aplicacionesPorMes.map((d) => d.aplicaciones) }],
    }),
    [aplicacionesPorMes]
  );

  const oTopCatPie = useMemo(() => {
    const total = topCategorias.reduce((s, x) => s + x.establecimientos, 0) || 1;
    const serie = topCategorias.map((x) => ({
      name: x.categoria,
      value: x.establecimientos,
      percent: Math.round((x.establecimientos * 100) / total),
    }));
    return {
      tooltip: { trigger: "item", formatter: (p) => `${p.name}: ${p.value} (${p.percent}%)` },
      legend: { orient: "vertical", left: 0, top: "middle" },
      series: [
        {
          name: "Categorías",
          type: "pie",
          radius: ["45%", "70%"],
          center: ["62%", "50%"],
          label: { formatter: "{b}\n{d}%" },
          data: serie,
        },
      ],
    };
  }, [topCategorias]);

  const oUsosDia = useMemo(
    () => ({
      tooltip: { trigger: "axis" },
      grid: { left: 24, right: 16, top: 24, bottom: 32, containLabel: true },
      xAxis: { type: "category", data: usosPorDiaSemana.map((d) => d.dia) },
      yAxis: { type: "value" },
      series: [{ name: "Usos", type: "bar", barWidth: "55%", data: usosPorDiaSemana.map((d) => d.usos) }],
    }),
    [usosPorDiaSemana]
  );

  const oHeatmap = useMemo(() => {
    const days = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    const base = Array.from({ length: 7 }, () => Array.from({ length: 24 }, () => 0));
    usosPorHora.forEach(({ dow, hora, usos }) => {
      const r = Math.max(1, Math.min(7, dow)) - 1;
      const c = Math.max(0, Math.min(23, hora));
      base[r][c] = usos;
    });
    const dataHM = [];
    base.forEach((row, r) => row.forEach((v, c) => dataHM.push([c, r, v])));
    const max = Math.max(1, ...dataHM.map((d) => d[2]));
    return {
      tooltip: { position: "top" },
      grid: { left: 60, right: 24, top: 24, bottom: 40, containLabel: true },
      xAxis: { type: "category", data: Array.from({ length: 24 }, (_, i) => `${i}:00`) },
      yAxis: { type: "category", data: days, inverse: true },
      visualMap: { min: 0, max, calculable: true, orient: "horizontal", left: "center", bottom: 0 },
      series: [{ type: "heatmap", data: dataHM, progressive: 0 }],
    };
  }, [usosPorHora]);

  const oCrec = useMemo(
    () => ({
      tooltip: { trigger: "axis" },
      grid: { left: 24, right: 16, top: 24, bottom: 32, containLabel: true },
      xAxis: { type: "category", data: crecimientoBeneficiarios.map((d) => d.mes) },
      yAxis: { type: "value" },
      series: [{ name: "Nuevos registros", type: "bar", barWidth: "55%", data: crecimientoBeneficiarios.map((d) => d.nuevos) }],
    }),
    [crecimientoBeneficiarios]
  );

  const oActiv = useMemo(() => {
    const meses = activacionPorMes.map((d) => d.mes);
    const reg = activacionPorMes.map((d) => d.registrados);
    const act = activacionPorMes.map((d) => d.activados);
    const tasa = reg.map((r, i) => (r ? +(100 * act[i] / r).toFixed(1) : 0));
    return {
      tooltip: { trigger: "axis" },
      legend: { top: 0 },
      grid: { left: 24, right: 40, top: 40, bottom: 32, containLabel: true },
      xAxis: { type: "category", data: meses },
      yAxis: [{ type: "value", name: "Personas" }, { type: "value", name: "% activación", min: 0, max: 100 }],
      series: [
        { name: "Registrados", type: "bar", stack: "a", data: reg },
        { name: "Activados", type: "bar", stack: "a", data: act },
        { name: "Tasa %", type: "line", yAxisIndex: 1, smooth: true, data: tasa },
      ],
    };
  }, [activacionPorMes]);

  const oPromosStatusPie = useMemo(() => {
    const serie = promosStatus.map((s) => ({ name: s.status, value: s.total }));
    return {
      tooltip: { trigger: "item", formatter: (p) => `${p.name}: ${p.value} (${p.percent}%)` },
      legend: { orient: "vertical", left: 0, top: "middle" },
      series: [
        {
          name: "Estados",
          type: "pie",
          radius: ["45%", "70%"],
          center: ["62%", "50%"],
          label: { formatter: "{b}\n{d}%" },
          data: serie,
        },
      ],
    };
  }, [promosStatus]);

  const oLifecycle = useMemo(
    () => ({
      tooltip: { trigger: "axis" },
      legend: { top: 0 },
      grid: { left: 24, right: 16, top: 40, bottom: 32, containLabel: true },
      xAxis: { type: "category", data: catalogoLifecycle.map((d) => d.mes) },
      yAxis: { type: "value" },
      series: [
        { name: "Pendientes", type: "bar", stack: "l", data: catalogoLifecycle.map((d) => d.pendientes) },
        { name: "Pausadas", type: "bar", stack: "l", data: catalogoLifecycle.map((d) => d.pausadas) },
        { name: "Aprobadas", type: "bar", stack: "l", data: catalogoLifecycle.map((d) => d.aprobadas) },
        { name: "Total", type: "line", smooth: true, data: catalogoLifecycle.map((d) => d.total) },
      ],
    }),
    [catalogoLifecycle]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Panel de resultados</h1>
        <p className="text-sm text-gray-500 mb-6">
          Vista general para tomar decisiones: registros, uso, promociones y presencia.
        </p>

        {/* Filtros */}
        <div className="bg-white p-4 rounded-lg shadow mb-6 flex flex-col md:flex-row items-start md:items-end gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Desde</label>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="border rounded px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Hasta</label>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="border rounded px-3 py-2 text-sm"
            />
          </div>
          <button
            onClick={applyFilters}
            className="ml-0 md:ml-auto bg-blue-600 text-white rounded px-4 py-2 text-sm hover:bg-blue-700"
          >
            Actualizar
          </button>
        </div>

        {loading ? (
          <Skeleton />
        ) : errorMsg ? (
          <div className="bg-white p-6 rounded-lg shadow text-red-600">{errorMsg}</div>
        ) : data ? (
          <>
            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
              <KPI title="Personas registradas" help="Total de beneficiarios dados de alta." value={num(k?.beneficiarios?.total)} />
              <KPI title="Comercios activos" help="Comercios con perfil activo." value={num(k?.comercios?.activos)} />
              <KPI title="Sucursales activas" help="Sucursales habilitadas para canjes." value={num(k?.comercios?.sucursalesActivas)} />
              <KPI title="Promociones vigentes" help="Promociones activas hoy." value={num(k?.promociones?.vigentes)} />
              <KPI title="Canjes (30 días)" help="Canjes registrados en los últimos 30 días." value={num(k?.aplicaciones?.usos30d)} />
            </div>

            {/* Gráficas + Mapa */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {notEmpty(aplicacionesPorMes) && (
                <Card title="Canjes por mes" description="Cuántos canjes se registraron cada mes.">
                  <ReactECharts option={oAplicaciones} style={{ height: 280 }} echarts={echarts} />
                </Card>
              )}

              {notEmpty(topCategorias) && (
                <Card title="Participación por categoría" description="Cómo se distribuyen los establecimientos por categoría.">
                  <ReactECharts option={oTopCatPie} style={{ height: 320 }} echarts={echarts} />
                </Card>
              )}

              {notEmpty(usosPorDiaSemana) && (
                <Card title="Uso por día de la semana" description="Qué días se canjea más.">
                  <ReactECharts option={oUsosDia} style={{ height: 280 }} echarts={echarts} />
                </Card>
              )}

              {notEmpty(usosPorHora) && (
                <Card title="Horario de mayor uso" description="Horas y días con mayor actividad para planear campañas.">
                  <ReactECharts option={oHeatmap} style={{ height: 320 }} echarts={echarts} />
                </Card>
              )}

              {notEmpty(crecimientoBeneficiarios) && (
                <Card title="Altas de beneficiarios por mes" description="Nuevos registros mensuales.">
                  <ReactECharts option={oCrec} style={{ height: 280 }} echarts={echarts} />
                </Card>
              )}

              {notEmpty(activacionPorMes) && (
                <Card title="Activación mensual de usuarios" description="Personas que usaron al menos una promoción respecto a las registradas.">
                  <ReactECharts option={oActiv} style={{ height: 300 }} echarts={echarts} />
                </Card>
              )}

              {notEmpty(promosStatus) && (
                <Card title="Promociones por estado" description="Cantidad de promociones en cada estado.">
                  <ReactECharts option={oPromosStatusPie} style={{ height: 320 }} echarts={echarts} />
                </Card>
              )}

              {notEmpty(catalogoLifecycle) && (
                <Card title="Evolución del catálogo" description="Cómo ha cambiado el catálogo de promociones mes a mes.">
                  <ReactECharts option={oLifecycle} style={{ height: 280 }} echarts={echarts} />
                </Card>
              )}

              {/* MAPA ATIZAPÁN — DOBLE TAMAÑO Y DOBLE ANCHO */}
              {Array.isArray(s?.geoCobertura) && s.geoCobertura.length > 0 && (
                <div className="lg:col-span-2">
                  <Card
                    title="Mapa: Atizapán de Zaragoza"
                    description="Puntos con actividad sobre mapa real. (Vista ampliada)"
                  >
                    <MapAtizapanLeaflet geoCobertura={s.geoCobertura} />
                  </Card>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow">Sin datos</div>
        )}
      </div>
    </div>
  );
}

/*** UI helpers ***/
function KPI({ title, value, help }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-center" title={help || ""}>
      <div className="flex items-center justify-center gap-2">
        <div className="text-sm text-gray-600">{title}</div>
        {help ? (
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-100 text-gray-500 text-xs" aria-label={help} title={help}>
            ?
          </span>
        ) : null}
      </div>
      <div className="text-3xl font-bold text-gray-900 mt-1">{num(value)}</div>
    </div>
  );
}

function Card({ title, description, children }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-1 text-lg font-semibold">{title}</div>
      {description ? <p className="text-sm text-gray-600 mb-4">{description}</p> : null}
      {children || (
        <div className="h-[280px] flex items-center justify-center text-sm text-gray-400">
          Sin datos para mostrar
        </div>
      )}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {Array.from({ length: 8 }).map((_, idx) => (
        <div key={idx} className="bg-white p-6 rounded-lg shadow-md animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
          <div className="h-8 bg-gray-200 rounded w-1/3" />
        </div>
      ))}
    </div>
  );
}
