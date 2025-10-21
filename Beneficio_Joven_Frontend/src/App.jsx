/**
 * @file App.jsx
 * @description Rutas principales con layouts y guards para evitar superposición del navbar.
 * @version 1.2.0
 */

import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

/* Páginas */
import Login from './pages/Login'
import AdminDashboard from './pages/admin/AdminDashboard'
import GestionComercios from './pages/admin/GestionComercios'
import GestionDuenos from './pages/admin/GestionDuenos'
import ReportesDashboard from './pages/admin/ReportesDashboard'
import Beneficiarios from './pages/admin/Beneficiarios'
import Descuentos from './pages/admin/Descuentos'
import Moderacion from './pages/admin/Moderacion'
import Auditoria from './pages/admin/Auditoria'
import EditSucursalPage from './pages/shared/EditSucursalPage'

/* Navbar (solo en el layout) */
import AdminNavbar from './components/common/AdminNavbar'

/* --------- Guards --------- */
function ProtectedAdmin({ children }) {
  const { isAuthenticated, isLoading, user } = useAuth()
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }
  return (isAuthenticated && user?.role === 'administrador')
    ? children
    : <Navigate to="/login" replace />
}

function ProtectedShared({ children }) {
  const { isAuthenticated, isLoading, user } = useAuth()
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }
  const allowedRoles = ['administrador', 'dueno']
  return (isAuthenticated && allowedRoles.includes(user?.role))
    ? children
    : <Navigate to="/login" replace />
}

/* --------- Layouts --------- */
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
  )
}

/** Placeholder simple para secciones aún no implementadas */
function Placeholder({ title }) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      <p className="text-gray-600 mt-2">Sección en construcción.</p>
    </div>
  )
}

/* --------- Rutas --------- */
export default function App() {
  return (
    <Routes>
      {/* Público / Auth */}
      <Route path="/login" element={<Login />} />

      {/* Admin (todas estas rutas comparten el layout con navbar) */}
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

        {/* Vistas reales que ya preparaste */}
        <Route path="/admin/beneficiarios" element={<Beneficiarios />} />
        <Route path="/admin/descuentos" element={<Descuentos />} />
        <Route path="/admin/moderacion" element={<Moderacion />} />
        <Route path="/admin/auditoria" element={<Auditoria />} />

        {/* Si “Mapa” no existe aún, deja el placeholder aquí */}
        <Route path="/admin/mapa" element={<Placeholder title="Mapa" />} />
      </Route>

      {/* Rutas compartidas (admin + dueño) que también usan el mismo layout */}
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
  )
}
