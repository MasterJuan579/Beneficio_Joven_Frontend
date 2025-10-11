import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getDuenos } from '../../api/services/admin-api-requests/duenos';

function GestionDuenos() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Estados
  const [duenos, setDuenos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Cargar dueños al montar el componente
  useEffect(() => {
    fetchDuenos();
  }, []);

  const fetchDuenos = async () => {
    setIsLoading(true);
    const result = await getDuenos();
    
    if (result.success) {
      setDuenos(result.data);
    } else {
      console.error('Error al cargar dueños:', result.message);
    }
    
    setIsLoading(false);
  };

  // Filtrar dueños por búsqueda
  const filteredDuenos = duenos.filter(dueno =>
    dueno.nombreUsuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dueno.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <div className="flex items-center">
              <img 
                src="../src/assets/Logos/logo-beneficio.png" 
                alt="Beneficio Joven" 
                className="h-10"
              />
            </div>

            <div className="hidden md:flex space-x-8">
              <Link to="/admin/dashboard" className="text-white hover:text-purple-200 px-3 py-2 text-sm font-medium">
                Inicio
              </Link>
              <Link to="/admin/comercios" className="text-white hover:text-purple-200 px-3 py-2 text-sm font-medium">
                Comercios
              </Link>
              <Link to="/admin/duenos" className="text-white hover:text-purple-200 px-3 py-2 text-sm font-medium">
                Dueños
              </Link>
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
        
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Gestión de Dueños
        </h1>

        {/* Barra de acciones */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            
            {/* Búsqueda */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Buscar dueños..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              />
              <svg 
                className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Botones */}
            <div className="flex gap-3">
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Agregar Dueño
              </button>
            </div>

          </div>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {isLoading ? (
            <div className="p-8">
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          ) : filteredDuenos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No se encontraron dueños</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre Usuario
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Establecimientos
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDuenos.map((dueno) => (
                    <tr key={dueno.idDueno} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {dueno.nombreUsuario}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {dueno.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {dueno.cantidadEstablecimientos || 0}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          dueno.activo 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {dueno.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-3">
                          <button className="text-purple-600 hover:text-purple-900">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button className={dueno.activo ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default GestionDuenos;