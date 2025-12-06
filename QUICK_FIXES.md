# ⚡ Quick Fixes - Implementar Ahora

Soluciones rápidas para problemas identificados en el proyecto. Cada fix toma 5-15 minutos.

**Última actualización**: 5 de Diciembre, 2025

---

## 🔴 CRÍTICO: Arreglar Ahora

### 1. Warning de Hidratación React

**Problema**:
```
A tree hydrated but some attributes of the server rendered HTML didn't match the client properties
```

**Causa**: El atributo `__processed_*__` es agregado por una extensión del navegador (probablemente Console Ninja o similar).

**Solución Temporal**:
```typescript
// app/layout.tsx - Agregar suppressHydrationWarning
export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`font-sans antialiased`} suppressHydrationWarning>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
```

**Solución Definitiva**: Deshabilitar extensiones del navegador en desarrollo o usar modo incógnito.

---

### 2. Fuentes Google No Usadas

**Problema**: Las fuentes `Geist` y `Geist_Mono` están importadas pero no se usan (líneas 8-9).

**Solución**:

```typescript
// app/layout.tsx - ANTES
const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

// ...
<body className={`font-sans antialiased`}>

// app/layout.tsx - DESPUÉS
const geist = Geist({
  subsets: ["latin"],
  variable: '--font-geist',
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: '--font-geist-mono',
});

// ...
<body className={`${geist.variable} ${geistMono.variable} font-sans antialiased`}>
```

**O eliminarlas si no se van a usar**:

```typescript
// app/layout.tsx - OPCIÓN 2: Eliminar
// Borrar líneas 2, 8-9
// import { Geist, Geist_Mono } from 'next/font/google'
// const _geist = Geist({ subsets: ["latin"] });
// const _geistMono = Geist_Mono({ subsets: ["latin"] });
```

---

### 3. Eliminar ignoreBuildErrors

**Archivo**: `next.config.mjs`

**ANTES**:
```typescript
typescript: {
  ignoreBuildErrors: true,  // ❌ ELIMINAR
}
```

**DESPUÉS**:
```typescript
typescript: {
  ignoreBuildErrors: false,  // ✅ O eliminar esta línea completamente
}
```

**Acción**:
1. Editar `next.config.mjs`
2. Cambiar a `false` o eliminar la línea
3. Ejecutar `npm run build`
4. Corregir cualquier error de TypeScript que aparezca

---

### 4. Habilitar Optimización de Imágenes

**Archivo**: `next.config.mjs`

**ANTES**:
```typescript
images: {
  unoptimized: true,  // ❌ Desactiva optimización
}
```

**DESPUÉS**:
```typescript
images: {
  unoptimized: false,
  remotePatterns: [
    {
      protocol: 'https',
      hostname: '**',
    }
  ],
  formats: ['image/webp', 'image/avif'],
}
```

---

## 🟡 IMPORTANTE: Hacer Pronto

### 5. Crear Error Boundaries

**Archivos a crear**:

```typescript
// app/error.tsx (NUEVO)
'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Error boundary caught:', error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-red-600">¡Ups!</h1>
        <h2 className="text-2xl font-semibold">Algo salió mal</h2>
        <p className="text-gray-600 max-w-md">
          {error.message || 'Ha ocurrido un error inesperado'}
        </p>
        <Button onClick={reset} size="lg">
          Intentar de nuevo
        </Button>
      </div>
    </div>
  )
}
```

```typescript
// app/not-found.tsx (NUEVO)
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-bold text-indigo-600">404</h1>
        <h2 className="text-2xl font-semibold">Página no encontrada</h2>
        <p className="text-gray-600 max-w-md">
          La página que buscas no existe o ha sido movida.
        </p>
        <Link href="/">
          <Button size="lg">Volver al inicio</Button>
        </Link>
      </div>
    </div>
  )
}
```

```typescript
// app/loading.tsx (NUEVO)
export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-gray-600">Cargando...</p>
      </div>
    </div>
  )
}
```

---

### 6. Crear Middleware para Rutas Protegidas

