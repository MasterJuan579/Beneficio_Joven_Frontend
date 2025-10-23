/**
 * @file AdminDashboard.jsx
 * @description Página principal del panel de control administrativo.
 * @module pages/admin/AdminDashboard
 * @version 1.1.0
 */

import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getDashboardStats } from "../../api/services/admin-api-requests/dashboard";

function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Estado local para estadísticas del panel (con defaults defensivos)
  const [stats, setStats] = useState({
    beneficiariosRegistrados: 0,
    comerciosAfiliados: 0,
    descuentosDadosAlta: 0,
  });
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoadingStats(true);
      try {
        const result = await getDashboardStats();
        if (result?.success && result?.data) {
          setStats({
            beneficiariosRegistrados: Number(result.data.beneficiariosRegistrados) || 0,
            comerciosAfiliados: Number(result.data.comerciosAfiliados) || 0,
            descuentosDadosAlta: Number(result.data.descuentosDadosAlta) || 0,
          });
        } else {
          console.error("Error al cargar estadísticas:", result?.message);
        }
      } catch (e) {
        console.error("Error al cargar estadísticas:", e);
      } finally {
        setIsLoadingStats(false);
      }
    };

    fetchStats();
  }, []);

  // Helper seguro para toLocaleString
  const fmt = (n) => {
    const num = Number(n);
    return Number.isFinite(num) ? num.toLocaleString("es-MX") : "0";
    // (Si quieres forzar sin decimales: .toLocaleString("es-MX", { maximumFractionDigits: 0 }))
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Contenedor principal (el padding-top lo pone el layout con el navbar) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Encabezado */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Panel de Control Administrativo
          </h1>
          <p className="text-gray-600 mt-2">
            Bienvenido de nuevo{user?.nombreUsuario ? `, ${user.nombreUsuario}` : ""}. Aquí tienes un resumen del programa.
          </p>
        </div>

        {/* Acciones principales */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Acciones Principales
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 1: Validar Tarjeta */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  {/* Ícono inline para evitar rutas rotas */}
                  <svg className="w-8 h-8 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M3 7h18M3 12h18M7 17h10M8 21h8M9 3h6" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Moderación
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Modera las promociones agregadas por el el dueño
              </p>
              <button
                onClick={() => navigate("/admin/moderacion")}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 rounded-lg transition"
              >
                Moderar
              </button>
            </div>

            {/* 2: Gestión de Comercios */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <svg className="w-8 h-8 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M3 7l1 9a2 2 0 002 2h12a2 2 0 002-2l1-9M7 7V5a2 2 0 012-2h6a2 2 0 012 2v2M5 7h14" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Gestión de Comercios
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Administra negocios afiliados, descuentos y contactos.
              </p>
              <Link
                to="/admin/comercios"
                className="block text-center bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 rounded-lg transition"
              >
                Gestionar
              </Link>
            </div>

            {/* 3: Gestión de Beneficiarios */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <svg className="w-8 h-8 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2a5 5 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Gestión de Beneficiarios
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Maneja el registro, información y estado de los beneficiarios.
              </p>
              <Link
                to="/admin/beneficiarios"
                className="block text-center bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 rounded-lg transition"
              >
                Gestionar
              </Link>
            </div>

            {/* 4: Reportes y Estadísticas */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <svg className="w-8 h-8 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M11 3v18M3 13h18M7 17h4M7 9h8" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Reportes y Estadísticas
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Analiza el rendimiento e impacto del programa.
              </p>
              <Link
                to="/admin/reportes"
                className="block text-center bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 rounded-lg transition"
              >
                Ver Reportes
              </Link>
            </div>
          </div>
        </div>

        {/* Estadísticas rápidas */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Estadísticas Rápidas
          </h2>

          {isLoadingStats ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded w-1/2 mb-2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Beneficiarios Registrados */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-600">
                    Beneficiarios Registrados
                  </h3>
                  <svg className="w-8 h-8 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <p className="text-4xl font-bold text-gray-900">
                  {fmt(stats.beneficiariosRegistrados)}
                </p>
              </div>

              {/* Comercios Afiliados */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-600">
                    Comercios Afiliados
                  </h3>
                  <svg className="w-8 h-8 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <p className="text-4xl font-bold text-gray-900">
                  {fmt(stats.comerciosAfiliados)}
                </p>
              </div>

              {/* Descuentos dados de Alta */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-600">
                    Descuentos dados de Alta
                  </h3>
                  <svg className="w-8 h-8 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-4xl font-bold text-gray-900">
                  {fmt(stats.descuentosDadosAlta)}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
