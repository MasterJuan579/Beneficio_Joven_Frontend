# Beneficio Joven Atizapán - Frontend

Sistema de gestión digital para el programa **Beneficio Joven Atizapán** del municipio de Atizapán de Zaragoza, Estado de México.

## 📋 Índice

* [Descripción del Proyecto](#descripción-del-proyecto)
* [Arquitectura y Flujo General](#arquitectura-y-flujo-general)
* [Setup del Proyecto](#setup-del-proyecto)

  * [Requisitos Previos](#requisitos-previos)
  * [Instalación](#instalación)
  * [Variables de Entorno](#variables-de-entorno)
  * [Scripts Disponibles](#scripts-disponibles)
* [Estructura del Proyecto](#estructura-del-proyecto)
* [Rutas y Acceso por Rol](#rutas-y-acceso-por-rol)
* [Sistema de Autenticación](#sistema-de-autenticación)

  * [Componentes Principales](#componentes-principales)
  * [Flujo de Autenticación](#flujo-de-autenticación)
  * [Endpoints Backend](#endpoints-backend)
* [Servicios y Contratos de Datos](#servicios-y-contratos-de-datos)
* [UI / Estilos (Tailwind CSS)](#ui--estilos-tailwind-css)
* [Reportes y Gráficas](#reportes-y-gráficas)
* [Exportación a CSV](#exportación-a-csv)
* [Buenas Prácticas y Convenciones](#buenas-prácticas-y-convenciones)
* [Solución de Problemas](#solución-de-problemas)
* [Tecnologías Utilizadas](#tecnologías-utilizadas)
* [Equipo de Desarrollo](#equipo-de-desarrollo)
* [Licencia](#licencia)

---

## Descripción del Proyecto

Aplicación web para la gestión del programa **Beneficio Joven**, que permite a jóvenes de 12 a 29 años acceder a descuentos en establecimientos locales. El sistema contempla tres tipos de usuarios:

* **Administradores**: gestión completa del programa.
* **Establecimientos (dueños)**: administración de promociones y validación.
* **Beneficiarios**: consulta de catálogo y uso de beneficios.

---

## Arquitectura y Flujo General

* **React + React Router** para SPA y navegación.
* **Context API** para estado global de autenticación.
* **Axios** con **interceptores** para inyectar `Bearer <token>` y manejar `401`.
* **Tailwind CSS** para estilado por utilidades.
* **ECharts** para reportes visuales.
* **PapaParse** para exportación CSV.
* **localStorage** para persistencia de sesión (token + user).

**Diagrama lógico (alto nivel):**

```
UI (Pages/Components)
  └─ Context(Auth) ──► Services(API) ──► Axios Instance + Interceptors ──► Backend
                                            ▲
                                            └──── tokenManager (localStorage)
```

---

## Setup del Proyecto

### Requisitos Previos

* **Node.js** v18 o superior
* **npm** v9 o superior
* Git

### Instalación

```bash
git clone https://github.com/MasterJuan579/Beneficio_Joven_Frontend.git
cd Beneficio_Joven_Frontend
npm install
```

### Variables de Entorno

Crea un archivo **`.env`** en la raíz:

```bash
VITE_API_URL=https://fgdmbhrw5b.execute-api.us-east-2.amazonaws.com/dev
```

> Si no defines la variable, asegúrate de que `src/api/config/axiosConfig.js` use un `baseURL` válido.

### Scripts Disponibles

```bash
npm run dev       # Desarrollo
npm run build     # Build producción (dist/)
npm run preview   # Previsualizar build local
```

> Tailwind CSS en uso: **3.4.18** (recomendado mantener sincronizado con `package.json`).

---

## Estructura del Proyecto

```
Beneficio_Joven_Frontend/
├── public/
│   └── vite.svg
├── src/
│   ├── api/
│   │   ├── config/
│   │   │   └── axiosConfig.js               # Instancia base de Axios (baseURL, headers, timeout)
│   │   ├── interceptors/
│   │   │   └── authInterceptor.js           # Interceptor request: token; response: 401 -> logout
│   │   └── services/
│   │       ├── authService.js               # login, register, logout
│   │       └── admin-api-requests/
│   │           ├── comercios.js             # sucursales/establecimientos (listar, crear, toggle)
│   │           ├── duenos.js                # CRUD dueños + toggle estado
│   │           ├── establecimientos.js      # catálogos comunes + crear establecimiento
│   │           ├── dashboard.js             # estadísticas del panel admin
│   │           └── reports.js               # reportes (KPIs, series para gráficas)
│   │
│   ├── assets/
│   │   └── Logos/, icons/                   # imágenes/logos para la UI
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── AdminNavbar.jsx              # barra superior fija
│   │   │   └── ToggleSwitch.jsx             # componente switch reutilizable
│   │   ├── common/ImageUploader.jsx         # subida a backend (Cloudinary vía API)
│   │   └── admin/
│   │       ├── comercios/
│   │       │   ├── AddEstablecimientoModal.jsx
│   │       │   ├── AddSucursalModal.jsx
│   │       │   └── ConfirmToggleSucursalModal.jsx
│   │       └── duenos/
│   │           ├── AddDuenoModal.jsx
│   │           ├── EditDuenoModal.jsx
│   │           └── ConfirmToggleModal.jsx
│   │
│   ├── context/
│   │   └── AuthContext.jsx                  # estado global: user, isAuthenticated, login/logout
│   │
│   ├── pages/
│   │   ├── Login.jsx                        # login y redirección por rol
│   │   └── admin/
│   │       ├── AdminDashboard.jsx           # resumen + KPIs
│   │       ├── GestionComercios.jsx         # tabla sucursales + CSV + toggles + modales
│   │       ├── GestionDuenos.jsx            # tabla dueños + CSV + editar + toggles
│   │       └── ReportesDashboard.jsx        # gráficas ECharts + KPIs
│   │
│   ├── utils/
│   │   └── tokenManager.js                  # save/get/remove token+user; clearAuth
│   │
│   ├── App.jsx                              # árbol de rutas; ProtectedAdmin
│   ├── index.css                            # Tailwind base/components/utilities
│   └── main.jsx                             # StrictMode, BrowserRouter, AuthProvider, App
│
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

## Rutas y Acceso por Rol

**Archivo clave:** `src/App.jsx`

* Públicas:

  * `/login`
* Administrador (**protegidas con `ProtectedAdmin`**):

  * `/admin/dashboard`
  * `/admin/comercios`
  * `/admin/duenos`
  * `/admin/reportes`
  * Placeholders: `/admin/beneficiarios`, `/admin/descuentos`, `/admin/moderacion`, `/admin/mapa`, `/admin/auditoria`
* Catch-all: `*` → redirige a `/login`

**Redirecciones post-login (en `Login.jsx`):**

* `administrador` → `/admin/dashboard`
* `dueno` → `/comercio/dashboard` (placeholder futuro)
* `beneficiario` → `/beneficiario/dashboard` (placeholder futuro)
* Fallback → `/dashboard`

---

## Sistema de Autenticación

### Componentes Principales

1. **Token Manager** (`src/utils/tokenManager.js`)
   Maneja persistencia en `localStorage`:

   * `saveToken`, `getToken`, `removeToken`, `hasToken`
   * `saveUser`, `getUser`, `removeUser`
   * `clearAuth` (borra todo)

2. **Axios Instance** (`src/api/config/axiosConfig.js`)

   * `baseURL` (usar `import.meta.env.VITE_API_URL` recomendado)
   * `Content-Type: application/json`
   * `timeout: 30000`

3. **Interceptor** (`src/api/interceptors/authInterceptor.js`)

   * **Request**: adjunta `Authorization: Bearer <token>` si existe.
   * **Response**: ante `401` → `clearAuth()` y `window.location.href = '/login'`.

4. **Auth Service** (`src/api/services/authService.js`)

   * `login(email, password)` → guarda `{ token, user }`
   * `register(userData)`
   * `logout()` → `clearAuth()` + `window.location.href = '/login'`

5. **Auth Context** (`src/context/AuthContext.jsx`)

   * Estado global: `user`, `isAuthenticated`, `isLoading`
   * Acciones: `login`, `register`, `logout`
   * Rehidratación desde `localStorage` al montar.

### Flujo de Autenticación

1. **Login**

   ```
   Usuario → login() → backend → { token, user } → localStorage → Context
   → redirección por rol
   ```

2. **Peticiones autenticadas**

   ```
   axiosInstance → request interceptor añade token → backend → response
   ```

3. **Token expirado / inválido**

   ```
   backend responde 401 → response interceptor → clearAuth() → /login
   ```

### Endpoints Backend

| Método | Endpoint                              | Descripción                       |
| -----: | ------------------------------------- | --------------------------------- |
|   POST | `/auth/login`                         | Iniciar sesión                    |
|   POST | `/auth/register`                      | Registrar usuario                 |
|    GET | `/admin/get/sucursales`               | Listado de sucursales             |
|  PATCH | `/admin/sucursales/:id/toggle-status` | Activar/Desactivar sucursal       |
|    GET | `/admin/establecimiento`              | Listado de establecimientos       |
|   POST | `/admin/post/sucursales`              | Crear sucursal                    |
|   POST | `/admin/establecimiento`              | Crear establecimiento             |
|    GET | `/common/establecimiento`             | Catálogo de establecimientos      |
|    GET | `/common/categorias`                  | Catálogo de categorías            |
|    GET | `/admin/duenos`                       | Listado de dueños                 |
|   POST | `/auth/register/dueno`                | Crear dueño                       |
|    PUT | `/admin/duenos/:id`                   | Actualizar dueño                  |
|  PATCH | `/admin/duenos/:id/toggle-status`     | Activar/Desactivar dueño          |
|    GET | `/admin/dashboard/stats`              | KPIs del dashboard admin          |
|    GET | `/admin/reports`                      | KPIs y series para gráficas       |
|   POST | `/upload-image`                       | Subir imagen (Cloudinary vía API) |

> Las rutas pueden variar según tu backend; aquí se listan las usadas en el frontend.

---

## Servicios y Contratos de Datos

**Contratos de datos esperados (referencial):**

```ts
// Sucursal
type Sucursal = {
  idSucursal: number | string;
  nombreSucursal: string;
  numSucursal?: string;
  direccion?: string;
  categoria?: string;
  horario?: { apertura?: string; cierre?: string };
  activo: boolean;
  fechaRegistro?: string | Date;
};

// Dueño
type Dueno = {
  idDueno: number | string;
  nombreUsuario: string;
  email: string;
  cantidadEstablecimientos?: number;
  activo: boolean;
  fechaRegistro?: string | Date;
};

// Dashboard
type DashboardStats = {
  beneficiariosRegistrados: number;
  comerciosAfiliados: number;
  descuentosDadosAlta: number;
};

// Reports
type ReportsData = {
  kpis?: {
    beneficiarios?: { total?: number };
    comercios?: { activos?: number; sucursalesActivas?: number };
    promociones?: { vigentes?: number };
  };
  series?: {
    aplicacionesPorMes?: Array<{ ym: string; aplicaciones: number }>;
    topEstablecimientos?: Array<{ idEstablecimiento: string | number; aplicaciones: number }>;
    topCategorias?: Array<{ categoria: string; establecimientos: number }>;
  };
};
```

**Patrón de respuesta de servicios (UI-friendly):**

```ts
type ServiceResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
};
```

> Esto simplifica el manejo de estados de UI: éxito/error con mensajes consistentes.

---

## UI / Estilos (Tailwind CSS)

* `src/index.css` incluye:

  ```css
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  ```
* Estilos por utilidades en cada componente (`bg-`, `text-`, `grid`, `flex`, `gap`, `rounded`, etc.)
* Puedes definir componentes utilitarios propios:

  ```css
  @layer components {
    .btn-primary {
      @apply bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition;
    }
  }
  ```

---

## Reportes y Gráficas

* Página: `src/pages/admin/ReportesDashboard.jsx`
* Librería: `echarts-for-react`
* Helpers defensivos:

  * `arr(v)` → siempre devuelve arreglo.
  * `num(v, d)` → asegura número.
* Gráficos:

  * Línea: aplicaciones por mes.
  * Barras: top establecimientos.
  * Barras: top categorías.

---

## Exportación a CSV

* **PapaParse** (`papaparse`) para exportar entidades mostradas:

  * `GestionComercios.jsx`: exporta sucursales.
  * `GestionDuenos.jsx`: exporta dueños.
* Patrón:

  ```js
  const csv = Papa.unparse(datos, { quotes: true, header: true });
  // blob → descarga con <a download>
  ```

---

## Buenas Prácticas y Convenciones

* **JSDoc** en páginas y servicios clave.
* **Servicios** devuelven `{ success, data, message, errors }`.
* **Interceptors** centralizan auth y 401.
* **Componentes reutilizables** (navbar, toggles, modales).
* **Errores de UI**: mensajes claros; loaders/skeletons en estados de carga.
* **Accesibilidad**: `aria-label`, `focus` y `disabled` presentes.

> Recomendación: agregar ESLint/Prettier si aún no están activos; definir reglas de commits y ramas.

---

## Solución de Problemas

* **401 tras inactividad**: el interceptor limpia sesión y redirige a `/login`.
* **CORS**: verificar permisos del backend o proxy de Vite.
* **Imágenes no suben**: revisar tamaño/formatos y que `/upload-image` devuelva `{ logoURL, publicId }`.
* **BaseURL incorrecto**: confirmar `VITE_API_URL` en `.env` y reiniciar `npm run dev`.

---

## Tecnologías Utilizadas

* **React** (SPA y componentes)
* **Vite** (dev server y build)
* **Tailwind CSS** (estilos utilitarios)
* **Axios** (HTTP + interceptores)
* **React Router** (routing)
* **React Context API** (estado de auth)
* **ECharts** (gráficas)
* **PapaParse** (CSV)

> Versiones aproximadas en este repositorio: React 18/19, Vite 5/7, Tailwind 3.4.18 (valida con tu `package.json`).

---

## Equipo de Desarrollo

* Luis David Pozos Tamez - A01800657
* Adrián Proaño Bernal - A01752615
* Juan Pablo Solís Gómez - A01800430
* Moisés Falcón Pacheco - A01801140
* Israel González Huerta - A01751433
* Juan Pablo Pérez Gutiérrez - A01800483

---

## Licencia

MIT License — ver archivo [LICENSE](LICENSE).

---

### Notas finales

* Este README refleja la **estructura y flujos reales** ya implementados: rutas, servicios, interceptores y componentes.
* Si agregas módulos nuevos (e.g., dashboard del dueño o beneficiario), reutiliza:

  * `ProtectedRoute` por rol
  * patrón de servicios `{ success, data, message }`
  * modales y tabla con filtros/CSV ya existentes.
