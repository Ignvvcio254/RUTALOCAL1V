# Agent Context - RutaLocal Project

**Última actualización:** 2025-12-15 06:55 UTC
**Modelo:** Claude Sonnet 4.5
**Proyectos:** RUTALOCAL1V (Frontend) + SantiaGo_backend (Backend)

---

## 📋 Resumen del Proyecto

**RutaLocal** es una plataforma web de descubrimiento de negocios locales que permite:
- Usuarios pagan un plan para publicar sus negocios
- Admins aprueban usuarios y otorgan permisos de publicación
- Usuarios publican negocios desde el frontend
- Los negocios aparecen en destacados, búsqueda y mapa interactivo

### Stack Tecnológico

**Frontend (RUTALOCAL1V):**
- Next.js 16 (App Router)
- TypeScript
- React Server/Client Components
- shadcn/ui components
- Framer Motion (animaciones)
- Leaflet (mapas)
- Tailwind CSS

**Backend (SantiaGo_backend):**
- Django 4.2+
- Django REST Framework
- PostgreSQL
- Railway (deployment)

**Autenticación:**
- Supabase Auth

---

## 🐛 Problemas Resueltos

### 1. Loop Infinito en Modal de Búsqueda (CRÍTICO)
**Problema:** Modal de búsqueda genera loop infinito de requests al backend
**Síntomas:** 
- Múltiples requests simultáneos
- UI congelada con spinner perpetuo
- Console log muestra fetches continuos

**Raíz:** 
- `useCallback` con objeto `filters` como dependencia
- Objeto se recrea en cada render → nueva referencia
- `useEffect` detecta cambio → ejecuta fetch → loop infinito

**Solución Implementada:**
1. **Memoization:** Serializar filters con `JSON.stringify()` para comparación estable
   ```typescript
   const filtersKey = useMemo(() => JSON.stringify(filters || {}), [filters])
   useCallback(async () => { ... }, [filtersKey]) // Dependencia estable
   ```

2. **Debouncing:** Esperar 300-500ms antes de buscar
   ```typescript
   useBusinessSearch(query, 300) // Debounce de 300ms
   ```

3. **Request Cancellation:** Usar AbortController para cancelar requests obsoletos
   ```typescript
   const controller = new AbortController()
   fetch(url, { signal: controller.signal })
   return () => controller.abort()
   ```

4. **Cleanup:** Limpiar timers y requests al desmontar componente

**Archivos Modificados:**
- `hooks/use-businesses.ts` - Agregado memoization, debouncing y cancellation
- `components/search-modal.tsx` - Configurado debounce de 300ms

**Resultado:**
- ✅ Loop infinito eliminado
- ✅ Performance mejorada: de 4+ requests a 1 request por búsqueda
- ✅ UX mejorada: resultados aparecen sin delays molestos

**Documentación:** Ver `FIX_SEARCH_INFINITE_LOOP.md` para análisis detallado

**Commit:** [Pendiente]

---

### 2. Swipe-back Gesture en Desktop
**Problema:** Gesto de deslizamiento lateral afectaba interacciones en desktop
**Solución:** Eliminado `<SwipeBackGesture>` de `components/client-layout.tsx`
**Commit:** `2166c16`

### 3. Negocios No Aparecían (Estado Draft)
**Problema:** Negocios creados por usuarios aprobados quedaban en `pending_review`
**Raíz:** Serializer hardcodeaba status sin verificar permisos
**Solución:** Implementado `_determine_initial_status()` en `backend/apps/businesses/serializers.py:164`
**Commit:** `75328dc`

### 4. Error 405 al Editar Negocios
**Problema:** `PATCH /api/businesses/{id}/` retornaba 405
**Raíz:** Endpoint de actualización no existía
**Solución:** Creado `update_my_business()` view en `backend/apps/businesses/views.py:425`
**Commits:** `382d794`, `ae7979a`

### 5. Error 400 - Category UUID Inválido
**Problema:** Frontend enviaba objeto completo de categoría en lugar de slug
**Raíz:** `updateData.category = { id: '...', name: '...', slug: '...' }`
**Solución:**
- **Frontend:** Extraer slug en `app/dashboard/my-business/[id]/edit/page.tsx:113`
- **Backend:** Hacer endpoint robusto para manejar objetos/slugs/UUIDs
**Commits:** `1d0fa99`, `2003cdf`

