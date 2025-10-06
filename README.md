# Beneficio Joven Atizapán - Frontend

Sistema de gestión digital para el programa "Beneficio Joven Atizapán" del municipio de Atizapán de Zaragoza, Estado de México.

## 📋 Índice

- [Descripción del Proyecto](#descripción-del-proyecto)
- [Setup del Proyecto](#setup-del-proyecto)
  - [Requisitos Previos](#requisitos-previos)
  - [Instalación](#instalación)
  - [Ejecutar el Proyecto](#ejecutar-el-proyecto)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Sistema de Autenticación](#sistema-de-autenticación)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Equipo de Desarrollo](#equipo-de-desarrollo)

---

## Descripción del Proyecto

Aplicación web para la gestión del programa "Beneficio Joven", que permite a jóvenes de 12 a 29 años acceder a descuentos en más de 60 establecimientos locales. El sistema cuenta con tres tipos de usuarios:

- **Administradores**: Gestión completa del programa
- **Establecimientos**: Administración de promociones y validación de tarjetas
- **Beneficiarios**: Consulta de catálogo y uso de beneficios

---

## Setup del Proyecto

### Requisitos Previos

- **Node.js** v18 o superior
- **npm** v9 o superior
- Git

### Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/MasterJuan579/Beneficio_Joven_Frontend.git
cd Beneficio_Joven_Frontend
```

2. **Instalar dependencias base**
```bash
npm install
```

### Tailwind CSS

> [!WARNING]   
> Se está usando la Versión 3.4.18 de Tailwind


### Ejecutar el Proyecto

```bash
npm run dev
```

---

## Estructura del Proyecto

```
Beneficio_Joven_Frontend/
├── public/
│   └── vite.svg
├── src/
│   ├── api/
│   │   ├── config/
│   │   │   └── axiosConfig.js          # Configuración base de Axios
│   │   ├── interceptors/
│   │   │   └── authInterceptor.js      # Manejo automático de tokens
│   │   └── services/
│   │       └── authService.js          # Servicios de autenticación
│   ├── assets/
│   │   └── react.svg
│   ├── context/
│   │   └── AuthContext.jsx             # Context API para autenticación
│   ├── utils/
│   │   └── tokenManager.js             # Gestión de tokens en localStorage
│   ├── App.css
│   ├── App.jsx                         # Componente principal
│   ├── index.css                       # Estilos globales con Tailwind
│   └── main.jsx                        # Punto de entrada
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.js
└── vite.config.js
```

---

## Sistema de Autenticación

### Arquitectura

El sistema implementa autenticación basada en **JWT (JSON Web Tokens)** con la siguiente estructura:

```
Componente → AuthContext → AuthService → Interceptor → Backend API
```

### Componentes Principales

#### 1. **Token Manager** (`utils/tokenManager.js`)
Gestiona el almacenamiento de tokens y datos del usuario en `localStorage`:

```javascript
// Funciones disponibles:
- saveToken(token)     // Guardar token
- getToken()          // Obtener token
- saveUser(user)      // Guardar usuario
- getUser()           // Obtener usuario
- clearAuth()         // Limpiar sesión completa
```

#### 2. **Axios Configuration** (`api/config/axiosConfig.js`)
Cliente HTTP configurado con:
- Base URL: `https://fgdmbhrw5b.execute-api.us-east-2.amazonaws.com/dev`
- Timeout: 30 segundos
- Headers por defecto

#### 3. **Auth Interceptor** (`api/interceptors/authInterceptor.js`)
- **Request**: Añade automáticamente `Authorization: Bearer <token>` a cada petición
- **Response**: Detecta errores 401 (token inválido/expirado) y redirige al login

#### 4. **Auth Service** (`api/services/authService.js`)
Métodos disponibles:
```javascript
- login(email, password)    // Iniciar sesión
- register(userData)        // Registrar usuario
- logout()                  // Cerrar sesión
```

#### 5. **Auth Context** (`context/AuthContext.jsx`)
Provee estado global de autenticación:
```javascript
const { user, isAuthenticated, isLoading, login, register, logout } = useAuth();
```

### Flujo de Autenticación

1. **Login**:
   ```
   Usuario → login() → Backend → {token, user} → localStorage → Estado Global
   ```

2. **Peticiones autenticadas**:
   ```
   Request → Interceptor añade token → Backend → Response
   ```

3. **Token expirado**:
   ```
   Backend 401 → Interceptor detecta → clearAuth() → Redirect /login
   ```

### Uso en Componentes

```jsx
import { useAuth } from './context/AuthContext';

function LoginPage() {
  const { login } = useAuth();
  
  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
  };

  return <form onSubmit={handleLogin}>...</form>;
}
```

### Endpoints del Backend

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/auth/login` | Iniciar sesión |
| POST | `/auth/register` | Registro de usuario |

### Formato de Respuesta del Backend

**Login exitoso:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123",
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "tipo_usuario": "admin"
  }
}
```

---

## Tecnologías Utilizadas

- **React 19** - Biblioteca de UI
- **Vite 7** - Build tool y dev server
- **Tailwind CSS 3** - Framework de CSS
- **Axios 1.12** - Cliente HTTP
- **React Context API** - Gestión de estado global

---

## Equipo de Desarrollo

- Luis David Pozos Tamez - A01800657
- Adrián Proaño Bernal - A01752615
- Juan Pablo Solís Gómez - A01800430
- Moisés Falcón Pacheco - A01801140
- Israel González Huerta - A01751433
- Juan Pablo Pérez Gutiérrez - A01800483

---

## Licencia

MIT License - Ver archivo [LICENSE](LICENSE) para más detalles.