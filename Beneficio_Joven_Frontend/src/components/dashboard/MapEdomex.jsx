/**
 * Mapa: Estado de México por municipios (solo pinta; el mapa ya debe estar registrado por el padre)
 * Props:
 *  - valoresPorMunicipio: { [municipioName]: number }
 *  - nameKey: string (propiedad en el GeoJSON que trae el nombre municipal; ej. "name", "MUNICIPIO", etc.)
 *  - echarts: instancia de echarts (pasada desde el padre)
 */

import { useMemo } from "react";
import ReactECharts from "echarts-for-react";

export default function MapEdomex({ valoresPorMunicipio = {}, nameKey = "name", echarts }) {
  const data = useMemo(() => {
    if (!valoresPorMunicipio || typeof valoresPorMunicipio !== "object") return [];
    return Object.entries(valoresPorMunicipio).map(([name, value]) => ({
      name,
      value: Number(value) || 0,
    }));
  }, [valoresPorMunicipio]);

  const maxV = useMemo(
    () => Math.max(1, ...data.map((d) => d.value || 0)),
    [data]
  );

  const option = useMemo(
    () => ({
      tooltip: { trigger: "item", formatter: "{b}<br/>Valor: <b>{c}</b>" },
      visualMap: {
        left: "left",
        bottom: 0,
        min: 0,
        max: maxV,
        text: ["alto", "bajo"],
        calculable: true,
      },
      series: [
        {
          type: "map",
          map: "edomex_muns",
          name: "Municipios",
          roam: true,
          itemStyle: { borderColor: "#888" },
          emphasis: { label: { show: true } },
          label: { show: false },
          nameProperty: nameKey, // ¡clave para que machee con tus 'name' de data!
          data,
        },
      ],
    }),
    [data, nameKey, maxV]
  );

  return <ReactECharts option={option} style={{ height: 420 }} echarts={echarts} />;
}
