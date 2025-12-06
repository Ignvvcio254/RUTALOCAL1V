# 🗺️ Roadmap de Mejoras - Ruta Local

Este documento contiene un análisis completo del proyecto y un plan de mejoras priorizadas.

**Última actualización**: 5 de Diciembre, 2025

---

## 📊 Resumen Ejecutivo

### Estado Actual
- ✅ Frontend funcional al 100%
- ✅ Sistema de autenticación (mock)
- ✅ UI/UX moderna y responsive
- ⚠️ Sin tests ni error handling robusto
- ⚠️ Imágenes sin optimizar
- ⚠️ Rutas sin protección

### Prioridades
1. **Semana 1**: Correcciones críticas (error boundaries, TypeScript)
2. **Semana 2-3**: Performance y UX (optimización de imágenes, refactoring)
3. **Semana 4**: Features y documentación (i18n, dark mode, tests)
4. **Ongoing**: Integración con backend Django

---

## 🎯 Mejoras por Categoría

## 1. CALIDAD DE CÓDIGO & ARQUITECTURA

### 🔴 Prioridad Alta

#### A. TypeScript & Configuración

**Problema**: Build ignora errores de TypeScript
```typescript
// next.config.mjs - LÍNEA 14
typescript: {
  ignoreBuildErrors: true,  // ❌ ELIMINAR
}
```

**Solución**:
```typescript
// next.config.mjs
typescript: {
  ignoreBuildErrors: false,  // ✅ Activar validación
}
```

