# Changelog - SantiaGO

## [2.0.0] - 2025-12-05

### 🗺️ Mapa Interactivo - NUEVA FUNCIONALIDAD MAYOR

#### Añadido
- **Mapa Interactivo completo** estilo Uber Eats/Airbnb en `/map-interactive`
- **Mapbox GL JS** integrado con edificios 3D
- **Geolocalización automática** con solicitud de permiso al usuario
- **Sistema de marcadores inteligente**:
  - 12 categorías con iconos únicos (🍽️ ☕ 🍺 🥖 🎨 📚 🖼️ 🏨 🛏️ 🎒 🛒 🏪)
  - Marcadores dorados con animación pulse para negocios verificados
  - Badge de verificación (✓)
  - Popups informativos al hover
  - Animaciones al seleccionar
- **Búsqueda avanzada**:
  - Barra de búsqueda flotante en tiempo real
  - Panel de filtros completo (categorías, rating, distancia, precio, características)
  - Contador de filtros activos
  - Búsqueda por texto en nombre/categoría/descripción
- **Carrusel de resultados** horizontal:
  - Cards deslizables con fotos
  - Información completa (rating, precio, horarios, distancia, features)
  - Sincronización bidireccional con mapa
  - Scroll suave con controles de navegación
- **20 negocios de ejemplo** distribuidos en 7 barrios de Santiago
- **Vista 3D de edificios** con pitch 45°
- **Controles de navegación** integrados
- **Botón "Mi ubicación"** para volver a posición del usuario

#### Componentes Nuevos
- `components/map/mapbox-map.tsx` - Mapa principal con Mapbox GL
- `components/map/map-search-bar.tsx` - Búsqueda y filtros
- `components/map/business-carousel.tsx` - Carrusel de resultados
- `components/ui/checkbox.tsx` - Componente de checkbox
- `components/ui/radio-group.tsx` - Componente de radio buttons
- `app/map-interactive/page.tsx` - Página del mapa interactivo
- `lib/mapbox-data.ts` - Datos mockeados de negocios

#### Documentación
- `MAPA_INTERACTIVO.md` - Especificaciones completas del mapa
- `MAPA_IMPLEMENTACION.md` - Guía de implementación y uso

#### Configuración
- Token de Mapbox agregado a `.env.local`
- Configuración de centro del mapa en `lib/env.ts`
- Dependencias agregadas: `mapbox-gl`, `react-map-gl`, `@types/mapbox-gl`
- Componentes Radix UI: `@radix-ui/react-checkbox`, `@radix-ui/react-radio-group`

### 🔧 Mejoras Técnicas

#### Performance
- Filtrado optimizado con `useMemo`
- Actualización eficiente de marcadores
- Carga progresiva del mapa
- Animaciones suaves a 60fps

#### UX
- Animación fly-to al seleccionar negocios
- Popups informativos al hover sobre marcadores
- Ordenamiento inteligente: verificados primero, luego por rating
- Fallback a Plaza de Armas si se rechaza geolocalización

---

## [1.0.0] - 2025-12-04

### Configuración Inicial

#### Añadido
- **Variables de entorno** para integración con backend Django
  - `.env.example` - Template de variables
  - `.env.local` - Variables locales (con Mapbox token)
  - `.gitignore` actualizado para proteger archivos sensibles
- **Cliente HTTP** para API Django
  - `lib/api.ts` - Cliente con manejo automático de JWT
  - `lib/api-examples.ts` - Ejemplos de uso
  - `lib/env.ts` - Acceso tipado a variables de entorno
- **Documentación completa**:
  - `ENV_SETUP.md` - Guía de configuración de entorno
  - `BACKEND_INTEGRATION.md` - Guía rápida de integración con Django
  - `ROADMAP.md` - 50+ mejoras planificadas en 6 categorías
  - `QUICK_FIXES.md` - 12 correcciones rápidas priorizadas
  - `README.md` actualizado con enlaces a documentación

#### Planificado
- Integración con Django REST Framework
- Sistema de autenticación JWT
- OAuth con Google y GitHub
- 50+ mejoras de código, performance, UX, features, testing y DX

---

## Próximos Pasos

### Fase 2: Backend Integration (Próximo)
- [ ] Conectar con Django REST API
- [ ] Endpoints de negocios dinámicos
- [ ] Sistema de autenticación real
- [ ] Gestión de usuarios y favoritos

### Fase 3: Características Avanzadas
- [ ] Clustering de marcadores para >100 negocios
- [ ] Panel lateral detallado con galería de fotos
- [ ] Sistema de reviews y comentarios
- [ ] Función "Agregar a Ruta" desde mapa
- [ ] Compartir ubicaciones

### Fase 4: Mobile Optimization
- [ ] Bottom sheet deslizable
- [ ] Gestos táctiles nativos
- [ ] Vista de lista vs mapa toggle
- [ ] Performance optimizations

### Fase 5: Visual Enhancements
- [ ] Temas día/noche automáticos según hora
- [ ] Efectos de clima (futuro)
- [ ] Rutas animadas
- [ ] Heat maps de popularidad

---

## Tecnologías

### Frontend
- Next.js 16 (App Router)
- React 19.2
- TypeScript 5
- Tailwind CSS
- shadcn/ui
- Mapbox GL JS
- React Map GL

### Backend (Planificado)
- Django 5.x
- Django REST Framework
- PostgreSQL + PostGIS
- JWT Authentication

### Servicios
- Mapbox (Free Tier - 50k loads/month)
- Vercel Analytics
- Google OAuth (futuro)

---

**Mantenido por**: SantiaGO Team
**Última actualización**: 5 de Diciembre, 2025
