/**
 * @file App.jsx
 * @description Rutas principales con layouts y guards (admin y dueño).
 * Evitamos navbar duplicado usando un layout único.
 * @version 1.3.0
 */

import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

/* Páginas */
import Login from './pages/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import GestionComercios from './pages/admin/GestionComercios';
import GestionDuenos from './pages/admin/GestionDuenos';
import ReportesDashboard from './pages/admin/ReportesDashboard';
import Beneficiarios from './pages/admin/Beneficiarios';
import Descuentos from './pages/admin/Descuentos';
import Moderacion from './pages/admin/Moderacion';
import Auditoria from './pages/admin/Auditoria';
import EditSucursalPage from './pages/shared/EditSucursalPage';
import MapaPage from './pages/shared/MapaPage';

/* Páginas DUEÑO (asegúrate de crearlas sin navbar interno) */
import OwnerDashboard from './pages/owner/OwnerDashboard';
import SucursalesList from './pages/owner/SucursalesList';
import SucursalDetail from './pages/owner/SucursalDetail';
import PromoCreate from './pages/owner/PromoCreate';
import ModeracionRulePage from './pages/owner/ModeracionRulePage';

/* Navbar (solo en el layout) */
import AdminNavbar from './components/common/AdminNavbar';

/* --------- Guards --------- */
function LoadingSplash() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
    </div>
  );
}

function ProtectedAdmin({ children }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  if (isLoading) return <LoadingSplash />;
  return isAuthenticated && user?.role === 'administrador'
    ? children
    : <Navigate to="/login" replace />;
}

function ProtectedOwner({ children }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  if (isLoading) return <LoadingSplash />;
  return isAuthenticated && user?.role === 'dueno'
    ? children
    : <Navigate to="/login" replace />;
}

function ProtectedShared({ children }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  if (isLoading) return <LoadingSplash />;
  const allowed = ['administrador', 'dueno'];
  return isAuthenticated && allowed.includes(user?.role)
    ? children
    : <Navigate to="/login" replace />;
}

/* --------- Layout con navbar --------- */
/** Layout con navbar fijo arriba. NO pongas AdminNavbar dentro de las páginas. */
function LayoutWithNavbar() {
  return (
    <>
      <AdminNavbar />
      {/* Ajusta pt-16 si tu navbar mide distinto (h-16 = 64px). */}
      <main className="min-h-screen bg-gray-50 pt-16 p-6">
        <Outlet />
      </main>
    </>
  );
}

/** Placeholder simple para secciones aún no implementadas */
function Placeholder({ title }) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      <p className="text-gray-600 mt-2">Sección en construcción.</p>
    </div>
  );
}

/* --------- Rutas --------- */
export default function App() {
  return (
    <Routes>
      {/* Público / Auth */}
      <Route path="/login" element={<Login />} />

      {/* ADMIN (con layout y navbar) */}
      <Route
        element={
          <ProtectedAdmin>
            <LayoutWithNavbar />
          </ProtectedAdmin>
        }
      >
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/comercios" element={<GestionComercios />} />
        <Route path="/admin/duenos" element={<GestionDuenos />} />
        <Route path="/admin/reportes" element={<ReportesDashboard />} />
        {/* Vistas reales existentes */}
        <Route path="/admin/beneficiarios" element={<Beneficiarios />} />
        <Route path="/admin/descuentos" element={<Descuentos />} />
        <Route path="/admin/moderacion" element={<Moderacion />} />
        <Route path="/admin/auditoria" element={<Auditoria />} />
      </Route>

      {/* OWNER / DUEÑO (con layout y navbar) */}
      <Route
        element={
          <ProtectedOwner>
            <LayoutWithNavbar />
          </ProtectedOwner>
        }
      >
        <Route path="/owner" element={<OwnerDashboard />} />
        <Route path="/owner/sucursales" element={<SucursalesList />} />
        <Route path="/owner/sucursales/:id" element={<SucursalDetail />} />
        <Route path="/owner/sucursales/:id/promos/nueva" element={<PromoCreate />} />
        <Route
          path="/owner/establecimientos/:idEstablecimiento/moderacion"
          element={<ModeracionRulePage />}
        />
      </Route>

      {/* Rutas compartidas (admin + dueño) con el mismo layout */}
      <Route
        element={
          <ProtectedShared>
            <LayoutWithNavbar />
          </ProtectedShared>
        }
      >
        {/* Si “Mapa” no existe aún, puedes cambiar por <Placeholder title="Mapa" /> */}
        <Route path="/admin/mapa" element={<MapaPage />} />
        <Route path="/editar-sucursal/:id" element={<EditSucursalPage />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}