```typescript
// middleware.ts (NUEVO - EN LA RAÍZ DEL PROYECTO)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Rutas que requieren autenticación
const protectedRoutes = ['/dashboard', '/builder', '/profile']

// Rutas de autenticación (redirigir si ya está logueado)
const authRoutes = ['/login', '/register']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Obtener token de localStorage (simulado con cookies por ahora)
  const token = request.cookies.get('santiago_token')?.value

  // Verificar si es una ruta protegida
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

  // Si intenta acceder a ruta protegida sin token
  if (isProtectedRoute && !token) {
    const url = new URL('/login', request.url)
    url.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(url)
  }

  // Si tiene token y intenta ir a login/register, redirigir a dashboard
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

// Configurar qué rutas debe procesar el middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
```

**Nota**: El middleware actualmente no puede acceder a localStorage del cliente. Para una solución completa, necesitas:
1. Guardar el token en cookies (en lugar de localStorage)
2. O verificar el token en componentes del lado del cliente

---

### 7. Agregar suppressHydrationWarning

**Archivo**: `app/layout.tsx`

```typescript
// ACTUALIZAR
export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`font-sans antialiased`}
        suppressHydrationWarning
      >
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
```

---

### 8. Agregar Metadata SEO

**En cada página principal**:

```typescript
// app/page.tsx - Página principal
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ruta Local - Descubre Santiago Auténtico',
  description: 'Descubre negocios locales auténticos en Santiago de Chile. Crea rutas personalizadas y apoya la economía local.',
  keywords: ['Santiago', 'Chile', 'negocios locales', 'turismo', 'emprendimiento'],
  openGraph: {
    title: 'Ruta Local - Descubre Santiago Auténtico',
    description: 'Descubre negocios locales auténticos en Santiago de Chile',
    type: 'website',
    locale: 'es_CL',
  },
}

// app/map/page.tsx
export const metadata: Metadata = {
  title: 'Mapa de Negocios - Ruta Local',
  description: 'Explora negocios locales en el mapa interactivo de Santiago',
}

// app/dashboard/page.tsx
export const metadata: Metadata = {
  title: 'Dashboard - Ruta Local',
  description: 'Gestiona tus rutas y descubre estadísticas',
  robots: {
    index: false, // No indexar páginas privadas
    follow: false,
  }
}

// app/builder/page.tsx
export const metadata: Metadata = {
  title: 'Constructor de Rutas - Ruta Local',
  description: 'Crea tu ruta personalizada de negocios locales',
}
```

---

### 9. Crear Componente Skeleton

```typescript
// components/ui/skeleton.tsx (NUEVO)
import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-gray-200 dark:bg-gray-700", className)}
      {...props}
    />
  )
}

// Skeletons específicos para reutilizar
function BusinessCardSkeleton() {
  return (
    <div className="p-4 border rounded-lg space-y-3">
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-16" />
      </div>
    </div>
  )
}

function MapSkeleton() {
  return <Skeleton className="w-full h-96" />
}

function ChartSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-8 w-40" />
      <Skeleton className="h-64 w-full" />
    </div>
  )
}

export { Skeleton, BusinessCardSkeleton, MapSkeleton, ChartSkeleton }
```

**Uso**:

```typescript
// En cualquier componente
import { BusinessCardSkeleton } from '@/components/ui/skeleton'

function BusinessList() {
  if (isLoading) {
    return (
      <div className="grid gap-4">
        {Array(6).fill(0).map((_, i) => (
          <BusinessCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  return businesses.map(b => <BusinessCard business={b} />)
}
```

---

### 10. Setup Pre-commit Hooks

```bash
# Instalar dependencias
npm install -D husky lint-staged prettier

# Inicializar husky
npx husky install

# Agregar pre-commit hook
npx husky add .husky/pre-commit "npx lint-staged"
```

```json
// package.json - Agregar
{
  "scripts": {
    "prepare": "husky install",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  },
  "lint-staged": {
    "*.{ts,tsx}": [
      "prettier --write"
    ],
    "*.{json,md}": [
      "prettier --write"
    ]
  }
}
```

```json
// .prettierrc (NUEVO)
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "arrowParens": "avoid"
}
```

```
# .prettierignore (NUEVO)
.next/
node_modules/
*.md
package-lock.json
.env*
```

---

## 🟢 OPCIONAL: Mejoras Adicionales

### 11. Agregar aria-labels a Botones

```typescript
// components/navbar.tsx - ACTUALIZAR
<button
  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
  aria-label="Buscar negocios"
  title="Buscar"
>
  <Search className="w-5 h-5 text-gray-600" aria-hidden="true" />
</button>

<button
  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
  aria-label="Mensajes"
  title="Mensajes"
>
  <MessageCircle className="w-5 h-5 text-gray-600" aria-hidden="true" />
</button>
```

