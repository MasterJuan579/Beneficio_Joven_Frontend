/**
 * @file ReportesDashboard.jsx
 * @description Dashboard de reportes (14+ series de tu API).
 */

import { useEffect, useMemo, useState } from "react";
import AdminNavbar from "../../components/common/AdminNavbar";
import { getAdminReports } from "../../api/services/admin-api-requests/reports";
import ReactECharts from "echarts-for-react";

// Helpers defensivos
const arr = (v) => (Array.isArray(v) ? v : []);
const num = (v, d = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : d;
};
const str = (v, d = "") => (typeof v === "string" ? v : d);

export default function ReportesDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await getAdminReports(); // puedes pasar { from, to }
      if (res?.success) {
        setData(res.data);
        setErrorMsg("");
      } else {
        setErrorMsg(res?.message || "Error cargando datos");
      }
      setLoading(false);
    })();
  }, []);

  // Series base
  const aplicacionesPorMes = useMemo(() => arr(data?.series?.aplicacionesPorMes), [data]);
  const redencionesPorMes  = useMemo(() => arr(data?.series?.redencionesPorMes),  [data]);
  const topEst             = useMemo(() => arr(data?.series?.topEstablecimientos),[data]);
  const topCat             = useMemo(() => arr(data?.series?.topCategorias),      [data]);
  const usosPorHora        = useMemo(() => arr(data?.series?.usosPorHora),        [data]);

  // Etiquetas de día en español
  const mapDias = { Sunday:"Dom", Monday:"Lun", Tuesday:"Mar", Wednesday:"Mié", Thursday:"Jue", Friday:"Vie", Saturday:"Sáb" };
  const usosPorDia = useMemo(
    () => arr(data?.series?.usosPorDiaSemana).map(d => ({ ...d, dia: mapDias[d.dia] ?? d.dia })),
    [data]
  );

  const crecBen            = useMemo(() => arr(data?.series?.crecimientoBeneficiarios), [data]);
  const activMes           = useMemo(() => arr(data?.series?.activacionPorMes),   [data]);
  const promosStatus       = useMemo(() => arr(data?.series?.promosStatus),       [data]);
  const topDuenos          = useMemo(() => arr(data?.series?.topDuenos),          [data]);

  // Extras
  const embudo   = useMemo(() => arr(data?.series?.embudoConversion),     [data]);
  const slaTrend = useMemo(() => arr(data?.series?.slaModeracionTrend),   [data]);
  const catalogo = useMemo(() => arr(data?.series?.catalogoLifecycle),    [data]);
  const geo      = useMemo(() => arr(data?.series?.geoCobertura),         [data]);

  // KPIs
  const k = data?.kpis || {};
  const kSLA = k?.slaModeracion || {};

  // ===== Opciones de ECharts =====
  const oAplicaciones = useMemo(() => ({
    tooltip: { trigger: "axis" },
    grid: { left: 24, right: 16, top: 24, bottom: 32, containLabel: true },
    xAxis: { type: "category", data: aplicacionesPorMes.map(d => d.ym) },
    yAxis: { type: "value" },
    series: [{ name: "Aplicaciones", type: "line", smooth: true, data: aplicacionesPorMes.map(d => num(d.aplicaciones)) }]
  }), [aplicacionesPorMes]);

  const oRedenciones = useMemo(() => ({
    tooltip: { trigger: "axis" },
    grid: { left: 24, right: 16, top: 24, bottom: 32, containLabel: true },
    xAxis: { type: "category", data: redencionesPorMes.map(d => d.mes) },
    yAxis: { type: "value" },
    series: [{ name: "Redenciones", type: "line", smooth: true, data: redencionesPorMes.map(d => num(d.redenciones)) }]
  }), [redencionesPorMes]);

  const oTopEst = useMemo(() => ({
    tooltip: { trigger: "axis" },
    grid: { left: 24, right: 16, top: 24, bottom: 80, containLabel: true },
    xAxis: {
      type: "category",
      axisLabel: { rotate: 20 },
      data: topEst.map(d => str(d.nombre, String(d.idEstablecimiento)))
    },
    yAxis: { type: "value" },
    series: [{ name: "Aplicaciones", type: "bar", barWidth: "55%", data: topEst.map(d => num(d.aplicaciones)) }]
  }), [topEst]);

  const oTopCat = useMemo(() => ({
    tooltip: { trigger: "axis" },
    grid: { left: 24, right: 16, top: 24, bottom: 80, containLabel: true },
    xAxis: {
      type: "category",
      axisLabel: { rotate: 20 },
      data: topCat.map(d => d.categoria)
    },
    yAxis: { type: "value" },
    series: [{ name: "Establecimientos", type: "bar", barWidth: "55%", data: topCat.map(d => num(d.establecimientos)) }]
  }), [topCat]);

  const oUsosDia = useMemo(() => ({
    tooltip: { trigger: "axis" },
    grid: { left: 24, right: 16, top: 24, bottom: 32, containLabel: true },
    xAxis: { type: "category", data: usosPorDia.map(d => d.dia) },
    yAxis: { type: "value" },
    series: [{ name: "Usos", type: "bar", barWidth: "55%", data: usosPorDia.map(d => num(d.usos)) }]
  }), [usosPorDia]);

  // Heatmap 24x7 (usosPorHora)
  const oHeatmap = useMemo(() => {
    const days = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];
    const base = Array.from({ length: 7 }, () => Array.from({ length: 24 }, () => 0));
    usosPorHora.forEach(({ dow, hora, usos }) => {
      const r = Math.max(1, Math.min(7, Number(dow))) - 1;
      const c = Math.max(0, Math.min(23, Number(hora)));
      base[r][c] = Number(usos || 0);
    });
    const dataHM = [];
    base.forEach((row, r) => row.forEach((v, c) => dataHM.push([c, r, v])));
    const max = Math.max(1, ...dataHM.map(d => d[2]));
    return {
      tooltip: { position: "top" },
      grid: { left: 60, right: 24, top: 24, bottom: 40, containLabel: true },
      xAxis: { type: "category", data: Array.from({ length: 24 }, (_, i) => `${i}:00`) },
      yAxis: { type: "category", data: days, inverse: true },
      visualMap: { min: 0, max, calculable: true, orient: "horizontal", left: "center", bottom: 0 },
      series: [{ type: "heatmap", data: dataHM, progressive: 0 }]
    };
  }, [usosPorHora]);

  const oCrec = useMemo(() => ({
    tooltip: { trigger: "axis" },
    grid: { left: 24, right: 16, top: 24, bottom: 32, containLabel: true },
    xAxis: { type: "category", data: crecBen.map(d => d.mes) },
    yAxis: { type: "value" },
    series: [{ name: "Nuevos", type: "line", smooth: true, data: crecBen.map(d => num(d.nuevos)) }]
  }), [crecBen]);

  const oActiv = useMemo(() => ({
    tooltip: { trigger: "axis" },
    legend: { top: 0 },
    grid: { left: 24, right: 16, top: 40, bottom: 32, containLabel: true },
    xAxis: { type: "category", data: activMes.map(d => d.mes) },
    yAxis: { type: "value" },
    series: [
      { name: "Registrados", type: "bar", stack: "a", data: activMes.map(d => num(d.registrados)) },
      { name: "Activados", type: "bar", stack: "a", data: activMes.map(d => num(d.activados)) }
    ]
  }), [activMes]);

  const oCatStatus = useMemo(() => ({
    tooltip: { trigger: "axis" },
    legend: { top: 0 },
    grid: { left: 24, right: 16, top: 40, bottom: 32, containLabel: true },
    xAxis: { type: "category", data: promosStatus.map(d => d.status) },
    yAxis: { type: "value" },
    series: [
      { name: "Sin límite", type: "bar", stack: "s", data: promosStatus.map(d => num(d.sinLimite)) },
      { name: "Con límite", type: "bar", stack: "s", data: promosStatus.map(d => num(d.conLimite)) },
      { name: "Total", type: "line", data: promosStatus.map(d => num(d.total)) }
    ]
  }), [promosStatus]);

  const oTopDuenos = useMemo(() => ({
    tooltip: { trigger: "axis" },
    grid: { left: 24, right: 16, top: 24, bottom: 80, containLabel: true },
    xAxis: { type: "category", axisLabel: { rotate: 20 }, data: topDuenos.map(d => d.nombreUsuario) },
    yAxis: { type: "value" },
    series: [{ name: "Usos", type: "bar", barWidth: "55%", data: topDuenos.map(d => num(d.usos)) }]
  }), [topDuenos]);

  const oEmbudo = useMemo(() => ({
    tooltip: { trigger: "axis" },
    legend: { top: 0 },
    grid: { left: 24, right: 16, top: 40, bottom: 40, containLabel: true },
    xAxis: { type: "category", data: embudo.map(d => d.cohort) },
    yAxis: { type: "value" },
    series: [
      { name: "Registrados", type: "bar", stack: "f", data: embudo.map(d => num(d.registrados)) },
      { name: "≥1 uso", type: "bar", stack: "f", data: embudo.map(d => num(d.activados_1p)) },
      { name: "≥3 usos", type: "bar", stack: "f", data: embudo.map(d => num(d.frecuentes_3p)) }
    ]
  }), [embudo]);

  const oSLA = useMemo(() => ({
    tooltip: { trigger: "axis" },
    grid: { left: 24, right: 16, top: 24, bottom: 40, containLabel: true },
    xAxis: { type: "category", data: slaTrend.map(d => d.fecha) },
    yAxis: { type: "value", name: "min" },
    series: [{ name: "SLA promedio (min)", type: "line", smooth: true, data: slaTrend.map(d => num(d.sla_media_min)) }]
  }), [slaTrend]);

  // ✅ Lifecycle del catálogo (stacked + línea)
  const oLifecycle = useMemo(() => ({
    tooltip: { trigger: "axis" },
    legend: { top: 0 },
    grid: { left: 24, right: 16, top: 40, bottom: 32, containLabel: true },
    xAxis: { type: "category", data: catalogo.map(d => d.mes) },
    yAxis: { type: "value" },
    series: [
      // Nota: tu API trae total/pendientes/pausadas/aprobadas. Ajusta si agregas más estados.
      { name: "Pendientes", type: "bar", stack: "l", data: catalogo.map(d => num(d.pendientes)) },
      { name: "Pausadas",  type: "bar", stack: "l", data: catalogo.map(d => num(d.pausadas)) },
      { name: "Aprobadas", type: "bar", stack: "l", data: catalogo.map(d => num(d.aprobadas)) },
      { name: "Total",     type: "line", smooth: true, data: catalogo.map(d => num(d.total)) }
    ]
  }), [catalogo]);

  // ✅ Geo cobertura (HEATMAP CARTESIANO con ejes CATEGORY) — corrige el error
  const oGeo = useMemo(() => {
    if (!geo.length) {
      return {
        grid: { left: 60, right: 16, top: 24, bottom: 48, containLabel: true },
        xAxis: { type: "category", data: [] },
        yAxis: { type: "category", data: [] },
        series: [{ type: "heatmap", data: [] }],
        visualMap: { min: 0, max: 1, calculable: true, orient: "horizontal", left: "center", bottom: 0 },
        tooltip: {}
      };
    }

    // 1) Categorías únicas (ordenadas)
    const xCats = Array.from(new Set(geo.map(g => String(g.cell_lng)))).sort((a,b)=>Number(a)-Number(b));
    const yCats = Array.from(new Set(geo.map(g => String(g.cell_lat)))).sort((a,b)=>Number(a)-Number(b));

    // 2) Datos [xIndex, yIndex, value]
    const dataHM = geo.map(g => {
      const x = xCats.indexOf(String(g.cell_lng));
      const y = yCats.indexOf(String(g.cell_lat));
      const val = Number(g.redemptions ?? 0);
      return [x, y, val];
    });

    const vmax = Math.max(1, ...dataHM.map(d => d[2]));

    return {
      tooltip: {
        formatter: (p) => {
          const [xi, yi, val] = p.data || [];
          const clng = Number(xCats[xi]);
          const clat = Number(yCats[yi]);
          const lat = (clat * 0.01 + 0.005).toFixed(4);
          const lng = (clng * 0.01 + 0.005).toFixed(4);
          return `Lat: ${lat}°, Lng: ${lng}°<br/>Redenciones: ${val}`;
        }
      },
      grid: { left: 60, right: 16, top: 24, bottom: 48, containLabel: true },
      xAxis: { type: "category", name: "cell_lng", data: xCats },
      yAxis: { type: "category", name: "cell_lat", data: yCats, inverse: true },
      visualMap: {
        min: 0,
        max: vmax,
        calculable: true,
        orient: "horizontal",
        left: "center",
        bottom: 0
      },
      series: [{ type: "heatmap", data: dataHM, progressive: 0 }]
    };
  }, [geo]);

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Reportes & Dashboard</h1>

        {loading ? (
          <Skeleton />
        ) : errorMsg ? (
          <div className="bg-white p-6 rounded-lg shadow text-red-600">{errorMsg}</div>
        ) : data ? (
          <>
            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
              <KPI title="Beneficiarios"     value={num(k?.beneficiarios?.total)} />
              <KPI title="Comercios activos"  value={num(k?.comercios?.activos)} />
              <KPI title="Sucursales activas" value={num(k?.comercios?.sucursalesActivas)} />
              <KPI title="Promos vigentes"    value={num(k?.promociones?.vigentes)} />
              <KPI title="SLA mod. (min)"     value={num(kSLA?.sla_media_min)} />
            </div>

            {/* Gráficas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card title="Aplicaciones por mes">
                {aplicacionesPorMes.length ? <ReactECharts option={oAplicaciones} style={{ height: 280 }} /> : <EmptyChart />}
              </Card>
              <Card title="Redenciones por mes (promos APPROVED)">
                {redencionesPorMes.length ? <ReactECharts option={oRedenciones} style={{ height: 280 }} /> : <EmptyChart />}
              </Card>
              <Card title="Top establecimientos por aplicaciones">
                {topEst.length ? <ReactECharts option={oTopEst} style={{ height: 280 }} /> : <EmptyChart />}
              </Card>
              <Card title="Top categorías por establecimientos">
                {topCat.length ? <ReactECharts option={oTopCat} style={{ height: 280 }} /> : <EmptyChart />}
              </Card>
              <Card title="Usos por día de la semana">
                {usosPorDia.length ? <ReactECharts option={oUsosDia} style={{ height: 280 }} /> : <EmptyChart />}
              </Card>
              <Card title="Heatmap usos (día × hora)">
                {usosPorHora.length ? <ReactECharts option={oHeatmap} style={{ height: 320 }} /> : <EmptyChart />}
              </Card>
              <Card title="Crecimiento de beneficiarios">
                {crecBen.length ? <ReactECharts option={oCrec} style={{ height: 280 }} /> : <EmptyChart />}
              </Card>
              <Card title="Activación por mes (registrados vs activados)">
                {activMes.length ? <ReactECharts option={oActiv} style={{ height: 280 }} /> : <EmptyChart />}
              </Card>
              <Card title="Catálogo de promociones por estado">
                {promosStatus.length ? <ReactECharts option={oCatStatus} style={{ height: 280 }} /> : <EmptyChart />}
              </Card>
              <Card title="Top dueños por usos">
                {topDuenos.length ? <ReactECharts option={oTopDuenos} style={{ height: 280 }} /> : <EmptyChart />}
              </Card>
              <Card title="Embudo de conversión (mensual)">
                {embudo.length ? <ReactECharts option={oEmbudo} style={{ height: 300 }} /> : <EmptyChart />}
              </Card>
              <Card title="SLA de moderación (promedio min por día)">
                {slaTrend.length ? <ReactECharts option={oSLA} style={{ height: 280 }} /> : <EmptyChart />}
              </Card>
              <Card title="Lifecycle del catálogo (por mes)">
                {catalogo.length ? <ReactECharts option={oLifecycle} style={{ height: 280 }} /> : <EmptyChart />}
              </Card>
              <Card title="Cobertura geográfica (heatmap por celdas 0.01°)">
                {geo.length ? <ReactECharts option={oGeo} style={{ height: 320 }} /> : <EmptyChart />}
              </Card>
            </div>
          </>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow">Sin datos</div>
        )}
      </div>
    </div>
  );
}

// UI helpers
function KPI({ title, value }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-center">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-3xl font-bold text-gray-900">{num(value)}</div>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="text-lg font-semibold mb-4">{title}</div>
      {children}
    </div>
  );
}

function EmptyChart() {
  return (
    <div className="h-[280px] flex items-center justify-center text-sm text-gray-400">
      Sin datos para graficar
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
