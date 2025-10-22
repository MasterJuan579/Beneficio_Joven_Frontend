/**
 * @file AdminNavbar.jsx
 * @description Navbar único y responsivo que se adapta por rol (administrador / dueño).
 * Compatible con tu estructura de carpetas (usa rutas relativas, no alias).
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logoBeneficio from '../../assets/Logos/logo-beneficio.png';

/**
 * Ítems del menú para administrador.
 * Puedes ajustar o agregar más rutas según tus vistas.
 */
const ADMIN_MENU = [
  { label: 'Inicio', to: '/admin/dashboard' },
  { label: 'Comercios', to: '/admin/comercios' },
  { label: 'Dueños', to: '/admin/duenos' },
  { label: 'Beneficiarios', to: '/admin/beneficiarios' },
  { label: 'Descuentos', to: '/admin/descuentos' },
  { label: 'Reportes', to: '/admin/reportes' },
  { label: 'Moderación', to: '/admin/moderacion' },
  { label: 'Auditoría', to: '/admin/auditoria' },
  { label: 'Mapa', to: '/admin/mapa' },
];

/**
 * Ítems del menú para dueño de comercio.
 */
const OWNER_MENU = [
  { label: 'Dashboard', to: '/owner/dashboard' },
  { label: 'Mis Sucursales', to: '/owner/sucursales' },
  { label: 'Crear Promoción', to: '/owner/promos/nueva' },
  { label: 'Reglas de Moderación', to: '/owner/moderacion/reglas' },
];

function AdminNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  // Detecta el rol del usuario logueado
  const role = user?.role || 'administrador';
  const menuItems = role === 'administrador' ? ADMIN_MENU : OWNER_MENU;

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate('/login');
  };

  const handleNavigate = () => setOpen(false);

  return (
    <nav className="bg-purple-600 shadow-lg fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Barra superior */}
        <div className="flex justify-between items-center h-16">
          {/* Logo + nombre */}
          <div className="flex items-center space-x-2">
            <img src={logoBeneficio} alt="Beneficio Joven" className="h-10 w-auto" />
            <span className="hidden sm:block text-white font-semibold text-lg">
              Beneficio Joven
            </span>
          </div>

          {/* Botón hamburguesa (móvil) */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          {/* Menú horizontal (desktop) */}
          <div className="hidden md:flex items-center justify-center space-x-6">
            {menuItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="text-white hover:text-purple-200 px-2 py-2 text-sm font-medium"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Usuario y logout (desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-800 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {user?.nombreUsuario?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div className="text-white text-sm capitalize">
                {user?.nombreUsuario || 'Usuario'} ({role})
              </div>
              <button
                onClick={handleLogout}
                aria-label="Cerrar sesión"
                className="bg-white text-purple-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-50 transition"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>

        {/* Menú desplegable (móvil) */}
        {open && (
          <div className="md:hidden pb-4 bg-purple-600">
            <div className="flex flex-col space-y-2 pt-2">
              {menuItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={handleNavigate}
                  className="text-white hover:text-purple-200 px-3 py-2 text-sm font-medium"
                >
                  {item.label}
                </Link>
              ))}
              {/* Usuario + Logout en móvil */}
              <div className="flex items-center justify-between pt-3 border-t border-purple-500 mt-2">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-800 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {user?.nombreUsuario?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span className="text-white text-sm">
                    {user?.nombreUsuario || 'Usuario'} ({role})
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  aria-label="Cerrar sesión"
                  className="bg-white text-purple-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-purple-50 transition"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default AdminNavbar;
