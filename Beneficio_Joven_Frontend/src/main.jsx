/**
 * @file main.jsx
 * @description Punto de entrada principal del proyecto React (Vite).
 * Monta el árbol raíz de la aplicación e inicializa el enrutamiento y contexto global de autenticación.
 * 
 * @module Main
 * @version 1.0.0
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // ← Manejo de rutas del lado del cliente
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

/**
 * Renderiza la aplicación React dentro del contenedor raíz del DOM.
 * 
 * Estructura de envoltura:
 * - `<StrictMode>`: Detecta problemas potenciales en desarrollo.
 * - `<BrowserRouter>`: Habilita navegación declarativa (React Router).
 * - `<AuthProvider>`: Provee contexto global de autenticación (login/logout/estado de usuario).
 * - `<App>`: Contenedor principal que define todas las rutas y vistas.
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
