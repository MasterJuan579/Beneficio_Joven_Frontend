import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function Login() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

    const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
        const result = await login(formData.email, formData.password);
        
        if (!result.success) {
        setError(result.message || "Error al iniciar sesión");
        }
        
    } catch (err) {
        setError("Error inesperado. Intenta de nuevo.");
        console.error("Error en login:", err);
    } finally {
        setIsLoading(false);
    }
    };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* Logo esquina superior izquierda */}
      <div className="absolute top-6 left-6">
        <img
          src="src/assets/logo-beneficio.png"
          alt="Beneficio Joven"
          className="h-12"
        />
      </div>

      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Logo de Dirección de la Juventud */}
          <div className="flex justify-center mb-6">
            <img
              src="src/assets/logo-juventud.png"
              alt="Dirección de la Juventud"
              className="h-21"
            />
          </div>

          {/* Título */}
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
            Iniciar Sesión
          </h2>

          {/* Subtítulo */}
          <p className="text-center text-gray-600 mb-6">
            Accede a tu plataforma de gestión
          </p>

          {/* Mensaje de Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Campo Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Ingresa tu email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                required
                disabled={isLoading} // ← Deshabilita mientras carga
              />
            </div>

            {/* Campo Contraseña */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Ingresa tu contraseña"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                required
                disabled={isLoading} // ← Deshabilita mientras carga
              />
            </div>

            {/* Olvidé mi contraseña */}
            <div className="text-right">
              <a
                href="#"
                className="text-sm text-purple-600 hover:text-purple-700"
              >
                Olvidé mi contraseña
              </a>
            </div>

            {/* Botón Ingresar */}
            <button
              type="submit"
              disabled={isLoading} // ← Deshabilita mientras carga
              className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2.5 rounded-lg transition duration-200 disabled:bg-purple-300 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Cargando...
                </>
              ) : (
                "Ingresar"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
