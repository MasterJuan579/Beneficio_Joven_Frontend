import { useEffect, useState, useMemo } from 'react';
import AdminNavbar from '../../components/common/AdminNavbar';
import { getAdminReports } from '../../api/services/admin-api-requests/reports';
import ReactECharts from 'echarts-for-react';

// Helpers defensivos
const arr = (v) => (Array.isArray(v) ? v : []);
const num = (v, d = 0) => (typeof v === 'number' && !Number.isNaN(v) ? v : d);

export default function ReportesDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await getAdminReports();
      if (res.success) {
        setData(res.data);
        setErrorMsg('');
      } else {
        setErrorMsg(res.message || 'Error cargando datos');
      }
      setLoading(false);
    })();
  }, []);

  // Series procesadas
  const aplicacionesPorMes = useMemo(() => arr(data?.series?.aplicacionesPorMes), [data]);
  const topEst = useMemo(() => arr(data?.series?.topEstablecimientos), [data]);
  const topCat = useMemo(() => arr(data?.series?.topCategorias), [data]);

  // === Configuración ECharts ===
  const lineOptions = useMemo(
    () => ({
      tooltip: { trigger: 'axis' },
      grid: { left: 24, right: 16, top: 24, bottom: 32, containLabel: true },
      xAxis: { type: 'category', data: aplicacionesPorMes.map((d) => d.ym) },
      yAxis: { type: 'value' },
      series: [
        {
          name: 'Aplicaciones',
          type: 'line',
          smooth: true,
          lineStyle: { width: 3, color: '#7c3aed' },
          itemStyle: { color: '#7c3aed' },
          areaStyle: { color: 'rgba(124, 58, 237, 0.15)' },
          data: aplicacionesPorMes.map((d) => num(d.aplicaciones)),
        },
      ],
    }),
    [aplicacionesPorMes]
  );

  const barTopEstOptions = useMemo(
    () => ({
      tooltip: { trigger: 'axis' },
      grid: { left: 24, right: 16, top: 24, bottom: 80, containLabel: true },
      xAxis: {
        type: 'category',
        axisLabel: { rotate: 20 },
        data: topEst.map((d) => String(d.idEstablecimiento)),
      },
      yAxis: { type: 'value' },
      series: [
        {
          name: 'Aplicaciones',
          type: 'bar',
          barWidth: '55%',
          itemStyle: {
            borderRadius: [8, 8, 0, 0],
            color: '#8b5cf6',
            shadowBlur: 8,
            shadowOffsetY: 3,
          },
          data: topEst.map((d) => num(d.aplicaciones)),
        },
      ],
    }),
    [topEst]
  );

  const barTopCatOptions = useMemo(
    () => ({
      tooltip: { trigger: 'axis' },
      grid: { left: 24, right: 16, top: 24, bottom: 80, containLabel: true },
      xAxis: {
        type: 'category',
        axisLabel: { rotate: 20 },
        data: topCat.map((d) => d.categoria),
      },
      yAxis: { type: 'value' },
      series: [
        {
          name: 'Establecimientos',
          type: 'bar',
          barWidth: '55%',
          itemStyle: {
            borderRadius: [8, 8, 0, 0],
            color: '#a78bfa',
            shadowBlur: 8,
            shadowOffsetY: 3,
          },
          data: topCat.map((d) => num(d.establecimientos)),
        },
      ],
    }),
    [topCat]
  );

  // === Render ===
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <AdminNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Reportes & Dashboard</h1>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-md animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        ) : errorMsg ? (
          <div className="bg-white p-6 rounded-lg shadow text-red-600">{errorMsg}</div>
        ) : data ? (
          <>
            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <KPI title="Beneficiarios" value={num(data.kpis?.beneficiarios?.total)} />
              <KPI title="Comercios activos" value={num(data.kpis?.comercios?.activos)} />
              <KPI title="Sucursales activas" value={num(data.kpis?.comercios?.sucursalesActivas)} />
              <KPI title="Promociones vigentes" value={num(data.kpis?.promociones?.vigentes)} />
            </div>

            {/* Gráficas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card title="Aplicaciones por mes (últimos 6)">
                {aplicacionesPorMes.length ? (
                  <ReactECharts option={lineOptions} style={{ height: 280 }} />
                ) : (
                  <EmptyChart />
                )}
              </Card>

              <Card title="Top establecimientos por aplicaciones">
                {topEst.length ? (
                  <ReactECharts option={barTopEstOptions} style={{ height: 280 }} />
                ) : (
                  <EmptyChart />
                )}
              </Card>

              <Card title="Top categorías por establecimientos">
                {topCat.length ? (
                  <ReactECharts option={barTopCatOptions} style={{ height: 280 }} />
                ) : (
                  <EmptyChart />
                )}
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

// === Subcomponentes reutilizables ===
function KPI({ title, value }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-center">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-3xl font-bold text-gray-900">{value}</div>
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