import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-purple-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <img 
                src="../src/assets/Logos/logo-beneficio.png" 
                alt="Beneficio Joven" 
                className="h-10"
              />
            </div>

            {/* Menú de navegación */}
            <div className="hidden md:flex space-x-8">
              <a href="#" className="text-white hover:text-purple-200 px-3 py-2 text-sm font-medium">
                Inicio
              </a>
              <a href="#" className="text-white hover:text-purple-200 px-3 py-2 text-sm font-medium">
                Comercios
              </a>
              <a href="#" className="text-white hover:text-purple-200 px-3 py-2 text-sm font-medium">
                Beneficiarios
              </a>
              <a href="#" className="text-white hover:text-purple-200 px-3 py-2 text-sm font-medium">
                Reportes
              </a>
              <a href="#" className="text-white hover:text-purple-200 px-3 py-2 text-sm font-medium">
                Mapa
              </a>
              <a href="#" className="text-white hover:text-purple-200 px-3 py-2 text-sm font-medium">
                Descuentos
              </a>
            </div>

            {/* Usuario y logout */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-800 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {user?.nombreUsuario?.charAt(0).toUpperCase() || 'A'}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-white text-purple-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-50 transition"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenido Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Título */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Panel de Control Administrativo
          </h1>
          <p className="text-gray-600 mt-2">
            Bienvenido de nuevo, {user?.nombreUsuario}. Aquí tienes un resumen del programa.
          </p>
        </div>

        {/* Acciones Principales */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Acciones Principales
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Tarjeta 1: Validar Tarjeta */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                    <img 
                        src="../src/assets/icons/icono-qr.png" 
                        alt="Validar Tarjeta" 
                        className="w-8 h-8"
                    />
                                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Validar Tarjeta
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Verifica la validez y el estado de las tarjetas de beneficios de los jóvenes.
              </p>
              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 rounded-lg transition">
                Validar
              </button>
            </div>

            {/* Tarjeta 2: Gestión de Comercios */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                    <img 
                        src="../src/assets/icons/icono-tienda.png" 
                        alt="Validar Tarjeta" 
                        className="w-8 h-8"
                    />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Gestión de Comercios
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Administra la lista de negocios afiliados, descuentos y detalles de contacto.
              </p>
              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 rounded-lg transition">
                Gestionar
              </button>
            </div>

            {/* Tarjeta 3: Gestión de Beneficiarios */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                    <img 
                        src="../src/assets/icons/icono-usuario.png" 
                        alt="Validar Tarjeta" 
                        className="w-8 h-8"
                    />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Gestión de Beneficiarios
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Maneja el registro, información y estado de los jóvenes beneficiarios del programa.
              </p>
              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 rounded-lg transition">
                Gestionar
              </button>
            </div>

            {/* Tarjeta 4: Reportes y Estadísticas */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                    <img 
                        src="../src/assets/icons/icono-reporte.png" 
                        alt="Validar Tarjeta" 
                        className="w-8 h-8"
                    />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Reportes y Estadísticas
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Accede a gráficos y datos para analizar el rendimiento y el impacto del programa.
              </p>
              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 rounded-lg transition">
                Ver Reportes
              </button>
            </div>

          </div>
        </div>

        {/* Estadísticas Rápidas */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Estadísticas Rápidas
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Beneficiarios Registrados */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-600">
                  Beneficiarios Registrados
                </h3>
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <p className="text-4xl font-bold text-gray-900 mb-2">1,245</p>
              <p className="text-sm text-green-600">+5% desde el mes pasado</p>
            </div>

            {/* Comercios Afiliados */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-600">
                  Comercios Afiliados
                </h3>
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <p className="text-4xl font-bold text-gray-900 mb-2">85</p>
              <p className="text-sm text-green-600">+2 nuevos este mes</p>
            </div>

            {/* Descuentos Utilizados */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-600">
                  Descuentos Utilizados
                </h3>
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-4xl font-bold text-gray-900 mb-2">7,890</p>
              <p className="text-sm text-green-600">+12% esta semana</p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;