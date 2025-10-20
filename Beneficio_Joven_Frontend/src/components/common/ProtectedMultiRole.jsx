/**
 * @file ProtectedMultiRole.jsx
 * @description Guard para rutas que permiten múltiples roles de usuario.
 * Valida si el usuario autenticado tiene uno de los roles permitidos.
 *
 * @module components/common/ProtectedMultiRole
 * @version 1.0.0
 */

import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Componente de protección de rutas multi-rol.
 *
 * @component
 * @param {Object} props - Propiedades del componente.
 * @param {React.ReactNode} props.children - Componentes hijos a renderizar si tiene permiso.
 * @param {string[]} props.allowedRoles - Array de roles permitidos (ej: ['administrador', 'dueno']).
 * @param {string} [props.redirectTo='/login'] - Ruta de redirección si no tiene permiso.
 *
 * @example
 * <ProtectedMultiRole allowedRoles={['administrador', 'dueno']}>
 *   <EditarSucursal />
 * </ProtectedMultiRole>
 */
function ProtectedMultiRole({ 
  children, 
  allowedRoles = [], 
  redirectTo = '/login' 
}) {
  const { isAuthenticated, isLoading, user } = useAuth();

  // Mostrar loader mientras verifica autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  // Verificar autenticación
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // Verificar que el usuario tenga uno de los roles permitidos
  const hasPermission = allowedRoles.includes(user?.role);

  if (!hasPermission) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg 
              className="w-8 h-8 text-red-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Acceso Denegado
          </h2>
          <p className="text-gray-600 mb-6">
            No tienes permisos para acceder a esta sección.
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition"
          >
            Volver Atrás
          </button>
        </div>
      </div>
    );
  }

  // Usuario autenticado y con rol permitido
  return children;
}

export default ProtectedMultiRole;