**Archivos afectados**:
- [next.config.mjs](next.config.mjs#L14)

**Impacto**: 🔴 Crítico - Oculta errores en producción

---

#### B. Tipos TypeScript Faltantes

**Problema**: Muchos componentes usan tipos implícitos

**Solución**: Crear archivo de tipos compartidos

```typescript
// types/index.ts (NUEVO ARCHIVO)
export interface Business {
  id: string
  name: string
  category: string
  rating: number
  distance: number
  image: string
  isOpen: boolean
  closesAt: string
  phone: string
  lat: number
  lng: number
  priceRange: number
}

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
}

export interface Route {
  id: string
  name: string
  description: string
  businesses: Business[]
  duration: number
  distance: number
  createdAt: string
}

export interface MapFilters {
  search: string
  category: string
  rating: number
  distance: number
  isOpen: boolean
}

export interface AuthResponse {
  user: User
  token: string
  refresh?: string
}

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
  statusCode: number
}
```

**Archivos a actualizar**:
- `lib/mock-data.ts` - ✅ Ya tiene `Business`
- `contexts/auth-context.tsx` - Agregar `AuthResponse`
- `components/map/*` - Usar `MapFilters`

---

#### C. Código Duplicado & Números Mágicos

**Problema**: `app/map/page.tsx` tiene 698 líneas con código duplicado

**Solución**: Dividir en componentes más pequeños

```bash
# Crear nuevos componentes
components/map/
├── map-header.tsx          # Header con búsqueda
├── map-filters.tsx         # Panel de filtros
├── map-results.tsx         # Lista de resultados
├── map-canvas.tsx          # Mapa SVG
└── business-card.tsx       # Card reutilizable
```

**Refactoring sugerido**:

```typescript
// components/map/business-card.tsx (NUEVO)
interface BusinessCardProps {
  business: Business
  isSelected?: boolean
  onClick?: () => void
}

export function BusinessCard({ business, isSelected, onClick }: BusinessCardProps) {
  return (
    <Card className={cn("cursor-pointer", isSelected && "ring-2")}>
      {/* Contenido de la card */}
    </Card>
  )
}

// app/map/page.tsx (REFACTORIZADO)
export default function MapPage() {
  return (
    <div className="container">
      <MapHeader />
      <div className="grid grid-cols-12">
        <MapFilters />
        <MapResults businesses={filteredBusinesses} />
        <MapCanvas businesses={filteredBusinesses} />
      </div>
    </div>
  )
}
```

**Impacto**: 🟡 Alto - Mejora mantenibilidad y testabilidad

---

#### D. Custom Hooks Faltantes

**Hooks a crear**:

```typescript
// hooks/useMapFilters.ts (NUEVO)
export function useMapFilters() {
  const [filters, setFilters] = useState<MapFilters>({
    search: '',
    category: '',
    rating: 0,
    distance: 50,
    isOpen: false
  })

  const filteredBusinesses = useMemo(() => {
    return businesses.filter(business => {
      // Lógica de filtrado
    })
  }, [businesses, filters])

  return { filters, setFilters, filteredBusinesses }
}

// hooks/useRouteBuilder.ts (NUEVO)
export function useRouteBuilder() {
  const [route, setRoute] = useState<Route>({
    businesses: [],
    duration: 0,
    distance: 0
  })

  const addBusiness = (business: Business) => {
    // Lógica
  }

  const removeBusiness = (id: string) => {
    // Lógica
  }

  return { route, addBusiness, removeBusiness }
}

// hooks/usePaginatedBusinesses.ts (NUEVO)
export function usePaginatedBusinesses(businesses: Business[], pageSize = 10) {
  const [page, setPage] = useState(1)

  const paginatedResults = useMemo(() => {
    const start = (page - 1) * pageSize
    return businesses.slice(start, start + pageSize)
  }, [businesses, page, pageSize])

  return { paginatedResults, page, setPage, hasMore: page * pageSize < businesses.length }
}
```

---

### 🟡 Prioridad Media

#### E. Extraer Constantes

**Problema**: Constantes hardcodeadas en múltiples archivos

**Solución**:

```typescript
// lib/constants.ts (NUEVO)
export const CATEGORIES = [
  'Restaurante',
  'Café',
  'Artesanía',
  'Librería',
  'Galería'
] as const

export const CATEGORY_COLORS: Record<string, string> = {
  'Restaurante': 'bg-orange-100 text-orange-700',
  'Café': 'bg-amber-100 text-amber-700',
  // ...
}

export const RATING_LABELS = {
  0: 'Cualquier rating',
  3: '3+ estrellas',
  4: '4+ estrellas',
  5: '5 estrellas'
} as const

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  MAP: '/map',
  BUILDER: '/builder',
  PROFILE: '/profile'
} as const
```

---

## 2. OPTIMIZACIÓN DE PERFORMANCE

### 🔴 Prioridad Alta

#### A. Optimización de Imágenes

**Problema**: Imágenes sin optimizar
```typescript
// next.config.mjs - LÍNEA 17
images: {
  unoptimized: true,  // ❌ Desactiva optimización
}
```

**Solución**:
```typescript
// next.config.mjs
images: {
  unoptimized: false,
  remotePatterns: [
    {
      protocol: 'https',
      hostname: '**',
    }
  ],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  formats: ['image/webp', 'image/avif'],
}
```

**Archivos a actualizar**:

```typescript
// app/map/page.tsx - ANTES
<img src={business.image} alt={business.name} />

// app/map/page.tsx - DESPUÉS
import Image from 'next/image'

<Image
  src={business.image}
  alt={business.name}
  width={300}
  height={200}
  className="object-cover"
  priority={index < 3}
/>
```

**Impacto**: 🔴 Crítico - Reduce tiempo de carga en 30-50%

---

#### B. Code Splitting & Lazy Loading

**Problema**: Todos los componentes se cargan al inicio

**Solución**:

```typescript
// app/map/page.tsx
import dynamic from 'next/dynamic'

const MapCanvas = dynamic(() => import('@/components/map/map-canvas'), {
  loading: () => <MapSkeleton />,
  ssr: false // El mapa no necesita SSR
})

const BusinessDetailModal = dynamic(() => import('@/components/map/business-detail'), {
  loading: () => <Skeleton className="h-96" />
})
```

---

#### C. Memoization de Cálculos Costosos

**Problema**: Re-renderizados innecesarios

**Solución**:

```typescript
// components/dashboard/charts-section.tsx
import { useMemo } from 'react'

export function ChartsSection() {
  // ✅ Memoizar datos de gráficos
  const chartData = useMemo(() => {
    return processExpensiveData(rawData)
  }, [rawData])

  // ✅ Memoizar configuración
  const chartConfig = useMemo(() => ({
    colors: ['#8884d8', '#82ca9d'],
    dataKeys: ['uv', 'pv']
  }), [])

  return <BarChart data={chartData} />
}
```

---

### 🟡 Prioridad Media

#### D. Virtualización de Listas

**Para**: Listas de negocios en `/map`

```bash
npm install react-window
```

```typescript
// components/map/map-results.tsx
import { FixedSizeList } from 'react-window'

export function MapResults({ businesses }: { businesses: Business[] }) {
  const Row = ({ index, style }: { index: number, style: React.CSSProperties }) => (
    <div style={style}>
      <BusinessCard business={businesses[index]} />
    </div>
  )

  return (
    <FixedSizeList
      height={600}
      itemCount={businesses.length}
      itemSize={120}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  )
}
```

---

## 3. EXPERIENCIA DE USUARIO (UX)

### 🔴 Prioridad Alta

#### A. Error Boundaries

**Problema**: No hay manejo de errores global

**Solución**: Crear páginas de error

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
    console.error('Error boundary:', error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">¡Algo salió mal!</h2>
        <p className="text-gray-600 mb-6">{error.message}</p>
        <Button onClick={reset}>Intentar de nuevo</Button>
      </div>
    </div>
  )
}

