import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Login from './pages/Login'
import AdminDashboard from './pages/admin/AdminDashboard'
import GestionComercios from './pages/admin/GestionComercios'
import GestionDuenos from './pages/admin/GestionDuenos'

function App() {
  const { isAuthenticated, isLoading, user} = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route 
        path="/admin/dashboard" 
        element={isAuthenticated && user?.role == 'administrador'? <AdminDashboard /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/admin/comercios" 
        element={isAuthenticated && user?.role == 'administrador'? <GestionComercios /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/admin/duenos" 
        element={isAuthenticated && user?.role == 'administrador'? <GestionDuenos /> : <Navigate to="/login" />} 
      />

      
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  )
}

export default App