### 6. Manejo de Errores Deficiente
**Problema:** Modal rojo de Next.js sin mensaje claro
**Solución:** Sistema de 3 capas:
- `lib/errors/error-handler.ts` - Normalización centralizada
- `components/error-boundary.tsx` - React error boundary
- `app/error.tsx` - Next.js error page
**Commit:** `d3ea14d`

### 7. Frontend Usaba Datos Mock (CRÍTICO)
**Problema:** Negocios no aparecían a pesar de estar publicados
**Raíz:** Componentes importaban `mockBusinesses` en lugar de llamar API
**Archivos afectados:**
- `components/business-feed.tsx:6`
- `components/search-modal.tsx:6`
- `components/map/map-component.tsx:10`

**Solución:** Integración completa con API real
- Creado `lib/api/business-service.ts` (285 líneas)
- Creado `hooks/use-businesses.ts` (118 líneas)
- Actualizado BusinessFeed, SearchModal, MapComponent
**Commit:** `4f1f4c1`

---

## 🏗️ Arquitectura del Sistema

### Flujo de Publicación de Negocios

```
1. Usuario paga plan
2. Admin aprueba usuario en Django Admin
3. Admin marca can_create_businesses=True en BusinessOwnerProfile
4. Usuario crea negocio desde frontend
5. Backend verifica permisos:
   - can_create_businesses=True → status='published'
   - can_create_businesses=False → status='pending_review'
6. Negocio aparece en frontend (si published)
```

### Arquitectura Frontend - API

```
[Frontend Component]
       ↓
[Custom Hook: use-businesses.ts]
       ↓
[API Service: business-service.ts]
       ↓
[Backend API: /api/businesses/]
       ↓
[Django REST Framework]
       ↓
[PostgreSQL Database]
```

---

## 📁 Estructura de Archivos Clave

### Frontend (RUTALOCAL1V)

```
app/
├── layout.tsx                           # Root layout con ErrorBoundary
├── error.tsx                            # Next.js error page
├── dashboard/
│   └── my-business/
│       ├── create/page.tsx              # Crear negocio
│       └── [id]/edit/page.tsx           # Editar negocio (extrae category.slug)

components/
├── client-layout.tsx                    # Layout sin SwipeBackGesture
├── error-boundary.tsx                   # React error boundary
├── business-feed.tsx                    # Feed principal (usa API real)
├── search-modal.tsx                     # Modal de búsqueda (usa API real)
└── map/
    └── map-component.tsx                # Mapa interactivo (usa API real)

lib/
├── api/
│   ├── requests.ts                      # Funciones de API autenticadas
│   └── business-service.ts              # ✨ Servicio de negocios públicos
├── errors/
│   └── error-handler.ts                 # ✨ Sistema de manejo de errores
└── filters/
    └── filter-utils.ts                  # Filtrado y ordenamiento

hooks/
└── use-businesses.ts                    # ✨ Hook para obtener negocios

contexts/
├── auth-context.tsx                     # Contexto de autenticación
└── filter-context.tsx                   # Contexto de filtros
```

### Backend (SantiaGo_backend)

```
backend/apps/businesses/
├── models.py                            # Business, Category, BusinessOwnerProfile
├── serializers.py                       # BusinessSerializer con auto-publicación
├── views.py                             # Endpoints de negocios
├── urls.py                              # Rutas de API
└── management/commands/
    └── publish_approved_businesses.py   # Migrar negocios existentes
```

---

## 🔌 Endpoints de API

### Backend Base URL
```
PRODUCCIÓN: https://santiagov1-production.up.railway.app/api
LOCAL: http://localhost:8000/api
```

### Endpoints Públicos (No auth)