// app/not-found.tsx (NUEVO)
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-gray-600 mb-6">Página no encontrada</p>
      <Link href="/">
        <Button>Volver al inicio</Button>
      </Link>
    </div>
  )
}

// app/loading.tsx (NUEVO)
export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600" />
    </div>
  )
}
```

**Impacto**: 🔴 Crítico - Mejora la experiencia en caso de errores

---

#### B. Loading States & Skeletons

**Problema**: No hay estados de carga visuales

**Solución**:

```typescript
// components/ui/skeleton.tsx (NUEVO)
import { cn } from "@/lib/utils"

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-gray-200", className)}
      {...props}
    />
  )
}

// Skeletons específicos
export function BusinessCardSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  )
}

export function MapSkeleton() {
  return <Skeleton className="h-96 w-full" />
}

// Uso en components
import { BusinessCardSkeleton } from '@/components/ui/skeleton'

function BusinessList() {
  if (isLoading) {
    return Array(6).fill(0).map((_, i) => <BusinessCardSkeleton key={i} />)
  }

  return businesses.map(b => <BusinessCard business={b} />)
}
```

---

#### C. Validación de Formularios con Zod

**Problema**: Validación básica y manual

**Solución**:

```bash
npm install zod react-hook-form @hookform/resolvers
```

```typescript
// lib/validations.ts (NUEVO)
import { z } from 'zod'

export const LoginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres')
})

export const RegisterSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string()
    .min(8, 'Mínimo 8 caracteres')
    .regex(/[a-z]/, 'Debe contener minúsculas')
    .regex(/[A-Z]/, 'Debe contener mayúsculas')
    .regex(/[0-9]/, 'Debe contener números'),
  confirmPassword: z.string(),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'Debes aceptar los términos'
  })
}).refine(data => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword']
})

export type LoginFormData = z.infer<typeof LoginSchema>
export type RegisterFormData = z.infer<typeof RegisterSchema>
```

```typescript
// app/login/page.tsx - REFACTORIZADO
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoginSchema, type LoginFormData } from '@/lib/validations'

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema)
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password)
    } catch (error) {
      toast({ title: "Error", description: error.message })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input {...register('email')} />
      {errors.email && <span className="text-red-500">{errors.email.message}</span>}

      <Input {...register('password')} type="password" />
      {errors.password && <span className="text-red-500">{errors.password.message}</span>}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Ingresando...' : 'Iniciar Sesión'}
      </Button>
    </form>
  )
}
```

---

#### D. Accesibilidad (a11y)

**Mejoras necesarias**:

```typescript
// components/navbar.tsx - ANTES
<button className="p-2">
  <Search className="w-5 h-5" />
</button>

// components/navbar.tsx - DESPUÉS
<button
  className="p-2"
  aria-label="Buscar negocios"
  title="Buscar"
>
  <Search className="w-5 h-5" aria-hidden="true" />
</button>

// Agregar roles a secciones
<nav role="navigation" aria-label="Navegación principal">
  {/* contenido */}
