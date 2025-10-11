// src/components/common/AdminNavbar.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logoBeneficio from '../../assets/Logos/logo-beneficio.png';

function AdminNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate('/login');
  };

  const handleNavigate = () => {
    setOpen(false);
  };

  return (
    <nav className="bg-purple-600 shadow-lg fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Barra superior */}
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <img
              src={logoBeneficio}
              alt="Beneficio Joven"
              className="h-10"
            />
          </div>

          {/* Botón hamburguesa (solo móvil) */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? (
                // Icono X (cerrar)
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                // Icono ≡ (hamburguesa)
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          {/* Menú horizontal (desktop) */}
          <div className="hidden md:flex items-center justify-center space-x-8">
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

          {/* Usuario y logout (desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-800 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {user?.nombreUsuario?.charAt(0).toUpperCase() || 'A'}
                </span>
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
              <Link to="/admin/dashboard" onClick={handleNavigate} className="text-white hover:text-purple-200 px-3 py-2 text-sm font-medium">
                Inicio
              </Link>
              <Link to="/admin/comercios" onClick={handleNavigate} className="text-white hover:text-purple-200 px-3 py-2 text-sm font-medium">
                Comercios
              </Link>
              <Link to="/admin/duenos" onClick={handleNavigate} className="text-white hover:text-purple-200 px-3 py-2 text-sm font-medium">
                Dueños
              </Link>
              <a href="#" className="text-white hover:text-purple-200 px-3 py-2 text-sm font-medium" onClick={(e) => e.preventDefault()}>
                Beneficiarios
              </a>
              <a href="#" className="text-white hover:text-purple-200 px-3 py-2 text-sm font-medium" onClick={(e) => e.preventDefault()}>
                Reportes
              </a>
              <a href="#" className="text-white hover:text-purple-200 px-3 py-2 text-sm font-medium" onClick={(e) => e.preventDefault()}>
                Mapa
              </a>
              <a href="#" className="text-white hover:text-purple-200 px-3 py-2 text-sm font-medium" onClick={(e) => e.preventDefault()}>
                Descuentos
              </a>

              {/* Usuario + Logout en móvil */}
              <div className="flex items-center justify-between pt-3 border-t border-purple-500 mt-2">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-800 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {user?.nombreUsuario?.charAt(0).toUpperCase() || 'A'}
                    </span>
                  </div>
                  <span className="text-white text-sm">
                    {user?.nombreUsuario || 'Admin'}
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
