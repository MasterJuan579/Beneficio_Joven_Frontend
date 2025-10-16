/**
 * @file AuthContext.jsx
 * @description Contexto global de autenticación para la aplicación.
 * Administra el estado de usuario, token JWT, inicio de sesión, registro y cierre de sesión.
 * Provee un hook personalizado `useAuth` y un proveedor de contexto `AuthProvider`.
 *
 * @module context/AuthContext
 * @version 1.0.0
 */

import { createContext, useState, useContext, useEffect } from 'react';
import { login as loginService, register as registerService, logout as logoutService } from '../api/services/authService';
import { getToken, getUser, hasToken } from '../utils/tokenManager';

// Crear el contexto principal
const AuthContext = createContext();

/**
 * Hook personalizado para acceder al contexto de autenticación.
 * 
 * @function useAuth
 * @returns {{
 *   user: Object|null,
 *   isAuthenticated: boolean,
 *   isLoading: boolean,
 *   login: (email: string, password: string) => Promise<{success: boolean, data?: Object, message?: string}>,
 *   register: (userData: Object) => Promise<{success: boolean, data?: Object, message?: string}>,
 *   logout: () => void
 * }}
 * Devuelve el estado y las funciones de autenticación.
 * 
 * @throws {Error} Si se usa fuera de un `AuthProvider`.
 *
 * @example
 * const { user, isAuthenticated, login, logout } = useAuth();
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

/**
 * Proveedor del contexto de autenticación.
 *
 * @component
 * @param {Object} props - Propiedades del componente.
 * @param {React.ReactNode} props.children - Componentes hijos que tendrán acceso al contexto de autenticación.
 *
 * @example
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getUser());
  const [isAuthenticated, setIsAuthenticated] = useState(() => hasToken());
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Inicializa el contexto verificando si existe un token y usuario guardado.
   * @function
   * @private
   */
  useEffect(() => {
    const initAuth = () => {
      if (hasToken()) {
        const userData = getUser();
        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
        }
      }
    };
    initAuth();
  }, []);

  /**
   * Inicia sesión en la aplicación.
   *
   * @async
   * @function login
   * @param {string} email - Correo electrónico del usuario.
   * @param {string} password - Contraseña del usuario.
   * @returns {Promise<{success: boolean, data?: Object, message?: string}>}
   * Resultado del intento de inicio de sesión.
   */
  const login = async (email, password) => {
    try {
      const result = await loginService(email, password);

      if (result.success) {
        setUser(result.data.user);
        setIsAuthenticated(true);
        return { success: true, data: result.data };
      }

      return result;
    } catch (error) {
      return {
        success: false,
        message: 'Error inesperado al iniciar sesión',
      };
    }
  };

  /**
   * Registra un nuevo usuario.
   *
   * @async
   * @function register
   * @param {Object} userData - Datos del usuario a registrar.
   * @returns {Promise<{success: boolean, data?: Object, message?: string}>}
   * Resultado del intento de registro.
   */
  const register = async (userData) => {
    try {
      const result = await registerService(userData);
      return result;
    } catch (error) {
      return {
        success: false,
        message: 'Error inesperado al registrarse',
      };
    }
  };

  /**
   * Cierra la sesión actual del usuario.
   *
   * @function logout
   * @returns {void}
   */
  const logout = () => {
    logoutService();
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