</nav>

<main role="main">
  {/* contenido */}
</main>

<footer role="contentinfo">
  {/* contenido */}
</footer>

// Alt text en imágenes
<Image
  src={business.image}
  alt={`${business.name} - ${business.category} en ${business.location}`}
/>
```

---

### 🟡 Prioridad Media

#### E. Páginas Faltantes

**Crear**:

```bash
# Estructura de páginas nuevas
app/
├── profile/
│   └── page.tsx          # Perfil de usuario
├── forgot-password/
│   └── page.tsx          # Recuperar contraseña
├── terms/
│   └── page.tsx          # Términos y condiciones
└── privacy/
    └── page.tsx          # Política de privacidad
```

```typescript
// app/profile/page.tsx (NUEVO)
'use client'

import { useAuth } from '@/contexts/auth-context'

export default function ProfilePage() {
  const { user } = useAuth()

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Mi Perfil</h1>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Información Personal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label>Nombre</Label>
                <Input value={user?.name} />
              </div>
              <div>
                <Label>Email</Label>
                <Input value={user?.email} disabled />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mis Rutas Guardadas</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Lista de rutas */}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
```

---

## 4. FEATURES & FUNCIONALIDAD

### 🔴 Prioridad Alta

#### A. Middleware para Rutas Protegidas

**Problema**: Cualquiera puede acceder a `/dashboard`, `/builder`, etc.

**Solución**:

```typescript
// middleware.ts (NUEVO EN RAÍZ)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedRoutes = ['/dashboard', '/builder', '/profile']
const authRoutes = ['/login', '/register']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('santiago_token')?.value

  // Si intenta acceder a ruta protegida sin token
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!token) {
      const url = new URL('/login', request.url)
      url.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(url)
    }
  }

  // Si tiene token y intenta ir a login/register
  if (authRoutes.some(route => pathname.startsWith(route))) {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
```

**Impacto**: 🔴 Crítico - Seguridad básica

---

#### B. Metadata SEO en Cada Página

**Problema**: Sin metadatos para SEO

**Solución**:

```typescript
// app/map/page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mapa de Negocios - Ruta Local',
  description: 'Descubre negocios locales auténticos en Santiago de Chile. Explora el mapa interactivo.',
  openGraph: {
    title: 'Mapa de Negocios - Ruta Local',
    description: 'Descubre negocios locales auténticos en Santiago',
    images: [{ url: '/og-map.jpg' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mapa de Negocios - Ruta Local',
    description: 'Descubre negocios locales auténticos en Santiago',
  }
}

// app/dashboard/page.tsx
export const metadata: Metadata = {
  title: 'Dashboard - Ruta Local',
  description: 'Gestiona tus rutas y descubre estadísticas de tus recorridos',
  robots: {
    index: false, // Dashboard no debe indexarse
    follow: false
  }
}
```

---

### 🟡 Prioridad Media

#### C. Internacionalización (i18n)

**Instalar**:
```bash
npm install next-intl
```

**Configuración**:

```typescript
// i18n.ts (NUEVO)
import { getRequestConfig } from 'next-intl/server'

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`./locales/${locale}.json`)).default
}))

// locales/es.json (NUEVO)
{
  "nav": {
    "home": "Inicio",
    "map": "Mapa",
    "dashboard": "Panel",
    "login": "Iniciar Sesión"
  },
  "auth": {
    "login": {
      "title": "Iniciar Sesión",
      "email": "Email",
      "password": "Contraseña",
      "submit": "Ingresar"
    }
  }
}

// locales/en.json (NUEVO)
{
  "nav": {
    "home": "Home",
    "map": "Map",
    "dashboard": "Dashboard",
    "login": "Login"
  },
  "auth": {
    "login": {
      "title": "Login",
      "email": "Email",
      "password": "Password",
      "submit": "Sign In"
    }
  }
}

// Uso en componentes
import { useTranslations } from 'next-intl'

export function Navbar() {
  const t = useTranslations('nav')

  return (
    <nav>
      <Link href="/">{t('home')}</Link>
      <Link href="/map">{t('map')}</Link>
    </nav>
  )
}
```

---

#### D. Dark Mode

**Problema**: ThemeProvider existe pero no se usa

**Solución**:

```typescript
// app/layout.tsx
import { ThemeProvider } from '@/components/theme-provider'

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

