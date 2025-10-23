/**
 * @file App.jsx
 * @description Rutas principales con layouts y guards para evitar superposición del navbar.
 * @version 1.3.1
 */

import { Suspense, lazy } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

/* Páginas existentes */
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import GestionComercios from "./pages/admin/GestionComercios";
import GestionDuenos from "./pages/admin/GestionDuenos";
import ReportesDashboard from "./pages/admin/ReportesDashboard";
import Beneficiarios from "./pages/admin/Beneficiarios";
import Moderacion from "./pages/admin/Moderacion";
import EditSucursalPage from "./pages/shared/EditSucursalPage";
import MapaPage from "./pages/shared/MapaPage";
import ModeracionDetalle from "./pages/admin/ModeracionDetalle";


/* Navbar */
import AdminNavbar from "./components/common/AdminNavbar";

/* Owner (lazy) */
const OwnerDashboard = lazy(() => import("./pages/owner/OwnerDashboard"));
const OwnerSucursales = lazy(() => import("./pages/owner/SucursalesList"));
const OwnerPromociones = lazy(() => import("./pages/owner/PromoCreate"));
// OJO: NO importamos ModeracionRulePage para owner

/* Usaremos la misma página pero bajo ruta admin */
const ModeracionRulePage = lazy(() => import("./pages/owner/ModeracionRulePage"));

/* --------- Guards --------- */
function ProtectedAdmin({ children }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }
  return isAuthenticated && user?.role === "administrador" ? children : <Navigate to="/login" replace />;
}

function ProtectedOwner({ children }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }
  return isAuthenticated && user?.role === "dueno" ? children : <Navigate to="/login" replace />;
}

function ProtectedShared({ children }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }
  const allowed = ["administrador", "dueno"];
  return isAuthenticated && allowed.includes(user?.role) ? children : <Navigate to="/login" replace />;
}

/* --------- Layout --------- */
function LayoutWithNavbar() {
  return (
    <>
      <AdminNavbar />
      <main className="min-h-screen bg-gray-50 pt-16 p-6">
        <Outlet />
      </main>
    </>
  );
}

/* --------- App --------- */
export default function App() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      }
    >
      <Routes>
        {/* Público */}
        <Route path="/login" element={<Login />} />

        {/* ADMIN */}
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
          <Route path="/admin/beneficiarios" element={<Beneficiarios />} />
          <Route path="/admin/reportes" element={<ReportesDashboard />} />
          <Route path="/admin/moderacion" element={<Moderacion />} />
          <Route path="/admin/moderacion/:id" element={<ModeracionDetalle />} />
          <Route path="/admin/mapa" element={<MapaPage/>} />
        </Route>

        {/* OWNER */}
        <Route
          element={
            <ProtectedOwner>
              <LayoutWithNavbar />
            </ProtectedOwner>
          }
        >
          <Route path="/owner/dashboard" element={<OwnerDashboard />} />
          <Route path="/owner/sucursales" element={<OwnerSucursales />} />
          <Route path="/owner/promociones" element={<OwnerPromociones />} />
          {/* Nada de reglas aquí */}
        </Route>

        {/* Compartidas */}
        <Route
          element={
            <ProtectedShared>
              <LayoutWithNavbar />
            </ProtectedShared>
          }
        >
          <Route path="/editar-sucursal/:id" element={<EditSucursalPage />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  );
}