```http
GET  /api/businesses/
Query params:
  - category: string (slug)
  - neighborhood: string
  - rating_min: number
  - price_range: number (1-4)
  - features: string (comma-separated)
  - search: string
  - lat: number
  - lng: number
  - page: number
  - per_page: number

Response:
{
  "success": true,
  "data": {
    "results": [
      {
        "id": "uuid",
        "name": "string",
        "slug": "string",
        "description": "string",
        "short_description": "string",
        "category": {
          "id": "uuid",
          "name": "string",
          "slug": "string",
          "icon": "string",
          "color": "string"
        },
        "subcategory": "string",
        "location": { "lat": number, "lng": number },
        "address": "string",
        "neighborhood": "string",
        "rating": string|number,
        "review_count": number,
        "price_range": number,
        "distance": number,
        "cover_image": "string",
        "images": ["string"],
        "features": ["string"],
        "is_open": boolean,
        "verified": boolean,
        "phone": "string",
        "email": "string",
        "website": "string",
        "instagram": "string"
      }
    ],
    "pagination": {
      "page": 1,
      "per_page": 10,
      "total": 100,
      "pages": 10
    }
  }
}
```

```http
GET  /api/businesses/{slug}/
Response: Business object (sin paginación)
```

### Endpoints Autenticados (Requiere token)

```http
GET    /api/businesses/owner/my-businesses/
POST   /api/businesses/owner/my-businesses/
GET    /api/businesses/owner/my-businesses/{id}/
PATCH  /api/businesses/owner/my-businesses/{id}/
PUT    /api/businesses/owner/my-businesses/{id}/
DELETE /api/businesses/owner/my-businesses/{id}/

Headers:
  Authorization: Bearer <supabase-token>
```

**Ejemplo PATCH:**
```json
{
  "name": "Mi Café",
  "description": "Café acogedor...",
  "short_description": "Café con WiFi",
  "address": "Calle 123",
  "phone": "+56912345678",
  "email": "info@micafe.cl",
  "website": "https://micafe.cl",
  "instagram": "@micafe",
  "cover_image": "https://...",
  "images": ["https://..."],
  "price_range": 2,
  "is_open_24h": false,
  "hours": {},
  "category": "cafe"  // Acepta slug, UUID o objeto completo
}
```

---

## 🔧 Servicios y Hooks Frontend

### `lib/api/business-service.ts`

**Funciones Principales:**
```typescript
// Obtener negocios con filtros opcionales
getPublicBusinesses(filters?: BusinessFilters): Promise<PublicBusiness[]>

// Buscar por texto
searchBusinesses(query: string): Promise<PublicBusiness[]>

// Obtener por slug
getBusinessBySlug(slug: string): Promise<PublicBusiness | null>

// Destacados (ordenados por rating)
getFeaturedBusinesses(limit: number = 10): Promise<PublicBusiness[]>

// Por categoría
getBusinessesByCategory(categorySlug: string): Promise<PublicBusiness[]>

// Cercanos a ubicación
getNearbyBusinesses(lat: number, lng: number): Promise<PublicBusiness[]>

// Conversión a formato legacy
convertToLegacyFormat(business: PublicBusiness): Business
```

### `hooks/use-businesses.ts`

**Hooks Disponibles:**
```typescript
// Hook base con todas las opciones
useBusinesses(options: UseBusinessesOptions): UseBusinessesReturn
// options: { filters?, autoFetch?, useLegacyFormat? }
// returns: { businesses, rawBusinesses, loading, error, refetch, hasData }

// Todos los negocios (auto-fetch)
useAllBusinesses()

// Por categoría (auto-fetch si categorySlug existe)
useBusinessesByCategory(categorySlug: string)

// Búsqueda (solo activa con 2+ caracteres)
useBusinessSearch(query: string)
```

**Ejemplo de Uso:**
```typescript
'use client'
import { useAllBusinesses } from '@/hooks/use-businesses'

export function MyComponent() {
  const { businesses, loading, error, refetch } = useAllBusinesses()

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage onRetry={refetch} />

  return (
    <div>
      {businesses.map(business => (
        <BusinessCard key={business.id} {...business} />
      ))}
    </div>
  )
}
```

---

## 🎨 Componentes Actualizados

### `components/business-feed.tsx`