// components/theme-toggle.tsx (NUEVO)
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  )
}

// Agregar a navbar
import { ThemeToggle } from '@/components/theme-toggle'

export function Navbar() {
  return (
    <nav>
      {/* ... */}
      <ThemeToggle />
    </nav>
  )
}

// Actualizar Tailwind CSS
// tailwind.config.ts
export default {
  darkMode: ["class"],
  // ...
}

// Agregar estilos dark en componentes
<Card className="bg-white dark:bg-gray-800">
  <CardTitle className="text-gray-900 dark:text-gray-100">
```

---

## 5. TESTING & CALIDAD

### 🔴 Prioridad Alta

#### A. Configuración de Tests

**Instalar dependencias**:
```bash
npm install -D jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom
```

**Configuración**:

```javascript
// jest.config.js (NUEVO)
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  collectCoverageFrom: [
    'components/**/*.{js,jsx,ts,tsx}',
    'app/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
}

module.exports = createJestConfig(customJestConfig)

// jest.setup.js (NUEVO)
import '@testing-library/jest-dom'

// package.json - Agregar scripts
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

**Tests de ejemplo**:

```typescript
// components/__tests__/navbar.test.tsx (NUEVO)
import { render, screen } from '@testing-library/react'
import { Navbar } from '../navbar'
import { AuthProvider } from '@/contexts/auth-context'

describe('Navbar', () => {
  it('renders login link when not authenticated', () => {
    render(
      <AuthProvider>
        <Navbar />
      </AuthProvider>
    )
    expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument()
  })

  it('renders user avatar when authenticated', () => {
    // Mock AuthContext
  })
})

// lib/__tests__/env.test.ts (NUEVO)
import { env } from '../env'

describe('Environment Variables', () => {
  it('should have API URL', () => {
    expect(env.apiUrl).toBeDefined()
  })

  it('should construct API endpoint correctly', () => {
    expect(env.apiEndpoint).toContain('/api')
  })
})

// contexts/__tests__/auth-context.test.tsx (NUEVO)
import { renderHook, act } from '@testing-library/react'
import { useAuth } from '../auth-context'

describe('useAuth', () => {
  it('should login successfully', async () => {
    const { result } = renderHook(() => useAuth())

    await act(async () => {
      await result.current.login('test@test.com', 'password')
    })

    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.user).toBeDefined()
  })
})
```

---

#### B. Tests E2E con Playwright

```bash
npm install -D @playwright/test
npx playwright install
```

```typescript
// e2e/login.spec.ts (NUEVO)
import { test, expect } from '@playwright/test'

test('should login successfully', async ({ page }) => {
  await page.goto('/login')

  await page.fill('[name="email"]', 'test@test.com')
  await page.fill('[name="password"]', 'password123')
  await page.click('button[type="submit"]')

  await expect(page).toHaveURL('/dashboard')
  await expect(page.locator('nav')).toContainText('test@test.com')
})

test('should show error for invalid credentials', async ({ page }) => {
  await page.goto('/login')

  await page.fill('[name="email"]', 'invalid@test.com')
  await page.fill('[name="password"]', 'wrong')
  await page.click('button[type="submit"]')

  await expect(page.locator('.toast')).toContainText('Error')
})
```

---

## 6. DEVELOPER EXPERIENCE

### 🔴 Prioridad Alta

#### A. Pre-commit Hooks

```bash
npm install -D husky lint-staged
npx husky install
npx husky add .husky/pre-commit "npx lint-staged"
```

```json
// package.json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md}": [
      "prettier --write"
    ]
  }
}
```

---

#### B. Prettier Configuración

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

// .prettierignore (NUEVO)
.next/
node_modules/
*.md
package-lock.json
```

---

#### C. VS Code Settings

```json
// .vscode/settings.json (NUEVO)
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "typescript.preferences.importModuleSpecifier": "non-relative"
}

