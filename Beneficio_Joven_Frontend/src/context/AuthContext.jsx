/**
 * @file AuthContext.jsx
 * @description Contexto global de autenticación para la aplicación.
 * Administra el estado de usuario, token JWT, inicio de sesión, registro y cierre de sesión.
 * Provee un hook personalizado `useAuth` y un proveedor de contexto `AuthProvider`.
 *
 * @module context/AuthContext
 * @version 1.1.0
 */

import { createContext, useState, useContext, useEffect } from 'react';
import { login as loginService, register as registerService, logout as logoutService } from '../api/services/authService';
import { getUser, hasToken } from '../utils/tokenManager';

// Crear el contexto principal
const AuthContext = createContext();

/**
 * Hook personalizado para acceder al contexto de autenticación.
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
 */
export const AuthProvider = ({ children }) => {
  // Arrancamos loading en true para pulir la restauración de sesión
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Restaurar sesión al montar
  useEffect(() => {
    const initAuth = () => {
      if (hasToken()) {
        const userData = getUser();
        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  // Mapeo + normalización de rol para que siempre tengamos:
  // 'administrador' | 'dueno' | 'beneficiario'
  const normalizeRole = (raw) => {
    const r = String(raw || '').toLowerCase();
    const map = {
      admin: 'administrador',
      administrador: 'administrador',
      dueno: 'dueno',
      'dueño': 'dueno',
      beneficiario: 'beneficiario',
    };
    return map[r] || r;
  };

  /**
   * Inicia sesión en la aplicación.
   */
  const login = async (email, password) => {
    try {
      const result = await loginService(email, password);

      if (result.success) {
        const backendUser = result.data.user || {};
        const normalizedRole = normalizeRole(backendUser.role);

        const userToStore = { ...backendUser, role: normalizedRole };

        // Guardamos en estado; (el service ya guardó en localStorage)
        setUser(userToStore);
        setIsAuthenticated(true);

        // devolvemos el mismo shape pero con rol ya normalizado
        return { success: true, data: { ...result.data, user: userToStore } };
      }

      return result;
    } catch {
      return {
        success: false,
        message: 'Error inesperado al iniciar sesión',
      };
    }
  };

  /**
   * Registra un nuevo usuario.
   */
  const register = async (userData) => {
    try {
      const result = await registerService(userData);
      return result;
    } catch {
      return {
        success: false,
        message: 'Error inesperado al registrarse',
      };
    }
  };

  /**
   * Cierra sesión.
   */
  const logout = () => {
    logoutService(); // limpia storage y redirige a /login (tal como ya tienes)
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
