/**
 * Mapa: Atizapán de Zaragoza con fondo de imagen
 */
import { useMemo } from "react";
import ReactECharts from "echarts-for-react";

export default function MapAtizapan({ geoCobertura = [], echarts }) {
  const puntos = useMemo(() => {
    const arr = Array.isArray(geoCobertura) ? geoCobertura : [];
    return arr.map((g) => {
      const lat = g.cell_lat * 0.01 + 0.005;
      const lng = g.cell_lng * 0.01 + 0.005;
      const actividad = (g.redemptions || 0) + (g.coupons || 0) + (g.branches || 0);
      return [lng, lat, actividad];
    });
  }, [geoCobertura]);

  const maxV = useMemo(() => Math.max(1, ...puntos.map((p) => p[2] || 0)), [puntos]);

  const option = useMemo(() => ({
    backgroundColor: "#f9fafb",
    geo: {
      map: "atizapan",
      roam: true,
      label: { show: false },
      itemStyle: { borderColor: "#999", borderWidth: 1, areaColor: "rgba(255,255,255,0)" },
    },
    // Fondo con imagen
    graphic: [
      {
        type: "image",
        left: 0,
        top: 0,
        bounding: "raw",
        style: {
          image: "/geo/Atizapan_de_Zaragoza.jpeg", // <--- ponla en public/geo/
          opacity: 0.75, // transparencia
          width: 800,    // ajusta según tamaño real
          height: 600,   // ajusta según tamaño real
        },
      },
    ],
    tooltip: {
      trigger: "item",
      formatter: (p) => {
        if (p.seriesType !== "scatter") return p.name || "";
        const [lng, lat, v] = p.value || [];
        return `Actividad: ${v}<br/>Lng: ${lng.toFixed(4)}, Lat: ${lat.toFixed(4)}`;
      },
    },
    visualMap: {
      min: 0,
      max: maxV,
      orient: "horizontal",
      bottom: 0,
      left: "center",
      text: ["más", "menos"],
      calculable: true,
      inRange: { color: ["#a1d99b", "#31a354"], symbolSize: [6, 22] },
    },
    series: [
      {
        type: "map",
        map: "atizapan",
        roam: false,
        silent: true,
        itemStyle: { borderColor: "#333", borderWidth: 1, areaColor: "rgba(255,255,255,0)" },
      },
      {
        type: "scatter",
        coordinateSystem: "geo",
        geoIndex: 0,
        data: puntos,
        symbolSize: (v) => Math.max(6, (v[2] / maxV) * 25),
        itemStyle: { color: "#2b8cbe", borderColor: "#1f6f63", borderWidth: 1 },
      },
    ],
  }), [puntos, maxV]);

  return <ReactECharts option={option} style={{ height: 400 }} echarts={echarts} />;
}