// .vscode/extensions.json (NUEVO)
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "ms-playwright.playwright"
  ]
}
```

---

## 📋 PLAN DE IMPLEMENTACIÓN

### 🚀 Fase 1: Correcciones Críticas (Semana 1)

**Día 1-2: Error Handling**
- [ ] Crear `app/error.tsx`
- [ ] Crear `app/not-found.tsx`
- [ ] Crear `app/loading.tsx`
- [ ] Agregar error boundaries en rutas principales

**Día 3-4: TypeScript & Configuración**
- [ ] Eliminar `ignoreBuildErrors: true`
- [ ] Crear `types/index.ts`
- [ ] Corregir todos los errores de TypeScript
- [ ] Configurar pre-commit hooks

**Día 5-7: Páginas Faltantes**
- [ ] Crear `app/forgot-password/page.tsx`
- [ ] Crear `app/profile/page.tsx`
- [ ] Crear `app/terms/page.tsx`
- [ ] Crear `app/privacy/page.tsx`
- [ ] Crear `middleware.ts` para rutas protegidas

---

### ⚡ Fase 2: Performance & UX (Semana 2-3)

**Semana 2**
- [ ] Habilitar optimización de imágenes
- [ ] Convertir `<img>` a `<Image>`
- [ ] Crear componente Skeleton
- [ ] Agregar loading states
- [ ] Implementar validación con Zod

**Semana 3**
- [ ] Refactorizar `/map/page.tsx`
- [ ] Crear custom hooks (useMapFilters, useRouteBuilder)
- [ ] Agregar memoization
- [ ] Implementar code splitting
- [ ] Mejorar accesibilidad (a11y)

---

### 🎨 Fase 3: Features & Documentación (Semana 4)

**Días 1-3: Features**
- [ ] Setup i18n con next-intl
- [ ] Implementar dark mode
- [ ] Agregar metadata SEO a todas las páginas
- [ ] Crear extraer constantes a `lib/constants.ts`

**Días 4-7: Tests & Docs**
- [ ] Configurar Jest
- [ ] Escribir tests unitarios (componentes, hooks)
- [ ] Configurar Playwright
- [ ] Escribir tests E2E
- [ ] Documentación completa

---

### 🔗 Fase 4: Backend Integration (Ongoing)

**Cuando el backend esté listo**
- [ ] Reemplazar mock en `auth-context.tsx`
- [ ] Conectar todos los endpoints
- [ ] Implementar OAuth real
- [ ] Manejar refresh tokens
- [ ] Tests de integración

---

## 🎯 QUICK WINS (Implementar Hoy)

### ✅ Tareas de 5 minutos
1. Eliminar `ignoreBuildErrors: true` de `next.config.mjs`
2. Crear `app/not-found.tsx`
3. Agregar aria-labels a botones del navbar
4. Crear `.prettierrc`

### ✅ Tareas de 15 minutos
1. Crear `app/error.tsx`
2. Crear `types/index.ts`
3. Setup pre-commit hooks
4. Crear `middleware.ts` básico

### ✅ Tareas de 30 minutos
1. Implementar validación Zod en login
2. Crear componente Skeleton
3. Agregar metadata a 3 páginas principales
4. Refactorizar constantes a archivo separado

---

## 📊 MÉTRICAS DE ÉXITO

### Antes de Mejoras
- **TypeScript Errors**: Ocultos con `ignoreBuildErrors`
- **Test Coverage**: 0%
- **Lighthouse Performance**: ~65
- **Bundle Size**: ~500KB
- **Time to Interactive**: ~3.5s

### Después de Mejoras (Objetivo)
- **TypeScript Errors**: 0
- **Test Coverage**: >80%
- **Lighthouse Performance**: >90
- **Bundle Size**: <300KB
- **Time to Interactive**: <2s

---

## 🔗 RECURSOS

### Documentación
- [Next.js Docs](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright](https://playwright.dev/docs/intro)

### Tutoriales
- [Next.js i18n](https://next-intl-docs.vercel.app/)
- [Zod Validation](https://zod.dev/)
- [Accessibility (a11y)](https://www.a11yproject.com/)

---

**Última actualización**: 5 de Diciembre, 2025
**Próxima revisión**: 12 de Diciembre, 2025
