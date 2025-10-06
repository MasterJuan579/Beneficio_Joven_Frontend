# Beneficio Joven Atizapán - Frontend

Sistema de gestión digital para el programa "Beneficio Joven Atizapán" del municipio de Atizapán de Zaragoza, Estado de México.

## 📋 Índice

- [Descripción del Proyecto](#descripción-del-proyecto)
- [Setup del Proyecto](#setup-del-proyecto)
  - [Requisitos Previos](#requisitos-previos)
  - [Instalación](#instalación)
  - [Configuración de Tailwind](#configuración-de-tailwind)
  - [Ejecutar el Proyecto](#ejecutar-el-proyecto)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)

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
git clone <https://github.com/MasterJuan579/Beneficio_Joven_Frontend.git>
cd Beneficio_Joven_Frontend
```

### Instalar dependencias base
```bash
npm install
```

### Instalar Tailwind CSS

> [!WARNING]   
>Se esta usando la Versión 3.18.4 de Tailwind
``` bash
npm install -D tailwindcss@3 postcss autoprefixer
hnpx tailwindcss init -p
```
Esto creará dos archivos:

tailwind.config.js  
postcss.config.js


### Configurar tailwind.config.js

Reemplaza el contenido con:     
``` js
javascript/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        },
      },
    },
  },
  plugins: [],
}
```

### Ejecutar el Proyecto
``` bash
npm run dev
```

## Estructura del Proyecto
``` Markdown
  Pendiente
```

### Tecnologías Utilizadas

React 18 - Biblioteca de UI     
Vite - Build tool y dev server      
Tailwind CSS 3 - Framework de CSS       



# Equipo de Desarrollo

Luis David Pozos Tamez - A01800657      
Adrián Proaño Bernal - A01752615        
Juan Pablo Solís Gómez - A01800430      
Moises Falcon Pacheco - A01801140       
Israel González Huerta - A01751433      
Juan Pablo Pérez Gutiérrez - A01800483      