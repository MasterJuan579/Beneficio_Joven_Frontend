import { useEffect, useMemo, useState, useCallback } from 'react';
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';
import { getSucursalesMapa, getCategorias } from '../../api/services/shared-api-request/mapa';

// Estilos básicos del mapa
const containerStyle = { width: '100%', height: 'calc(100vh - 140px)' };

// Centro por defecto (CDMX); si quieres, calcula centro en base a sucursales
const defaultCenter = { lat: 19.4326, lng: -99.1332 };
const defaultZoom = 11;

export default function MapaPage() {
  const [categorias, setCategorias] = useState([]);
  const [categoriaSel, setCategoriaSel] = useState('');
  const [search, setSearch] = useState('');
  const [sucursales, setSucursales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  // Cargar categorías al entrar
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await getCategorias();
        if (mounted && res?.success) setCategorias(res.data || []);
      } catch (e) {
        console.error('Error cargando categorías:', e);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const cargarSucursales = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getSucursalesMapa({
        categoria: categoriaSel || undefined,
        search: search || undefined,
      });
      if (res?.success) {
        setSucursales(res.data || []);
      } else {
        setSucursales([]);
      }
    } catch (e) {
      console.error('Error cargando sucursales:', e);
      setSucursales([]);
    } finally {
      setLoading(false);
    }
  }, [categoriaSel, search]);

  // Cargar sucursales cuando cambien filtros
  useEffect(() => {
    cargarSucursales();
  }, [cargarSucursales]);

  // Centro dinámico (si hay puntos)
  const mapCenter = useMemo(() => {
    if (!sucursales?.length) return defaultCenter;
    const [first] = sucursales;
    return { lat: Number(first.latitud), lng: Number(first.longitud) };
  }, [sucursales]);

  if (!isLoaded) return <div style={{ padding: 24 }}>Cargando mapa…</div>;

  return (
    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <h2>Mapa de Sucursales</h2>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <select
          value={categoriaSel}
          onChange={(e) => setCategoriaSel(e.target.value)}
          style={{ padding: '8px 12px', minWidth: 220 }}
        >
          <option value=''>Todas las categorías</option>
          {categorias.map((c) => (
            <option key={c.idCategoria} value={c.idCategoria}>
              {c.nombreCategoria}
            </option>
          ))}
        </select>

        <input
          type='text'
          placeholder='Buscar por establecimiento o sucursal…'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') cargarSucursales(); }}
          style={{ padding: '8px 12px', flex: 1, minWidth: 260 }}
        />

        <button onClick={cargarSucursales} style={{ padding: '8px 14px' }}>
          Buscar
        </button>
      </div>

      {/* Estado / conteo */}
      <div style={{ fontSize: 14, color: '#555' }}>
        {loading ? 'Cargando sucursales…' : `Resultados: ${sucursales.length}`}
      </div>

      {/* Mapa */}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={defaultZoom}
        options={{
          mapTypeControl: false,
          fullscreenControl: false,
          streetViewControl: false,
        }}
      >
        {!loading && sucursales.map((suc) => {
          const position = { lat: Number(suc.latitud), lng: Number(suc.longitud) };
          return (
            <Marker
              key={suc.idSucursal}
              position={position}
              onClick={() => setSelected(suc)}
              // Si quieres usar el logo como ícono:
              // icon={suc.logoURL ? { url: suc.logoURL, scaledSize: new google.maps.Size(32, 32) } : undefined}
            />
          );
        })}

        {selected && (
          <InfoWindow
            position={{ lat: Number(selected.latitud), lng: Number(selected.longitud) }}
            onCloseClick={() => setSelected(null)}
          >
            <div style={{ maxWidth: 260 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                {selected.logoURL && (
                  <img
                    src={selected.logoURL}
                    alt='logo'
                    style={{ width: 28, height: 28, objectFit: 'contain' }}
                  />
                )}
                <strong>{selected.establecimiento}</strong>
              </div>
              <div style={{ fontSize: 13, marginBottom: 4 }}>
                <strong>{selected.nombreSucursal}</strong>
              </div>
              <div style={{ fontSize: 12, color: '#666', marginBottom: 6 }}>
                {selected.categoria}
              </div>
              <div style={{ fontSize: 12, marginBottom: 6 }}>{selected.direccion}</div>
              {(selected.horaApertura || selected.horaCierre) && (
                <div style={{ fontSize: 12 }}>
                  Horario: {selected.horaApertura || '--'} a {selected.horaCierre || '--'}
                </div>
              )}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}
