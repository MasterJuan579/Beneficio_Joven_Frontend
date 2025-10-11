// src/pages/admin/GestionDuenos.jsx
import { useState, useEffect } from 'react';
import AdminNavbar from '../../components/common/AdminNavbar';
import { getDuenos, toggleDuenoStatus } from '../../api/services/admin-api-requests/duenos';
import EditDuenoModal from '../../components/admin/duenos/EditDuenoModal';
import AddDuenoModal from '../../components/admin/duenos/AddDuenoModal';
import ConfirmToggleModal from '../../components/admin/duenos/ConfirmToggleModal';
import ToggleSwitch from '../../components/common/ToggleSwitch';


function GestionDuenos() {
  // Estados
  const [duenos, setDuenos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDueno, setSelectedDueno] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDuenoForEdit, setSelectedDuenoForEdit] = useState(null);


  // Cargar dueños al montar el componente
  useEffect(() => {
    fetchDuenos();
  }, []);

  const fetchDuenos = async () => {
    console.log('🔄 Iniciando carga de dueños...');
    setIsLoading(true);
    const result = await getDuenos();
    if (result.success) {
      console.log('✅ Dueños recibidos:', result.data.length, 'registros');
      console.log('📋 Datos completos:', result.data);
      setDuenos(result.data);
    } else {
      console.error('❌ Error al cargar dueños:', result.message);
    }

    setIsLoading(false);
  };

  // Filtrar dueños por búsqueda (con fallback de strings para evitar errores)
  const filteredDuenos = duenos.filter((dueno) =>
    (dueno?.nombreUsuario || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (dueno?.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Manejar el toggle de Activar / Desactivar
  const handleToggleClick = (dueno) => {
    setSelectedDueno(dueno);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmToggle = async () => {
    if (!selectedDueno) return;
    
    setIsTogglingStatus(true);
    const result = await toggleDuenoStatus(selectedDueno.idDueno);

    if (result.success) {
      await fetchDuenos();              // Recargar la lista
      setIsConfirmModalOpen(false);     // Cerrar modal
      setSelectedDueno(null);
    } else {
      alert('Error al cambiar el estado: ' + result.message);
    }

    setIsTogglingStatus(false);
  };

    // Función para abrir modal de edición
  const handleEditClick = (dueno) => {
    setSelectedDuenoForEdit(dueno);
    setIsEditModalOpen(true);
  };


  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Navbar fija y reutilizable */}
      <AdminNavbar />

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
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition flex items-center gap-2"
              >
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
            // Loading State
            <div className="p-8">
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          ) : filteredDuenos.length === 0 ? (
            // Estado Sin Resultados
            <div className="text-center py-12">
              <p className="text-gray-500">No se encontraron dueños</p>
            </div>
          ) : (
            // Tabla con Datos
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                {/* Encabezados */}
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

                {/* Cuerpo */}
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDuenos.map((dueno) => (
                    <tr key={dueno.idDueno} className="hover:bg-gray-50">
                      {/* Nombre Usuario */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {dueno.nombreUsuario}
                        </div>
                      </td>
                      {/* Email */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {dueno.email}
                        </div>
                      </td>
                      {/* Establecimientos */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {dueno.cantidadEstablecimientos || 0}
                        </div>
                      </td>
                      {/* Estado */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            dueno.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {dueno.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      {/* Acciones */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-3">
                          {/* Editar */}
                          <button 
                            onClick={() => handleEditClick(dueno)}
                            className="text-purple-600 hover:text-purple-900"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>

                          {/* Toggle Switch: Activar/Desactivar */}
                          <ToggleSwitch
                            isActive={dueno.activo}
                            onToggle={() => handleToggleClick(dueno)}
                          />
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

      {/* Modal: Crear Dueño */}
      <AddDuenoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDuenoCreated={fetchDuenos}
      />

      {/* Modal de Confirmación Toggle */}
      <ConfirmToggleModal
        isOpen={isConfirmModalOpen}
        onClose={() => {
          setIsConfirmModalOpen(false);
          setSelectedDueno(null);
        }}
        onConfirm={handleConfirmToggle}
        dueno={selectedDueno}
        isLoading={isTogglingStatus}
      />

      <EditDuenoModal 
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedDuenoForEdit(null);
        }}
        onDuenoUpdated={fetchDuenos}
        dueno={selectedDuenoForEdit}
      />
    </div>
  );
}

export default GestionDuenos;
