// src/context/AuthContext.jsx
import { createContext, useState, useContext, useEffect } from 'react';
import { login as loginService, register as registerService, logout as logoutService } from '../api/services/authService';
import { getToken, getUser, hasToken } from '../utils/tokenManager';

// Crear el contexto
const AuthContext = createContext();

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

// Provider del contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Al cargar la app, verificar si hay un usuario autenticado
  useEffect(() => {
    const initAuth = () => {
      if (hasToken()) {
        const userData = getUser();
        setUser(userData);
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  // Función de Login
  const login = async (email, password) => {
    try {
      const result = await loginService(email, password);

      if (result.success) {
        setUser(result.data.user);
        setIsAuthenticated(true);
        
        const { role } = result.data.user;
        
        const routes = {
          'administrador': '/admin/dashboard',
          'dueno': '/comercio/dashboard',
          'beneficiario': '/beneficiario/dashboard'
        };
        
        window.location.href = routes[role] || '/dashboard';
        
        return { success: true, data: result.data };
      }

      return result; // Retorna el error
    } catch (error) {
      return {
        success: false,
        message: 'Error inesperado al iniciar sesión',
      };
    }
  };

  // Función de Register
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

  // Función de Logout
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