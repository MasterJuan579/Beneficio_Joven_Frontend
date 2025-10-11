import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Login from './pages/Login'
import AdminDashboard from './pages/admin/AdminDashboard'
import GestionComercios from './pages/admin/GestionComercios'
import GestionDuenos from './pages/admin/GestionDuenos'
import AdminNavbar from './components/common/AdminNavbar'  // ⬅️ para los placeholders

function App() {
  const { isAuthenticated, isLoading, user } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  const isAdmin = isAuthenticated && user?.role === 'administrador'

  // Pequeño helper para placeholders con navbar fija
  const Placeholder = ({ title }) => (
    <>
      <AdminNavbar />
      <div className="min-h-screen bg-gray-50 pt-16 p-6">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="text-gray-600 mt-2">Sección en construcción.</p>
      </div>
    </>
  )

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Rutas existentes */}
      <Route
        path="/admin/dashboard"
        element={isAdmin ? <AdminDashboard /> : <Navigate to="/login" />}
      />
      <Route
        path="/admin/comercios"
        element={isAdmin ? <GestionComercios /> : <Navigate to="/login" />}
      />
      <Route
        path="/admin/duenos"
        element={isAdmin ? <GestionDuenos /> : <Navigate to="/login" />}
      />

      {/* NUEVAS RUTAS de la navbar */}
      <Route
        path="/admin/beneficiarios"
        element={isAdmin ? <Placeholder title="Beneficiarios" /> : <Navigate to="/login" />}
      />
      <Route
        path="/admin/descuentos"
        element={isAdmin ? <Placeholder title="Descuentos" /> : <Navigate to="/login" />}
      />
      <Route
        path="/admin/reportes"
        element={isAdmin ? <Placeholder title="Reportes - Dashboard" /> : <Navigate to="/login" />}
      />
      <Route
        path="/admin/moderacion"
        element={isAdmin ? <Placeholder title="Moderación" /> : <Navigate to="/login" />}
      />
      <Route
        path="/admin/mapa"
        element={isAdmin ? <Placeholder title="Mapa" /> : <Navigate to="/login" />}
      />
      <Route
        path="/admin/auditoria"
        element={isAdmin ? <Placeholder title="Auditoría" /> : <Navigate to="/login" />}
      />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  )
}

export default App
