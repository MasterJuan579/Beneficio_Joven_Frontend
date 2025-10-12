// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

import Login from './pages/Login'
import AdminDashboard from './pages/admin/AdminDashboard'
import GestionComercios from './pages/admin/GestionComercios'
import GestionDuenos from './pages/admin/GestionDuenos'
import ReportesDashboard from './pages/admin/ReportesDashboard'
import AdminNavbar from './components/common/AdminNavbar'

// Wrapper para proteger rutas de admin
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

// Placeholder simple con navbar fija
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

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Rutas reales */}
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

      {/* Placeholders de secciones futuras */}
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

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
