import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, CircleMarker, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const num = (v, d = 0) => (Number.isFinite(Number(v)) ? Number(v) : d);
const gridToLatLng = (cell_lat, cell_lng) => [cell_lat * 0.01 + 0.005, cell_lng * 0.01 + 0.005];

// Métricas disponibles
const METRICAS = {
  total: { label: "Total", key: "total" },
  branches: { label: "Sucursales", key: "branches" },
  coupons: { label: "Promos", key: "coupons" },
  redemptions: { label: "Canjes", key: "redemptions" },
};

export default function MapAtizapanLeaflet({ geoCobertura = [] }) {
  const [munGeo, setMunGeo] = useState(null);
  const [metric, setMetric] = useState("total"); // 'total' | 'branches' | 'coupons' | 'redemptions'
  const mapRef = useRef(null);
  const polygonPaneRef = useRef(null);

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

  // Crear pane para el polígono por debajo de los puntos
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (!map.getPane("mun-pane")) {
      map.createPane("mun-pane");
      // Debajo del overlayPane (400) y markerPane (600)
      map.getPane("mun-pane").style.zIndex = 350;
      map.getPane("mun-pane").style.pointerEvents = "none"; // no capta clicks
    }
    polygonPaneRef.current = "mun-pane";
  }, []);

  // Ajustar a límites
  useEffect(() => {
    if (!munGeo || !mapRef.current) return;
    const bounds = L.geoJSON(munGeo).getBounds();
    mapRef.current.fitBounds(bounds, { padding: [10, 10] });
  }, [munGeo]);

  // Puntos con valores por métrica elegida
  const puntos = useMemo(() => {
    const src = Array.isArray(geoCobertura) ? geoCobertura : [];
    return src
      .map((g) => {
        const [lat, lng] = gridToLatLng(Number(g.cell_lat), Number(g.cell_lng));
        const branches = num(g.branches);
        const coupons = num(g.coupons);
        const redemptions = num(g.redemptions);
        const total = branches + coupons + redemptions;
        const valor =
          metric === "branches" ? branches :
          metric === "coupons" ? coupons :
          metric === "redemptions" ? redemptions :
          total;
        return { lat, lng, valor, meta: { branches, coupons, redemptions, total } };
      })
      .filter((p) => Number.isFinite(p.lat) && Number.isFinite(p.lng));
  }, [geoCobertura, metric]);

  const maxV = useMemo(() => Math.max(1, ...puntos.map((p) => p.valor || 0)), [puntos]);

  // Tooltip por métrica
  const tooltipHtml = (m) => {
    return `
      <div style="min-width:140px">
        <div><b>${METRICAS[metric].label}:</b> ${m[metric]}</div>
        <div style="margin-top:4px;opacity:.8">Sucursales: ${m.branches}</div>
        <div style="opacity:.8">Promos: ${m.coupons}</div>
        <div style="opacity:.8">Canjes: ${m.redemptions}</div>
      </div>
    `;
  };

  return (
    <div className="space-y-2">
      {/* Selector de métrica */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-gray-600">Ver:</span>
        <select
          value={metric}
          onChange={(e) => setMetric(e.target.value)}
          className="border rounded px-2 py-1"
        >
          {Object.entries(METRICAS).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>
      </div>

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
              pane={polygonPaneRef.current || undefined}   // <- polígono debajo
              style={{
                color: "#333",
                weight: 1,
                fillColor: "#f5cf29",
                fillOpacity: 0.30,
              }}
              onAdd={(e) => e.target.bringToBack()} // por si comparten pane
              interactive={false} // no intercepta clics
            />
          )}

          {puntos.map((p, i) => (
            <CircleMarker
              key={i}
              center={[p.lat, p.lng]}
              radius={Math.max(5, Math.min(24, 6 + (18 * p.valor) / (maxV || 1)))}
              pathOptions={{
                color: "#1f6f63",
                weight: 1,
                fillColor: "#2b8cbe",
                fillOpacity: 0.9,
              }}
            >
              <Tooltip direction="top" offset={[0, -2]} opacity={1}>
                <div dangerouslySetInnerHTML={{ __html: tooltipHtml(p.meta) }} />
              </Tooltip>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
