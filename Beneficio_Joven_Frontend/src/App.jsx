/**
 * @file App.jsx
 * @description Definición de rutas principales de la aplicación usando React Router v6.
 * Incluye protección de rutas administrativas mediante `ProtectedAdmin` y
 * vistas completas de cada módulo.
 *
 * @module App
 * @version 1.1.0
 */

import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

// Páginas principales
import Login from './pages/Login'

// Páginas del administrador
import AdminDashboard from './pages/admin/AdminDashboard'
import GestionComercios from './pages/admin/GestionComercios'
import GestionDuenos from './pages/admin/GestionDuenos'
import ReportesDashboard from './pages/admin/ReportesDashboard'
import Beneficiarios from './pages/admin/Beneficiarios'
import Descuentos from './pages/admin/Descuentos'
import Moderacion from './pages/admin/Moderacion'
import Mapa from './pages/admin/Mapa'
import Auditoria from './pages/admin/Auditoria'

// Componentes comunes
import AdminNavbar from './components/common/AdminNavbar'

/**
 * Envuelve rutas que requieren permisos de administrador.
 * - Muestra un loader si el estado de autenticación está cargando.
 * - Redirige a /login si no hay sesión o el rol no es "administrador".
 */
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

/**
 * Define el árbol de rutas de la aplicación.
 */
export default function App() {
  return (
    <Routes>
      {/* Autenticación */}
      <Route path="/login" element={<Login />} />

      {/* Administración */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedAdmin>
            <AdminDashboard />
          </ProtectedAdmin>
        }
      />
      <Route
        path="/admin/comercios"
        element={
          <ProtectedAdmin>
            <GestionComercios />
          </ProtectedAdmin>
        }
      />
      <Route
        path="/admin/duenos"
        element={
          <ProtectedAdmin>
            <GestionDuenos />
          </ProtectedAdmin>
        }
      />
      <Route
        path="/admin/reportes"
        element={
          <ProtectedAdmin>
            <ReportesDashboard />
          </ProtectedAdmin>
        }
      />
      <Route
        path="/admin/beneficiarios"
        element={
          <ProtectedAdmin>
            <Beneficiarios />
          </ProtectedAdmin>
        }
      />
      <Route
        path="/admin/descuentos"
        element={
          <ProtectedAdmin>
            <Descuentos />
          </ProtectedAdmin>
        }
      />
      <Route
        path="/admin/moderacion"
        element={
          <ProtectedAdmin>
            <Moderacion />
          </ProtectedAdmin>
        }
      />
      <Route
        path="/admin/mapa"
        element={
          <ProtectedAdmin>
            <Mapa />
          </ProtectedAdmin>
        }
      />
      <Route
        path="/admin/auditoria"
        element={
          <ProtectedAdmin>
            <Auditoria />
          </ProtectedAdmin>
        }
      />

      {/* Redirección catch-all */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