**Antes:**
```typescript
import { mockBusinesses } from '@/lib/data/mock-businesses'
const filteredBusinesses = filterAndSortBusinesses(mockBusinesses, filters)
```

**Después:**
```typescript
import { useAllBusinesses } from '@/hooks/use-businesses'

const { businesses: apiBusinesses, loading, error, refetch } = useAllBusinesses()
const filteredBusinesses = filterAndSortBusinesses(apiBusinesses, filters)

// Incluye estados de loading y error con UI profesional
```

### `components/search-modal.tsx`

**Antes:**
```typescript
import { mockBusinesses } from "@/lib/data/mock-businesses"
const searchResults = mockBusinesses.filter(b => ...)
```

**Después:**
```typescript
import { useBusinessSearch } from "@/hooks/use-businesses"

const { businesses: searchResults, loading: searchLoading } = useBusinessSearch(searchQuery)

// Incluye loading spinner durante búsqueda
```

### `components/map/map-component.tsx`

**Antes:**
```typescript
import { MOCK_BUSINESSES, type Business } from "@/lib/mock-data"
const filtered = MOCK_BUSINESSES.filter(...)
```

**Después:**
```typescript
import { useAllBusinesses } from "@/hooks/use-businesses"
import type { Business } from "@/lib/filters/filter-utils"

const { businesses: apiBusinesses, loading } = useAllBusinesses()
const filtered = apiBusinesses.filter(...)

// Coordenadas: business.coordinates[0], business.coordinates[1]
```

---

## 🔄 Sistema de Manejo de Errores

### `lib/errors/error-handler.ts`

**Tipos de Error:**
```typescript
enum ErrorType {
  NETWORK,       // Fetch/network errors
  VALIDATION,    // 400 Bad Request
  AUTHENTICATION, // 401 Unauthorized
  AUTHORIZATION, // 403 Forbidden
  NOT_FOUND,     // 404
  SERVER,        // 500+
  UNKNOWN
}

interface NormalizedError {
  type: ErrorType
  title: string
  message: string
  originalError: unknown
  statusCode?: number
}
```

**Funciones Principales:**
```typescript
// Normalizar cualquier error a formato estándar
normalizeError(error: unknown): NormalizedError

// Mostrar error al usuario (toast notification)
showError(error: unknown, customTitle?: string): void

// Hook para manejar errores en componentes
useErrorHandler(): {
  handleError: (error: unknown, customTitle?: string) => void
}
```

**Uso en Componentes:**
```typescript
import { showError } from '@/lib/errors/error-handler'

try {
  await updateBusiness(id, data)
} catch (error) {
  showError(error, "Error al Actualizar Negocio")
}
```

### `components/error-boundary.tsx`

React Error Boundary que captura errores de renderizado:
```tsx
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

### `app/error.tsx`

Next.js error page para errores no capturados.

---

## 🔐 Autenticación

### Flujo de Auth

1. Usuario se autentica con Supabase
2. Token se guarda en `AuthContext`
3. Requests autenticados incluyen header:
   ```typescript
   Authorization: Bearer <supabase-token>
   ```

### `contexts/auth-context.tsx`

```typescript
const { user, session, loading, signIn, signOut } = useAuth()

