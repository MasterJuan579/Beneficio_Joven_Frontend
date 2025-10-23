/**
 * Mapa Leaflet: Estado de México (coropleta por municipio)
 * Props:
 *  - valoresPorMunicipio: { [munName]: number }
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, Tooltip } from "react-leaflet";
import L from "leaflet";

export default function MapEdomexLeaflet({ valoresPorMunicipio = {} }) {
  const [edomex, setEdomex] = useState(null);
  const [nameKey, setNameKey] = useState("name");
  const mapRef = useRef(null);

  useEffect(() => {
    fetch("/geo/edomex.json")
      .then(r => r.json())
      .then(g => {
        setEdomex(g);
        const props = g?.features?.[0]?.properties || {};
        const k = ["name","NAME","shapeName","MUNICIPIO","mun_name"].find(x => props[x] != null) || "name";
        setNameKey(k);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!edomex || !mapRef.current) return;
    const bounds = L.geoJSON(edomex).getBounds();
    mapRef.current.fitBounds(bounds, { padding: [10, 10] });
  }, [edomex]);

  const values = useMemo(() => Object.values(valoresPorMunicipio).map(v => Number(v) || 0), [valoresPorMunicipio]);
  const minV = values.length ? Math.min(...values) : 0;
  const maxV = values.length ? Math.max(...values) : 1;

  const colorFor = (v) => {
    const t = (Number(v) || 0 - minV) / Math.max(1e-9, maxV - minV);
    // de azul claro a azul fuerte:
    const start = [198,219,239], end = [49,130,189];
    const c = start.map((s,i)=> Math.round(s + t*(end[i]-s)));
    return `rgb(${c[0]},${c[1]},${c[2]})`;
  };

  const style = (feature) => {
    const n = feature.properties?.[nameKey];
    const v = valoresPorMunicipio[n] ?? 0;
    return { color: "#666", weight: 0.8, fillColor: colorFor(v), fillOpacity: 0.8 };
  };

  const onEach = (feature, layer) => {
    const n = feature.properties?.[nameKey];
    const v = valoresPorMunicipio[n] ?? 0;
    layer.bindTooltip(`${n}<br/><b>${v}</b>`, { sticky: true });
  };

  return (
    <div style={{ height: 440, width: "100%" }}>
      <MapContainer
        ref={mapRef}
        center={[19.3, -99.6]}
        zoom={8}
        scrollWheelZoom
        style={{ height: "100%", width: "100%", borderRadius: 8 }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {edomex && <GeoJSON data={edomex} style={style} onEachFeature={onEach} />}
      </MapContainer>
    </div>
  );
}
