# 🗺️ Ruta Local - Frontend

**Descubre Santiago auténtico con emprendimientos locales**

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/ignvvcio254s-projects/v0-hero-section-for-ruta-local)
[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js%2016-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

---

## 📋 Tabla de Contenidos

- [Descripción](#descripción)
- [Características](#características)
- [Tech Stack](#tech-stack)
- [Inicio Rápido](#inicio-rápido)
- [Configuración](#configuración)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Documentación](#documentación)
- [Estado del Proyecto](#estado-del-proyecto)

---

## 🎯 Descripción

**Ruta Local** es una plataforma web que ayuda a turistas y locales a descubrir negocios auténticos en Santiago de Chile. Los usuarios pueden crear rutas personalizadas visitando emprendimientos locales, apoyando la economía de barrio y descubriendo la verdadera esencia de la ciudad.

### Características Principales

- 🗺️ **Mapa Interactivo 3D** - Explora negocios con Mapbox GL, edificios 3D y geolocalización
- 🔍 **Búsqueda Inteligente** - Filtros avanzados estilo Uber Eats/Airbnb
- 🛤️ **Constructor de Rutas** - Crea itinerarios personalizados arrastrando y soltando
- 📊 **Dashboard** - Visualiza estadísticas y rutas guardadas
- 🔐 **Autenticación** - Sistema completo de login/registro con Google OAuth
- 📱 **Responsive** - Diseño adaptado para móvil, tablet y desktop
- 🎨 **UI Moderna** - Interfaz construida con shadcn/ui y Tailwind CSS

---

## ⚡ Tech Stack

### Framework y Lenguaje
- **Next.js 16** - App Router con React Server Components
- **React 19.2** - Última versión con concurrent features
- **TypeScript 5** - Tipado estático completo

### UI y Estilos
- **Tailwind CSS 4.1** - Utility-first CSS framework
- **shadcn/ui** - Componentes React accesibles y personalizables
- **Radix UI** - Primitivas UI sin estilos
- **Lucide Icons** - Iconos modernos y consistentes

### Mapas y Visualización
- **Mapbox GL JS** - Mapas 3D interactivos con edificios
- **React Map GL** - Wrapper de React para Mapbox
- **Recharts** - Gráficos y visualizaciones de datos
- **React DnD Kit** - Drag and drop para constructor de rutas

### Autenticación y Estado
- **Context API** - Manejo de estado de autenticación
- **localStorage** - Persistencia de sesión del lado del cliente

### Backend (Preparado)
- **Django REST Framework** - API backend (repositorio separado)
- **JWT** - Autenticación con tokens
- **Google OAuth 2.0** - Login con Google

---

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+ y npm
- Git

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/RUTALOCAL1V.git
cd RUTALOCAL1V

# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env.local

# Iniciar servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## ⚙️ Configuración

### Variables de Entorno

El proyecto incluye archivos de ejemplo para la configuración:

```bash
# Desarrollo local
.env.local          # Tu configuración (NO se sube a Git)
.env.example        # Plantilla de ejemplo (SÍ se sube a Git)
```

**Variables esenciales:**

```bash
# Backend Django
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_API_BASE_PATH=/api

# Mapbox (mapa interactivo 3D)
NEXT_PUBLIC_MAPBOX_TOKEN=tu-mapbox-token

# Modo desarrollo (acepta cualquier credencial)
NEXT_PUBLIC_DEV_MODE=true

# Google OAuth (opcional)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=tu-client-id
GOOGLE_CLIENT_SECRET=tu-secret
```

📖 **Guía completa**: Ver [ENV_SETUP.md](ENV_SETUP.md)

### Integración con Backend Django

El frontend está preparado para conectarse con un backend Django. Ver:

- **[BACKEND_INTEGRATION.md](BACKEND_INTEGRATION.md)** - Guía rápida de integración
- **[ENV_SETUP.md](ENV_SETUP.md)** - Configuración detallada de variables
- **[lib/api.ts](lib/api.ts)** - Cliente HTTP con todos los endpoints

---

## 📁 Estructura del Proyecto

```
RUTALOCAL1V/
├── app/                          # Next.js App Router
│   ├── (routes)/
│   │   ├── login/               # Página de login
│   │   ├── register/            # Página de registro
│   │   ├── dashboard/           # Dashboard del usuario
│   │   ├── map/                 # Mapa de negocios (Leaflet)
│   │   ├── map-interactive/     # 🆕 Mapa interactivo 3D (Mapbox)
│   │   └── builder/             # Constructor de rutas
│   ├── layout.tsx               # Layout raíz
│   └── globals.css              # Estilos globales
│
├── components/                   # Componentes React
│   ├── ui/                      # Componentes shadcn/ui
│   ├── dashboard/               # Componentes del dashboard
│   ├── map/                     # 🆕 Componentes del mapa 3D
│   │   ├── mapbox-map.tsx       # Mapa principal Mapbox
│   │   ├── map-search-bar.tsx   # Búsqueda y filtros
│   │   └── business-carousel.tsx # Carrusel de resultados
│   ├── route-builder/           # Constructor de rutas
│   └── navbar.tsx               # Barra de navegación
│
├── contexts/                     # Context Providers
│   └── auth-context.tsx         # Autenticación global
│
├── lib/                          # Utilidades y configuración
│   ├── env.ts                   # Variables de entorno tipadas
│   ├── api.ts                   # Cliente HTTP para Django
│   ├── api-examples.ts          # Ejemplos de uso de API
│   ├── mapbox-data.ts           # 🆕 Datos de negocios para mapa
│   ├── utils.ts                 # Utilidades generales
│   └── mock-data.ts             # Datos de prueba
│
├── hooks/                        # Custom React Hooks
│   └── use-toast.ts             # Hook de notificaciones
│
├── public/                       # Archivos estáticos
│
├── .env.example                  # Plantilla de variables
├── .env.local                    # Variables locales (ignorado)
├── .gitignore                    # Archivos ignorados por Git
│
└── Documentación/
    ├── LOGIN_IMPLEMENTATION.md   # Sistema de autenticación
    ├── ENV_SETUP.md              # Configuración de variables
    ├── BACKEND_INTEGRATION.md    # Integración con Django
    ├── MAPA_INTERACTIVO.md       # 🆕 Especificaciones del mapa 3D
    ├── MAPA_IMPLEMENTACION.md    # 🆕 Guía de uso del mapa
    ├── CHANGELOG.md              # 🆕 Historial de cambios
    ├── ROADMAP.md                # Plan de mejoras
    ├── QUICK_FIXES.md            # Soluciones rápidas
    └── MEJORAS.md                # Análisis y mejoras realizadas
```

---

## 📚 Documentación

### 🚀 Quick Start

- **[QUICK_FIXES.md](QUICK_FIXES.md)** ⚡ **¡Empieza aquí!**
  - Soluciones rápidas (5-15 minutos cada una)
  - Fix del warning de hidratación
  - Error boundaries esenciales
  - Checklist de implementación

### 📋 Guías de Implementación

- **[LOGIN_IMPLEMENTATION.md](LOGIN_IMPLEMENTATION.md)**
  - Sistema completo de autenticación
  - Login, registro y Google OAuth
  - Casos de prueba y validaciones

- **[ENV_SETUP.md](ENV_SETUP.md)**
  - Configuración de variables de entorno
  - Setup de Google OAuth y Mapbox
  - Endpoints de Django esperados

- **[BACKEND_INTEGRATION.md](BACKEND_INTEGRATION.md)**
  - Guía rápida para conectar con Django
  - Ejemplos de vistas de Django
  - Configuración de CORS

### 🗺️ Mapa Interactivo 3D

- **[MAPA_INTERACTIVO.md](MAPA_INTERACTIVO.md)** 🆕
  - Especificaciones completas del mapa
  - Decisiones de diseño y arquitectura
  - Funcionalidades implementadas
  - Flujos de usuario

- **[MAPA_IMPLEMENTACION.md](MAPA_IMPLEMENTACION.md)** 🆕
  - Guía de uso para usuarios y desarrolladores
  - Componentes creados
  - Configuración de Mapbox
  - Próximas mejoras planificadas

### 🗺️ Roadmap y Mejoras

- **[ROADMAP.md](ROADMAP.md)**
  - Plan completo de mejoras priorizadas
  - 50+ mejoras organizadas por categoría
  - Cronograma de implementación en 4 fases
  - Métricas de éxito

- **[MEJORAS.md](MEJORAS.md)**
  - Análisis inicial del proyecto
  - Errores corregidos
  - Mejoras ya implementadas

- **[CHANGELOG.md](CHANGELOG.md)** 🆕
  - Historial completo de cambios
  - Versiones del proyecto
  - Próximos pasos planificados

### Uso de la API

```typescript
// Ejemplo de login
import { authApi } from '@/lib/api'

async function handleLogin(email: string, password: string) {
  try {
    const response = await authApi.login(email, password)
    // Usuario autenticado
    console.log(response.user)
  } catch (error) {
    console.error('Error:', error)
  }
}
```

Ver más ejemplos en [lib/api-examples.ts](lib/api-examples.ts)

---

## 🎨 Características Implementadas

### ✅ Autenticación
- [x] Página de login moderna con validación
- [x] Página de registro con indicador de fortaleza de contraseña
- [x] Google OAuth (simulado, listo para integración)
- [x] Persistencia de sesión con localStorage
- [x] Navbar con dropdown de usuario
- [x] Toast notifications

### ✅ Mapa Interactivo 3D (NUEVO)
- [x] Mapa de Santiago con Mapbox GL
- [x] Edificios en 3D con pitch y rotación
- [x] Geolocalización automática del usuario
- [x] 20 negocios de ejemplo en 7 barrios
- [x] 12 categorías con iconos únicos
- [x] Marcadores dorados para negocios verificados
- [x] Búsqueda inteligente estilo Uber Eats/Airbnb
- [x] Panel de filtros avanzados (categoría, rating, distancia, precio, features)
- [x] Carrusel horizontal de resultados
- [x] Popups informativos con datos del negocio
- [x] Sincronización bidireccional mapa ↔ carousel
- [x] Animaciones fly-to suaves
- [x] Botón "Mi ubicación"

### ✅ Constructor de Rutas
- [x] Drag and drop de negocios
- [x] Timeline visual de la ruta
- [x] Cálculo de duración total
- [x] Preview de la ruta en mapa

### ✅ Dashboard
- [x] Gráficos de estadísticas (Recharts)
- [x] Rutas guardadas
- [x] Métricas de usuario

### ✅ Infraestructura
- [x] TypeScript completo sin `any`
- [x] Variables de entorno configuradas
- [x] Cliente HTTP para Django
- [x] Componentes UI reutilizables
- [x] Responsive design completo

---

## 🔄 Estado del Proyecto

### Implementado (Frontend)
```
✅ Autenticación: 100%
✅ UI/UX: 100%
✅ Mapa Interactivo 3D: 100% 🆕
✅ Constructor de Rutas: 100%
✅ Dashboard: 100%
✅ Configuración ENV: 100%
```

### Pendiente (Integración Backend)
```
⏳ Conexión Django: 0%
⏳ OAuth Real: 0%
⏳ API Endpoints: 0%
⏳ Base de Datos: 0%
```

---

## 📦 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo

# Producción
npm run build        # Construye para producción
npm start            # Inicia servidor de producción

# Calidad de código
npm run lint         # Ejecuta ESLint (deshabilitado por ahora)
npm run type-check   # Verifica tipos de TypeScript
```

---

## 🤝 Contribución

### Modo Desarrollo

El proyecto está en **modo desarrollo**. La autenticación acepta cualquier credencial para facilitar las pruebas.

Para desactivar el modo desarrollo y conectar con Django:

```bash
# En .env.local
NEXT_PUBLIC_DEV_MODE=false
```

### Próximos Pasos

1. **Backend Django**
   - Implementar endpoints de autenticación
   - Configurar CORS
   - Setup de base de datos

2. **OAuth Real**
   - Configurar Google Cloud Console
   - Implementar callback handlers
   - Integrar con Django

3. **Features**
   - Página de perfil de usuario
   - Sistema de favoritos
   - Compartir rutas
   - Calificaciones y reviews

---

## 📄 Licencia

Este proyecto es parte del desarrollo de **Ruta Local**.

---

## 👥 Equipo

Desarrollado para conectar a las personas con los negocios locales auténticos de Santiago.

---

## 📞 Contacto

Para dudas sobre la implementación, consulta la documentación:

- [LOGIN_IMPLEMENTATION.md](LOGIN_IMPLEMENTATION.md) - Autenticación
- [ENV_SETUP.md](ENV_SETUP.md) - Configuración
- [BACKEND_INTEGRATION.md](BACKEND_INTEGRATION.md) - Integración Django

---

**Última actualización**: 5 de Diciembre, 2025
**Estado**: ✅ Frontend completo - Listo para integración con Django
