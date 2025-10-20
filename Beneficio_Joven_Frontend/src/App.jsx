/**
 * @file App.jsx
 * @description Definición de rutas principales de la aplicación usando React Router v6.
 * Incluye protección de rutas administrativas mediante `ProtectedAdmin`,
 * rutas compartidas mediante `ProtectedShared` (admin + dueño)
 * y vistas placeholder para secciones futuras.
 *
 * @module App
 * @version 1.1.0
 */

import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

import Login from './pages/Login'
import AdminDashboard from './pages/admin/AdminDashboard'
import GestionComercios from './pages/admin/GestionComercios'
import GestionDuenos from './pages/admin/GestionDuenos'
import ReportesDashboard from './pages/admin/ReportesDashboard'
import AdminNavbar from './components/common/AdminNavbar'

// Importar cuando esté creado el componente
// import EditSucursalPage from './pages/shared/EditSucursalPage'

/**
 * Envuelve rutas que requieren permisos de administrador.
 * - Muestra un loader si el estado de autenticación está cargando.
 * - Redirige a /login si no hay sesión o el rol no es "administrador".
 *
 * @component
 * @param {{ children: React.ReactNode }} props
 * @returns {JSX.Element}
 *
 * @example
 * <ProtectedAdmin>
 *   <AdminDashboard />
 * </ProtectedAdmin>
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
  

  return (
    isAuthenticated && user?.role === 'administrador'
      ? children
      : <Navigate to="/login" replace />
  )
}

/**
 * Envuelve rutas accesibles tanto por administrador como dueño.
 * - Muestra loader si el estado de autenticación está cargando.
 * - Redirige a /login si no hay sesión o el rol no está permitido.
 *
 * @component
 * @param {{ children: React.ReactNode }} props
 * @returns {JSX.Element}
 *
 * @example
 * <ProtectedShared>
 *   <EditSucursalPage />
 * </ProtectedShared>
 */
function ProtectedShared({ children }) {
  const { isAuthenticated, isLoading, user } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  const allowedRoles = ['administrador', 'dueno'];
  
  return (isAuthenticated && allowedRoles.includes(user?.role))
    ? children
    : <Navigate to="/login" replace />
}

/**
 * Vista de marcador de posición con `AdminNavbar` y mensaje de sección en construcción.
 *
 * @component
 * @param {{ title: string }} props
 * @returns {JSX.Element}
 *
 * @example
 * <Placeholder title="Beneficiarios" />
 */
function Placeholder({ title }) {
  return (
    <>
      <AdminNavbar />
      <div className="min-h-screen bg-gray-50 pt-16 p-6">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="text-gray-600 mt-2">Sección en construcción.</p>
      </div>
    </>
  )
}

/**
 * Define el árbol de rutas de la aplicación.
 * - Rutas de autenticación: `/login`
 * - Rutas de administración protegidas: `/admin/*`
 * - Rutas compartidas (admin + dueño): `/editar-sucursal/:id`
 * - Redirección por defecto a `/login` para rutas desconocidas.
 *
 * @component
 * @returns {JSX.Element}
 */
export default function App() {
  return (
    <Routes>
      {/* Autenticación */}
      <Route path="/login" element={<Login />} />

      {/* Administración: reales */}
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

      {/* 🆕 RUTA COMPARTIDA: Editar Sucursal (Admin + Dueño) */}
      <Route
        path="/editar-sucursal/:id"
        element={
          <ProtectedShared>
            <Placeholder title="Editar Sucursal" />
          </ProtectedShared>
        }
      />

      {/* Administración: placeholders de secciones futuras */}
      <Route
        path="/admin/beneficiarios"
        element={
          <ProtectedAdmin>
            <Placeholder title="Beneficiarios" />
          </ProtectedAdmin>
        }
      />
      <Route
        path="/admin/descuentos"
        element={
          <ProtectedAdmin>
            <Placeholder title="Descuentos" />
          </ProtectedAdmin>
        }
      />
      <Route
        path="/admin/moderacion"
        element={
          <ProtectedAdmin>
            <Placeholder title="Moderación" />
          </ProtectedAdmin>
        }
      />
      <Route
        path="/admin/mapa"
        element={
          <ProtectedAdmin>
            <Placeholder title="Mapa" />
          </ProtectedAdmin>
        }
      />
      <Route
        path="/admin/auditoria"
        element={
          <ProtectedAdmin>
            <Placeholder title="Auditoría" />
          </ProtectedAdmin>
        }
      />

      {/* Redirección catch-all */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}