---

### 12. Crear archivo de constantes

```typescript
// lib/constants.ts (NUEVO)
export const APP_NAME = 'Ruta Local'
export const APP_DESCRIPTION = 'Descubre Santiago auténtico con emprendimientos locales'

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  MAP: '/map',
  BUILDER: '/builder',
  PROFILE: '/profile',
  TERMS: '/terms',
  PRIVACY: '/privacy',
} as const

export const CATEGORIES = [
  'Restaurante',
  'Café',
  'Artesanía',
  'Librería',
  'Galería',
  'Tienda',
  'Bar',
  'Panadería',
] as const

export const CATEGORY_COLORS: Record<string, string> = {
  'Restaurante': 'bg-orange-100 text-orange-700 border-orange-200',
  'Café': 'bg-amber-100 text-amber-700 border-amber-200',
  'Artesanía': 'bg-purple-100 text-purple-700 border-purple-200',
  'Librería': 'bg-blue-100 text-blue-700 border-blue-200',
  'Galería': 'bg-pink-100 text-pink-700 border-pink-200',
  'Tienda': 'bg-green-100 text-green-700 border-green-200',
  'Bar': 'bg-red-100 text-red-700 border-red-200',
  'Panadería': 'bg-yellow-100 text-yellow-700 border-yellow-200',
}

export const RATING_LABELS = {
  0: 'Cualquier rating',
  3: '3+ estrellas',
  4: '4+ estrellas',
  5: '5 estrellas',
} as const

export const STORAGE_KEYS = {
  USER: 'santiago_user',
  TOKEN: 'santiago_token',
  THEME: 'santiago_theme',
} as const
```

---

## 📋 CHECKLIST DE IMPLEMENTACIÓN

Marca las que completes:

### Crítico (Hacer Hoy)
- [ ] Agregar `suppressHydrationWarning` a `app/layout.tsx`
- [ ] Eliminar o usar las fuentes Google
- [ ] Cambiar `ignoreBuildErrors: false` en `next.config.mjs`
- [ ] Habilitar optimización de imágenes
- [ ] Crear `app/error.tsx`
- [ ] Crear `app/not-found.tsx`

### Importante (Esta Semana)
- [ ] Crear `middleware.ts`
- [ ] Crear componente `Skeleton`
- [ ] Agregar metadata SEO a páginas
- [ ] Setup pre-commit hooks
- [ ] Crear `lib/constants.ts`

### Opcional (Próxima Semana)
- [ ] Agregar aria-labels
- [ ] Crear tests básicos
- [ ] Documentación adicional

---

## 🚀 ORDEN DE IMPLEMENTACIÓN SUGERIDO

### Sesión 1 (30 minutos)
1. Fix de hidratación (5 min)
2. Eliminar ignoreBuildErrors (5 min)
3. Crear error.tsx y not-found.tsx (15 min)
4. Agregar metadata básica (5 min)

### Sesión 2 (45 minutos)
1. Habilitar optimización de imágenes (10 min)
2. Crear componente Skeleton (15 min)
3. Crear lib/constants.ts (10 min)
4. Setup pre-commit hooks (10 min)

### Sesión 3 (1 hora)
1. Crear middleware.ts (20 min)
2. Agregar aria-labels (15 min)
3. Testear todo (25 min)

---

## 🔍 VERIFICACIÓN

Después de implementar, verifica:

```bash
# 1. Build sin errores
npm run build

# 2. No warnings de hidratación
npm run dev
# Abrir http://localhost:3000 y verificar consola

# 3. Metadata correcta
# Abrir DevTools > Elements > <head>
# Verificar que existan meta tags

# 4. Error boundaries funcionan
# Navegar a http://localhost:3000/ruta-que-no-existe
# Debería mostrar 404

# 5. Imágenes optimizadas
# Inspeccionar Network tab
# Las imágenes deben ser WebP
```

---

## 📞 SIGUIENTE PASO

Una vez completes estos quick fixes, continúa con el [ROADMAP.md](ROADMAP.md) completo para mejoras más profundas.

---

**Tiempo estimado total**: 2-3 horas para completar todos los quick fixes
**Impacto**: Elimina warnings, mejora UX y prepara base sólida para features
