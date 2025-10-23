import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import PillNav from "./PillNav";
import logoBeneficio from "../../assets/Logos/logo-beneficio.png";

export default function AdminNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Menús por rol
  const ADMIN_MENU = [
    { label: "Inicio", href: "/admin/dashboard" },
    { label: "Comercios", href: "/admin/comercios" },
    { label: "Dueños", href: "/admin/duenos" },
    { label: "Beneficiarios", href: "/admin/beneficiarios" },
    { label: "Reportes", href: "/admin/reportes" },
    { label: "Moderación", href: "/admin/moderacion" },
    { label: "Mapa", href: "/admin/mapa" },
  ];

  const OWNER_MENU = [
    { label: "Dashboard", href: "/owner/dashboard" },
    { label: "Sucursales", href: "/owner/sucursales" },
    { label: "Promociones", href: "/owner/promociones" },
  ];

  const MENU_ITEMS = user?.role === "administrador" ? ADMIN_MENU : OWNER_MENU;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-transparent z-50 flex flex-col items-center pt-4">
      {/* 🔹 Navbar principal estilo Pill con morado oscuro */}
      <PillNav
        logo={logoBeneficio}
        logoAlt="Beneficio Joven"
        items={MENU_ITEMS}
        activeHref={window.location.pathname}
        baseColor="#2d1470ff"              // 🔹 fondo principal morado oscuro
        pillColor="#ffffff"              // 🔹 pastillas blancas
        hoveredPillTextColor="#ffffff"   // 🔹 texto blanco al pasar el mouse
        pillTextColor="#1E0A54"          // 🔹 texto morado oscuro
        className="drop-shadow-lg"
      />

      {/* 🔹 Usuario y botón de logout */}
      <div className="absolute right-6 top-4 hidden md:flex items-center space-x-3">
        <div className="w-10 h-10 bg-[#1E0A54] rounded-full flex items-center justify-center shadow-md">
          <span className="text-white font-semibold text-sm">
            {(user?.nombreUsuario || user?.displayName || "A")
              .charAt(0)
              .toUpperCase()}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="bg-white text-[#1E0A54] px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition shadow-sm"
        >
          Cerrar Sesión
        </button>
      </div>
    </nav>
  );
}