// user: Supabase user object
// session: Supabase session con token
// loading: boolean
// signIn: (email, password) => Promise
// signOut: () => Promise
```

---

## 🗃️ Tipos de Datos

### Backend Format (PublicBusiness)

```typescript
interface PublicBusiness {
  id: string
  name: string
  slug: string
  short_description: string
  description: string
  category: {
    id: string
    name: string
    slug: string
    icon: string
    color: string
  }
  subcategory?: string
  location: { lat: number, lng: number }
  address: string
  neighborhood: string
  comuna?: string
  rating: string | number
  review_count: number
  price_range: number
  distance?: number
  cover_image: string
  images?: string[]
  features?: string[]
  is_open?: boolean
  closes_at?: string
  verified: boolean
  phone?: string
  email?: string
  website?: string
  instagram?: string
  status?: string
}
```

### Frontend Legacy Format (Business)

```typescript
interface Business {
  id: string
  name: string
  category: string                    // slug
  subcategory: string                 // name
  rating: number
  reviews: number
  distance: number                    // en metros
  priceRange: number
  isOpen: boolean
  hasOffer: boolean
  isVerified: boolean
  isAccessible: boolean
  attributes: string[]
  experienceTags: string[]
  coordinates: [number, number]       // [lat, lng]
  image: string
  description: string
}
```

**Conversión:** `convertToLegacyFormat(publicBusiness)` en `business-service.ts:246`

---

## 🚀 Próximos Pasos / TODOs

### Pendiente en Backend

1. **Ejecutar comando de migración en Railway:**
   ```bash
   python manage.py publish_approved_businesses
   ```
   Esto publicará negocios existentes de usuarios aprobados.

2. **Verificar BusinessOwnerProfile:**
   - Confirmar que usuarios aprobados tienen `can_create_businesses=True`
   - Revisar en Django Admin: `/admin/businesses/businessownerprofile/`

### Pendiente en Frontend

1. **Probar flujo completo:**
   - Usuario crea negocio → Aparece en destacados
   - Búsqueda muestra resultados reales
   - Mapa muestra marcadores reales

2. **Optimizaciones posibles:**
   - Implementar cache en `business-service.ts`
   - Agregar infinite scroll en `business-feed.tsx`
   - Debounce en búsqueda (ya implementado: 2+ chars)

3. **Testing:**
   - Tests unitarios para `business-service.ts`
   - Tests de integración para hooks
   - E2E tests para flujo de creación

### Mejoras Futuras

- Implementar React Query para cache y refetch automático
- Server-side rendering para SEO (negocios destacados)
- Skeleton loaders en lugar de spinners
- Error retry con exponential backoff
- Metrics y analytics de uso

---

## 💻 Comandos Útiles

### Frontend (RUTALOCAL1V)

```bash
# Desarrollo
npm run dev

# Build
npm run build

# Lint
npm run lint

# Type check
npx tsc --noEmit

# Verificar imports de mock data
grep -r "mockBusinesses" components/
grep -r "MOCK_BUSINESSES" components/
```

### Backend (SantiaGo_backend)

```bash
# Migraciones
python manage.py makemigrations
python manage.py migrate

# Publicar negocios aprobados
python manage.py publish_approved_businesses
python manage.py publish_approved_businesses --dry-run  # solo ver qué haría

# Shell de Django
python manage.py shell

# Verificar permisos de usuarios
from apps.businesses.models import BusinessOwnerProfile
BusinessOwnerProfile.objects.filter(can_create_businesses=True)
```

### Git

```bash
# Ver historial de commits relacionados
git log --oneline --grep="negocio\|business\|mock"

# Ver cambios en archivos específicos
git log -p components/business-feed.tsx
git log -p lib/api/business-service.ts
```

---

## 📝 Historial de Commits

```
4f1f4c1 - Integrar API real del backend en lugar de datos mock
d3ea14d - Sistema de manejo de errores profesional (3 capas)
2003cdf - Fix: Extraer slug de categoría antes de enviar (frontend)
1d0fa99 - Manejo robusto de categoría en update endpoint (backend)
ae7979a - Fix: URL correcta para actualizar negocio
382d794 - Implementar endpoint de actualización de negocios (backend)
75328dc - Auto-publicación para usuarios con permisos aprobados (backend)
2166c16 - Eliminar SwipeBackGesture de desktop (frontend)
```

---

## 🔍 Debugging Tips

### Verificar si API está funcionando

```javascript
// En consola del navegador
fetch('https://santiagov1-production.up.railway.app/api/businesses/')
  .then(r => r.json())
  .then(console.log)
