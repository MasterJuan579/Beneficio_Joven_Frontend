import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

import Login from './pages/Login'
import AdminDashboard from './pages/admin/AdminDashboard'
import GestionComercios from './pages/admin/GestionComercios'
import GestionDuenos from './pages/admin/GestionDuenos'
import ReportesDashboard from './pages/admin/ReportesDashboard'
import AdminNavbar from './components/common/AdminNavbar'
import ProtectedMultiRole from './components/common/ProtectedMultiRole'

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

function TestUserInfo() {
  const { user } = useAuth()

  return (
    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
        Información de Sesión
      </h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Usuario:</span>
          <span className="font-semibold text-gray-900">{user?.nombreUsuario || 'N/A'}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Email:</span>
          <span className="font-semibold text-gray-900">{user?.email || 'N/A'}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Rol:</span>
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              user?.role === 'administrador'
                ? 'bg-purple-100 text-purple-800'
                : 'bg-blue-100 text-blue-800'
            }`}
          >
            {user?.role || 'N/A'}
          </span>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      {/* Autenticación */}
      <Route path="/login" element={<Login />} />

      {/* RUTA DE PRUEBA */}
      <Route
        path="/test-multi-role"
        element={
          <ProtectedMultiRole allowedRoles={['administrador', 'dueno']}>
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-6">
              <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-10 h-10 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    ✅ Guard Multi-Rol Funcionando
                  </h1>
                  <p className="text-gray-600">
                    Si puedes ver esta página, tienes permisos de <strong>Administrador</strong> o <strong>Dueño</strong>
                  </p>
                </div>

                <TestUserInfo />

                <div className="mt-8 space-y-3">
                  <button
                    onClick={() => window.history.back()}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition"
                  >
                    ← Volver Atrás
                  </button>

                  <a
                    href="/login"
                    className="block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg transition"
                  >
                    Cerrar Sesión y Probar de Nuevo
                  </a>
                </div>
              </div>
            </div>
          </ProtectedMultiRole>
        }
      />

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

      {/* Administración: placeholders */}
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
