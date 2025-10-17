// src/pages/admin/GestionComercios.jsx
import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import AdminNavbar from '../../components/common/AdminNavbar';
import { getSucursales, toggleSucursalStatus } from '../../api/services/admin-api-requests/comercios';
import ToggleSwitch from '../../components/common/ToggleSwitch';
import ConfirmToggleSucursalModal from '../../components/admin/comercios/ConfirmToggleSucursalModal';
import AddSucursalModal from '../../components/admin/comercios/AddSucursalModal';
import AddEstablecimientoModal from '../../components/admin/comercios/AddEstablecimientoModal';

function GestionComercios() {
  // Estados
  const [sucursales, setSucursales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showInactive, setShowInactive] = useState(false);
  const [selectedSucursal, setSelectedSucursal] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);
  const [isAddSucursalModalOpen, setIsAddSucursalModalOpen] = useState(false);
  const [isAddEstablecimientoModalOpen, setIsAddEstablecimientoModalOpen] = useState(false);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');


  // Cargar sucursales al montar el componente
  useEffect(() => {
    fetchSucursales();
  }, []);

  const fetchSucursales = async () => {
    setIsLoading(true);
    const result = await getSucursales();

    if (result.success) {
      setSucursales(result.data);
    } else {
      console.error('Error al cargar sucursales:', result.message);
    }

    setIsLoading(false);
  };

  // Filtrar sucursales por búsqueda y estado
  const filteredSucursales = sucursales.filter((sucursal) => {
    // Filtro por búsqueda
    const matchesSearch =
      (sucursal?.nombreSucursal || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sucursal?.categoria || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtro por estado (si showInactive es false, solo mostrar activos)
    const matchesStatus = showInactive ? true : sucursal.activo;
    
    return matchesSearch && matchesStatus;
  });

  const handleSort = (column) => {
    if (sortColumn === column) {
      // Si ya está seleccionada, alterna asc/desc
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sortedSucursales = [...filteredSucursales].sort((a, b) => {
    if (!sortColumn) return 0;
    
    const valA = (a[sortColumn] || '').toString().toLowerCase();
    const valB = (b[sortColumn] || '').toString().toLowerCase();

    if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
    if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleExportCSV = () => {
    // Preparar datos para CSV
    const dataToExport = sucursales.map((sucursal) => ({
      ID: sucursal.idSucursal,
      Nombre: sucursal.nombreSucursal,
      Establecimiento: sucursal.nombreEstablecimiento,
      Dirección: sucursal.direccion,
      Categoría: sucursal.categoria,
      'Hora Apertura': sucursal.horaApertura,
      'Hora Cierre': sucursal.horaCierre,
      Estado: sucursal.activo ? 'Activo' : 'Inactivo',
      'Fecha Registro': sucursal.fechaRegistro
        ? new Date(sucursal.fechaRegistro).toLocaleDateString('es-MX')
        : '',
    }));

    // Convertir a CSV
    const csv = Papa.unparse(dataToExport, {
      quotes: true,
      header: true,
    });

    // Crear blob y descargar
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `comercios_${new Date().toISOString().split('T')[0]}.csv`
    );
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  // Manejar Toggle de sucursal
  const handleToggleClick = (sucursal) => {
    setSelectedSucursal(sucursal);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmToggle = async () => {
    if (!selectedSucursal) return;

    setIsTogglingStatus(true);
    const result = await toggleSucursalStatus(selectedSucursal.idSucursal);

    if (result.success) {
      await fetchSucursales();
      setIsConfirmModalOpen(false);
      setSelectedSucursal(null);
    } else {
      alert('Error al cambiar el estado: ' + result.message);
    }

    setIsTogglingStatus(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Navbar fija y reutilizable */}
      <AdminNavbar />

      {/* Contenido Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Gestión de Comercios
        </h1>

        {/* Barra de acciones */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Búsqueda */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Buscar comercios..."
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-wrap gap-3">
              {/* Agregar Establecimiento */}
              <button 
                onClick={() => setIsAddEstablecimientoModalOpen(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                Agregar Establecimiento
              </button>

              {/* Agregar Sucursal */}
              <button
                onClick={() => setIsAddSucursalModalOpen(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Agregar Sucursal
              </button>

              {/* Exportar CSV */}
              <button
                onClick={handleExportCSV}
                disabled={sucursales.length === 0}
                className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Exportar CSV
              </button>

              {/* Ver Inactivos */}
              <button
                onClick={() => setShowInactive(!showInactive)}
                className={`border px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
                  showInactive
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {showInactive ? 'Ver Solo Activos' : 'Ver Inactivos'}
              </button>
            </div>
          </div>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {isLoading ? (
            // Loading skeleton
            <div className="p-8">
              <div className="animate-pulse space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          ) : filteredSucursales.length === 0 ? (
            // Sin resultados
            <div className="text-center py-12">
              <p className="text-gray-500">No se encontraron comercios</p>
            </div>
          ) : (
            // Tabla con datos
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {/* Nombre */}
                    <th
                      onClick={() => handleSort('nombreSucursal')}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                    >
                      Nombre
                      {sortColumn === 'nombreSucursal' && (
                        <span className="ml-1 text-purple-600">
                          {sortDirection === 'asc' ? '▲' : '▼'}
                        </span>
                      )}
                    </th>

                    {/* Establecimiento */}
                    <th
                      onClick={() => handleSort('nombreEstablecimiento')}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                    >
                      Establecimiento
                      {sortColumn === 'nombreEstablecimiento' && (
                        <span className="ml-1 text-purple-600">
                          {sortDirection === 'asc' ? '▲' : '▼'}
                        </span>
                      )}
                    </th>

                    {/* Dirección */}
                    <th
                      onClick={() => handleSort('direccion')}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                    >
                      Dirección
                      {sortColumn === 'direccion' && (
                        <span className="ml-1 text-purple-600">
                          {sortDirection === 'asc' ? '▲' : '▼'}
                        </span>
                      )}
                    </th>

                    {/* Categoría */}
                    <th
                      onClick={() => handleSort('categoria')}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                    >
                      Categoría
                      {sortColumn === 'categoria' && (
                        <span className="ml-1 text-purple-600">
                          {sortDirection === 'asc' ? '▲' : '▼'}
                        </span>
                      )}
                    </th>

                    {/* Estado */}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>

                    {/* Acciones */}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedSucursales.map((sucursal) => (
                    <tr key={sucursal.idSucursal} className="hover:bg-gray-50">
                      {/* Nombre */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {sucursal.nombreSucursal}
                        </div>
                      </td>

                      {/* Establecimiento */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {sucursal.nombreEstablecimiento}
                        </div>
                      </td>

                      {/* Dirección */}
                      <td className="px-6 py-4 whitespace-nowrap max-w-xs">
                        <div
                          className="text-sm text-gray-500 truncate"
                          title={sucursal.direccion}
                        >
                          {sucursal.direccion}
                        </div>
                      </td>

                      {/* Categoría */}
                      <td className="px-6 py-4 whitespace-nowrap max-w-[120px]">
                        <div
                          className="text-sm text-gray-500 truncate"
                          title={sucursal.categoria}
                        >
                          {sucursal.categoria}
                        </div>
                      </td>

                      {/* Estado */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            sucursal.activo
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {sucursal.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>

                      {/* Acciones */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-3">
                          {/* Botón Editar */}
                          <button className="text-purple-600 hover:text-purple-900">
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>

                          {/* Toggle Switch */}
                          <ToggleSwitch
                            isActive={sucursal.activo}
                            onToggle={() => handleToggleClick(sucursal)}
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

      {/* Modal: Agregar Establecimiento */}
      <AddEstablecimientoModal 
        isOpen={isAddEstablecimientoModalOpen}
        onClose={() => setIsAddEstablecimientoModalOpen(false)}
        onEstablecimientoCreated={fetchSucursales}
      />

      {/* Modal: Agregar Sucursal */}
      <AddSucursalModal 
        isOpen={isAddSucursalModalOpen}
        onClose={() => setIsAddSucursalModalOpen(false)}
        onSucursalCreated={fetchSucursales}
      />

      {/* Modal: Confirmar Toggle */}
      <ConfirmToggleSucursalModal 
        isOpen={isConfirmModalOpen}
        onClose={() => {
          setIsConfirmModalOpen(false);
          setSelectedSucursal(null);
        }}
        onConfirm={handleConfirmToggle}
        sucursal={selectedSucursal}
        isLoading={isTogglingStatus}
      />
    </div>
  );
}

export default GestionComercios;