```

### Verificar estado de negocios en backend

```python
# En Django shell
from apps.businesses.models import Business
Business.objects.values('name', 'status', 'owner__email')
```

### Ver logs de red en DevTools

1. Abrir DevTools → Network tab
2. Filtrar por "businesses"
3. Revisar request/response de API calls

### Verificar permisos de usuario

```python
# En Django shell
from apps.businesses.models import BusinessOwnerProfile
profile = BusinessOwnerProfile.objects.get(user__email='email@example.com')
print(profile.can_create_businesses)
```

---

## 🎯 Contexto para Continuar

### Estado Actual del Proyecto

**Funcionando:**
- ✅ Frontend conectado a API real del backend
- ✅ Negocios de usuarios aprobados se publican automáticamente
- ✅ BusinessFeed, SearchModal y MapComponent usan datos reales
- ✅ Sistema de manejo de errores implementado
- ✅ Endpoints de creación y edición funcionando

**Pendiente de Verificar:**
- ⏳ Despliegue en Vercel (auto-deploy desde GitHub)
- ⏳ Ejecutar comando de migración en Railway
- ⏳ Prueba completa de flujo usuario → negocio publicado

### Modelo de Trabajo Establecido

1. **Análisis primero:** Identificar raíz del problema antes de codear
2. **Código limpio:** SOLID, POO, TypeScript strict
3. **Commits descriptivos:** Mensajes detallados con contexto
4. **Documentación:** Comments inline y documentos como este
5. **Testing manual:** Verificar cada cambio antes de commit
6. **Error handling:** Siempre manejar casos de error

### Arquitectura de Soluciones

- **Service Layer Pattern:** Separar lógica de API de componentes
- **Custom Hooks:** Encapsular state management y side effects
- **Error Boundaries:** Capturar errores a diferentes niveles
- **Type Safety:** TypeScript interfaces para todo
- **Separation of Concerns:** Componentes enfocados en UI, hooks en lógica

---

## 📞 Variables de Entorno

### Frontend (.env.local)

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx

# Backend API
NEXT_PUBLIC_API_URL=https://santiagov1-production.up.railway.app/api

# Environment
NODE_ENV=development
```

### Backend (.env)

```bash
# Django
SECRET_KEY=xxxxx
DEBUG=False
ALLOWED_HOSTS=santiagov1-production.up.railway.app,localhost

# Database (Railway PostgreSQL)
DATABASE_URL=postgresql://...

# Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=xxxxx
```

---

## 🤝 Convenciones de Código

### Nombres de Funciones

```typescript
// API calls: verbo + sustantivo
getPublicBusinesses()
createBusiness()
updateBusiness()
deleteBusiness()

// Hooks: use + descripción
useBusinesses()
useAllBusinesses()
useAuth()

// Handlers: handle + evento
handleSubmit()
handleError()
handleInputChange()

// Utilities: verbo descriptivo
filterAndSortBusinesses()
normalizeError()
convertToLegacyFormat()
```

### Estructura de Componentes

```typescript
'use client' // Si necesita interactividad

// 1. Imports
import { useState } from 'react'
import { useHook } from '@/hooks'
import { Component } from '@/components'

// 2. Types/Interfaces
interface Props { ... }

// 3. Component
export function ComponentName({ props }: Props) {
  // 3.1 Hooks
  const [state, setState] = useState()
  const { data, loading } = useHook()

  // 3.2 Handlers
  const handleEvent = () => { ... }

  // 3.3 Effects
  useEffect(() => { ... }, [])

  // 3.4 Early returns (loading, error)
  if (loading) return <Loading />
  if (error) return <Error />

  // 3.5 Render
  return <div>...</div>
}
```

---

## 📚 Recursos y Referencias

### Documentación Oficial
- [Next.js 16 Docs](https://nextjs.org/docs)
- [React 19 Docs](https://react.dev)
- [Django REST Framework](https://www.django-rest-framework.org)
- [TypeScript](https://www.typescriptlang.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Librerías Específicas
- [shadcn/ui](https://ui.shadcn.com)
- [Framer Motion](https://www.framer.com/motion)
- [Leaflet](https://leafletjs.com)
- [Supabase Auth](https://supabase.com/docs/guides/auth)

### Railway y Deployment
- [Railway Docs](https://docs.railway.app)
- [Vercel Docs](https://vercel.com/docs)

---

**FIN DEL DOCUMENTO**

Este documento debe actualizarse cada vez que se implementen cambios significativos en la arquitectura, se solucionen problemas críticos o se agreguen nuevas features importantes.

**Última modificación por:** Claude Sonnet 4.5
**Fecha:** 2025-12-15
